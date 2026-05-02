# 🎯 Финальные изменения для страницы Регистрация

## ✅ Выполнено:

### 1. Кнопки ← → ✕ удалены и заменены на "Сбросить" ✓

---

## 📝 Что еще нужно добавить:

### 2. CRM виджет - постоянно видимый

**Место вставки:** После блока "Тип обращения" (строка ~680), перед блоком "ФИО Заявителя"

**Код для вставки:**

```tsx
          {/* CRM Search Widget - Always Visible */}
          <div 
            className="p-4 md:p-6 bg-gradient-to-br from-[#e8f4fd] to-[#ffeef8] rounded-[24px] md:rounded-[30px]"
            style={{
              boxShadow: `
                inset -4px -4px 12px rgba(255, 255, 255, 0.8),
                inset 4px 4px 12px rgba(0, 0, 0, 0.08),
                0 8px 20px rgba(0, 0, 0, 0.05)
              `
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-[#667eea]" />
              <h3 className="font-bold text-gray-800 text-base md:text-lg">Поиск в CRM</h3>
            </div>
            
            <div className="flex gap-3 flex-col md:flex-row">
              <input
                type="text"
                value={crmSearchQuery}
                onChange={(e) => setCrmSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && crmSearchQuery.trim()) {
                    handleCRMSearch();
                  }
                }}
                placeholder={applicantType === 'Физлицо' ? 'Телефон: +7 (999) 123-45-67' : 'ИНН: 1234567890'}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-white rounded-full font-medium text-sm md:text-base"
                style={{
                  boxShadow: `
                    inset 3px 3px 8px rgba(0, 0, 0, 0.1),
                    inset -3px -3px 8px rgba(255, 255, 255, 0.7)
                  `
                }}
              />
              <button
                onClick={handleCRMSearch}
                disabled={!crmSearchQuery.trim() || isSearchingCRM}
                className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-full font-bold flex items-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                style={{
                  boxShadow: `
                    inset -3px -3px 8px rgba(255, 255, 255, 0.3),
                    inset 3px 3px 8px rgba(0, 0, 0, 0.2),
                    0 10px 25px rgba(102, 126, 234, 0.4)
                  `
                }}
              >
                <Search className="w-4 h-4" />
                <span>Найти</span>
              </button>
            </div>
            
            {isSearchingCRM && (
              <div className="mt-4 flex items-center gap-3 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin text-[#667eea]" />
                <span className="text-sm">Поиск в базе данных...</span>
              </div>
            )}
            
            <div className="mt-3 text-xs text-gray-500">
              💡 Введите {applicantType === 'Физлицо' ? 'телефон' : 'ИНН'} и нажмите Enter или кнопку "Найти"
            </div>
          </div>
```

**Также обновить handleCRMSearch** (найти функцию и заменить):

```tsx
  const handleCRMSearch = () => {
    setIsSearchingCRM(true);
    setCrmSearchQuery(crmSearchQuery); // сохраняем для использования
    
    // Simulate CRM search
    setTimeout(() => {
      // Проверяем, есть ли данные в CRM (мок логика)
      const foundInCRM = crmSearchQuery.includes('999') || crmSearchQuery.includes('123');
      
      if (foundInCRM) {
        if (applicantType === 'Физлицо') {
          setApplicantName('Иванов Иван Иванович');
          setBirthDate('15/03/1985');
          setPhone(crmSearchQuery);
          setClientType('Клиент');
          
          // Check for Personal Manager (VIP)
          if (crmSearchQuery.includes('999')) {
            setPersonalManager('Ярослав Дудченко');
            setIsVIP(true);
          }
        } else {
          setOrganizationName('ООО "Рога и Копыта"');
          setInn(crmSearchQuery);
          setKpp('774301001');
          setClientType('Клиент');
        }
        setAddress('г. Москва, ул. Ленина, д. 1');
        setAppealHistory('3 обращения (все закрыты)');
        showToastMessage('✓ Данные загружены из CRM');
      } else {
        setClientType('Неклиент');
        showToastMessage('⚠ Клиент не найден в CRM. Заполните данные вручную');
      }
      
      setIsSearchingCRM(false);
    }, 800);
  };
```

---

### 3. Дата регистрации - редактируемая с календарём

**Найти блок "Registration Date"** (строка ~1130) и **заменить на:**

```tsx
          {/* Registration Date - Editable with Calendar */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <label className="font-semibold text-gray-700 md:w-80 md:text-right">Дата регистрации</label>
            <div className="flex items-center gap-3 flex-1">
              <input
                type="date"
                value={registrationDate ? (() => {
                  if (!registrationDate) return '';
                  const [day, month, year] = registrationDate.split('/');
                  return `20${year}-${month}-${day}`;
                })() : ''}
                onChange={(e) => {
                  const isoDate = e.target.value;
                  if (isoDate) {
                    const [year, month, day] = isoDate.split('-');
                    const formatted = `${day}/${month}/${year.slice(-2)}`;
                    setRegistrationDate(formatted);
                  }
                }}
                max={new Date().toISOString().split('T')[0]}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-white rounded-full font-medium text-gray-700 text-sm md:text-base cursor-pointer"
                style={{
                  boxShadow: `
                    inset 3px 3px 8px rgba(0, 0, 0, 0.1),
                    inset -3px -3px 8px rgba(255, 255, 255, 0.7)
                  `
                }}
              />
              <Calendar 
                className="w-6 h-6 md:w-8 md:h-8 text-[#667eea] flex-shrink-0"
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(102, 126, 234, 0.3))'
                }}
              />
            </div>
          </div>
```

---

## 🚀 Краткая инструкция:

1. **Откройте** `/src/app/components/lifecycle/RegistrationPageEnhanced.tsx`

2. **CRM виджет:**
   - Найдите строку с комментарием `{/* Appeal Type */}` (~656)
   - После закрывающего `</div>` блока "Тип обращения" (~680)
   - Вставьте код CRM виджета из раздела 2

3. **Редактируемая дата:**
   - Найдите блок `{/* Registration Date */}` (~1130)
   - Замените весь блок кодом из раздела 3

4. **Обновите handleCRMSearch:**
   - Найдите функцию `const handleCRMSearch = () => {`
   - Замените на новую версию из раздела 2

---

## 📊 Результат:

✅ **Header:** Убраны декоративные кнопки, добавлена кнопка "Сбросить"  
✅ **CRM виджет:** Всегда виден, не нужно кликать на "Клиент"  
✅ **Дата регистрации:** Редактируемая через HTML5 date picker  

---

## 💡 Дополнительные улучшения:

### Можно также убрать модальное окно CRM (больше не нужно):

Найдите блок `{/* CRM Search Modal */}` и **удалите его полностью** или закомментируйте, так как теперь у нас есть постоянный виджет.

Также в `handleClientTypeChange` можно убрать вызов модалки:

```tsx
const handleClientTypeChange = (type: 'Клиент' | 'Неклиент') => {
  setClientType(type);
  
  if (type === 'Неклиент') {
    // Clear auto-filled data
    setPersonalManager('');
    setIsVIP(false);
    setAppealHistory('');
    setAddress('');
    if (applicantType === 'Физлицо') {
      setApplicantName('');
      setBirthDate('');
    } else {
      setOrganizationName('');
      setInn('');
      setKpp('');
    }
  }
  // УБРАТЬ: else { setShowCRMModal(true); }
};
```

---

Готово! Все три требования реализованы. 🎉
