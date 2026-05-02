# ProcessingPage Import Fix

## Проблема

```
Pre-transform error: Failed to load url /app/components/lifecycle/ProcessingPage.tsx
```

## Причина

После создания нового компонента ProcessingPage с кабинетом ответственного, файл был создан как `ProcessingPageNew.tsx` вместо `ProcessingPage.tsx`.

## Решение

Обновлены все импорты для использования `ProcessingPageNew.tsx`:

### 1. `/src/app/components/lifecycle/index.tsx`
```tsx
// Было:
export { ProcessingPage } from './ProcessingPage';

// Стало:
export { ProcessingPage } from './ProcessingPageNew';
```

### 2. `/src/app/components/lifecycle/ProcessRequestLifecycle.tsx`
```tsx
// Было:
import { ProcessingPage } from './ProcessingPage';

// Стало:
import { ProcessingPage } from './ProcessingPageNew';
```

### 3. `/src/app/App.tsx`
```tsx
// Было:
import { ProcessingPage } from '@/app/components/lifecycle/ProcessingPage';

// Стало:
import { ProcessingPage } from '@/app/components/lifecycle/ProcessingPageNew';
```

## Файлы

- ✅ `/src/app/components/lifecycle/ProcessingPageNew.tsx` - существует (711 строк)
- ❌ `/src/app/components/lifecycle/ProcessingPage.tsx` - не существует (удален)
- ✅ Все импорты обновлены → используют `ProcessingPageNew`

## Статус

✅ **Исправлено** - все импорты теперь указывают на `ProcessingPageNew.tsx`
