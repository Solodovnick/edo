---
name: edo-kafka-integration
description: >-
  Интеграции и бэкенд вокруг Apache Kafka (skills.sh, Spring, продюсеры/консьюмеры).
  Применять при проектировании или коде очередей, outbox, CDC, учебного Java-API EDO.
---

# EDO Bank — Kafka (skills.sh + локальный каталог)

## Когда применять

- Обсуждение или реализация **асинхронных** сценариев вокруг обращений (события, аудит, нотификации) на базе **Kafka** или аналогов.
- Учебный / демо **Spring Boot** контур из `docs/backend-development-plan.md` с **Spring Kafka**.
- Нужен **чужой** проверенный procedural skill: сначала смотри каталог **[skills.sh `?q=kafka`](https://skills.sh/?q=kafka)**.

## Куда смотреть в репозитории

| Что | Где |
|-----|-----|
| Мета-навык и таблица репозиториев из skills.sh | `roles/kafka-skills-sh/SKILL.md` |
| Готовые тексты `SKILL.md` (vendored) | `roles/kafka-skills-sh/vendor/` |
| Кратко про каталог и API | `roles/kafka-skills-sh/README.md` |

## Инструкции

1. Не противоречь **ТЗ** и домену EDO: Kafka — инфраструктурный слой; требования к экранам по-прежнему из `docs/functional-requirements.md`.
2. Для обзора навыков на skills.sh открой [поиск kafka](https://skills.sh/?q=kafka); для программного списка используй `https://skills.sh/api/search?q=kafka`.
3. Для быстрого старта в чате агента прочитай подходящий файл из `roles/kafka-skills-sh/vendor/*/SKILL.md` (три темы: общая разработка, messaging, Spring Kafka).
4. Если нужен навык из другой строки таблицы в `roles/kafka-skills-sh/SKILL.md` — клонируй репозиторий `source`, найди каталог с `SKILL.md` и при необходимости скопируй в `.cursor/skills/`.

## Ограничения

- Не подменяй **edo-frontend-dev** / **edo-ui-analyst** при работе только над React UI без интеграций.
- Вендорные файлы не правь «по месту» под EDO без явной задачи: лучше обёртка в отдельном проектном документе или ADR.
