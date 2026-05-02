# Документация по навыкам (Agent Skills)

В репозитории используются **роли** — папки с файлами `SKILL.md` в формате [Agent Skills](https://agentskills.io).

## Источник паттернов

Официальный каталог примеров и спецификация:

- [anthropics/skills](https://github.com/anthropics/skills) — публичный репозиторий Anthropic: примеры навыков, `spec/`, `template/`
- В README репозитория описаны установка через Claude Code (`/plugin marketplace add anthropics/skills`) и использование в Claude API

## Папка `roles/`

Локальные навыки лежат в `roles/<категория>/SKILL.md`. Их можно:

1. **Скопировать** в проектный каталог Cursor: `.cursor/skills/<имя-навыка>/` (внутри — `SKILL.md`)
2. **Симлинкнуть** категорию из `roles/` в `.cursor/skills/`, если нужна одна общая точка входа

Подробнее — в `roles/README.md`.

## Шаблон навыка

Минимальный `SKILL.md`:

```yaml
---
name: skill-id
description: Что делает навык и когда его применять (для подсказки агенту).
---

# Заголовок

Текст инструкций для агента.
```

Полный шаблон: [template/SKILL.md](https://github.com/anthropics/skills/blob/main/template/SKILL.md) в репозитории Anthropic.
