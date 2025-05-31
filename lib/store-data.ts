import { StoreConfigs, CategoryDefinition, ShoppingItem, StoreType } from './types';

// Конфигурации магазинов с категориями и ключевыми словами
export const STORE_CONFIGS: StoreConfigs = {
  lidl: {
    name: 'lidl',
    displayName: 'Lidl',
    categories: [
      {
        name: 'Свежие продукты',
        order: 1,
        icon: 'apple',
        keywords: [
          'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
          'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
          'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат'
        ]
      },
      {
        name: 'Хлебобулочные изделия',
        order: 2,
        icon: 'wheat',
        keywords: [
          'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
          'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс'
        ]
      },
      {
        name: 'Молочные продукты',
        order: 3,
        icon: 'milk',
        keywords: [
          'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
          'масло', 'маргарин', 'яйца', 'сливки', 'простокваша'
        ]
      },
      {
        name: 'Мясные продукты',
        order: 4,
        icon: 'beef',
        keywords: [
          'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
          'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет'
        ]
      },
      {
        name: 'Замороженные продукты',
        order: 5,
        icon: 'snowflake',
        keywords: [
          'замороженные', 'мороженое', 'пельмени', 'вареники', 'блины',
          'замороженные овощи', 'замороженные фрукты', 'рыбные палочки'
        ]
      },
      {
        name: 'Сухие товары и консервы',
        order: 6,
        icon: 'package',
        keywords: [
          'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
          'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
          'уксус', 'соусы', 'кетчуп', 'майонез', 'снеки', 'чипсы', 'орехи'
        ]
      },
      {
        name: 'Напитки',
        order: 7,
        icon: 'coffee',
        keywords: [
          'вода', 'сок', 'газировка', 'кола', 'пиво', 'вино', 'чай', 'кофе',
          'энергетики', 'лимонад', 'квас', 'компот'
        ]
      },
      {
        name: 'Бытовая химия',
        order: 8,
        icon: 'spray-can',
        keywords: [
          'мыло', 'шампунь', 'гель', 'порошок', 'кондиционер', 'моющее средство',
          'туалетная бумага', 'салфетки', 'полотенца', 'губки', 'перчатки',
          'освежитель', 'дезодорант', 'зубная паста', 'щетка'
        ]
      },
      {
        name: 'Импульсивные покупки',
        order: 9,
        icon: 'candy',
        keywords: [
          'конфеты', 'шоколад', 'жвачка', 'леденцы', 'батончики', 'журналы',
          'зарядка', 'батарейки', 'мелочи'
        ]
      }
    ]
  },
  biedronka: {
    name: 'biedronka',
    displayName: 'Biedronka',
    categories: [
      {
        name: 'Свежие продукты',
        order: 1,
        icon: 'apple',
        keywords: [
          'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
          'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
          'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат', 'органические'
        ]
      },
      {
        name: 'Мясные продукты',
        order: 2,
        icon: 'beef',
        keywords: [
          'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
          'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет'
        ]
      },
      {
        name: 'Молочные продукты',
        order: 3,
        icon: 'milk',
        keywords: [
          'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
          'масло', 'маргарин', 'яйца', 'сливки', 'простокваша'
        ]
      },
      {
        name: 'Хлебобулочные изделия',
        order: 4,
        icon: 'wheat',
        keywords: [
          'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
          'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс', 'кондитерские'
        ]
      },
      {
        name: 'Сухие товары и консервы',
        order: 5,
        icon: 'package',
        keywords: [
          'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
          'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
          'уксус', 'соусы', 'кетчуп', 'майонез', 'снеки', 'чипсы', 'орехи', 'закуски'
        ]
      },
      {
        name: 'Напитки',
        order: 6,
        icon: 'coffee',
        keywords: [
          'вода', 'сок', 'газировка', 'кола', 'пиво', 'вино', 'чай', 'кофе',
          'энергетики', 'лимонад', 'квас', 'компот'
        ]
      },
      {
        name: 'Бытовая химия',
        order: 7,
        icon: 'spray-can',
        keywords: [
          'мыло', 'шампунь', 'гель', 'порошок', 'кондиционер', 'моющее средство',
          'туалетная бумага', 'салфетки', 'полотенца', 'губки', 'перчатки',
          'освежитель', 'дезодорант', 'зубная паста', 'щетка', 'гигиена'
        ]
      },
      {
        name: 'Сезонные товары',
        order: 8,
        icon: 'gift',
        keywords: [
          'игрушки', 'техника', 'украшения', 'сезонные', 'детские товары',
          'мелкая техника', 'аксессуары'
        ]
      },
      {
        name: 'Промо-зона',
        order: 9,
        icon: 'candy',
        keywords: [
          'конфеты', 'шоколад', 'жвачка', 'леденцы', 'батончики', 'журналы',
          'зарядка', 'батарейки', 'мелочи', 'акция', 'промо'
        ]
      }
    ]
  },
  aldi: {
    name: 'aldi',
    displayName: 'Aldi',
    categories: [
      {
        name: 'Сухие товары и консервы',
        order: 1,
        icon: 'package',
        keywords: [
          'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
          'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
          'уксус', 'соусы', 'кетчуп', 'майонез', 'упакованные'
        ]
      },
      {
        name: 'Молочные продукты',
        order: 2,
        icon: 'milk',
        keywords: [
          'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
          'масло', 'маргарин', 'яйца', 'сливки', 'простокваша', 'охлажденные'
        ]
      },
      {
        name: 'Замороженные продукты',
        order: 3,
        icon: 'snowflake',
        keywords: [
          'замороженные', 'мороженое', 'пельмени', 'вареники', 'блины',
          'замороженные овощи', 'замороженные фрукты', 'рыбные палочки',
          'замороженное мясо'
        ]
      },
      {
        name: 'Снеки и напитки',
        order: 4,
        icon: 'coffee',
        keywords: [
          'снеки', 'чипсы', 'орехи', 'закуски', 'вода', 'сок', 'газировка', 'кола',
          'пиво', 'вино', 'чай', 'кофе', 'энергетики', 'лимонад', 'квас', 'компот'
        ]
      },
      {
        name: 'Aldi Finds (Сезонные товары)',
        order: 5,
        icon: 'gift',
        keywords: [
          'сезонные', 'промо', 'finds', 'еженедельные', 'специальные',
          'непродовольственные', 'техника', 'одежда', 'аксессуары'
        ]
      },
      {
        name: 'Свежие продукты',
        order: 6,
        icon: 'apple',
        keywords: [
          'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
          'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
          'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат'
        ]
      },
      {
        name: 'Хлебобулочные изделия',
        order: 7,
        icon: 'wheat',
        keywords: [
          'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
          'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс'
        ]
      },
      {
        name: 'Мясные продукты',
        order: 8,
        icon: 'beef',
        keywords: [
          'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
          'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет'
        ]
      },
      {
        name: 'Импульсивные покупки',
        order: 9,
        icon: 'candy',
        keywords: [
          'конфеты', 'шоколад', 'жвачка', 'леденцы', 'батончики', 'журналы',
          'зарядка', 'батарейки', 'мелочи'
        ]
      }
    ]
  }
};

// Функция для определения категории товара
export function categorizeItem(itemName: string, storeType: string): { category: string; categoryOrder: number } {
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType as keyof typeof STORE_CONFIGS]; 
  
  if (!storeConfig) {
    return {
      category: `Разное (Нет данных для магазина '${storeType}')`, // Используем оригинальный storeType для сообщения
      categoryOrder: 999
    };
  }
  // At this point, storeConfig is valid and has .categories

  const normalizedItem = itemName.toLowerCase().trim();
  
  for (const category of storeConfig.categories) {
    // It's good practice to also check if category.keywords is an array, though type system should ensure this.
    if (category && Array.isArray(category.keywords)) { 
      for (const keyword of category.keywords) {
        if (normalizedItem.includes(keyword.toLowerCase())) {
          return {
            category: category.name,
            categoryOrder: category.order
          };
        }
      }
    }
  }
  
  // Если категория не найдена, помещаем в "Разное"
  return {
    category: 'Разное',
    categoryOrder: 999
  };
}

// Функция для обработки списка покупок
export function processShoppingList(rawText: string, storeType: string): ShoppingItem[] {
  // Normalize different separators to newline
  // 1. Replace commas (with optional surrounding spaces) with newlines
  let processedText = rawText.replace(/\s*,\s*/g, '\n');
  
  const initialLines = processedText
    .split(/[\n]+/)
    .map(line => line.trim())
    .filter(line => line !== '');

  // DO NOT further split lines that might contain multiple space-separated items
  // Each line should be treated as a single item since AI handles the parsing
  const finalItems: string[] = [];
  initialLines.forEach(line => {
    // No longer splitting by spaces - each line is a single shopping item
    // This allows multi-word items to remain intact, e.g. "ice cream" or "red peppers"
    // AI will handle splitting of lines like "Носки сосиски ser zloty" into separate products
    if (line.trim() !== '') {
      finalItems.push(line.trim());
    }
  });
  
  const categorizedItems = finalItems.map((item, index) => {
    const { category, categoryOrder } = categorizeItem(item, storeType); // categorizeItem теперь сам обработает storeType
    
    // Detect language based on character set
    const hasCyrillic = /[\u0400-\u04FF]/.test(item);
    const hasLatin = /[a-zA-Z]/.test(item);
    
    let language = 'en'; // Default to English
    if (hasCyrillic && !hasLatin) {
      language = 'ru';
    } else if (hasCyrillic && hasLatin) {
      // Mixed text, determine by predominant characters
      const cyrillicCount = (item.match(/[\u0400-\u04FF]/g) || []).length;
      const latinCount = (item.match(/[a-zA-Z]/g) || []).length;
      language = cyrillicCount > latinCount ? 'ru' : 'en';
    }
    
    return {
      id: `item-${index}`,
      name: item,
      category,
      categoryOrder,
      purchased: false,
      originalText: item,
      language
    };
  });
  
  return categorizedItems;
}

// Функция для группировки товаров по категориям
export function groupItemsByCategory(items: ShoppingItem[]): { [category: string]: ShoppingItem[] } {
  return items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as { [category: string]: ShoppingItem[] });
}

// Функция для получения порядка категорий для конкретного магазина
export function getCategoryOrder(storeType: string): { [category: string]: number } {
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType as keyof typeof STORE_CONFIGS];
  const order: { [category: string]: number } = {};
  
  if (!storeConfig) { // Add check for undefined storeConfig
    // Return empty order or a default if store config not found
    return order; 
  }
  
  storeConfig.categories.forEach(category => {
    order[category.name] = category.order;
  });
  
  return order;
}

// Функция для получения иконки категории
export function getCategoryIcon(categoryName: string, storeType: string): string {
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType as keyof typeof STORE_CONFIGS];
  
  if (!storeConfig) { // Add check for undefined storeConfig
    return 'package'; // Return default icon if store config not found
  }
  
  const category = storeConfig.categories.find(cat => cat.name === categoryName);
  return category?.icon || 'package';
}
