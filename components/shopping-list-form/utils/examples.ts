// utils/examples.ts - Утилиты для примеров и вспомогательных функций

export const EXAMPLE_SHOPPING_LIST = `молоко
хлеб
яблоки
сыр
курица
макароны
помидоры
йогурт
мыло
шампунь
конфеты
вода`;

export const getItemCount = (text: string): number => {
  return text.split('\n').filter(line => line.trim()).length;
};
