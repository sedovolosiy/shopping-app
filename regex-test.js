// Простой тест регулярных выражений
const text = "молоко";

// Тесты различных паттернов
const patterns = [
  /\b(молоко|кефир|йогурт|сыр|масло|яйца|сливки|творог|молочн\w*|яичн\w*)\b/i,
  /молоко/i,
  /\bмолоко\b/i,
  /(молоко)/i,
  /^молоко$/i,
];

console.log("Testing text:", text);
console.log("Text length:", text.length);
console.log(
  "Character codes:",
  Array.from(text).map((c) => c.charCodeAt(0))
);

patterns.forEach((pattern, index) => {
  const matches = pattern.test(text);
  console.log(
    `Pattern ${index + 1}: ${pattern} -> ${matches ? "MATCHES" : "NO MATCH"}`
  );
});

// Проверим, что именно ищет наше выражение
const complexPattern =
  /\b(молоко|кефир|йогурт|сыр|масло|яйца|сливки|творог|молочн\w*|яичн\w*)\b/i;
const match = text.match(complexPattern);
console.log("Match result:", match);

// Тест с другими словами
const testWords = [
  "кефир",
  "йогурт",
  "сыр",
  "масло",
  "яйца",
  "молочные",
  "яичный",
];
testWords.forEach((word) => {
  const result = complexPattern.test(word);
  console.log(`${word}: ${result ? "MATCHES" : "NO MATCH"}`);
});
