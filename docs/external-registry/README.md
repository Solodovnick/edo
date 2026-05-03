# Внешние реестры (импорт из проектной документации)

**Version:** 1.0.2 | **Date:** 2026-05-03

Файлы в этой папке — **копии или выжимки** из поставки заказчика / рабочих групп (Telegram Desktop и др.), чтобы команда опиралась на одни и те же коды UC и формулировки без поиска по диску.

| Файл | Описание |
|---|---|
| [use-case-registry.csv](use-case-registry.csv) | Реестр Use Case. Дубликат поставки — также в `docs/incoming-artifacts/use-cases-export-594e282f/…/Реестр+Use+Case+….csv` (содержимое совпадает). |
| [excel-to-markdown.md](excel-to-markdown.md) | **Процесс:** как переносить таблицы из Excel в Markdown/CSV в репозитории; утилита `scripts/tabular-to-markdown.mjs`, команда `npm run tabular-to-md`. |

**Примечание:** полный ZIP «Техническое проектирование IT-решений» при распаковке может давать предупреждения из‑за длинных имён файлов в архиве; первичный источник по UC — данный CSV и документы `docs/use-case-registry.md`, `docs/use-case.md`.
