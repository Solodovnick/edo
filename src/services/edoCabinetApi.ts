import { appealStorage, type Appeal } from './appealStorage'
import type { UnifiedAppeal } from '../data/unifiedAppealsData'
import { edoApiV1BaseUrl } from './edoApiBase'

function apiRoot(): string {
  return edoApiV1BaseUrl()
}

async function apiGet<T>(path: string): Promise<T> {
  const url = `${apiRoot()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  return res.json() as Promise<T>
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${apiRoot()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({} as Record<string, unknown>))
    const detail =
      typeof errBody.detail === 'string'
        ? errBody.detail
        : typeof errBody.message === 'string'
          ? errBody.message
          : ''
    throw new Error(detail || `POST ${url} → ${res.status}`)
  }
  return res.json() as Promise<T>
}

export type AppealDto = {
  id: string
  regDate?: string
  category?: string
  subcategory?: string
  status?: string
  deadline?: string
  responsible?: string
  applicantName?: string
  organizationName?: string
  address?: string
  cbs?: string
  type?: string
  isMine?: boolean
  content?: string
  solution?: string
  response?: string
  phone?: string
  email?: string
  appealType?: string
  createdBy?: string
  updatedAt?: string
}

type AppealPage = { items: AppealDto[]; page?: number; size?: number; totalElements?: number }

type ResponsibleListItem = {
  id: string
  publicNumber?: string
  title?: string
  categoryCode?: string
  statusCode?: string
  priorityCode?: string
  updatedAt?: string
  slaDueAt?: string
  flags?: Record<string, unknown>
  applicantName?: string | null
  organizationName?: string | null
  responsible?: string | null
  deadline?: string | null
  appealType?: string | null
  regDate?: string | null
}

type ResponsibleListResponse = { items: ResponsibleListItem[]; nextCursor?: string | null }

type ResponsibleAppealDetail = { header: AppealDto; actionsPreview?: unknown[]; attachments?: unknown[] }

function formatRuShort(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function normalizeApplicantType(t?: string): UnifiedAppeal['type'] {
  if (t === 'Юр лицо' || t === 'Юрлицо') return 'Юр лицо'
  return 'Физ лицо'
}

const STATUS_CODE_TO_RU: Record<string, string> = {
  IN_PROGRESS: 'В работе',
  NOT_ASSIGNED: 'На ответственном, не взято',
  ASSIGNED: 'На ответственном, взято',
  ON_BP: 'На БП',
  ON_PK: 'На ПК',
  ON_HD: 'На HD',
}

export function mapStatusCodeToRu(code?: string): string {
  if (!code) return 'В работе'
  return STATUS_CODE_TO_RU[code] ?? 'В работе'
}

export function appealDtoToUnified(d: AppealDto, extras?: Partial<UnifiedAppeal>): UnifiedAppeal {
  const catRaw = d.category ?? d.appealType ?? 'Письменное'
  const category: UnifiedAppeal['category'] =
    catRaw === 'Устное' || String(catRaw).toLowerCase().includes('уст')
      ? 'Устное'
      : catRaw === 'Регулятор' || String(catRaw).toLowerCase().includes('регулятор')
        ? 'Регулятор'
        : 'Письменное'

  return {
    id: d.id,
    publicNumber: extras?.publicNumber,
    regDate: d.regDate ?? formatRuShort(d.updatedAt),
    category,
    status: d.status ?? 'В работе',
    deadline: d.deadline ?? '—',
    responsible: d.responsible ?? 'Не назначено',
    applicantName: d.applicantName ?? '—',
    organizationName: d.organizationName ?? 'N/A',
    address: d.address ?? '',
    phone: d.phone ?? '',
    type: normalizeApplicantType(d.type),
    appealCategory: d.subcategory,
    appealSubcategory: undefined,
    content: d.content ?? '',
    solution: d.solution ?? '',
    response: d.response ?? '',
    cbs: d.cbs,
    isMine: d.isMine,
    auditStatus: 'pending',
    deadlineCountdown: { days: 0, hours: 0, minutes: 0 },
    attachments: [],
    history: [],
    crmComments: [],
    createdAt: d.updatedAt,
    updatedAt: d.updatedAt,
    ...extras,
    registrar: extras?.registrar ?? d.createdBy,
  }
}

function storageAppealToUnified(a: Appeal): UnifiedAppeal {
  const cat = String(a.category ?? '')
  const category: UnifiedAppeal['category'] =
    cat === 'Устное' || cat === 'устное' ? 'Устное' : cat === 'Регулятор' || cat === 'регулятор' ? 'Регулятор' : 'Письменное'

  return appealDtoToUnified(
    {
      id: a.id,
      regDate: a.regDate,
      category: a.category,
      subcategory: a.subcategory,
      status: a.status,
      deadline: a.deadline,
      responsible: a.responsible,
      applicantName: a.applicantName,
      organizationName: a.organizationName,
      address: a.address,
      cbs: a.cbs,
      type: a.type,
      isMine: a.isMine,
      content: a.content,
      solution: a.solution,
      response: a.response,
      phone: a.phone,
      email: a.email,
      appealType: a.appealType,
      createdBy: a.createdBy,
      updatedAt: a.updatedAt,
    },
    { category }
  )
}

function responsibleRowToUnified(row: ResponsibleListItem): UnifiedAppeal {
  const headerLike: AppealDto = {
    id: row.id,
    regDate: formatRuShort(row.updatedAt),
    category: 'Письменное',
    status: mapStatusCodeToRu(row.statusCode),
    deadline: formatRuShort(row.slaDueAt),
    responsible: 'Не назначено',
    applicantName: row.title ?? '—',
    organizationName: 'N/A',
    address: '',
    type: 'Физ лицо',
    content: '',
    solution: '',
    response: '',
    updatedAt: row.updatedAt,
  }
  return appealDtoToUnified(headerLike, {
    publicNumber: row.publicNumber,
    appealCategory: row.categoryCode,
  })
}

export async function fetchResponsibleAppealDetail(appealId: string): Promise<ResponsibleAppealDetail | null> {
  try {
    return await apiGet<ResponsibleAppealDetail>(`/responsible/appeals/${encodeURIComponent(appealId)}`)
  } catch {
    return null
  }
}

export async function fetchResponsibleListUnified(): Promise<UnifiedAppeal[]> {
  const data = await apiGet<ResponsibleListResponse>('/responsible/appeals')
  return (data.items ?? []).map(responsibleRowToUnified)
}

export async function fetchRegistrarAppealsUnified(): Promise<UnifiedAppeal[]> {
  const data = await apiGet<AppealPage>('/appeals?page=0&size=100')
  return (data.items ?? []).map((i) => appealDtoToUnified(i))
}

function normalizeStoredAppealTypes(appeals: Appeal[]): Appeal[] {
  return appeals.map((appeal) => {
    if (
      appeal.type === 'Регулятор' ||
      appeal.type === 'регулятор' ||
      !(
        appeal.type === 'Физ лицо' ||
        appeal.type === 'Юр лицо' ||
        appeal.type === 'Физлицо' ||
        appeal.type === 'Юрлицо'
      )
    ) {
      console.warn(`Normalizing appeal ${appeal.id}: changing invalid type "${appeal.type}" to "Юр лицо"`)
      return { ...appeal, type: 'Юр лицо' }
    }
    return appeal
  })
}

/** Реестр руководителя: GET `/appeals` + localStorage. */
export async function loadManagerCabinetAppeals(): Promise<UnifiedAppeal[]> {
  let apiRows: UnifiedAppeal[] = []
  try {
    apiRows = await fetchRegistrarAppealsUnified()
  } catch {
    apiRows = []
  }
  const savedUnified = normalizeStoredAppealTypes(appealStorage.getAllAppeals()).map(storageAppealToUnified)
  return mergeUnifiedById(apiRows, savedUnified)
}

export async function fetchAuditAppealsUnified(): Promise<UnifiedAppeal[]> {
  const data = await apiGet<AppealPage & { items: AppealDto[] }>('/audit/appeals?page=0&size=100')
  return (data.items ?? []).map((i) => appealDtoToUnified(i))
}

/** Реестр аудита: GET `/audit/appeals` + обращения из localStorage со статусом «Аудит». */
export async function loadAuditCabinetAppeals(): Promise<UnifiedAppeal[]> {
  let apiRows: UnifiedAppeal[] = []
  try {
    apiRows = await fetchAuditAppealsUnified()
  } catch {
    apiRows = []
  }

  const apiNormalized = apiRows.map((u) =>
    appealDtoToUnified(
      {
        id: u.id,
        regDate: u.regDate,
        category: u.category,
        status: u.status === 'Аудит' || u.status === 'На аудите' ? u.status : 'На аудите',
        deadline: u.deadline,
        responsible: u.responsible,
        applicantName: u.applicantName,
        organizationName: u.organizationName,
        address: u.address,
        type: u.type,
        content: u.content,
        solution: u.solution,
        response: u.response,
        phone: u.phone,
        createdBy: u.registrar,
        updatedAt: u.updatedAt,
      },
      {
        auditStatus: u.auditStatus,
        deadlineCountdown: u.deadlineCountdown,
        isMine: u.isMine,
        attachments: u.attachments,
        history: u.history,
        crmComments: u.crmComments,
        registrar: u.registrar,
      }
    )
  )

  const savedAppeals = appealStorage.getAllAppeals()
  const auditFromStorage = savedAppeals
    .filter((appeal) => appeal.status === 'Аудит')
    .map((appeal) =>
      appealDtoToUnified(
        {
          id: appeal.id,
          regDate: appeal.regDate,
          category: String(appeal.category),
          status: appeal.status,
          deadline: appeal.deadline,
          responsible: appeal.responsible,
          applicantName: appeal.applicantName,
          organizationName: appeal.organizationName,
          address: appeal.address,
          type: appeal.type,
          content: appeal.content,
          solution: appeal.solution,
          response: appeal.response,
          phone: appeal.phone,
          createdBy: appeal.createdBy,
          updatedAt: appeal.updatedAt,
        },
        {
          auditStatus: 'pending' as const,
          deadlineCountdown: { days: 0, hours: 0, minutes: 0 },
          isMine:
            appeal.responsible === 'Расул Рамазанов' ||
            appeal.responsible === 'Александр Солодовников',
          attachments: [],
          history: [],
          crmComments: [],
        }
      )
    )

  return mergeUnifiedById(apiNormalized, auditFromStorage)
}

export type ManagerDashboardSummary = {
  openAppeals: number
  atRisk: number
  closedThisMonth: number
}

export async function fetchManagerDashboardSummary(): Promise<ManagerDashboardSummary | null> {
  try {
    return await apiGet<ManagerDashboardSummary>('/manager/dashboard/summary')
  } catch {
    return null
  }
}

function appealToRegistrarCreateBody(a: Appeal): Record<string, unknown> {
  const body: Record<string, unknown> = {
    content: a.content,
    category: a.subcategory ?? a.category,
    applicantName: a.applicantName,
    organizationName: a.organizationName,
    type: a.type,
    phone: a.phone,
    email: a.email,
    responsible: a.responsible,
    appealType: a.appealType ?? a.category,
    deadline: a.deadline,
    status: a.status,
    createdBy: a.createdBy,
  }
  if (typeof a.inn === 'string' && a.inn.trim()) body.inn = a.inn.trim()
  return body
}

export type PersistRegisteredAppealResult = {
  ok: boolean
  appeal: Appeal
  /** true — ответ 201 от POST /appeals, запись на сервере/в БД */
  apiSynced: boolean
  error?: string
}

/**
 * POST /appeals (сервер/БД при DATABASE_URL); при успехе — merge с ответом и сохранение в localStorage.
 * При ошибке API localStorage не обновляется (нет «ложного» успеха БД).
 */
export async function persistRegisteredAppeal(
  appeal: Appeal,
  save: (a: Appeal) => boolean
): Promise<PersistRegisteredAppealResult> {
  let merged: Appeal = { ...appeal }
  try {
    const created = await apiPost<AppealDto>('/appeals', appealToRegistrarCreateBody(appeal))
    merged = {
      ...merged,
      id: created.id != null ? String(created.id) : merged.id,
      updatedAt: created.updatedAt ?? merged.updatedAt,
      status: created.status ?? merged.status,
      responsible: created.responsible ?? merged.responsible,
      deadline: created.deadline ?? merged.deadline,
      regDate: created.regDate ?? merged.regDate,
      applicantName: created.applicantName ?? merged.applicantName,
      organizationName: created.organizationName ?? merged.organizationName,
      type:
        created.type === 'Юр лицо' || created.type === 'Юрлицо'
          ? 'Юр лицо'
          : created.type === 'Физ лицо' || created.type === 'Физлицо'
            ? 'Физ лицо'
            : merged.type,
    }
    const ok = save(merged)
    return { ok, appeal: merged, apiSynced: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка сети или сервера'
    return { ok: false, appeal: merged, apiSynced: false, error: msg }
  }
}

/** Сначала реестр API, затем наложение локальных (localStorage) по id. */
export function mergeUnifiedById(apiFirst: UnifiedAppeal[], localOverlay: UnifiedAppeal[]): UnifiedAppeal[] {
  const map = new Map<string, UnifiedAppeal>()
  for (const a of apiFirst) map.set(a.id, a)
  for (const a of localOverlay) {
    const base = map.get(a.id)
    map.set(a.id, base ? { ...base, ...a } : a)
  }
  return [...map.values()]
}

export { storageAppealToUnified }
