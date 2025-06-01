import { STORE_CONFIGS } from '../storeConfigs';

export const STORE_SPECIFIC_PATTERNS = {
  lidl: {
    'Fresh Produce': {
      localBrands: ['Vitasia', 'Freshona', 'Solevita'],
      seasonalItems: ['летние овощи', 'зимние фрукты', 'сезонные ягоды'],
      promotionalKeywords: ['био', 'органик', 'эко'],
      specialCategories: ['азиатские овощи', 'экзотические фрукты']
    },
    'Bakery': {
      localBrands: ['Chef Select', 'Baker Street'],
      promotionalKeywords: ['свежая выпечка', 'цельнозерновой'],
      specialCategories: ['мини-багеты', 'здоровое питание']
    },
    'Dairy & Eggs': {
      localBrands: ['Milbona', 'Pilos'],
      promotionalKeywords: ['фермерское', 'био'],
      specialCategories: ['безлактозное молоко']
    },
    'Meat & Poultry': {
      localBrands: ['Cien', 'Dulano'],
      promotionalKeywords: ['фермерский', 'охлажденный'],
      specialCategories: ['гриль-наборы']
    }
    // ... остальные категории по аналогии
  },
  biedronka: {
    'Fresh Produce': {
      localBrands: ['Dobre bo Polskie'],
      seasonalItems: ['польские яблоки', 'местные овощи'],
      promotionalKeywords: ['эко', 'био', 'натуральный'],
      specialCategories: ['польские продукты']
    },
    'Meat & Deli': {
      localBrands: ['Sokołów', 'Morliny'],
      promotionalKeywords: ['свежий', 'фермерский'],
      specialCategories: ['польские колбасы']
    },
    'Bakery': {
      localBrands: ['Piekarnia Biedronka'],
      promotionalKeywords: ['свежая выпечка'],
      specialCategories: ['традиционный хлеб']
    }
    // ... остальные категории по аналогии
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
    },
    'Fresh Produce': {
      localBrands: ['Nature’s Pick'],
      seasonalItems: ['летние овощи', 'зимние фрукты'],
      promotionalKeywords: ['органик', 'био'],
      specialCategories: ['экзотические фрукты']
    }
    // ... остальные категории по аналогии
  }
};
