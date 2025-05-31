
export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  categoryOrder: number;
  purchased: boolean;
  originalText: string;
  language?: string; // Optional language property to store the detected language
}

export interface CategoryDefinition {
  name: string;
  order: number;
  keywords: string[];
  icon: string;
}

export interface StoreLayoutConfig {
  name: string;
  displayName: string;
  categories: CategoryDefinition[];
}

export interface StoreConfigs {
  [key: string]: StoreLayoutConfig;
}

export type StoreType = 'lidl' | 'biedronka' | 'aldi';
