import { SavedList } from '../types';

export const useListFilters = (savedLists: SavedList[]) => {
  const getUniqueStores = () => {
    return Array.from(new Set(savedLists.map(list => list.storeId)));
  };

  const getFilteredLists = (selectedStore: string) => {
    return selectedStore === 'all' 
      ? savedLists.filter(list => list.status !== 'completed')
      : savedLists.filter(list => list.storeId === selectedStore && list.status !== 'completed');
  };

  const getCompletedLists = () => {
    return savedLists.filter(list => list.status === 'completed');
  };

  return {
    getUniqueStores,
    getFilteredLists,
    getCompletedLists
  };
};
