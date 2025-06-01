import { AdvancedCategoryPattern } from '../types';
import { BASE_CATEGORY_PATTERNS } from '../patterns/basePatterns';

export interface UserCorrection {
  item: string;
  wrongCategory: string;
  correctCategory: string;
  storeType: string;
  language: string;
  timestamp: Date;
  userId?: string;
}

export class LearningSystem {
  private corrections: UserCorrection[] = [];
  private patterns: { [category: string]: AdvancedCategoryPattern };

  constructor() {
    // Properly clone patterns while preserving RegExp objects
    this.patterns = this.deepClonePatterns(BASE_CATEGORY_PATTERNS);
  }

  private deepClonePatterns(patterns: { [category: string]: AdvancedCategoryPattern }): { [category: string]: AdvancedCategoryPattern } {
    const cloned: { [category: string]: AdvancedCategoryPattern } = {};
    
    for (const [category, pattern] of Object.entries(patterns)) {
      cloned[category] = {
        ...pattern,
        keywords: [...pattern.keywords],
        patterns: [...pattern.patterns], // RegExp objects are cloned by reference, which is fine
        synonyms: {
          ru: [...(pattern.synonyms.ru || [])],
          en: [...(pattern.synonyms.en || [])],
          pl: [...(pattern.synonyms.pl || [])]
        },
        brands: [...pattern.brands],
        units: [...pattern.units],
        modifiers: [...pattern.modifiers],
        contextRules: [...pattern.contextRules],
        exclusions: [...pattern.exclusions],
        lastUpdated: new Date(pattern.lastUpdated)
      };
    }
    
    return cloned;
  }

  learnFromCorrection(correction: UserCorrection): void {
    this.corrections.push(correction);
    const { item, wrongCategory, correctCategory } = correction;
    const words = this.extractSignificantWords(item);
    if (this.patterns[correctCategory]) {
      this.patterns[correctCategory].keywords.push(...words);
      this.patterns[correctCategory].weight += 0.1;
      this.patterns[correctCategory].usage++;
    }
    if (this.patterns[wrongCategory]) {
      this.patterns[wrongCategory].weight = Math.max(0.1, this.patterns[wrongCategory].weight - 0.05);
    }
    if (this.patterns[wrongCategory] && !this.patterns[wrongCategory].exclusions.includes(item.toLowerCase())) {
      this.patterns[wrongCategory].exclusions.push(item.toLowerCase());
    }
  }

  private extractSignificantWords(item: string): string[] {
    return item.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !/^\d+$/.test(word))
      .filter(word => !['кг', 'г', 'л', 'мл', 'шт'].includes(word));
  }

  getUpdatedPatterns(): { [category: string]: AdvancedCategoryPattern } {
    console.log('🎓 LearningSystem getUpdatedPatterns called, available patterns:', Object.keys(this.patterns));
    console.log('🎓 Sample pattern for "Dairy & Eggs":', this.patterns['Dairy & Eggs']);
    return this.patterns;
  }

  getCorrections(): UserCorrection[] {
    return [...this.corrections];
  }

  exportLearningData(): string {
    return JSON.stringify({
      corrections: this.corrections,
      patterns: this.patterns
    }, null, 2);
  }

  importLearningData(data: string): void {
    try {
      const parsed = JSON.parse(data);
      if (parsed.corrections) this.corrections = parsed.corrections;
      if (parsed.patterns) this.patterns = parsed.patterns;
    } catch (error) {
      // ignore
    }
  }
}

export const learningSystem = new LearningSystem();
