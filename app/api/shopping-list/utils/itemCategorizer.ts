export function basicCategorize(item: string): string {
  const lowerItem = item.toLowerCase();
  if (/молоко|сыр|йогурт|творог|сметан|масло|яйца|кефир|ряженка|сливки/i.test(lowerItem)) {
    return 'Dairy & Eggs';
  }
  if (/хлеб|булк|батон|лаваш|выпечк|печень|торт|булочк|пряник/i.test(lowerItem)) {
    return 'Bakery';
  }
  if (/яблок|банан|апельсин|лимон|картош|помидор|огурц|морковь|лук|чеснок|капуст|зелен|фрукт|овощ|салат|перец|редис|укроп|петрушк|свеж|редис|баклажан/i.test(lowerItem)) {
    return 'Fresh Produce';
  }
  if (/говядин|свинин|курин|курица|филе|фарш|колбас|сосис|бекон|мясо|бедрышк|голен|ветчин/i.test(lowerItem)) {
    return 'Meat & Poultry';
  }
  if (/рыба|лосось|тунец|морепродукт|креветк|оливк/i.test(lowerItem)) {
    return 'Fish & Seafood';
  }
  if (/заморож|пельмен|мороженое|смесь/i.test(lowerItem)) {
    return 'Frozen Foods';
  }
  if (/вода|сок|чай|кофе|напиток|пиво|вино|газиров|минерал/i.test(lowerItem)) {
    return 'Beverages';
  }
  if (/мука|сахар|соль|рис|макарон|крупа|консерв|соус|кетчуп|майонез|горошек|кукуруз|фасоль|гречк|масло/i.test(lowerItem)) {
    return 'Pantry Staples';
  }
  if (/мыло|чистящ|пакет|салфетк|бумаг|мусор|фольг|средств/i.test(lowerItem)) {
    return 'Household Supplies';
  }
  if (/печень|шоколад|снэк/i.test(lowerItem)) {
    return 'Snacks';
  }
  // Категория по умолчанию
  return 'Other';
}
