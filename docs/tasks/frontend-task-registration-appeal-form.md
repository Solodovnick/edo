# Задача (фронт): регистрация обращения + согласованный кабинет ответственного (данные из БД)

**Тип:** разработка / доработка UI и интеграции с REST  
**Приоритет:** P0  
**Дата:** 2026-05-06 | **Версия задачи:** 1.3  

---

## 1. Цель

По нажатию **«Зарегистрировать обращение»** (или эквивалентной CTA на форме регистрации):

1. **В базе данных** создаётся запись обращения (при работающем демо-API с PostgreSQL — `app.appeal_card`; см. [ADR-004](../adr/ADR-004-education-demo-backend.md)).
2. На странице **кабинета ответственного** выполняется **загрузка списка** обращений с сервера (актуальный реестр после регистрации).
3. На странице **кабинета ответственного** по выбранному обращению (в т.ч. только что созданному) загружаются **полные данные карточки из БД** через REST.
4. Поведение согласовано с **ТЗ**, **словарём данных** (выжимка + импорт) и **маппингом кабинетов → API** (`docs/api-cabinets.md`).

Локальный режим без БД / без Node API не отменяет задачу для **целевого** контура: поведение должно быть определено (например, показ предупреждения «БД offline» и отказ в сохранении в БД — по продуктовому решению; минимум — не имитировать успех БД).

---

## 2. Источники (обязательно)

| Документ | Назначение |
|----------|------------|
| [functional-requirements.md](../functional-requirements.md) | **FR-01**, **FR-01.5**, **FR-11** — поля, валидация, типы каналов |
| [glossary.md](../glossary.md) | Объект «Обращение»: идентификатор, тип заявителя, тип обращения, категория, содержание, статус, SLA |
| [api-cabinets.md](../api-cabinets.md) | Регистратор: `POST/GET /appeals`…; **Ответственный:** `GET /responsible/appeals`, `GET /responsible/appeals/{appealId}` … |
| [Словарьданных.md](../incoming-artifacts/slovar-dannykh/Словарьданных.md) | Полный словарь данных (атрибуты сущностей) — именование полей в UI и JSON |
| [business-requirements.md](../business-requirements.md) | BR-03 категории заявителей и типы обращений |
| [state-diagram.md](../state-diagram.md) | Статусы после регистрации; для попадания в выборку кабинета ответственного статус должен относиться к кабинету `responsible` в словаре `app.dict_appeal_status` (см. `server/init/02-*.sql`, `05-*.sql`) |
| [sequence-appeal-creation.md](../sequence-appeal-creation.md) | Последовательность UI → API → БД |
| [edo-backend.openapi.json](../../src/openapi/edo-backend.openapi.json) | `AppealCreate`, `AppealDto`, реестры `/responsible/appeals` |
| [appeal-create-request.schema.json](../schemas/appeal-create-request.schema.json) | Расширенная схема тела создания (в т.ч. синонимы `content`) |
| [REGISTRATION_PAGE_UPDATE.md](../ui-artifacts/REGISTRATION_PAGE_UPDATE.md), [REGISTRATION_UPDATES_DONE.md](../ui-artifacts/REGISTRATION_UPDATES_DONE.md), [REGISTRATION_PREVIEW_OPTIMIZATION.md](../ui-artifacts/REGISTRATION_PREVIEW_OPTIMIZATION.md), [REGISTRATION_TEST_CLIENTS.md](../ui-artifacts/REGISTRATION_TEST_CLIENTS.md) | Макет кабинета/карточки, доработки header/CRM/превью, тестовые клиенты для CRM-сценариев |
| [design-system-plan.md](../design-system-plan.md), [ui-ux-brief.md](../ui-ux-brief.md) | Токены, тёмная тема, ограничения по UI (приоритет над «историческими» цветами из артефактов) |
| [`src/imports/registration-appeal-screen.md`](../../src/imports/registration-appeal-screen.md) | Структурная спека экрана: сегменты заявителя/типа, SLA по типу, База знаний, FCR, валидация сабмита |

### 2.1. Swagger (OpenAPI), JSON Schema и пример JSON для регистрации обращения

**Назначение:** единая точка для контракта тела `POST /api/v1/appeals`, ручного теста (Swagger UI / curl) и сверки полей формы с сервером и словарём.

| Артефакт | Путь / где смотреть |
|-----------|---------------------|
| **Swagger (OpenAPI 3.0)** — источник правды для тегов, путей и минимальной схемы тела | [`src/openapi/edo-backend.openapi.json`](../../src/openapi/edo-backend.openapi.json): `paths./appeals.post` (`operationId`: **`createAppeal`**), `requestBody` → `#/components/schemas/AppealCreate`, ответ **201** → `#/components/schemas/AppealDto`. Базовый URL в спецификации: **`/api/v1`**. |
| **Интерактивный Swagger UI** (Try it out к тому же JSON) | Вкладка приложения «API» → [`src/app/components/ApiDocsPage.tsx`](../../src/app/components/ApiDocsPage.tsx) |
| **Расширенная JSON Schema** тела создания (синонимы текста `content`, `inn`, адрес DaData, `metadata`, enum каналов и т.д.) | [`docs/schemas/appeal-create-request.schema.json`](../schemas/appeal-create-request.schema.json) |
| **Копия схемы для валидации / обмена** | [`docs/output/json schema.json`](../output/json%20schema.json) (держать в соответствии с `docs/schemas/…` при изменениях) |
| **Пример JSON (файл для копирования, Postman, тестов)** | [`docs/examples/appeal-create-request.example.json`](../examples/appeal-create-request.example.json) |
| Исторический YAML (не заменяет JSON в репозитории без синхронизации) | [`docs/input/edo swagger openapi: 3.0.yml`](../input/edo%20swagger%20openapi:%203.0.yml) |

**Согласование:** в OpenAPI объект **`AppealCreate`** сейчас **минимальный** (`required`: только `content`). Расширенная JSON Schema отражает **фактически принимаемое** демо-API и нормализацию (`server/resolveAppealCreateBody.mjs`). При добавлении полей в форму или на сервере обновлять **оба** контракта по [api-cabinets.md](../api-cabinets.md) и не расходиться с моком [`src/server/edoApiMockMiddleware.ts`](../../src/server/edoApiMockMiddleware.ts).

**Минимальный пример тела** (строго в рамках Swagger `AppealCreate`):

```json
{
  "content": "Текст обращения: прошу вернуть комиссию за перевод.",
  "category": "Операции по счёту",
  "applicantName": "Иванов Иван Иванович",
  "type": "Физ лицо",
  "phone": "+79001234567",
  "email": "ivanov@example.com"
}
```

**Расширенный пример** (поля из JSON Schema и реального парсера; полный вариант — в файле [`appeal-create-request.example.json`](../examples/appeal-create-request.example.json)):

```json
{
  "content": "Прошу разобраться в ситуации с задержкой ответа. Требуется письменный ответ в установленный срок.",
  "appealType": "Письменное",
  "type": "Физ лицо",
  "applicantName": "Петрова Мария Сергеевна",
  "phone": "+79991234567",
  "email": "petrova@example.com",
  "category": "Досрочное расторжение договора",
  "responsible": "Сидоров А.В.",
  "deadline": "21/05/26",
  "createdBy": "Регистратор"
}
```

Альтернатива полю `content` для текста (синонимы, валидно по JSON Schema и нормализуется на сервере): `text`, `message`, `complaintText`, `appealText` — см. `anyOf` в [`appeal-create-request.schema.json`](../schemas/appeal-create-request.schema.json).

---

## 3. Маппинг «словарь / ТЗ → поля API» (для формы и DoD)

| Смысл (глоссарий / BR-03) | Поля запроса `POST /api/v1/appeals` (сервер: `pgAddAppealFromV1Create`) | Поля ответа `AppealDto` / карточка |
|----------------------------|------------------------------------------------------------------------|-----------------------------------|
| Содержание обращения | `content` (или синонимы из JSON Schema → нормализуются на сервере) | `content` |
| Тип обращения (устное / письменное / регулятор) | `appealType` / эвристика по `category` | `category`, `appealType` |
| Тип заявителя (физ / юр) | `type` или `applicantCategory` | `type` |
| Заявитель ФЛ | `applicantName`, `phone`, `email` | то же |
| Заявитель ЮЛ | `organizationName`, при необходимости `inn` в расширенной схеме | то же |
| Классификация | `category` → `subcategory` в DTO | `subcategory` |
| Исполнение / постановка | `responsible`, `status`, `deadline`, `createdBy` | `responsible`, `status`, `deadline`, … |
| Идентификатор, даты | — | `id`, `regDate`, `updatedAt` |

Идентификатор после `201` использовать для **последующих GET** (список + деталка).

---

## 4. Сквозной сценарий (acceptance по шагам заказчика)

### 4.1. Шаг 1 — запись в БД

- Форма собирает данные согласно **FR-01.5** и маппингу п. 3.
- Вызов **`POST /api/v1/appeals`** с `Content-Type: application/json` (клиент: расширить/использовать `createAppeal` в `src/services/appealApi.ts` или общий модуль, чтобы **регистрационная карточка** и другие входы не расходились).
- Успех: **`201`**, тело содержит `AppealDto` с **`id`** (и при наличии `number`).
- Ошибка: показ детали из `application/problem+json` или сообщения API без «молчаливого» успеха.

**Предусловие для реальной БД:** подняты Postgres и Node/Netlify API, в окружении задан `DATABASE_URL` (см. README, `GET /api/health`).

### 4.2. Шаг 2 — список на кабинете ответственного

- Кабинет ответственного (вкладка «Процесс» / `ProcessingCabinetNew` или актуальный компонент) при отображении и **после успешной регистрации** запрашивает реестр с сервера методом, предписанным для роли **Ответственный**:  
  **`GET /api/v1/responsible/appeals`** (query `page`, `size`, при необходимости `status`, `q` — см. OpenAPI).  
  Реализация: доработать `src/services/appealApi.ts` и/или использовать/расширить `src/services/edoCabinetApi.ts` (`fetchResponsibleListUnified`), чтобы **не** опираться только на `GET /api/v1/appeals`, если по `docs/api-cabinets.md` для кабинета задан отдельный контракт.
- После создания обращения список **перезагружается** (повторный `GET`), чтобы новая запись отображалась без перезагрузки страницы (событие из формы, общий хук, подъём state в `App.tsx` — на усмотрение реализации, без новых библиотек состояния без ADR).

### 4.3. Шаг 3 — полные данные по обращению из БД

- При выборе строки в реестре (в т.ч. только что созданной) загрузка детали с сервера:
  - **Вариант A (плоская карточка DTO):** `GET /api/v1/appeals/{id}` — уже используется в `getAppealDetail` в `appealApi.ts`, отдаёт `AppealDto` из БД.
  - **Вариант B (агрегат кабинета ответственного):** `GET /api/v1/responsible/appeals/{appealId}` — агрегат `header` + `actionsPreview` + `attachments` по OpenAPI.  
- Задача: **явно выбрать** в PR один контракт для экрана процесса и привести маппинг в `CabinetAppeal` (или отдельный тип) к полям словаря/ТЗ; допускается комбинация: список с `responsible/appeals`, деталь с `appeals/{id}` для полного `AppealDto` из БД.

### 4.4. Согласованность статуса с реестром ответственного

- Новое обращение должно иметь **`status_code`**, у которого в `dict_appeal_status` в массиве **`cabinets` есть `responsible`**, иначе оно **не попадёт** в `GET /responsible/appeals` (фильтр на сервере).  
- Форма регистрации должна выставлять (или по умолчанию получать с бэкенда) такие значения **`status` / `responsible`**, чтобы сценарий «создал → вижу в кабинете ответственного» выполнялся без ручного PATCH (см. `server/edoPgStore.mjs`).

---

## 5. Текущее состояние кода (зазоры)

| Место | Наблюдение |
|-------|------------|
| `src/app/components/lifecycle/ProcessingCabinetNew.tsx` | Список через **`getCabinetAppeals` → `GET /api/v1/appeals`**, а не **`GET /api/v1/responsible/appeals`** |
| `src/services/appealApi.ts` | `createAppeal` шлёт `POST /api/v1/appeals` — ок для БД; проверить соответствие полей форме `RegistrationPageEnhanced` / единый маппер |
| Регистрация | Возможен путь только **localStorage** (`AppealRegistrationCard`) — для задачи нужен **явный** путь сохранения через API при доступной БД |

В PR описать, какой компонент регистрации — **канонический** для сценария с БД.

---

## 6. Нефункциональные ограничения

- Без новых внешних API из браузера (DaData и т.д.) без ADR.
- Новые npm-зависимости — через [artifacts-catalog.md](../artifacts-catalog.md) + ADR.
- Не дублировать несогласованные поля вне **FR / словаря / OpenAPI**.

---

## 7. Definition of Done

- [ ] `POST /api/v1/appeals` после сабмита; в Network видно **201** и тело с `id`; при включённой БД строка появляется в `app.appeal_card` (проверка `psql`/UI health).
- [ ] Кабинет ответственного вызывает **`GET /api/v1/responsible/appeals`** при монтировании и после успешной регистрации; новое обращение видно в списке при корректном статусе/кабинете.
- [ ] По клику на обращение вызывается **`GET /api/v1/appeals/{id}`** и/или **`GET /api/v1/responsible/appeals/{id}`**; на UI отображаются данные, согласованные с **AppealDto** и словарём (п. 3).
- [ ] Таблица в PR: **FR / UC → поведение → эндпоинт**.
- [ ] Тело `POST /api/v1/appeals` согласовано с **Swagger** (`AppealCreate` / при необходимости расширение схемы в OpenAPI), с **JSON Schema** и с примером в [`docs/examples/appeal-create-request.example.json`](../examples/appeal-create-request.example.json) (или обновлён эквивалент в `docs/output/`).
- [ ] Реализация формы закрывает **FR-01.1–FR-01.5** (см. п. 10): обязательные поля, три категории заявителя при наличии в ТЗ, тип канала, текст, SLA/дедлайн; нет расхождения с чек-листом п. 10 без обновления ТЗ.
- [ ] Линтер/типы без регрессий в изменённых файлах.

---

## 8. Вне скоупа

- Полный отказ от `localStorage` по всему приложению без отдельной задачи.
- Смена OpenAPI без синхронизации `src/openapi/edo-backend.openapi.json` и мока `edoApiMockMiddleware.ts`.

---

## 9. Ссылки на код и контракты

| Артефакт | Путь |
|----------|------|
| Регистрация (основной объём UI) | `src/app/components/lifecycle/RegistrationPageEnhanced.tsx` (`RegistrationPage`, `RegistrationCard`, кабинет) |
| Альтернативная карточка (режим `create`) | `src/app/components/lifecycle/AppealRegistrationCard.tsx` |
| Категории банка (классификация) | `src/imports/bank-categories.json` |
| Импорт-спека экрана регистрации | `src/imports/registration-appeal-screen.md` |
| Кабинет ответственного | `src/app/components/lifecycle/ProcessingCabinetNew.tsx` |
| API кабинетов (v1) | `src/services/edoCabinetApi.ts` |
| Реестр + создание (legacy/v1 смешение) | `src/services/appealApi.ts` |
| Сервер: создание в БД | `server/edoPgStore.mjs` (`pgAddAppealFromV1Create`), `server/resolveAppealCreateBody.mjs` |
| JSON Schema тела создания | `docs/schemas/appeal-create-request.schema.json` |
| Пример JSON тела создания | `docs/examples/appeal-create-request.example.json` |
| Swagger UI (спека та же, что на сервере) | `src/app/components/ApiDocsPage.tsx` + `src/openapi/edo-backend.openapi.json` |

---

## 10. Полное описание фронтенд-разработки формы регистрации обращения

Ниже сведены **требования к реализации UI** из утверждённого ТЗ, **UI-артефактов** и **импорт-спеки экрана**. При конфликте: **`docs/functional-requirements.md`** и **`docs/ui-ux-brief.md` / `docs/design-system-plan.md`** важнее визуальных экспериментов в `docs/ui-artifacts/` (в артефактах встречается светлая «Google Forms» палитра — в продукте действует **тёмная тема** по правилам репозитория).

### 10.1. Точка входа и композиция экранов

| Элемент | Описание | Источник / код |
|---------|----------|----------------|
| Вкладка приложения | Регистратор / создание обращения (маршрут из `App.tsx`: `case 'create'`) | приложение |
| Корневой компонент | `RegistrationPage` в [`RegistrationPageEnhanced.tsx`](../../src/app/components/lifecycle/RegistrationPageEnhanced.tsx) | код |
| Режимы (`view`) | `cabinet` — кабинет регистратора; `card` — карточка формы (основной сценарий); `create` — отдельный поток [`AppealRegistrationCard`](../../src/app/components/lifecycle/AppealRegistrationCard.tsx) | код + [REGISTRATION_PAGE_UPDATE.md](../ui-artifacts/REGISTRATION_PAGE_UPDATE.md) |
| Переход в форму | Из кабинета: «Создать новое обращение» / сценарий письменного обращения (`handleCreateAppeal`, `handleRegisterWrittenAppeal`) | артефакт + код |
| Возврат | «Назад» / «Отменить» → сброс в `cabinet` без сохранения (ожидание из артефактов); уточнить, нужно ли подтверждение при заполненных полях | [REGISTRATION_PAGE_UPDATE.md](../ui-artifacts/REGISTRATION_PAGE_UPDATE.md) |

### 10.2. Кабинет регистратора (предформа)

Реализовать или сохранить согласованно с [REGISTRATION_PAGE_UPDATE.md](../ui-artifacts/REGISTRATION_PAGE_UPDATE.md):

- Заголовок и краткое описание роли (создание и учёт обращений).
- **CTA** «Создать новое обращение» (крупная зона клика, подпись про регистрацию обращения клиента).
- **Виджет статистики** за месяц: три показателя (без ошибок / с ошибками / всего); источник данных для продукта — уточнить (сейчас в коде — mock + `localStorage`); для демо с БД допускается `GET /api/v1/stats/registrar/month`, если подключён в UI.

### 10.3. Карточка регистрации (основная форма)

Компонент **`RegistrationCard`** (внутренний к `RegistrationPage` в том же файле). По артефактам и спеке:

**Каркас и навигация**

- Верхняя панель: возврат, заголовок формы, первичное действие отправки (в артефакте — «Отправить»; в продукте допускается эквивалент **«Зарегистрировать обращение»** при совпадении с ТЗ).
- Вкладки **«Вопросы» / «Ответы»** (переключение превью/резюме, если сохраняется паттерн из артефакта).
- Блок заголовка/описания формы (назначение — пояснить обязательные поля, **FR-01.5**).

**Поля и группы (сверка с FR-01 и артефактом «9 вопросов»)**

| № (артефакт) | Поле / группа | Тип UI | Обязательность | Замечания по ТЗ / API |
|--------------|----------------|--------|----------------|------------------------|
| 1 | Категория заявителя | переключатель / сегмент | **Да** (**FR-01.5**) | **FR-01.1**: три категории — физлицо, юрлицо, **регулятор**; в [REGISTRATION_PAGE_UPDATE.md](../ui-artifacts/REGISTRATION_PAGE_UPDATE.md) указаны только ФЛ/ЮЛ — **доработать UI** или согласовать сокращение в ТЗ |
| 2 | ФИО заявителя | текст | Да для ФЛ | → `applicantName` |
| 3 | Телефон | tel | Для ФЛ (артефакт + логика CRM); для API см. `AppealCreate` / схему | `phone` |
| 4 | Наименование организации | текст | Да для ЮЛ | `organizationName` |
| 5 | ИНН | текст | Да для ЮЛ в артефакте | `inn` в [JSON Schema](../schemas/appeal-create-request.schema.json) |
| 6 | Тип обращения (канал) | radio / сегмент | **Да** (**FR-01.5**, **FR-01.2**) | Устное / Письменное / Регулятор; влияет на SLA (**FR-01.4**) — см. п. 10.4 |
| 7 | Категория (продуктовая классификация) | select / каскад | **Да** (**FR-01.5** «категория») | В коде используется `bank-categories.json`; значения должны маппиться в `category` / подкатегорию тела запроса (п. 3) |
| 8 | Приоритет | radio | Нет в **FR-01.5** (опционально) | Маппинг в строки «Низкий» / «Средний» / «Высокий» для API |
| 9 | Содержание обращения | textarea | **Да** (**FR-01.5** «текст») | → `content` (или нормализуемые синонимы) |

**Дополнительные блоки, уже присутствующие или запланированные в коде/артефактах**

- **Статус клиента** (клиент / неклиент), **CRM-поиск**, автозаполнение — [REGISTRATION_UPDATES_DONE.md](../ui-artifacts/REGISTRATION_UPDATES_DONE.md) (в т.ч. постоянный CRM-виджет), тестовые данные — [REGISTRATION_TEST_CLIENTS.md](../ui-artifacts/REGISTRATION_TEST_CLIENTS.md); по ТЗ CRM — **FR-06** (P1): не блокирует P0-регистрацию, но поведение индикаторов и автозаполнения должно быть предсказуемо.
- **Даты**: дата регистрации, плановая дата (SLA), отчётная/фактическая — логика отображения и парсинга дат без обрезания строки года; см. [REGISTRATION_PREVIEW_OPTIMIZATION.md](../ui-artifacts/REGISTRATION_PREVIEW_OPTIMIZATION.md).
- **Вложения**, **База знаний** (подбор категории), **«Решено на первой линии» (FCR)** — [`registration-appeal-screen.md`](../../src/imports/registration-appeal-screen.md); внедрение только если не противоречит ТЗ и не ломает обязательный сценарий POST в БД.

### 10.4. Логика и UX-поведение

- **Условные поля:** при выборе ФЛ показывать ФИО и телефон (и email при наличии в форме); при ЮЛ — организация, ИНН (КПП и др. — по словарю/коду, без выдуманных полей).
- **SLA / плановая дата:** при смене типа обращения пересчитывать дедлайн по правилам из [`registration-appeal-screen.md`](../../src/imports/registration-appeal-screen.md) (7 / 15 / 3 дня и приоритет по умолчанию), согласовать с **FR-01.4** и фактическим полем `deadline` в `POST` (формат даты — как ожидает `appealApi.createAppeal` / сервер).
- **Валидация до сабмита:** минимум **FR-01.5**; кнопка сабмита неактивна или сабмит с показом ошибок по полям — на выбор реализации, но без «тихого» игнорирования.
- **Отправка:** вызов единого маппера формы → `POST /api/v1/appeals` (п. 4.1); при успехе — сообщение пользователю (toast/аналог), передача **`id`** для последующего открытия в кабинете ответственного, обновление статистики; при ошибке — тело `Problem` / текст ошибки.
- **Сброс формы:** действие «Сбросить» в шапке ([REGISTRATION_UPDATES_DONE.md](../ui-artifacts/REGISTRATION_UPDATES_DONE.md)) очищает локальное состояние и не создаёт запись в БД.

### 10.5. Состояния интерфейса

| Состояние | Поведение |
|-----------|-----------|
| Начальная загрузка кабинета | Отображение статистики (из API или кэша по решению продукта). |
| Заполнение формы | Живая валидация по желанию; маска телефона по артефактам. |
| Отправка (`pending`) | Блокировка двойного сабмита, индикатор загрузки на CTA. |
| Успех | Сообщение об успехе, опционально номер/`id`; переход в кабинет или оставление на форме — согласовать с UX; инициировать refetch списка ответственного (п. 4.2). |
| Ошибка API / валидация | Понятное сообщение; для 422 — разбор `detail` при наличии. |
| БД offline | Не имитировать успешную запись в БД; показ статуса из health (см. задачу п. 1). |

### 10.6. Стили и доступность

- Использовать **токены темы** из `src/styles/theme.css` и компоненты shadcn/MUI согласно [design-system-plan.md](../design-system-plan.md); не вводить новую палитру «с нуля» из Google Forms без прохождения согласования.
- Подписи к полям и ошибкам — в терминологии глоссария / BR-03, где это задано ТЗ.

### 10.7. Тестирование (ручное)

- Сценарии из [REGISTRATION_PAGE_UPDATE.md](../ui-artifacts/REGISTRATION_PAGE_UPDATE.md) (кабинет → карточка → ФЛ/ЮЛ → назад/отмена).
- CRM: сценарии по [REGISTRATION_TEST_CLIENTS.md](../ui-artifacts/REGISTRATION_TEST_CLIENTS.md) при включённом mock CRM.
- Регресс превью дат/SLA по [REGISTRATION_PREVIEW_OPTIMIZATION.md](../ui-artifacts/REGISTRATION_PREVIEW_OPTIMIZATION.md).
