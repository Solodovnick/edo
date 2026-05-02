---
FRAME: Screen_Registration_Appeal
DESCRIPTION: "Экран рабочего места Регистратора (ЦТО / Front-office)"
---

# ==========================================
# 🧩 КОМПОНЕНТЫ И USE CASE ДЛЯ ЭКШЕНОВ
# ==========================================

COMPONENT: SegmentedControl_ApplicantType
VARIANT_1: "Юр лицо"
VARIANT_2: "Физлицо"
USE_CASE (ACTION):
  Trigger: On_Click(Variant)
  Logic: 
    - If "Юр лицо": Show inputs [Наименование организации, ИНН, КПП]. Hide [ФИО Заявителя].
    - If "Физлицо": Show inputs [ФИО Заявителя, Дата рождения]. Hide [ИНН, КПП].
  Source: Proto 1 (Типы лиц).

COMPONENT: SegmentedControl_ClientStatus
VARIANT_1: "Клиент"
VARIANT_2: "Неклиент"
USE_CASE (ACTION):
  Trigger: On_Click("Клиент")
  Logic: 
    - Action: Open Modal "Поиск в CRM" (по ИНН или Телефону).
    - On_Success: Auto-fill [ФИО, ИНН, Адрес].
    - Action: Check CRM for "Personal Manager". If True -> Auto-fill [ФИО Персонального менеджера].
    - Action: Fetch "История обращений" (Enable Link/Button).
  Trigger: On_Click("Неклиент")
  Logic: 
    - Action: Clear auto-filled data. Disable PM field. Set fields to Manual Input.
  Source: Proto 3, Proto 8 (Интеграция с CRM).

COMPONENT: SegmentedControl_AppealType
VARIANT_1: "Устное"
VARIANT_2: "Письменное"
VARIANT_3: "Регулятор"
USE_CASE (ACTION):
  Trigger: On_Change(Variant)
  Logic: "UC: Авторасчет SLA (Плановая дата)"
    - If "Устное": Set [Плановая дата] = [Дата регистрации] + 7 days. Set [Приоритет] = "Средний".
    - If "Письменное": Set [Плановая дата] = [Дата поступления письма] + 15 days. Set [Приоритет] = "Низкий".
    - If "Регулятор": Set [Плановая дата] = [Дата регистрации] + 3 days. Set [Приоритет] = "Высокий".
  Source: Proto 1 (Абзац "Регламентные сроки").

COMPONENT: Button_Action_FetchCategory
LABEL: "Выбрать из Базы Знаний 🔍"
USE_CASE (ACTION):
  Trigger: On_Click
  Logic: "UC: Классификация"
    - Action: Open Widget "База Знаний".
    - User Action: Select Category & Subcategory based on "Тема обращения".
    - On_Select: Auto-fill [Категория, Подкатегория].
    - System Action: Recalculate [Приоритет] if DB rule overrides default limits.
  Source: Proto 6 (Base of Knowledge).

COMPONENT: Checkbox_FCR
LABEL: "☑ Решено на первой линии (Не отправлять в пул)"
USE_CASE (ACTION):
  Trigger: On_Check(True)
  Logic: 
    - Action: Hide routing elements. 
    - Action: Mark Appeal Status as "Closed/Resolved".
  Source: Proto 3 (Регистратор может решить сам).

COMPONENT: Button_Primary_Submit
LABEL: "Зарегистрировать (ОК)"
STATE: Disabled (Until mandatory fields are filled)
USE_CASE (ACTION):
  Trigger: On_Click
  Validation_Logic:
    - Check if [ФИО/Наименование], [Телефон], [Содержание], [Категория] are NOT empty. (Source: Proto 3, refusal of registration).
  Routing_Logic: "UC: Отправка обращения"
    - If [ФИО ПМ] is NOT Empty -> Route to "Queue: Personal Manager".
    - If [ФИО ПМ] is Empty AND Checkbox_FCR is False -> Route to "Общий Пул ДУКО".
    - End Sequence: Show Toast "Обращение №12345 зарегистрировано. Озвучьте номер клиенту!".
  Source: Proto 2, Proto 3.

# ==========================================
# 🗑 ЭЛЕМЕНТЫ К УДАЛЕНИЮ С ЭТОГО ЭКРАНА
# ==========================================
HIDDEN_COMPONENTS:
  - Input: "ФИО Ответственного" (Назначается позже в пуле, кроме ПМ).
  - DatePicker: "Дата доведения" (Заполняется на этапе 4).
  - DatePicker: "Фактическая дата" (Заполняется при закрытии).
