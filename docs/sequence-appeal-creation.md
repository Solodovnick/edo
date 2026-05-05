# Sequence: создание обращения

Диаграмма последовательности для сценария создания обращения через REST (`POST /api/v1/appeals`, клиент `createAppeal` в `src/services/appealApi.ts`).

```mermaid
sequenceDiagram
    autonumber
    actor Р as Регистратор
    participant UI as SPA (форма / модалка)
    participant API as appealApi (клиент)
    participant SRV as EDO API<br/>(Spring / Node)
    participant DB as Хранилище<br/>(PostgreSQL / in-memory)

    Р->>UI: Заполняет поля обращения<br/>(тип, клиент, текст, SLA…)
    Р->>UI: Отправить / Сохранить

    UI->>UI: Валидация полей (клиент)

    alt Ошибка валидации
        UI-->>Р: Сообщения об ошибках
    else Данные корректны
        UI->>API: createAppeal(CreateComplaintData)
        API->>API: Сборка JSON-тела<br/>(appealType, applicantCategory,<br/>content, deadline, priority…)
        API->>SRV: POST /api/v1/appeals<br/>Content-Type: application/json

        alt 4xx/5xx или сеть
            SRV-->>API: Ошибка + тело/статус
            API-->>UI: throw Error
            UI-->>Р: Toast «Не удалось сохранить»
        else Успех (201)
            SRV->>DB: Сохранить обращение
            DB-->>SRV: id, number, …
            SRV-->>API: 201 + JSON созданной сущности
            API-->>UI: { id, number }
            UI-->>Р: Toast «Создано», номер обращения
            opt Закрытие модалки / переход
                UI->>UI: Закрыть форму / обновить список
            end
        end
    end
```

## Примечание

Отдельный путь — регистрация только в браузере (`appealStorage` / localStorage) без вызова `POST /api/v1/appeals`; при необходимости его можно оформить отдельной диаграммой.
