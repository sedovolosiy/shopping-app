// Utility functions for parsing and recovering JSON from AI responses

export function parseAiJsonResponse(aiResponseText: string): Array<{ originalText: string; normalizedText: string; category: string; quantity: string; unit: string; language: string }> {
  // Очистка ответа
  let cleanedJsonString = aiResponseText;
  cleanedJsonString = cleanedJsonString.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();
  cleanedJsonString = cleanedJsonString.replace(/^`+|`+$/g, '').trim();
  cleanedJsonString = cleanedJsonString.replace(/,(\s*[\]}])/g, '$1');
  cleanedJsonString = cleanedJsonString.replace(/}(\s*){/g, '},{');
  // Исправление неполного JSON с отсутствующими закрывающими скобками
  const fixBrokenJson = (json: string): string => {
    let openBraces = 0;
    let openBrackets = 0;
    for (let i = 0; i < json.length; i++) {
      if (json[i] === '{') openBraces++;
      if (json[i] === '}') openBraces--;
      if (json[i] === '[') openBrackets++;
      if (json[i] === ']') openBrackets--;
    }
    let fixed = json;
    while (openBraces > 0) { fixed += '}'; openBraces--; }
    while (openBrackets > 0) { fixed += ']'; openBrackets--; }
    return fixed;
  };
  cleanedJsonString = fixBrokenJson(cleanedJsonString);
  cleanedJsonString = cleanedJsonString.replace(/\n/g, ' ').trim();
  if (!cleanedJsonString.startsWith('[')) cleanedJsonString = '[' + cleanedJsonString;
  if (!cleanedJsonString.endsWith(']')) cleanedJsonString = cleanedJsonString + ']';
  cleanedJsonString = cleanedJsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  cleanedJsonString = cleanedJsonString.replace(/"(.*?)"/g, function(match, content) {
    let result = content.replace(/(?<!\\)"/g, '\\"');
    return '"' + result + '"';
  });
  cleanedJsonString = cleanedJsonString.replace(/"{/g, '{').replace(/}"/g, '}');
  try {
    const parsedItems = JSON.parse(cleanedJsonString);
    if (!Array.isArray(parsedItems)) throw new Error('AI response is not a JSON array');
    return parsedItems.map((item: any) => ({
      originalText: String(item.originalText || ''),
      normalizedText: String(item.normalizedText || item.originalText || ''),
      category: String(item.category || 'Other'),
      quantity: String(item.quantity || '1'),
      unit: String(item.unit || 'unit'),
      language: String(item.language || 'ru')
    }));
  } catch (initialJsonError) {
    // fallback: извлечение валидных объектов
    const objectsRegex = /{[^{}]*"originalText"[^{}]*"normalizedText"[^{}]*"category"[^{}]*"quantity"[^{}]*"unit"[^{}]*"language"[^{}]*}/g;
    const validObjectsMatches = cleanedJsonString.match(objectsRegex);
    if (validObjectsMatches && validObjectsMatches.length > 0) {
      const validArrayString = '[' + validObjectsMatches.join(',') + ']';
      try {
        const recoveredArray = JSON.parse(validArrayString);
        return recoveredArray.map((item: any) => ({
          originalText: String(item.originalText || ''),
          normalizedText: String(item.normalizedText || item.originalText || ''),
          category: String(item.category || 'Other'),
          quantity: String(item.quantity || '1'),
          unit: String(item.unit || 'unit'),
          language: String(item.language || 'ru')
        }));
      } catch {
        throw initialJsonError;
      }
    } else {
      throw initialJsonError;
    }
  }
}
