# Роли агентов (Cursor) — EDO Bank

Правила лежат в `.cursor/rules/*.mdc`. Роли подмешиваются в контекст по `alwaysApply` / `globs` или выбираются вручную.

## Общие правила

| Файл | Назначение |
|---|---|
| `ui-core.mdc` | Всегда: ТЗ как источник правды, стек, согласование |

## Роли по файлам

| Роль | Файл правила | Когда подключается |
|---|---|---|
| Аналитик | `role-analyst-requirements.mdc` | `docs/functional-requirements*.md` |
| Дизайн / UI-спека | `role-design-spec.mdc` | `docs/ui-ux-brief.md`, `docs/design-system-plan.md` |
| Фронтенд (React/TS) | `role-frontend-tsx.mdc` | `**/*.tsx`, `**/*.ts` |
| QA / ревью | `role-qa-review.mdc` | `**/*.tsx` (при запросе «только ревью по ТЗ») |
| Интеграция | `role-integration.mdc` | `**/package.json`, `**/vite.config.*` |

## Навыки (Skills)

| Навык | Папка | Когда использовать |
|---|---|---|
| Аналитик EDO | `.cursor/skills/edo-ui-analyst/` | Анализ требований, работа с FR |
| Разработчик EDO | `.cursor/skills/edo-frontend-dev/` | Реализация компонентов React |
| QA EDO | `.cursor/skills/edo-qa-review/` | Сверка с ТЗ, отчёт о расхождениях |

## Источник требований

- Основной документ: **`docs/functional-requirements.md`**
- UI/UX: **`docs/ui-ux-brief.md`**, **`docs/design-system-plan.md`**
- Артефакты из .edo: **`.edo/*.md`** (исторические MD-файлы с описанием кабинетов)

## Рекомендуемый порядок работы

1. Описать фичу в `docs/functional-requirements.md` (роль аналитика).
2. При необходимости уточнить UI в `docs/ui-ux-brief.md` (роль дизайна).
3. Реализовать в `src/app/components/` с явной ссылкой на FR-разделы.
4. Проверка: запрос «роль QA: только сверка с ТЗ» + ссылка на FR.
