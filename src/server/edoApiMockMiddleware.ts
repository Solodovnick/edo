import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'vite'
import { resolveAppealCreateBody } from '../../server/resolveAppealCreateBody.mjs'

function writeJson(res: ServerResponse, status: number, body: unknown) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.statusCode = status
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c as Buffer))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

const sampleAppeal = (id: string) => ({
  id,
  regDate: '02/05/26',
  category: 'Письменное',
  subcategory: 'Карты',
  status: 'В работе',
  deadline: '17/05/26',
  responsible: 'Не назначено',
  applicantName: 'Иванов Иван Иванович',
  organizationName: 'N/A',
  address: 'г. Москва',
  cbs: 'N/A',
  type: 'Физ лицо',
  isMine: false,
  content: 'Текст обращения (мок)',
  solution: '',
  response: '',
  phone: '+79001234567',
  email: 'client@example.com',
  appealType: 'Письменное',
  createdBy: 'api-mock',
  updatedAt: new Date().toISOString(),
})

/** Обращения, созданные через POST /appeals в текущем процессе dev (без Postgres). */
const mockAppealsPosted: Record<string, unknown>[] = []

const MOCK_RESPONSIBLE_STATUSES = new Set([
  'Назначено',
  'На ответственном, не взято',
  'На ответственном, взято',
  'Запрос в БП',
  'Готово к подписи',
  'В работе',
])

function uiStatusToResponsibleCode(status: unknown): string {
  const s = typeof status === 'string' ? status : ''
  const m: Record<string, string> = {
    'В работе': 'IN_PROGRESS',
    'Назначено': 'NOT_ASSIGNED',
    'На ответственном, не взято': 'NOT_ASSIGNED',
    'На ответственном, взято': 'ASSIGNED',
    'Запрос в БП': 'ON_BP',
    'Готово к подписи': 'IN_PROGRESS',
  }
  return m[s] ?? 'IN_PROGRESS'
}

function appealDtoToResponsibleRow(a: Record<string, unknown>) {
  const id = String(a.id ?? '')
  const content = String(a.content ?? '')
  const updatedAt = typeof a.updatedAt === 'string' ? a.updatedAt : new Date().toISOString()
  return {
    id,
    publicNumber: id,
    title: content.slice(0, 120) || String(a.applicantName ?? '—'),
    categoryCode: typeof a.subcategory === 'string' ? a.subcategory : 'GENERAL',
    statusCode: uiStatusToResponsibleCode(a.status),
    priorityCode: 'NORMAL',
    updatedAt,
    slaDueAt: updatedAt,
    flags: { overdue: false },
    applicantName: a.applicantName ?? null,
    organizationName: a.organizationName ?? null,
    responsible: a.responsible ?? null,
    deadline: a.deadline ?? null,
    appealType: a.appealType ?? a.category ?? 'Письменное',
    regDate: a.regDate ?? null,
  }
}

function findMockAppeal(id: string): Record<string, unknown> | undefined {
  return mockAppealsPosted.find((x) => String(x.id) === id)
}

const err = (status: number, code: string, message: string, detail?: string) => ({
  type: `https://edo-bank.example/problems/${code}`,
  title: message,
  status,
  detail: detail ?? message,
  instance: '/api/v1',
})

export function edoApiMockMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const raw = (req as IncomingMessage & { originalUrl?: string }).originalUrl ?? req.url ?? ''
    const pathname = raw.split('?')[0]
    if (!pathname.startsWith('/api/v1')) {
      next()
      return
    }

    const sim = (req as IncomingMessage).headers['x-debug-status']
    if (sim && typeof sim === 'string') {
      const code = parseInt(sim, 10)
      if (!Number.isNaN(code) && code >= 400 && code < 600) {
        writeJson(res, code, err(code, 'SIMULATED', `Смulated ${code} через заголовок X-Debug-Status`))
        return
      }
    }

    const method = (req.method || 'GET').toUpperCase()
    const resHttp = res as ServerResponse

    try {
      // --- Health ---
      if (method === 'GET' && pathname === '/api/v1/health') {
        writeJson(resHttp, 200, { status: 'UP', version: '1.0.0-mock', time: new Date().toISOString() })
        return
      }

      // --- Registrar: appeals CRUD ---
      if (method === 'GET' && pathname === '/api/v1/appeals') {
        const seeded = [sampleAppeal('100001'), sampleAppeal('100002')]
        const items = [...mockAppealsPosted, ...seeded] as Record<string, unknown>[]
        writeJson(resHttp, 200, {
          items,
          page: 0,
          size: 20,
          totalElements: items.length,
          totalPages: 1,
        })
        return
      }

      if (method === 'POST' && pathname === '/api/v1/appeals') {
        const rawBody = await readBody(req as IncomingMessage)
        let body: Record<string, unknown> = {}
        try {
          body = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {}
        } catch {
          writeJson(resHttp, 400, err(400, 'BAD_JSON', 'Некорректный JSON'))
          return
        }
        const merged = resolveAppealCreateBody(body)
        if (!merged.content || String(merged.content).trim() === '') {
          writeJson(
            resHttp,
            422,
            err(
              422,
              'VALIDATION',
              'Нужен непустой текст: content или синоним text, message, complaintText, appealText',
            ),
          )
          return
        }
        const id = String(Date.now()).slice(-8)
        const created = { ...sampleAppeal(id), ...merged, id }
        mockAppealsPosted.unshift(created)
        writeJson(resHttp, 201, created)
        return
      }

      if (method === 'POST' && pathname === '/api/v1/complaints/create') {
        const rawBody = await readBody(req as IncomingMessage)
        let body: Record<string, unknown> = {}
        try {
          body = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {}
        } catch {
          writeJson(resHttp, 400, err(400, 'BAD_JSON', 'Некорректный JSON'))
          return
        }
        const id = String(Date.now()).slice(-8)
        writeJson(resHttp, 201, { ...sampleAppeal(id), ...body, id, channel: 'external_api' })
        return
      }

      const appealIdMatch = pathname.match(/^\/api\/v1\/appeals\/([^/]+)$/)
      if (appealIdMatch) {
        const id = appealIdMatch[1]
        if (id === '404') {
          writeJson(resHttp, 404, err(404, 'NOT_FOUND', 'Обращение не найдено'))
          return
        }
        if (method === 'GET') {
          const found = findMockAppeal(id)
          writeJson(resHttp, 200, found ?? sampleAppeal(id))
          return
        }
        if (method === 'PATCH') {
          const rawBody = await readBody(req as IncomingMessage)
          let patch: Record<string, unknown> = {}
          try {
            patch = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {}
          } catch {
            writeJson(resHttp, 400, err(400, 'BAD_JSON', 'Некорректный JSON'))
            return
          }
          if (id === '409') {
            writeJson(resHttp, 409, err(409, 'CONFLICT', 'Недопустимый переход статуса'))
            return
          }
          const idx = mockAppealsPosted.findIndex((x) => String(x.id) === id)
          if (idx >= 0) {
            mockAppealsPosted[idx] = { ...mockAppealsPosted[idx], ...patch, updatedAt: new Date().toISOString() }
            writeJson(resHttp, 200, mockAppealsPosted[idx])
            return
          }
          writeJson(resHttp, 200, { ...sampleAppeal(id), ...patch })
          return
        }
        if (method === 'DELETE') {
          resHttp.statusCode = 204
          resHttp.end()
          return
        }
        writeJson(resHttp, 405, err(405, 'METHOD_NOT_ALLOWED', `Метод ${method} не поддержан`))
        return
      }

      // --- Responsible ---
      if (method === 'GET' && pathname === '/api/v1/responsible/appeals') {
        const qs = raw.includes('?') ? raw.slice(raw.indexOf('?') + 1) : ''
        const qParam = new URLSearchParams(qs).get('q')?.trim().toLowerCase() ?? ''
        let postedForResponsible = mockAppealsPosted.filter((a) =>
          MOCK_RESPONSIBLE_STATUSES.has(String(a.status ?? '')),
        )
        if (qParam) {
          postedForResponsible = postedForResponsible.filter(
            (a) =>
              String(a.id ?? '').toLowerCase().includes(qParam) ||
              String(a.applicantName ?? '').toLowerCase().includes(qParam) ||
              String(a.organizationName ?? '').toLowerCase().includes(qParam) ||
              String(a.content ?? '').toLowerCase().includes(qParam),
          )
        }
        const fromPosted = postedForResponsible.map((a) => appealDtoToResponsibleRow(a))
        const staticItemsAll = [
          {
            id: 'r-1',
            publicNumber: '347823',
            title: 'Навязывание услуги',
            categoryCode: 'CARDS',
            statusCode: 'IN_PROGRESS',
            priorityCode: 'NORMAL',
            updatedAt: new Date().toISOString(),
            slaDueAt: new Date(Date.now() + 864e5 * 5).toISOString(),
            flags: { overdue: false },
            applicantName: 'Петров П.П.',
            organizationName: null,
            responsible: 'Не назначено',
            deadline: '17/05/26',
            appealType: 'Письменное',
            regDate: '02/05/26',
          },
        ]
        const staticItems = qParam
          ? staticItemsAll.filter(
              (row) =>
                String(row.id ?? '').toLowerCase().includes(qParam) ||
                String(row.publicNumber ?? '').toLowerCase().includes(qParam) ||
                String(row.title ?? '').toLowerCase().includes(qParam) ||
                String(row.applicantName ?? '').toLowerCase().includes(qParam) ||
                String(row.organizationName ?? '').toLowerCase().includes(qParam),
            )
          : staticItemsAll
        writeJson(resHttp, 200, {
          items: [...fromPosted, ...staticItems],
          nextCursor: null,
        })
        return
      }

      const respAppeal = pathname.match(/^\/api\/v1\/responsible\/appeals\/([^/]+)$/)
      if (respAppeal && method === 'GET') {
        const id = respAppeal[1]
        const found = findMockAppeal(id)
        writeJson(resHttp, 200, {
          header: found ?? sampleAppeal(id),
          actionsPreview: [],
          attachments: [],
        })
        return
      }

      const respTimeline = pathname.match(/^\/api\/v1\/responsible\/appeals\/([^/]+)\/timeline$/)
      if (respTimeline && method === 'GET') {
        writeJson(resHttp, 200, {
          items: [
            {
              id: 'a1',
              type: 'ACCEPT',
              actorId: 'user-1',
              createdAt: new Date().toISOString(),
              payload: {},
            },
          ],
          nextCursor: null,
        })
        return
      }

      const respActions = pathname.match(/^\/api\/v1\/responsible\/appeals\/([^/]+)\/actions$/)
      if (respActions && method === 'POST') {
        const rawBody = await readBody(req as IncomingMessage)
        let body: { type?: string; payload?: unknown } = {}
        try {
          body = rawBody ? JSON.parse(rawBody) : {}
        } catch {
          writeJson(resHttp, 400, err(400, 'BAD_JSON', 'Некорректный JSON'))
          return
        }
        if (!body.type) {
          writeJson(resHttp, 422, err(422, 'VALIDATION', 'Поле type обязательно'))
          return
        }
        if (respActions[1] === '403') {
          writeJson(resHttp, 403, err(403, 'FORBIDDEN', 'Обращение не назначено на вас'))
          return
        }
        writeJson(resHttp, 200, { accepted: true, appealId: respActions[1], type: body.type })
        return
      }

      const respAttach = pathname.match(
        /^\/api\/v1\/responsible\/appeals\/([^/]+)\/attachments:prepareUpload$/
      )
      if (respAttach && method === 'POST') {
        writeJson(resHttp, 200, {
          uploadUrl: 'https://storage.example/presigned-mock',
          expiresAt: new Date(Date.now() + 3600e3).toISOString(),
          attachmentId: 'att-mock-1',
        })
        return
      }

      // --- Manager (UC-RU-04 / FR-14.2, UC-RU-03 / FR-14.1, UC-ADM.01 / FR-14.3) ---
      if (method === 'GET' && pathname === '/api/v1/manager/appeals') {
        writeJson(resHttp, 200, {
          items: [sampleAppeal('100001'), sampleAppeal('100002')],
          page: 0,
          size: 20,
          totalElements: 2,
          totalPages: 1,
        })
        return
      }

      const mgrAssign = pathname.match(/^\/api\/v1\/manager\/appeals\/([^/]+)\/assign-responsible$/)
      if (mgrAssign && method === 'POST') {
        writeJson(resHttp, 200, {
          ...sampleAppeal(mgrAssign[1]),
          responsible: 'Назначенный (мок)',
        })
        return
      }

      const mgrHist = pathname.match(/^\/api\/v1\/manager\/appeals\/([^/]+)\/history$/)
      if (mgrHist && method === 'GET') {
        writeJson(resHttp, 200, {
          appealId: mgrHist[1],
          entries: [
            {
              id: 'log-mock-1',
              at: new Date().toISOString(),
              actor: 'manager@bank',
              action: 'VIEW',
              details: 'История (мок)',
            },
          ],
        })
        return
      }

      // --- Secretary ---
      if (method === 'GET' && pathname === '/api/v1/secretary/appeals') {
        writeJson(resHttp, 200, {
          items: [sampleAppeal('s-1')],
          filter: { status: 'На ПК' },
        })
        return
      }

      const secCard = pathname.match(/^\/api\/v1\/secretary\/appeals\/([^/]+)$/)
      if (secCard && method === 'GET') {
        writeJson(resHttp, 200, sampleAppeal(secCard[1]))
        return
      }

      const secDecision = pathname.match(/^\/api\/v1\/secretary\/appeals\/([^/]+)\/decision$/)
      if (secDecision && method === 'POST') {
        await readBody(req as IncomingMessage)
        writeJson(resHttp, 200, { ...sampleAppeal(secDecision[1]), status: 'В работе' })
        return
      }

      // --- Manager dashboard ---
      if (method === 'GET' && pathname === '/api/v1/manager/dashboard/summary') {
        writeJson(resHttp, 200, {
          openAppeals: 42,
          atRisk: 3,
          closedThisMonth: 128,
        })
        return
      }

      // --- Audit (UC-AU.* / FR-05, FR-13) ---
      const auditLog = pathname.match(/^\/api\/v1\/audit\/appeals\/([^/]+)\/log$/)
      if (auditLog && method === 'GET') {
        writeJson(resHttp, 200, {
          appealId: auditLog[1],
          entries: [
            {
              id: 'log-1',
              at: new Date().toISOString(),
              actor: 'auditor@bank',
              action: 'VIEW',
              details: 'Просмотр карточки',
            },
          ],
        })
        return
      }

      const auditTake = pathname.match(/^\/api\/v1\/audit\/appeals\/([^/]+)\/take-work$/)
      if (auditTake && method === 'POST') {
        writeJson(resHttp, 200, {
          ...sampleAppeal(auditTake[1]),
          status: 'На аудите',
          responsible: 'Аудитор (в работе)',
        })
        return
      }

      const auditDecl = pathname.match(/^\/api\/v1\/audit\/appeals\/([^/]+)\/decline$/)
      if (auditDecl && method === 'POST') {
        await readBody(req as IncomingMessage)
        writeJson(resHttp, 200, {
          ...sampleAppeal(auditDecl[1]),
          status: 'В работе',
          responsible: 'Не назначено',
        })
        return
      }

      const auditPub = pathname.match(/^\/api\/v1\/audit\/appeals\/([^/]+)\/publish$/)
      if (auditPub && method === 'POST') {
        await readBody(req as IncomingMessage)
        writeJson(resHttp, 200, { ...sampleAppeal(auditPub[1]), status: 'Решено' })
        return
      }

      if (method === 'GET' && pathname === '/api/v1/audit/appeals') {
        writeJson(resHttp, 200, {
          items: [{ ...sampleAppeal('a-9'), status: 'На аудите' }],
          page: 0,
          size: 50,
        })
        return
      }

      const auditCard = pathname.match(/^\/api\/v1\/audit\/appeals\/([^/]+)$/)
      if (auditCard && method === 'GET') {
        writeJson(resHttp, 200, { ...sampleAppeal(auditCard[1]), status: 'На аудите' })
        return
      }

      // --- Notifications ---
      if (method === 'GET' && pathname === '/api/v1/notifications') {
        writeJson(resHttp, 200, {
          items: [
            {
              id: 'n1',
              type: 'new_written_appeal',
              title: 'Новое письменное обращение',
              read: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })
        return
      }

      const notifRead = pathname.match(/^\/api\/v1\/notifications\/([^/]+)\/read$/)
      if (notifRead && method === 'PATCH') {
        writeJson(resHttp, 200, { id: notifRead[1], read: true })
        return
      }

      // --- CRM ---
      if (method === 'GET' && pathname.startsWith('/api/v1/crm/clients/search')) {
        writeJson(resHttp, 200, {
          hits: [
            {
              id: 'c-mock-1',
              name: 'Петров П.П.',
              inn: '7707083893',
              phone: '+79001112233',
              type: 'individual',
              matchScore: 0.95,
            },
          ],
        })
        return
      }

      if (method === 'POST' && pathname === '/api/v1/crm/clients') {
        const rawBody = await readBody(req as IncomingMessage)
        let body: Record<string, unknown> = {}
        try {
          body = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {}
        } catch {
          writeJson(resHttp, 400, err(400, 'BAD_JSON', 'Некорректный JSON'))
          return
        }
        if (!body.name && !body.phone && !body.inn) {
          writeJson(resHttp, 422, err(422, 'VALIDATION', 'Укажите name, phone или inn'))
          return
        }
        const id = `c-mock-${Date.now()}`
        writeJson(resHttp, 201, {
          id,
          name: String(body.name ?? 'Клиент'),
          inn: String(body.inn ?? ''),
          phone: String(body.phone ?? ''),
          type: body.type === 'organization' ? 'organization' : 'individual',
          matchScore: 1,
        })
        return
      }

      // --- Stats registrar ---
      if (method === 'GET' && pathname === '/api/v1/stats/registrar/month') {
        writeJson(resHttp, 200, { withoutErrors: 145, withErrors: 12, total: 157 })
        return
      }

      // --- Auth probe ---
      if (method === 'GET' && pathname === '/api/v1/me') {
        const auth = (req as IncomingMessage).headers.authorization
        if (!auth || !auth.startsWith('Bearer ')) {
          writeJson(resHttp, 401, err(401, 'UNAUTHORIZED', 'Требуется Bearer JWT'))
          return
        }
        writeJson(resHttp, 200, { sub: 'user-mock', roles: ['REGISTRAR', 'RESPONSIBLE'] })
        return
      }

      writeJson(resHttp, 404, err(404, 'NOT_FOUND', `Маршрут не реализован в моке: ${method} ${pathname}`))
    } catch (e) {
      writeJson(resHttp, 500, err(500, 'INTERNAL', 'Ошибка мок-сервера', String(e)))
    }
  }
}
