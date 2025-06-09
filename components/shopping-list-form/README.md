# Shopping List Form - Refactored Components

Этот модуль содержит рефакторированный компонент формы списка покупок, разбитый на более мелкие, переиспользуемые компоненты согласно принципам DRY и лучшим практикам React.

## Структура

```
shopping-list-form/
├── types.ts                     # Общие TypeScript типы
├── index.ts                     # Главный экспорт файл
├── hooks/
│   └── useStoreManagement.ts    # Хук для управления магазинами
├── utils/
│   └── examples.ts              # Утилиты и примеры данных
└── components/
    ├── AIToggleSection.tsx      # Переключатель AI режима
    ├── UserInfoSection.tsx      # Информация о пользователе
    ├── StoreSection.tsx         # Выбор и добавление магазинов
    ├── ShoppingListTextArea.tsx # Текстовое поле для списка
    ├── ActionButtons.tsx        # Кнопки действий
    ├── FormHeader.tsx           # Заголовок формы
    ├── DesktopLayout.tsx        # Desktop версия формы
    └── MobileTabletLayout.tsx   # Mobile/Tablet версия формы
```

## Принципы рефакторинга

### 1. Разделение ответственности (Single Responsibility Principle)

Каждый компонент отвечает за одну конкретную область функциональности:

- `AIToggleSection` - только управление AI переключателем
- `UserInfoSection` - только пользовательские данные
- `StoreSection` - только работа с магазинами
- и т.д.

### 2. DRY (Don't Repeat Yourself)

- Вынесение общих типов в `types.ts`
- Переиспользование логики в хуках
- Общие утилиты в `utils/`

### 3. Адаптивность

Каждый компонент поддерживает адаптивность через пропсы:

- `isDesktop` - для desktop версии
- `isTablet` - для tablet версии
- автоматическое переключение стилей

### 4. Композиция вместо наследования

Главный компонент `ShoppingListForm` использует композицию подкомпонентов:

```tsx
{
  isDesktop ? (
    <DesktopLayout {...props} />
  ) : (
    <MobileTabletLayout {...props} isTablet={isTablet} />
  );
}
```

## Использование

### Основной компонент

```tsx
import { ShoppingListForm } from "@/components/shopping-list-form";

// Использование такое же, как и раньше
<ShoppingListForm
  rawText={rawText}
  setRawText={setRawText}
  // ... остальные пропсы
/>;
```

### Отдельные компоненты

```tsx
import {
  AIToggleSection,
  UserInfoSection,
  StoreSection,
} from "@/components/shopping-list-form";

// Можно использовать компоненты по отдельности
<AIToggleSection useAI={useAI} setUseAI={setUseAI} />;
```

### Хуки

```tsx
import { useStoreManagement } from "@/components/shopping-list-form";

const {
  newStoreName,
  isAddingStore,
  handleAddStore,
  // ...
} = useStoreManagement(
  availableStores,
  selectedStoreId,
  setSelectedStoreId,
  onAddStore
);
```

## Преимущества рефакторинга

### 1. Читаемость кода

- Основной файл сократился с 520+ строк до ~30 строк
- Каждый компонент имеет четкую область ответственности
- Легче понять структуру и логику

### 2. Поддерживаемость

- Изменения в одном компоненте не влияют на другие
- Легче добавлять новые функции
- Проще тестировать отдельные части

### 3. Переиспользование

- Компоненты можно использовать в других частях приложения
- Хуки могут использоваться в других формах
- Утилиты доступны по всему проекту

### 4. Тестирование

- Каждый компонент можно тестировать изолированно
- Проще создавать unit тесты
- Легче мокать зависимости

## Типы

Все типы вынесены в `types.ts` для переиспользования:

- `Store` - описание магазина
- `ShoppingListFormProps` - пропсы основного компонента
- `AIToggleSectionProps`, `UserInfoSectionProps`, etc. - пропсы подкомпонентов

## Совместимость

Рефакторированный компонент полностью совместим с предыдущей версией:

- API не изменился
- Все функции работают так же
- Стили и поведение сохранены

## Дальнейшее развитие

Структура позволяет легко:

- Добавлять новые секции формы
- Создавать альтернативные лейауты
- Расширять функциональность отдельных компонентов
- Интегрировать с системами тестирования
