import EnhancedCategorizer from './lib/categorization';

async function runTests() {
  // Initialize the categorizer
  const categorizer = new EnhancedCategorizer();

  // Test with a more comprehensive list
  const testItems = [
    'молоко 3.2%',
    'хлеб белый', 
    'яйца куриные',
    'огурцы свежие',
    'помидоры красные',
    'курица филе',
    'мясо говядина',
    'колбаса варёная',
    'рыба лосось',
    'макароны',
    'рис',
    'сахар',
    'кофе растворимый',
    'чай зелёный',
    'пиво светлое',
    'шампунь',
    'мыло',
    'био молоко',
    'веганский сыр',
    'органические яблоки'
  ];

  console.log('🔍 Comprehensive categorization test with all fixed patterns:\n');

  // Test each item sequentially
  for (const item of testItems) {
    try {
      const result = await categorizer.categorizeItem(item, 'grocery', 'ru');
      
      if (result && result.category) {
        console.log(`✅ "${item}" → ${result.category} (${result.confidence.toFixed(2)})`);
      } else {
        console.log(`❌ "${item}" → No category found`);
      }
    } catch (error) {
      console.log(`❌ "${item}" → Error: ${error}`);
    }
  }

  console.log('\n🎯 Testing specific problematic items:');
  const problemItems = ['молоко', 'хлеб', 'огурцы', 'помидоры'];

  for (const item of problemItems) {
    try {
      const result = await categorizer.categorizeItem(item, 'grocery', 'ru');
      console.log(`\n--- ${item} ---`);
      console.log(`Category: ${result?.category || 'NONE'}`);
      console.log(`Confidence: ${result?.confidence?.toFixed(2) || 'N/A'}`);
      if (result?.matchedKeywords) {
        console.log(`Matched keywords: ${result.matchedKeywords.join(', ')}`);
      }
    } catch (error) {
      console.log(`\n--- ${item} ---`);
      console.log(`Error: ${error}`);
    }
  }
}

runTests().catch(console.error);
