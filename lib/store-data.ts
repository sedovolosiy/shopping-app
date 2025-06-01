import EnhancedCategorizer, { createLegacyAdapter } from './categorization';

// Создание экземпляра нового категоризатора
const categorizer = new EnhancedCategorizer();
const legacyAdapter = createLegacyAdapter(categorizer);

// Экспортируй функции для обратной совместимости
export const categorizeItem = legacyAdapter.categorizeItem;
export const processShoppingList = legacyAdapter.processShoppingList;
export const groupItemsByCategory = legacyAdapter.groupItemsByCategory;
export const getCategoryOrder = legacyAdapter.getCategoryOrder;
export const getCategoryIcon = legacyAdapter.getCategoryIcon;

// Экспортируй STORE_CONFIGS для UI
export { STORE_CONFIGS } from './categorization/storeConfigs';

// (Остальные экспорты и функции по необходимости)
