# Реестр артефактов — EDO Bank

**Version:** 1.0.6 | **Date:** 2026-05-03 | **Status:** Active

Единый реестр всех проектных артефактов с номерами, статусами и ссылками.

---

## Основные артефакты (A-###)

| ID | Артефакт | Файл | Версия | Статус | Существует |
|---|---|---|---|---|---|
| **A-001** | Функциональные требования | [docs/functional-requirements.md](functional-requirements.md) | 1.2.0 | Active | ✅ |
| **A-002** | Бизнес-требования | [docs/business-requirements.md](business-requirements.md) | 1.1.0 | Draft | ✅ |
| **A-003** | UI/UX Бриф | [docs/ui-ux-brief.md](ui-ux-brief.md) | 1.0.0 | Active | ✅ |
| **A-004** | План дизайн-системы | [docs/design-system-plan.md](design-system-plan.md) | 1.0.0 | Active | ✅ |
| **A-005** | Event Storming | [docs/event-storming.md](event-storming.md) | 1.0.0 | Planned | ⬜ |
| **A-006** | User Story Map | [docs/user-story-map.md](user-story-map.md) | 1.0.0 | Planned | ⬜ |
| **A-007** | State Diagram | [docs/state-diagram.md](state-diagram.md) | 1.1.0 | Active | ✅ |
| **A-008** | Use Cases | [docs/use-case.md](use-case.md) | 1.1.0 | Active | ✅ |
| **A-009** | ER Diagram | [docs/er-diagram.md](er-diagram.md) | 1.1.0 | Draft | ✅ |
| **A-010** | Глоссарий | [docs/glossary.md](glossary.md) | 1.0.0 | Draft | ✅ |
| **A-012** | Архитектура C4 (верхний уровень) | [docs/c4-architecture-overview.md](c4-architecture-overview.md) | 1.0.0 | Draft | ✅ |

## Вспомогательные артефакты (S-###)

| ID | Артефакт | Файл | Версия | Статус |
|---|---|---|---|---|
| **S-001** | README проекта | [README.md](../README.md) | 1.0.0 | Active |
| **S-002** | Реестр версий | [docs/VERSIONS.md](VERSIONS.md) | 1.0.0 | Active |
| **S-003** | ADR-001: Frontend SPA | [docs/adr/ADR-001-frontend-spa.md](adr/ADR-001-frontend-spa.md) | 1.0.0 | Accepted |
| **S-004** | ADR-002: UI Stack | [docs/adr/ADR-002-ui-stack.md](adr/ADR-002-ui-stack.md) | 1.0.0 | Accepted |
| **S-005** | ADR-003: Tailwind CSS | [docs/adr/ADR-003-tailwind.md](adr/ADR-003-tailwind.md) | 1.0.0 | Accepted |
| **S-006** | Agent Skills | [.cursor/skills/](../.cursor/skills/) | 1.0.0 | Active |
| **S-007** | Правила агентов | [.cursor/rules/](../.cursor/rules/) | 1.0.1 | Active |
| **S-008** | Исторические UI-артефакты | [docs/ui-artifacts/](ui-artifacts/) | — | Archive-source |
| **S-009** | Реестр UC (CSV импорт) | [docs/external-registry/use-case-registry.csv](external-registry/use-case-registry.csv) | 1.0.0 | Active |
| **S-010** | Входящие материалы | [docs/incoming-artifacts/README.md](incoming-artifacts/README.md) | 1.0.1 | Active |
| **S-011** | Внешние реестры (описание) | [docs/external-registry/README.md](external-registry/README.md) | 1.0.1 | Active |
| **S-012** | Excel → Markdown (процесс) | [docs/external-registry/excel-to-markdown.md](external-registry/excel-to-markdown.md) | 1.0.0 | Active |
| **S-013** | Скрипты репозитория | [scripts/README.md](../scripts/README.md) | 1.0.0 | Active |

---

## Статусы

| Статус | Описание |
|---|---|
| `Draft` | Документ создан, требует уточнений |
| `Active` | Живой документ, регулярно обновляется |
| `Accepted` | Решение принято, не меняется без нового ADR |
| `Planned` | Запланирован, ещё не создан |
| `Archived` | Устарел, перемещён в `docs/archive/` |

---

## Правила работы с каталогом

1. При создании нового артефакта — добавить строку в таблицу
2. При выпуске новой версии — обновить поле «Версия»
3. При архивировании — переместить запись в `docs/archive/`, статус → `Archived`
4. Нумерация: A-### для основных, S-### для вспомогательных
5. После изменения каталога — обновить `docs/VERSIONS.md`
