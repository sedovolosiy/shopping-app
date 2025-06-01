import { BASE_CATEGORY_PATTERNS } from './lib/categorization/patterns/basePatterns';

console.log('Testing categorization patterns...');

// Test if 'Dairy & Eggs' pattern exists
console.log('Dairy & Eggs pattern:', BASE_CATEGORY_PATTERNS['Dairy & Eggs']);

// Test keyword matching
const dairyPattern = BASE_CATEGORY_PATTERNS['Dairy & Eggs'];
if (dairyPattern) {
  console.log('Keywords:', dairyPattern.keywords);
  
  // Test if 'молоко' is in keywords
  const hasMillk = dairyPattern.keywords.includes('молоко');
  console.log('Has молоко:', hasMillk);
  
  // Test pattern matching
  const testText = 'молоко';
  console.log('Testing:', testText);
  
  for (const pattern of dairyPattern.patterns) {
    const matches = pattern.test(testText);
    console.log(`Pattern ${pattern} matches:`, matches);
  }
}

// Test categorization logic manually
const testItem = 'молоко';
const normalizedText = testItem.toLowerCase();

console.log('\n=== Manual categorization test ===');
console.log('Item:', testItem);
console.log('Normalized:', normalizedText);

for (const [category, pattern] of Object.entries(BASE_CATEGORY_PATTERNS)) {
  let confidence = 0;
  const matchedTerms: string[] = [];
  
  // Keyword matching
  for (const keyword of pattern.keywords) {
    const keywordLower = keyword.toLowerCase();
    if (normalizedText.includes(keywordLower)) {
      confidence += 1.0; // Exact match weight
      matchedTerms.push(keyword);
      console.log(`✅ [${category}] Keyword match: "${keyword}"`);
    }
  }
  
  // Pattern matching
  for (const regex of pattern.patterns) {
    if (regex.test(testItem)) {
      confidence += 0.8; // Pattern match weight
      console.log(`✅ [${category}] Pattern match: ${regex}`);
    }
  }
  
  if (confidence > 0) {
    console.log(`➕ [${category}] Total confidence: ${confidence}, matched terms: [${matchedTerms.join(', ')}]`);
  }
}
