# План дизайн-системы — EDO Bank

**Version:** 1.0.1 | **Date:** 2026-05-03 | **Status:** Active  
**Источник:** [docs/ui-artifacts/UNIFIED_DESIGN_SYSTEM.md](../ui-artifacts/UNIFIED_DESIGN_SYSTEM.md), рабочие токены в `src/styles/theme.css`, архив токенов в [docs/ui-artifacts/reference/default_shadcn_theme.css](../ui-artifacts/reference/default_shadcn_theme.css)

---

## 1. Компонентная база

### Уровень 1 — Примитивы (shadcn/ui + Radix)
| Компонент | Пакет | Применение |
|---|---|---|
| Button | shadcn/ui | Все кнопки действий |
| Input | shadcn/ui | Поля ввода |
| Select | Radix | Выпадающие списки |
| Dialog | Radix | Модальные окна |
| Popover | Radix | Всплывающие подсказки |
| Tabs | Radix | Переключение вкладок |
| Checkbox | Radix | Мультивыбор |
| Toast | sonner | Уведомления-тосты |

### Уровень 2 — Составные компоненты (MUI)
| Компонент | Применение |
|---|---|
| DataGrid / Table | Таблица обращений, таблица производительности |
| IconButton | Кнопки с иконками в тулбарах |

### Уровень 3 — Бизнес-компоненты (custom)
| Компонент | Файл | Описание |
|---|---|---|
| `AppealCard` | `ApplicationDetail.tsx` | Карточка обращения (3 колонки) |
| `SLATimer` | (inline) | Таймер обратного отсчёта |
| `CRMIndicator` | (inline) | Индикатор статуса CRM |
| `KPICard` | `KPICards.tsx` | KPI-метрика с трендом |
| `StatusBadge` | (inline) | Цветной бейдж статуса |

---

## 2. Иконки

Библиотека: **Lucide React** (первичная) + **MUI Icons** (вспомогательная).

Правила:
- Размер иконок в таблицах: 16px
- Размер иконок в навигации: 20px
- Цвет иконок = текущий цвет текста (currentColor)

---

## 3. Сетка и отступы

| Переменная | Значение | Применение |
|---|---|---|
| Базовый отступ | 4px (0.25rem) | Шаг сетки |
| Padding карточки | 16px | Внутренние отступы |
| Gap колонок | 16px | Промежутки в трёхколоночном layout |
| Ширина левого сайдбара | 280px | Фиксированная |
| Ширина правого сайдбара | 280px | Фиксированная |

---

## 4. Стек стилей

```
Tailwind CSS 4 (утилиты) 
    + CSS-переменные (дизайн-токены) 
    + shadcn/ui (компонентные стили) 
    + MUI theme override
```

Файл токенов (приложение): `src/styles/theme.css` (импорт через `src/styles/index.css`).  
Архив эталона shadcn: `docs/ui-artifacts/reference/default_shadcn_theme.css`.  
Глобальные стили: `src/styles/`.

---

## 5. Правила применения

1. Новые компоненты — сначала проверить наличие в shadcn/ui или Radix
2. Не использовать inline-стили для токенных значений — только CSS-переменные
3. Адаптивность не является приоритетом MVP — ориентир на десктоп 1440px
4. Тёмная тема — единственная поддерживаемая тема
