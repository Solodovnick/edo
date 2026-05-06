# Data flow: обращение от регистрации до кабинета ответственного (МОО / EDO Bank)

**Версия:** 1.0.0 | **Дата:** 2026-05-06 | **Формат:** Mermaid в Markdown  

**Основание:** [C4 / контейнеры МОО](../c4-architecture-overview.md) (уровни контекста и контейнеров; ссылка на экспорт IcePanel **C3 app** / **C4 context** — `docs/input/c3 app icepanel.json`, `docs/input/c4 context icepanel.json`), [глоссарий и объект «Обращение»](../glossary.md), полный [словарь данных](../incoming-artifacts/slovar-dannykh/Словарьданных.md), [маппинг REST по кабинетам](../api-cabinets.md), UI-наследие регистрации ([`../ui-artifacts/REGISTRATION_PAGE_UPDATE.md`](../ui-artifacts/REGISTRATION_PAGE_UPDATE.md), задача [`frontend-task-registration-appeal-form.md`](frontend-task-registration-appeal-form.md)), [ADR-004](../adr/ADR-004-education-demo-backend.md).

Ниже два слоя: **целевая архитектура IcePanel/C4** (логический поток данных) и **учебный контур в репозитории** (фактические узлы и REST).

---

## 1. Целевой поток данных (C4: МОО Web → Gateway → ядро → БД + интеграции)

Отражает контейнерную диаграмму из [`c4-architecture-overview.md` §3.3](../c4-architecture-overview.md): данные обращения проходят через шлюз к микросервису обработки и в OLTP-хранилище; справочники статусов и клиентский контекст согласованы со **словарём данных**; CRM и прочие системы — по необходимости UC (FR-06 и др.).

```mermaid
flowchart LR
  subgraph actors["Участники / UI"]
    REG_UI["Кабинет регистратора\n(форма, классификация,\nтекст, SLA)"]
    RESP_UI["Кабинет ответственного\n(реестр, карточка)"]
  end

  subgraph moo["МОО — контейнеры (C4)"]
    WEB["МОО Web SPA"]
    GW["API Gateway"]
    MS["МС обработки\nобращений"]
    DB[("БД Master\nобращения + справочники")]
    INT["Интеграции\n(CRM, HD, …)"]
  end

  subgraph dict["Словарь данных (логический)"]
    ENT["Обращение:\nидентификатор, заявитель,\nтип канала, категория,\nсодержание, статус, SLA"]
    STS["Статусы / кабинеты\n(responsible, audit, …)"]
  end

  REG_UI -->|"Данные формы"| WEB
  RESP_UI --> WEB
  WEB -->|"REST JSON"| GW
  GW --> MS
  MS -->|"чтение/запись DTO"| DB
  MS <-->|"контекст клиента,\nпри необходимости"| INT
  MS -.->|"маппинг полей"| ENT
  DB -.-> STS
```

---

## 2. Поток данных в репозитории (SPA ↔ REST v1 ↔ PostgreSQL / мок)

Соответствует реализованному сценарию: **регистрация** (`POST /api/v1/appeals`), **реестр ответственного** (`GET /api/v1/responsible/appeals`), **полная карточка** (`GET /api/v1/appeals/{id}`), таблица `app.appeal_card` и словарь `app.dict_appeal_status` ([`api-cabinets.md` §1–3](../api-cabinets.md)). Клиентский кэш `localStorage` и событие обновления списка — дополнительный контур UI, не заменяющий запись в БД при успешном POST.

```mermaid
flowchart TB
  subgraph spa["EDO Bank SPA (React)"]
    FREG["Форма регистрации\nRegistrationPageEnhanced /\nAppealRegistrationCard"]
    FRESP["Кабинет ответственного\nProcessingCabinetNew"]
    CARD["Карточка обращения\nProcessingCardNew"]
    LS[("localStorage\nedo_appeals")]
  end

  subgraph api["REST /api/v1"]
    PCREATE["POST /appeals\nAppealCreate → resolve body"]
    GLIST["GET /responsible/appeals\nфильтр по dict.cabinets"]
    GDET["GET /appeals/:id\nAppealDto"]
  end

  subgraph srv["Сервер (Node / Vite middleware)"]
    RTR["edoApiRouter\n+ resolveAppealCreateBody"]
    MOCK["edoApiMockMiddleware\n(dev без PG)"]
  end

  subgraph pg["PostgreSQL app.*"]
    TBL[("appeal_card\njsonb data + status_code")]
    DICT[("dict_appeal_status\ncabinets[]")]
  end

  FREG -->|"JSON тела\n(content, type,\nappealType, …)"| PCREATE
  PCREATE --> RTR
  RTR -->|"pool"| TBL
  RTR --> DICT
  PCREATE -.->|"fallback dev"| MOCK

  FREG -->|"при успехе 201\npersistRegisteredAppeal"| LS

  FRESP -->|"fetchResponsible\nCabinetAppeals"| GLIST
  GLIST --> RTR
  RTR -->|"JOIN dict\nresponsible ∈ cabinets"| TBL
  GLIST -.-> MOCK

  FRESP -->|"onOpenAppeal"| GDET
  GDET --> RTR
  GDET -.-> MOCK

  GDET --> CARD

  FREG -.->|"CustomEvent\nedo-appeals-changed"| FRESP
```

---

## 3. Согласование с C3 / IcePanel

Файлы **`docs/input/c3 app icepanel.json`** и **`docs/input/c4 context icepanel.json`** (см. [§4 `c4-architecture-overview.md`](../c4-architecture-overview.md)) описывают **приложения** внутри МОО и связи `modelConnections`. Логические потоки данных на диаграммах выше **сводят** цепочку «веб → API → хранилище обращений» к узлам, совместимым с C3/C4 без дублирования полного графа из 77 объектов IcePanel.

---

## 4. Связанные документы

| Документ | Назначение |
|----------|------------|
| [`sequence-appeal-creation.md`](../sequence-appeal-creation.md) | Пошаговая последовательность UI → API (при наличии в репозитории) |
| [`rest-api-post-appeals-create.md`](rest-api-post-appeals-create.md) | Описание метода создания обращения |
| [`docs/ui-ux-brief.md`](../ui-ux-brief.md), [`docs/design-system-plan.md`](../design-system-plan.md) | Ограничения UI |
