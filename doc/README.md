# Документация проекта EDO

В этом репозитории объединены:

- **Приложение** — интерфейс EDO Bank (Vite, React, Tailwind, Radix, MUI и др.), исходно из каталога `edo-bank`.
- **Роли и навыки** — папка `roles/` с файлами `SKILL.md` в формате [Agent Skills](https://agentskills.io).

## Навыки (Agent Skills)

Официальный каталог примеров и спецификация:

- [anthropics/skills](https://github.com/anthropics/skills)
- Подключение в Cursor: скопируйте нужную подпапку из `roles/` в `.cursor/skills/<имя>/` (внутри — `SKILL.md`).

Подробнее — в `roles/README.md`.

## Шаблон `SKILL.md`

```yaml
---
name: skill-id
description: Что делает навык и когда его применять.
---

# Заголовок

Инструкции для агента.
```

Шаблон Anthropic: [template/SKILL.md](https://github.com/anthropics/skills/blob/main/template/SKILL.md).
