# Контекст и саммари сессии — EDO Bank
**Дата сохранения:** 04.05.2026 00:55 (UTC+3)
**Чат (transcript):** c39e3229-e175-4afa-848e-6c0d17893745

---

## Что было сделано в сессии

### 1. Канвас проекта
- Создан `docs/canvas/edo-canvas.drawio` — визуальная схема проекта.
- Создан `docs/canvas/index.html` — интерактивный HTML-канвас (drag-and-drop, тёмная тема, ссылки на разделы).
- Создан `docs/canvas/README.md` и `docs/canvas/context-summary.md`.

### 2. Синхронизация документации с UI
- Резервные копии: `docs/archive/er-diagram-v1.1.0.md`, `state-diagram-v1.1.0.md`, `functional-requirements-v1.2.2.md`.
- Обновлены: `er-diagram.md` (v1.2.0), `state-diagram.md` (v1.2.0), `functional-requirements.md` (v1.2.3).
- QA-сверка всей документацией команды — исправлены 7 расхождений в `ui-ux-brief.md`, `glossary.md`, `use-case.md`, `project-status-report.md`, `artifacts-catalog.md`, `VERSIONS.md`.

### 3. Разработка бэкенда (Spring Boot 3.2.5 + PostgreSQL 15)

#### Стек
- Java 17 (Eclipse Temurin, portable в `C:\Users\TITAN\jdk17`)
- Apache Maven 3.9.6 (portable в `C:\Users\TITAN\maven`)
- Spring Boot 3.2.5, Spring Data JPA, Flyway, SpringDoc OpenAPI, Lombok
- PostgreSQL 15 в Docker (порт `5433`, контейнер `edo-postgres`)

#### Структура `backend/`
```
backend/
  pom.xml
  backend/README.md
  src/main/java/bank/edo/
    EdoBankApplication.java
    entity/     Appeal, AppealStatus, Attachment, CrmComment, HistoryEntry
    repository/ AppealRepository, AppealStatusRepository
    dto/        AppealDto, AppealListItemDto, AppealCreateRequest, AppealUpdateRequest, ErrorResponse
    service/    AppealService  (валидация переходов статусов по state-diagram.md)
    controller/ AppealController, StatusController, GlobalExceptionHandler
    config/     CorsConfig
    exception/  AppealNotFoundException, InvalidStatusTransitionException
  src/main/resources/
    application.yml        (порт 8080, DB на localhost:5433)
    application-demo.yml
    db/migration/
      V1__create_schema.sql  (схема по er-diagram.md v1.2.0)
      V2__seed_data.sql      (14 статусов + 10 демо-обращений)
```

#### Запуск Docker PostgreSQL
```powershell
docker run -d --name edo-postgres `
  -e POSTGRES_DB=edo_demo `
  -e POSTGRES_USER=edo `
  -e POSTGRES_PASSWORD=edo_pass `
  -p 5433:5432 postgres:15
```

#### Запуск бэкенда
```powershell
cd d:\Systemaanlise\.EdoGitHub\backend
$env:JAVA_HOME = "C:\Users\TITAN\jdk17"
$env:PATH = "C:\Users\TITAN\jdk17\bin;C:\Users\TITAN\maven\bin;" + $env:PATH
mvn spring-boot:run
```

#### Endpoints (когда запущен)
| URL | Описание |
|-----|----------|
| http://localhost:8080/api/appeals | Список обращений |
| http://localhost:8080/api/appeals/{id} | Одно обращение |
| http://localhost:8080/api/statuses | Справочник статусов |
| http://localhost:8080/api/swagger-ui | Swagger UI |

### 4. Известные проблемы и их решения

| Проблема | Решение |
|----------|---------|
| Write-инструмент не записывал файлы на диск | Переход на `[System.IO.File]::WriteAllBytes` в PowerShell |
| UTF-8 BOM в Java-файлах → ошибка компиляции | Скрипт удаления BOM через `WriteAllBytes` |
| PostgreSQL: ошибка аутентификации на порту 5432 | Пересоздание контейнера на порту 5433 |
| Первый символ файлов пропадал при записи | Явная запись байтов с проверкой |

---

## Текущее состояние

| Компонент | Статус |
|-----------|--------|
| Фронтенд (React + Vite) | Разработан, `src/` |
| Бэкенд (Spring Boot) | Реализован, `backend/` |
| База данных | PostgreSQL 15 в Docker (порт 5433), Flyway-миграции применены |
| API | REST, Swagger UI на `/api/swagger-ui` |
| Документация | Синхронизирована с UI (v1.2.x) |

---

## Следующий шаг (рекомендуемый)

Подключить фронтенд к бэкенду: заменить `localStorage`-мок в `src/services/` на fetch-запросы к `http://localhost:8080/api`.

---

*Этот файл обновляется в конце каждой рабочей сессии.*