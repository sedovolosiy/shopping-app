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
