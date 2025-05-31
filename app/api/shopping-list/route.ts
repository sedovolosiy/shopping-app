// app/api/shopping-list/route.ts
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
  // Updated to use gemini-1.5-flash-8b or the latest flash model
  console.log('[AI_PROCESSING] Initialized GoogleGenerativeAI. Attempting to get model...');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); // Using -latest as -8b might not be a direct SDK identifier
  console.log('[AI_PROCESSING] Successfully got model.');

  const generationConfig = {
    temperature: 0.2, // Lower temperature for more deterministic output
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
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
The input can be in various formats (comma-separated, one item per line, multiple items on one line separated by spaces, mixed languages, colloquial terms).
For each item you identify, you need to extract or determine the following information:
1.  originalText: The exact text segment from the input that represents this item. If an item is clearly listed with quantity and unit (e.g., "milk 2 liters"), "milk 2 liters" is the originalText. If items are listed like "bread, eggs, 2kg apples", then "bread", "eggs", "2kg apples" are separate originalTexts.
2.  normalizedText: A standardized, common name for the product. If the item is in a language other than English, provide the normalized name in that language, and also try to provide an English equivalent in parentheses if it's a common food item. For example, if the input is "вешанки", normalizedText could be "вешанки (oyster mushrooms)". If input is "milk", normalizedText is "milk".
3.  category: A general shopping category for the item. Choose from the following categories: ${GENERAL_CATEGORIES.join(', ')}. If no category from the list is suitable, use "Other".
4.  quantity: The quantity of the item. If not specified, default to "1". Try to extract numerical values (e.g., "2", "1.5", "полкило" -> "0.5", "dozen" -> "12").
5.  unit: The unit of measurement for the quantity (e.g., "kg", "g", "liters", "ml", "pcs", "bottles", "cans", "dozen"). If not specified, default to "unit".
6.  language: The detected primary language of the 'originalText' item (e.g., "en", "uk", "pl", "ru"). Use ISO 639-1 codes.

The output MUST be a valid JSON array of objects, where each object has the fields: "originalText", "normalizedText", "category", "quantity", "unit", "language".
Do not include any explanations or text outside of the JSON array itself. Ensure the JSON is well-formed.

Example Input:
"молоко 2л, хліб, яйца 1 десяток, Cabbage, картопля 2 кг, вешанки, 3 apples"

Example Output (JSON string):
[
  {
    "originalText": "молоко 2л",
    "normalizedText": "молоко (milk)",
    "category": "Dairy & Eggs",
    "quantity": "2",
    "unit": "l",
    "language": "uk"
  },
  {
    "originalText": "хліб",
    "normalizedText": "хліб (bread)",
    "category": "Bakery",
    "quantity": "1",
    "unit": "unit",
    "language": "uk"
  },
  {
    "originalText": "яйца 1 десяток",
    "normalizedText": "яйца (eggs)",
    "category": "Dairy & Eggs",
    "quantity": "10",
    "unit": "pcs",
    "language": "ru"
  },
  {
    "originalText": "Cabbage",
    "normalizedText": "Cabbage",
    "category": "Fresh Produce",
    "quantity": "1",
    "unit": "unit",
    "language": "en"
  },
  {
    "originalText": "картопля 2 кг",
    "normalizedText": "картопля (potatoes)",
    "category": "Fresh Produce",
    "quantity": "2",
    "unit": "kg",
    "language": "uk"
  },
  {
    "originalText": "вешанки",
    "normalizedText": "вешанки (oyster mushrooms)",
    "category": "Fresh Produce",
    "quantity": "1",
    "unit": "unit",
    "language": "uk"
  },
  {
    "originalText": "3 apples",
    "normalizedText": "apples",
    "category": "Fresh Produce",
    "quantity": "3",
    "unit": "pcs",
    "language": "en"
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
    
    // Clean the response: remove markdown backticks and "json" prefix
    // More robust cleaning to handle different markdown formats
    let cleanedJsonString = aiResponseText;
    
    // Remove markdown code block indicators
    cleanedJsonString = cleanedJsonString.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
    
    // Remove any remaining backticks at the beginning or end
    cleanedJsonString = cleanedJsonString.replace(/^`+|`+$/g, '').trim();

    console.log('[AI_PROCESSING] Cleaned AI Response JSON String:', cleanedJsonString);
    
    const parsedItems = JSON.parse(cleanedJsonString);
    // Validate that parsedItems is an array
    if (!Array.isArray(parsedItems)) {
        throw new Error("AI response is not a JSON array.");
    }
    // Further validation can be added here to check the structure of each item
    return parsedItems.map(item => ({
        originalText: String(item.originalText || ''),
        normalizedText: String(item.normalizedText || item.originalText || ''),
        category: String(item.category || 'Other'),
        quantity: String(item.quantity || '1'),
        unit: String(item.unit || 'unit'),
        language: String(item.language || 'en') 
    }));

  } catch (error) {
    console.error('[AI_PROCESSING] Error processing items with AI:', error);
    // Fallback to simple parsing if AI fails
    return rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0).map(item => ({
      originalText: item,
      normalizedText: item.trim(),
      category: 'Uncategorized (AI Error)',
      quantity: '1',
      unit: 'unit',
      language: 'en',
    }));
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
      // Let's refine the error message or handling if AI returns nothing meaningful.
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
