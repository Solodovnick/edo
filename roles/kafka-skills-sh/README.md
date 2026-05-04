# Kafka — каталог [skills.sh](https://skills.sh/?q=kafka)

В этой папке:

- **`SKILL.md`** — мета-навык: зачем каталог, как обновлять список, куда смотреть в репозитории EDO.
- **`vendor/`** — копии отдельных upstream-`SKILL.md` (с шапкой-атрибуцией) из репозиториев, попадающих в выдачу skills.sh по запросу `kafka`. Лицензии: Apache-2.0 (mindrally), MIT (claude-dev-suite).

Обновить таблицу навыков с skills.sh программно:

```bash
curl -sS 'https://skills.sh/api/search?q=kafka' | python3 -m json.tool | less
```

Чтобы подключить навык в Cursor, скопируй нужную папку с `SKILL.md` в `.cursor/skills/<имя>/` или используй проектный навык **`edo-kafka-integration`** в `.cursor/skills/`.
