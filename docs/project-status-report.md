# Статус-отчёт по проекту (canvas-таблицы для обзора)

**Version:** 1.0.0 | **Date:** 2026-05-03 | **Status:** Active  

**Назначение:** единая «холстовая» сводка для презентаций, вики и печати. **Это не интеграция с WakaTime:** [WakaTime](https://wakatime.com) учитывает **время в IDE**, а не хранит такие матрицы; при необходимости таблицы ниже копируйте в Notion / Miro / Confluence.

---

## 1. Суть проекта

| Поле | Содержание |
|------|------------|
| Название | EDO Bank — прототип модуля учёта обращений (SPA) |
| Контекст | ДУКО, KPI 91%→99%, устные обращения |
| Код | React 18, TS, Vite, Tailwind, shadcn/ui; mock + localStorage ([ADR-001](adr/ADR-001-frontend-spa.md)) |
| Учёба | Демо бэк + БД: [ADR-004](adr/ADR-004-education-demo-backend.md), [план](backend-development-plan.md), [FR-17](functional-requirements.md) |

---

## 2. Ключевая документация

| Документ | Зачем |
|----------|--------|
| [core-source-context.md](core-source-context.md) | KPI и «зачем» |
| [functional-requirements.md](functional-requirements.md) | ТЗ (FR) |
| [business-requirements.md](business-requirements.md) | BR |
| [state-diagram.md](state-diagram.md) | ЖЦ |
| [use-case.md](use-case.md) | UC |
| [glossary.md](glossary.md) | Термины |
| [er-diagram.md](er-diagram.md) | ER |
| [c4-architecture-overview.md](c4-architecture-overview.md) | C4 |
| [artifacts-catalog.md](artifacts-catalog.md) | Реестр артефактов |
| [backend-development-plan.md](backend-development-plan.md) | План учебного API |

---

## 3. Цели и решения

| Цель | Решение |
|------|---------|
| UX без сервера | ADR-001, mock |
| Стек UI | ADR-002, ADR-003 |
| KPI заказчика | core-source, BR, FR-03 |
| Защита СА (полный стек) | ADR-004, FR-17, план бэкенда |

---

## 4. ADR (кратко)

| ADR | Суть |
|-----|------|
| [ADR-001](adr/ADR-001-frontend-spa.md) | SPA + mock |
| [ADR-002](adr/ADR-002-ui-stack.md) | UI stack |
| [ADR-003](adr/ADR-003-tailwind.md) | Tailwind |
| [ADR-004](adr/ADR-004-education-demo-backend.md) | Учебный REST + PostgreSQL |

---

## Связанные документы

- [VERSIONS.md](VERSIONS.md) — версии файлов  
- [AGENTS.md](../AGENTS.md) — роли Cursor  
