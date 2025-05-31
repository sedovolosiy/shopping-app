// app/api/shopping-list/route-optimized.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ShoppingItem } from '@/lib/types';

const GENERAL_CATEGORIES = [
  'Fresh Produce', 'Bakery', 'Dairy & Eggs', 'Meat & Poultry', 'Fish & Seafood', 
  'Frozen Foods', 'Pantry Staples', 'Snacks', 'Beverages', 'Household Supplies', 
  'Personal Care', 'Baby Items', 'Pet Supplies', 'Other'
];

// AI processing function using Google Gemini - optimized for token efficiency
async function processItemsWithAI(rawText: string): Promise<Array<{ originalText: string; normalizedText: string; category: string; quantity: string; unit: string; language: string }>> {
  console.log('[AI_PROCESSING] Entered processItemsWithAI function.');
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[AI_PROCESSING] Google Gemini API key not found in environment variables.');
    throw new Error('Google Gemini API key not found.');
  }
  console.log('[AI_PROCESSING] API key found.');

  const genAI = new GoogleGenerativeAI(apiKey);
  console.log('[AI_PROCESSING] Initialized GoogleGenerativeAI. Attempting to get model...');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  console.log('[AI_PROCESSING] Successfully got model.');

  const generationConfig = {
    temperature: 0.2, // Lower temperature for more deterministic output
    topK: 1,
    topP: 1,
    maxOutputTokens: 8192, // Максимальный лимит для модели
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  // Оптимизированный промпт без требования перевода
  const prompt = `
Вы помощник по обработке списков покупок.
Преобразуйте текстовый список покупок в структурированный JSON-массив.

Для каждого продукта из списка:

1. originalText: Точный текст продукта без маркеров списка
   - Уберите маркеры списка (* • -) и нумерацию
   - Сохраните детали (количество, бренд) в скобках, кавычках и т.д.

2. normalizedText: Стандартизированное название продукта
   - НЕ ПЕРЕВОДИТЕ на другие языки
   - Включите количество, упаковку и информацию о бренде
   - Сохраните контекст: "по акции", специальные пометки
   - Пример: "Бедрышки куриные (2 пачки)" -> "Бедрышки куриные 2 пачки"

3. category: Категория из этого списка: ${GENERAL_CATEGORIES.join(', ')}
   - Если нет подходящей, используйте "Other"

4. quantity: Количество продукта
   - Если указано, извлеките его (например, "2 кг", "1 шт")
   - Если не указано, используйте "1"
   - Для "несколько" используйте "3"
   - Преобразуйте: "полкило" -> "0.5", "десяток" -> "10"

5. unit: Единица измерения количества
   - Общие: "kg", "g", "l", "ml", "pcs", "bottles", "cans", "packages"
   - Переведите: "шт" -> "pcs", "пачки" -> "packages", "бутылки" -> "bottles"
   - Если не указано, используйте "unit"

6. language: Основной язык текста продукта (например, "en", "ru")

Формат вывода - валидный JSON-массив с полями: "originalText", "normalizedText", "category", "quantity", "unit", "language".

Пример входа:
"* Картошка (2 кг)
* Помидоры "черри"
* Яйца куриные С0 (по акции)"

Ожидаемый выход (JSON):
[
  {
    "originalText": "Картошка (2 кг)",
    "normalizedText": "Картошка 2 кг",
    "category": "Fresh Produce",
    "quantity": "2",
    "unit": "kg",
    "language": "ru"
  },
  {
    "originalText": "Помидоры \"черри\"",
    "normalizedText": "Помидоры черри",
    "category": "Fresh Produce",
    "quantity": "1",
    "unit": "unit",
    "language": "ru"
  },
  {
    "originalText": "Яйца куриные С0 (по акции)",
    "normalizedText": "Яйца куриные С0 по акции",
    "category": "Dairy & Eggs",
    "quantity": "1",
    "unit": "unit",
    "language": "ru"
  }
]

Обработайте следующий список покупок:
--- НАЧАЛО ВХОДНЫХ ДАННЫХ ---
${rawText}
--- КОНЕЦ ВХОДНЫХ ДАННЫХ ---
`;

  try {
    console.log('[AI_PROCESSING] Attempting to call model.generateContent with prompt:', prompt.substring(0, 200) + '...'); 
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });
    console.log('[AI_PROCESSING] model.generateContent call completed.');
    const response = result.response;
    if (!response) {
      console.error('[AI_PROCESSING] No response object received from AI model.');
      throw new Error('AI model did not return a response object.');
    }

    console.log('[AI_PROCESSING] AI response object received. Attempting to get text.');
    const aiResponseText = response.text();
    console.log('[AI_PROCESSING] Raw AI Response Text (before cleaning):', aiResponseText);
    
    // Улучшенная очистка и исправление JSON
    try {
      // Очистка ответа
      let cleanedJsonString = aiResponseText;
      
      // Удаление маркеров кода markdown
      cleanedJsonString = cleanedJsonString.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
      
      // Удаление оставшихся обратных кавычек
      cleanedJsonString = cleanedJsonString.replace(/^`+|`+$/g, '').trim();
      
      // Обработка распространенных проблем с JSON
      // Исправление запятых в конце
      cleanedJsonString = cleanedJsonString.replace(/,(\s*[\]}])/g, '$1');
      
      // Исправление пропущенных запятых между объектами
      cleanedJsonString = cleanedJsonString.replace(/}(\s*){/g, '},{');
      
      // Исправление неполного JSON с отсутствующими закрывающими скобками
      const fixBrokenJson = (json: string): string => {
        // Подсчет открытых и закрытых скобок
        let openBraces = 0;
        let openBrackets = 0;
        
        for (let i = 0; i < json.length; i++) {
          if (json[i] === '{') openBraces++;
          if (json[i] === '}') openBraces--;
          if (json[i] === '[') openBrackets++;
          if (json[i] === ']') openBrackets--;
        }
        
        // Добавление отсутствующих закрывающих скобок
        let fixed = json;
        while (openBraces > 0) {
          fixed += '}';
          openBraces--;
        }
        while (openBrackets > 0) {
          fixed += ']';
          openBrackets--;
        }
        
        return fixed;
      };
      
      cleanedJsonString = fixBrokenJson(cleanedJsonString);
      
      // Обработка переносов строк
      cleanedJsonString = cleanedJsonString.replace(/\n/g, ' ').trim();
      
      // Проверка формата массива
      if (!cleanedJsonString.startsWith('[')) {
        cleanedJsonString = '[' + cleanedJsonString;
      }
      if (!cleanedJsonString.endsWith(']')) {
        cleanedJsonString = cleanedJsonString + ']';
      }
      
      // Исправление кавычек в именах свойств
      cleanedJsonString = cleanedJsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
      
      // Исправление кавычек внутри значений свойств
      cleanedJsonString = cleanedJsonString.replace(/"([^"]*)""/g, '"$1\\"');
      
      // Дополнительная обработка вложенных объектов с кавычками
      cleanedJsonString = cleanedJsonString.replace(/"{/g, '{').replace(/}"/g, '}');
      
      console.log('[AI_PROCESSING] Cleaned and fixed JSON String:', cleanedJsonString);
      
      try {
        // Первая попытка обычного парсинга
        const parsedItems = JSON.parse(cleanedJsonString);
        
        // Валидация и возврат результатов
        if (!Array.isArray(parsedItems)) {
          throw new Error("AI response is not a JSON array");
        }
        
        return parsedItems.map(item => ({
          originalText: String(item.originalText || ''),
          normalizedText: String(item.normalizedText || item.originalText || ''),
          category: String(item.category || 'Other'),
          quantity: String(item.quantity || '1'),
          unit: String(item.unit || 'unit'),
          language: String(item.language || 'ru') // Изменение языка по умолчанию на русский
        }));
      } catch (initialJsonError) {
        console.error('[AI_PROCESSING] Initial parsing failed, attempting advanced recovery:', initialJsonError);
        
        // Более агрессивное восстановление JSON - извлечение валидных объектов
        const objectsRegex = /{[^{}]*"originalText"[^{}]*"normalizedText"[^{}]*"category"[^{}]*"quantity"[^{}]*"unit"[^{}]*"language"[^{}]*}/g;
        const validObjectsMatches = cleanedJsonString.match(objectsRegex);
        
        if (validObjectsMatches && validObjectsMatches.length > 0) {
          console.log('[AI_PROCESSING] Found valid objects with regex, attempting to build valid array');
          const validArrayString = '[' + validObjectsMatches.join(',') + ']';
          
          try {
            const recoveredArray = JSON.parse(validArrayString);
            
            return recoveredArray.map((item: any) => ({
              originalText: String(item.originalText || ''),
              normalizedText: String(item.normalizedText || item.originalText || ''),
              category: String(item.category || 'Other'),
              quantity: String(item.quantity || '1'),
              unit: String(item.unit || 'unit'),
              language: String(item.language || 'ru') // Изменение языка по умолчанию на русский
            }));
          } catch (recoveryError) {
            console.error('[AI_PROCESSING] Advanced JSON recovery failed:', recoveryError);
            throw initialJsonError;
          }
        } else {
          throw initialJsonError;
        }
      }
    } catch (jsonError) {
      console.error('[AI_PROCESSING] Error parsing or fixing JSON:', jsonError);
      throw jsonError;
    }
  } catch (error) {
    console.error('[AI_PROCESSING] Error processing items with AI:', error);
    
    // Функция для базовой категоризации - используется только при полном сбое AI
    const basicCategorize = (item: string): string => {
      const lowerItem = item.toLowerCase();
      
      // Базовая логика категоризации
      if (/молоко|сыр|йогурт|творог|сметан|масло|яйца|кефир|ряженка|сливки/i.test(lowerItem)) {
        return 'Dairy & Eggs';
      }
      if (/хлеб|булк|батон|лаваш|выпечк|печень|торт|булочк|пряник/i.test(lowerItem)) {
        return 'Bakery';
      }
      if (/яблок|банан|апельсин|лимон|картош|помидор|огурц|морковь|лук|чеснок|капуст|зелен|фрукт|овощ|салат|перец|редис|укроп|петрушк|свеж|редис|баклажан/i.test(lowerItem)) {
        return 'Fresh Produce';
      }
      if (/говядин|свинин|курин|курица|филе|фарш|колбас|сосис|бекон|мясо|бедрышк|голен|ветчин/i.test(lowerItem)) {
        return 'Meat & Poultry';
      }
      if (/рыба|лосось|тунец|морепродукт|креветк|оливк/i.test(lowerItem)) {
        return 'Fish & Seafood';
      }
      if (/заморож|пельмен|мороженое|смесь/i.test(lowerItem)) {
        return 'Frozen Foods';
      }
      if (/вода|сок|чай|кофе|напиток|пиво|вино|газиров|минерал/i.test(lowerItem)) {
        return 'Beverages';
      }
      if (/мука|сахар|соль|рис|макарон|крупа|консерв|соус|кетчуп|майонез|горошек|кукуруз|фасоль|гречк|масло/i.test(lowerItem)) {
        return 'Pantry Staples';
      }
      if (/мыло|чистящ|пакет|салфетк|бумаг|мусор|фольг|средств/i.test(lowerItem)) {
        return 'Household Supplies';
      }
      if (/печень|шоколад|снэк/i.test(lowerItem)) {
        return 'Snacks';
      }
      
      // Категория по умолчанию
      return 'Other';
    };
    
    // Улучшенная запасная логика с базовой категоризацией
    return rawText
      .split('\n')
      .map(line => line.trim())
      // Фильтрация пустых строк и разделителей
      .filter(line => {
        if (line.length === 0) return false;
        if (/^-{3,}$/.test(line) || /^={3,}$/.test(line) || /^\*{3,}$/.test(line)) return false;
        return true;
      })
      // Очистка строк и применение базовой категоризации
      .map(line => {
        // Удаление маркеров списка
        const cleanedItem = line.replace(/^[\*\•\-\s]+/, '').trim();
        
        // Определение языка на основе набора символов
        const hasСyrillic = /[\u0400-\u04FF]/.test(cleanedItem);
        const language = hasСyrillic ? 'ru' : 'en';
        
        // Базовое извлечение количества
        let quantity = '1';
        let unit = 'unit';
        
        // Попытка извлечения количества и единицы измерения с помощью регулярного выражения
        const quantityMatch = cleanedItem.match(/(\d+(?:\.\d+)?)\s*(кг|kg|г|g|л|l|шт|pcs|штук|пачк|пачки|bottles|бутыл|бутылк)/i);
        if (quantityMatch) {
          quantity = quantityMatch[1];
          
          // Нормализация единиц измерения
          const rawUnit = quantityMatch[2].toLowerCase();
          if (/кг|kg/i.test(rawUnit)) unit = 'kg';
          else if (/г|g/i.test(rawUnit)) unit = 'g';
          else if (/л|l/i.test(rawUnit)) unit = 'l';
          else if (/шт|pcs|штук/i.test(rawUnit)) unit = 'pcs';
          else if (/пачк|пачки/i.test(rawUnit)) unit = 'packages';
          else if (/бутыл|bottles/i.test(rawUnit)) unit = 'bottles';
        }
        
        // Применение базовой категоризации
        const category = basicCategorize(cleanedItem);
        
        return {
          originalText: cleanedItem,
          normalizedText: cleanedItem, // Без перевода
          category: category,
          quantity: quantity,
          unit: unit,
          language: language,
        };
      });
  }
}

const shoppingListCreateSchema = z.object({
  rawText: z.string().min(1, 'Raw text cannot be empty'),
  userId: z.string().min(1, 'User ID cannot be empty'), // Or some other user identifier
  listName: z.string().optional(),
  storeId: z.string().optional(), // Store ID to associate with this shopping list
});

export async function POST(request: Request) {
  console.log('[POST_HANDLER] Received POST request to /api/shopping-list');
  // Declare validation outside try block to make it accessible in catch
  let validation;
  try {
    const body = await request.json();
    console.log('[POST_HANDLER] Request body parsed:', body);
    validation = shoppingListCreateSchema.safeParse(body);

    if (!validation.success) {
      console.error('[POST_HANDLER] Invalid input:', validation.error.errors);
      return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
    }
    console.log('[POST_HANDLER] Input validation successful.');

    const { rawText, userId, listName, storeId } = validation.data;
    console.log(`[POST_HANDLER] Processing for userId: ${userId}, listName: ${listName}, storeId: ${storeId || 'not provided'}`);

    // 1. Find or create the user
    let user = await prisma.user.findUnique({
      where: { identifier: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          identifier: userId,
          preferences: {
            create: { language: 'en' }, // Default language
          },
        },
      });
    }
    console.log('[POST_HANDLER] User found or created:', user.id);

    if (!rawText.trim()) {
      console.warn('[POST_HANDLER] Raw text is empty after trimming.');
      return NextResponse.json({ error: 'No items provided in the list. The input text is empty.' }, { status: 400 });
    }
    console.log('[POST_HANDLER] Raw text is not empty. Calling processItemsWithAI...');

    // 3. Process items with AI
    const processedItems = await processItemsWithAI(rawText);
    console.log('[POST_HANDLER] processItemsWithAI returned:', processedItems);

    if (!processedItems || processedItems.length === 0) {
      console.warn('[POST_HANDLER] AI processed items are null or empty.');
      return NextResponse.json({ error: 'AI could not process any items from the list, or the list was empty after processing.' }, { status: 400 });
    }
    
    console.log('[POST_HANDLER] AI processing successful. Creating shopping list in database...');
    // 4. Create the ShoppingList and its ListItems
    const shoppingList = await prisma.shoppingList.create({
      data: {
        name: listName || 'My Shopping List', // Provide a default name if not given
        rawText: rawText, // Using rawText for the rawText field
        storeType: storeId || 'default', // Using storeId as the storeType field
        userId: user.id, // Ensure this is user.id, not the input userId string
        items: {
          create: processedItems.map(item => ({
            originalText: item.originalText,
            normalizedText: item.normalizedText,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            language: item.language,
            name: item.normalizedText, // Using normalizedText as the name
            categoryOrder: 0, // Default category order as 0
          })),
        },
      },
      include: {
        items: true, // Include items in the response
      },
    });
    console.log('[POST_HANDLER] Shopping list created successfully:', shoppingList.id);

    // Format response to match the expected ShoppingListResponse interface
    const response = {
      success: true,
      message: "Shopping list processed successfully",
      items: shoppingList.items,
      metadata: {
        totalItems: shoppingList.items.length,
        userId: shoppingList.userId || "unknown",
        listName: shoppingList.name,
        storeName: shoppingList.storeType,
        processedWith: 'ai' // Assuming all processing is done with AI since we called processItemsWithAI
      }
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('[POST_HANDLER] Failed to create shopping list:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    // Check if it's an error from processItemsWithAI (e.g., API key missing)
    if (error instanceof Error && error.message === 'Google Gemini API key not found.') {
        // Format error response to match expected structure
        return NextResponse.json({ 
          success: false,
          message: 'AI configuration error. Please contact support.',
          error: 'AI configuration error',
          items: [],
          metadata: {
            totalItems: 0,
            userId: validation?.data?.userId || "unknown",
            listName: validation?.data?.listName || "Unknown List",
            storeName: "unknown",
            processedWith: 'local'
          }
        }, { status: 500 });
    }
    // Format error response to match expected structure
    return NextResponse.json({ 
      success: false,
      message: 'Internal Server Error',
      error: 'Internal Server Error',
      items: [],
      metadata: {
        totalItems: 0,
        userId: validation?.data?.userId || "unknown",
        listName: validation?.data?.listName || "Unknown List",
        storeName: "unknown",
        processedWith: 'local'
      }
    }, { status: 500 });
  }
}

const shoppingListGetSchema = z.object({
  userId: z.string().min(1, 'User ID cannot be empty'),
});

export async function GET(request: Request) {
  console.log('[GET_HANDLER] Received GET request to /api/shopping-list');
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const validation = shoppingListGetSchema.safeParse({ userId });
    if (!validation.success) {
      console.error('[GET_HANDLER] Invalid input for GET:', validation.error.errors);
      return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
    }
    console.log('[GET_HANDLER] GET input validation successful for userId:', validation.data.userId);
    
    const user = await prisma.user.findUnique({
      where: { identifier: validation.data.userId },
    });

    if (!user) {
      console.warn('[GET_HANDLER] User not found for GET request:', validation.data.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log('[GET_HANDLER] User found for GET request:', user.id);

    const shoppingLists = await prisma.shoppingList.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log(`[GET_HANDLER] Found ${shoppingLists.length} shopping lists for user ${user.id}`);

    return NextResponse.json(shoppingLists, { status: 200 });
  } catch (error) {
    console.error('[GET_HANDLER] Failed to fetch shopping lists:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
