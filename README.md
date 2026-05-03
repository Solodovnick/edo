# EDO

Интерфейс **EDO Bank** (исходный макет: [Figma — EDO-Bank](https://www.figma.com/design/ohKA7YUB4W1nvmFqxpFa7G/EDO-Bank)).

В репозитории:

- `docs/core-source-context.md` — **зачем проект** (ДУКО, KPI, устные обращения); читать перед ТЗ
- `docs/reports/wakatime-canvas-report.html` — **канвас-отчёт в браузере** + место под WakaTime; см. `docs/reports/README.md`
- `docs/backend-development-plan.md` — **учебный демо-бэкенд** (REST + PostgreSQL, защита по курсу СА); см. `docs/adr/ADR-004-education-demo-backend.md`
- `docs/` — требования, ADR, **исторические UI-заметки:** `docs/ui-artifacts/`
- `roles/` — примеры навыков Anthropic (`SKILL.md`), см. `roles/README.md`
- `.cursor/rules/` и `.cursor/skills/edo-*` — роли Cursor для этого репозитория (`AGENTS.md`)

**Корень репозитория** — текущая директория клонирования (`Solodovnick/edo`).

## Запуск

```bash
npm install
npm run dev
```

По умолчанию dev-сервер: **http://localhost:5174**

```bash
npm run build
npm run preview
```

---

Привет!
