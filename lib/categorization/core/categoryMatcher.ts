import { LanguageDetector } from './languageDetector';
import { TextNormalizer } from './textNormalizer';
import { FuzzyMatcher } from './fuzzyMatcher';
import { BASE_CATEGORY_PATTERNS, CATEGORIZATION_WEIGHTS } from '../patterns/basePatterns';
import { STORE_SPECIFIC_PATTERNS } from '../patterns/storePatterns';
import { getCategoryOrder, getCategoryIcon } from '../utils/categoryOrder';
import { categorizationCache } from '../utils/cache';
import { metricsCollector } from '../utils/metrics';
import { learningSystem } from '../utils/learning';
import { CategorizationContext, CategorizationResult, ItemFeatures, PatternMatch } from '../types';

export class CategoryMatcher {
  private languageDetector = new LanguageDetector();
  private textNormalizer = new TextNormalizer();
  private fuzzyMatcher = new FuzzyMatcher();

  async categorize(item: string, context: CategorizationContext): Promise<CategorizationResult> {
    const { storeType, language, userPreferences } = context;
    const cacheKey = categorizationCache.generateKey(item, storeType, language);
    const cached = categorizationCache.get(cacheKey);
    if (cached) return cached;

    // 1. Пользовательские категории имеют приоритет
    if (userPreferences?.customCategories && userPreferences.customCategories[item]) {
      const customCategory = userPreferences.customCategories[item];
      const categoryOrder = getCategoryOrder(storeType)[customCategory] ?? 999;
      const icon = getCategoryIcon(customCategory, storeType);
      const result: CategorizationResult = {
        category: customCategory,
        categoryOrder,
        confidence: 1,
        icon,
        matchedKeywords: [item],
        appliedRules: ['user_custom']
      };
      categorizationCache.set(cacheKey, result);
      metricsCollector.trackCategorization(item, result.category, result.confidence, language || 'auto', storeType);
      return result;
    }

    try {
      const features = await this.extractFeatures(item, language);
      const matches = this.applyPatterns(features, context);
      const contextualMatches = this.applyContextualAnalysis(matches, context);
      const bestMatch = this.selectBestMatch(contextualMatches);
      const categoryOrder = getCategoryOrder(storeType)[bestMatch.category] ?? 999;
      const icon = getCategoryIcon(bestMatch.category, storeType);
      const result: CategorizationResult = {
        category: bestMatch.category,
        categoryOrder,
        confidence: bestMatch.confidence,
        icon,
        matchedKeywords: bestMatch.matchedTerms,
        appliedRules: [`${bestMatch.matchType}_match`]
      };
      categorizationCache.set(cacheKey, result);
      metricsCollector.trackCategorization(item, result.category, result.confidence, features.detectedLanguage, storeType);
      return result;
    } catch (error) {
      return this.getFallbackResult(storeType);
    }
  }

  private async extractFeatures(item: string, language?: string): Promise<ItemFeatures> {
    const detectedLang = language || this.languageDetector.detectByCharacters(item);
    const normalizedText = this.textNormalizer.normalize(item, detectedLang);
    
    console.log('🔍 CategoryMatcher extractFeatures:', {
      originalText: item,
      detectedLanguage: detectedLang,
      normalizedText
    });
    
    return {
      originalText: item,
      normalizedText,
      detectedLanguage: detectedLang,
      keywords: this.textNormalizer.extractKeywords(normalizedText),
      brands: [],
      units: this.textNormalizer.extractUnits(item),
      modifiers: this.extractModifiers(item)
    };
  }

  private extractModifiers(text: string): string[] {
    const modifierPatterns = [
      /\b(свеж|органическ|био|эко|натуральн|домашн|фермерск)\w*\b/gi,
      /\b(заморож|охлажд|копчен|сушен|консервирован)\w*\b/gi
    ];
    const modifiers: string[] = [];
    modifierPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) modifiers.push(...matches.map(m => m.toLowerCase()));
    });
    return modifiers;
  }

  private applyPatterns(features: ItemFeatures, context: CategorizationContext): PatternMatch[] {
    const matches: PatternMatch[] = [];
    const patterns = learningSystem.getUpdatedPatterns();
    
    console.log('📋 CategoryMatcher applyPatterns:', {
      item: features.originalText,
      normalizedText: features.normalizedText,
      storeType: context.storeType,
      availablePatterns: Object.keys(patterns),
      totalPatterns: Object.keys(patterns).length
    });
    
    // Проверим конкретные паттерны для молочных продуктов
    if (patterns['Dairy & Eggs']) {
      console.log('🥛 Dairy & Eggs pattern details:', {
        keywords: patterns['Dairy & Eggs'].keywords,
        patterns: patterns['Dairy & Eggs'].patterns,
        weight: patterns['Dairy & Eggs'].weight
      });
    }
    
    for (const [category, pattern] of Object.entries(patterns)) {
      console.log(`🔄 Starting to process category: "${category}"`);
      
      try {
        let confidence = 0;
        const matchedTerms: string[] = [];
        let matchType: PatternMatch['matchType'] = 'exact';
        
        // Логируем только для молочной категории при тестировании "молоко"
        const isTargetCategory = category === 'Dairy & Eggs' && features.originalText === 'молоко';
        if (isTargetCategory) {
          console.log(`🎯 Testing "${features.originalText}" against "${category}":`, {
            keywords: pattern.keywords,
            normalizedText: features.normalizedText
          });
        }        // Keyword matching
        for (const keyword of pattern.keywords) {
          const keywordLower = keyword.toLowerCase();
          const normalizedLower = features.normalizedText.toLowerCase();
          
          // More detailed logging for debugging
          if (features.originalText === 'молоко' || features.originalText === 'хлеб' || features.originalText === 'сыр') {
            console.log(`🔍 [${category}] Checking keyword "${keyword}" (${keywordLower}) against "${features.normalizedText}" (${normalizedLower})`);
            console.log(`📝 [${category}] Does "${normalizedLower}" include "${keywordLower}"?`, normalizedLower.includes(keywordLower));
          }
          
          if (normalizedLower.includes(keywordLower)) {
            confidence += CATEGORIZATION_WEIGHTS.exactMatch;
            matchedTerms.push(keyword);
            matchType = 'exact';
            console.log(`✅ Keyword match: "${keyword}" in category "${category}", confidence: ${confidence}`);
          }
        }
        
        // Pattern matching
        for (const regex of pattern.patterns) {
          if (regex.test(features.originalText)) {
            confidence += CATEGORIZATION_WEIGHTS.patternMatch;
            matchType = 'pattern';
            console.log(`✅ Pattern match: ${regex} in category "${category}", confidence: ${confidence}`);
          }
        }
        
        // Fuzzy matching - re-enabled
        const fuzzyMatches = this.fuzzyMatcher.findSimilar(features.normalizedText, pattern.keywords, 2);
        if (fuzzyMatches.length > 0) {
          confidence += CATEGORIZATION_WEIGHTS.fuzzyMatch * fuzzyMatches[0].similarity;
          matchedTerms.push(...fuzzyMatches.map(m => m.term));
          matchType = 'fuzzy';
          console.log(`✅ Fuzzy match in category "${category}":`, fuzzyMatches, `confidence: ${confidence}`);
        }
        
        // Synonym matching
        const synonyms = pattern.synonyms[features.detectedLanguage] || [];
        for (const synonym of synonyms) {
          if (features.normalizedText.includes(synonym.toLowerCase())) {
            confidence += CATEGORIZATION_WEIGHTS.aliasMatch;
            matchedTerms.push(synonym);
            matchType = 'synonym';
            console.log(`✅ Synonym match: "${synonym}" in category "${category}", confidence: ${confidence}`);
          }
        }
        
        // Check exclusions
        const isExcluded = pattern.exclusions.some(exclusion => features.normalizedText.includes(exclusion.toLowerCase()));
        if (isExcluded) {
          console.log(`❌ Item excluded from category "${category}"`);
          confidence *= 0.1;
        }
        
        // Apply pattern weight
        confidence *= pattern.weight;
        
        // Store-specific patterns bonus
        confidence += this.applyStoreSpecificPatterns(features, category, context);
        
        if (confidence > 0) {
          console.log(`➕ Adding match for category "${category}": confidence=${confidence}, matchType=${matchType}, terms=[${matchedTerms.join(', ')}]`);
          matches.push({ category, confidence, matchType, matchedTerms });
        }
        
        console.log(`✅ Finished processing category: "${category}" with confidence: ${confidence}`);
      } catch (error) {
        console.error(`💥 Error processing category "${category}":`, error);
        console.log(`✅ Finished processing category: "${category}" with error`);
      }
    }
    
    const sortedMatches = matches.sort((a, b) => b.confidence - a.confidence);
    console.log('🏆 Final sorted matches:', sortedMatches);
    
    return sortedMatches;
  }

  private applyStoreSpecificPatterns(features: ItemFeatures, category: string, context: CategorizationContext): number {
    const storeType = context.storeType as keyof typeof STORE_SPECIFIC_PATTERNS;
    const storePatterns = STORE_SPECIFIC_PATTERNS[storeType] as Record<string, any>;
    if (!storePatterns || typeof storePatterns !== 'object' || !(category in storePatterns)) return 0;
    let bonus = 0;
    const storePattern = storePatterns[category];
    if (storePattern.localBrands) {
      for (const brand of storePattern.localBrands) {
        if (features.originalText.toLowerCase().includes(brand.toLowerCase())) bonus += 0.2;
      }
    }
    if (storePattern.promotionalKeywords) {
      for (const keyword of storePattern.promotionalKeywords) {
        if (features.normalizedText.includes(keyword.toLowerCase())) bonus += 0.1;
      }
    }
    return bonus;
  }

  private applyContextualAnalysis(matches: PatternMatch[], context: CategorizationContext): PatternMatch[] {
    return matches;
  }

  private selectBestMatch(matches: PatternMatch[]): PatternMatch {
    if (matches.length === 0) {
      return { category: 'Other', confidence: 0, matchType: 'exact', matchedTerms: [] };
    }
    return matches[0];
  }

  private getFallbackResult(storeType: string): CategorizationResult {
    const categoryOrder = getCategoryOrder(storeType)['Other'] ?? 999;
    const icon = getCategoryIcon('Other', storeType);
    return {
      category: 'Other',
      categoryOrder,
      confidence: 0,
      icon,
      matchedKeywords: [],
      appliedRules: ['fallback']
    };
  }
}
