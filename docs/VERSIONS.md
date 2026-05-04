# Реестр версий документации — EDO Bank

**Version:** 1.4.0 | **Date:** 2026-05-04

Правила версионирования:
- **MAJOR** — структурные изменения документа (переработка разделов)
- **MINOR** — добавление новых разделов или значимого контента
- **PATCH** — правки, уточнения, исправление опечаток

При выпуске новой версии старая копия переносится в `docs/archive/` с суффиксом версии.

Пример: `docs/archive/functional-requirements-v1.0.0.md`

**1.4.0:** Адаптация бэка и фронта под OpenAPI-контракт `edo-backend.openapi.json`. Backend: базовый путь изменён на `/api/v1/`, параметр поиска `search`→`q`, формат ответа `content[]`→`items[]` (`AppealPageDto`), добавлены контроллеры `HealthController`, `StatsController`, `ResponsibleController`, `SecretaryController`, `ManagerController`, `AuditController`, метод `countByStatusIgnoreCase` в `AppealRepository`, CORS покрывает `/api/v1/**`. Frontend: `appealApi.ts` — все пути `/api/appeals`→`/api/v1/appeals`, параметр `search`→`q`, маппинг `AppealsPage.content`→`AppealsPage.items`. Документация: `backend-development-plan.md` v1.1.0 — таблица API актуализирована. Каталог **1.0.25**.

**1.3.2:** QA-проверка всей документации 2026-05-04 — исправлены расхождения: `artifacts-catalog.md` v1.0.24 (A-014 версия 1.0.1→2.0; добавлены A-015 `test-plan.md`, A-016 `test-results.md`; добавлены S-022/S-023/S-024 canvas-файлы; обновлён S-002 до 1.3.2); таблица текущих версий: `business-requirements.md` 1.1.0→1.1.1, `artifacts-catalog.md` 1.0.23→1.0.24; добавлены `test-plan.md` 1.0.0, `test-results.md` 1.0.0, `project-status-report.md` 2.0; исправлено некорректное примечание о несоответствии БД в `canvas/context-summary.md`. Каталог **1.0.24**.

**1.3.1:** QA-сверка документации со стороны всех проектных ролей — исправлены расхождения: `functional-requirements.md` v1.2.3 (примечание об именовании в коде, FR-10.2 полный перечень ролей); `state-diagram.md` v1.2.0 (статусы выровнены с `AppealService.java`, добавлены «На ПК», «Готово к подписи», матрица переходов по ролям); `ui-ux-brief.md` v1.0.2 (раздел 5 переписан под tab-based навигацию `App.tsx`, добавлены все 10 экранов); `glossary.md` v1.0.3 (статус Draft→Active, добавлены «Секретарь ПК», «На ПК», SLA, FCR); `artifacts-catalog.md` v1.0.23 (актуальные версии, добавлены S-022/S-023/S-024). Каталог **1.0.23**.

**1.3.0:** Реализован учебный демо-бэкенд (`backend/`): Spring Boot 3.2.5 + Java 17 + PostgreSQL 15 + Flyway. Flyway-миграции V1 (schema) и V2 (seed: 14 статусов + 10 демо-обращений). Подключён фронтенд к API: `src/services/appealApi.ts`, `Applications.tsx` — данные из БД, `CreateRequest.tsx` — POST при создании. Создан канвас проекта (`docs/canvas/`). Резервные копии документации в `docs/archive/`. Каталог **1.0.22**.

**1.2.1:** матрица ролей команды — `docs/project-roles.md` (зона, опыт, предметная область); ссылка из `AGENTS.md`; **S-020**; каталог **1.0.13**.

**1.2.0:** ядро контекста проекта — `docs/core-source-context.md` (ДУКО, KPI 91→99%, устные обращения, 6 мес. разработки); связки в `README.md`, `AGENTS.md`, `ui-core.mdc`, навык `edo-ui-analyst`; **S-019**; каталог **1.0.12**.

**1.1.9:** импорт из ZIP `Словарь+данных.zip` (словарь + ERD) — `docs/incoming-artifacts/data-dictionary-import-afaff3ea/`; импорт `Ограничения+…b0b7abff…zip` — `docs/incoming-artifacts/constraints-import-b0b7abff/`; **EXT-07**, **EXT-08**; артефакты **S-017**, **S-018**; каталог **1.0.11**.

**1.1.8:** импорт «SAB Group WIN'26 ЭДО» — контекстная диаграмма (Miro export): `docs/incoming-artifacts/sab-group-win26-edo-context/`; учёт **EXT-06** в `docs/external-sources-catalog.md`; каталог артефактов **1.0.10**.

**1.1.7:** Event Storming — диаграмма процесса и три зоны потока в `docs/event-storming.md`; изображение `docs/assets/event-storming-process-overview.png`. Реестр: устранён дубликат строки.

**1.1.6:** учёт внешних источников без правок содержимого артефактов — `docs/external-sources-catalog.md` (**S-015**).

**1.1.5:** импорт полного словаря данных в `docs/incoming-artifacts/slovar-dannykh/`; обновлён `docs/glossary.md`.

**1.1.4:** добавлен `docs/c4-architecture-overview.md` — C4 Context и Container (архитектурный контур МОО).

**1.1.3:** импорт ZIP «Сценарии использования» (594e282f).

**1.1.2:** процесс переноса таблиц из Excel в Markdown/CSV.

**1.1.1:** корень git-репозитория перенесён из подпапки `.edo` в родительский каталог.

---

## Текущие версии

| Документ | Версия | Дата | Статус |
|---|---|---|---|
| `README.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/functional-requirements.md` | 1.2.3 | 2026-05-04 | Active |
| `docs/business-requirements.md` | 1.1.1 | 2026-05-03 | Draft |
| `docs/ui-ux-brief.md` | 1.0.2 | 2026-05-04 | Active |
| `docs/design-system-plan.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/glossary.md` | 1.0.3 | 2026-05-04 | Active |
| `docs/use-case-registry.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/use-case.md` | 1.1.0 | 2026-05-03 | Active |
| `docs/state-diagram.md` | 1.2.0 | 2026-05-04 | Active |
| `docs/er-diagram.md` | 1.2.0 | 2026-05-03 | Active |
| `docs/artifacts-catalog.md` | 1.0.24 | 2026-05-04 | Active |
| `docs/VERSIONS.md` | 1.3.2 | 2026-05-04 | Active |
| `docs/project-roles.md` | 1.1.1 | 2026-05-03 | Active |
| `docs/core-source-context.md` | 1.0.1 | 2026-05-03 | Active |
| `docs/project-status-report.md` | 2.0 | 2026-05-04 | Active |
| `docs/test-plan.md` | 1.0.0 | 2026-05-04 | Active |
| `docs/test-results.md` | 1.0.0 | 2026-05-04 | Active |
| `docs/canvas/context-summary.md` | 1.0.2 | 2026-05-04 | Active |
| `docs/canvas/edo-canvas.drawio` | 1.0.0 | 2026-05-03 | Active |
| `backend/` (Spring Boot demo) | 0.1.0-SNAPSHOT | 2026-05-04 | Active |
| `docs/event-storming.md` | 1.1.0 | 2026-05-03 | Draft |
| `docs/user-story-map.md` | — | — | Planned |
| `docs/c4-architecture-overview.md` | 1.0.0 | 2026-05-03 | Draft |
| `docs/external-sources-catalog.md` | 1.0.2 | 2026-05-03 | Active |
| `docs/ui-artifacts/README.md` | 1.0.0 | 2026-05-03 | Active |
| `docs/incoming-artifacts/README.md` | 1.0.5 | 2026-05-03 | Active |
| `docs/adr/ADR-001-frontend-spa.md` | 1.0.0 | 2026-05-03 | Accepted |
| `docs/adr/ADR-002-ui-stack.md` | 1.0.0 | 2026-05-03 | Accepted |
| `docs/adr/ADR-003-tailwind.md` | 1.0.1 | 2026-05-03 | Accepted |
| `docs/adr/ADR-004-education-demo-backend.md` | 1.0.0 | 2026-05-03 | Accepted |
| `AGENTS.md` | 1.0.8 | 2026-05-04 | Active |
| `.cursor/rules/*` | 1.0.2 | 2026-05-03 | Active |
| `.cursor/skills/edo-*` | 1.0.3 | 2026-05-03 | Active |

---

## Архив

| Документ | Версия | Архивирован | Причина |
|---|---|---|---|
| `docs/archive/er-diagram-v1.1.0.md` | 1.1.0 | 2026-05-03 | Заменён v1.2.0 |
| `docs/archive/state-diagram-v1.1.0.md` | 1.1.0 | 2026-05-03 | Заменён v1.2.0 |
| `docs/archive/functional-requirements-v1.2.2.md` | 1.2.2 | 2026-05-03 | Заменён v1.2.3 |
