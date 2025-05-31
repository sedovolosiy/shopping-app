// app/api/shopping-list/route-fixed-ai-categorization.ts
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

// AI processing function using Google Gemini
async function processItemsWithAI(rawText: string): Promise<Array<{ originalText: string; normalizedText: string; category: string; quantity: string; unit: string; language: string }>> {
  console.log('[AI_PROCESSING] Entered processItemsWithAI function.');
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[AI_PROCESSING] Google Gemini API key not found in environment variables.');
    throw new Error('Google Gemini API key not found.');
  }
  console.log('[AI_PROCESSING] API key found.');

  const genAI = new GoogleGenerativeAI(apiKey);
  // Updated to use gemini-1.5-flash-latest
  console.log('[AI_PROCESSING] Initialized GoogleGenerativeAI. Attempting to get model...');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  console.log('[AI_PROCESSING] Successfully got model.');

  const generationConfig = {
    temperature: 0.2, // Lower temperature for more deterministic output
    topK: 1,
    topP: 1,
    maxOutputTokens: 8192, // Увеличиваем до максимального лимита для модели gemini-1.5-flash-8b
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const prompt = `
You are an intelligent shopping list assistant.
Your task is to process a raw text input representing a shopping list and transform it into a structured JSON array of items.
The input can be in various formats (comma-separated, one item per line with bullet points or asterisks, multiple items on one line, mixed languages, or with various formatting like quotes, parentheses, etc).

IMPORTANT: Skip any lines that aren't actual products - like section dividers (---, ===), notes, or decorative elements.
IMPORTANT: Remove bullet points (*, •, -, etc), but keep all product information.

For each actual product item you identify, you need to extract or determine the following information:
1.  originalText: The exact text segment from the input that represents this item, but WITHOUT bullet points or list markers.
    - REMOVE any leading bullet points (*, •, -, etc) or numbering
    - KEEP all product details including quantities in parentheses, quotes, etc.
    - Example: "* Картошка (2 кг)" → "Картошка (2 кг)"

2.  normalizedText: A standardized name for the product that PRESERVES all important context:
   - IMPORTANT: Include quantity, packaging, and brand information (e.g., "Бедрышки куриные (2 пачки)" → "Бедрышки куриные 2 пачки (chicken legs 2 packages)")
   - KEEP descriptions in quotes: "Помидоры "черри"" → "Помидоры черри (cherry tomatoes)"
   - PRESERVE special shopping context like "акция", "по скидке", "по акции" (e.g., "Яйца куриные С0 (по акции)" → "Яйца куриные С0 по акции (chicken eggs C0 on sale)")
   - If item is in a non-English language, provide both the preserved original text WITH all details AND an English equivalent in parentheses
   - CAREFULLY extract information from parentheses/quotes: "Вода газированная 1.5л (2 бутылки)" → "Вода газированная 1.5л 2 бутылки (sparkling water 1.5l 2 bottles)"

3.  category: A general shopping category for the item. Choose from the following categories: ${GENERAL_CATEGORIES.join(', ')}. 
   - If no category from the list is suitable, use "Other"
   - Be accurate: "Яблоки" is Fresh Produce, "Сыр" is Dairy & Eggs, etc.

4.  quantity: The quantity of the item. 
   - If specified in text, extract it (e.g., "2 кг", "1 kg", "500g", "3 шт", "2 бутылки", "несколько штук" → "3")
   - If not specified, default to "1"
   - If described as "несколько", use "3" as default
   - Convert common phrases: "полкило" → "0.5", "десяток" → "10", etc.

5.  unit: The unit of measurement for the quantity:
   - Common units: "kg", "g", "liters", "l", "ml", "pcs", "bottles", "cans", "packages", etc.
   - Convert Russian/Ukrainian units: "шт" → "pcs", "пачки" → "packages", "бутылки" → "bottles", etc.
   - If not specified, default to "unit"

6.  language: The detected primary language of the 'originalText' item (e.g., "en", "ru"). Use ISO 639-1 codes.

The output MUST be a valid JSON array of objects, where each object has the fields: "originalText", "normalizedText", "category", "quantity", "unit", "language".
Do not include any explanations or text outside of the JSON array itself. Ensure the JSON is well-formed.

Example Input:
"* Картошка (2 кг)
* Помидоры "черри"
* Яйца куриные С0 (по акции)
* Вода газированная 1.5л (2 бутылки)
---
* Бананы"

Example Output (JSON string):
[
  {
    "originalText": "Картошка (2 кг)",
    "normalizedText": "Картошка 2 кг (potatoes 2 kg)",
    "category": "Fresh Produce",
    "quantity": "2",
    "unit": "kg",
    "language": "ru"
  },
  {
    "originalText": "Помидоры \"черри\"",
    "normalizedText": "Помидоры черри (cherry tomatoes)",
    "category": "Fresh Produce",
    "quantity": "1",
    "unit": "unit",
    "language": "ru"
  },
  {
    "originalText": "Яйца куриные С0 (по акции)",
    "normalizedText": "Яйца куриные С0 по акции (chicken eggs C0 on sale)",
    "category": "Dairy & Eggs",
    "quantity": "1",
    "unit": "unit",
    "language": "ru"
  },
  {
    "originalText": "Вода газированная 1.5л (2 бутылки)",
    "normalizedText": "Вода газированная 1.5л 2 бутылки (sparkling water 1.5l 2 bottles)",
    "category": "Beverages",
    "quantity": "2",
    "unit": "bottles",
    "language": "ru"
  },
  {
    "originalText": "Бананы",
    "normalizedText": "Бананы (bananas)",
    "category": "Fresh Produce",
    "quantity": "1",
    "unit": "unit",
    "language": "ru"
  }
]

Now, process the following shopping list:
--- INPUT START ---
${rawText}
--- INPUT END ---
`;

  try {
    console.log('[AI_PROCESSING] Attempting to call model.generateContent with prompt:', prompt.substring(0, 200) + '...'); // Log beginning of prompt
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
    
    // Advanced JSON cleaning and fixing pipeline with enhanced error recovery
    try {
      // Clean the response
      let cleanedJsonString = aiResponseText;
      
      // Remove markdown code block indicators
      cleanedJsonString = cleanedJsonString.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
      
      // Remove any remaining backticks
      cleanedJsonString = cleanedJsonString.replace(/^`+|`+$/g, '').trim();
      
      // Handle common JSON issues
      // Fix trailing commas
      cleanedJsonString = cleanedJsonString.replace(/,(\s*[\]}])/g, '$1');
      
      // Fix missing commas between objects
      cleanedJsonString = cleanedJsonString.replace(/}(\s*){/g, '},{');
      
      // Fix truncated JSON with missing closing brackets
      // Find the last properly closed object by matching braces
      const fixBrokenJson = (json: string): string => {
        // Count opening and closing braces to detect missing braces
        let openBraces = 0;
        let openBrackets = 0;
        
        for (let i = 0; i < json.length; i++) {
          if (json[i] === '{') openBraces++;
          if (json[i] === '}') openBraces--;
          if (json[i] === '[') openBrackets++;
          if (json[i] === ']') openBrackets--;
        }
        
        // Add missing closing braces and brackets
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
      
      // Handle line breaks that cause parsing problems
      cleanedJsonString = cleanedJsonString.replace(/\n/g, ' ').trim();
      
      // Make sure it's an array
      if (!cleanedJsonString.startsWith('[')) {
        cleanedJsonString = '[' + cleanedJsonString;
      }
      if (!cleanedJsonString.endsWith(']')) {
        cleanedJsonString = cleanedJsonString + ']';
      }
      
      // Fix broken quotes and unescaped quotes in properties
      cleanedJsonString = cleanedJsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
      
      // Fix quotes inside property values that aren't properly escaped
      cleanedJsonString = cleanedJsonString.replace(/"([^"]*)""/g, '"$1\\"');
      
      // Additional handling for nested objects with quotes
      cleanedJsonString = cleanedJsonString.replace(/"{/g, '{').replace(/}"/g, '}');
      
      console.log('[AI_PROCESSING] Cleaned and fixed JSON String:', cleanedJsonString);
      
      try {
        // First try normal parsing
        const parsedItems = JSON.parse(cleanedJsonString);
        
        // Validate and return the results
        if (!Array.isArray(parsedItems)) {
          throw new Error("AI response is not a JSON array");
        }
        
        return parsedItems.map(item => ({
          originalText: String(item.originalText || ''),
          normalizedText: String(item.normalizedText || item.originalText || ''),
          category: String(item.category || 'Other'),
          quantity: String(item.quantity || '1'),
          unit: String(item.unit || 'unit'),
          language: String(item.language || 'en') 
        }));
      } catch (initialJsonError) {
        console.error('[AI_PROCESSING] Initial parsing failed, attempting advanced recovery:', initialJsonError);
        
        // More aggressive JSON repair - try fixing partial JSON by extracting valid objects
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
              language: String(item.language || 'en')
            }));
          } catch (recoveryError) {
            // If advanced recovery also fails, rethrow the original error
            console.error('[AI_PROCESSING] Advanced JSON recovery failed:', recoveryError);
            throw initialJsonError;
          }
        } else {
          // If we can't extract valid objects, rethrow the original error
          throw initialJsonError;
        }
      }
    } catch (jsonError) {
      // If JSON parsing fails, log and throw the error
      console.error('[AI_PROCESSING] Error parsing or fixing JSON:', jsonError);
      throw jsonError; // Re-throw to be caught by the outer try-catch
    }
  } catch (error) {
    console.error('[AI_PROCESSING] Error processing items with AI:', error);
    
    // Smart fallback function that uses simple keyword matching as a last resort
    // This is a basic fallback only when AI completely fails
    const basicCategorize = (item: string): string => {
      const lowerItem = item.toLowerCase();
      
      // Basic categorization logic - only used when AI completely fails
      if (/milk|cream|cheese|yogurt|butter|eggs|dairy|kefir|молоко|сыр|йогурт|творог|сметан|масло|яйца/i.test(lowerItem)) {
        return 'Dairy & Eggs';
      }
      if (/bread|bun|roll|bagel|muffin|croissant|хлеб|булк|батон|лаваш|выпечк/i.test(lowerItem)) {
        return 'Bakery';
      }
      if (/apple|orange|banana|fruit|vegetable|tomato|potato|onion|carrot|lettuce|cucumber|pepper|garlic|яблок|банан|апельсин|лимон|картош|помидор|томат|огурц|морковь|лук|чеснок|фрукт|овощ/i.test(lowerItem)) {
        return 'Fresh Produce';
      }
      if (/beef|chicken|pork|turkey|meat|sausage|bacon|говядин|свинин|курин|курица|филе|фарш|колбас|сосис|бекон|мясо/i.test(lowerItem)) {
        return 'Meat & Poultry';
      }
      if (/fish|salmon|tuna|seafood|рыба|лосось|тунец|морепродукт/i.test(lowerItem)) {
        return 'Fish & Seafood';
      }
      if (/frozen|ice cream|pizza|замороженн|пельмен|мороженое/i.test(lowerItem)) {
        return 'Frozen Foods';
      }
      if (/water|juice|soda|tea|coffee|drink|wine|beer|вода|сок|чай|кофе|напиток|пиво|вино/i.test(lowerItem)) {
        return 'Beverages';
      }
      if (/flour|sugar|salt|oil|rice|pasta|cereal|bean|sauce|ketchup|soup|мука|сахар|соль|рис|макарон|крупа|консерв|соус/i.test(lowerItem)) {
        return 'Pantry Staples';
      }
      if (/soap|detergent|cleaning|trash|bag|paper|towel|toilet|мыло|чистящ|пакет|салфетк/i.test(lowerItem)) {
        return 'Household Supplies';
      }
      
      // Default category
      return 'Other';
    };
    
    // Improved fallback logic with basic categorization
    return rawText
      .split('\n')
      .map(line => line.trim())
      // Filter out empty lines and dividers
      .filter(line => {
        if (line.length === 0) return false;
        if (/^-{3,}$/.test(line) || /^={3,}$/.test(line) || /^\*{3,}$/.test(line)) return false;
        return true;
      })
      // Clean the lines and apply basic categorization as last resort
      .map(line => {
        // Remove bullet points
        const cleanedItem = line.replace(/^[\*\•\-\s]+/, '').trim();
        
        // Detect language based on character set
        const hasСyrillic = /[\u0400-\u04FF]/.test(cleanedItem);
        const language = hasСyrillic ? 'ru' : 'en';
        
        // Basic quantity extraction
        let quantity = '1';
        let unit = 'unit';
        
        // Try to extract quantity and unit using regex
        const quantityMatch = cleanedItem.match(/(\d+(?:\.\d+)?)\s*(кг|kg|г|g|л|l|шт|pcs|штук|пачк|пачки|bottles|бутыл|бутылк)/i);
        if (quantityMatch) {
          quantity = quantityMatch[1];
          
          // Normalize units
          const rawUnit = quantityMatch[2].toLowerCase();
          if (/кг|kg/i.test(rawUnit)) unit = 'kg';
          else if (/г|g/i.test(rawUnit)) unit = 'g';
          else if (/л|l/i.test(rawUnit)) unit = 'l';
          else if (/шт|pcs|штук/i.test(rawUnit)) unit = 'pcs';
          else if (/пачк|пачки/i.test(rawUnit)) unit = 'packages';
          else if (/бутыл|bottles/i.test(rawUnit)) unit = 'bottles';
        }
        
        // Apply basic categorization as fallback
        const category = basicCategorize(cleanedItem);
        
        // Create normalized text with translation for Russian items
        let normalizedText = cleanedItem;
        if (language === 'ru') {
          // We don't have translation capability here, so just indicate it's untranslated
          normalizedText = cleanedItem + ' (untranslated)';
        }
        
        return {
          originalText: cleanedItem,
          normalizedText: normalizedText,
          category: category, // Use basic categorization
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
      // This case might happen if AI returns an empty array or if the fallback also results in no items.
      // The fallback in processItemsWithAI should ideally still parse based on newlines if AI truly fails.
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
