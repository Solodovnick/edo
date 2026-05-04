const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8080';

// ── Backend DTO (AppealListItemDto) ──────────────────────────────────────────
export interface AppealListItem {
  id: string;
  number: string;
  regDate: string;
  deadline: string;
  appealType: string;
  status: string;
  applicantCategory: string;
  applicantName: string | null;
  organizationName: string | null;
  responsible: string | null;
  priority: string;
  requiresAttention: boolean;
  requiresSignature: boolean;
  auditStatus: string;
  appealCategory: string | null;
}

interface AppealsPage {
  content: AppealListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── UI type (совпадает с интерфейсом в ApplicationsTable) ────────────────────
export interface Application {
  id: string;
  number: string;
  icon: 'mail' | 'phone' | 'building';
  client: string;
  type: string;
  subject: string;
  status: 'new' | 'in-progress' | 'waiting' | 'review' | 'done';
  sla: string;
  slaStatus: 'ok' | 'warning' | 'violated';
  assignedTo: string;
  department: string;
  createdAt: string;
  description: string;
}

// ── Маппинг русский статус → код UI ─────────────────────────────────────────
const STATUS_MAP: Record<string, Application['status']> = {
  'Черновик': 'new',
  'Зарегистрировано': 'new',
  'Назначено': 'new',
  'На ПК': 'waiting',
  'На ответственном, взято': 'in-progress',
  'Запрос в БП': 'waiting',
  'Готово к подписи': 'review',
  'Решено': 'done',
  'Аудит': 'review',
  'На аудите': 'review',
  'Пройден аудит': 'done',
  'Закрыто': 'done',
  'В архиве': 'done',
  'Отказано': 'done',
};

function mapStatus(s: string): Application['status'] {
  return STATUS_MAP[s] ?? 'new';
}

function mapIcon(appealType: string): Application['icon'] {
  if (/устн/i.test(appealType)) return 'phone';
  if (/регул/i.test(appealType)) return 'building';
  return 'mail';
}

function calcSla(deadline: string): { sla: string; slaStatus: Application['slaStatus'] } {
  const now = new Date();
  const dl = new Date(deadline);
  // При нарушении считаем целые сутки
  const totalMs = dl.getTime() - now.getTime();
  const totalMin = Math.floor(totalMs / 60_000);
  const absDays = Math.abs(Math.floor(totalMin / (60 * 24)));
  const absHours = Math.abs(Math.floor((totalMin % (60 * 24)) / 60));
  const absMins = Math.abs(totalMin % 60);

  if (totalMin < 0) {
    const label = absDays > 0
      ? `Нарушено ${absDays}дн ${absHours}ч`
      : `Нарушено ${absHours}ч ${absMins}м`;
    return { sla: label, slaStatus: 'violated' };
  }
  if (totalMin < 60) return { sla: `Осталось ${absMins}м`, slaStatus: 'warning' };
  if (totalMin < 60 * 24 * 2) {
    const label = absDays > 0
      ? `Осталось ${absDays}дн ${absHours}ч`
      : `Осталось ${absHours}ч ${absMins}м`;
    return { sla: label, slaStatus: 'warning' };
  }
  return { sla: `Осталось ${absDays}дн ${absHours}ч`, slaStatus: 'ok' };
}

function toApplication(a: AppealListItem): Application {
  const client = a.applicantName || a.organizationName || '—';
  const subject = a.appealCategory || a.appealType || 'Обращение';
  const { sla, slaStatus } = calcSla(a.deadline);
  return {
    id: a.id,
    number: a.number,
    icon: mapIcon(a.appealType),
    client,
    type: a.appealType,
    subject,
    status: mapStatus(a.status),
    sla,
    slaStatus,
    assignedTo: a.responsible ?? '',
    department: '',
    createdAt: new Date(a.regDate).toLocaleDateString('ru-RU'),
    description: '',
  };
}

// ── Маппинг полей формы → AppealCreateRequest ────────────────────────────────
const PRIORITY_MAP: Record<string, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};
const CLIENT_TYPE_MAP: Record<string, string> = {
  individual: 'Физ лицо',
  organization: 'Юр лицо',
  regulator: 'Регулятор',
};
const APPEAL_TYPE_MAP: Record<string, string> = {
  'Письменное': 'Письменное',
  'Устное': 'Устное',
  'Регуляторная': 'Регулятор',
};

function add15WorkingDays(fromDate: string): string {
  const d = new Date(fromDate);
  let added = 0;
  while (added < 15) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d.toISOString().split('T')[0];
}

// ── Публичные типы для формы ─────────────────────────────────────────────────
export interface CreateComplaintData {
  title: string;
  type: string;
  category: string;
  date: string;
  client: string;
  clientType: 'individual' | 'organization' | 'regulator';
  subject: string;
  description: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  slaDeadline: string;
}

// ── Тип для кабинетов (замена UnifiedAppeal/auditAppealsData) ────────────────
export interface CabinetAppeal {
  id: string;
  number: string;
  regDate: string;
  deadline: string;
  /** appealType из API: Устное | Письменное | Регулятор */
  category: 'Письменное' | 'Устное' | 'Регулятор';
  status: string;
  /** applicantCategory: Физ лицо | Юр лицо | Регулятор */
  applicantCategory: string;
  type: 'Физ лицо' | 'Юр лицо';
  applicantName: string;
  organizationName: string;
  content: string;
  solution: string;
  response: string;
  responsible: string;
  registrar: string;
  appealCategory: string;
  appealSubcategory: string;
  cbs: string;
  phone: string;
  email: string;
  address: string;
  auditStatus: 'pending' | 'approved' | 'rejected';
  priority: 'Высокий' | 'Средний' | 'Низкий';
  requiresAttention: boolean;
  requiresSignature: boolean;
  isMine: boolean;
  deadlineCountdown: { days: number; hours: number; minutes: number };
  attachments: Array<{ id: number; name: string; date: string }>;
  crmComments: Array<{ id: number; author: string; commentDate: string; text: string }>;
  history: Array<{ number: string; date: string; status: string }>;
  viewHistory: Array<{ userId: string; userName: string; timestamp: string; action: string }>;
}

const APPEAL_TYPE_TO_CATEGORY: Record<string, CabinetAppeal['category']> = {
  'Устное': 'Устное',
  'Письменное': 'Письменное',
  'Регулятор': 'Регулятор',
  'Регуляторное': 'Регулятор',
};

const AUDIT_STATUS_MAP: Record<string, CabinetAppeal['auditStatus']> = {
  'На аудите': 'pending',
  'Аудит': 'pending',
  'Пройден аудит': 'approved',
};

function calcDeadlineCountdown(deadline: string): { days: number; hours: number; minutes: number } {
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0 };
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

function listItemToCabinet(a: AppealListItem): CabinetAppeal {
  return {
    id: a.id,
    number: a.number ?? '',
    regDate: a.regDate ?? '',
    deadline: a.deadline ?? '',
    category: APPEAL_TYPE_TO_CATEGORY[a.appealType] ?? 'Письменное',
    status: a.status ?? '',
    applicantCategory: a.applicantCategory ?? '',
    type: a.applicantCategory === 'Физ лицо' ? 'Физ лицо' : 'Юр лицо',
    applicantName: a.applicantName ?? '',
    organizationName: a.organizationName ?? '',
    content: '',
    solution: '',
    response: '',
    responsible: a.responsible ?? '',
    registrar: '',
    appealCategory: a.appealCategory ?? '',
    appealSubcategory: '',
    cbs: '',
    phone: '',
    email: '',
    address: '',
    auditStatus: AUDIT_STATUS_MAP[a.status] ?? (a.auditStatus as CabinetAppeal['auditStatus']) ?? 'pending',
    priority: (a.priority as CabinetAppeal['priority']) ?? 'Средний',
    requiresAttention: a.requiresAttention ?? false,
    requiresSignature: a.requiresSignature ?? false,
    isMine: false,
    deadlineCountdown: calcDeadlineCountdown(a.deadline ?? ''),
    attachments: [],
    crmComments: [],
    history: [],
    viewHistory: [],
  };
}

function fullDtoToCabinet(dto: any): CabinetAppeal {
  return {
    id: dto.id,
    number: dto.number ?? '',
    regDate: dto.regDate ?? '',
    deadline: dto.deadline ?? '',
    category: APPEAL_TYPE_TO_CATEGORY[dto.appealType] ?? 'Письменное',
    status: dto.status ?? '',
    applicantCategory: dto.applicantCategory ?? '',
    type: dto.applicantCategory === 'Физ лицо' ? 'Физ лицо' : 'Юр лицо',
    applicantName: dto.applicantName ?? '',
    organizationName: dto.organizationName ?? '',
    content: dto.content ?? '',
    solution: dto.solution ?? '',
    response: dto.response ?? '',
    responsible: dto.responsible ?? '',
    registrar: dto.registrar ?? '',
    appealCategory: dto.appealCategory ?? '',
    appealSubcategory: dto.appealSubcategory ?? '',
    cbs: dto.cbs ?? '',
    phone: dto.phone ?? '',
    email: dto.email ?? '',
    address: dto.address ?? '',
    auditStatus: AUDIT_STATUS_MAP[dto.status] ?? (dto.auditStatus as CabinetAppeal['auditStatus']) ?? 'pending',
    priority: (dto.priority as CabinetAppeal['priority']) ?? 'Средний',
    requiresAttention: dto.requiresAttention ?? false,
    requiresSignature: dto.requiresSignature ?? false,
    isMine: false,
    deadlineCountdown: calcDeadlineCountdown(dto.deadline ?? ''),
    attachments: (dto.attachments ?? []).map((x: any) => ({ id: x.id, name: x.name, date: x.attachDate ?? '' })),
    crmComments: (dto.crmComments ?? []).map((x: any) => ({ id: x.id, author: x.author, commentDate: x.commentDate, text: x.text })),
    history: (dto.history ?? []).map((x: any) => ({ number: x.relatedNumber ?? '', date: x.relatedDate ?? '', status: x.relatedStatus ?? '' })),
    viewHistory: [],
  };
}

// ── API-вызовы ───────────────────────────────────────────────────────────────
export async function getCabinetAppeals(statuses?: string[]): Promise<CabinetAppeal[]> {
  const res = await fetch(`${API_BASE}/api/appeals?size=200&page=0`);
  if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
  const data: AppealsPage = await res.json();
  const all = data.content.map(listItemToCabinet);
  if (!statuses || statuses.length === 0) return all;
  return all.filter(a => statuses.includes(a.status));
}

export async function getAppealDetail(id: string): Promise<CabinetAppeal> {
  const res = await fetch(`${API_BASE}/api/appeals/${id}`);
  if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
  const dto = await res.json();
  return fullDtoToCabinet(dto);
}

export async function getAppeals(
  page = 0,
  size = 50,
  search?: string,
  status?: string,
  category?: string,
): Promise<{ applications: Application[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (category) params.set('category', category);
  const res = await fetch(`${API_BASE}/api/appeals?${params}`);
  if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
  const data: AppealsPage = await res.json();
  return {
    applications: data.content.map(toApplication),
    total: data.totalElements,
  };
}

export async function createAppeal(data: CreateComplaintData): Promise<{ id: string; number: string }> {
  const isIndividual = data.clientType === 'individual';
  const body: Record<string, unknown> = {
    appealType: APPEAL_TYPE_MAP[data.type] ?? data.type,
    applicantCategory: CLIENT_TYPE_MAP[data.clientType] ?? 'Физ лицо',
    content: data.title ? `${data.title}\n\n${data.description}` : data.description,
    deadline: data.slaDeadline || add15WorkingDays(data.date || new Date().toISOString().split('T')[0]),
    priority: PRIORITY_MAP[data.priority] ?? 'Средний',
    createdBy: 'Оператор',
  };
  if (isIndividual) {
    body.applicantName = data.client;
  } else {
    body.organizationName = data.client;
  }
  if (data.category) body.appealCategory = data.category;
  if (data.assignedTo) body.responsible = data.assignedTo;

  const res = await fetch(`${API_BASE}/api/appeals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Ошибка сохранения: ${res.status}`);
  }
  const created = await res.json();
  return { id: created.id, number: created.number };
}
