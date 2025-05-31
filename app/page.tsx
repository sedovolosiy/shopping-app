'use client';

import React, { useState, useCallback } from 'react';
// Assuming StoreType might be different from the Store interface expected by ShoppingListForm
// import { ShoppingItem, StoreType } from '@/lib/types'; 
import { ShoppingItem } from '@/lib/types'; // Keep ShoppingItem if used by OptimizedListView
import { processShoppingList } from '@/lib/store-data';
import ShoppingListForm from '@/components/shopping-list-form';
import OptimizedListView from '@/components/optimized-list-view';

// Define the Store interface expected by ShoppingListForm and for availableStores
interface Store {
  id: string;
  name: string;
}

export default function HomePage() {
  const [rawText, setRawText] = useState<string>('');
  // const [selectedStore, setSelectedStore] = useState<StoreType>('lidl'); // Old store state
  const [optimizedItems, setOptimizedItems] = useState<ShoppingItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);

  // New state variables required by ShoppingListForm
  const [userId, setUserId] = useState<string>('guest-user-app-app'); // Default or load from auth
  const [listName, setListName] = useState<string>('');
  const [availableStores, setAvailableStores] = useState<Store[]>([]); // Initialize as empty array
  const [selectedStoreId, setSelectedStoreId] = useState<string>(''); // For the Select component in the form

  // Placeholder for onAddStore, actual implementation would involve an API call
  const handleAddStore = useCallback(async (storeName: string): Promise<Store | null> => {
    console.log('Attempting to add store:', storeName);
    // In a real scenario, you'd make an API call here:
    // const newStore = await api.addStore(storeName);
    // setAvailableStores(prev => [...prev, newStore]);
    // setSelectedStoreId(newStore.id);
    // For now, returning a mock store or null
    const mockNewStore = { id: Date.now().toString(), name: storeName };
    setAvailableStores(prev => [...prev, mockNewStore]);
    setSelectedStoreId(mockNewStore.id);
    return mockNewStore;
    // return null; 
  }, []);

  const handleOptimize = useCallback((currentUserId?: string, currentListName?: string) => { // Modified to accept userId and listName
    if (!rawText.trim()) return;
    
    // The processShoppingList might need to be updated if it depends on the old selectedStore type
    // For now, we'll assume it can work or will be adapted.
    // It also doesn't use currentUserId or currentListName yet.
    const storeForProcessing = availableStores.find(s => s.id === selectedStoreId)?.name || 'default';
    const processedItems = processShoppingList(rawText, storeForProcessing as any); // Cast needed if StoreType is different
    setOptimizedItems(processedItems);
    setIsOptimized(true);
    console.log('Optimizing for user:', currentUserId, 'List name:', currentListName);
  }, [rawText, selectedStoreId, availableStores]);

  const handleToggleItem = useCallback((itemId: string) => {
    setOptimizedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, purchased: !item.purchased }
          : item
      )
    );
  }, []);

  const handleReset = useCallback(() => {
    setOptimizedItems([]);
    setIsOptimized(false);
    setRawText('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Заголовок приложения */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Умный помощник для покупок
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Оптимизируйте свой маршрут в магазинах Lidl, Biedronka и Aldi
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Форма ввода */}
        <div>
          <ShoppingListForm
            rawText={rawText}
            setRawText={setRawText}
            // selectedStore={selectedStore} // Prop not used by current form
            // setSelectedStore={setSelectedStore} // Prop not used by current form
            onOptimize={handleOptimize}
            isOptimized={isOptimized}
            // Pass new required props
            userId={userId}
            setUserId={setUserId}
            listName={listName}
            setListName={setListName}
            availableStores={availableStores}
            onAddStore={handleAddStore}
            selectedStoreId={selectedStoreId}
            setSelectedStoreId={setSelectedStoreId}
          />
        </div>

        {/* Оптимизированный список */}
        {isOptimized && optimizedItems.length > 0 && (
          <div>
            <OptimizedListView
              items={optimizedItems}
              storeType={availableStores.find(s => s.id === selectedStoreId)?.name || selectedStoreId as any} // Adapting for OptimizedListView
              onToggleItem={handleToggleItem}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Пустое состояние */}
        {isOptimized && optimizedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Список покупок пуст. Добавьте товары для оптимизации маршрута.
            </div>
          </div>
        )}

        {/* Информационные карточки */}
        {!isOptimized && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-3">🛒</div>
              <h3 className="font-semibold text-lg mb-2">Простой ввод</h3>
              <p className="text-gray-600 text-sm">
                Вставьте список покупок из любого источника - Telegram, SMS, заметок
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-green-600 text-2xl mb-3">🗺️</div>
              <h3 className="font-semibold text-lg mb-2">Умная оптимизация</h3>
              <p className="text-gray-600 text-sm">
                Автоматическая группировка товаров по категориям и оптимальный маршрут
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-purple-600 text-2xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2">Мобильная версия</h3>
              <p className="text-gray-600 text-sm">
                Удобное использование на телефоне прямо в магазине
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Подвал */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              Приложение основано на исследовании планировки магазинов Lidl, Biedronka и Aldi
            </p>
            <p className="text-xs text-gray-500">
              Маршруты могут отличаться в зависимости от конкретного магазина
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
