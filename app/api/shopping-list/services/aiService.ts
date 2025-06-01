// AI processing service for shopping list
import { parseAiJsonResponse } from '../utils/jsonParser';
import { basicCategorize } from '../utils/itemCategorizer';
import { SHOPPING_LIST_AI_PROMPT } from './aiPrompt';

export async function processShoppingList(rawText: string): Promise<Array<{ originalText: string; normalizedText: string; category: string; quantity: string; unit: string; language: string }>> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Google Gemini API key not found.');
  }
  const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  const generationConfig = {
    temperature: 0.2,
    topK: 1,
    topP: 1,
    maxOutputTokens: 8192,
  };
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];
  const GENERAL_CATEGORIES = [
    'Fresh Produce', 'Bakery', 'Dairy & Eggs', 'Meat & Poultry', 'Fish & Seafood',
    'Frozen Foods', 'Pantry Staples', 'Snacks', 'Beverages', 'Household Supplies',
    'Personal Care', 'Baby Items', 'Pet Supplies', 'Other'
  ];
  const prompt = SHOPPING_LIST_AI_PROMPT(GENERAL_CATEGORIES, rawText);
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });
    const response = result.response;
    if (!response) throw new Error('AI model did not return a response object.');
    const aiResponseText = response.text();
    return parseAiJsonResponse(aiResponseText);
  } catch (error) {
    // fallback: basic categorization
    return rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !/^[-=\*]{3,}$/.test(line))
      .map(line => {
        const cleanedItem = line.replace(/^[\*\•\-\s]+/, '').trim();
        const hasCyrillic = /[\u0400-\u04FF]/.test(cleanedItem);
        const hasLatin = /[a-zA-Z]/.test(cleanedItem);
        let language = 'en';
        if (hasCyrillic && !hasLatin) language = 'ru';
        else if (hasCyrillic && hasLatin) {
          const cyrillicCount = (cleanedItem.match(/[\u0400-\u04FF]/g) || []).length;
          const latinCount = (cleanedItem.match(/[a-zA-Z]/g) || []).length;
          language = cyrillicCount > latinCount ? 'ru' : 'en';
        }
        let quantity = '1';
        let unit = 'unit';
        const quantityMatch = cleanedItem.match(/(\d+(?:\.\d+)?)\s*(кг|kg|г|g|л|l|шт|pcs|штук|пачк|пачки|bottles|бутыл|бутылк)/i);
        if (quantityMatch) {
          quantity = quantityMatch[1];
          const rawUnit = quantityMatch[2].toLowerCase();
          if (/кг|kg/i.test(rawUnit)) unit = 'kg';
          else if (/г|g/i.test(rawUnit)) unit = 'g';
          else if (/л|l/i.test(rawUnit)) unit = 'l';
          else if (/шт|pcs|штук/i.test(rawUnit)) unit = 'pcs';
          else if (/пачк|пачки/i.test(rawUnit)) unit = 'packages';
          else if (/бутыл|bottles/i.test(rawUnit)) unit = 'bottles';
        }
        const category = basicCategorize(cleanedItem);
        return {
          originalText: cleanedItem,
          normalizedText: cleanedItem,
          category,
          quantity,
          unit,
          language,
        };
      });
  }
}
