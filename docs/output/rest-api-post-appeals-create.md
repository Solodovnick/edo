# Описание REST API: создание обращения (регистрация)

**Версия:** 1.0.0 | **Дата:** 2026-05-06 | **Статус:** справка по контракту и реализации в репозитории  

**Источники:** [api-cabinets.md](../api-cabinets.md) (кабинет регистратора), [functional-requirements.md](../functional-requirements.md) (FR-01, FR-01.5), [ADR-004](../adr/ADR-004-education-demo-backend.md) (демо-БД), OpenAPI [`src/openapi/edo-backend.openapi.json`](../../src/openapi/edo-backend.openapi.json), расширенная схема тела [`docs/schemas/appeal-create-request.schema.json`](../schemas/appeal-create-request.schema.json), нормализация [`server/resolveAppealCreateBody.mjs`](../../server/resolveAppealCreateBody.mjs).

---

## 1. Назначение

Метод **создаёт и регистрирует** новое обращение в системе ЭДО: фиксируется текст, классификация и данные заявителя (по переданным полям), назначаются идентификатор, даты, статус и SLA в соответствии с правилами сервера и словарём статусов в БД.

---

## 2. Идентификация метода

| Параметр | Значение |
|----------|----------|
| **HTTP** | `POST` |
| **Путь (относительно API v1)** | `/appeals` |
| **Полный URL (типичный dev)** | `{origin}/api/v1/appeals` |
| **Базовый префикс в OpenAPI** | `servers[0].url` = `/api/v1` |
| **operationId** | `createAppeal` |
| **Тег OpenAPI** | `Registrar` |
| **Сводка в спецификации** | «Создать и зарегистрировать обращение» |

Альтернативный вход для интеграций (то же тело по смыслу): `POST /complaints/create` (`operationId`: `createComplaintExternal`) — см. OpenAPI.

---

## 3. Заголовки запроса

| Заголовок | Обязательность | Описание |
|-----------|-----------------|----------|
| `Content-Type` | Да | `application/json` |
| `Accept` | Рекомендуется | `application/json` |
| `Authorization` | По политике окружения | Bearer JWT, если включена авторизация (см. OpenAPI `securitySchemes`) |
| `X-Debug-Status` | Нет | Только dev/мок: имитация кода ответа `400`…`500` (см. описание `info` в OpenAPI) |

---

## 4. Тело запроса (JSON)

### 4.1. Контракт OpenAPI (`AppealCreate`)

Минимальная схема в [`edo-backend.openapi.json`](../../src/openapi/edo-backend.openapi.json), компонент **`AppealCreate`**:

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `content` | string | **Да** | Основной текст обращения |

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `category` | string | Нет | Продуктовая категория / тема; на сервере часто маппится в `subcategory` карточки |
| `applicantName` | string | Нет | ФИО заявителя (физлицо) |
| `organizationName` | string | Нет | Наименование организации (юрлицо) |
| `type` | string | Нет | Категория заявителя; допускаются значения вроде «Физ лицо» / «Юр лицо» (см. также `applicantCategory` в расширенной схеме) |
| `phone` | string | Нет | Телефон |
| `email` | string | Нет | E-mail |

### 4.2. Фактически поддерживаемое тело (демо-API + PostgreSQL)

Сервер при разборе тела использует **`resolveAppealCreateBody`**: если `content` пуст, текст подставляется из первого непустого поля среди **`text`**, **`message`**, **`complaintText`**, **`appealText`** (удобно для интеграций). После нормализации для записи в БД используется **`content`**.

Дополнительно принимаются и используются в логике **`pgAddAppealFromV1Create`** / in-memory аналог (см. [`server/edoPgStore.mjs`](../../server/edoPgStore.mjs)) поля в духе:

| Поле | Назначение |
|------|------------|
| `appealType` | Канал обращения: устное / письменное / регулятор (эвристика также по `category`) |
| `applicantCategory` | Синоним `type` для клиентов Spring-стиля |
| `responsible` | ФИО ответственного; пусто или «Не назначено» — пул без персонального назначения |
| `status` | Стартовый статус UI, если входит в допустимое подмножество для кабинета ответственного; иначе выводится из `responsible` |
| `deadline` | Срок ответа (строка в формате UI или ISO — по реализации сервера) |
| `createdBy` | Инициатор записи |
| `inn` | ИНН юрлица (см. JSON Schema) |

Полный перечень ограничений и форматов: [`appeal-create-request.schema.json`](../schemas/appeal-create-request.schema.json).

---

## 5. Ответы

### 5.1. Успех `201 Created`

Тело: объект **`AppealDto`** (см. `#/components/schemas/AppealDto` в OpenAPI) — среди прочего: **`id`**, **`regDate`**, **`status`**, **`deadline`**, **`content`**, данные заявителя, **`appealType`**, **`updatedAt`**.

При активной **PostgreSQL** (`DATABASE_URL`) строка сохраняется в **`app.appeal_card`** (JSON в `data` + `status_code` по словарю [`app.dict_appeal_status`](../../server/init/02-app-dictionary-and-appeals.sql)).

### 5.2. Ошибки

| Код | Когда | Тело (типично) |
|-----|--------|----------------|
| **400** | Некорректный JSON | `Problem` |
| **401** | Нет/невалидный Bearer | `Problem` |
| **422** | Валидация (например отсутствует текст после нормализации в `content`) | `Problem` (`application/problem+json` в моке) |
| **500** | Внутренняя ошибка сервера | `Problem` |

Структура **`Problem`**: см. `#/components/schemas/Problem` в OpenAPI (`title`, `status`, `detail`, …).

---

## 6. Связь с ТЗ и словарём данных

- **FR-01.5:** обязательны категория заявителя, **тип** (канал) обращения и **текст** — на клиенте перед вызовом API; в теле API минимально гарантируется непустой **`content`** (или синоним, приводимый к `content`).
- **FR-01.3–FR-01.4:** номер, дата регистрации, дедлайн формируются на сервере при создании.
- Маппинг сущности «Обращение» на поля DTO: [api-cabinets.md §1](../api-cabinets.md).

---

## 7. Примеры

### 7.1. Минимальный запрос (OpenAPI)

```http
POST /api/v1/appeals HTTP/1.1
Content-Type: application/json

{
  "content": "Прошу разъяснить списание комиссии по операции от 01.05.2026.",
  "category": "Карты",
  "applicantName": "Иванов Иван Иванович",
  "type": "Физ лицо",
  "phone": "+79001234567",
  "email": "ivanov@example.com"
}
```

### 7.2. Расширенный запрос (канал, ответственный, срок)

```json
{
  "content": "Жалоба на задержку ответа.",
  "appealType": "Письменное",
  "type": "Физ лицо",
  "applicantName": "Петрова М.С.",
  "phone": "+79991234567",
  "category": "Вклады",
  "responsible": "Сидоров А.В.",
  "deadline": "21/05/26",
  "createdBy": "Регистратор"
}
```

Готовый файл-пример: [`docs/examples/appeal-create-request.example.json`](../examples/appeal-create-request.example.json).

---

## 8. Реализация в репозитории

| Компонент | Путь |
|-----------|------|
| Маршрут Express | [`server/edoApiRouter.mjs`](../../server/edoApiRouter.mjs) — `POST /v1/appeals` |
| Запись в БД | [`server/edoPgStore.mjs`](../../server/edoPgStore.mjs) — `pgAddAppealFromV1Create` |
| Нормализация тела | [`server/resolveAppealCreateBody.mjs`](../../server/resolveAppealCreateBody.mjs) |
| Vite-мок (dev без Node-API) | [`src/server/edoApiMockMiddleware.ts`](../../src/server/edoApiMockMiddleware.ts) |
| Клиент регистрации | [`src/services/edoCabinetApi.ts`](../../src/services/edoCabinetApi.ts) — `persistRegisteredAppeal` → `POST /appeals` |

Интерактивная проверка контракта: вкладка **«API»** в приложении — Swagger UI на том же JSON, что и [`src/openapi/edo-backend.openapi.json`](../../src/openapi/edo-backend.openapi.json).

---

## 9. Замечание по расхождению OpenAPI и продукта

В минимальном **`AppealCreate`** / части **`AppealDto`** в OpenAPI перечисление **`appealType`** может быть уже «Устное» | «Письменное»; **демо-сервер** дополнительно поддерживает **регуляторный** канал в логике `pgAddAppealFromV1Create`. При публикации внешнего контракта имеет смысл расширить схему OpenAPI и синхронизировать с [`appeal-create-request.schema.json`](../schemas/appeal-create-request.schema.json).
