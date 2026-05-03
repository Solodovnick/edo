# ER Diagram — EDO Bank

**Version:** 1.1.0 | **Date:** 2026-05-03 | **Status:** Draft  
**Источник:** mock `src/data/`, фрагмент «Словарь данных» (сущность Обращение, Заявитель, Ответ и др.).

---

## Сущность «Обращение» (расширенный черновик по словарю данных)

Ключевые поля для согласования с backend:

| Поле (логическое) | Назначение |
|---|---|
| id | Уникальный идентификатор |
| mail_number, mail_register_date | Письменный канал / корреспонденция |
| applicant_type | Физ / Юр |
| appeal_type | Устное / Письменное / Регулятор |
| appeal_category_id, appeal_subcategory_id | Классификация |
| appeal_priority | Приоритет |
| applicant_id | Ссылка на заявителя |
| appeal_description | Текст обращения |
| status_id | Жизненный цикл |
| user_id / назначения | Через промежуточную таблицу «Пользователь в обращении» |
| attachment | Вложения |
| answer_id | Ответ клиенту |
| audit_template_id, feedback_id | Линия аудита |
| department_request_id, department_response_id | Запрос в БП |
| incident_id | Инцидент |
| plan_date, fact_datetime | SLA |
| needs_attention | Флаг «требует внимания» |

---

## Черновик сущностей (из UI-прототипа)

```
Appeal (Обращение)
├── id: string
├── number: string           -- номер обращения
├── registrationDate: date
├── deadline: datetime       -- SLA дедлайн
├── category: enum           -- физлицо / юрлицо / регулятор
├── type: enum               -- письменное / устное
├── status: enum             -- Новое / В работе / Запрос в БЛ / Решено / Закрыто
├── applicantId: FK → Client
├── responsibleId: FK → User
└── text: text               -- текст обращения

Client (Клиент / Заявитель)
├── id: string
├── name: string
├── phone: string
├── birthDate: date
├── address: string
├── isVIP: boolean
├── personalManager: string
└── appealHistory: [Appeal]

Resolution (Решение)
├── id: string
├── appealId: FK → Appeal
├── text: text
├── createdBy: FK → User
└── createdAt: datetime

AuditRecord (Аудиторская запись)
├── id: string
├── appealId: FK → Appeal
├── resolutionId: FK → Resolution
├── template: string
├── comment: text
├── auditorId: FK → User
├── publishedAt: datetime
└── status: enum             -- draft / published

User (Пользователь)
├── id: string
├── name: string
├── role: enum               -- responsible / auditor / admin
└── department: string

Notification (Уведомление)
├── id: string
├── userId: FK → User
├── appealId: FK → Appeal
├── type: string
├── text: string
└── createdAt: datetime
```

---

## TODO

- [ ] Проверить сущности по реальным данным из `src/data/`
- [ ] Оформить в Mermaid erDiagram
- [ ] Добавить поля для регуляторных обращений (ЦБС)
