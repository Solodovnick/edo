# Context Summary — EDO Bank Project
**Date:** 2026-05-04 | **Branch:** main | **Last commit:** acf310f

---

## Статус проекта

| Слой | Адрес | Статус |
|---|---|---|
| PostgreSQL (Docker `edo-pg`) | `localhost:5433` | ✅ |
| Spring Boot backend | `localhost:8080` | ✅ |
| Vite frontend | `localhost:5174` | ✅ |
| БД: 52 обращения (V1+V2+V3 Flyway + тест-данные) | — | ✅ |
| Тестирование: 51/51 PASS | `docs/test-results.md` | ✅ |

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
- Итого seed: 29 обращений; после тестирования: 52

### 5. Тестирование (docs/test-plan.md, docs/test-results.md)
- 4 тест-сьюта, 51 тест-кейс: Happy Path, Alternative Path, позитивные, негативные
- **100% PASS** — все кейсы пройдены
- BUG-001 выявлен и исправлен: `GET /api/appeals/{invalid-uuid}` → 500 исправлено на 400

### 6. Прочие правки
- Опечатка «Запрос в БЛ» → «Запрос в БП» в 4 файлах
- Удалена вкладка Swagger из навигации UI
- GlobalExceptionHandler: добавлены обработчики `MethodArgumentTypeMismatchException`, `IllegalArgumentException`

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
    controller/AppealController.java     ← ?category param
    controller/GlobalExceptionHandler.java ← BUG-001 fix (UUID 400)
    service/AppealService.java           ← category logic
    repository/AppealRepository.java     ← JPQL query for category+search
  resources/db/migration/
    V1__initial_schema.sql
    V2__seed_data.sql       ← 10 записей
    V3__more_seed_data.sql  ← 20 записей
docs/
  test-plan.md            ← 22 тест-кейса
  test-results.md         ← результаты: 51/51 PASS
```

---

## Pending / Следующие шаги

| Приоритет | Задача |
|---|---|
| HIGH | Развёртывание на VPS (2 сервера: бэк+БД / фронт) |
| MED | RegistrationPage — подключить список к API |
| MED | Сохранение статус-переходов из карточек → PATCH /api/appeals/{id} |
| LOW | Тёмная тема (по ТЗ единственная поддерживаемая) |
| LOW | SecretaryPage — подключение к API |

---

## Ключевые команды запуска (локально)

```bash
# БД
docker start edo-pg

# Бэкенд (порт 8080)
cd backend && mvn spring-boot:run
# или: java -jar target/edo-backend-0.1.0-SNAPSHOT.jar

# Фронтенд (порт 5174)
npm run dev
```

---

## Конфигурация БД
- Container: `edo-pg`, порт `5433`
- User: `edo`, Password: `edo_pass`, DB: `edo_demo`
- `application.yml` подключается к `localhost:5433/edo_demo` — совпадает с конфигурацией контейнера ✅

---

## Git log (последние коммиты)
```
acf310f test: add test plan and results (51/51 pass), fix BUG-001 UUID 500 to 400
5148aba docs: project status report v2.0 — full artifact changelog 2026-05-04
3f082e0 docs: checkpoint 2026-05-04 — cabinets API, filters, SLA, V3 seed data
a4601ff feat: remove Swagger tab from UI navigation
22d2e84 feat: add V3 seed data — 20 appeals across all cabinet statuses
3715cd8 fix: install swagger-ui-react and types for ApiDocsPage
11c4337 feat: connect cabinets to API + filters/search + SLA timer fix
```
