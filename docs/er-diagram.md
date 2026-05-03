# ER Diagram — EDO Bank

**Version:** 1.0.0 | **Date:** 2026-05-03 | **Status:** Planned

> Артефакт запланирован. Создать на основе mock-данных из `.edo/src/data/`.

---

## Черновик сущностей (из UI-артефактов)

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
