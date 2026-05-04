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
    "На ответственном, не взято": "NOT_ASSIGNED",
    "На ответственном, взято": "ASSIGNED",
    "На БП": "ON_BP",
    "На ПК": "ON_PK",
    "На HD": "ON_HD",
  }
  return m[status] ?? "IN_PROGRESS"
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

export async function pgAddAppealFromV1Create(pool, body) {
  const id = await nextNumericAppealId(pool)
  const dto = {
    id,
    regDate: ruShort(nowIso()),
    category: "Письменное",
    subcategory: typeof body.category === "string" ? body.category : "Общее",
    status: "В работе",
    deadline: ruShort(new Date(Date.now() + 864e5 * 15).toISOString()),
    responsible: "Не назначено",
    applicantName: body.applicantName ?? "—",
    organizationName: body.organizationName ?? "N/A",
    address: "",
    cbs: "N/A",
    type: body.type === "Юр лицо" || body.type === "Юрлицо" ? "Юр лицо" : "Физ лицо",
    isMine: false,
    content: String(body.content ?? ""),
    solution: "",
    response: "",
    phone: body.phone ?? "",
    email: body.email ?? "",
    appealType: "Письменное",
    createdBy: "api",
    updatedAt: nowIso(),
  }
  await pool.query(
    `INSERT INTO app.appeal_card (id, status_code, data, updated_at) VALUES ($1, $2, $3::jsonb, now())`,
    [id, "В работе", JSON.stringify(dto)],
  )
  return dto
}

export async function pgPatchAppeal(pool, id, patch) {
  const cur = await pgFindAppeal(pool, id)
  if (!cur) return null
  const merged = { ...cur, ...patch, updatedAt: nowIso() }
  const status = merged.status ?? cur.status
  const { rows: dictRows } = await pool.query(
    `SELECT code FROM app.dict_appeal_status WHERE code = $1 LIMIT 1`,
    [status],
  )
  const statusCode = dictRows[0]?.code ?? "В работе"
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
    category: body.appealCategory,
    applicantName: body.applicantName,
    organizationName: body.organizationName,
    type: body.applicantCategory,
    phone: body.phone,
    email: body.email,
  })
  return { id: dto.id, number: dto.id }
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
