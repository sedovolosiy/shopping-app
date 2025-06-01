// AI prompt for shopping list processing

/**
 * Генерирует промпт для AI для структурирования списка покупок.
 * @param GENERAL_CATEGORIES - массив категорий для подстановки в промпт
 * @param rawText - исходный текстовый список покупок
 * @returns строка промпта для AI
 */

export const SHOPPING_LIST_AI_PROMPT = (
    GENERAL_CATEGORIES: string[],
    rawText: string
): string => `
You are a shopping list processing assistant.
Convert a text-based shopping list into a structured JSON array.

VERY IMPORTANT: If a single line lists multiple items separated by spaces (e.g., "Socks sausages ser zloty"),
identify them as separate products and create a distinct JSON object for each.
Split the line into individual products based on:
- Semantic differences between words
- Change of language (e.g., Russian/Polish/English)
- Clear change in product categories (e.g., clothing -> food)

For each product from the list:

1. originalText: The exact text of the product without list markers
     - Remove list markers (* • -) and numbering
     - Preserve details (quantity, brand) in parentheses, quotes, etc.
     - If multiple items are in one line, originalText should only contain the specific item

2. normalizedText: Standardized product name
     - DO NOT TRANSLATE to other languages
     - Include quantity, packaging, and brand information
     - Preserve context: "on sale", special notes
     - Convert colloquial or regional names to their standard, commonly accepted names **within the detected language of the product**. For example, if the product is in Russian and says "синенькие", it should be normalized to "баклажаны" (Russian for eggplant), not "eggplant" (English). If an English item is "blue ones", it can be normalized to "eggplant".
     - For quantity and unit information, "normalizedText" should incorporate the standardized numeric quantity and the common unit abbreviation appropriate for the detected language (e.g., "0.5 кг" for Russian "полкило", "10 шт" for Russian "десяток"). These converted forms should be used directly in the "normalizedText" string, aligning with the values that will be placed in the separate "quantity" and "unit" fields.
     - Examples:
         - English input: "Chicken thighs (2 packs)" -> "Chicken thighs 2 packs"
         - Russian input: "яблоки голден полкило" -> "яблоки голден 0.5 кг"
         - Russian input: "Мука (полкило)" -> "Мука 0.5 кг"
         - Russian input: "Яйца (десяток)" -> "Яйца 10 шт"

3. category: Category from this list: ${GENERAL_CATEGORIES.join(', ')}
     - If no suitable category, use "Other"

4. quantity: Product quantity
     - If specified, extract it (e.g., "2 kg", "1 pc")
     - If not specified, use "1"
     - For "several" or "a few", use "3"
     - Convert: "half a kilo" -> "0.5", "a dozen" -> "10"

5. unit: Unit of measurement for the quantity
     - Common: "kg", "g", "l", "ml", "pcs", "bottles", "cans", "packages"
     - Translate common local units: "шт" (sht) -> "pcs", "пачки" (pachki) -> "packages", "бутылки" (butylki) -> "bottles"
     - If not specified, use "unit"

6. language: Main language of the product text (e.g., "en", "ru", "pl")

Output format - a valid JSON array with fields: "originalText", "normalizedText", "category", "quantity", "unit", "language".

Input example:
"* Potatoes (2 kg)
* Cherry tomatoes
* Chicken eggs C0 (on sale)
* Socks sausages ser zloty
* Blue ones (for salad)
* Синенькие (на салат)
* Мука (полкило)
* яблоки голден полкило"

Expected output (JSON):
[
    {
        "originalText": "Potatoes (2 kg)",
        "normalizedText": "Potatoes 2 kg",
        "category": "Fresh Produce",
        "quantity": "2",
        "unit": "kg",
        "language": "ru"
    },
    {
        "originalText": "Cherry tomatoes",
        "normalizedText": "Cherry tomatoes",
        "category": "Fresh Produce",
        "quantity": "1",
        "unit": "unit",
        "language": "en"
    },
    {
        "originalText": "Chicken eggs C0 (on sale)",
        "normalizedText": "Chicken eggs C0 on sale",
        "category": "Dairy & Eggs",
        "quantity": "1",
        "unit": "unit",
        "language": "ru"
    },
    {
        "originalText": "Socks",
        "normalizedText": "Socks",
        "category": "Other",
        "quantity": "1",
        "unit": "unit",
        "language": "en"
    },
    {
        "originalText": "sausages",
        "normalizedText": "sausages",
        "category": "Meat & Poultry",
        "quantity": "1",
        "unit": "unit",
        "language": "en"
    },
    {
        "originalText": "ser zloty",
        "normalizedText": "ser zloty",
        "category": "Dairy & Eggs",
        "quantity": "1",
        "unit": "unit",
        "language": "pl"
    },
    {
        "originalText": "Blue ones (for salad)",
        "normalizedText": "Eggplant for salad",
        "category": "Fresh Produce",
        "quantity": "1",
        "unit": "unit",
        "language": "en"
    },
    {
        "originalText": "Синенькие (на салат)",
        "normalizedText": "Баклажаны на салат",
        "category": "Fresh Produce",
        "quantity": "1",
        "unit": "unit",
        "language": "ru"
    },
    {
        "originalText": "Мука (полкило)",
        "normalizedText": "Мука 0.5 кг",
        "category": "Pantry Staples",
        "quantity": "0.5",
        "unit": "kg",
        "language": "ru"
    },
    {
        "originalText": "яблоки голден полкило",
        "normalizedText": "яблоки голден 0.5 кг",
        "category": "Fresh Produce",
        "quantity": "0.5",
        "unit": "kg",
        "language": "ru"
    }
]

Process the following shopping list:
--- START OF INPUT DATA ---
${rawText}
--- END OF INPUT DATA ---
`;
