/**
 * Демо-хранилище в памяти (локальный Node и Netlify Functions — один процесс на warm).
 * Для продакшена с Postgres замените на SQL-слой по ADR.
 */

import { statusToResponsibleCode } from "./edoPgStore.mjs"

function nowIso() {
  return new Date().toISOString()
}

function ruShort(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" })
}

function seedAppeal(id, patch) {
  const base = {
    id,
    regDate: ruShort(nowIso()),
    category: "Письменное",
    subcategory: "Общее",
    status: "Назначено",
    deadline: ruShort(new Date(Date.now() + 864e5 * 14).toISOString()),
    responsible: "Не назначено",
    applicantName: "Иванов Иван Иванович",
    organizationName: "N/A",
    address: "г. Москва",
    cbs: "N/A",
    type: "Физ лицо",
    isMine: false,
    content: "Демо-обращение (seed)",
    solution: "",
    response: "",
    phone: "+79001234567",
    email: "",
    appealType: "Письменное",
    createdBy: "seed",
    updatedAt: nowIso(),
  }
  return { ...base, ...patch }
}

/** Демо-реестр для кабинета ответственного: статусы из ProcessingCabinetNew.ALLOWED_STATUSES */
/** @type {Record<string, unknown>[]} */
let appeals = [
  seedAppeal("100001", {
    status: "На ответственном, взято",
    responsible: "Александр Солодовников",
    category: "Устное",
    appealType: "Устное",
    subcategory: "Дистанционные сервисы",
    applicantName: "Смирнов Алексей Викторович",
    content: "Жалоба на задержку ответа в чате поддержки",
  }),
  seedAppeal("100002", {
    status: "На ответственном, взято",
    responsible: "Расул Рамазанов",
    subcategory: "Кредиты",
    applicantName: "Кузнецова Мария Олеговна",
    content: "Претензия по срокам рассмотрения заявки на кредит",
  }),
  seedAppeal("100003", {
    status: "Назначено",
    responsible: "Не назначено",
    subcategory: "Карты",
    applicantName: "Николаев Пётр Сергеевич",
    content: "Блокировка карты без уведомления",
  }),
  seedAppeal("100004", {
    status: "На ответственном, взято",
    responsible: "Александр Солодовников",
    type: "Юр лицо",
    applicantName: "N/A",
    organizationName: 'ООО "Вектор"',
    subcategory: "РКО",
    content: "Несогласие с комиссией за расчётно-кассовое обслуживание",
  }),
  seedAppeal("100005", {
    status: "Запрос в БП",
    responsible: "Расул Рамазанов",
    subcategory: "Валютный контроль",
    applicantName: "Орлова Елена Дмитриевна",
    content: "Запрос статуса валютной операции",
  }),
  seedAppeal("100006", {
    status: "Готово к подписи",
    responsible: "Александр Солодовников",
    subcategory: "Ипотека",
    applicantName: "Волков Дмитрий Андреевич",
    content: "Согласование графика досрочных платежей",
  }),
  seedAppeal("100007", {
    status: "Назначено",
    responsible: "Не назначено",
    type: "Юр лицо",
    applicantName: "N/A",
    organizationName: "АО «Северсталь-Финанс»",
    subcategory: "Гарантии",
    content: "Уточнение условий банковской гарантии",
  }),
  seedAppeal("100008", {
    status: "На ответственном, взято",
    responsible: "Александр Солодовников",
    category: "Устное",
    appealType: "Устное",
    subcategory: "Колл-центр",
    applicantName: "Тихонов Игорь Николаевич",
    content: "Устная жалоба на навязывание страховки при выдаче кредита",
  }),
  seedAppeal("100009", {
    status: "Запрос в БП",
    responsible: "Не назначено",
    subcategory: "Переводы",
    applicantName: "Морозова Анна Павловна",
    content: "Перевод не поступил на счёт получателя",
  }),
  seedAppeal("100010", {
    status: "Назначено",
    responsible: "Петрова Ирина Сергеевна",
    subcategory: "Вклады",
    applicantName: "Лебедев Константин Юрьевич",
    content: "Перерасчёт процентов по вкладу",
  }),
]

/** @type {{ id: string, name: string, inn: string, phone: string, type: string, matchScore?: number }[]} */
let clients = [
  { id: "c-1", name: "Иванов Иван Иванович", inn: "", phone: "+79001234567", type: "individual" },
  { id: "c-2", name: 'ООО "Ромашка"', inn: "7707083893", phone: "+74951234567", type: "organization" },
  { id: "c-3", name: "Петров Пётр Петрович", inn: "7701234567", phone: "+79009999999", type: "individual" },
]

/** @type {{ id: string, type: string, title: string, read: boolean, createdAt: string }[]} */
let notifications = [
  {
    id: "n1",
    type: "new_written_appeal",
    title: "Новое письменное обращение",
    read: false,
    createdAt: new Date().toISOString(),
  },
]

let nextAppealNum = 100011

const RESPONSIBLE_CABINET_STATUSES = new Set([
  "Назначено",
  "На ответственном, взято",
  "Запрос в БП",
  "Готово к подписи",
])

/** Статусы с кабинетом responsible в app.dict_appeal_status (без «Решено»). */
const RESPONSIBLE_CABINET_STATUSES_FOR_LIST = new Set([
  "В работе",
  "На ответственном, не взято",
  "На ответственном, взято",
  "На БП",
  "На ПК",
  "На HD",
  "На аудите",
  "Аудит",
  "Назначено",
  "Запрос в БП",
  "Готово к подписи",
  "Зарегистрировано",
])

/**
 * GET /v1/responsible/appeals без Postgres — те же фильтры, что в Swagger (status, q, page, size).
 * @param {{ page?: number; size?: number; status?: string; q?: string }} [query]
 */
export function listResponsibleAppeals(query = {}) {
  const page = Math.max(0, Number.isFinite(query.page) ? query.page : parseInt(String(query.page ?? "0"), 10) || 0)
  const size = Math.min(
    200,
    Math.max(1, Number.isFinite(query.size) ? query.size : parseInt(String(query.size ?? "50"), 10) || 50),
  )
  let rows = appeals.filter((a) => RESPONSIBLE_CABINET_STATUSES_FOR_LIST.has(String(a.status ?? "")))
  if (query.status && String(query.status).trim()) {
    const st = String(query.status).trim()
    rows = rows.filter((a) => String(a.status ?? "") === st)
  }
  if (query.q && String(query.q).trim()) {
    const n = String(query.q).trim().toLowerCase()
    rows = rows.filter(
      (a) =>
        String(a.id).toLowerCase().includes(n) ||
        String(a.applicantName ?? "").toLowerCase().includes(n) ||
        String(a.organizationName ?? "").toLowerCase().includes(n) ||
        String(a.content ?? "").toLowerCase().includes(n),
    )
  }
  const slice = rows.slice(page * size, page * size + size)
  const items = slice.map((a) => ({
    id: a.id,
    publicNumber: a.id,
    title: (a.content && String(a.content).slice(0, 120)) || a.applicantName || "—",
    categoryCode: "GENERAL",
    statusCode: statusToResponsibleCode(a.status),
    priorityCode: "NORMAL",
    updatedAt: a.updatedAt ?? nowIso(),
    slaDueAt: new Date(Date.now() + 864e5 * 5).toISOString(),
    flags: { overdue: false },
  }))
  return {
    items,
    nextCursor: slice.length === size ? String(page + 1) : null,
  }
}

export function listAppealsDto() {
  return [...appeals]
}

export function listAppealsByStatus(statusFilter) {
  return appeals.filter((a) => a.status === statusFilter)
}

export function findAppeal(id) {
  return appeals.find((a) => a.id === String(id))
}

export function addAppealFromV1Create(body) {
  const id = String(nextAppealNum++)
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
    statusFromClient && RESPONSIBLE_CABINET_STATUSES.has(statusFromClient)
      ? statusFromClient
      : responsible !== "Не назначено"
        ? "На ответственном, взято"
        : "Назначено"

  const deadlineStr =
    typeof body.deadline === "string" && body.deadline.trim()
      ? body.deadline.trim()
      : ruShort(new Date(Date.now() + 864e5 * 15).toISOString())

  const dto = {
    id,
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
    type: body.type === "Юр лицо" || body.type === "Юрлицо" ? "Юр лицо" : "Физ лицо",
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
  appeals = [dto, ...appeals]
  notifications.unshift({
    id: `n-${id}-${Date.now()}`,
    type: "new_written_appeal",
    title: `Зарегистрировано обращение ${id}`,
    read: false,
    createdAt: nowIso(),
  })
  return dto
}

/** Spring-совместимое тело списка (appealApi.ts) */
export function listLegacySpringPage(page, size, search) {
  let rows = [...appeals]
  if (search) {
    const q = search.toLowerCase()
    rows = rows.filter(
      (a) =>
        String(a.applicantName).toLowerCase().includes(q) ||
        String(a.organizationName).toLowerCase().includes(q) ||
        String(a.id).includes(q)
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

export function createLegacyFromBody(body) {
  const dto = addAppealFromV1Create({
    content: body.content ?? body.appealCategory ?? "",
    category: body.appealCategory,
    applicantName: body.applicantName,
    organizationName: body.organizationName,
    type: body.applicantCategory,
    phone: body.phone,
    email: body.email,
    responsible: body.responsible,
    appealType: body.appealType,
    deadline: body.deadline,
    status: body.status,
    createdBy: body.createdBy,
  })
  return { id: dto.id, number: dto.id }
}

export function searchClients({ name, inn }) {
  const qName = (name ?? "").trim().toLowerCase()
  const qInn = (inn ?? "").trim()
  const hits = []
  for (const c of clients) {
    let score = 0
    if (qInn && c.inn && c.inn.includes(qInn)) score = 0.99
    else if (qName && c.name.toLowerCase().includes(qName)) score = 0.85
    else if (qName && c.phone.includes(qName)) score = 0.7
    if (score > 0) hits.push({ name: c.name, inn: c.inn || "—", matchScore: score, id: c.id, phone: c.phone, type: c.type })
  }
  hits.sort((a, b) => b.matchScore - a.matchScore)
  return { hits }
}

export function createClient(body) {
  const id = `c-${clients.length + 1}-${Date.now()}`
  const row = {
    id,
    name: String(body.name ?? "").trim() || "Без имени",
    inn: String(body.inn ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    type: body.type === "organization" ? "organization" : "individual",
  }
  clients = [row, ...clients]
  return { id: row.id, name: row.name, inn: row.inn, phone: row.phone, type: row.type, matchScore: 1 }
}

export function patchAppeal(id, patch) {
  const i = appeals.findIndex((a) => a.id === String(id))
  if (i === -1) return null
  appeals[i] = { ...appeals[i], ...patch, updatedAt: nowIso() }
  return appeals[i]
}

export function deleteAppeal(id) {
  const n = appeals.filter((a) => a.id !== String(id))
  if (n.length === appeals.length) return false
  appeals = n
  return true
}

/** appealId → журнал событий (UC-ADM.01 / FR-14.3, журнал аудита UC-AU.03) */
const eventLogs = {}

function defaultAuditEntries(appealId) {
  return [
    {
      id: "log-seed-1",
      at: new Date().toISOString(),
      actor: "auditor@bank",
      action: "VIEW",
      details: "Просмотр карточки (seed)",
    },
  ]
}

export function appendEventLog(appealId, entry) {
  const id = String(appealId)
  if (!eventLogs[id]) eventLogs[id] = defaultAuditEntries(id)
  const row = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    actor: entry.actor ?? "api",
    action: entry.action ?? "EVENT",
    details: entry.details != null ? String(entry.details) : "",
  }
  eventLogs[id].unshift(row)
  return row
}

export function getAuditLog(appealId) {
  const id = String(appealId)
  const entries = eventLogs[id] ? [...eventLogs[id]] : defaultAuditEntries(id)
  return { appealId: id, entries }
}

export function managerSearchAppeals(q, page, size) {
  let rows = [...appeals]
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

export function managerAssignResponsible(id, body) {
  const name = body.userName ?? body.responsibleName ?? "Назначенный специалист"
  appendEventLog(id, {
    actor: "manager",
    action: "ASSIGN_RESPONSIBLE",
    details: JSON.stringify({ userName: name, uc: "UC-RU-03", fr: "FR-14.1" }),
  })
  return patchAppeal(id, { responsible: name })
}

export function secretaryPkDecision(id, body) {
  const decision = String(body.decision ?? "").toUpperCase()
  appendEventLog(id, {
    actor: "secretary",
    action: `PK_${decision}`,
    details: String(body.comment ?? ""),
  })
  if (decision === "APPROVE") return patchAppeal(id, { status: "В работе" })
  if (decision === "REJECT") return patchAppeal(id, { status: "На ответственном, не взято" })
  return null
}

export function auditTakeWork(id) {
  appendEventLog(id, { actor: "auditor", action: "TAKE_WORK", details: "UC-AU.01 / FR-13.1" })
  return patchAppeal(id, { responsible: "Аудитор (в работе)", status: "На аудите" })
}

export function auditDecline(id, body) {
  appendEventLog(id, {
    actor: "auditor",
    action: "DECLINE",
    details: String(body.reason ?? body.comment ?? ""),
  })
  return patchAppeal(id, { status: "В работе", responsible: "Не назначено" })
}

export function auditPublish(id, body) {
  appendEventLog(id, {
    actor: "auditor",
    action: "PUBLISH_AUDIT",
    details: JSON.stringify({
      templateId: body.templateId,
      comment: body.comment ?? "",
      uc: "UC-AU.03",
      fr: "FR-13.3",
    }),
  })
  return patchAppeal(id, { status: "Решено" })
}

export function listNotifications() {
  return { items: notifications.map((n) => ({ ...n })) }
}

export function markNotificationRead(notificationId) {
  const i = notifications.findIndex((n) => n.id === String(notificationId))
  if (i === -1) return null
  notifications[i] = { ...notifications[i], read: true }
  return { id: notifications[i].id, read: true }
}

export function appealTimeline(appealId) {
  const log = getAuditLog(appealId)
  return {
    items: log.entries.map((e) => ({
      id: e.id,
      type: e.action,
      actorId: e.actor,
      createdAt: e.at,
      payload: (() => {
        try {
          return e.details ? JSON.parse(e.details) : {}
        } catch {
          return { raw: e.details }
        }
      })(),
    })),
    nextCursor: null,
  }
}

export function responsibleAppealDetail(appealId) {
  const header = findAppeal(appealId)
  if (!header) return null
  const log = getAuditLog(appealId)
  const actionsPreview = log.entries.slice(0, 8).map((e) => ({
    action: e.action,
    actor: e.actor,
    at: e.at,
    details: e.details,
  }))
  return { header, actionsPreview, attachments: [] }
}

export function responsiblePostAction(appealId, body) {
  const cur = findAppeal(appealId)
  if (!cur) return null
  const type = String(body?.type ?? "")
  const payload = body?.payload && typeof body.payload === "object" ? body.payload : {}
  appendEventLog(appealId, { actor: "responsible", action: type, details: JSON.stringify(payload) })
  switch (type) {
    case "ACCEPT":
      return patchAppeal(appealId, { status: "На ответственном, взято", isMine: true })
    case "RETURN_TO_POOL":
      return patchAppeal(appealId, { status: "На ответственном, не взято", responsible: "Не назначено" })
    case "RESOLVE":
      return patchAppeal(appealId, { status: "Решено" })
    case "ESCALATE":
      return patchAppeal(appealId, { status: "На HD" })
    case "REQUEST_INFO":
      return patchAppeal(appealId, { ...payload })
    default:
      return findAppeal(appealId)
  }
}

export function prepareAttachmentUpload(appealId, body) {
  if (!findAppeal(appealId)) return null
  const attId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  appendEventLog(appealId, {
    actor: "responsible",
    action: "PREPARE_UPLOAD",
    details: JSON.stringify({ attachmentId: attId, fileName: body?.fileName }),
  })
  return {
    uploadUrl: "https://storage.example/presigned-mock",
    expiresAt: new Date(Date.now() + 3600e3).toISOString(),
    attachmentId: attId,
  }
}
