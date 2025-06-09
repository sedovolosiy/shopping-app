import { useState, useEffect } from 'react';

export const useStoresData = () => {
  const [storesMap, setStoresMap] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const fetchStores = async () => {
      try {
        const res = await fetch('/api/stores');
        if (!res.ok) return;
        
        const stores = await res.json();
        const map: Record<string, string> = {};
        
        (stores || []).forEach((store: { id: string; name: string }) => {
          if (store && store.id && store.name) {
            map[store.id] = store.name;
          }
        });
        
        setStoresMap(map);
      } catch (e) {
        console.warn('Failed to fetch stores:', e);
      }
    };

    fetchStores();
  }, []);

  const getStoreDisplayName = (storeId: string) => {
    if (!isClient) return 'Магазин';
    return storesMap[storeId] || 'Магазин';
  };

  return {
    storesMap,
    isClient,
    getStoreDisplayName
  };
};
