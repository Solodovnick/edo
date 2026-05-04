/** Пустая строка = тот же origin (Netlify + rewrite на `/.netlify/functions/api`). Иначе полный URL бэкенда. */
const API_BASE = String((import.meta as any).env?.VITE_API_URL ?? '')
  .trim()
  .replace(/\/$/, '');

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  const days = Math.ceil((dl.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return { sla: `Нарушено ${Math.abs(days)} дн.`, slaStatus: 'violated' };
  if (days === 0) return { sla: 'Срок сегодня', slaStatus: 'warning' };
  if (days <= 2) return { sla: `Осталось ${days} дн.`, slaStatus: 'warning' };
  return { sla: `Осталось ${days} дн.`, slaStatus: 'ok' };
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

// ── API-вызовы ───────────────────────────────────────────────────────────────
export async function getAppeals(
  page = 0,
  size = 50,
  search?: string,
  status?: string,
): Promise<{ applications: Application[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
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
