/**
 * Единая база для вызовов `/api/v1/*`: сначала VITE_EDO_API_BASE, иначе VITE_API_URL, иначе относительный путь.
 * Избегает расхождения: регистрация (edoCabinetApi) и кабинеты (appealApi) бьют в один и тот же хост.
 */
function trimBase(s: string | undefined): string {
  return typeof s === 'string' ? s.trim().replace(/\/$/, '') : '';
}

export function edoApiV1BaseUrl(): string {
  const primary = trimBase(import.meta.env.VITE_EDO_API_BASE as string | undefined);
  const fallback = trimBase(import.meta.env.VITE_API_URL as string | undefined);
  const host = primary || fallback;
  if (!host) return '/api/v1';
  if (host.endsWith('/api/v1')) return host;
  return `${host}/api/v1`;
}
