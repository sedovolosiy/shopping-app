# Инструкция по установке и запуску Shopping Optimizer

## Быстрый старт

### 1. Установите зависимости

```bash
cd app
npm install
```

### 2. Настройте переменные окружения

Создайте файл `.env.local` в директории `/app`:

```
DATABASE_URL="file:./prisma/dev.db"
GOOGLE_GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_USING_AI=true
```

### 3. Инициализируйте базу данных

```bash
npx prisma migrate dev --name init
```

### 4. Запустите приложение

```bash
npm run dev
```

## Детальная инструкция

### Подготовка среды

1. **Установите Node.js и npm**
   Рекомендуется версия Node.js 18.x или выше

2. **Клонируйте репозиторий**

   ```bash
   git clone <repository_url>
   cd shopping_optimizer
   ```

3. **Установите зависимости проекта**
   ```bash
   cd app
   npm install
   ```

### Настройка базы данных

1. **Настройка локальной базы данных SQLite**

   - База данных SQLite создается автоматически при миграции
   - Убедитесь, что в `.env.local` указан корректный путь:
     ```
     DATABASE_URL="file:./prisma/dev.db"
     ```

2. **Создание схемы базы данных**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

3. **Проверка базы данных (опционально)**
   ```bash
   npx prisma studio
   ```
   Откроет веб-интерфейс для просмотра и редактирования базы данных на порту 5555

### Настройка AI-функциональности

1. **Получение API ключа Google Gemini**

   - Зарегистрируйтесь на [Google AI Studio](https://ai.google.dev/)
   - Создайте API ключ в разделе API Keys

2. **Настройка AI в приложении**
   - Добавьте ключ в `.env.local`:
     ```
     GOOGLE_GEMINI_API_KEY=your_api_key_here
     NEXT_PUBLIC_USING_AI=true
     ```
   - Если вы не хотите использовать AI, установите `NEXT_PUBLIC_USING_AI=false`

### Запуск приложения

1. **Режим разработки**

   ```bash
   npm run dev
   ```

   Приложение будет доступно по адресу http://localhost:3000

2. **Сборка для продакшена**

   ```bash
   npm run build
   ```

3. **Запуск продакшен-версии**
   ```bash
   npm run start
   ```

### Устранение неполадок

1. **Проблемы с Prisma**

   - Если возникают ошибки, попробуйте пересоздать клиент Prisma:
     ```bash
     npx prisma generate
     ```

2. **Ошибки с API Google Gemini**

   - Проверьте, что ваш ключ API действителен
   - Убедитесь, что у ключа есть доступ к нужным моделям
   - Проверьте квоты и ограничения вашего аккаунта

3. **Прочие проблемы**
   - Удалите node_modules и package-lock.json и переустановите зависимости
   - Проверьте журналы сервера на наличие ошибок
   - Убедитесь, что у вас установлены все необходимые переменные окружения
