# Роли и навыки

Навыки оформлены как каталоги с **`SKILL.md`** (как в [anthropics/skills](https://github.com/anthropics/skills)). Каталог лежит в корне проекта **edo** (`./roles`).

## Подключение в Cursor

1. Создай папку `.cursor/skills/` в корне репозитория **edo** (если её ещё нет).
2. Скопируй нужную роль, например:
   - `roles/development-technical/` → `.cursor/skills/development-technical/`
3. Перезапусти чат или укажи в запросе: «используй навык development-technical».

Подробности о формате: [Creating Agent Skills](https://github.com/anthropics/skills#creating-a-basic-skill) в README репозитория Anthropic.

## Содержимое

| Папка | Назначение |
|--------|------------|
| `creative-design/` | Креатив, визуал, дизайн-системы |
| `development-technical/` | Разработка, тесты, инструменты, MCP |
| `enterprise-communication/` | Коммуникации, документы для бизнеса |
| `document-skills/` | Работа с PDF, DOCX, таблицами и т.п. (ориентир на паттерны из upstream) |

Для production-сложных document-навыков смотри исходники в репозитории Anthropic: `skills/docx`, `skills/pdf`, `skills/pptx`, `skills/xlsx`.
