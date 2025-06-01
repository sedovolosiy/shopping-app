import { AdvancedCategoryPattern } from '../types';

export const BASE_CATEGORY_PATTERNS: { [category: string]: AdvancedCategoryPattern } = {
  'Fresh Produce': {
    keywords: [
      'овощи', 'фрукты', 'огурцы', 'помидоры', 'лук', 'картофель', 'морковь', 'капуста',
      'бананы', 'яблоки', 'апельсины', 'лимоны', 'груши', 'виноград', 'клубника',
      'зелень', 'салат', 'укроп', 'петрушка', 'базилик', 'шпинат', 'баклажан', 'перец'
    ],
    patterns: [
      /(^|\s|,)(овощи|фрукты|зелень)($|\s|,)/i,
      /(овощ\w*|фрукт\w*|зелен\w*)/i,
      /(свеж\w*|органическ\w*)\s+(овощ\w*|фрукт\w*)/i,
      /(^|\s|,)(картошка|помидоры|огурцы|морковь|капуста|лук|чеснок)($|\s|,)/i,
      /(картош\w*|помидор\w*|огурц\w*|морков\w*|капуст\w*)/i,
      /(^|\s|,)(яблоки|бананы|апельсины|лимоны|груши|виноград)($|\s|,)/i,
      /(яблок\w*|банан\w*|апельсин\w*|лимон\w*|груш\w*)/i
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
      { type: 'co-occurrence', items: ['салат', 'зелень'], boost: 0.2 }
    ],
    exclusions: ['сок', 'консервированный'],
    weight: 1.5,
    priority: 1,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Bakery': {
    keywords: ['хлеб', 'булка', 'батон', 'выпечка', 'пончики', 'багет', 'рогалик', 'сдоба', 'круассан', 'лаваш'],
    patterns: [
      /(^|\s|,)(хлеб|булка|батон|багет|рогалик|сдоба|круассан|лаваш)($|\s|,)/i,
      /(булк\w*)/i,
      /(^|\s|,)(выпечка|пончики|булочка)($|\s|,)/i,
      /(выпечк\w*|пончик\w*|булочк\w*)/i
    ],
    synonyms: {
      ru: ['выпечка', 'хлебобулочные изделия'],
      en: ['bakery', 'bread', 'pastries'],
      pl: ['pieczywo', 'wypieki']
    },
    brands: [],
    units: ['шт', 'упак'],
    modifiers: ['свежий', 'цельнозерновой', 'ржаной'],
    contextRules: [],
    exclusions: ['сухари', 'крекер'],
    weight: 1.2,
    priority: 2,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Dairy & Eggs': {
    keywords: ['молоко', 'кефир', 'йогурт', 'сыр', 'масло', 'яйца', 'сливки', 'творог'],
    patterns: [
      /(^|\s|,)(молоко|кефир|йогурт|сыр|масло|яйца|сливки|творог)($|\s|,)/i,
      /(молочн\w*|яичн\w*)/i
    ],
    synonyms: {
      ru: ['молочные продукты', 'молочка', 'яйца'],
      en: ['dairy', 'eggs', 'milk products'],
      pl: ['nabiał', 'jajka']
    },
    brands: ['Prostokvashino', 'Danone', 'President'],
    units: ['л', 'мл', 'шт', 'упак'],
    modifiers: ['свежее', 'фермерское', 'обезжиренное'],
    contextRules: [],
    exclusions: ['молочный шоколад'],
    weight: 1.2,
    priority: 3,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Meat & Poultry': {
    keywords: ['мясо', 'курица', 'свинина', 'говядина', 'фарш', 'филе', 'котлеты'],
    patterns: [
      /(^|\s|,)(мясо|курица|свинина|говядина|фарш|филе|котлеты)($|\s|,)/i,
      /(куриц\w*|свин\w*|говядин\w*|котлет\w*)/i
    ],
    synonyms: {
      ru: ['мясные продукты', 'птица', 'курятина'],
      en: ['meat', 'poultry', 'chicken'],
      pl: ['mięso', 'drób']
    },
    brands: ['Мираторг', 'Петелинка'],
    units: ['кг', 'г', 'упак'],
    modifiers: ['свежее', 'охлажденное', 'фермерское'],
    contextRules: [],
    exclusions: ['колбаса', 'ветчина'],
    weight: 1.2,
    priority: 4,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Sausages & Deli': {
    keywords: ['колбаса', 'ветчина', 'сосиски', 'сервелат', 'деликатесы', 'паштет'],
    patterns: [
      /(^|\s|,)(колбаса|ветчина|сосиски|сервелат|деликатесы|паштет)($|\s|,)/i,
      /(колбас\w*|ветчин\w*|сосиск\w*|деликатес\w*)/i
    ],
    synonyms: {
      ru: ['колбасные изделия', 'деликатесы'],
      en: ['sausages', 'deli meats'],
      pl: ['wędliny', 'kiełbasy']
    },
    brands: ['Дымов', 'Велком'],
    units: ['кг', 'г', 'упак'],
    modifiers: ['копченый', 'вареный', 'сырокопченый'],
    contextRules: [],
    exclusions: ['мясо', 'птица'],
    weight: 1.1,
    priority: 5,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Fish & Seafood': {
    keywords: ['рыба', 'лосось', 'тунец', 'сельдь', 'форель', 'морепродукты'],
    patterns: [
      /(^|\s|,)(рыба|лосось|тунец|сельдь|форель|морепродукты)($|\s|,)/i,
      /(рыб\w*|лосос\w*|сельд\w*|форел\w*|морепродукт\w*)/i
    ],
    synonyms: {
      ru: ['рыбные продукты', 'морепродукты'],
      en: ['fish', 'seafood'],
      pl: ['ryby', 'owoce morza']
    },
    brands: ['Vici', 'Santa Bremor'],
    units: ['кг', 'г', 'упак'],
    modifiers: ['свежий', 'замороженный', 'копченый'],
    contextRules: [],
    exclusions: ['консервы', 'крабовые палочки'],
    weight: 1.1,
    priority: 6,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Frozen Foods': {
    keywords: ['замороженные', 'пельмени', 'вареники', 'замороженные овощи', 'мороженое', 'замороженная рыба'],
    patterns: [
      /(^|\s|,)(замороженные|пельмени|вареники|мороженое)($|\s|,)/i,
      /(заморож\w*|пельмен\w*|вареник\w*)/i
    ],
    synonyms: {
      ru: ['заморозка', 'замороженные продукты'],
      en: ['frozen foods', 'frozen products'],
      pl: ['mrożonki']
    },
    brands: ['Останкино', 'Морозко'],
    units: ['кг', 'г', 'упак'],
    modifiers: ['замороженный'],
    contextRules: [],
    exclusions: ['свежие овощи', 'фрукты'],
    weight: 1.0,
    priority: 7,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Pantry Staples': {
    keywords: ['крупа', 'рис', 'гречка', 'макароны', 'мука', 'сахар', 'соль', 'овсянка', 'чечевица', 'перловка'],
    patterns: [
      /(^|\s|,)(крупа|рис|гречка|макароны|мука|сахар|соль|овсянка|чечевица|перловка)($|\s|,)/i,
      /(круп\w*|гречк\w*|макарон\w*|мук\w*|овсянк\w*|чечевиц\w*|перловк\w*)/i
    ],
    synonyms: {
      ru: ['бакалея', 'крупы', 'основные продукты'],
      en: ['pantry staples', 'groceries', 'grains'],
      pl: ['produkty sypkie', 'zboża']
    },
    brands: ['Мистраль', 'Увелка'],
    units: ['кг', 'г', 'упак'],
    modifiers: ['шлифованный', 'быстрого приготовления'],
    contextRules: [],
    exclusions: ['сладости', 'консервы'],
    weight: 1.0,
    priority: 8,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Canned & Jars': {
    keywords: ['консервы', 'тушенка', 'горошек', 'кукуруза', 'фасоль', 'соленья', 'джем', 'варенье'],
    patterns: [
      /(^|\s|,)(консервы|тушенка|горошек|кукуруза|фасоль|соленья|джем|варенье)($|\s|,)/i,
      /(консерв\w*|тушенк\w*|кукуруз\w*|солень\w*|варень\w*)/i
    ],
    synonyms: {
      ru: ['консервы', 'баночные продукты'],
      en: ['canned', 'jars', 'preserves'],
      pl: ['konserwy', 'przetwory']
    },
    brands: ['Bonduelle', 'Heinz'],
    units: ['банка', 'шт', 'упак'],
    modifiers: ['консервированный'],
    contextRules: [],
    exclusions: ['свежие овощи', 'фрукты'],
    weight: 0.9,
    priority: 9,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Snacks & Sweets': {
    keywords: ['сладости', 'печенье', 'шоколад', 'вафли', 'конфеты', 'чипсы', 'сухарики', 'орехи', 'снеки', 'батончик'],
    patterns: [
      /(^|\s|,)(сладости|печенье|шоколад|вафли|конфеты|чипсы|сухарики|орехи|снеки|батончик)($|\s|,)/i,
      /(сладост\w*|печень\w*|вафл\w*|конфет\w*|сухарик\w*|снек\w*)/i
    ],
    synonyms: {
      ru: ['снеки', 'сладкое', 'десерты'],
      en: ['snacks', 'sweets', 'confectionery'],
      pl: ['przekąski', 'słodycze']
    },
    brands: ['Milka', 'Alpen Gold', 'Lays'],
    units: ['шт', 'упак'],
    modifiers: ['солёный', 'сладкий'],
    contextRules: [],
    exclusions: ['основные блюда'],
    weight: 0.9,
    priority: 10,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Beverages': {
    keywords: ['напитки', 'сок', 'вода', 'минералка', 'газировка', 'лимонад', 'энергетик'],
    patterns: [
      /(^|\s|,)(напитки|сок|вода|минералка|газировка|лимонад|энергетик)($|\s|,)/i,
      /(напит\w*|минерал\w*|газировк\w*)/i
    ],
    synonyms: {
      ru: ['напитки', 'безалкогольные напитки'],
      en: ['beverages', 'drinks', 'soft drinks'],
      pl: ['napoje', 'soki']
    },
    brands: ['Coca-Cola', 'Pepsi', 'Rich'],
    units: ['л', 'мл', 'упак'],
    modifiers: ['газированный', 'без сахара'],
    contextRules: [],
    exclusions: ['алкоголь'],
    weight: 0.8,
    priority: 11,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Coffee & Tea': {
    keywords: ['кофе', 'чай', 'капучино', 'эспрессо', 'зеленый чай', 'черный чай'],
    patterns: [
      /(^|\s|,)(кофе|чай|капучино|эспрессо)($|\s|,)/i
    ],
    synonyms: {
      ru: ['кофе и чай', 'горячие напитки'],
      en: ['coffee', 'tea', 'hot drinks'],
      pl: ['kawa', 'herbata']
    },
    brands: ['Nescafe', 'Jacobs', 'Lipton'],
    units: ['г', 'упак'],
    modifiers: ['растворимый', 'молотый', 'черный', 'зеленый'],
    contextRules: [],
    exclusions: ['энергетик'],
    weight: 0.8,
    priority: 12,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Alcohol': {
    keywords: ['пиво', 'вино', 'шампанское', 'водка', 'ликер', 'алкоголь'],
    patterns: [
      /(^|\s|,)(пиво|вино|шампанское|водка|ликер|алкоголь)($|\s|,)/i,
      /(шампанск\w*)/i
    ],
    synonyms: {
      ru: ['алкогольные напитки'],
      en: ['alcohol', 'beer', 'wine', 'spirits'],
      pl: ['alkohol', 'piwo', 'wino']
    },
    brands: ['Heineken', 'Absolut', 'Martini'],
    units: ['л', 'мл', 'бутылка'],
    modifiers: ['крепкий', 'сухое', 'полусладкое'],
    contextRules: [],
    exclusions: ['безалкогольное'],
    weight: 0.7,
    priority: 13,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Baby & Kids': {
    keywords: ['детское питание', 'подгузники', 'пюре', 'каша', 'соки для детей'],
    patterns: [
      /(^|\s|,)(подгузники|пюре|каша)($|\s|,)/i,
      /(детск\w*|сок.*дет\w*)/i
    ],
    synonyms: {
      ru: ['детские товары', 'детское питание'],
      en: ['baby', 'kids', 'baby food'],
      pl: ['dzieci', 'żywność dla dzieci']
    },
    brands: ['Gerber', 'Hipp', 'Pampers'],
    units: ['шт', 'упак', 'банка'],
    modifiers: ['детский', 'гипоаллергенный'],
    contextRules: [],
    exclusions: ['взрослое питание'],
    weight: 0.7,
    priority: 14,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Pet Supplies': {
    keywords: ['корм для животных', 'корм для кошек', 'корм для собак', 'наполнитель'],
    patterns: [
      /(корм.*животн\w*|корм.*кошк\w*|корм.*собак\w*|наполнител\w*)/i
    ],
    synonyms: {
      ru: ['товары для животных', 'корм'],
      en: ['pet supplies', 'pet food'],
      pl: ['zwierzęta', 'karma']
    },
    brands: ['Whiskas', 'Pedigree', 'Felix'],
    units: ['кг', 'г', 'упак'],
    modifiers: ['для кошек', 'для собак'],
    contextRules: [],
    exclusions: ['человеческая еда'],
    weight: 0.6,
    priority: 15,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Household': {
    keywords: ['бытовая химия', 'уборка', 'моющее', 'бумажные изделия', 'салфетки', 'пакеты', 'фольга'],
    patterns: [
      /(^|\s|,)(уборка|моющее|салфетки|пакеты|фольга)($|\s|,)/i,
      /(бытов\w*|уборк\w*|моющ\w*|бумажн\w*|салфетк\w*|фольг\w*)/i
    ],
    synonyms: {
      ru: ['бытовые товары', 'чистящие средства'],
      en: ['household', 'cleaning', 'paper goods'],
      pl: ['gospodarstwo domowe', 'środki czystości']
    },
    brands: ['Fairy', 'Zewa', 'Bref'],
    units: ['шт', 'упак'],
    modifiers: ['антибактериальный', 'ароматизированный'],
    contextRules: [],
    exclusions: ['еда'],
    weight: 0.6,
    priority: 16,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Cosmetics & Hygiene': {
    keywords: ['шампунь', 'гель', 'мыло', 'зубная паста', 'косметика', 'уход'],
    patterns: [
      /(^|\s|,)(шампунь|гель|мыло|косметика|уход)($|\s|,)/i,
      /(зубн\w*.*паст\w*|косметик\w*)/i
    ],
    synonyms: {
      ru: ['гигиена', 'уход за собой'],
      en: ['cosmetics', 'hygiene', 'personal care'],
      pl: ['kosmetyki', 'higiena']
    },
    brands: ['Nivea', 'Colgate', 'Palmolive'],
    units: ['шт', 'упак', 'тюбик'],
    modifiers: ['увлажняющий', 'антибактериальный'],
    contextRules: [],
    exclusions: ['лекарства'],
    weight: 0.5,
    priority: 17,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  },
  'Bio & Vegan': {
    keywords: ['био', 'эко', 'органик', 'веган', 'безглютеновый'],
    patterns: [
      /(^|\s|,)(био|эко|органик|веган|безглютенов)($|\s|,)/i,
      /(био\w*|эко\w*|органик\w*|веган\w*|безглютенов\w*)/i
    ],
    synonyms: {
      ru: ['био продукты', 'эко продукты', 'веганское'],
      en: ['bio', 'eco', 'organic', 'vegan', 'gluten free'],
      pl: ['bio', 'eko', 'wegańskie', 'безglutenowe']
    },
    brands: ['Alpro', 'Valio'],
    units: ['шт', 'упак'],
    modifiers: ['без глютена', 'без лактозы', 'веганский'],
    contextRules: [],
    exclusions: ['обычные продукты'],
    weight: 0.5,
    priority: 18,
    confidence: 0,
    lastUpdated: new Date(),
    usage: 0
  }
};

export const CATEGORIZATION_WEIGHTS = {
  exactMatch: 2.0,
  patternMatch: 1.5,
  keywordMatch: 1.0,
  aliasMatch: 0.8,
  contextMatch: 0.6,
  fuzzyMatch: 0.4,
  brandMatch: 0.3
};
