# Реестр версий документации — EDO Bank

**Version:** 1.2.2 | **Date:** 2026-05-03

Правила версионирования:
- **MAJOR** — структурные изменения документа (переработка разделов)
- **MINOR** — добавление новых разделов или значимого контента
- **PATCH** — правки, уточнения, исправление опечаток

При выпуске новой версии старая копия переносится в `docs/archive/` с суффиксом версии.

Пример: `docs/archive/functional-requirements-v1.0.0.md`

**1.2.2:** должности в `docs/project-roles.md` — официальные названия (системный аналитик, архитектор, старший frontend-разработчик и др.), минимум **Senior**, стейкхолдер — руководитель отдела, старший технический писатель; `AGENTS.md` **1.0.5**; **S-020** **1.1.0**; каталог **1.0.14**.

**1.2.1:** матрица ролей команды — `docs/project-roles.md` (зона, опыт, предметная область); ссылка из `AGENTS.md`; **S-020**; каталог **1.0.13**.

**1.2.0:** ядро контекста проекта — `docs/core-source-context.md` (ДУКО, KPI 91→99%, устные обращения, 6 мес. разработки); связки в `README.md`, `AGENTS.md`, `ui-core.mdc`, навык `edo-ui-analyst`; **S-019**; каталог **1.0.12**.

**1.1.9:** импорт из ZIP `Словарь+данных.zip` (словарь + ERD) — `docs/incoming-artifacts/data-dictionary-import-afaff3ea/`; импорт `Ограничения+…b0b7abff…zip` — `docs/incoming-artifacts/constraints-import-b0b7abff/`; **EXT-07**, **EXT-08**; артефакты **S-017**, **S-018**; каталог **1.0.11**.

**1.1.8:** импорт «SAB Group WIN'26 ЭДО» — контекстная диаграмма (Miro export): `docs/incoming-artifacts/sab-group-win26-edo-context/`; учёт **EXT-06** в `docs/external-sources-catalog.md`; каталог артефактов **1.0.10**.

**1.1.7:** Event Storming — диаграмма процесса и три зоны потока в `docs/event-storming.md`; изображение `docs/assets/event-storming-process-overview.png`. Реестр: устранён дубликат строки `event-storming`, `user-story-map` в основной таблице.

**1.1.6:** учёт внешних источников без правок содержимого артефактов — `docs/external-sources-catalog.md` (**S-015**); ссылки из `docs/external-registry/README.md`, `docs/incoming-artifacts/README.md`; каталог **1.0.8**.

**1.1.5:** импорт полного словаря данных в `docs/incoming-artifacts/slovar-dannykh/`; обновлён `docs/glossary.md`.

**1.1.4:** добавлен `docs/c4-architecture-overview.md` — C4 Context и Container (архитектурный контур МОО).

**1.1.3:** импорт ZIP «Сценарии использования» (594e282f) в `docs/incoming-artifacts/use-cases-export-594e282f/`; CSV реестра подтверждён идентичным `use-case-registry.csv`.

**1.1.2:** процесс переноса таблиц из Excel в Markdown/CSV: `docs/external-registry/excel-to-markdown.md`, утилита `scripts/tabular-to-markdown.mjs`, `npm run tabular-to-md`.

**1.1.1:** корень git-репозитория перенесён из подпапки `.edo` в родительский каталог рабочей копии (структура репозитория без вложенной `.edo/`).

---

## Текущие версии

| Документ | Версия | Дата | Статус |
|---|---|---|---|
| `README.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/functional-requirements.md` | 1.2.0 | 2026-05-03 | Active |
| `docs/business-requirements.md` | 1.1.0 | 2026-05-03 | Draft |
| `docs/ui-ux-brief.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/design-system-plan.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/glossary.md` | 1.0.2 | 2026-05-03 | Draft |
| `docs/use-case-registry.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/use-case.md` | 1.1.0 | 2026-05-03 | Active |
| `docs/state-diagram.md` | 1.1.0 | 2026-05-03 | Active |
| `docs/er-diagram.md` | 1.1.0 | 2026-05-03 | Draft |
| `docs/artifacts-catalog.md` | 1.0.14 | 2026-05-03 | Active |
| `docs/VERSIONS.md` | 1.2.2 | 2026-05-03 | Active |
| `docs/project-roles.md` | 1.1.0 | 2026-05-03 | Active |
| `docs/core-source-context.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/event-storming.md` | 1.1.0 | 2026-05-03 | Draft |
| `docs/user-story-map.md` | — | — | Planned |
| `docs/c4-architecture-overview.md` | 1.0.0 | 2026-05-03 | Draft |
| `docs/external-sources-catalog.md` | 1.0.2 | 2026-05-03 | Active |
| `docs/ui-artifacts/README.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/incoming-artifacts/README.md` | 1.0.5 | 2026-05-03 | Active |
| `docs/incoming-artifacts/data-dictionary-import-afaff3ea/README.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/incoming-artifacts/constraints-import-b0b7abff/README.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/incoming-artifacts/sab-group-win26-edo-context/README.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/incoming-artifacts/use-cases-export-594e282f/README.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/incoming-artifacts/slovar-dannykh/README.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/incoming-artifacts/slovar-dannykh/Словарьданных.md` | 1.0.0 | 2026-05-03 | Archive-import |
| `docs/external-registry/README.md` | 1.0.3 | 2026-05-03 | Active |
| `docs/external-registry/excel-to-markdown.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/external-registry/use-case-registry.csv` | 1.0.0 | 2026-05-03 | Active |
| `scripts/README.md` | 1.0.0 | 2026-05-03 | Active |
| `AGENTS.md` | 1.0.5 | 2026-05-03 | Active |
| `.cursor/rules/*` | 1.0.2 | 2026-05-03 | Active |
| `.cursor/skills/edo-*` | 1.0.3 | 2026-05-03 | Active |
| `docs/adr/ADR-001-frontend-spa.md` | 1.0.0 | 2026-05-03 | Accepted |
| `docs/adr/ADR-002-ui-stack.md` | 1.0.0 | 2026-05-03 | Accepted |
| `docs/adr/ADR-003-tailwind.md` | 1.0.1 | 2026-05-03 | Accepted |

---

## Архив

| Документ | Версия | Архивирован | Причина |
|---|---|---|---|
| — | — | — | — |
