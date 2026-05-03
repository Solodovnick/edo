---
name: edo-frontend-dev
description: >-
  Фронтенд-разработчик EDO Bank (React + TypeScript + Tailwind + shadcn/ui).
  Применять когда нужно реализовать или доработать компонент, исправить баг,
  добавить экран или логику в src/app/components/, src/services/, src/data/.
---

# EDO Bank — Фронтенд-разработчик

## Когда применять

- Новый или изменённый компонент в `src/app/components/`.
- Доработка кабинетов (ответственный, аудитор и др. по ТЗ).
- Исправление дефектов UI и поведения по сценариям из ТЗ.
- Mock-данные в `src/data/` и обращение к ним через `src/services/`.

## Инструкции

1. Перед изменениями свериться с `docs/functional-requirements.md`, `docs/ui-ux-brief.md`, `docs/design-system-plan.md`.
2. **Стек:** React 18 + TypeScript (strict) + Tailwind CSS 4 + shadcn/ui + Radix + MUI. Новые зависимости — только с согласованием и записями в `docs/artifacts-catalog.md` и ADR.
3. **Компоненты:** один файл — один компонент; пропсы типизировать; избегать `any`.
4. **Стили:** утилиты Tailwind и переменные из `default_shadcn_theme.css`; не размазывать токены по inline-стилям.
5. **Данные:** инкапсуляция в `src/services/`; компоненты не ходят в `localStorage` напрямую, если для этого уже есть сервисный слой.
6. Карточка обращения по ТЗ — ориентир на трёхколоночный layout (боковые панели + центр).
7. В конце работы — короткий отчёт: какие пункты FR затронуты.

## Ограничения

- Не менять контракт ТЗ молча: сначала правка `docs/functional-requirements.md` по согласованию.
- Не подключать библиотеки вне списка и процедуры из `ui-core.mdc`.

## Ориентиры по файлам (не исчерпывающий список)

| Область | Примеры файлов | FR (из docs) |
|---|---|---|
| Таблица обращений | `Applications.tsx` | FR-04 |
| Карточка | `ApplicationDetail.tsx` | FR-04 |
| Аудит | `Audit.tsx` | FR-05 |
| CRM / клиент | поля в карточках | FR-06 |
| Дашборд | `Dashboard.tsx`, `KPICards.tsx` | FR-07 |
| SLA | `SLAMonitoring.tsx` | FR-03 |
