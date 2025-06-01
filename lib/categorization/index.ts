import { CategoryMatcher } from './core/categoryMatcher';
import { learningSystem, UserCorrection } from './utils/learning';
import { metricsCollector } from './utils/metrics';
import { categorizationCache } from './utils/cache';
import { getCategoryOrder, getCategoryIcon, getStoreCategories } from './utils/categoryOrder';
import { CategorizationContext, CategorizationResult, UserPreferences } from './types';
import { BASE_CATEGORY_PATTERNS } from './patterns/basePatterns';

export class EnhancedCategorizer {
  private matcher = new CategoryMatcher();

  async categorizeItem(
    item: string,
    storeType: string,
    language?: string,
    userPreferences?: UserPreferences
  ): Promise<CategorizationResult> {
    const context: CategorizationContext = {
      storeType,
      language,
      userPreferences
    };
    return this.matcher.categorize(item, context);
  }

  async categorizeList(
    items: string[],
    storeType: string,
    options?: {
      language?: string;
      userPreferences?: UserPreferences;
      enableContext?: boolean;
    }
  ): Promise<CategorizationResult[]> {
    const results: CategorizationResult[] = [];
    for (const item of items) {
      const context: CategorizationContext = {
        storeType,
        language: options?.language,
        userPreferences: options?.userPreferences,
        contextItems: options?.enableContext ? items : undefined
      };
      const result = await this.matcher.categorize(item, context);
      results.push(result);
    }
    return results;
  }

  learnFromUser(
    item: string,
    wrongCategory: string,
    correctCategory: string,
    storeType: string,
    language: string = 'ru',
    userId?: string
  ): void {
    const correction: UserCorrection = {
      item,
      wrongCategory,
      correctCategory,
      storeType,
      language,
      timestamp: new Date(),
      userId
    };
    learningSystem.learnFromCorrection(correction);
  }

  getMetrics() {
    return {
      categorization: metricsCollector.getMetrics(),
      cache: categorizationCache.getStats(),
      learning: {
        corrections: learningSystem.getCorrections().length,
        patterns: Object.keys(learningSystem.getUpdatedPatterns()).length
      }
    };
  }

  clearCache(): void {
    categorizationCache.clear();
  }

  exportLearningData(): string {
    return learningSystem.exportLearningData();
  }

  importLearningData(data: string): void {
    learningSystem.importLearningData(data);
    categorizationCache.clear(); // Сброс кэша после импорта обучения
  }

  resetLearning(): void {
    // Сбросить историю исправлений и паттерны к начальному состоянию
    learningSystem.importLearningData(JSON.stringify({ corrections: [], patterns: BASE_CATEGORY_PATTERNS }));
    categorizationCache.clear();
  }

  getStoreInfo(storeType: string) {
    return {
      categories: getStoreCategories(storeType),
      categoryOrder: getCategoryOrder(storeType)
    };
  }
}

export function createLegacyAdapter(enhancedCategorizer: EnhancedCategorizer) {
  return {
    categorizeItem: async (itemName: string, storeType: string) => {
      const result = await enhancedCategorizer.categorizeItem(itemName, storeType);
      return {
        category: result.category,
        categoryOrder: result.categoryOrder
      };
    },
    processShoppingList: async (rawText: string, storeType: string) => {
      const items = rawText
        .split(/[\n,]+/)
        .map(line => line.trim())
        .filter(line => line !== '');
      const results = await enhancedCategorizer.categorizeList(items, storeType);
      return results.map((result, index) => ({
        id: `item-${index}`,
        name: items[index],
        category: result.category,
        categoryOrder: result.categoryOrder,
        purchased: false,
        originalText: items[index],
        language: 'ru',
        confidence: result.confidence
      }));
    },
    groupItemsByCategory: (items: any[]) => {
      return items.reduce((groups, item) => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
        return groups;
      }, {} as { [category: string]: any[] });
    },
    getCategoryOrder: (storeType: string) => getCategoryOrder(storeType),
    getCategoryIcon: (categoryName: string, storeType: string) => getCategoryIcon(categoryName, storeType)
  };
}

export { EnhancedCategorizer as default };
export * from './types';
export { getCategoryOrder, getCategoryIcon, getStoreCategories } from './utils/categoryOrder';
export { STORE_CONFIGS } from './storeConfigs';
