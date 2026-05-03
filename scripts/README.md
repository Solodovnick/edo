# Скрипты репозитория

## `tabular-to-markdown.mjs`

Конвертация экспорта из Excel (**CSV UTF-8** или **TSV**) в одну **Markdown-таблицу** (GFM). Без дополнительных npm-зависимостей.

```bash
npm run tabular-to-md -- docs/external-registry/example.csv
node scripts/tabular-to-markdown.mjs docs/external-registry/example.csv
```

Процесс и правила размещения файлов: [`docs/external-registry/excel-to-markdown.md`](../docs/external-registry/excel-to-markdown.md).
