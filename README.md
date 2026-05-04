# EDO Bank

Веб-интерфейс **внутреннего модуля ЭДО** банка для департамента **ДУКО** (управление качеством обслуживания): учёт и обработка **обращений** клиентов и регулятора. Исходный UI-магнит: [Figma — EDO-Bank](https://www.figma.com/design/ohKA7YUB4W1nvmFqxpFa7G/EDO-Bank).

---

## 1. Для чего проект

- **Бизнес-цель:** навести порядок в обработке обращений, обеспечить **сроки** и **прослеживаемость** (в т.ч. требования регулятора по своевременным ответам).
- **Контекст заказчика и KPI:** сейчас в срок закрывается **91%** обращений; целевой ориентир — **99%**; после запуска решения — выйти на **99%** в течение **3 месяцев**; горизонт разработки решения — **6 месяцев**.
- **Фокус продукта:** не терять **устные** обращения (телефон, офис) — для них нужны те же уровни **регистрации, статусов и контроля SLA**, что и для письменного потока, в рамках утверждённого ТЗ.
- **Источник правды по смыслу «зачем»:** [`docs/core-source-context.md`](docs/core-source-context.md). Поведение экранов и полей — в [`docs/functional-requirements.md`](docs/functional-requirements.md) и связанных артефактах.

---

## 2. Архитектура проекта

### Слои и стек

| Слой | Технологии и расположение |
|------|---------------------------|
| **Клиент (SPA)** | **React 18** + **TypeScript**, сборка **Vite 6**, стили **Tailwind 4**, компоненты **Radix UI** / **MUI** и др. (`package.json`). Точка входа: `src/main.tsx`, корневое приложение: `src/app/App.tsx`. |
| **UI-код** | Экраны и виджеты в `src/app/components/` (в т.ч. жизненный цикл в `lifecycle/`), общие UI-примитивы в `src/app/components/ui/`. |
| **Данные и интеграция** | Сервисы в `src/services/` (HTTP, здоровье API, локальное хранилище там, где предусмотрено ТЗ), мок-данные в `src/data/`. |
| **Локальный API (демо)** | **Express** в `server/index.mjs` (порт **3001** по умолчанию), пул **PostgreSQL** через `pg`, эндпоинт **`GET /api/health`** для проверки БД. |
| **База данных** | **PostgreSQL 16** в **Docker** (`docker-compose.yml`), инициализация скриптами в `server/init/` (см. `server/init/README.md`). |
| **Сборка / dev-сервер** | Vite на порту **5174**, прокси **`/api` → `http://127.0.0.1:3001`** (`vite.config.ts`). В dev подключён плагин **`edoApiMockPlugin`** для моков OpenAPI там, где это нужно для UI. |
| **Документация и роли** | `docs/` — ТЗ, ADR, диаграммы, отчёты; `AGENTS.md` — роли Cursor; `roles/` — шаблоны навыков и при необходимости submodule сторонних навыков (`roles/README.md`). |
| **Учебный контур «фронт → API → БД»** | По плану курса СА описан **Spring Boot** + PostgreSQL в каталоге **`backend/`** и в [`docs/backend-development-plan.md`](docs/backend-development-plan.md) ([ADR-004](docs/adr/ADR-004-education-demo-backend.md)); текущий минимальный «живой» контур в репозитории — **Node API + Postgres** выше. |

### Схема взаимодействия (локальная разработка)

```mermaid
flowchart LR
  subgraph browser[Браузер]
    SPA[React SPA]
  end
  subgraph dev[Vite dev]
    V[Vite :5174]
    P["proxy /api"]
  end
  subgraph api[Node]
    E[Express server/index.mjs :3001]
  end
  subgraph data[Данные]
    PG[(PostgreSQL Docker :5432)]
  end
  SPA --> V
  V --> P
  P --> E
  E --> PG
```

Модель статусов обращения и переходы согласованы с ТЗ и описаны в [`docs/state-diagram.md`](docs/state-diagram.md) (в т.ч. для будущего REST по обращениям).

---

## 3. Флоу проекта

### Разработка и согласование с ТЗ

1. Прочитать [`docs/core-source-context.md`](docs/core-source-context.md) (контекст ДУКО и KPI).
2. Зафиксировать или изменить требования в [`docs/functional-requirements.md`](docs/functional-requirements.md) и при необходимости [`docs/business-requirements.md`](docs/business-requirements.md).
3. При изменениях UI — сверка с [`docs/ui-ux-brief.md`](docs/ui-ux-brief.md) / [`docs/design-system-plan.md`](docs/design-system-plan.md).
4. Реализация в `src/app/components/`, `src/services/`, `src/data/` с отсылкой к FR в задаче или коммите.
5. Проверка: запрос на сверку с ТЗ и использование навыков/ролей из `AGENTS.md` (в т.ч. `edo-qa-review`).

### Жизненный цикл обращения (продуктовый поток)

В упрощённом виде (детали и роли переходов — в [`docs/state-diagram.md`](docs/state-diagram.md)):

**Черновик** → **Зарегистрировано** → **Назначено** / **На ПК** → работа **на ответственном** (в т.ч. запросы в БП, подпись) → **Решено** → при необходимости **аудит** → **Закрыто** → **В архиве**; на отдельных шагах возможны **отказы** с фиксацией причины.

### Локальный запуск (кратко)

1. Поднять БД:

   ```bash
   npm run db:up
   ```

2. Переменные окружения (один раз):

   ```bash
   cp .env.example .env
   ```

3. Фронт + Node API (Vite проксирует `/api` на API, в шапке — индикатор доступности PostgreSQL):

   ```bash
   npm install
   npm run dev
   ```

Остановка контейнера: `npm run db:down`. Логи Postgres: `npm run db:logs`. Только Vite: `npm run dev:vite`. Только API (при уже запущенной БД): `npm run dev:api`.

По умолчанию: приложение **http://localhost:5174**, Postgres **localhost:5432** (пользователь/БД `edo`, пароль `edo`). После смены DDL см. `server/init/README.md` (часто нужен пересозданный volume: `docker compose down -v && docker compose up -d`).

Если репозиторий клонировали **без** submodule с навыками, один раз подтяните его:

```bash
git submodule update --init --recursive roles/claude-skills
```

---

## Полезные ссылки по репозиторию

| Путь | Содержание |
|------|------------|
| `AGENTS.md`, `.cursor/rules/`, `.cursor/skills/edo-*` | Роли и проектные навыки Cursor для работы по ТЗ EDO Bank |
| `docs/reports/` | Канвас-отчёты и WakaTime, см. `docs/reports/README.md` |
| `docs/ui-artifacts/` | Исторические UI-заметки |
| `src/openapi/` | OpenAPI контракты (в т.ч. для моков/доков) |
| `roles/README.md` | Навыки в формате Anthropic и submodule [claude-skills](https://github.com/alirezarezvani/claude-skills) |
| `roles/kafka-skills-sh/` | Kafka: [skills.sh](https://skills.sh/?q=kafka), vendored `SKILL.md`; в Cursor — навык `edo-kafka-integration` |

Репозиторий на GitHub: [Solodovnick/edo](https://github.com/Solodovnick/edo).
