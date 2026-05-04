# REST API по кабинетам ЭДО (маппинг на UC и данные)

**Version:** 1.0.0 | **Date:** 2026-05-04 | **Status:** Active  
**Контракт:** [`src/openapi/edo-backend.openapi.json`](../src/openapi/edo-backend.openapi.json) (теги OpenAPI).  
**Интерактив:** экран «API» в приложении — Swagger UI на том же контракте.  
**Реализация в dev:** Vite middleware [`src/server/edoApiMockMiddleware.ts`](../src/server/edoApiMockMiddleware.ts); базовый URL по умолчанию `/api/v1`.  
**Клиент UI:** [`src/services/edoCabinetApi.ts`](../src/services/edoCabinetApi.ts) (`VITE_EDO_API_BASE` — необязательный префикс хоста без `/api/v1`).

**Поднять PostgreSQL и индикатор «БД» в шапке:** `npm run db:up` → `cp .env.example .env` → `npm run dev` (Vite + Node на `:3001`). `GET /api/health` проверяет `DATABASE_URL`; данные кабинетов при активной БД — из `app.appeal_card` (см. `server/init/02-app-dictionary-and-appeals.sql`).

---

## 1. Словарь данных и сущности

| Сущность / атрибут (см. глоссарий) | Поля в `AppealDto` / реестрах |
|-----------------------------------|-------------------------------|
| Обращение (идентификатор, даты, статус, SLA) | `id`, `regDate`, `status`, `deadline`, `updatedAt` |
| Заявитель | `applicantName`, `organizationName`, `type`, `phone`, `email`, `address` |
| Классификация | `category`, `subcategory`, `appealType` |
| Исполнение | `responsible`, `content`, `solution`, `response` |

Полный импорт таблиц: [`docs/incoming-artifacts/slovar-dannykh/Словарьданных.md`](incoming-artifacts/slovar-dannykh/Словарьданных.md). Выжимка: [`docs/glossary.md`](glossary.md).

---

## 2. Кабинет регистрации (Registrar)

| Интерфейс UI | Методы API | Use Case (реестр) |
|--------------|------------|-------------------|
| Создание обращения, реестр | `POST /appeals`, `GET /appeals`, `GET/PATCH /appeals/{appealId}`, `GET /stats/registrar/month` | UC-REG.01–04, UC-REG.02 |

Роль в глоссарии: **Регистратор**.

---

## 3. Кабинет ответственного (Process / Responsible)

| Интерфейс UI | Методы API | Use Case |
|--------------|------------|----------|
| Реестр, карточка, действия | `GET /responsible/appeals`, `GET /responsible/appeals/{appealId}`, `GET .../timeline`, `POST .../actions`, `POST .../attachments:prepareUpload` | UC-PRO.01–06 |

Роль: **Ответственный**. Список в UI строится из API + наложение записей из `localStorage` (тот же id).

---

## 4. Кабинет руководителя (Manager)

| Интерфейс UI | Методы API | Use Case |
|--------------|------------|----------|
| Сводка нагрузки (при наличии виджетов) | `GET /manager/dashboard/summary` | UC-RU-04, UC-AR.01 |
| Реестр обращений | `GET /appeals` (единый реестр, тег Registrar в спецификации) | UC-RU-01, UC-RU-03, UC-RU-04 |

Роль: **Руководитель**.

---

## 5. Кабинет аудитора (Audit)

| Интерфейс UI | Методы API | Use Case |
|--------------|------------|----------|
| Поиск, реестр | `GET /audit/appeals` | UC-AU.01–03 |
| Журнал по обращению | `GET /audit/appeals/{appealId}/log` | UC-AU.03, UC-ADM.01 |

Роль: **Аудитор**. Дополнительно подмешиваются обращения из `localStorage` со статусом «Аудит».

---

## 6. Согласованность с ТЗ и ADR

- Функциональные требования: [`functional-requirements.md`](functional-requirements.md).  
- Учебный контур бэкенда: [`adr/ADR-004-education-demo-backend.md`](adr/ADR-004-education-demo-backend.md).  
- Реестр UC: [`use-case-registry.md`](use-case-registry.md).

---

## 7. Ошибки и отладка

В моке поддерживается заголовок `X-Debug-Status` для имитации HTTP-кодов (см. описание в OpenAPI `info.description`).
