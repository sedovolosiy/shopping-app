// Типы для системы категоризации
export interface LanguageDetectionResult {
  primary: string;
  confidence: number;
  mixed: boolean;
  languages: { [lang: string]: number };
}

export interface AdvancedCategoryPattern {
  keywords: string[];
  patterns: RegExp[];
  synonyms: { [lang: string]: string[] };
  brands: string[];
  units: string[];
  modifiers: string[];
  contextRules: ContextRule[];
  exclusions: string[];
  weight: number;
  priority: number;
  confidence: number;
  lastUpdated: Date;
  usage: number;
}

export interface ContextRule {
  type: 'co-occurrence' | 'sequence' | 'exclusion';
  items: string[];
  boost: number;
}

export interface CategorizationContext {
  storeType: string;
  language?: string;
  userPreferences?: UserPreferences;
  contextItems?: string[];
}

export interface CategorizationResult {
  category: string;
  categoryOrder: number;
  confidence: number;
  icon?: string;
  matchedKeywords?: string[];
  appliedRules?: string[];
}

export interface UserPreferences {
  preferredLanguage?: string;
  customCategories?: { [item: string]: string };
  learningEnabled?: boolean;
}

export interface StoreCategory {
  name: string;
  order: number;
  icon: string;
  keywords: string[];
}

export interface StoreConfig {
  name: string;
  displayName: string;
  categories: StoreCategory[];
}

export type StoreConfigs = {
  [store: string]: StoreConfig;
};

export interface ItemFeatures {
  originalText: string;
  normalizedText: string;
  detectedLanguage: string;
  keywords: string[];
  brands: string[];
  units: string[];
  modifiers: string[];
}

export interface PatternMatch {
  category: string;
  confidence: number;
  matchType: 'exact' | 'pattern' | 'fuzzy' | 'synonym' | 'context';
  matchedTerms: string[];
}
