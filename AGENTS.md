# Роли агентов (Cursor) — EDO Bank

**Version:** 1.0.3 | **Date:** 2026-05-03

Правила лежат в `.cursor/rules/*.mdc`. Роли подмешиваются в контекст по `alwaysApply` / `globs` или выбираются вручную.

## Общие правила

| Файл | Назначение |
|---|---|
| `ui-core.mdc` | Всегда: контекст заказа `docs/core-source-context.md`; ТЗ как источник правды (`functional-requirements.md`), стек, согласование отклонений, артефакты и ADR при новых библиотеках |

## Роли по файлам

| Роль | Файл | Когда подключается |
|---|---|---|
| Аналитик (FR / BR) | `role-analyst-requirements.mdc` | `docs/functional-requirements*.md`, `docs/business-requirements.md` |
| Дизайн / UI-спека | `role-design-spec.mdc` | `docs/ui-ux-brief.md`, `docs/design-system-plan.md` |
| Фронтенд (React/TS) | `role-frontend-tsx.mdc` | `**/*.tsx`, `**/*.ts` |
| QA / ревью | `role-qa-review.mdc` | `**/*.tsx`, `**/*.ts` (по запросу на сверку с ТЗ) |
| Интеграция (npm) | `role-integration.mdc` | `package.json`, `package-lock.json` |
| Сборка (Vite/TS) | `role-integration-config.mdc` | `vite.config.*`, `postcss.config.*`, `tsconfig.json` |

## Навыки (Skills) в `.cursor/skills/`

Проектные навыки с префиксом **edo-** — основные для этого репозитория:

| Навык | Папка | Когда использовать |
|---|---|---|
| Аналитик EDO | `edo-ui-analyst/` | Требования, BR/FR, acceptance criteria |
| Разработчик EDO | `edo-frontend-dev/` | Компоненты, сервисы, mock-данные |
| QA EDO | `edo-qa-review/` | Сверка с ТЗ, отчёт о расхождениях |

Отдельно в корне репозитория каталог **`roles/`** — примеры универсальных навыков в формате Anthropic (`creative-design`, `development-technical`, …). Это **не** замена `.cursor/skills/edo-*`: при конфликте для кода и ТЗ EDO Bank приоритет у таблицы выше.

## Источник требований

- **Ядро контекста (прочитать в первую очередь):** `docs/core-source-context.md` — ДУКО, модуль ЭДО, KPI 91%→99%, устные обращения, горизонты 6 мес. / +3 мес. после запуска
- **ТЗ:** `docs/functional-requirements.md`
- **Бизнес-контекст:** `docs/business-requirements.md`
- **Глоссарий и роли:** `docs/glossary.md`
- **Реестр UC (таблица):** `docs/use-case-registry.md`, CSV: `docs/external-registry/use-case-registry.csv`
- **UI / дизайн:** `docs/ui-ux-brief.md`, `docs/design-system-plan.md`
- **Жизненный цикл:** `docs/state-diagram.md`
- **Реестр артефактов и ADR:** `docs/artifacts-catalog.md`, `docs/adr/`
- **Исторические UI-заметки:** `docs/ui-artifacts/`

## Рекомендуемый порядок работы

1. Прочитать `docs/core-source-context.md` (контекст ДУКО и KPI).
2. Зафиксировать или изменить требования в `docs/functional-requirements.md` (и при необходимости `docs/business-requirements.md`).
3. При необходимости обновить `docs/ui-ux-brief.md` / `docs/design-system-plan.md`.
4. Реализовать в `src/app/components/`, `src/services/`, `src/data/` со ссылкой на FR в задаче или коммите.
5. Проверка: запрос «сверка с ТЗ» + навык `edo-qa-review` или роль QA.
