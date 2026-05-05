/**
 * Хранилище обращений в PostgreSQL (схема app.* — словари + appeal_card).
 */

function nowIso() {
  return new Date().toISOString()
}

function ruShort(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

/** Нормализация jsonb → объект DTO для JSON-ответа */
function normalizeDto(raw) {
  const d = typeof raw === "object" && raw !== null ? { ...raw } : {}
  if (d.updatedAt != null && typeof d.updatedAt === "object" && d.updatedAt instanceof Date) {
    d.updatedAt = d.updatedAt.toISOString()
  }
  return d
}

function statusToResponsibleCode(status) {
  const m = {
    "В работе": "IN_PROGRESS",
    "Назначено": "NOT_ASSIGNED",
    "На ответственном, не взято": "NOT_ASSIGNED",
    "На ответственном, взято": "ASSIGNED",
    "На БП": "ON_BP",
    "Запрос в БП": "ON_BP",
    "На ПК": "ON_PK",
    "На HD": "ON_HD",
    "Готово к подписи": "IN_PROGRESS",
  }
  return m[status] ?? "IN_PROGRESS"
}

/**
 * Коды app.dict_appeal_status (02 + 05-dict-cabinet-statuses.sql) для колонки status_code (FK).
 * БД без миграции 05: неизвестный статус сводится к «В работе».
 */
const DICT_APPEAL_STATUS_CODES = new Set([
  "В работе",
  "На ответственном, не взято",
  "На ответственном, взято",
  "На БП",
  "На ПК",
  "На HD",
  "На аудите",
  "Аудит",
  "Решено",
  "Назначено",
  "Запрос в БП",
  "Готово к подписи",
  "Зарегистрировано",
])

export function mapAppealUiStatusToDictCode(uiStatus) {
  const s = typeof uiStatus === "string" ? uiStatus.trim() : ""
  if (!s) return "В работе"
  if (DICT_APPEAL_STATUS_CODES.has(s)) return s
  return "В работе"
}

export async function pgListAppealsDto(pool) {
  const { rows } = await pool.query(
    `SELECT id, status_code, data FROM app.appeal_card ORDER BY updated_at DESC`,
  )
  return rows.map((r) => {
    const d = normalizeDto(r.data)
    d.id = d.id ?? r.id
    d.status = d.status ?? r.status_code
    return d
  })
}

export async function pgFindAppeal(pool, id) {
  const { rows } = await pool.query(
    `SELECT id, status_code, data FROM app.appeal_card WHERE id = $1`,
    [String(id)],
  )
  if (!rows[0]) return undefined
  const d = normalizeDto(rows[0].data)
  d.id = d.id ?? rows[0].id
  d.status = d.status ?? rows[0].status_code
  return d
}

async function nextNumericAppealId(pool) {
  const { rows } = await pool.query(`
    SELECT COALESCE(MAX(CASE WHEN id ~ '^[0-9]+$' THEN id::bigint END), 100002) + 1 AS n
    FROM app.appeal_card
  `)
  return String(rows[0].n)
}

const RESPONSIBLE_CABINET_STATUSES_PG = new Set([
  "Назначено",
  "На ответственном, взято",
  "Запрос в БП",
  "Готово к подписи",
])

export async function pgAddAppealFromV1Create(pool, body) {
  const id = await nextNumericAppealId(pool)
  const rawAppealType =
    typeof body.appealType === "string" && body.appealType.trim()
      ? body.appealType.trim()
      : typeof body.category === "string" && /уст|регулятор|письм/i.test(body.category)
        ? body.category
        : "Письменное"
  const categoryForUi =
    rawAppealType === "Устное" || /уст/i.test(rawAppealType)
      ? "Устное"
      : rawAppealType === "Регулятор" || /регулятор/i.test(rawAppealType)
        ? "Регулятор"
        : "Письменное"

  const respRaw =
    typeof body.responsible === "string" && body.responsible.trim()
      ? body.responsible.trim()
      : "Не назначено"
  const responsible = !respRaw || respRaw === "Не назначено" ? "Не назначено" : respRaw

  const statusFromClient =
    typeof body.status === "string" && body.status.trim() ? body.status.trim() : ""
  const status =
    statusFromClient && RESPONSIBLE_CABINET_STATUSES_PG.has(statusFromClient)
      ? statusFromClient
      : responsible !== "Не назначено"
        ? "На ответственном, взято"
        : "Назначено"

  const deadlineStr =
    typeof body.deadline === "string" && body.deadline.trim()
      ? body.deadline.trim()
      : ruShort(new Date(Date.now() + 864e5 * 15).toISOString())

  const applicantCat = body.applicantCategory ?? body.type
  const typeNorm = applicantCat === "Юр лицо" || applicantCat === "Юрлицо" ? "Юр лицо" : "Физ лицо"

  const dto = {
    id,
    number: id,
    regDate: ruShort(nowIso()),
    category: categoryForUi,
    subcategory: typeof body.category === "string" ? body.category : "Общее",
    status,
    deadline: deadlineStr,
    responsible,
    applicantName: body.applicantName ?? "—",
    organizationName: body.organizationName ?? "N/A",
    address: "",
    cbs: "N/A",
    type: typeNorm,
    isMine: false,
    content: String(body.content ?? ""),
    solution: "",
    response: "",
    phone: body.phone ?? "",
    email: body.email ?? "",
    appealType: categoryForUi,
    createdBy: typeof body.createdBy === "string" ? body.createdBy : "api",
    updatedAt: nowIso(),
  }
  const statusCode = mapAppealUiStatusToDictCode(status)
  await pool.query(
    `INSERT INTO app.appeal_card (id, status_code, data, updated_at) VALUES ($1, $2, $3::jsonb, now())`,
    [id, statusCode, JSON.stringify(dto)],
  )
  await pgAppendNotification(pool, {
    id: `n-${id}-${Date.now()}`,
    type: "new_written_appeal",
    title: `Зарегистрировано обращение ${id}`,
  })
  return dto
}

export async function pgPatchAppeal(pool, id, patch) {
  const cur = await pgFindAppeal(pool, id)
  if (!cur) return null
  const merged = { ...cur, ...patch, updatedAt: nowIso() }
  const status = merged.status ?? cur.status
  const statusCode = mapAppealUiStatusToDictCode(status)
  await pool.query(
    `UPDATE app.appeal_card SET data = $2::jsonb, status_code = $3, updated_at = now() WHERE id = $1`,
    [String(id), JSON.stringify(merged), statusCode],
  )
  return merged
}

export async function pgDeleteAppeal(pool, id) {
  const r = await pool.query(`DELETE FROM app.appeal_card WHERE id = $1`, [String(id)])
  return r.rowCount > 0
}

export async function pgListLegacySpringPage(pool, page, size, search) {
  let rows = await pgListAppealsDto(pool)
  if (search) {
    const q = search.toLowerCase()
    rows = rows.filter(
      (a) =>
        String(a.applicantName).toLowerCase().includes(q) ||
        String(a.organizationName).toLowerCase().includes(q) ||
        String(a.id).includes(q),
    )
  }
  const start = page * size
  const slice = rows.slice(start, start + size)
  const content = slice.map((a) => ({
    id: a.id,
    number: a.id,
    regDate: a.updatedAt?.split("T")[0] ?? new Date().toISOString().split("T")[0],
    deadline: new Date(Date.now() + 864e5 * 10).toISOString().split("T")[0],
    appealType: a.category ?? "Письменное",
    status: a.status ?? "Зарегистрировано",
    applicantCategory: a.type === "Юр лицо" ? "Юр лицо" : "Физ лицо",
    applicantName: a.type === "Юр лицо" ? null : a.applicantName,
    organizationName: a.type === "Юр лицо" ? a.organizationName : null,
    responsible: a.responsible,
    priority: "NORMAL",
    requiresAttention: false,
    requiresSignature: false,
    auditStatus: "NONE",
    appealCategory: a.subcategory ?? null,
  }))
  return {
    content,
    totalElements: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / size)),
    number: page,
    size,
  }
}

export async function pgCreateLegacyFromBody(pool, body) {
  const dto = await pgAddAppealFromV1Create(pool, {
    content: body.content ?? body.appealCategory ?? "",
    category: body.category ?? body.appealCategory,
    applicantName: body.applicantName,
    organizationName: body.organizationName,
    type: body.applicantCategory ?? body.type,
    phone: body.phone,
    email: body.email,
    responsible: body.responsible,
    appealType: body.appealType,
    deadline: body.deadline,
    status: body.status,
    createdBy: body.createdBy,
  })
  return { id: dto.id, number: dto.number ?? dto.id }
}

export async function pgListByCabinet(pool, cabinet) {
  let sql = `
    SELECT c.data, c.status_code
    FROM app.appeal_card c
    JOIN app.dict_appeal_status s ON s.code = c.status_code
    WHERE 1=1`
  const params = []
  if (cabinet === "responsible") {
    sql += ` AND 'responsible' = ANY(s.cabinets)`
  } else if (cabinet === "audit") {
    sql += ` AND 'audit' = ANY(s.cabinets)`
  } else if (cabinet === "secretary") {
    sql += ` AND c.status_code = 'На ПК'`
  } else if (cabinet === "manager") {
    sql += ` AND 'manager' = ANY(s.cabinets)`
  }
  sql += ` ORDER BY c.updated_at DESC`
  const { rows } = await pool.query(sql, params)
  return rows.map((r) => {
    const d = normalizeDto(r.data)
    d.status = d.status ?? r.status_code
    return d
  })
}

export async function pgResponsibleList(pool) {
  const dtos = await pgListByCabinet(pool, "responsible")
  return {
    items: dtos.map((a) => ({
      id: a.id,
      publicNumber: a.id,
      title: (a.content && String(a.content).slice(0, 120)) || a.applicantName || "—",
      categoryCode: "GENERAL",
      statusCode: statusToResponsibleCode(a.status),
      priorityCode: "NORMAL",
      updatedAt: a.updatedAt ?? nowIso(),
      slaDueAt: new Date(Date.now() + 864e5 * 5).toISOString(),
      flags: { overdue: false },
    })),
    nextCursor: null,
  }
}

export async function pgAuditAppealsPage(pool) {
  const items = await pgListByCabinet(pool, "audit")
  return { items, page: 0, size: Math.max(50, items.length) }
}

export async function pgSecretaryAppeals(pool, statusFilter = "На ПК") {
  const { rows } = await pool.query(
    `SELECT c.data, c.status_code FROM app.appeal_card c WHERE c.status_code = $1 ORDER BY c.updated_at DESC`,
    [statusFilter],
  )
  const items = rows.map((r) => {
    const d = normalizeDto(r.data)
    d.status = d.status ?? r.status_code
    return d
  })
  return { items, filter: { status: statusFilter } }
}

export async function pgManagerDashboard(pool) {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE status_code NOT IN ('Решено')) AS open_appeals,
      COUNT(*) FILTER (WHERE status_code IN ('На аудите', 'Аудит', 'На БП')) AS at_risk,
      COUNT(*) FILTER (WHERE updated_at >= date_trunc('month', now()) AND status_code = 'Решено') AS closed_month
    FROM app.appeal_card
  `)
  const r = rows[0] || {}
  return {
    openAppeals: Number(r.open_appeals ?? 0),
    atRisk: Number(r.at_risk ?? 0),
    closedThisMonth: Number(r.closed_month ?? 0),
  }
}

export async function pgRegistrarMonthStats(pool) {
  const { rows } = await pool.query(`
    SELECT COUNT(*)::int AS total FROM app.appeal_card
    WHERE updated_at >= date_trunc('month', now())
  `)
  const total = rows[0]?.total ?? 0
  return { withoutErrors: Math.max(0, total - 2), withErrors: 2, total }
}

export async function pgAppendEvent(pool, appealId, { actor, action, details = {} }) {
  await pool.query(
    `INSERT INTO app.event_log (appeal_id, actor, action, details) VALUES ($1, $2, $3, $4::jsonb)`,
    [String(appealId), actor ?? "api", action, JSON.stringify(details)],
  )
}

export async function pgListAuditLog(pool, appealId) {
  const { rows } = await pool.query(
    `SELECT id::text, at, actor, action, details FROM app.event_log WHERE appeal_id = $1 ORDER BY at DESC`,
    [String(appealId)],
  )
  return {
    appealId: String(appealId),
    entries: rows.map((r) => ({
      id: r.id,
      at: r.at instanceof Date ? r.at.toISOString() : String(r.at),
      actor: r.actor,
      action: r.action,
      details:
        r.details == null
          ? ""
          : typeof r.details === "object"
            ? JSON.stringify(r.details)
            : String(r.details),
    })),
  }
}

export async function pgManagerAppealsSearch(pool, q, page, size) {
  const all = await pgListAppealsDto(pool)
  let rows = all
  if (q && String(q).trim()) {
    const low = String(q).toLowerCase()
    rows = rows.filter(
      (a) =>
        String(a.applicantName).toLowerCase().includes(low) ||
        String(a.organizationName).toLowerCase().includes(low) ||
        String(a.id).toLowerCase().includes(low),
    )
  }
  const slice = rows.slice(page * size, page * size + size)
  return {
    items: slice,
    page,
    size,
    totalElements: rows.length,
    totalPages: Math.max(1, Math.ceil(rows.length / size)),
  }
}

export async function pgAssignResponsible(pool, appealId, body) {
  const userName = body.userName ?? body.responsibleName ?? "Назначенный специалист"
  await pgAppendEvent(pool, appealId, {
    actor: "manager",
    action: "ASSIGN_RESPONSIBLE",
    details: { userName, uc: "UC-RU-03", fr: "FR-14.1" },
  })
  return pgPatchAppeal(pool, appealId, { responsible: userName })
}

export async function pgSecretaryDecision(pool, appealId, body) {
  const decision = String(body.decision ?? "").toUpperCase()
  const comment = String(body.comment ?? "")
  await pgAppendEvent(pool, appealId, {
    actor: "secretary",
    action: `PK_${decision}`,
    details: { comment, uc: "ПК / FR-02", fr: "FR-02.1" },
  })
  const nextStatus = decision === "APPROVE" ? "В работе" : "На ответственном, не взято"
  return pgPatchAppeal(pool, appealId, { status: nextStatus })
}

export async function pgAuditTakeWork(pool, appealId) {
  await pgAppendEvent(pool, appealId, {
    actor: "auditor",
    action: "TAKE_WORK",
    details: { uc: "UC-AU.01", fr: "FR-13.1" },
  })
  return pgPatchAppeal(pool, appealId, { responsible: "Аудитор (в работе)", status: "На аудите" })
}

export async function pgAuditDecline(pool, appealId, body) {
  const reason = String(body.reason ?? body.comment ?? "")
  await pgAppendEvent(pool, appealId, {
    actor: "auditor",
    action: "DECLINE",
    details: { reason, uc: "UC-AU.02", fr: "FR-13.2" },
  })
  return pgPatchAppeal(pool, appealId, { status: "В работе", responsible: "Не назначено" })
}

export async function pgAuditPublish(pool, appealId, body) {
  const templateId = body.templateId != null ? String(body.templateId) : ""
  const comment = String(body.comment ?? "")
  await pgAppendEvent(pool, appealId, {
    actor: "auditor",
    action: "PUBLISH_AUDIT",
    details: { templateId, comment, uc: "UC-AU.03", fr: "FR-13.3" },
  })
  return pgPatchAppeal(pool, appealId, { status: "Решено" })
}

async function pgAppendNotification(pool, { id, type, title, userSub = "default" }) {
  await pool.query(
    `INSERT INTO app.notification (id, user_sub, type, title, read) VALUES ($1, $2, $3, $4, false)
     ON CONFLICT (id) DO NOTHING`,
    [id, userSub, type, title],
  )
}

export async function pgListNotifications(pool, userSub = "default") {
  const { rows } = await pool.query(
    `SELECT id, type, title, read, created_at FROM app.notification WHERE user_sub = $1 ORDER BY created_at DESC LIMIT 200`,
    [userSub],
  )
  return {
    items: rows.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      read: r.read === true,
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    })),
  }
}

export async function pgMarkNotificationRead(pool, id, userSub = "default") {
  const { rows } = await pool.query(
    `UPDATE app.notification SET read = true WHERE id = $1 AND user_sub = $2 RETURNING id, read`,
    [String(id), userSub],
  )
  if (!rows[0]) return null
  return { id: rows[0].id, read: rows[0].read === true }
}

export async function pgSearchClients(pool, name, inn) {
  const qName = (name ?? "").trim().toLowerCase()
  const qInn = (inn ?? "").trim()
  const { rows } = await pool.query(`SELECT id, name, inn, phone, type FROM app.crm_client`)
  const hits = []
  for (const c of rows) {
    let score = 0
    if (qInn && c.inn && String(c.inn).includes(qInn)) score = 0.99
    else if (qName && String(c.name).toLowerCase().includes(qName)) score = 0.85
    else if (qName && String(c.phone).includes(qName)) score = 0.7
    if (score > 0) {
      hits.push({
        id: c.id,
        name: c.name,
        inn: c.inn || "—",
        phone: c.phone,
        type: c.type,
        matchScore: score,
      })
    }
  }
  hits.sort((a, b) => b.matchScore - a.matchScore)
  return { hits }
}

export async function pgCreateClient(pool, body) {
  const id = `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const name = String(body.name ?? "").trim() || "Без имени"
  const inn = String(body.inn ?? "").trim()
  const phone = String(body.phone ?? "").trim()
  const type = body.type === "organization" ? "organization" : "individual"
  await pool.query(
    `INSERT INTO app.crm_client (id, name, inn, phone, type) VALUES ($1, $2, $3, $4, $5)`,
    [id, name, inn, phone, type],
  )
  return { id, name, inn, phone, type, matchScore: 1 }
}

export async function pgAppealTimeline(pool, appealId) {
  const { rows } = await pool.query(
    `SELECT id::text, at, actor, action, details FROM app.event_log WHERE appeal_id = $1 ORDER BY at DESC`,
    [String(appealId)],
  )
  return {
    items: rows.map((r) => {
      let payload = {}
      if (r.details != null && typeof r.details === "object") payload = { ...r.details }
      else if (typeof r.details === "string" && r.details) {
        try {
          payload = JSON.parse(r.details)
        } catch {
          payload = { raw: r.details }
        }
      }
      return {
        id: r.id,
        type: r.action,
        actorId: r.actor,
        createdAt: r.at instanceof Date ? r.at.toISOString() : String(r.at),
        payload,
      }
    }),
    nextCursor: null,
  }
}

export async function pgResponsibleAppealDetail(pool, appealId) {
  const header = await pgFindAppeal(pool, appealId)
  if (!header) return null
  const { rows } = await pool.query(
    `SELECT action, actor, at, details FROM app.event_log WHERE appeal_id = $1 ORDER BY at DESC LIMIT 8`,
    [String(appealId)],
  )
  const actionsPreview = rows.map((r) => ({
    action: r.action,
    actor: r.actor,
    at: r.at instanceof Date ? r.at.toISOString() : String(r.at),
    details: r.details,
  }))
  return { header, actionsPreview, attachments: [] }
}

export async function pgResponsiblePostAction(pool, appealId, body) {
  const cur = await pgFindAppeal(pool, appealId)
  if (!cur) return null
  const type = String(body?.type ?? "")
  const payload = body?.payload && typeof body.payload === "object" ? body.payload : {}
  await pgAppendEvent(pool, appealId, { actor: "responsible", action: type, details: payload })
  switch (type) {
    case "ACCEPT":
      return pgPatchAppeal(pool, appealId, { status: "На ответственном, взято", isMine: true })
    case "RETURN_TO_POOL":
      return pgPatchAppeal(pool, appealId, { status: "На ответственном, не взято", responsible: "Не назначено" })
    case "RESOLVE":
      return pgPatchAppeal(pool, appealId, { status: "Решено" })
    case "ESCALATE":
      return pgPatchAppeal(pool, appealId, { status: "На HD" })
    case "REQUEST_INFO":
      return pgPatchAppeal(pool, appealId, { ...payload })
    default:
      return pgFindAppeal(pool, appealId)
  }
}

export async function pgPrepareAttachmentUpload(pool, appealId, body) {
  const a = await pgFindAppeal(pool, appealId)
  if (!a) return null
  const attId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  await pool.query(
    `INSERT INTO app.attachment_prepare (id, appeal_id, file_name, mime_type, byte_size) VALUES ($1, $2, $3, $4, $5)`,
    [
      attId,
      String(appealId),
      body?.fileName != null ? String(body.fileName) : null,
      body?.mimeType != null ? String(body.mimeType) : null,
      body?.byteSize != null ? Number(body.byteSize) : null,
    ],
  )
  await pgAppendEvent(pool, appealId, {
    actor: "responsible",
    action: "PREPARE_UPLOAD",
    details: { attachmentId: attId, fileName: body?.fileName },
  })
  return {
    uploadUrl: "https://storage.example/presigned-mock",
    expiresAt: new Date(Date.now() + 3600e3).toISOString(),
    attachmentId: attId,
  }
}
