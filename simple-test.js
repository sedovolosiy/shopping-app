const {
  BASE_CATEGORY_PATTERNS,
} = require("./lib/categorization/patterns/basePatterns.ts");

console.log("Testing categorization patterns...");

// Test if 'Dairy & Eggs' pattern exists
console.log("Dairy & Eggs pattern:", BASE_CATEGORY_PATTERNS["Dairy & Eggs"]);

// Test keyword matching
const dairyPattern = BASE_CATEGORY_PATTERNS["Dairy & Eggs"];
if (dairyPattern) {
  console.log("Keywords:", dairyPattern.keywords);

  // Test if 'молоко' is in keywords
  const hasMillk = dairyPattern.keywords.includes("молоко");
  console.log("Has молоко:", hasMillk);

  // Test pattern matching
  const testText = "молоко";
  console.log("Testing:", testText);

  for (const pattern of dairyPattern.patterns) {
    const matches = pattern.test(testText);
    console.log(`Pattern ${pattern} matches:`, matches);
  }
}
