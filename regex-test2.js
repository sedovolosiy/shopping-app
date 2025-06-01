// Тест нового паттерна
const text = "молоко";

const newPattern =
  /(^|\s|,)(молоко|кефир|йогурт|сыр|масло|яйца|сливки|творог|молочн\w*|яичн\w*)($|\s|,)/i;

console.log("Testing text:", text);
console.log("New pattern test:", newPattern.test(text));

// Тест с различными контекстами
const testCases = [
  "молоко",
  "купить молоко",
  "молоко свежее",
  "молоко, кефир",
  "кефир",
  "йогурт",
  "молочные продукты",
  "яичный белок",
];

testCases.forEach((testCase) => {
  const result = newPattern.test(testCase);
  console.log(`"${testCase}": ${result ? "MATCHES" : "NO MATCH"}`);
});
