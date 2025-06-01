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
import UserLogin from '@/components/user-login';
import SavedListsView from '@/components/saved-lists-view';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';

// Define the Store interface expected by ShoppingListForm and for availableStores
interface Store {
  id: string;
  name: string;
}

// App state enum for better state management
enum AppState {
  LOGIN = 'login',
  SAVED_LISTS = 'saved_lists',
  CREATE_NEW = 'create_new',
  OPTIMIZED = 'optimized'
}

export default function HomePage() {
  // Main app state
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  // Shopping list state
  const [rawText, setRawText] = useState<string>('');
  const [optimizedItems, setOptimizedItems] = useState<ShoppingItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAIProcessed, setIsAIProcessed] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(true); // Control form visibility

  // New state variables required by ShoppingListForm
  const [listName, setListName] = useState<string>('');
  const [availableStores, setAvailableStores] = useState<Store[]>([]); // Initialize as empty array
  const [selectedStoreId, setSelectedStoreId] = useState<string>(''); // For the Select component in the form
  const [isEditingExistingList, setIsEditingExistingList] = useState<boolean>(false); // Track if we're editing an existing list
  
  // Saved lists state
  const [savedLists, setSavedLists] = useState<any[]>([]);
  const [isLoadingSavedLists, setIsLoadingSavedLists] = useState<boolean>(false);

  // Load available stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      // Don't refetch if stores are already loaded
      if (availableStores.length > 0) {
        console.log('Stores already loaded, skipping fetch');
        return;
      }
      
      try {
        // Import here to avoid circular dependencies
        const { getStores } = await import('@/lib/api-client');
        
        const stores = await getStores();
        console.log('Fetched stores:', stores);
        setAvailableStores(stores);
        
        // Only set default store if no store is currently selected
        if (stores.length > 0 && !selectedStoreId) {
          console.log('Setting default store to:', stores[0].id);
          setSelectedStoreId(stores[0].id);
        } else {
          console.log('Keeping current selectedStoreId:', selectedStoreId);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        // Create some default stores if API fails
        const defaultStores = [
          { id: 'lidl', name: 'Lidl' },
          { id: 'biedronka', name: 'Biedronka' },
          { id: 'aldi', name: 'Aldi' }
        ];
        console.log('Using default stores:', defaultStores);
        setAvailableStores(defaultStores);
        // Only set default if no store selected
        if (!selectedStoreId) {
          setSelectedStoreId(defaultStores[0].id);
        }
      }
    };
    
    if (appState === AppState.CREATE_NEW || appState === AppState.OPTIMIZED) {
      fetchStores();
    }
  }, [appState, selectedStoreId, availableStores.length]);

  // Load saved lists when user is selected
  const loadSavedLists = useCallback(async () => {
    if (!currentUserId) return;
    
    setIsLoadingSavedLists(true);
    try {
      const { getUserShoppingLists } = await import('@/lib/api-client');
      const lists = await getUserShoppingLists(currentUserId);
      setSavedLists(lists);
    } catch (error) {
      console.error('Error loading saved lists:', error);
      setError('Не удалось загрузить сохранённые списки');
    } finally {
      setIsLoadingSavedLists(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (appState === AppState.SAVED_LISTS) {
      loadSavedLists();
    }
  }, [appState, loadSavedLists]);

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

  const handleOptimize = useCallback(async (currentUserIdParam?: string, currentListName?: string) => {
    if (!rawText.trim()) return;
    
    console.log('=== OPTIMIZE DEBUG ===');
    console.log('selectedStoreId:', selectedStoreId);
    console.log('currentUserId:', currentUserId);
    console.log('listName:', listName);
    console.log('isEditingExistingList:', isEditingExistingList);
    console.log('availableStores:', availableStores);
    console.log('selectedStore object:', availableStores.find(s => s.id === selectedStoreId));
    console.log('About to send storeId to API:', selectedStoreId);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Import here to avoid circular dependencies
      const { processShoppingListWithAPI } = await import('@/lib/api-client');
      
      // Try to use the API for processing (with AI if available)
      const apiResponse = await processShoppingListWithAPI(
        rawText,
        currentUserIdParam || currentUserId,
        currentListName || listName,
        selectedStoreId
      );
      
      // API returns items in the correct format
      setOptimizedItems(apiResponse.items);
      setIsOptimized(true);
      setAppState(AppState.OPTIMIZED);
      
      // Hide form after successful optimization
      setShowForm(false);
      
      // Reset editing flag after successful update
      setIsEditingExistingList(false);
      
      // Update AI processing status
      // Check if metadata exists and has processedWith
      const wasAIProcessed = apiResponse.metadata && apiResponse.metadata.processedWith === 'ai';
      setIsAIProcessed(Boolean(wasAIProcessed));
      
      // Check if AI was used and show a message if not
      if (!wasAIProcessed) {
        setError("AI processing wasn't available. Using basic categorization instead.");
      }
      
      // Show feedback based on action taken
      const actionType = apiResponse.metadata?.action || (isEditingExistingList ? 'updated' : 'created');
      console.log(`List ${actionType} using ${wasAIProcessed ? 'AI' : 'local processing'}`);
      
      // Show success message if list was updated
      if (actionType === 'updated') {
        // Clear any previous errors since update was successful
        setError(null);
      }
    } catch (error) {
      console.error("Error calling optimization API:", error);
      setError("Could not process your list online. Using local processing instead.");
      
      // Fallback to completely local processing if API fails
      const storeForProcessing = availableStores.find(s => s.id === selectedStoreId)?.name || 'default';
      const processedItems = processShoppingList(rawText, storeForProcessing as any);
      setOptimizedItems(processedItems);
      setIsOptimized(true);
      setAppState(AppState.OPTIMIZED);
      
      // Hide form after successful optimization
      setShowForm(false);
      
      // Reset editing flag after successful update
      setIsEditingExistingList(false);
      
      setIsAIProcessed(false);
    } finally {
      setIsLoading(false);
    }
  }, [rawText, selectedStoreId, availableStores, currentUserId, listName, isEditingExistingList]);

  // Define handleReset first
  const handleReset = useCallback(() => {
    setOptimizedItems([]);
    setIsOptimized(false);
    setRawText('');
    setError(null);
    setIsAIProcessed(false);
    setIsEditingExistingList(false);
    setAppState(AppState.CREATE_NEW);
  }, []);
  
  // Helper function to convert optimized items back to raw text
  const convertItemsToRawText = useCallback((items: ShoppingItem[]): string => {
    return items.map(item => item.originalText || item.name).join('\n');
  }, []);

  const toggleFormVisibility = useCallback(() => {
    // When showing the form in an optimized state, populate it with current items
    if (!showForm && isOptimized && optimizedItems.length > 0) {
      const textFromItems = convertItemsToRawText(optimizedItems);
      console.log('Populating form with existing items:', textFromItems);
      console.log('Current store ID should be:', selectedStoreId);
      setRawText(textFromItems);
      setIsEditingExistingList(true); // Mark as editing existing list
      // Note: selectedStoreId should already be set correctly from the optimized list
    } else {
      setIsEditingExistingList(false); // Reset when hiding form
    }
    setShowForm(prev => !prev);
  }, [showForm, isOptimized, optimizedItems, convertItemsToRawText, selectedStoreId]);

  // Event handlers for app navigation
  const handleUserLogin = useCallback((userId: string) => {
    setCurrentUserId(userId);
    setAppState(AppState.SAVED_LISTS);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUserId('');
    setSavedLists([]);
    setOptimizedItems([]);
    setIsOptimized(false);
    setRawText('');
    setError(null);
    setIsAIProcessed(false);
    setIsEditingExistingList(false);
    setAppState(AppState.LOGIN);
  }, []);

  const handleCreateNew = useCallback(() => {
    setRawText('');
    setListName('');
    setOptimizedItems([]);
    setIsOptimized(false);
    setError(null);
    setIsAIProcessed(false);
    setIsEditingExistingList(false);
    setAppState(AppState.CREATE_NEW);
  }, []);

  const handleSelectSavedList = useCallback((list: any) => {
    // Convert saved list to current format
    setOptimizedItems(list.items.map((item: any) => ({
      ...item,
      purchased: false // Reset purchased status
    })));
    setIsOptimized(true);
    setIsAIProcessed(true); // Assume saved lists were AI processed
    setListName(list.name);
    
    // Set the correct store ID from the saved list
    // In the database, storeId is saved in the storeType field
    const savedStoreId = list.storeType || list.storeId;
    console.log('=== LOADING SAVED LIST ===');
    console.log('list.storeType:', list.storeType);
    console.log('list.storeId:', list.storeId);
    console.log('Setting store from saved list:', savedStoreId);
    console.log('Available stores:', availableStores);
    
    // Verify that the store exists in our available stores
    const storeExists = availableStores.find(s => s.id === savedStoreId);
    if (storeExists) {
      console.log('Found matching store:', storeExists);
      setSelectedStoreId(savedStoreId);
    } else {
      console.warn('Store not found in available stores, setting to first available');
      if (availableStores.length > 0) {
        setSelectedStoreId(availableStores[0].id);
      }
    }
    
    // Reset editing flag when selecting saved list (this will be a fresh load)
    setIsEditingExistingList(false);
    
    setAppState(AppState.OPTIMIZED);
  }, [availableStores]);

  const handleRefreshSavedLists = useCallback(() => {
    loadSavedLists();
  }, [loadSavedLists]);
  
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

  // Render different views based on app state
  const renderCurrentView = () => {
    switch (appState) {
      case AppState.LOGIN:
        return (
          <UserLogin 
            onUserSelect={handleUserLogin} 
            isLoading={isLoading} 
          />
        );

      case AppState.SAVED_LISTS:
        return (
          <SavedListsView
            userId={currentUserId}
            savedLists={savedLists}
            isLoading={isLoadingSavedLists}
            onSelectList={handleSelectSavedList}
            onCreateNew={handleCreateNew}
            onLogout={handleLogout}
            onRefresh={handleRefreshSavedLists}
          />
        );

      case AppState.CREATE_NEW:
        return (
          <div className="space-y-8">
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
                userId={currentUserId}
                setUserId={setCurrentUserId}
                listName={listName}
                setListName={setListName}
                availableStores={availableStores}
                onAddStore={handleAddStore}
                selectedStoreId={selectedStoreId}
                setSelectedStoreId={setSelectedStoreId}
                isLoading={isLoading}
                onReset={handleReset}
                isEditingExistingList={isEditingExistingList}
              />
            </motion.div>
          </div>
        );

      case AppState.OPTIMIZED:
        return (
          <div className="space-y-8">
            {/* Show form if toggled */}
            {showForm && (
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
                  userId={currentUserId}
                  setUserId={setCurrentUserId}
                  listName={listName}
                  setListName={setListName}
                  availableStores={availableStores}
                  onAddStore={handleAddStore}
                  selectedStoreId={selectedStoreId}
                  setSelectedStoreId={setSelectedStoreId}
                  isLoading={isLoading}
                  onReset={handleReset}
                  isEditingExistingList={isEditingExistingList}
                />
              </motion.div>
            )}

            {/* Optimized list */}
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
          </div>
        );

      default:
        return null;
    }
  };

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
        {(appState === AppState.CREATE_NEW || appState === AppState.OPTIMIZED) && (
          <AIStatus isActive={isAIProcessed} aiModel="Gemini" />
        )}
        
        {/* Сообщение об ошибке */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {!isLoading && renderCurrentView()}
        </AnimatePresence>

        <AnimatePresence>
          {/* Пустое состояние */}
          {appState === AppState.OPTIMIZED && isOptimized && optimizedItems.length === 0 && !isLoading && (
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
          {appState === AppState.CREATE_NEW && !isOptimized && !isLoading && (
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
