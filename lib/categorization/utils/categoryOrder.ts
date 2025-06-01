import { STORE_CONFIGS } from '../storeConfigs';

export function getCategoryOrder(storeType?: string): { [category: string]: number } {
  if (!storeType || typeof storeType !== 'string') return {};
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType];
  const order: { [category: string]: number } = {};
  if (!storeConfig) return order;
  storeConfig.categories.forEach(category => {
    order[category.name] = category.order;
  });
  return order;
}

export function getCategoryIcon(categoryName: string, storeType?: string): string {
  if (!storeType || typeof storeType !== 'string') return formatIconName(categoryName);
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType];
  if (!storeConfig) return formatIconName(categoryName);
  const category = storeConfig.categories.find(cat => cat.name === categoryName);
  return category?.icon || formatIconName(categoryName);
}

function formatIconName(categoryName: string): string {
  // Удаляем спецсимволы, пробелы, делаем PascalCase
  return categoryName
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function getStoreCategories(storeType?: string): string[] {
  if (!storeType || typeof storeType !== 'string') return [];
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType];
  if (!storeConfig) return [];
  return storeConfig.categories.sort((a, b) => a.order - b.order).map(cat => cat.name);
}

export function validateCategory(category: string, storeType: string): boolean {
  const storeCategories = getStoreCategories(storeType);
  return storeCategories.includes(category);
}
