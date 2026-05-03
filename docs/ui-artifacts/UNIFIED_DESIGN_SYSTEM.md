# 🎨 Единая дизайн-система ЭДО банка

## 📋 Обзор

Все страницы жизненного цикла обращений были перерисованы под единую дизайн-систему, основанную на стиле Google Forms карточки регистрации обращения.

---

## 🎯 Ключевые элементы дизайн-системы

### 1️⃣ **Цветовая палитра по ролям**

| Роль | Основной цвет | Фон страницы | Применение |
|------|---------------|--------------|------------|
| **Регистратор** | `#673AB7` (Фиолетовый) | `#D1C4E9` | Google Forms стиль |
| **Ответственный** | `#0051BA` (Синий) | `#E3F2FD` | Корпоративный синий банка |
| **Аудитор** | `#FF9800` (Оранжевый) | `#FFF3E0` | Контроль качества |
| **Архивация** | `#9C27B0` (Пурпурный) | `#F3E5F5` | Pixney Analytics стиль |
| **Руководитель** | `#00AA44` (Зелёный) | `#E8F5E9` | Executive Dashboard |

### 2️⃣ **Структура хедера**

**Единый формат для всех страниц:**
```
┌─────────────────────────────────────────────────┐
│ [← Назад]  Заголовок страницы    [КНОПКА ДЕЙСТВИЯ] │
└─────────────────────────────────────────────────┘
```

- **Фон:** Основной цвет роли
- **Текст:** Белый
- **Кнопка "Назад":** Слева с иконкой ArrowLeft
- **Кнопка действия:** Справа, белый фон с цветным текстом
- **Высота:** `py-4` (padding vertical)
- **Тень:** `shadow-md`

### 3️⃣ **Карточки (Cards)**

**Белые карточки с единым стилем:**
- **Фон:** `#FFFFFF` (белый)
- **Скругление:** `rounded-lg`
- **Тень:** `shadow-sm`
- **Отступы:** `p-4` или `p-5`
- **Верхняя рамка заголовка:** `8px solid [основной цвет]`

**Пример:**
```tsx
<div className="bg-white rounded-lg shadow-sm p-5" 
     style={{ borderTop: '8px solid #673AB7' }}>
  {/* Содержимое */}
</div>
```

### 4️⃣ **Статистические виджеты**

**Единый формат для всех ролей:**
```tsx
<div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-[цвет]">
  <div className="flex items-center gap-3">
    <Icon className="w-6 h-6 text-[цвет]" />
    <span className="text-sm font-medium text-[цвет]-900">Название</span>
  </div>
  <div className="text-4xl font-normal text-[цвет] mb-1">
    {значение}
  </div>
  <div className="text-xs text-[цвет]-700">
    описание
  </div>
</div>
```

**Цвета левой границы:**
- 🟣 Фиолетовый `border-purple-600` - для основных метрик роли
- 🟢 Зелёный `border-green-500` - для успешных операций
- 🟡 Жёлтый `border-yellow-500` - для предупреждений
- 🔴 Красный `border-red-500` - для критичных ситуаций
- 🔵 Синий `border-blue-600` - для информационных метрик
- ⚪ Серый `border-gray-400` - для нейтральных данных

### 5️⃣ **Поля ввода**

**Лейблы:**
```tsx
<label className="block text-base text-gray-900 mb-2">
  Название поля <span className="text-red-600">*</span>
</label>
```

**Input/Textarea:**
```tsx
<input
  className="w-full px-3 py-2 text-sm border border-gray-300 rounded 
             focus:border-[основной-цвет] focus:ring-1 focus:ring-[основной-цвет] 
             outline-none"
/>
```

**Focus-состояния по ролям:**
- Регистратор: `focus:border-purple-500 focus:ring-purple-500`
- Ответственный: `focus:border-blue-500 focus:ring-blue-500`
- Аудитор: `focus:border-orange-500 focus:ring-orange-500`
- Архивация: `focus:border-purple-500 focus:ring-purple-500`
- Руководитель: `focus:border-green-500 focus:ring-green-500`

### 6️⃣ **Кнопки**

**Активная кнопка (фильтр/действие):**
```tsx
<button
  className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
    isActive
      ? 'text-white'
      : 'bg-white text-gray-700 border border-gray-300 hover:bg-[цвет]-50'
  }`}
  style={isActive ? { backgroundColor: '[основной-цвет]' } : {}}
>
  Текст
</button>
```

**Неактивная кнопка:**
- Белый фон
- Серая граница `border border-gray-300`
- Серый текст `text-gray-700`
- Hover с тинтом основного цвета: `hover:bg-purple-50`

### 7️⃣ **Типография**

| Элемент | Класс | Применение |
|---------|-------|------------|
| Заголовок страницы (хедер) | `text-lg font-medium text-white` | В шапке страницы |
| Заголовок главного блока | `text-2xl font-normal text-gray-900` | Заголовок формы |
| Подзаголовок | `text-sm text-gray-600` | Описание под заголовком |
| Заголовок секции | `text-base font-medium text-gray-900` | Названия блоков в карточках |
| Лейбл поля | `text-base text-gray-900` | Названия полей ввода |
| Текст значения | `text-sm font-medium text-gray-900` | Значения в таблицах |
| Вспомогательный текст | `text-xs text-gray-600` | Подписи, пояснения |

### 8️⃣ **Списки обращений**

**Единая карточка обращения для кабинетов:**
```tsx
<div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
  {/* Верхняя строка: номер, бейдж, дата */}
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-[цвет]" />
        <span className="font-medium text-gray-900">№{id}</span>
      </div>
      {/* Опциональный бейдж статуса */}
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Calendar className="w-4 h-4" />
      <span>{дата}</span>
    </div>
  </div>
  
  {/* Нижняя строка: детали в grid */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
    {/* Детали обращения */}
  </div>
</div>
```

### 9️⃣ **Бейджи статусов**

```tsx
{/* Основной статус роли */}
<span className="px-2 py-1 text-xs font-medium rounded" 
      style={{ backgroundColor: '#E3F2FD', color: '#0051BA' }}>
  МОЁ
</span>

{/* Успех */}
<span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
  ОДОБРЕНО
</span>

{/* Предупреждение */}
<span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
  ЧАСТИЧНО
</span>

{/* Ошибка */}
<span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
  ВОЗВРАЩЕНО
</span>
```

### 🔟 **Layout и spacing**

- **Максимальная ширина контейнера:**
  - Кабинеты: `max-w-6xl` или `max-w-7xl`
  - Карточки: `max-w-3xl`
- **Горизонтальные отступы:** `px-4` или `px-6`
- **Вертикальные отступы:** `py-6`
- **Расстояние между карточками:** `space-y-3`
- **Фон страницы:** Светлый тинт основного цвета роли

---

## 📱 Структура страниц

### **Кабинет (Cabinet View)**

```
┌────────────────────────────────────────┐
│ ХЕДЕР (цветной фон)                    │
├────────────────────────────────────────┤
│ max-w-6xl mx-auto px-6 py-6           │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Статистические виджеты (grid)    │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Фильтры и поиск                  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Список обращений (space-y-3)     │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### **Карточка обращения (Card View)**

```
┌────────────────────────────────────────┐
│ ХЕДЕР (цветной фон)                    │
├────────────────────────────────────────┤
│ max-w-3xl mx-auto px-4 py-6           │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Заголовок (8px border-top)       │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Информация о заявителе           │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Детали обращения                 │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ Поля ввода и формы               │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## ✅ Реализованные страницы

### 1. **Регистратор** (Фиолетовый #673AB7)
- ✅ Кабинет регистратора
- ✅ Карточка регистрации обращения

### 2. **Ответственный** (Синий #0051BA)
- ✅ Кабинет ответственного
- ✅ Карточка обработки обращения

### 3. **Аудитор** (Оранжевый #FF9800)
- ✅ Кабинет аудитора
- ✅ Карточка аудита обращения

### 4. **Архивация** (Пурпурный #9C27B0)
- ✅ Кабинет архива
- ✅ Карточка просмотра архивного обращения

### 5. **Руководитель** (Зелёный #00AA44)
- ✅ Executive Dashboard (только кабинет)

---

## 🎨 Преимущества единой дизайн-системы

✅ **Консистентность:** Все страницы выглядят как части одной системы  
✅ **Узнаваемость ролей:** Цветовое кодирование помогает быстро понять, на какой странице находишься  
✅ **Простота навигации:** Единая структура хедера и кнопок  
✅ **Профессиональный вид:** Чистый, современный стиль Google Forms  
✅ **Масштабируемость:** Легко добавлять новые страницы по той же схеме  
✅ **Accessibility:** Четкие контрасты, понятная иерархия  

---

## 🔄 Миграция

Старые файлы:
- `/src/app/components/lifecycle/ProcessingPageNew.tsx` → **ProcessingPageUnified.tsx**
- `/src/app/components/lifecycle/AuditPage.tsx` → **AuditPageUnified.tsx**
- `/src/app/components/lifecycle/ArchivePage.tsx` → **ArchivePageUnified.tsx**
- `/src/app/components/lifecycle/ManagerCabinetPage.tsx` → **ManagerCabinetPageUnified.tsx**

Сохранены:
- `/src/app/components/lifecycle/RegistrationPageEnhanced.tsx` - уже соответствует дизайн-системе

---

## 📝 Примеры кода

### Пример хедера:
```tsx
<div className="shadow-md" style={{ backgroundColor: '#0051BA' }}>
  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="p-2 rounded-lg transition-colors hover:bg-white/10"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
      <h1 className="text-lg font-medium text-white">Заголовок</h1>
    </div>
    <button
      onClick={handleSubmit}
      className="px-6 py-2 bg-white hover:bg-gray-100 rounded font-medium transition-colors"
      style={{ color: '#0051BA' }}
    >
      СОХРАНИТЬ
    </button>
  </div>
</div>
```

### Пример статистического виджета:
```tsx
<div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-600">
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-3">
      <User className="w-6 h-6 text-blue-600" />
      <span className="text-sm font-medium text-blue-900">Мои обращения</span>
    </div>
  </div>
  <div className="text-4xl font-normal text-blue-600 mb-1">
    {count}
  </div>
  <div className="text-xs text-blue-700">
    обращений в работе
  </div>
</div>
```

---

**Дата создания:** 2 марта 2026  
**Версия:** 1.0  
**Статус:** ✅ Полностью реализовано
