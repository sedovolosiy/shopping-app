import { BASE_CATEGORY_PATTERNS } from './lib/categorization/patterns/basePatterns';

console.log('🧪 Тестируем категоризацию товаров...\n');

// Тестовые товары
const testItems = ['молоко', 'хлеб', 'яйца', 'мясо', 'огурцы', 'помидоры'];

function categorizeItem(item: string) {
  console.log(`\n--- Тестируем товар: "${item}" ---`);
  
  let bestMatch = null;
  let maxConfidence = 0;
  
  for (const [category, pattern] of Object.entries(BASE_CATEGORY_PATTERNS)) {
    let confidence = 0;
    let matchedTerms: string[] = [];
    
    // Keyword matching
    for (const keyword of pattern.keywords) {
      if (item.toLowerCase().includes(keyword.toLowerCase())) {
        confidence += 2.0; // exactMatch weight
        matchedTerms.push(keyword);
        console.log(`✅ Keyword match: "${keyword}" in category "${category}"`);
      }
    }
    
    // Pattern matching
    for (const regex of pattern.patterns) {
      if (regex.test(item)) {
        confidence += 1.5; // patternMatch weight
        console.log(`✅ Pattern match: ${regex} in category "${category}"`);
      }
    }
    
    // Apply pattern weight
    confidence *= pattern.weight;
    
    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      bestMatch = {
        category,
        confidence,
        matchedTerms
      };
    }
  }
  
  if (bestMatch) {
    console.log(`🏆 Best match: ${bestMatch.category} (confidence: ${bestMatch.confidence.toFixed(2)})`);
    return bestMatch;
  } else {
    console.log(`❌ No match found`);
    return null;
  }
}

// Запускаем тесты
testItems.forEach(categorizeItem);
