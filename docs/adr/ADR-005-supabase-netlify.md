# ADR-005: Supabase (клиент) для деплоя на Netlify

**Status:** Accepted | **Date:** 2026-05-06 | **Version:** 1.0.0

---

## Контекст

- Хостинг фронтенда на **Netlify**; нужна интеграция с **Supabase** (PostgreSQL, при необходимости Auth, Storage, Edge Functions).
- По умолчанию UI остаётся SPA (см. [ADR-001](ADR-001-frontend-spa.md)); учебный REST+PG контур описан в [ADR-004](ADR-004-education-demo-backend.md). Supabase — **дополнительный** вариант управляемой БД и BaaS, не отменяет локальный/Netlify Postgres без явного переключения конфигурации.

## Решение

1. В зависимости проекта добавлены официальные пакеты:
   - **`@supabase/supabase-js`** — браузерный и серверный клиент к API Supabase.
   - **`@supabase/ssr`** — утилиты для сессий через cookie в SSR/серверных средах (Netlify Functions, при необходимости фреймворки с SSR).
2. URL проекта и ключи (`SUPABASE_URL`, `SUPABASE_ANON_KEY`; для сервера — service role только в секретах Netlify, не в клиентском бандле) задаются через **переменные окружения** Netlify и не коммитятся в репозиторий.
3. Подключение к данным приложения через Supabase выполняется **точечно** (отдельные модули/сервисы), без массовой замены контракта UI до согласования с `docs/functional-requirements.md`.

## Последствия

- Нужно вести учёт секретов в Netlify и политик RLS в Supabase при работе с персональными данными.
- `@supabase/ssr` имеет смысл при появлении серверных обработчиков с cookie-сессиями; для чистого Vite SPA в браузере достаточно `createClient` из `@supabase/supabase-js`.

## Зависимости (зафиксировано в `package.json`)

| Пакет | Назначение |
|---|---|
| `@supabase/supabase-js` | Клиент Supabase |
| `@supabase/ssr` | Cookie-based сессии в SSR / serverless |
