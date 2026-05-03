# Каталог внешних источников и ссылок

**Version:** 1.0.1 | **Date:** 2026-05-03 | **Status:** Active  

**Назначение:** **учёт** материалов (файлы на диске, публичные ссылки, черновики API), которые участвуют в обсуждении EDO Bank / МОО, но **не** подменяют `docs/functional-requirements.md` и остальные утверждённые документы.

**Правило:** этот файл **только каталогизирует** — **не** меняет содержимое перечисленных артефактов. **Проверка, актуализация и перенос в ТЗ/репозиторий** — отдельная работа **проектных ролей** по согласованной задаче.

**Локальные пути** ниже — пример рабочей копии (`C:\Users\TITAN\...`); в другом окружении пути будут свои, смысл — зафиксировать **происхождение** материала.

---

## Реестр

| Код | Наименование | Где находится | Тип | Соответствие в репозитории (если есть) | Статус актуализации |
|-----|----------------|---------------|-----|----------------------------------------|---------------------|
| **EXT-01** | Модель IcePanel (публикация) | [IcePanel share](https://s.icepanel.io/492ugmUYHi6qft/RRuQ) | C4 / ландшафт (интерактив) | Черновик архитектуры: [`c4-architecture-overview.md`](c4-architecture-overview.md) | Ожидает проверки |
| **EXT-02** | OpenAPI — модуль обращений (черновик) | `Telegram Desktop\OpenApi.yaml` (в каталоге загрузок пользователя) | OpenAPI 3.1, `info.title`: МОО | Реальный API не в объёме [ADR-001](adr/ADR-001-frontend-spa.md); mock в SPA | Ожидает проверки |
| **EXT-03** | Экспорт IcePanel «Yaroslavdudchenko's landscape» | Файл `Yaroslavdudchenko's landscape (Current).md` (загрузки) | MD, встроенные диаграммы | См. [`c4-architecture-overview.md`](c4-architecture-overview.md) | Ожидает проверки |
| **EXT-04** | Словарь данных (исходник на диске) | `Словарь+данных\Словарьданных.md` (загрузки) | Словарь сущностей | Импорт в репо: [`incoming-artifacts/slovar-dannykh/Словарьданных.md`](incoming-artifacts/slovar-dannykh/Словарьданных.md); выжимка: [`glossary.md`](glossary.md) | Ожидает проверки |
| **EXT-05** | Архив «Сценарии использования» (ZIP) | Имя вида `Сценарии+использования+594e282f-....zip` (загрузки) | ZIP поставки | Распаковка: [`incoming-artifacts/use-cases-export-594e282f/`](incoming-artifacts/use-cases-export-594e282f/README.md); CSV совпадает с [`external-registry/use-case-registry.csv`](external-registry/use-case-registry.csv) | Импорт зафиксирован; содержимое — по задаче ролей |
| **EXT-06** | SAB Group WIN'26 ЭДО — контекстная диаграмма (CSV/PDF в загрузках) | `SAB Group WIN'26 ЭДО.csv`, `SAB Group WIN'26 ЭДО.pdf` (пример пути: загрузки пользователя) | Экспорт Miro «Context Diagram V2», PDF | Импорт в репо: [`incoming-artifacts/sab-group-win26-edo-context/`](incoming-artifacts/sab-group-win26-edo-context/README.md); ссылка на доску в README импорта | Импорт зафиксирован; сверка с ТЗ — по задаче |

---

## Процесс для проектных ролей (на будущее)

1. Взять строку со статусом «Ожидает проверки».  
2. Сверить с `docs/functional-requirements.md`, BR, UC, ADR.  
3. При необходимости — обновить целевые документы в `docs/`, импорт в `incoming-artifacts/`, версии в `VERSIONS.md` — **отдельным коммитом/задачей**.  
4. В таблице выше сменить статус на «Согласовано / Перенесено в ТЗ» (по шаблону, который примет команда).

---

## Связанные документы

- [`artifacts-catalog.md`](artifacts-catalog.md) — общий реестр артефактов репозитория.  
- [`incoming-artifacts/README.md`](incoming-artifacts/README.md) — что уже импортировано в дерево проекта.  
- [`external-registry/README.md`](external-registry/README.md) — CSV и внешние реестры.
