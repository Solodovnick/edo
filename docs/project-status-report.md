# Отчёт по состоянию проекта — EDO Bank

**Дата:** 2026-05-04 | **Версия отчёта:** 2.0 | **Ветка:** `main` | **Последний коммит:** `3f082e0`

---

## 1. Общий статус

| Компонент | Адрес | Статус |
|---|---|---|
| PostgreSQL (Docker `edo-pg`) | `localhost:5433` | ✅ Работает |
| Spring Boot Backend | `localhost:8080` | ✅ Работает |
| React Frontend (Vite) | `localhost:5174` | ✅ Работает |
| БД: 29 обращений | V1 + V2 + V3 Flyway | ✅ Мигрирована |
| GitHub | [Solodovnick/edo](https://github.com/Solodovnick/edo) | ✅ Актуален |

---

## 2. Стек технологий

### Frontend
| Технология | Версия | Роль |
|---|---|---|
| React | 18 | UI-фреймворк |
| TypeScript | 5.x | Типизация |
| Vite | 5.x | Сборщик |
| Tailwind CSS | 4 | Стили |
| shadcn/ui + Radix UI | — | Компонентная библиотека |
| MUI | 5.x | Дополнительные компоненты |
| Sonner | — | Toast-уведомления |
| Lucide React | — | Иконки |
| swagger-ui-react | — | API-документация (установлен, таб скрыт) |

### Backend
| Технология | Версия | Роль |
|---|---|---|
| Java | 17 (Eclipse Temurin) | Язык |
| Spring Boot | 3.2.5 | Фреймворк |
| Maven | 3.x | Сборка |
| PostgreSQL | 15 | СУБД |
| Flyway | — | Миграции схемы |
| Lombok | — | Кодогенерация |
| Jakarta Validation | — | Валидация DTO |

---

## 3. Архитектура системы

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (Vite :5174)               │
│                                                       │
│  App.tsx                                              │
│  ├── Header (навигация по ролям)                     │
│  ├── Applications (Реестр обращений) ──────────┐     │
│  ├── RegistrationPage (Регистратор)            │     │
│  ├── ProcessingPage (Ответственный) ───────────┤     │
│  ├── AuditPage (Аудитор) ──────────────────────┤     │
│  ├── ManagerCabinetPage (Руководитель) ────────┤     │
│  └── SecretaryOfficePage (Секретарь)           │     │
│                                                 │     │
│  src/services/appealApi.ts  ←──────────────────┘     │
│  (getAppeals, getCabinetAppeals, getAppealDetail,     │
│   createAppeal)                                       │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP (CORS)
                           ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot :8080)             │
│                                                       │
│  AppealController  →  AppealService                  │
│                    →  AppealRepository               │
│  GET  /api/appeals?search&status&category            │
│  GET  /api/appeals/{id}                              │
│  POST /api/appeals                                   │
│  PATCH /api/appeals/{id}                             │
└──────────────────────────┬──────────────────────────┘
                           │ JDBC (:5433)
                           ▼
┌─────────────────────────────────────────────────────┐
│           PostgreSQL 15 (Docker edo-pg)              │
│                                                       │
│  DB: edo_demo  User: edo                             │
│  V1: schema (appeals, statuses, attachments…)        │
│  V2: seed data  (10 обращений)                       │
│  V3: seed data  (20 обращений)  → итого 29           │
└─────────────────────────────────────────────────────┘
```

---

## 4. Реализованные функции (по FR)

| FR | Требование | Статус | Где реализовано |
|---|---|---|---|
| FR-01 | Создание обращения (форма регистратора) | ✅ | `RegistrationPageEnhanced.tsx` → POST `/api/appeals` |
| FR-02 | Сохранение в БД | ✅ | `AppealService.create()` + Flyway V1 schema |
| FR-03 | Список обращений (реестр) | ✅ | `Applications.tsx` + `getAppeals()` |
| FR-04.3 | Фильтр по типу заявителя (Физ/Юр/Регулятор/Все) | ✅ | `ApplicationsFilters.tsx` + `?category=` в API |
| FR-04.4 | Поиск по имени и номеру | ✅ | `?search=` в API + debounce |
| FR-05 | Кабинет ответственного | ✅ | `ProcessingCabinetNew` → API (4 статуса) |
| FR-06 | Кабинет аудитора | ✅ | `AuditPageUnified` → API (3 статуса) |
| FR-07 | Кабинет руководителя | ✅ | `ManagerCabinetPageUnified` → API (все) |
| FR-10 | Жизненный цикл статусов | ✅ | `AppealService.TRANSITIONS` + state-diagram v1.2.0 |
| FR-17 | Учебный демо-бэкенд (защита) | ✅ | Spring Boot + PostgreSQL + Docker |
| — | SLA-таймер (дни+часы+минуты) | ✅ | `calcSla()` в `appealApi.ts` |
| — | Empty state в реестре | ✅ | `Applications.tsx` (Inbox icon + текст) |
| — | Toast-уведомления | ✅ | Sonner в `CreateRequest`, карточках |

### Не реализовано / в работе
| FR | Требование | Примечание |
|---|---|---|
| FR-08 | Кабинет секретаря | Компонент есть (`SecretaryOfficePage`), к API не подключён |
| FR-09 | Кабинет регистратора — список | Форма работает, список зарегистрированных → ещё mock |
| — | Сохранение переходов статусов из карточек → API | Карточки пишут в localStorage, не в PATCH `/api/appeals/{id}` |
| — | Тёмная тема | По ТЗ единственная поддерживаемая — UI пока светлый |
| — | Деплой на VPS | Следующий шаг |

---

## 5. История изменений артефактов

### 5.1 Документация

| Артефакт | Версия до | Версия после | Что изменилось |
|---|---|---|---|
| `docs/functional-requirements.md` | 1.2.2 | **1.2.3** | Примечание об именовании в коде (`appealType` vs `category`); FR-10.2 — полный перечень ролей |
| `docs/state-diagram.md` | 1.1.0 | **1.2.0** | Статусы выровнены с `AppealService.TRANSITIONS`; добавлены «На ПК», «Готово к подписи»; матрица переходов по ролям |
| `docs/ui-ux-brief.md` | 1.0.1 | **1.0.2** | Раздел 5 переписан — tab-based навигация вместо URL-роутинга; все 10 экранов |
| `docs/glossary.md` | 1.0.2 (Draft) | **1.0.3 (Active)** | Статус Draft→Active; добавлены «Секретарь ПК», «На ПК», «SLA», «FCR» |
| `docs/er-diagram.md` | 1.1.0 | **1.2.0** | Выравнивание со схемой Flyway V1 |
| `docs/artifacts-catalog.md` | 1.0.xx | **1.0.23** | Все версии синхронизированы; добавлены S-022/S-023/S-024 |
| `docs/VERSIONS.md` | 1.2.x | **1.3.1** | Полный changelog; таблица текущих версий |
| `docs/project-status-report.md` | 1.0.1 | **2.0** | Этот документ |
| `docs/canvas/context-summary.md` | 1.0.1 | **1.0.2** | Чекпойнт 2026-05-04 |

### 5.2 Код — Frontend

| Файл | Что было | Что стало |
|---|---|---|
| `src/services/appealApi.ts` | `getAppeals()` + `createAppeal()` | + `CabinetAppeal`, `getCabinetAppeals()`, `getAppealDetail()`, SLA-формат, `?category` |
| `src/app/components/ApplicationsFilters.tsx` | Внутреннее состояние, ничего не эмитил | Полная перезапись: FR-04.3 вкладки, debounce поиск, `onFilterChange` |
| `src/app/components/Applications.tsx` | Загрузка без фильтров, нет пустого состояния | Фильтры → API, empty state |
| `lifecycle/ProcessingCabinetNew.tsx` | `unifiedAppealsData` + `appealStorage` (5 сек polling) | `getCabinetAppeals([4 статуса])`, loading/error |
| `lifecycle/ProcessingPageUnified.tsx` | `allAppeals.find()` по mock-массиву | async `getAppealDetail(id)` при открытии карточки |
| `lifecycle/AuditPageUnified.tsx` | `auditAppealsData` + `appealStorage` | `getCabinetAppeals([3 статуса])` + `getAppealDetail()` |
| `lifecycle/ManagerCabinetPageUnified.tsx` | `unifiedAppealsData` + `appealStorage` | `getCabinetAppeals()` + `getAppealDetail()` |
| `lifecycle/AuditCardDetailed.tsx` | `appealData: typeof auditAppealsData[0]` | `appealData: any` — убрана зависимость от mock |
| `App.tsx` | Таб `api-docs` + импорт `ApiDocsPage` | Таб удалён |
| `Header.tsx` | Кнопка «Swagger» в навигации | Удалена |
| `*4 файла lifecycle` | «Запрос в **БЛ**» | «Запрос в **БП**» |

### 5.3 Код — Backend

| Файл | Что было | Что стало |
|---|---|---|
| `AppealRepository.java` | `findByStatus`, `findBySearch` | + `findByApplicantCategoryIgnoreCase()`, `findByCategoryAndSearch()` JPQL |
| `AppealService.java` | `getAll(page, size, search, status)` | + параметр `category`; приоритизация: category+search → category → search → status → все |
| `AppealController.java` | `?search&status` | + `?category` |
| `AppealListItemDto.java` | Базовые поля | + `organizationName`, `requiresAttention`, `requiresSignature`, `auditStatus`, `appealCategory` |
| `V2__seed_data.sql` | 10 обращений | Без изменений |
| `V3__more_seed_data.sql` | **(не существовал)** | 20 новых обращений по всем статусам |

### 5.4 Зависимости

| Пакет | Тип | Причина |
|---|---|---|
| `swagger-ui-react` | runtime | `ApiDocsPage.tsx` требовал при сборке |
| `@types/swagger-ui-react` | devDependency | TypeScript-типы |

---

## 6. Состояние данных в БД

```sql
status                   | count
-------------------------+-------
На ответственном, взято  |   6
Назначено                |   5
Зарегистрировано         |   4
Решено                   |   3
Аудит                    |   3
Запрос в БП              |   3
Закрыто                  |   2
На ПК                    |   1
На аудите                |   1
Готово к подписи         |   1
                         |  29
```

---

## 7. Git — коммиты сессии

| Хэш | Сообщение |
|---|---|
| `3f082e0` | docs: checkpoint 2026-05-04 — cabinets API, filters, SLA, V3 seed data |
| `a4601ff` | feat: remove Swagger tab from UI navigation |
| `22d2e84` | feat: add V3 seed data — 20 appeals across all cabinet statuses |
| `3715cd8` | fix: install swagger-ui-react and types for ApiDocsPage |
| `11c4337` | feat: connect cabinets to API + filters/search + SLA timer fix |

---

## 8. Следующие шаги (Roadmap)

### Приоритет HIGH
- [ ] **Деплой на VPS** — два сервера: (2vCPU/2GB → backend+PostgreSQL) + (1vCPU/1GB → Nginx+frontend)

### Приоритет MEDIUM
- [ ] **RegistrationPage** — подключить список зарегистрированных обращений к `GET /api/appeals?status=Зарегистрировано`
- [ ] **Сохранение статус-переходов** — карточки `ProcessingCardNew`, `AuditCardDetailed` → `PATCH /api/appeals/{id}` вместо localStorage

### Приоритет LOW
- [ ] **Тёмная тема** — единственная поддерживаемая по ТЗ, но UI пока светлый
- [ ] **SecretaryPage** — подключение кабинета секретаря к API

---

*Документ сгенерирован автоматически агентом Cursor. Актуален на 2026-05-04.*
