
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
export function categorizeItem(itemName: string, storeType: StoreType): { category: string; categoryOrder: number } {
  const storeConfig = STORE_CONFIGS[storeType];
  const normalizedItem = itemName.toLowerCase().trim();
  
  for (const category of storeConfig.categories) {
    for (const keyword of category.keywords) {
      if (normalizedItem.includes(keyword.toLowerCase())) {
        return {
          category: category.name,
          categoryOrder: category.order
        };
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
export function processShoppingList(rawText: string, storeType: StoreType): ShoppingItem[] {
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  return lines.map((line, index) => {
    const { category, categoryOrder } = categorizeItem(line, storeType);
    
    return {
      id: `item-${index}`,
      name: line,
      category,
      categoryOrder,
      purchased: false,
      originalText: line
    };
  });
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
export function getCategoryOrder(storeType: StoreType): { [category: string]: number } {
  const storeConfig = STORE_CONFIGS[storeType];
  const order: { [category: string]: number } = {};
  
  storeConfig.categories.forEach(category => {
    order[category.name] = category.order;
  });
  
  return order;
}

// Функция для получения иконки категории
export function getCategoryIcon(categoryName: string, storeType: StoreType): string {
  const storeConfig = STORE_CONFIGS[storeType];
  const category = storeConfig.categories.find(cat => cat.name === categoryName);
  return category?.icon || 'package';
}
