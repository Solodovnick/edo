# 🎯 Split Screen Implementation - Регистратор

## ✅ Уже реализовано:

1. ✓ Кнопка "Автозаполнение" в header (с иконкой Sparkles)
2. ✓ Функция `handleAutoFill()` - заполняет всю форму тестовыми данными
3. ✓ Кнопка "Сбросить" - очищает всю форму

---

## 📋 Что нужно добавить: Split Screen с Live Preview

### Структура Layout:

```
┌──────────────────────────────────────────────────────────┐
│                        HEADER                             │
├──────────────────────┬───────────────────────────────────┤
│                      │                                    │
│   ФОРМА ЗАПОЛНЕНИЯ   │      ПРЕВЬЮ КАРТОЧКИ              │
│   (Левая часть)      │      (Правая часть)               │
│                      │                                    │
│   - Поля ввода       │   - Номер обращения                │
│   - Кнопки           │   - Тип заявителя/обращения       │
│   - CRM виджет       │   - Контактные данные              │
│                      │   - Категория                      │
│                      │   - Приоритет (цветной)            │
│                      │   - SLA даты (цветные)             │
│                      │   - VIP статус                     │
│                      │   - Содержание                     │
│                      │                                    │
├──────────────────────┴───────────────────────────────────┤
│                        FOOTER                             │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 Изменения Layout

### 1. Найти блок "Main Form" (строка ~644)

**БЫЛО:**
```tsx
{/* Main Form */}
<div className="flex-1 overflow-y-auto p-4 md:p-10">
  <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
    {/* Вся форма здесь */}
  </div>
</div>
```

**СТАЛО:**
```tsx
{/* Main Split Screen */}
<div className="flex-1 overflow-hidden grid grid-cols-1 xl:grid-cols-2 gap-0">
  
  {/* LEFT: Form */}
  <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
      {/* Вся существующая форма здесь */}
    </div>
  </div>

  {/* RIGHT: Live Preview Card */}
  <div className="hidden xl:flex flex-col p-6 lg:p-8 bg-gradient-to-br from-[#fff4e8] to-[#ffeef8] border-l-4 border-[#667eea]">
    <div className="flex items-center gap-3 mb-6">
      <FileText className="w-6 h-6 text-[#667eea]" />
      <h2 className="text-xl font-bold text-gray-800">Превью обращения</h2>
    </div>

    <div className="flex-1 overflow-y-auto">
      {/* ПРЕВЬЮ КАРТОЧКА - см. код ниже */}
    </div>
  </div>

</div>
```

---

## 🎨 Live Preview Card - Полный код

Добавить внутрь `<div className="flex-1 overflow-y-auto">`:

```tsx
<div 
  className="bg-white rounded-[24px] p-6 space-y-5"
  style={{
    boxShadow: `
      inset -6px -6px 15px rgba(255, 255, 255, 0.7),
      inset 6px 6px 15px rgba(0, 0, 0, 0.1),
      0 20px 40px rgba(0, 0, 0, 0.1)
    `
  }}
>
  {/* Номер обращения (if registered) */}
  {appealId ? (
    <div className="text-center p-4 bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 rounded-[20px]">
      <div className="text-sm text-gray-500 mb-1">Номер обращения</div>
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">
        #{appealId}
      </div>
    </div>
  ) : (
    <div className="text-center p-4 bg-gray-100 rounded-[20px]">
      <div className="text-gray-400 font-medium">Обращение не зарегистрировано</div>
    </div>
  )}

  {/* Тип заявителя и обращения */}
  <div className="grid grid-cols-2 gap-3">
    <div 
      className="p-4 rounded-[18px] bg-gradient-to-br from-[#ffeef8] to-[#e8f4fd]"
      style={{
        boxShadow: `
          inset -2px -2px 6px rgba(255, 255, 255, 0.7),
          inset 2px 2px 6px rgba(0, 0, 0, 0.08)
        `
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {applicantType === 'Физлицо' ? (
          <User className="w-4 h-4 text-[#667eea]" />
        ) : (
          <Building2 className="w-4 h-4 text-[#667eea]" />
        )}
        <div className="text-xs text-gray-500">Тип заявителя</div>
      </div>
      <div className="font-bold text-gray-800">{applicantType}</div>
    </div>

    <div 
      className="p-4 rounded-[18px] bg-gradient-to-br from-[#ffecd2] to-[#fcb69f]/30"
      style={{
        boxShadow: `
          inset -2px -2px 6px rgba(255, 255, 255, 0.7),
          inset 2px 2px 6px rgba(0, 0, 0, 0.08)
        `
      }}
    >
      <div className="text-xs text-gray-500 mb-2">Тип обращения</div>
      <div className="font-bold text-gray-800">{appealType}</div>
    </div>
  </div>

  {/* Заявитель */}
  <div 
    className="p-4 rounded-[18px] bg-white border-2 border-gray-200"
    style={{
      boxShadow: `
        0 4px 12px rgba(0, 0, 0, 0.05)
      `
    }}
  >
    <div className="text-xs text-gray-500 mb-2">Заявитель</div>
    <div className="font-bold text-gray-800 text-lg">
      {applicantType === 'Физлицо' 
        ? (applicantName || <span className="text-gray-300">Не указано</span>)
        : (organizationName || <span className="text-gray-300">Не указано</span>)
      }
    </div>
    {phone && (
      <div className="flex items-center gap-2 mt-2 text-gray-600">
        <Phone className="w-4 h-4" />
        <span className="text-sm">{phone}</span>
      </div>
    )}
  </div>

  {/* VIP статус */}
  {isVIP && personalManager && (
    <div 
      className="p-4 rounded-[18px] bg-gradient-to-br from-[#ffd6e8] to-[#c9e7fd]"
      style={{
        boxShadow: `
          inset -3px -3px 8px rgba(255, 255, 255, 0.7),
          inset 3px 3px 8px rgba(0, 0, 0, 0.1),
          0 6px 15px rgba(255, 214, 232, 0.3)
        `
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Crown className="w-5 h-5 text-yellow-600" />
        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-black rounded-full">
          VIP
        </span>
      </div>
      <div className="font-bold text-gray-800">{personalManager}</div>
      <div className="text-xs text-gray-600 mt-1">Персональный менеджер</div>
    </div>
  )}

  {/* Категория */}
  {category && (
    <div className="space-y-2">
      <div className="text-xs text-gray-500">Категория</div>
      <div 
        className="p-3 rounded-[16px] bg-gradient-to-br from-[#ffeef8] to-[#e8f4fd]"
        style={{
          boxShadow: `
            inset -2px -2px 6px rgba(255, 255, 255, 0.7),
            inset 2px 2px 6px rgba(0, 0, 0, 0.08)
          `
        }}
      >
        <div className="font-bold text-gray-800">{category}</div>
        {subcategory && (
          <div className="text-sm text-gray-600 mt-1">{subcategory}</div>
        )}
        {category === 'Эквайринг' && subcategory === 'Сбой' && (
          <div className="mt-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full inline-block">
            ⚡ SLA 1 день
          </div>
        )}
      </div>
    </div>
  )}

  {/* Приоритет */}
  <div className="space-y-2">
    <div className="text-xs text-gray-500">Приоритет</div>
    <div 
      className="p-3 rounded-[16px] font-bold text-center"
      style={{
        background: priority === 'Высокий' 
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : priority === 'Средний'
          ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
          : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        color: priority === 'Высокий' ? 'white' : '#333',
        boxShadow: `
          inset -3px -3px 8px rgba(255, 255, 255, ${priority === 'Высокий' ? '0.3' : '0.7'}),
          inset 3px 3px 8px rgba(0, 0, 0, ${priority === 'Высокий' ? '0.2' : '0.1'}),
          0 10px 25px rgba(240, 147, 251, ${priority === 'Высокий' ? '0.4' : '0.2'})
        `
      }}
    >
      {priority}
    </div>
  </div>

  {/* SLA Даты */}
  <div className="grid grid-cols-2 gap-3">
    <div className="space-y-2">
      <div className="text-xs text-gray-500">Дата регистрации</div>
      <div 
        className="p-3 rounded-[16px] bg-gradient-to-br from-[#ffeef8] to-[#e8f4fd] text-center font-medium"
        style={{
          boxShadow: `
            inset -2px -2px 6px rgba(255, 255, 255, 0.7),
            inset 2px 2px 6px rgba(0, 0, 0, 0.08)
          `
        }}
      >
        <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-500" />
        <div className="text-sm text-gray-700">{registrationDate}</div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="text-xs text-gray-500">Плановая дата</div>
      <div 
        className="p-3 rounded-[16px] text-center font-bold"
        style={{
          background: `linear-gradient(135deg, ${getSLAColor()}22 0%, ${getSLAColor()}44 100%)`,
          color: getSLAColor(),
          border: `2px solid ${getSLAColor()}`,
          boxShadow: `
            0 0 20px ${getSLAColor()}40
          `
        }}
      >
        <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: getSLAColor() }} />
        <div className="text-sm">{plannedDate || '—'}</div>
      </div>
    </div>
  </div>

  {/* Тема обращения */}
  {appealTheme && (
    <div className="space-y-2">
      <div className="text-xs text-gray-500">Тема обращения</div>
      <div className="p-3 bg-gray-50 rounded-[16px] text-sm text-gray-700">
        {appealTheme}
      </div>
    </div>
  )}

  {/* Содержание */}
  {appealContent && (
    <div className="space-y-2">
      <div className="text-xs text-gray-500">Содержание обращения</div>
      <div 
        className="p-4 bg-white border-2 border-gray-200 rounded-[18px] text-sm text-gray-700 max-h-32 overflow-y-auto"
        style={{
          boxShadow: `
            inset 2px 2px 6px rgba(0, 0, 0, 0.05)
          `
        }}
      >
        {appealContent}
      </div>
    </div>
  )}

  {/* FCR статус */}
  {fcrChecked && (
    <div 
      className="p-3 rounded-[16px] bg-gradient-to-r from-[#00AA44]/20 to-[#00AA44]/10 border-2 border-[#00AA44] text-center"
    >
      <CheckCircle className="w-5 h-5 text-[#00AA44] mx-auto mb-1" />
      <div className="font-bold text-[#00AA44]">FCR - Решено на первой линии</div>
    </div>
  )}

  {/* Кнопка регистрации (preview) */}
  <div className="pt-4 border-t-2 border-gray-200">
    <button
      disabled
      className={`w-full px-8 py-3 rounded-full font-bold text-base transition-all cursor-not-allowed opacity-70 ${
        canRegister()
          ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white'
          : 'bg-gray-300 text-gray-500'
      }`}
      style={canRegister() ? {
        boxShadow: `
          inset -3px -3px 8px rgba(255, 255, 255, 0.3),
          inset 3px 3px 8px rgba(0, 0, 0, 0.2)
        `
      } : {}}
    >
      {fcrChecked ? 'Зарегистрировать и Закрыть (FCR)' : 'Зарегистрировать (ОК)'}
    </button>
    <div className="text-xs text-gray-400 text-center mt-2">
      Используйте кнопку в форме
    </div>
  </div>
</div>
```

---

## 📱 Responsive Поведение

- **Mobile/Tablet (< 1280px)**: Только форма (превью скрыто)
- **Desktop (≥ 1280px)**: Split screen с обеими панелями

---

## 🎨 Цветовая палитра

### Приоритет:
- **Высокий**: gradient от #f093fb до #f5576c (красно-розовый)
- **Средний**: gradient от #ffecd2 до #fcb69f (оранжевый)
- **Низкий**: gradient от #a8edea до #fed6e3 (бирюза-розовый)

### SLA:
- **Критично (< 2 дня)**: #DD0000 (красный)
- **Срочно (< 5 дней)**: #FFAA00 (желтый)
- **Нормально (≥ 5 дней)**: #00AA44 (зеленый)

---

## ✨ Дополнительные улучшения (опционально):

1. **Sticky Preview Header** - чтобы заголовок "Превью обращения" оставался видимым при скролле
2. **Pulse анимация** - для полей которые заполнены через автозаполнение
3. **Transition эффекты** - при обновлении данных в preview

---

## 🚀 Итого:

✅ Функция автозаполнения  
✅ Кнопка "Автозаполнение" в header  
✅ Кнопка "Сбросить" обновлена (полная очистка)  
⏳ Split Screen Layout (нужно добавить код выше)  
⏳ Live Preview Card (код готов выше)

---

**Файл для редактирования:** `/src/app/components/lifecycle/RegistrationPageEnhanced.tsx`  
**Строка для изменения:** ~644 (блок "Main Form")

Готово! 🎉
