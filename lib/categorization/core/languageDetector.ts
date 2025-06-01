import { franc, francAll } from 'franc';
import { LanguageDetectionResult } from '../types';

export class LanguageDetector {
  private cache = new Map<string, LanguageDetectionResult>();

  detect(text: string): LanguageDetectionResult {
    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }
    try {
      const primary = franc(text, { minLength: 3 });
      const all = francAll(text, { minLength: 3 });
      const languages: { [lang: string]: number } = {};
      all.forEach(item => {
        languages[item[0]] = item[1];
      });
      const result: LanguageDetectionResult = {
        primary: primary === 'und' ? 'ru' : primary,
        confidence: all.length > 0 ? all[0][1] : 0,
        mixed: all.length > 1,
        languages,
      };
      this.cache.set(text, result);
      return result;
    } catch (error) {
      return { primary: 'ru', confidence: 0, mixed: false, languages: {} };
    }
  }

  detectByCharacters(text: string): string {
    const hasCyrillic = /[\u0400-\u04FF]/.test(text);
    const hasLatin = /[a-zA-Z]/.test(text);
    if (hasCyrillic && !hasLatin) return 'ru';
    if (hasCyrillic && hasLatin) {
      const cyrillicCount = (text.match(/[\u0400-\u04FF]/g) || []).length;
      const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
      return cyrillicCount > latinCount ? 'ru' : 'en';
    }
    return 'en';
  }
}
