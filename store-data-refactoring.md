# ПОЛНАЯ ИНСТРУКЦИЯ ДЛЯ AI AGENT: УЛУЧШЕНИЕ СИСТЕМЫ КАТЕГОРИЗАЦИИ ТОВАРОВ В NEXT.JS 15+

## **ЦЕЛЬ ПРОЕКТА**
Создать гибкую, расширяемую систему fallback-категоризации товаров для замены базовой функции `categorizeItem` в файле `/lib/store-data.ts`, сохранив полную совместимость с существующим кодом и добавив новые возможности.

---

## **ЭТАП 1: ПОДГОТОВКА ПРОЕКТА**

### **1.1 Установка зависимостей**

```bash
npm install lodash fast-levenshtein natural stopword franc lru-cache
npm install -D @types/lodash @types/fast-levenshtein @types/natural @types/lru-cache
```

**Назначение пакетов:**
- `lodash` — утилиты для работы с массивами/объектами
- `fast-levenshtein` — расстояние Левенштейна для обработки опечаток
- `natural` — NLP библиотека (стемминг, токенизация)
- `stopword` — удаление стоп-слов
- `franc` — автоматическое определение языка текста
- `lru-cache` — кэширование результатов категоризации

### **1.2 Создание структуры каталогов**

Создай следующую структуру в `/lib/categorization/`:

```
/lib/categorization/
├── index.ts                    # Главный экспорт и публичный API
├── core/
│   ├── categoryMatcher.ts      # Основная логика сопоставления
│   ├── languageDetector.ts     # Определение языка товара
│   ├── textNormalizer.ts       # Нормализация и очистка текста
│   └── fuzzyMatcher.ts         # Fuzzy matching для опечаток
├── patterns/
│   ├── basePatterns.ts         # Базовые паттерны категорий
│   ├── storePatterns.ts        # Специфичные для магазинов паттерны
│   └── userPatterns.ts         # Пользовательские паттерны (для будущего)
├── utils/
│   ├── cache.ts                # LRU кэш для результатов
│   ├── metrics.ts              # Метрики точности и статистика
│   ├── learning.ts             # Система обучения на исправлениях
│   └── categoryOrder.ts        # Утилиты для работы с STORE_CONFIGS
├── tests/
│   ├── testData.ts             # Тестовые наборы данных
│   └── categorizer.test.ts     # Unit тесты
├── types.ts                    # TypeScript типы и интерфейсы
└── storeConfigs.ts             # Перенесенные STORE_CONFIGS
```

---

## **ЭТАП 2: СОЗДАНИЕ БАЗОВЫХ ТИПОВ**

### **2.1 Создай файл типов**

**/lib/categorization/types.ts**

```typescript
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
```

---

## **ЭТАП 3: ПЕРЕНОС И РАСШИРЕНИЕ STORE_CONFIGS**

### **3.1 Создай файл конфигураций магазинов**

**/lib/categorization/storeConfigs.ts**

```typescript
import { StoreConfigs } from './types';

// Скопируй весь STORE_CONFIGS из оригинального файла /lib/store-data.ts
// и добавь его сюда без изменений для обратной совместимости
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
      // ... остальные категории из оригинального файла
    ]
  },
  // ... остальные магазины
};
```

---

## **ЭТАП 4: СОЗДАНИЕ БАЗОВЫХ КОМПОНЕНТОВ**

### **4.1 Детектор языка**

**/lib/categorization/core/languageDetector.ts**

```typescript
import { franc, francAll } from 'franc';
import { LanguageDetectionResult } from '../types';

export class LanguageDetector {
  private cache = new Map<string, LanguageDetectionResult>();

  detect(text: string): LanguageDetectionResult {
    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }

    try {
      const primary = franc(text, { minLength: 3 });
      const all = francAll(text, { minLength: 3 });
      
      const languages: { [lang: string]: number } = {};
      all.forEach(item => {
        languages[item[0]] = item[1];
      });

      const result: LanguageDetectionResult = {
        primary: primary === 'und' ? 'ru' : primary, // Default to Russian if undetermined
        confidence: all.length > 0 ? all[0][1] : 0,
        mixed: all.length > 1,
        languages,
      };

      this.cache.set(text, result);
      return result;
    } catch (error) {
      console.warn('Language detection failed:', error);
      return {
        primary: 'ru',
        confidence: 0,
        mixed: false,
        languages: {},
      };
    }
  }

  // Определение языка на основе символов (fallback)
  detectByCharacters(text: string): string {
    const hasCyrillic = /[\u0400-\u04FF]/.test(text);
    const hasLatin = /[a-zA-Z]/.test(text);
    
    if (hasCyrillic && !hasLatin) return 'ru';
    if (hasCyrillic && hasLatin) {
      const cyrillicCount = (text.match(/[\u0400-\u04FF]/g) || []).length;
      const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
      return cyrillicCount > latinCount ? 'ru' : 'en';
    }
    return 'en';
  }
}
```

### **4.2 Нормализатор текста**

**/lib/categorization/core/textNormalizer.ts**

```typescript
import { removeStopwords, eng, rus } from 'stopword';

export class TextNormalizer {
  private cache = new Map<string, string>();

  normalize(text: string, language: string): string {
    const cacheKey = `${text}|${language}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let normalized = text.toLowerCase().trim();
    
    // Удаление специальных символов, но сохранение пробелов
    normalized = normalized.replace(/[^\w\s]/g, ' ');
    
    // Удаление множественных пробелов
    normalized = normalized.replace(/\s+/g, ' ');
    
    // Удаление стоп-слов
    const stopwords = language === 'ru' ? rus : eng;
    const words = normalized.split(' ').filter(word => word.length > 1);
    normalized = removeStopwords(words, stopwords).join(' ');

    this.cache.set(cacheKey, normalized);
    return normalized;
  }

  extractKeywords(text: string): string[] {
    return text.split(' ')
      .filter(word => word.length > 2)
      .map(word => word.toLowerCase());
  }

  extractUnits(text: string): string[] {
    const unitPatterns = [
      /(\d+(?:\.\d+)?)\s*(кг|kg|г|g|л|l|мл|ml|шт|pcs|штук|пачк|бан|бутыл)/gi
    ];
    
    const units: string[] = [];
    unitPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        units.push(...matches);
      }
    });
    
    return units;
  }

  extractBrands(text: string, knownBrands: string[]): string[] {
    const foundBrands: string[] = [];
    const lowerText = text.toLowerCase();
    
    knownBrands.forEach(brand => {
      if (lowerText.includes(brand.toLowerCase())) {
        foundBrands.push(brand);
      }
    });
    
    return foundBrands;
  }
}
```

### **4.3 Fuzzy matcher**

**/lib/categorization/core/fuzzyMatcher.ts**

```typescript
import levenshtein from 'fast-levenshtein';

export interface SimilarityMatch {
  term: string;
  distance: number;
  similarity: number;
}

export class FuzzyMatcher {
  findSimilar(
    text: string, 
    candidates: string[], 
    maxDistance: number = 2
  ): SimilarityMatch[] {
    const matches: SimilarityMatch[] = [];
    
    candidates.forEach(candidate => {
      const distance = levenshtein.get(text.toLowerCase(), candidate.toLowerCase());
      if (distance <= maxDistance) {
        const similarity = 1 - (distance / Math.max(text.length, candidate.length));
        matches.push({
          term: candidate,
          distance,
          similarity
        });
      }
    });
    
    return matches.sort((a, b) => a.distance - b.distance);
  }

  findBestMatch(
    text: string, 
    candidates: string[], 
    threshold: number = 0.7
  ): string | null {
    const matches = this.findSimilar(text, candidates, 3);
    const bestMatch = matches.find(match => match.similarity >= threshold);
    return bestMatch ? bestMatch.term : null;
  }

  // Проверка на опечатки в ключевых словах
  correctTypos(text: string, dictionary: string[]): string {
    const words = text.split(' ');
    const correctedWords = words.map(word => {
      if (word.length < 3) return word;
      const correction = this.findBestMatch(word, dictionary, 0.8);
      return correction || word;
    });
    
    return correctedWords.join(' ');
  }
}
```

---

## **ЭТАП 5: СОЗДАНИЕ СИСТЕМЫ ПАТТЕРНОВ**

### **5.1 Базовые паттерны**

**/lib/categorization/patterns/basePatterns.ts**

```typescript
import { AdvancedCategoryPattern } from '../types';

export const BASE_CATEGORY_PATTERNS: { [category: string]: AdvancedCategoryPattern } = {
  'Fresh Produce': {
    keywords: [
      'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
      'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
      'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат', 'баклажан', 'перец'
    ],
    patterns: [
      /\b(овощ|фрукт|зелен)\w*\b/i,
      /\b(свеж|органическ)\w*\s+(овощ|фрукт)/i,
      /\b(картош|помидор|огурц|морков|капуст|лук|чеснок)\w*\b/i,
      /\b(яблок|банан|апельсин|лимон|груш|виноград)\w*\b/i
    ],
    synonyms: {
      ru: ['свежие продукты', 'овощи и фрукты', 'растительные продукты'],
      en: ['fresh produce', 'fruits and vegetables', 'fresh fruits'],
      pl: ['świeże produkty', 'owoce i warzywa']
    },
    brands: ['Био', 'Organic', 'Эко'],
    units: ['кг', 'г', 'шт', 'пучок'],
    modifiers: ['свежий', 'органический', 'био', 'молодой', 'спелый'],
    contextRules: [
      {
        type: 'co-occurrence',
        items: ['салат', 'зелень'],
        boost: 0.2
      }
    ],
    exclusions: ['сок', 'консервированный'],
    weight: 1.5,
    priority: 1,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Dairy & Eggs': {
    keywords: [
      'молоко', 'сыр', 'йогурт', 'кефир', 'ряженка', 'сметана', 'творог',
      'масло', 'маргарин', 'яйца', 'сливки', 'простокваша'
    ],
    patterns: [
      /\b(молоч|молок)\w*\b/i,
      /\b(сыр|творог|сметан|кефир|ряженк)\w*\b/i,
      /\b(яйц|яичн)\w*\b/i,
      /\b(масло)\s+(сливочн|растительн)/i
    ],
    synonyms: {
      ru: ['молочные продукты', 'молочка', 'яйца'],
      en: ['dairy', 'milk products', 'eggs'],
      pl: ['nabiał', 'produkty mleczne', 'jajka']
    },
    brands: ['Простоквашино', 'Домик в деревне', 'Веселый молочник'],
    units: ['л', 'мл', 'г', 'кг', 'шт', 'упаковка'],
    modifiers: ['обезжиренный', 'цельный', 'домашний', 'фермерский'],
    contextRules: [],
    exclusions: ['соевое молоко', 'кокосовое молоко'],
    weight: 1.3,
    priority: 2,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Meat & Poultry': {
    keywords: [
      'мясо', 'курица', 'говядина', 'свинина', 'колбаса', 'сосиски', 'ветчина',
      'бекон', 'фарш', 'котлеты', 'деликатесы', 'паштет', 'индейка', 'утка'
    ],
    patterns: [
      /\b(мяс|мясн)\w*\b/i,
      /\b(курин|курица|цыпл)\w*\b/i,
      /\b(говядин|свинин|телятин)\w*\b/i,
      /\b(колбас|сосиск|ветчин)\w*\b/i
    ],
    synonyms: {
      ru: ['мясные продукты', 'птица', 'мясо'],
      en: ['meat', 'poultry', 'beef', 'pork'],
      pl: ['mięso', 'drób', 'wołowina']
    },
    brands: ['Мираторг', 'Черкизово', 'Останкино'],
    units: ['кг', 'г', 'шт', 'упаковка'],
    modifiers: ['свежий', 'охлажденный', 'замороженный', 'копченый'],
    contextRules: [],
    exclusions: ['соевое мясо', 'растительное мясо'],
    weight: 1.2,
    priority: 3,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Bakery': {
    keywords: [
      'хлеб', 'батон', 'булочки', 'выпечка', 'пончики', 'круассаны', 'багет',
      'лаваш', 'тортилья', 'печенье', 'пирожки', 'кекс', 'торт', 'пирог'
    ],
    patterns: [
      /\b(хлеб|батон|булк|булочк)\w*\b/i,
      /\b(выпечк|пирожк|кекс|торт)\w*\b/i,
      /\b(печень|пряник|вафл)\w*\b/i
    ],
    synonyms: {
      ru: ['выпечка', 'хлебобулочные изделия', 'сдоба'],
      en: ['bakery', 'bread', 'pastry'],
      pl: ['pieczywo', 'wypieki', 'chleb']
    },
    brands: ['Хлебный дом', 'Каравай'],
    units: ['шт', 'упаковка', 'кг'],
    modifiers: ['свежий', 'черствый', 'ржаной', 'белый'],
    contextRules: [],
    exclusions: [],
    weight: 1.1,
    priority: 4,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Beverages': {
    keywords: [
      'вода', 'сок', 'газировка', 'кола', 'пиво', 'вино', 'чай', 'кофе',
      'энергетики', 'лимонад', 'квас', 'компот', 'морс'
    ],
    patterns: [
      /\b(вод|минерал)\w*\b/i,
      /\b(сок|напиток|лимонад)\w*\b/i,
      /\b(чай|кофе|какао)\w*\b/i,
      /\b(пив|вин|алкогол)\w*\b/i
    ],
    synonyms: {
      ru: ['напитки', 'питье'],
      en: ['beverages', 'drinks', 'liquids'],
      pl: ['napoje', 'płyny']
    },
    brands: ['Coca-Cola', 'Pepsi', 'Добрый', 'Любимый'],
    units: ['л', 'мл', 'бутылка', 'банка'],
    modifiers: ['газированный', 'негазированный', 'холодный'],
    contextRules: [],
    exclusions: [],
    weight: 1.0,
    priority: 5,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Pantry Staples': {
    keywords: [
      'крупы', 'макароны', 'рис', 'гречка', 'овсянка', 'консервы', 'тушенка',
      'специи', 'приправы', 'соль', 'сахар', 'мука', 'масло растительное',
      'уксус', 'соусы', 'кетчуп', 'майонез', 'горчица'
    ],
    patterns: [
      /\b(круп|рис|гречк|овсянк|пшен)\w*\b/i,
      /\b(макарон|спагетт|лапш)\w*\b/i,
      /\b(масло)\s+(растительн|подсолнечн|оливков)/i,
      /\b(соус|кетчуп|майонез|горчиц)\w*\b/i
    ],
    synonyms: {
      ru: ['бакалея', 'основные продукты', 'сухие продукты'],
      en: ['pantry', 'staples', 'dry goods'],
      pl: ['produkty sypkie', 'podstawowe produkty']
    },
    brands: ['Мистраль', 'Увелка', 'Heinz'],
    units: ['кг', 'г', 'упаковка', 'банка'],
    modifiers: ['длиннозерный', 'круглозерный', 'цельнозерновой'],
    contextRules: [],
    exclusions: [],
    weight: 1.0,
    priority: 6,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Household Supplies': {
    keywords: [
      'мыло', 'шампунь', 'гель', 'порошок', 'кондиционер', 'моющее средство',
      'туалетная бумага', 'салфетки', 'полотенца', 'губки', 'перчатки',
      'освежитель', 'дезодорант', 'зубная паста', 'щетка'
    ],
    patterns: [
      /\b(мыл|шампун|гель|крем)\w*\b/i,
      /\b(порошок|моющ|чист)\w*\s+(средств)/i,
      /\b(бумаг|салфетк|полотенц)\w*\b/i
    ],
    synonyms: {
      ru: ['бытовая химия', 'гигиена', 'уборка'],
      en: ['household', 'cleaning', 'hygiene'],
      pl: ['chemia gospodarcza', 'higiena']
    },
    brands: ['Fairy', 'Ariel', 'Tide', 'Mr. Proper'],
    units: ['шт', 'упаковка', 'л', 'мл'],
    modifiers: ['антибактериальный', 'гипоаллергенный'],
    contextRules: [],
    exclusions: [],
    weight: 0.9,
    priority: 7,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Frozen Foods': {
    keywords: [
      'замороженные', 'мороженое', 'пельмени', 'вареники', 'блины',
      'замороженные овощи', 'замороженные фрукты', 'рыбные палочки'
    ],
    patterns: [
      /\b(заморож|морож)\w*\b/i,
      /\b(пельмен|вареник|блин)\w*\b/i,
      /\b(лед|ледян)\w*\b/i
    ],
    synonyms: {
      ru: ['заморозка', 'замороженные продукты'],
      en: ['frozen foods', 'frozen'],
      pl: ['mrożonki', 'produkty mrożone']
    },
    brands: ['Сам Самыч', '4 Сезона'],
    units: ['кг', 'г', 'упаковка'],
    modifiers: ['быстрозамороженный'],
    contextRules: [],
    exclusions: [],
    weight: 0.8,
    priority: 8,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },

  'Snacks': {
    keywords: [
      'конфеты', 'шоколад', 'жвачка', 'леденцы', 'батончики', 'чипсы', 'орехи', 'снеки'
    ],
    patterns: [
      /\b(конфет|шоколад|сладост)\w*\b/i,
      /\b(чипс|снек|закуск)\w*\b/i,
      /\b(орех|семечк)\w*\b/i
    ],
    synonyms: {
      ru: ['сладости', 'перекус', 'закуски'],
      en: ['snacks', 'sweets', 'candy'],
      pl: ['przekąski', 'słodycze']
    },
    brands: ['Lay\'s', 'Pringles', 'KitKat', 'Snickers'],
    units: ['г', 'упаковка', 'шт'],
    modifiers: ['соленый', 'сладкий', 'острый'],
    contextRules: [],
    exclusions: [],
    weight: 0.7,
    priority: 9,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  }
};

// Веса для типов совпадений
export const CATEGORIZATION_WEIGHTS = {
  exactMatch: 2.0,
  patternMatch: 1.5,
  keywordMatch: 1.0,
  aliasMatch: 0.8,
  contextMatch: 0.6,
  fuzzyMatch: 0.4,
  brandMatch: 0.3
};
```

### **5.2 Паттерны магазинов**

**/lib/categorization/patterns/storePatterns.ts**

```typescript
export const STORE_SPECIFIC_PATTERNS = {
  lidl: {
    'Fresh Produce': {
      localBrands: ['Vitasia', 'Freshona', 'Solevita'],
      seasonalItems: ['летние овощи', 'зимние фрукты', 'сезонные ягоды'],
      promotionalKeywords: ['био', 'органик', 'эко'],
      specialCategories: ['азиатские овощи', 'экзотические фрукты']
    },
    'Pantry Staples': {
      localBrands: ['Combino', 'Vitasia', 'Alesto'],
      promotionalKeywords: ['премиум', 'делюкс'],
      specialCategories: ['международная кухня']
    }
  },
  biedronka: {
    'Fresh Produce': {
      localBrands: ['Dobre bo Polskie'],
      seasonalItems: ['польские яблоки', 'местные овощи'],
      promotionalKeywords: ['эко', 'био', 'натуральный'],
      specialCategories: ['польские продукты']
    },
    'Meat & Poultry': {
      localBrands: ['Sokołów', 'Morliny'],
      promotionalKeywords: ['свежий', 'фермерский'],
      specialCategories: ['польские колбасы']
    }
  },
  aldi: {
    'Pantry Staples': {
      localBrands: ['Simply Nature', 'Dakota'],
      promotionalKeywords: ['специальное предложение', 'еженедельная акция'],
      specialCategories: ['специальные покупки']
    },
    'Other': {
      localBrands: ['Crane', 'Adventuridge'],
      seasonalItems: ['сезонные товары', 'специальные находки'],
      promotionalKeywords: ['ограниченное предложение']
    }
  }
};
```

---

## **ЭТАП 6: УТИЛИТЫ ДЛЯ РАБОТЫ С STORE_CONFIGS**

### **6.1 Утилиты для порядка категорий**

**/lib/categorization/utils/categoryOrder.ts**

```typescript
import { STORE_CONFIGS } from '../storeConfigs';

export function getCategoryOrder(storeType: string): { [category: string]: number } {
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType];
  const order: { [category: string]: number } = {};
  
  if (!storeConfig) {
    console.warn(`Store config not found for: ${storeType}`);
    return order;
  }
  
  storeConfig.categories.forEach(category => {
    order[category.name] = category.order;
  });
  
  return order;
}

export function getCategoryIcon(categoryName: string, storeType: string): string {
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType];
  
  if (!storeConfig) {
    return 'package'; // Default icon
  }
  
  const category = storeConfig.categories.find(cat => cat.name === categoryName);
  return category?.icon || 'package';
}

export function getStoreCategories(storeType: string): string[] {
  const normalizedStoreType = storeType.toLowerCase();
  const storeConfig = STORE_CONFIGS[normalizedStoreType];
  
  if (!storeConfig) {
    return [];
  }
  
  return storeConfig.categories
    .sort((a, b) => a.order - b.order)
    .map(cat => cat.name);
}

export function validateCategory(category: string, storeType: string): boolean {
  const storeCategories = getStoreCategories(storeType);
  return storeCategories.includes(category);
}
```

---

## **ЭТАП 7: КЭШИРОВАНИЕ И МЕТРИКИ**

### **7.1 Система кэширования**

**/lib/categorization/utils/cache.ts**

```typescript
import LRUCache from 'lru-cache';
import { CategorizationResult } from '../types';

export class CategorizationCache {
  private cache: LRUCache<string, CategorizationResult>;
  private hitCount = 0;
  private missCount = 0;

  constructor(maxSize: number = 1000) {
    this.cache = new LRUCache({ max: maxSize });
  }

  get(key: string): CategorizationResult | undefined {
    const result = this.cache.get(key);
    if (result) {
      this.hitCount++;
    } else {
      this.missCount++;
    }
    return result;
  }

  set(key: string, value: CategorizationResult): void {
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0
    };
  }

  generateKey(item: string, storeType: string, language?: string): string {
    return `${item.toLowerCase()}|${storeType}|${language || 'auto'}`;
  }
}

// Глобальный экземпляр кэша
export const categorizationCache = new CategorizationCache();
```

### **7.2 Система метрик**

**/lib/categorization/utils/metrics.ts**

```typescript
export interface CategorizationMetrics {
  totalCategorizations: number;
  categoryDistribution: { [category: string]: number };
  averageConfidence: number;
  languageDistribution: { [language: string]: number };
  storeDistribution: { [store: string]: number };
  lowConfidenceItems: Array<{
    item: string;
    category: string;
    confidence: number;
    timestamp: Date;
  }>;
}

export class MetricsCollector {
  private metrics: CategorizationMetrics = {
    totalCategorizations: 0,
    categoryDistribution: {},
    averageConfidence: 0,
    languageDistribution: {},
    storeDistribution: {},
    lowConfidenceItems: []
  };

  trackCategorization(
    item: string,
    category: string,
    confidence: number,
    language: string,
    storeType: string
  ): void {
    this.metrics.totalCategorizations++;
    
    // Category distribution
    if (!this.metrics.categoryDistribution[category]) {
      this.metrics.categoryDistribution[category] = 0;
    }
    this.metrics.categoryDistribution[category]++;
    
    // Language distribution
    if (!this.metrics.languageDistribution[language]) {
      this.metrics.languageDistribution[language] = 0;
    }
    this.metrics.languageDistribution[language]++;
    
    // Store distribution
    if (!this.metrics.storeDistribution[storeType]) {
      this.metrics.storeDistribution[storeType] = 0;
    }
    this.metrics.storeDistribution[storeType]++;
    
    // Average confidence
    const totalConfidence = this.metrics.averageConfidence * (this.metrics.totalCategorizations - 1) + confidence;
    this.metrics.averageConfidence = totalConfidence / this.metrics.totalCategorizations;
    
    // Low confidence tracking
    if (confidence < 0.5) {
      this.metrics.lowConfidenceItems.push({
        item,
        category,
        confidence,
        timestamp: new Date()
      });
      
      // Keep only last 100 low confidence items
      if (this.metrics.lowConfidenceItems.length > 100) {
        this.metrics.lowConfidenceItems = this.metrics.lowConfidenceItems.slice(-100);
      }
    }
  }

  getMetrics(): CategorizationMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      totalCategorizations: 0,
      categoryDistribution: {},
      averageConfidence: 0,
      languageDistribution: {},
      storeDistribution: {},
      lowConfidenceItems: []
    };
  }
}

// Глобальный экземпляр сборщика метрик
export const metricsCollector = new MetricsCollector();
```

---

## **ЭТАП 8: СИСТЕМА ОБУЧЕНИЯ**

### **8.1 Система обучения на исправлениях**

**/lib/categorization/utils/learning.ts**

```typescript
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
    // Создаем копию базовых паттернов для модификации
    this.patterns = JSON.parse(JSON.stringify(BASE_CATEGORY_PATTERNS));
  }

  learnFromCorrection(correction: UserCorrection): void {
    this.corrections.push(correction);
    
    const { item, wrongCategory, correctCategory } = correction;
    
    // Добавляем ключевые слова в правильную категорию
    const words = this.extractSignificantWords(item);
    if (this.patterns[correctCategory]) {
      this.patterns[correctCategory].keywords.push(...words);
      this.patterns[correctCategory].weight += 0.1;
      this.patterns[correctCategory].usage++;
    }
    
    // Уменьшаем вес неправильной категории
    if (this.patterns[wrongCategory]) {
      this.patterns[wrongCategory].weight = Math.max(0.1, this.patterns[wrongCategory].weight - 0.05);
    }
    
    // Добавляем исключение в неправильную категорию
    if (this.patterns[wrongCategory] && !this.patterns[wrongCategory].exclusions.includes(item.toLowerCase())) {
      this.patterns[wrongCategory].exclusions.push(item.toLowerCase());
    }
    
    console.log(`[Learning] Added keywords to ${correctCategory}:`, words);
  }

  private extractSignificantWords(item: string): string[] {
    return item.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !/^\d+$/.test(word)) // Исключаем числа
      .filter(word => !['кг', 'г', 'л', 'мл', 'шт'].includes(word)); // Исключаем единицы измерения
  }

  getUpdatedPatterns(): { [category: string]: AdvancedCategoryPattern } {
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
      if (parsed.corrections) {
        this.corrections = parsed.corrections;
      }
      if (parsed.patterns) {
        this.patterns = parsed.patterns;
      }
    } catch (error) {
      console.error('Failed to import learning data:', error);
    }
  }
}

// Глобальный экземпляр системы обучения
export const learningSystem = new LearningSystem();
```

---

## **ЭТАП 9: ОСНОВНАЯ ЛОГИКА КАТЕГОРИЗАЦИИ**

### **9.1 CategoryMatcher - главный класс**

**/lib/categorization/core/categoryMatcher.ts**

```typescript
import { LanguageDetector } from './languageDetector';
import { TextNormalizer } from './textNormalizer';
import { FuzzyMatcher } from './fuzzyMatcher';
import { BASE_CATEGORY_PATTERNS, CATEGORIZATION_WEIGHTS } from '../patterns/basePatterns';
import { STORE_SPECIFIC_PATTERNS } from '../patterns/storePatterns';
import { getCategoryOrder, getCategoryIcon } from '../utils/categoryOrder';
import { categorizationCache } from '../utils/cache';
import { metricsCollector } from '../utils/metrics';
import { learningSystem } from '../utils/learning';
import { 
  CategorizationContext, 
  CategorizationResult, 
  ItemFeatures, 
  PatternMatch 
} from '../types';

export class CategoryMatcher {
  private languageDetector = new LanguageDetector();
  private textNormalizer = new TextNormalizer();
  private fuzzyMatcher = new FuzzyMatcher();

  async categorize(item: string, context: CategorizationContext): Promise<CategorizationResult> {
    const { storeType, language } = context;
    
    // Проверяем кэш
    const cacheKey = categorizationCache.generateKey(item, storeType, language);
    const cached = categorizationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // 1. Извлекаем признаки товара
      const features = await this.extractFeatures(item, language);
      
      // 2. Применяем паттерны
      const matches = this.applyPatterns(features, context);
      
      // 3. Контекстный анализ
      const contextualMatches = this.applyContextualAnalysis(matches, context);
      
      // 4. Выбираем лучшее совпадение
      const bestMatch = this.selectBestMatch(contextualMatches);
      
      // 5. Получаем порядок и иконку из STORE_CONFIGS
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

      // 6. Кэшируем результат
      categorizationCache.set(cacheKey, result);
      
      // 7. Собираем метрики
      metricsCollector.trackCategorization(
        item,
        result.category,
        result.confidence,
        features.detectedLanguage,
        storeType
      );

      return result;
      
    } catch (error) {
      console.error('Categorization error:', error);
      return this.getFallbackResult(storeType);
    }
  }

  private async extractFeatures(item: string, language?: string): Promise<ItemFeatures> {
    const detectedLang = language || this.languageDetector.detectByCharacters(item);
    const normalizedText = this.textNormalizer.normalize(item, detectedLang);
    
    return {
      originalText: item,
      normalizedText,
      detectedLanguage: detectedLang,
      keywords: this.textNormalizer.extractKeywords(normalizedText),
      brands: [], // Можно расширить
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
      if (matches) {
        modifiers.push(...matches.map(m => m.toLowerCase()));
      }
    });
    
    return modifiers;
  }

  private applyPatterns(features: ItemFeatures, context: CategorizationContext): PatternMatch[] {
    const matches: PatternMatch[] = [];
    const patterns = learningSystem.getUpdatedPatterns();
    
    for (const [category, pattern] of Object.entries(patterns)) {
      let confidence = 0;
      const matchedTerms: string[] = [];
      let matchType: PatternMatch['matchType'] = 'exact';

      // 1. Точные совпадения с ключевыми словами
      for (const keyword of pattern.keywords) {
        if (features.normalizedText.includes(keyword.toLowerCase())) {
          confidence += CATEGORIZATION_WEIGHTS.exactMatch;
          matchedTerms.push(keyword);
          matchType = 'exact';
        }
      }

      // 2. Совпадения с паттернами
      for (const regex of pattern.patterns) {
        if (regex.test(features.originalText)) {
          confidence += CATEGORIZATION_WEIGHTS.patternMatch;
          matchType = 'pattern';
        }
      }

      // 3. Fuzzy matching
      const fuzzyMatches = this.fuzzyMatcher.findSimilar(
        features.normalizedText, 
        pattern.keywords, 
        2
      );
      if (fuzzyMatches.length > 0) {
        confidence += CATEGORIZATION_WEIGHTS.fuzzyMatch * fuzzyMatches[0].similarity;
        matchedTerms.push(...fuzzyMatches.map(m => m.term));
        matchType = 'fuzzy';
      }

      // 4. Синонимы
      const synonyms = pattern.synonyms[features.detectedLanguage] || [];
      for (const synonym of synonyms) {
        if (features.normalizedText.includes(synonym.toLowerCase())) {
          confidence += CATEGORIZATION_WEIGHTS.aliasMatch;
          matchedTerms.push(synonym);
          matchType = 'synonym';
        }
      }

      // 5. Проверка исключений
      const isExcluded = pattern.exclusions.some(exclusion => 
        features.normalizedText.includes(exclusion.toLowerCase())
      );
      if (isExcluded) {
        confidence *= 0.1; // Сильно снижаем уверенность
      }

      // 6. Применяем вес категории
      confidence *= pattern.weight;

      // 7. Магазин-специфичные паттерны
      confidence += this.applyStoreSpecificPatterns(features, category, context);

      if (confidence > 0) {
        matches.push({
          category,
          confidence,
          matchType,
          matchedTerms
        });
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  private applyStoreSpecificPatterns(
    features: ItemFeatures, 
    category: string, 
    context: CategorizationContext
  ): number {
    const storePatterns = STORE_SPECIFIC_PATTERNS[context.storeType];
    if (!storePatterns || !storePatterns[category]) {
      return 0;
    }

    let bonus = 0;
    const storePattern = storePatterns[category];

    // Локальные бренды
    if (storePattern.localBrands) {
      for (const brand of storePattern.localBrands) {
        if (features.originalText.toLowerCase().includes(brand.toLowerCase())) {
          bonus += 0.2;
        }
      }
    }

    // Промо ключевые слова
    if (storePattern.promotionalKeywords) {
      for (const keyword of storePattern.promotionalKeywords) {
        if (features.normalizedText.includes(keyword.toLowerCase())) {
          bonus += 0.1;
        }
      }
    }

    return bonus;
  }

  private applyContextualAnalysis(
    matches: PatternMatch[], 
    context: CategorizationContext
  ): PatternMatch[] {
    // Контекстный анализ можно расширить
    // Например, учитывать соседние товары в списке
    return matches;
  }

  private selectBestMatch(matches: PatternMatch[]): PatternMatch {
    if (matches.length === 0) {
      return {
        category: 'Other',
        confidence: 0,
        matchType: 'exact',
        matchedTerms: []
      };
    }

    return matches[0]; // Уже отсортированы по убыванию confidence
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
```

---

## **ЭТАП 10: ГЛАВНЫЙ ИНТЕРФЕЙС**

### **10.1 Создание публичного API**

**/lib/categorization/index.ts**

```typescript
import { CategoryMatcher } from './core/categoryMatcher';
import { learningSystem, UserCorrection } from './utils/learning';
import { metricsCollector } from './utils/metrics';
import { categorizationCache } from './utils/cache';
import { getCategoryOrder, getCategoryIcon, getStoreCategories } from './utils/categoryOrder';
import { 
  CategorizationContext, 
  CategorizationResult, 
  UserPreferences 
} from './types';

export class EnhancedCategorizer {
  private matcher = new CategoryMatcher();

  /**
   * Категоризация одного товара
   */
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

  /**
   * Категоризация списка товаров с контекстом
   */
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

  /**
   * Обучение на исправлениях пользователя
   */
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

  /**
   * Получение метрик системы
   */
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

  /**
   * Очистка кэша
   */
  clearCache(): void {
    categorizationCache.clear();
  }

  /**
   * Экспорт данных обучения
   */
  exportLearningData(): string {
    return learningSystem.exportLearningData();
  }

  /**
   * Импорт данных обучения
   */
  importLearningData(data: string): void {
    learningSystem.importLearningData(data);
  }

  /**
   * Получение информации о категориях магазина
   */
  getStoreInfo(storeType: string) {
    return {
      categories: getStoreCategories(storeType),
      categoryOrder: getCategoryOrder(storeType)
    };
  }
}

// Создание адаптера для обратной совместимости
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
        language: 'ru', // Default
        confidence: result.confidence
      }));
    },

    // Остальные функции из оригинального файла
    groupItemsByCategory: (items: any[]) => {
      return items.reduce((groups, item) => {
        if (!groups[item.category]) {
          groups[item.category] = [];
        }
        groups[item.category].push(item);
        return groups;
      }, {} as { [category: string]: any[] });
    },

    getCategoryOrder: (storeType: string) => getCategoryOrder(storeType),
    getCategoryIcon: (categoryName: string, storeType: string) => getCategoryIcon(categoryName, storeType)
  };
}

// Экспорт основных компонентов
export { EnhancedCategorizer as default };
export * from './types';
export { getCategoryOrder, getCategoryIcon, getStoreCategories } from './utils/categoryOrder';
export { STORE_CONFIGS } from './storeConfigs';
```

---

## **ЭТАП 11: ТЕСТИРОВАНИЕ**

### **11.1 Тестовые данные**

**/lib/categorization/tests/testData.ts**

```typescript
export const TEST_DATASETS = {
  basic: [
    { item: 'молоко', expected: 'Dairy & Eggs', storeType: 'lidl', confidence: 0.8 },
    { item: 'яблоки красные', expected: 'Fresh Produce', storeType: 'lidl', confidence: 0.9 },
    { item: 'хлеб белый', expected: 'Bakery', storeType: 'lidl', confidence: 0.85 },
    { item: 'курица филе', expected: 'Meat & Poultry', storeType: 'lidl', confidence: 0.9 },
    { item: 'вода минеральная', expected: 'Beverages', storeType: 'lidl', confidence: 0.8 },
  ],
  
  edge_cases: [
    { item: 'соевое молоко', expected: 'Beverages', storeType: 'lidl', confidence: 0.6 },
    { item: 'кокосовое масло', expected: 'Pantry Staples', storeType: 'lidl', confidence: 0.7 },
    { item: 'мороженое', expected: 'Frozen Foods', storeType: 'lidl', confidence: 0.9 },
  ],
  
  multilingual: [
    { item: 'mleko', expected: 'Dairy & Eggs', storeType: 'biedronka', confidence: 0.7 },
    { item: 'bread', expected: 'Bakery', storeType: 'aldi', confidence: 0.8 },
    { item: 'pomidory', expected: 'Fresh Produce', storeType: 'biedronka', confidence: 0.8 },
  ],
  
  typos: [
    { item: 'молако', expected: 'Dairy & Eggs', storeType: 'lidl', confidence: 0.6 },
    { item: 'ябоки', expected: 'Fresh Produce', storeType: 'lidl', confidence: 0.6 },
    { item: 'хелб', expected: 'Bakery', storeType: 'lidl', confidence: 0.5 },
  ]
};
```

### **11.2 Unit тесты**

**/lib/categorization/tests/categorizer.test.ts**

```typescript
import { EnhancedCategorizer } from '../index';
import { TEST_DATASETS } from './testData';

describe('EnhancedCategorizer', () => {
  let categorizer: EnhancedCategorizer;

  beforeEach(() => {
    categorizer = new EnhancedCategorizer();
  });

  describe('Basic categorization', () => {
    it('should categorize basic items correctly', async () => {
      for (const testCase of TEST_DATASETS.basic) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
        expect(result.confidence).toBeGreaterThanOrEqual(testCase.confidence);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle edge cases correctly', async () => {
      for (const testCase of TEST_DATASETS.edge_cases) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
      }
    });
  });

  describe('Multilingual support', () => {
    it('should categorize multilingual items', async () => {
      for (const testCase of TEST_DATASETS.multilingual) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
      }
    });
  });

  describe('Typo handling', () => {
    it('should handle typos with fuzzy matching', async () => {
      for (const testCase of TEST_DATASETS.typos) {
        const result = await categorizer.categorizeItem(testCase.item, testCase.storeType);
        expect(result.category).toBe(testCase.expected);
      }
    });
  });

  describe('Learning system', () => {
    it('should learn from user corrections', async () => {
      const item = 'растительное молоко';
      
      // Первоначальная категоризация
      const initialResult = await categorizer.categorizeItem(item, 'lidl');
      
      // Исправление пользователя
      categorizer.learnFromUser(item, initialResult.category, 'Beverages', 'lidl');
      
      // Повторная категоризация должна учесть исправление
      const correctedResult = await categorizer.categorizeItem(item, 'lidl');
      expect(correctedResult.category).toBe('Beverages');
    });
  });

  describe('Store-specific behavior', () => {
    it('should return correct category order for different stores', async () => {
      const result = await categorizer.categorizeItem('яблоки', 'lidl');
      expect(result.categoryOrder).toBeDefined();
      expect(result.icon).toBeDefined();
    });
  });
});
```

---

## **ЭТАП 12: ИНТЕГРАЦИЯ В СУЩЕСТВУЮЩИЙ КОД**

### **12.1 Обновление оригинального файла**

Обнови `/lib/store-data.ts` следующим образом:

```typescript
// Импортируй новый категоризатор
import EnhancedCategorizer, { createLegacyAdapter } from './categorization';
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
```

**Пояснения:**
- Теперь все вызовы `categorizeItem`, `processShoppingList` и т.д. используют новую систему, но интерфейс для остального кода и UI не меняется.
- Если где-то в UI или API используется порядок категорий или иконки — они всегда берутся из STORE_CONFIGS через утилиты.

---

### **12.2 Проверка и тестирование**

- Запусти unit-тесты из `/lib/categorization/tests/categorizer.test.ts` и убедись, что все тесты проходят.
- Проверь работу на реальных данных: создай тестовый список покупок, проверь корректность категорий, порядок и иконки для разных магазинов.
- Проверь работу системы обучения: исправь категорию вручную и убедись, что система "запоминает" исправление.

---

### **12.3 Документирование**

- В README проекта добавь раздел о новой системе категоризации, опиши:
  - где лежит конфиг магазинов (STORE_CONFIGS)
  - как работает fallback-категоризация
  - как работает система обучения на исправлениях
  - как расширять паттерны и добавлять новые магазины/категории

---

## **КРАТКОЕ РЕЗЮМЕ ДЛЯ AI AGENT**

1. **Создай модульную систему категоризации в `/lib/categorization/` по предложенной структуре.**
2. **Вынеси STORE_CONFIGS в отдельный файл и используй его для порядка и иконок категорий.**
3. **Реализуй CategoryMatcher с поддержкой паттернов, fuzzy matching, мультиязычности, кэширования и обучения.**
4. **Обеспечь обратную совместимость через адаптер в `/lib/store-data.ts`.**
5. **Покрой систему тестами и проверь интеграцию с UI.**
6. **Документируй архитектуру и способы расширения.**