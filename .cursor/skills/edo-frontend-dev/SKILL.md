---
name: edo-frontend-dev
description: >-
  Фронтенд-разработчик для EDO Bank (React + TypeScript + Tailwind + shadcn/ui).
  Применять когда нужно реализовать или доработать компонент, исправить баг,
  добавить новый экран или функцию в src/app/components/.
---

# EDO Bank — Фронтенд-разработчик

## Когда применять

- Реализация нового компонента React в `src/app/components/`
- Доработка существующих кабинетов (Ответственного, Аудитора)
- Исправление багов в UI
- Добавление mock-данных в `src/data/`
- Настройка сервисного слоя в `src/services/`

## Инструкции

1. **Всегда читай ТЗ** перед реализацией: `docs/functional-requirements.md` + `docs/ui-ux-brief.md`.
2. **Стек:** React 18 + TypeScript (strict) + Tailwind CSS 4 + shadcn/ui + Radix + MUI. Не добавлять новые зависимости без согласования.
3. **Компоненты:**
   - Один файл — один компонент
   - Интерфейсы пропсов обязательны
   - Нет `any`
4. **Стили:** Tailwind утилиты + CSS-переменные из `default_shadcn_theme.css`. Не inline styles для токенов.
5. **Данные:** только через `src/services/`. Не обращаться напрямую к localStorage из компонентов.
6. **Layout карточки:** трёхколоночный (левый сайдбар / центр / правый сайдбар) — базовый шаблон.
7. После реализации — краткий отчёт: какие FR покрыты.

## Ключевые компоненты

| Компонент | Файл | FR |
|---|---|---|
| Таблица обращений | `Applications.tsx` | FR-04.1—04.4 |
| Карточка обращения | `ApplicationDetail.tsx` | FR-04.5—04.8 |
| Кабинет аудитора | `Audit.tsx` | FR-05 |
| CRM-поиск | inline в карточках | FR-06 |
| Dashboard / KPI | `Dashboard.tsx`, `KPICards.tsx` | FR-07 |
| SLA-мониторинг | `SLAMonitoring.tsx` | FR-03 |
