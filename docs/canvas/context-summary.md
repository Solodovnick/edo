# Context Summary — EDO Bank Project
**Date:** 2026-05-04 | **Branch:** main | **Last commit:** a4601ff

---

## Статус проекта

| Слой | Адрес | Статус |
|---|---|---|
| PostgreSQL (Docker `edo-pg`) | `localhost:5433` | ✅ |
| Spring Boot backend | `localhost:8080` | ✅ |
| Vite frontend | `localhost:5174` | ✅ |
| БД: 29 обращений (V1+V2+V3 Flyway) | — | ✅ |

---

## Что было сделано в этой сессии

### 1. Подключение кабинетов к API (mock → реальные данные)
- **appealApi.ts**: добавлены `CabinetAppeal`, `getCabinetAppeals()`, `getAppealDetail()`
- **ProcessingCabinetNew** → `getCabinetAppeals(['Назначено','На ответственном, взято','Запрос в БП','Готово к подписи'])`
- **ProcessingPageUnified** → карточка через `getAppealDetail(id)` (async)
- **AuditPageUnified** (AuditCabinet + AuditPage) → `getCabinetAppeals(['Аудит','На аудите','Пройден аудит'])`
- **ManagerCabinetPageUnified** → `getCabinetAppeals()` (все статусы)
- Все карточки (`ProcessingCardNew`, `AuditCardDetailed`, `ManagerCardDetailed`) получают данные из полного `AppealDto`

### 2. Фильтры и поиск в Реестре обращений
- **ApplicationsFilters.tsx**: переписан под FR-04.3 — вкладки Все / Физ.лицо / Юр.лицо / Регулятор + SLA-фильтр + debounce поиск
- **Applications.tsx**: фильтры подключены к `getAppeals()`, добавлен empty state
- **Backend**: добавлен `?category=` в Repository/Service/Controller

### 3. SLA-таймер
- Формат: `Осталось 3дн 2ч` / `Нарушено 1дн 4ч` / `Осталось 45м`

### 4. Данные в БД
- Добавлена Flyway-миграция `V3__more_seed_data.sql` — 20 новых обращений
- Итого: 29 обращений, покрывают все статусы всех кабинетов

### 5. Прочие правки
- Опечатка «Запрос в БЛ» → «Запрос в БП» в 4 файлах
- Удалена вкладка Swagger из навигации UI
- Установлен пакет `swagger-ui-react` (для ApiDocsPage, файл оставлен)

---

## Архитектура файлов

```
src/
  services/
    appealApi.ts          ← CabinetAppeal, getCabinetAppeals(), getAppealDetail(),
                             getAppeals() (с фильтрами search/status/category)
  app/
    App.tsx               ← tab-based routing
    components/
      Applications.tsx    ← реестр, подключён к API + фильтры
      ApplicationsFilters.tsx ← FR-04.3 фильтры
      lifecycle/
        ProcessingPageUnified.tsx   ← async card open
        ProcessingCabinetNew.tsx    ← API list
        AuditPageUnified.tsx        ← API list + card
        ManagerCabinetPageUnified.tsx ← API list + card
backend/
  src/main/java/bank/edo/
    controller/AppealController.java  ← ?category param
    service/AppealService.java        ← category logic
    repository/AppealRepository.java  ← JPQL query for category+search
  resources/db/migration/
    V1__initial_schema.sql
    V2__seed_data.sql       ← 10 записей
    V3__more_seed_data.sql  ← 20 записей
```

---

## Pending / Следующие шаги

| Приоритет | Задача |
|---|---|
| HIGH | Развёртывание на VPS (2 сервера: бэк+БД / фронт) |
| MED | RegistrationPage — подключить список к API |
| MED | Сохранение статус-переходов из карточек → PATCH /api/appeals/{id} |
| LOW | Тёмная тема (по ТЗ единственная поддерживаемая) |

---

## Ключевые команды запуска (локально)

```bash
# БД
docker start edo-pg

# Бэкенд (порт 8080)
cd backend && mvn spring-boot:run

# Фронтенд (порт 5174)
npm run dev
```

---

## Конфигурация БД
- Container: `edo-pg`, порт `5433`
- User: `edo`, Password: `edo_pass`, DB: `edo_demo`
- Backend application.yml подключается к `localhost:5433/edodb` — **несоответствие**: контейнер создан с `POSTGRES_DB=edo_demo`, но Flyway создаёт схему в той БД, к которой подключается Spring (`edodb`). Проверить при деплое.

---

## Git log (последние коммиты)
```
a4601ff feat: remove Swagger tab from UI navigation
22d2e84 feat: add V3 seed data — 20 appeals across all cabinet statuses
3715cd8 fix: install swagger-ui-react and types for ApiDocsPage
11c4337 feat: connect cabinets to API + filters/search + SLA timer fix
```
