---
name: kafka-skills-sh
description: >-
  Каталог навыков по Apache Kafka из открытой директории skills.sh (поиск kafka).
  Локальные копии см. vendor/; для Cursor используйте также edo-kafka-integration.
---

# Kafka — навыки из [skills.sh](https://skills.sh/?q=kafka)

**Открытая директория:** [The Agent Skills Directory — поиск `kafka`](https://skills.sh/?q=kafka). Там же можно смотреть актуальные рейтинги установок.

## Зачем в репозитории EDO

Основной продукт репозитория — UI **EDO Bank** и сопутствующая документация. **Kafka** может понадобиться для интеграционных контуров (события, асинхронные уведомления, стриминг логов обращений) и для учебного **Java/Spring** контура из `docs/backend-development-plan.md`. Этот каталог **не** отменяет приоритет ТЗ и навыков **edo-\***.

## Локальные копии (vendor)

Готовые процедурные навыки (полные тексты `SKILL.md`):

| Тема | Путь в этом репозитории |
|------|-------------------------|
| Разработка под Kafka (общий гайд) | `vendor/mindrally-kafka-development/SKILL.md` |
| Kafka как брокер сообщений | `vendor/claude-dev-suite-messaging-kafka/SKILL.md` |
| Spring for Apache Kafka | `vendor/claude-dev-suite-spring-kafka/SKILL.md` |

## Выдача skills.sh (ориентир, `GET /api/search?q=kafka`)

Таблица собрана из публичного API [skills.sh](https://skills.sh); число установок может меняться. Поле **source** — GitHub `owner/repo` для перехода в исходники.

| Установок (ориентир) | Репозиторий (`source`) | `skillId` |
|----------------------|-------------------------|-----------|
| 354 | mindrally/skills | kafka-development |
| 273 | 404kidwiz/claude-supercode-skills | kafka-engineer |
| 112 | personamanagmentlayer/pcl | kafka-expert |
| 108 | manutej/luxor-claude-marketplace | kafka-stream-processing |
| 45 | jeremylongshore/claude-code-plugins-plus-skills | kafka-producer-consumer |
| 34 | anton-abyzov/specweave | kafka-architecture |
| 33 | jeremylongshore/claude-code-plugins-plus-skills | kafka-stream-processor |
| 31 | oimiragieo/agent-studio | kafka-development-practices |
| 30 | altinity/skills | altinity-expert-clickhouse-kafka |
| 29 | claude-dev-suite/claude-dev-suite | spring-kafka |
| 25 | claude-dev-suite/claude-dev-suite | kafka |

Исключайте из автоподбора навыки без явной темы Kafka в названии (ложные срабатывания fuzzy-поиска).

## Как подключить в Cursor

1. Скопируйте одну из папок `vendor/.../` в `.cursor/skills/<уникальное-имя>/` (внутри должен лежать `SKILL.md`).
2. Либо включите проектный навык **`edo-kafka-integration`** (см. `AGENTS.md`) — он указывает на этот каталог и типовые сценарии.

## Обновление vendor

См. команды в `roles/kafka-skills-sh/README.md` и шапки внутри каждого `vendor/*/SKILL.md`.
