'use client';

import React, { useState, useCallback, useEffect } from 'react';
// Assuming StoreType might be different from the Store interface expected by ShoppingListForm
// import { ShoppingItem, StoreType } from '@/lib/types'; 
import { ShoppingItem } from '@/lib/types'; // Keep ShoppingItem if used by OptimizedListView
import { processShoppingList } from '@/lib/store-data';
import ShoppingListForm from '@/components/shopping-list-form';
import OptimizedListView from '@/components/optimized-list-view';
import AIStatus from '@/components/ai-status';
import FullPageLoader from '@/components/full-page-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';

// Define the Store interface expected by ShoppingListForm and for availableStores
interface Store {
  id: string;
  name: string;
}

export default function HomePage() {
  const [rawText, setRawText] = useState<string>('');
  const [optimizedItems, setOptimizedItems] = useState<ShoppingItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAIProcessed, setIsAIProcessed] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true); // Control form visibility

  // New state variables required by ShoppingListForm
  const [userId, setUserId] = useState<string>('guest-user-app-app'); // Default or load from auth
  const [listName, setListName] = useState<string>('');
  const [availableStores, setAvailableStores] = useState<Store[]>([]); // Initialize as empty array
  const [selectedStoreId, setSelectedStoreId] = useState<string>(''); // For the Select component in the form

  // Load available stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Import here to avoid circular dependencies
        const { getStores } = await import('@/lib/api-client');
        
        const stores = await getStores();
        setAvailableStores(stores);
        
        // If there are stores available, select the first one by default
        if (stores.length > 0) {
          setSelectedStoreId(stores[0].id);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        // Create some default stores if API fails
        const defaultStores = [
          { id: 'lidl', name: 'Lidl' },
          { id: 'biedronka', name: 'Biedronka' },
          { id: 'aldi', name: 'Aldi' }
        ];
        setAvailableStores(defaultStores);
        setSelectedStoreId(defaultStores[0].id);
      }
    };
    
    fetchStores();
  }, []);

  // Implementation for onAddStore with API client
  const handleAddStore = useCallback(async (storeName: string): Promise<Store | null> => {
    console.log('Attempting to add store:', storeName);
    try {
      // Import here to avoid circular dependencies
      const { addStore } = await import('@/lib/api-client');
      
      const newStore = await addStore(storeName);
      setAvailableStores(prev => [...prev, newStore]);
      setSelectedStoreId(newStore.id);
      return newStore;
    } catch (error) {
      console.error('Error adding store:', error);
      // As a fallback, create a mock store with clientside ID
      const mockNewStore = { id: `mock-${Date.now()}`, name: storeName };
      setAvailableStores(prev => [...prev, mockNewStore]);
      setSelectedStoreId(mockNewStore.id);
      return mockNewStore;
    }
  }, []);

  const handleOptimize = useCallback(async (currentUserId?: string, currentListName?: string) => {
    if (!rawText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Import here to avoid circular dependencies
      const { processShoppingListWithAPI } = await import('@/lib/api-client');
      
      // Try to use the API for processing (with AI if available)
      const apiResponse = await processShoppingListWithAPI(
        rawText,
        currentUserId || userId,
        currentListName || listName,
        selectedStoreId
      );
      
      // API returns items in the correct format
      setOptimizedItems(apiResponse.items);
      setIsOptimized(true);
      setShowForm(false); // Hide form after successful optimization
      
      // Update AI processing status
      // Check if metadata exists and has processedWith
      const wasAIProcessed = apiResponse.metadata && apiResponse.metadata.processedWith === 'ai';
      setIsAIProcessed(Boolean(wasAIProcessed));
      
      // Check if AI was used and show a message if not
      if (!wasAIProcessed) {
        setError("AI processing wasn't available. Using basic categorization instead.");
      }
      
      console.log(`List optimized using ${wasAIProcessed ? 'AI' : 'local processing'}`);
    } catch (error) {
      console.error("Error calling optimization API:", error);
      setError("Could not process your list online. Using local processing instead.");
      
      // Fallback to completely local processing if API fails
      const storeForProcessing = availableStores.find(s => s.id === selectedStoreId)?.name || 'default';
      const processedItems = processShoppingList(rawText, storeForProcessing as any);
      setOptimizedItems(processedItems);
      setIsOptimized(true);
      setShowForm(false); // Hide form after successful optimization
      setIsAIProcessed(false);
    } finally {
      setIsLoading(false);
    }
  }, [rawText, selectedStoreId, availableStores, userId, listName]);

  // Define handleReset first
  const handleReset = useCallback(() => {
    setOptimizedItems([]);
    setIsOptimized(false);
    setRawText('');
    setError(null);
    setIsAIProcessed(false);
    setShowForm(true); // Show form when resetting
  }, []);
  
  const toggleFormVisibility = useCallback(() => {
    // When showing the form in an optimized state, we want to keep optimization active
    setShowForm(prev => !prev);
  }, []);
  
  // Reset showForm when isOptimized changes
  useEffect(() => {
    // When optimization completed, hide the form
    if (isOptimized) {
      setShowForm(false);
    } else {
      // When optimization is reset, always show the form
      setShowForm(true);
    }
  }, [isOptimized]);

  const handleToggleItem = useCallback((itemId: string) => {
    setOptimizedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, purchased: !item.purchased }
          : item
      )
    );
  }, []);
  
  const handleDeleteItem = useCallback((itemId: string) => {
    setOptimizedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);
  
  // Check if all items are purchased and auto-reset after a delay
  useEffect(() => {
    if (optimizedItems.length > 0 && optimizedItems.every(item => item.purchased)) {
      // Wait 3 seconds to show the congratulations message before resetting
      const timer = setTimeout(() => {
        // Only auto-reset if all items are still purchased after the delay
        if (optimizedItems.every(item => item.purchased)) {
          handleReset();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [optimizedItems, handleReset]);

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

      {/* Full-page loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FullPageLoader 
              message="Оптимизируем ваш маршрут..."
              subMessage="Мы группируем товары и создаем оптимальный путь по магазину"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="container mx-auto px-4 py-8 space-y-8 relative">
        <AIStatus isActive={isAIProcessed} aiModel="Gemini" />
        
        {/* Сообщение об ошибке */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {/* Форма ввода - показываем когда не оптимизировано или явно запрошено */}
          {showForm && !isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              key="shopping-form"
              className="mb-8"
            >
              <ShoppingListForm
                rawText={rawText}
                setRawText={setRawText}
                onOptimize={handleOptimize}
                isOptimized={isOptimized}
                userId={userId}
                setUserId={setUserId}
                listName={listName}
                setListName={setListName}
                availableStores={availableStores}
                onAddStore={handleAddStore}
                selectedStoreId={selectedStoreId}
                setSelectedStoreId={setSelectedStoreId}
                isLoading={isLoading}
                onReset={handleReset}
              />
            </motion.div>
          )}
  
          {/* Оптимизированный список */}
          {isOptimized && optimizedItems.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              key="optimized-list"
            >
              <OptimizedListView
                items={optimizedItems}
                storeType={availableStores.find(s => s.id === selectedStoreId)?.name || selectedStoreId as any}
                onToggleItem={handleToggleItem}
                onDeleteItem={handleDeleteItem}
                onReset={handleReset}
                isAIProcessed={isAIProcessed}
                onToggleForm={toggleFormVisibility}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Пустое состояние */}
          {isOptimized && optimizedItems.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              key="empty-state"
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg">
                Список покупок пуст. Добавьте товары для оптимизации маршрута.
              </div>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <ListPlus className="h-5 w-5 mr-2" />
                Создать новый список
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Информационные карточки */}
        <AnimatePresence>
          {!isOptimized && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              key="info-cards"
              className="grid md:grid-cols-3 gap-6 mt-12"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
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
