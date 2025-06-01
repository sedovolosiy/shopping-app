import { StoreConfigs, CategoryDefinition, ShoppingItem } from './types';

// Конфигурации магазинов с категориями и ключевыми словами
// ВАЖНО: Эта структура используется только для отображения категорий и 
// как резервная система категоризации, если API Gemini недоступен.
// Основная категоризация товаров должна выполняться через API Gemini.
export const STORE_CONFIGS: StoreConfigs = {
  lidl: {
    name: 'lidl',
    displayName: 'Lidl',
    categories: [
      {
        name: 'Fresh Produce',
        order: 1,
        icon: 'apple',
        keywords: [
          'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
          'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
          'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат'
        ]
      },
      {
        name: 'Bakery',
        order: 2,
        icon: 'wheat',
        keywords: [
          'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
          'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс'
        ]
      },
      {
        name: 'Dairy & Eggs',
        order: 3,
        icon: 'milk',
        keywords: [
          'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
          'масло', 'маргарин', 'яйца', 'сливки', 'простокваша'
        ]
      },
      {
        name: 'Meat & Poultry',
        order: 4,
        icon: 'beef',
        keywords: [
          'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
          'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет'
        ]
      },
      {
        name: 'Frozen Foods',
        order: 5,
        icon: 'snowflake',
        keywords: [
          'замороженные', 'мороженое', 'пельмени', 'вареники', 'блины',
          'замороженные овощи', 'замороженные фрукты', 'рыбные палочки'
        ]
      },
      {
        name: 'Pantry Staples',
        order: 6,
        icon: 'package',
        keywords: [
          'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
          'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
          'уксус', 'соусы', 'кетчуп', 'майонез', 'снеки', 'чипсы', 'орехи'
        ]
      },
      {
        name: 'Beverages',
        order: 7,
        icon: 'coffee',
        keywords: [
          'вода', 'сок', 'газировка', 'кола', 'пиво', 'вино', 'чай', 'кофе',
          'энергетики', 'лимонад', 'квас', 'компот'
        ]
      },
      {
        name: 'Household Supplies',
        order: 8,
        icon: 'spray-can',
        keywords: [
          'мыло', 'шампунь', 'гель', 'порошок', 'кондиционер', 'моющее средство',
          'туалетная бумага', 'салфетки', 'полотенца', 'губки', 'перчатки',
          'освежитель', 'дезодорант', 'зубная паста', 'щетка'
        ]
      },
      {
        name: 'Snacks',
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
        name: 'Fresh Produce',
        order: 1,
        icon: 'apple',
        keywords: [
          'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
          'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
          'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат', 'органические'
        ]
      },
      {
        name: 'Meat & Poultry',
        order: 2,
        icon: 'beef',
        keywords: [
          'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
          'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет'
        ]
      },
      {
        name: 'Dairy & Eggs',
        order: 3,
        icon: 'milk',
        keywords: [
          'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
          'масло', 'маргарин', 'яйца', 'сливки', 'простокваша'
        ]
      },
      {
        name: 'Bakery',
        order: 4,
        icon: 'wheat',
        keywords: [
          'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
          'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс', 'кондитерские'
        ]
      },
      {
        name: 'Pantry Staples',
        order: 5,
        icon: 'package',
        keywords: [
          'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
          'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
          'уксус', 'соусы', 'кетчуп', 'майонез', 'снеки', 'чипсы', 'орехи', 'закуски'
        ]
      },
      {
        name: 'Beverages',
        order: 6,
        icon: 'coffee',
        keywords: [
          'вода', 'сок', 'газировка', 'кола', 'пиво', 'вино', 'чай', 'кофе',
          'энергетики', 'лимонад', 'квас', 'компот'
        ]
      },
      {
        name: 'Household Supplies',
        order: 7,
        icon: 'spray-can',
        keywords: [
          'мыло', 'шампунь', 'гель', 'порошок', 'кондиционер', 'моющее средство',
          'туалетная бумага', 'салфетки', 'полотенца', 'губки', 'перчатки',
          'освежитель', 'дезодорант', 'зубная паста', 'щетка', 'гигиена'
        ]
      },
      {
        name: 'Other',
        order: 8,
        icon: 'gift',
        keywords: [
          'игрушки', 'техника', 'украшения', 'сезонные', 'детские товары',
          'мелкая техника', 'аксессуары'
        ]
      },
      {
        name: 'Snacks',
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
        name: 'Pantry Staples',
        order: 1,
        icon: 'package',
        keywords: [
          'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
          'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
          'уксус', 'соусы', 'кетчуп', 'майонез', 'упакованные'
        ]
      },
      {
        name: 'Dairy & Eggs',
        order: 2,
        icon: 'milk',
        keywords: [
          'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
          'масло', 'маргарин', 'яйца', 'сливки', 'простокваша', 'охлажденные'
        ]
      },
      {
        name: 'Frozen Foods',
        order: 3,
        icon: 'snowflake',
        keywords: [
          'замороженные', 'мороженое', 'пельмени', 'вареники', 'блины',
          'замороженные овощи', 'замороженные фрукты', 'рыбные палочки',
          'замороженное мясо'
        ]
      },
      {
        name: 'Snacks',
        order: 4,
        icon: 'coffee',
        keywords: [
          'снеки', 'чипсы', 'орехи', 'закуски', 'вода', 'сок', 'газировка', 'кола',
          'пиво', 'вино', 'чай', 'кофе', 'энергетики', 'лимонад', 'квас', 'компот'
        ]
      },
      {
        name: 'Other',
        order: 5,
        icon: 'gift',
        keywords: [
          'сезонные', 'промо', 'finds', 'еженедельные', 'специальные',
          'непродовольственные', 'техника', 'одежда', 'аксессуары'
        ]
      },
      {
        name: 'Fresh Produce',
        order: 6,
        icon: 'apple',
        keywords: [
          'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
          'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
          'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат'
        ]
      },
      {
        name: 'Bakery',
        order: 7,
        icon: 'wheat',
        keywords: [
          'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
          'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс'
        ]
      },
      {
        name: 'Meat & Poultry',
        order: 8,
        icon: 'beef',
        keywords: [
          'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
          'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет'
        ]
      },
      {
        name: 'Snacks',
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

/**
 * Расширенные паттерны для категорий товаров с поддержкой весов, паттернов и алиасов
 */
export type CategoryPattern = {
  keywords: string[];
  patterns: RegExp[];
  weight: number;
  aliases: {
    [language: string]: string[];
  };
};

/**
 * Система паттернов для fallback категоризации
 */
export const CATEGORY_PATTERNS: { [category: string]: CategoryPattern } = {
  'Fresh Produce': {
    keywords: [
      'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
      'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
      'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат'
    ],
    patterns: [
      /\b(овощ|фрукт|зелен)\w*\b/i,
      /\b(свеж|органическ)\w*\s+(овощ|фрукт)/i,
      /\b(картош|помидор|огурц|морков|капуст|лук|чеснок)\w*\b/i
    ],
    weight: 1.5,
    aliases: {
      ru: ['свежие продукты', 'овощи и фрукты'],
      en: ['fresh produce', 'fruits and vegetables'],
      pl: ['świeże produkty', 'owoce i warzywa']
    }
  },
  'Dairy & Eggs': {
    keywords: [
      'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
      'масло', 'маргарин', 'яйца', 'сливки', 'простокваша'
    ],
    patterns: [
      /\b(молоч|молок)\w*\b/i,
      /\b(сыр|творог|сметан|кефир|ряженк)\w*\b/i,
      /\b(яйц|яичн)\w*\b/i
    ],
    weight: 1.3,
    aliases: {
      ru: ['молочные продукты', 'яйца'],
      en: ['dairy', 'eggs'],
      pl: ['nabiał', 'jajka']
    }
  },
  'Meat & Poultry': {
    keywords: [
      'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
      'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет'
    ],
    patterns: [
      /\b(мяс|мясн)\w*\b/i,
      /\b(курин|курица|цыпл)\w*\b/i,
      /\b(говядин|свинин|телятин)\w*\b/i
    ],
    weight: 1.2,
    aliases: {
      ru: ['мясные продукты', 'птица'],
      en: ['meat', 'poultry'],
      pl: ['mięso', 'drób']
    }
  },
  'Bakery': {
    keywords: [
      'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
      'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс'
    ],
    patterns: [
      /\b(хлеб|батон|булк|булочк)\w*\b/i,
      /\b(выпечк|пирожк|кекс|торт)\w*\b/i
    ],
    weight: 1.1,
    aliases: {
      ru: ['выпечка', 'булочные изделия'],
      en: ['bakery', 'bread'],
      pl: ['pieczywo', 'wypieki']
    }
  },
  'Beverages': {
    keywords: [
      'вода', 'сок', 'газировка', 'кола', 'пиво', 'вино', 'чай', 'кофе',
      'энергетики', 'лимонад', 'квас', 'компот'
    ],
    patterns: [
      /\b(вод|минерал)\w*\b/i,
      /\b(сок|напиток|лимонад)\w*\b/i,
      /\b(чай|кофе|какао)\w*\b/i
    ],
    weight: 1.0,
    aliases: {
      ru: ['напитки'],
      en: ['beverages', 'drinks'],
      pl: ['napoje']
    }
  },
  'Pantry Staples': {
    keywords: [
      'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
      'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
      'уксус', 'соусы', 'кетчуп', 'майонез'
    ],
    patterns: [
      /\b(круп|рис|гречк|овсянк|пшен)\w*\b/i,
      /\b(макарон|спагетт|лапш)\w*\b/i,
      /\b(масло)\s+(растительн|подсолнечн|оливков)/i
    ],
    weight: 1.0,
    aliases: {
      ru: ['бакалея', 'основные продукты'],
      en: ['pantry', 'staples'],
      pl: ['produkty sypkie', 'podstawowe produkty']
    }
  },
  'Household Supplies': {
    keywords: [
      'мыло', 'шампунь', 'гель', 'порошок', 'кондиционер', 'моющее средство',
      'туалетная бумага', 'салфетки', 'полотенца', 'губки', 'перчатки',
      'освежитель', 'дезодорант', 'зубная паста', 'щетка'
    ],
    patterns: [
      /\b(мыл|шампун|гель|крем)\w*\b/i,
      /\b(порошок|моющ|чист)\w*\s+(средств)/i
    ],
    weight: 0.9,
    aliases: {
      ru: ['бытовая химия', 'гигиена'],
      en: ['household', 'cleaning'],
      pl: ['chemia gospodarcza', 'higiena']
    }
  },
  'Frozen Foods': {
    keywords: [
      'замороженные', 'мороженое', 'пельмени', 'вареники', 'блины',
      'замороженные овощи', 'замороженные фрукты', 'рыбные палочки'
    ],
    patterns: [
      /\b(заморож|морож)\w*\b/i,
      /\b(пельмен|вареник|блин)\w*\b/i
    ],
    weight: 0.8,
    aliases: {
      ru: ['заморозка'],
      en: ['frozen foods'],
      pl: ['mrożonki']
    }
  },
  'Snacks': {
    keywords: [
      'конфеты', 'шоколад', 'жвачка', 'леденцы', 'батончики', 'чипсы', 'орехи', 'снеки'
    ],
    patterns: [
      /\b(конфет|шоколад|сладост)\w*\b/i,
      /\b(чипс|снек|закуск)\w*\b/i
    ],
    weight: 0.7,
    aliases: {
      ru: ['сладости', 'перекус'],
      en: ['snacks', 'sweets'],
      pl: ['przekąski', 'słodycze']
    }
  }
};

/**
 * Система весов для типов совпадений
 */
export const CATEGORIZATION_WEIGHTS = {
  exactMatch: 2.0,
  patternMatch: 1.5,
  keywordMatch: 1.0,
  aliasMatch: 0.8,
  contextMatch: 0.6
};

/**
 * Кэш для результатов категоризации (LRU не реализован, только Map)
 */
const categorizationCache = new Map<string, { category: string; categoryOrder: number; confidence: number }>();

/**
 * JSDoc: Улучшенная категоризация товара по паттернам, весам и языкам
 * @param itemName - название товара
 * @param storeType - тип магазина
 * @param language - язык ('ru', 'en', 'pl')
 * @returns { category, categoryOrder, confidence }
 */
export function categorizeItemEnhanced(
  itemName: string,
  storeType: string,
  language: string = 'ru'
): { category: string; categoryOrder: number; confidence: number } {
  try {
    if (!itemName || typeof itemName !== 'string') {
      return { category: 'Не категоризировано', categoryOrder: 999, confidence: 0 };
    }
    const cacheKey = `${itemName.toLowerCase()}|${storeType}|${language}`;
    if (categorizationCache.has(cacheKey)) {
      return categorizationCache.get(cacheKey)!;
    }
    const normalizedItem = itemName.toLowerCase().trim();
    let bestScore = 0;
    let bestCategory = 'Не категоризировано';
    let bestOrder = 999;
    let maxPossibleScore = 0;
    // Получаем порядок категорий для магазина
    const orderMap = getCategoryOrder(storeType);
    for (const [category, patternObj] of Object.entries(CATEGORY_PATTERNS)) {
      let score = 0;
      // 1. Точное совпадение с ключевым словом
      for (const kw of patternObj.keywords) {
        if (normalizedItem === kw.toLowerCase()) {
          score += CATEGORIZATION_WEIGHTS.exactMatch;
        } else if (normalizedItem.includes(kw.toLowerCase())) {
          score += CATEGORIZATION_WEIGHTS.keywordMatch;
        }
      }
      // 2. Совпадение с паттернами
      for (const re of patternObj.patterns) {
        if (re.test(normalizedItem)) {
          score += CATEGORIZATION_WEIGHTS.patternMatch;
        }
      }
      // 3. Совпадение с алиасами
      if (patternObj.aliases[language]) {
        for (const alias of patternObj.aliases[language]) {
          if (normalizedItem.includes(alias.toLowerCase())) {
            score += CATEGORIZATION_WEIGHTS.aliasMatch;
          }
        }
      }
      // 4. Умножаем на вес категории
      score *= patternObj.weight;
      // 5. Сохраняем максимальный возможный score для нормализации
      const possible =
        (CATEGORIZATION_WEIGHTS.exactMatch +
          CATEGORIZATION_WEIGHTS.patternMatch +
          CATEGORIZATION_WEIGHTS.keywordMatch +
          CATEGORIZATION_WEIGHTS.aliasMatch) *
        patternObj.weight;
      if (possible > maxPossibleScore) maxPossibleScore = possible;
      // 6. Сохраняем лучший результат
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
        bestOrder = orderMap[category] ?? 999;
      }
    }
    // Вычисляем confidence
    const confidence = maxPossibleScore > 0 ? Math.min(bestScore / maxPossibleScore, 1) : 0;
    const result = { category: bestCategory, categoryOrder: bestOrder, confidence };
    categorizationCache.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error('categorizeItemEnhanced error:', e);
    return { category: 'Не категоризировано', categoryOrder: 999, confidence: 0 };
  }
}

/**
 * JSDoc: Контекстная категоризация списка товаров
 * @param items - массив товаров
 * @param storeType - тип магазина
 * @param language - язык
 * @returns массив объектов с категорией и confidence
 */
export function categorizeWithContext(
  items: string[],
  storeType: string,
  language: string = 'ru'
): Array<{ item: string; category: string; categoryOrder: number; confidence: number }> {
  try {
    const baseResults = items.map(item => ({
      item,
      ...categorizeItemEnhanced(item, storeType, language)
    }));
    // Подсчет количества по категориям
    const categoryCounts: { [cat: string]: number } = {};
    baseResults.forEach(r => {
      if (!categoryCounts[r.category]) categoryCounts[r.category] = 0;
      categoryCounts[r.category]++;
    });
    // Добавляем contextBonus
    return baseResults.map(r => {
      const contextBonus = Math.min((categoryCounts[r.category] - 1) * 0.1, 0.3);
      return {
        ...r,
        confidence: Math.min(r.confidence + contextBonus, 1)
      };
    });
  } catch (e) {
    console.error('categorizeWithContext error:', e);
    return items.map(item => ({ item, category: 'Не категоризировано', categoryOrder: 999, confidence: 0 }));
  }
}

/**
 * JSDoc: Обучение системы на исправлении пользователя
 * @param itemName - название товара
 * @param correctCategory - правильная категория
 * @param storeType - тип магазина
 * @param language - язык
 */
export function learnFromUserCorrection(
  itemName: string,
  correctCategory: string,
  storeType: string,
  language: string = 'ru'
): void {
  try {
    if (!CATEGORY_PATTERNS[correctCategory]) return;
    // Извлекаем значимые слова (длина > 2)
    const words = itemName
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 2 && !CATEGORY_PATTERNS[correctCategory].keywords.includes(w));
    CATEGORY_PATTERNS[correctCategory].keywords.push(...words);
    // Логируем для возможного сохранения в БД
    console.log(`[learn] Added keywords to ${correctCategory}:`, words);
  } catch (e) {
    console.error('learnFromUserCorrection error:', e);
  }
}

/**
 * JSDoc: Добавить паттерн категории
 * @param category - категория
 * @param keywords - ключевые слова
 * @param patterns - паттерны
 * @param weight - вес
 * @param aliases - алиасы
 */
export function addCategoryPattern(
  category: string,
  keywords: string[],
  patterns: RegExp[],
  weight: number = 1.0,
  aliases: { [language: string]: string[] } = {}
): void {
  CATEGORY_PATTERNS[category] = {
    keywords,
    patterns,
    weight,
    aliases
  };
}

/**
 * Функция для определения категории товара
 * ВНИМАНИЕ: Эта функция должна использоваться только как fallback
 * Категоризацию товаров должен выполнять AI через API Gemini
 * Данная функция сохранена для обратной совместимости и аварийных ситуаций
 */
export function categorizeItem(itemName: string, storeType: string): { category: string; categoryOrder: number } {
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType as keyof typeof STORE_CONFIGS]; 
  
  if (!storeConfig) {
    return {
      category: `Не категоризировано`, // Более нейтральное сообщение
      categoryOrder: 999
    };
  }
  // At this point, storeConfig is valid and has .categories

  const normalizedItem = itemName.toLowerCase().trim();
  
  // Для предварительного отображения можем использовать простое совпадение по ключевым словам,
  // но окончательная категоризация должна выполняться через AI
  for (const category of storeConfig.categories) {
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
  
  // Если категория не найдена
  return {
    category: 'Не категоризировано',
    categoryOrder: 999
  };
}

// Функция для обработки списка покупок
// Это только резервный метод, предназначенный для использования, когда API Gemini недоступен
// Категоризация должна происходить через AI, а не локально
/**
 * JSDoc: Обработка списка покупок с использованием улучшенной категоризации
 * @param rawText - исходный текст
 * @param storeType - тип магазина
 * @returns массив ShoppingItem
 */
export function processShoppingList(rawText: string, storeType: string): ShoppingItem[] {
  // Normalize different separators to newline
  // 1. Replace commas (with optional surrounding spaces) with newlines
  let processedText = rawText.replace(/\s*,\s*/g, '\n');
  const initialLines = processedText
    .split(/[\n]+/)
    .map(line => line.trim())
    .filter(line => line !== '');
  const finalItems: string[] = [];
  initialLines.forEach(line => {
    if (line.trim() !== '') {
      finalItems.push(line.trim());
    }
  });
  // Определяем язык для каждого товара
  const categorizedItems = finalItems.map((item, index) => {
    const hasCyrillic = /[\u0400-\u04FF]/.test(item);
    const hasLatin = /[a-zA-Z]/.test(item);
    let language = 'en';
    if (hasCyrillic && !hasLatin) {
      language = 'ru';
    } else if (hasCyrillic && hasLatin) {
      const cyrillicCount = (item.match(/[\u0400-\u04FF]/g) || []).length;
      const latinCount = (item.match(/[a-zA-Z]/g) || []).length;
      language = cyrillicCount > latinCount ? 'ru' : 'en';
    }
    // Используем новую систему категоризации
    const { category, categoryOrder, confidence } = categorizeItemEnhanced(item, storeType, language);
    return {
      id: `item-${index}`,
      name: item.replace(/"/g, '\\"'),
      category,
      categoryOrder,
      purchased: false,
      originalText: item,
      language,
      confidence
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

// Для категоризации используйте store.name (например, 'lidl', 'aldi', 'biedronka') как второй аргумент

/**
 * Экспорт/импорт пользовательских паттернов (заглушки)
 */
export function exportCategoryPatterns(): string {
  try {
    return JSON.stringify(CATEGORY_PATTERNS, (key, value) => {
      if (value instanceof RegExp) return value.toString();
      return value;
    }, 2);
  } catch (e) {
    console.error('exportCategoryPatterns error:', e);
    return '';
  }
}

export function importCategoryPatterns(json: string): void {
  try {
    const obj = JSON.parse(json);
    for (const [cat, patRaw] of Object.entries(obj)) {
      if (typeof patRaw === 'object' && patRaw !== null) {
        const pat = patRaw as any;
        CATEGORY_PATTERNS[cat] = {
          keywords: Array.isArray(pat.keywords) ? pat.keywords : [],
          patterns: Array.isArray(pat.patterns)
            ? pat.patterns.map((p: string) => {
                if (typeof p === 'string' && p.startsWith('/')) {
                  const match = p.match(/^\/(.*)\/(\w*)$/);
                  if (match) return new RegExp(match[1], match[2]);
                }
                return p;
              })
            : [],
          weight: typeof pat.weight === 'number' ? pat.weight : 1.0,
          aliases: typeof pat.aliases === 'object' && pat.aliases !== null ? pat.aliases : {}
        };
      }
    }
  } catch (e) {
    console.error('importCategoryPatterns error:', e);
  }
}

/**
 * Метрика точности категоризации (заглушка)
 */
export function getCategorizationMetrics() {
  // Можно реализовать хранение статистики попаданий/ошибок
  return {
    total: categorizationCache.size,
    // Можно добавить больше метрик
  };
}
