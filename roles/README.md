# Роли и навыки (формат Anthropic)

Навыки оформлены как каталоги с **`SKILL.md`** (как в [anthropics/skills](https://github.com/anthropics/skills)). Каталог **`roles/`** — универсальные шаблоны (креатив, документы, коммуникации).

## Связь с Cursor в этом репозитории

Для работы по ТЗ и коду **EDO Bank** используйте каталог **`.cursor/skills/`** — навыки с префиксом **edo-** (`edo-ui-analyst`, `edo-frontend-dev`, `edo-qa-review`). Описание ролей и таблица соответствия — в **`AGENTS.md`** в корне репозитория.

Каталог **`roles/`** можно копировать в `.cursor/skills/` как дополнение (например `roles/development-technical/` → `.cursor/skills/development-technical/`), если нужны паттерны из upstream — это не заменяет проектные правила в `.cursor/rules/` и навыки **edo-\***.

## Сборник [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)

Папка **`roles/claude-skills/`** — **git submodule**: большой набор навыков и плагинов для Claude Code, Codex, Gemini CLI, Cursor и др. (см. лицензию и README в самом submodule).

После клонирования репозитория EDO:

```bash
git submodule update --init --recursive roles/claude-skills
```

Обновить submodule до последнего `main` на GitHub:

```bash
git submodule update --remote roles/claude-skills
```

Отдельный навык в Cursor: скопируй каталог, где лежит **`SKILL.md`** (часто это `…/skills/<имя>/`), в **`.cursor/skills/<имя>/`**, либо подключи через настройки Cursor к каталогу с навыками — см. [Creating Agent Skills](https://github.com/anthropics/skills#creating-a-basic-skill).

## Подключение шаблонов из roles/

1. Создай папку `.cursor/skills/` в корне репозитория (если её ещё нет).
2. Скопируй нужную папку, например:
   - `roles/development-technical/` → `.cursor/skills/development-technical/`
3. Перезапусти чат или укажи в запросе навык по имени папки.

Подробности о формате: [Creating Agent Skills](https://github.com/anthropics/skills#creating-a-basic-skill) в README Anthropic.

## Содержимое roles/

| Папка | Назначение |
|--------|------------|
| `creative-design/` | Креатив, визуал, дизайн-системы |
| `development-technical/` | Разработка, тесты, инструменты, MCP |
| `enterprise-communication/` | Коммуникации, документы для бизнеса |
| `document-skills/` | Работа с PDF, DOCX, таблицами и т.п. (ориентир на паттерны из upstream) |
| `claude-skills/` | Submodule: универсальные навыки из [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) (engineering, product, marketing, compliance и др.) |

Для production-сложных document-навыков смотри исходники в репозитории Anthropic: `skills/docx`, `skills/pdf`, `skills/pptx`, `skills/xlsx`.
