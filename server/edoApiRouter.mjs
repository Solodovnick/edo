/**
 * REST под /api: legacy Spring-совместимые /appeals + OpenAPI /v1/*.
 * При наличии PostgreSQL (getPool()) обращения и кабинеты читаются из app.appeal_card + app.dict_*.
 */
import express from "express"
import * as store from "./edoMemoryStore.mjs"
import * as pgs from "./edoPgStore.mjs"
import { resolveAppealCreateBody } from "./resolveAppealCreateBody.mjs"

const err = (status, code, message, detail) => ({
  type: `https://edo-bank.example/problems/${code}`,
  title: message,
  status,
  detail: detail ?? message,
  instance: "/api/v1",
})

function ah(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

function sampleFallbackStatic(id) {
  return {
    id,
    regDate: "02/05/26",
    category: "Письменное",
    subcategory: "Карты",
    status: "В работе",
    deadline: "17/05/26",
    responsible: "Не назначено",
    applicantName: "Иванов Иван Иванович",
    organizationName: "N/A",
    address: "г. Москва",
    cbs: "N/A",
    type: "Физ лицо",
    isMine: false,
    content: "Текст обращения (мок)",
    solution: "",
    response: "",
    phone: "+79001234567",
    email: "client@example.com",
    appealType: "Письменное",
    createdBy: "api-mock",
    updatedAt: new Date().toISOString(),
  }
}

async function sampleFallback(getPool, id) {
  const p = getPool?.()
  if (p) {
    const a = await pgs.pgFindAppeal(p, id)
    if (a) return a
  }
  const a = store.findAppeal(id)
  if (a) return a
  return sampleFallbackStatic(id)
}

function debugStatus(req) {
  const sim = req.headers["x-debug-status"]
  if (sim && typeof sim === "string") {
    const code = parseInt(sim, 10)
    if (!Number.isNaN(code) && code >= 400 && code < 600) return code
  }
  return null
}

/** @param {() => import('pg').Pool | null} getPool */
export function createEdoApiRouter(getPool = () => null) {
  const r = express.Router()

  r.use((req, res, next) => {
    const code = debugStatus(req)
    if (code) return res.status(code).json(err(code, "SIMULATED", `Simulated ${code}`))
    next()
  })

  r.get(
    "/appeals",
    ah(async (req, res) => {
      const page = Math.max(0, parseInt(String(req.query.page ?? "0"), 10) || 0)
      const size = Math.min(200, Math.max(1, parseInt(String(req.query.size ?? "50"), 10) || 50))
      const search = req.query.search ? String(req.query.search) : undefined
      const p = getPool()
      const body = p
        ? await pgs.pgListLegacySpringPage(p, page, size, search)
        : store.listLegacySpringPage(page, size, search)
      res.json(body)
    }),
  )

  r.post(
    "/appeals",
    ah(async (req, res) => {
      try {
        const p = getPool()
        const body = p
          ? await pgs.pgCreateLegacyFromBody(p, req.body ?? {})
          : store.createLegacyFromBody(req.body ?? {})
        res.status(201).json(body)
      } catch (e) {
        res.status(400).json({ message: String(e) })
      }
    }),
  )

  r.get("/v1/health", (_req, res) => {
    res.json({ status: "UP", version: "1.0.0-edo-api", time: new Date().toISOString() })
  })

  r.get(
    "/v1/appeals",
    ah(async (req, res) => {
      const p = getPool()
      const items = p ? await pgs.pgListAppealsDto(p) : store.listAppealsDto()
      const page = Math.max(0, parseInt(String(req.query.page ?? "0"), 10) || 0)
      const size = Math.min(200, Math.max(1, parseInt(String(req.query.size ?? "20"), 10) || 20))
      const slice = items.slice(page * size, page * size + size)
      res.json({
        items: slice,
        page,
        size,
        totalElements: items.length,
        totalPages: Math.max(1, Math.ceil(items.length / size)),
      })
    }),
  )

  r.post(
    "/v1/appeals",
    ah(async (req, res) => {
      const body = resolveAppealCreateBody(req.body ?? {})
      if (!body.content || String(body.content).trim() === "") {
        return res
          .status(422)
          .json(err(422, "VALIDATION", "Нужен непустой текст: поле content или синоним text, message, complaintText, appealText"))
      }
      const p = getPool()
      const dto = p ? await pgs.pgAddAppealFromV1Create(p, body) : store.addAppealFromV1Create(body)
      res.status(201).json(dto)
    }),
  )

  r.post(
    "/v1/complaints/create",
    ah(async (req, res) => {
      const raw = resolveAppealCreateBody(req.body ?? {})
      const body = {
        ...raw,
        content: raw.content && String(raw.content).trim() !== "" ? raw.content : "(пустое тело)",
      }
      const p = getPool()
      const dto = p ? await pgs.pgAddAppealFromV1Create(p, body) : store.addAppealFromV1Create(body)
      res.status(201).json({ ...dto, channel: "external_api" })
    }),
  )

  r.get(
    "/v1/appeals/:id",
    ah(async (req, res) => {
      const { id } = req.params
      if (id === "404") return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      const p = getPool()
      const a = p ? await pgs.pgFindAppeal(p, id) : store.findAppeal(id)
      if (!a) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(a)
    }),
  )

  r.patch(
    "/v1/appeals/:id",
    ah(async (req, res) => {
      const { id } = req.params
      if (id === "409") return res.status(409).json(err(409, "CONFLICT", "Недопустимый переход статуса"))
      const p = getPool()
      const updated = p ? await pgs.pgPatchAppeal(p, id, req.body ?? {}) : store.patchAppeal(id, req.body ?? {})
      if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(updated)
    }),
  )

  r.delete(
    "/v1/appeals/:id",
    ah(async (req, res) => {
      const { id } = req.params
      const p = getPool()
      const ok = p ? await pgs.pgDeleteAppeal(p, id) : store.deleteAppeal(id)
      if (!ok) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.status(204).end()
    }),
  )

  r.get(
    "/v1/responsible/appeals",
    ah(async (req, res) => {
      const page = Math.max(0, parseInt(String(req.query.page ?? "0"), 10) || 0)
      const size = Math.min(200, Math.max(1, parseInt(String(req.query.size ?? "50"), 10) || 50))
      const status = req.query.status != null && String(req.query.status).trim() ? String(req.query.status).trim() : undefined
      const q = req.query.q != null && String(req.query.q).trim() ? String(req.query.q).trim() : undefined
      const query = { page, size, status, q }
      const p = getPool()
      if (p) {
        res.json(await pgs.pgResponsibleList(p, query))
        return
      }
      res.json(store.listResponsibleAppeals(query))
    }),
  )

  r.get(
    "/v1/responsible/appeals/:id",
    ah(async (req, res) => {
      const { id } = req.params
      const p = getPool()
      if (p) {
        const detail = await pgs.pgResponsibleAppealDetail(p, id)
        if (!detail) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
        return res.json(detail)
      }
      const detail = store.responsibleAppealDetail(id)
      if (!detail) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(detail)
    }),
  )

  r.get(
    "/v1/responsible/appeals/:id/timeline",
    ah(async (req, res) => {
      const { id } = req.params
      const p = getPool()
      if (p) {
        const a = await pgs.pgFindAppeal(p, id)
        if (!a) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
        return res.json(await pgs.pgAppealTimeline(p, id))
      }
      if (!store.findAppeal(id)) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(store.appealTimeline(id))
    }),
  )

  r.post(
    "/v1/responsible/appeals/:id/actions",
    ah(async (req, res) => {
      const { id } = req.params
      if (id === "403") return res.status(403).json(err(403, "FORBIDDEN", "Обращение не назначено на вас"))
      if (!req.body?.type) return res.status(422).json(err(422, "VALIDATION", "Поле type обязательно"))
      const p = getPool()
      if (p) {
        const updated = await pgs.pgResponsiblePostAction(p, id, req.body ?? {})
        if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
        return res.json({ accepted: true, appealId: id, type: req.body.type })
      }
      const updated = store.responsiblePostAction(id, req.body ?? {})
      if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json({ accepted: true, appealId: id, type: req.body.type })
    }),
  )

  r.post(
    "/v1/responsible/appeals/:id/attachments\\:prepareUpload",
    ah(async (req, res) => {
      const { id } = req.params
      const p = getPool()
      if (p) {
        const out = await pgs.pgPrepareAttachmentUpload(p, id, req.body ?? {})
        if (!out) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
        return res.json(out)
      }
      const out = store.prepareAttachmentUpload(id, req.body ?? {})
      if (!out) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(out)
    }),
  )

  r.get(
    "/v1/secretary/appeals",
    ah(async (req, res) => {
      const status = req.query.status ? String(req.query.status) : "На ПК"
      const p = getPool()
      if (p) {
        res.json(await pgs.pgSecretaryAppeals(p, status))
        return
      }
      const mem = store.listAppealsByStatus(status)
      res.json({
        items: mem.length ? mem : [sampleFallbackStatic("s-1")],
        filter: { status },
      })
    }),
  )

  r.get(
    "/v1/secretary/appeals/:appealId",
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      const a = p ? await pgs.pgFindAppeal(p, appealId) : store.findAppeal(appealId)
      if (!a) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(a)
    }),
  )

  r.post(
    "/v1/secretary/appeals/:appealId/decision",
    express.json(),
    ah(async (req, res) => {
      const { appealId } = req.params
      const body = req.body ?? {}
      if (!body.decision) return res.status(422).json(err(422, "VALIDATION", "Поле decision обязательно (APPROVE|REJECT)"))
      const p = getPool()
      const updated = p
        ? await pgs.pgSecretaryDecision(p, appealId, body)
        : store.secretaryPkDecision(appealId, body)
      if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(updated)
    }),
  )

  r.get(
    "/v1/manager/appeals",
    ah(async (req, res) => {
      const page = Math.max(0, parseInt(String(req.query.page ?? "0"), 10) || 0)
      const size = Math.min(200, Math.max(1, parseInt(String(req.query.size ?? "20"), 10) || 20))
      const q = req.query.q ? String(req.query.q) : undefined
      const p = getPool()
      const body = p ? await pgs.pgManagerAppealsSearch(p, q, page, size) : store.managerSearchAppeals(q, page, size)
      res.json(body)
    }),
  )

  r.post(
    "/v1/manager/appeals/:appealId/assign-responsible",
    express.json(),
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      const updated = p
        ? await pgs.pgAssignResponsible(p, appealId, req.body ?? {})
        : store.managerAssignResponsible(appealId, req.body ?? {})
      if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(updated)
    }),
  )

  r.get(
    "/v1/manager/appeals/:appealId/history",
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      if (p) {
        res.json(await pgs.pgListAuditLog(p, appealId))
        return
      }
      res.json(store.getAuditLog(appealId))
    }),
  )

  r.get(
    "/v1/manager/dashboard/summary",
    ah(async (_req, res) => {
      const p = getPool()
      if (p) {
        res.json(await pgs.pgManagerDashboard(p))
        return
      }
      res.json({ openAppeals: 42, atRisk: 3, closedThisMonth: 128 })
    }),
  )

  r.get(
    "/v1/audit/appeals",
    ah(async (_req, res) => {
      const p = getPool()
      if (p) {
        res.json(await pgs.pgAuditAppealsPage(p))
        return
      }
      res.json({
        items: [{ ...(await sampleFallback(getPool, "a-9")), status: "На аудите" }],
        page: 0,
        size: 50,
      })
    }),
  )

  r.get(
    "/v1/audit/appeals/:appealId",
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      const a = p ? await pgs.pgFindAppeal(p, appealId) : store.findAppeal(appealId)
      if (!a) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(a)
    }),
  )

  r.post(
    "/v1/audit/appeals/:appealId/take-work",
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      const updated = p ? await pgs.pgAuditTakeWork(p, appealId) : store.auditTakeWork(appealId)
      if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(updated)
    }),
  )

  r.post(
    "/v1/audit/appeals/:appealId/decline",
    express.json(),
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      const updated = p ? await pgs.pgAuditDecline(p, appealId, req.body ?? {}) : store.auditDecline(appealId, req.body ?? {})
      if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(updated)
    }),
  )

  r.post(
    "/v1/audit/appeals/:appealId/publish",
    express.json(),
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      const updated = p ? await pgs.pgAuditPublish(p, appealId, req.body ?? {}) : store.auditPublish(appealId, req.body ?? {})
      if (!updated) return res.status(404).json(err(404, "NOT_FOUND", "Обращение не найдено"))
      res.json(updated)
    }),
  )

  r.get(
    "/v1/audit/appeals/:appealId/log",
    ah(async (req, res) => {
      const { appealId } = req.params
      const p = getPool()
      if (p) {
        res.json(await pgs.pgListAuditLog(p, appealId))
        return
      }
      res.json(store.getAuditLog(appealId))
    }),
  )

  r.get(
    "/v1/notifications",
    ah(async (_req, res) => {
      const p = getPool()
      if (p) return res.json(await pgs.pgListNotifications(p))
      res.json(store.listNotifications())
    }),
  )

  r.patch(
    "/v1/notifications/:id/read",
    ah(async (req, res) => {
      const p = getPool()
      if (p) {
        const row = await pgs.pgMarkNotificationRead(p, req.params.id)
        if (!row) return res.status(404).json(err(404, "NOT_FOUND", "Уведомление не найдено"))
        return res.json(row)
      }
      const row = store.markNotificationRead(req.params.id)
      if (!row) return res.status(404).json(err(404, "NOT_FOUND", "Уведомление не найдено"))
      res.json(row)
    }),
  )

  r.get(
    "/v1/crm/clients/search",
    ah(async (req, res) => {
      const name = req.query.name ? String(req.query.name) : ""
      const inn = req.query.inn ? String(req.query.inn) : ""
      const p = getPool()
      if (p) return res.json(await pgs.pgSearchClients(p, name, inn))
      res.json(store.searchClients({ name, inn }))
    }),
  )

  r.post(
    "/v1/crm/clients",
    ah(async (req, res) => {
      const body = req.body ?? {}
      if (!body.name && !body.phone && !body.inn) {
        return res.status(422).json(err(422, "VALIDATION", "Укажите name, phone или inn"))
      }
      const p = getPool()
      const created = p ? await pgs.pgCreateClient(p, body) : store.createClient(body)
      res.status(201).json(created)
    }),
  )

  r.get(
    "/v1/stats/registrar/month",
    ah(async (_req, res) => {
      const p = getPool()
      if (p) {
        res.json(await pgs.pgRegistrarMonthStats(p))
        return
      }
      res.json({ withoutErrors: 145, withErrors: 12, total: 157 })
    }),
  )

  r.get("/v1/me", (req, res) => {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json(err(401, "UNAUTHORIZED", "Требуется Bearer JWT"))
    }
    res.json({ sub: "user-mock", roles: ["REGISTRAR", "RESPONSIBLE"] })
  })

  r.use((req, res) => {
    res.status(404).json(err(404, "NOT_FOUND", `Маршрут не реализован: ${req.method} ${req.originalUrl}`))
  })

  return r
}
