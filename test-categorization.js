// Тестовый скрипт для проверки системы категоризации
const { EnhancedCategorizer } = require("./lib/categorization/index.ts");

async function testCategorization() {
  console.log("🧪 Тестируем систему категоризации...\n");

  const categorizer = new EnhancedCategorizer();

  // Тестовые товары
  const testItems = ["молоко", "хлеб", "яйца", "мясо", "огурцы", "помидоры"];

  console.log('📦 Тестируем товары для магазина "biedronka":\n');

  for (const item of testItems) {
    try {
      console.log(`\n--- Тестируем товар: "${item}" ---`);
      const result = await categorizer.categorizeItem(item, "biedronka", "ru");
      console.log(`✅ Результат:`, {
        category: result.category,
        categoryOrder: result.categoryOrder,
        confidence: result.confidence,
        matchedKeywords: result.matchedKeywords,
        appliedRules: result.appliedRules,
      });
    } catch (error) {
      console.error(`❌ Ошибка при категоризации "${item}":`, error);
    }
  }
}

testCategorization().catch(console.error);
