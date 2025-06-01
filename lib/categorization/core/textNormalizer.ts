import { removeStopwords, eng, rus } from 'stopword';

export class TextNormalizer {
  private cache = new Map<string, string>();

  normalize(text: string, language: string): string {
    const cacheKey = `${text}|${language}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    console.log('🔧 TextNormalizer.normalize input:', { text, language });
    
    let normalized = text.toLowerCase().trim();
    // Include Cyrillic characters (U+0400-U+04FF) along with standard word characters
    normalized = normalized.replace(/[^\w\s\u0400-\u04FF]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ');
    
    console.log('🔧 TextNormalizer after basic cleanup:', normalized);
    
    const stopwords = language === 'ru' ? rus : eng;
    const words = normalized.split(' ').filter(word => word.length > 1);
    
    console.log('🔧 TextNormalizer words before stopword removal:', words);
    
    normalized = removeStopwords(words, stopwords).join(' ');
    
    console.log('🔧 TextNormalizer final result:', normalized);
    
    this.cache.set(cacheKey, normalized);
    return normalized;
  }

  extractKeywords(text: string): string[] {
    return text.split(' ').filter(word => word.length > 2).map(word => word.toLowerCase());
  }

  extractUnits(text: string): string[] {
    const unitPatterns = [/([\d,.]+)\s*(кг|kg|г|g|л|l|мл|ml|шт|pcs|штук|пачк|бан|бутыл)/gi];
    const units: string[] = [];
    unitPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) units.push(...matches);
    });
    return units;
  }

  extractBrands(text: string, knownBrands: string[]): string[] {
    const foundBrands: string[] = [];
    const lowerText = text.toLowerCase();
    knownBrands.forEach(brand => {
      if (lowerText.includes(brand.toLowerCase())) foundBrands.push(brand);
    });
    return foundBrands;
  }
}
