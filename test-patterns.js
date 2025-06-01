// Test the regex patterns with Cyrillic characters
const testPatterns = {
  "Dairy & Eggs": [
    /(^|\s|,)(молоко|кефир|йогурт|сыр|масло|яйца|сливки|творог)($|\s|,)/i,
    /(молочн\w*|яичн\w*)/i,
  ],
  Bakery: [
    /(^|\s|,)(хлеб|булка|батон|багет|рогалик|сдоба|круассан|лаваш)($|\s|,)/i,
    /(булк\w*)/i,
    /(^|\s|,)(выпечка|пончики|булочка)($|\s|,)/i,
    /(выпечк\w*|пончик\w*|булочк\w*)/i,
  ],
  "Fresh Produce": [
    /(^|\s|,)(овощи|фрукты|зелень)($|\s|,)/i,
    /(овощ\w*|фрукт\w*|зелен\w*)/i,
    /(^|\s|,)(картошка|помидоры|огурцы|морковь|капуста|лук|чеснок)($|\s|,)/i,
    /(картош\w*|помидор\w*|огурц\w*|морков\w*|капуст\w*)/i,
  ],
  "Bio & Vegan": [
    /(^|\s|,)(био|эко|органик|веган|безглютенов)($|\s|,)/i,
    /(био\w*|эко\w*|органик\w*|веган\w*|безглютенов\w*)/i,
  ],
};

// Test items
const testItems = [
  "молоко 3.2%",
  "хлеб белый",
  "огурцы свежие",
  "помидоры красные",
  "био молоко",
  "веганский сыр",
  "органическое яблоко",
];

console.log("Testing regex patterns with Cyrillic characters:\n");

testItems.forEach((item) => {
  console.log(`Testing item: "${item}"`);

  Object.entries(testPatterns).forEach(([category, patterns]) => {
    patterns.forEach((pattern, index) => {
      const match = pattern.test(item);
      if (match) {
        console.log(`  ✅ ${category} (pattern ${index + 1}): MATCH`);
        const matches = item.match(pattern);
        if (matches) {
          console.log(`     Matched: "${matches[0]}"`);
        }
      }
    });
  });
  console.log();
});

console.log("Direct regex tests:");
console.log('Testing "молоко" against /(^|\\s|,)(молоко|кефир)($|\\s|,)/i:');
const milkPattern = /(^|\s|,)(молоко|кефир)($|\s|,)/i;
console.log("  Result:", milkPattern.test("молоко"));
console.log("  Match:", "молоко".match(milkPattern));

console.log('\nTesting "хлеб" against /(^|\\s|,)(хлеб|булка)($|\\s|,)/i:');
const breadPattern = /(^|\s|,)(хлеб|булка)($|\s|,)/i;
console.log("  Result:", breadPattern.test("хлеб"));
console.log("  Match:", "хлеб".match(breadPattern));
