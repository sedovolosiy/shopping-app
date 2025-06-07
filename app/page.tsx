'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingItem } from '@/lib/types';
import { processShoppingList, categorizeItem, getCategoryOrder } from '@/lib/store-data';
import ShoppingListForm from '@/components/shopping-list-form';
import OptimizedListView from '@/components/optimized-list-view';
import UserLogin from '@/components/user-login';
import SavedListsView from '@/components/saved-lists-view';
import MainClientContent from "./MainClientContent";
import MobileBottomNavigation from '@/components/mobile-bottom-navigation';
import MobileDrawer from '@/components/mobile-drawer';
import MobileFilter from '@/components/mobile-filter';
import InstallPrompt from '@/components/install-prompt';
import OrientationHandler from '@/components/orientation-handler';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import DeviceProvider, { useDevice, DeviceRender } from '@/components/device-detector';
import TabletLayout from '@/components/tablet-layout';
import DesktopLayout from '@/components/desktop-layout';
import DesktopMainContent from '@/components/desktop-main-content';

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
  // Theme state
  const { theme, setTheme } = useTheme();
  
  // Mobile UI state
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState<boolean>(false);
  
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
  const [showForm, setShowForm] = useState<boolean>(true);

  // Form state variables
  const [listName, setListName] = useState<string>('');
  const [availableStores, setAvailableStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [isEditingExistingList, setIsEditingExistingList] = useState<boolean>(false);
  const [currentStoreName, setCurrentStoreName] = useState<string>('Загрузка магазина...');

  // Saved lists state
  const [savedLists, setSavedLists] = useState<any[]>([]);
  const [isLoadingSavedLists, setIsLoadingSavedLists] = useState<boolean>(false);

  // AI toggle state
  const [useAI, setUseAI] = useState<boolean>(true);
  
  // Filter state
  const [appliedFilters, setAppliedFilters] = useState<any>({
    sortOption: 'category',
    showCompleted: true,
    selectedCategories: [],
    priceRange: [0, 5000]
  });

  // Handle bottom navigation tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case "home":
        // If logged in, show saved lists. Otherwise, show login
        if (currentUserId) {
          setAppState(AppState.SAVED_LISTS);
        } else {
          setAppState(AppState.LOGIN);
        }
        break;
      case "new":
        setAppState(AppState.CREATE_NEW);
        break;
      case "cart":
        // If there are optimized items, show them. Otherwise, create a new list
        if (optimizedItems.length > 0) {
          setAppState(AppState.OPTIMIZED);
        } else {
          setAppState(AppState.CREATE_NEW);
        }
        break;
      case "settings":
        setIsSettingsDrawerOpen(true);
        break;
    }
  };
  
  // Handle filter application
  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    // Additional logic to filter optimizedItems would go here
  };

  // Load available stores on component mount
  useEffect(() => {
    const fetchStoresLogic = async () => {
      if (availableStores.length === 0) {
        try {
          const { getStores } = await import('@/lib/api-client');
          const fetchedStores = await getStores();
          setAvailableStores(fetchedStores);

          if (fetchedStores.length > 0 && !selectedStoreId && appState === AppState.CREATE_NEW) {
            setSelectedStoreId(fetchedStores[0].id);
          }
        } catch (error) {
          console.error('Error fetching stores, using fallback:', error);
          const defaultStoresOnError = [
            { id: 'lidl', name: 'Lidl' },
            { id: 'biedronka', name: 'Biedronka' },
            { id: 'aldi', name: 'Aldi' }
          ];
          setAvailableStores(defaultStoresOnError);
          
          if (defaultStoresOnError.length > 0 && !selectedStoreId && appState === AppState.CREATE_NEW) {
            setSelectedStoreId(defaultStoresOnError[0].id);
          }
        }
      } else {
        if (appState === AppState.CREATE_NEW && !selectedStoreId && availableStores.length > 0) {
          setSelectedStoreId(availableStores[0].id);
        }
      }
    };

    // Trigger the logic if app is in a state that requires stores
    if (appState === AppState.CREATE_NEW || appState === AppState.OPTIMIZED) {
      fetchStoresLogic();
    }
  }, [appState, selectedStoreId, availableStores.length]);

  // Update current store name when selection changes
  useEffect(() => {
    if (selectedStoreId && availableStores.length > 0) {
      const store = availableStores.find(s => s.id === selectedStoreId);
      setCurrentStoreName(store ? store.name : 'Магазин не найден');
    } else if (availableStores.length === 0 && selectedStoreId) {
      setCurrentStoreName('Загрузка списка магазинов...');
    } else if (!selectedStoreId) {
      setCurrentStoreName('Магазин не выбран');
    }
  }, [selectedStoreId, availableStores]);
  
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
    try {
      const { addStore } = await import('@/lib/api-client');
      
      const newStore = await addStore(storeName);
      setAvailableStores(prev => [...prev, newStore]);
      setSelectedStoreId(newStore.id);
      return newStore;
    } catch (error) {
      console.error('Error adding store:', error);
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
      let apiResponse;
      if (useAI) {
        // Обычный вызов API с AI
        apiResponse = await processShoppingListWithAPI(
          rawText,
          currentUserIdParam || currentUserId,
          currentListName || listName,
          selectedStoreId
        );
      } else {
        // Локальная обработка без AI
        const storeForProcessing = availableStores.find(s => s.id === selectedStoreId)?.name || 'default';
        let processedItems = await processShoppingList(rawText, storeForProcessing as any);
        if (!Array.isArray(processedItems)) {
          processedItems = processedItems ? [processedItems] : [];
        }
        // Получаем storeCode для категоризации (например, 'biedronka', 'lidl')
        let storeCode = 'default';
        const selectedStoreObj = availableStores.find(s => s.id === selectedStoreId);
        if (selectedStoreObj) {
          storeCode = (selectedStoreObj.name || 'default').toLowerCase();
        }
        // Категоризация и порядок категории для каждого продукта (асинхронно)
        const normalizedItems = await Promise.all(processedItems.map(async (item: any, idx: number) => {
          const itemText = item.normalizedText || item.originalText || item.name || '';
          // Логируем входные данные для категоризации
          console.log('[LOCAL Fallback] Item:', item);
          console.log('[LOCAL Fallback] itemText:', itemText);
          console.log('[LOCAL Fallback] storeCode (lowercase):', storeCode);
          const { category, categoryOrder } = await categorizeItem(itemText, storeCode);
          console.log('[LOCAL Fallback] category:', category);
          console.log('[LOCAL Fallback] categoryOrder:', categoryOrder);
          return {
            id: `local-${idx}`,
            name: itemText,
            originalText: item.originalText || item.name || '',
            category,
            categoryOrder: typeof categoryOrder === 'number' ? categoryOrder : 0,
            quantity: item.quantity || '1',
            unit: item.unit || 'unit',
            language: item.language || 'ru',
            purchased: false,
          };
        }));
        setOptimizedItems(normalizedItems);
        setIsOptimized(true);
        setAppState(AppState.OPTIMIZED);
        setShowForm(false);
        setIsEditingExistingList(false);
        setIsAIProcessed(false);
        setIsLoading(false);
        return;
      }
      
      // API returns items in the correct format
      setOptimizedItems(apiResponse.items);
      setIsOptimized(true);
      setAppState(AppState.OPTIMIZED);
      setShowForm(false);
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
      const storeForProcessing = availableStores.find(s => s.id === selectedStoreId)?.name?.toLowerCase() || 'default';
      let processedItems = await processShoppingList(rawText, storeForProcessing as any);
      if (!Array.isArray(processedItems)) {
        processedItems = processedItems ? [processedItems] : [];
      }
      // Категоризация и порядок категории для каждого продукта (асинхронно)
      const normalizedItems = await Promise.all(processedItems.map(async (item: any, idx: number) => {
        const itemText = item.normalizedText || item.originalText || item.name || '';
        // Логируем входные данные для категоризации
        console.log('[LOCAL Fallback] Item:', item);
        console.log('[LOCAL Fallback] itemText:', itemText);
        console.log('[LOCAL Fallback] storeForProcessing:', storeForProcessing);
        const { category, categoryOrder } = await categorizeItem(itemText, storeForProcessing); // always lowercase
        console.log('[LOCAL Fallback] category:', category);
        console.log('[LOCAL Fallback] categoryOrder:', categoryOrder);
        return {
          id: `local-${idx}`,
          name: itemText,
          originalText: item.originalText || item.name || '',
          category,
          categoryOrder: typeof categoryOrder === 'number' ? categoryOrder : 0,
          quantity: item.quantity || '1',
          unit: item.unit || 'unit',
          language: item.language || 'ru',
          purchased: false,
        };
      }));
      setOptimizedItems(normalizedItems);
      setIsOptimized(true);
      setAppState(AppState.OPTIMIZED);
      setShowForm(false);
      setIsEditingExistingList(false);
      setIsAIProcessed(false);
    } finally {
      setIsLoading(false);
    }
  }, [rawText, selectedStoreId, availableStores, currentUserId, listName, isEditingExistingList, useAI]);

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
    // Reset selected store to default or first available when creating a new list
    if (availableStores.length > 0) {
      setSelectedStoreId(availableStores[0].id);
    } else {
      setSelectedStoreId(''); // Or handle case where no stores are available
    }
    setOptimizedItems([]);
    setIsOptimized(false);
    setError(null);
    setIsAIProcessed(false);
    setIsEditingExistingList(false);
    setAppState(AppState.CREATE_NEW);
  }, [availableStores]);

  const handleSelectSavedList = useCallback((list: any) => {
    // Convert saved list to current format
    setOptimizedItems(list.items.map((item: any) => ({
      ...item,
      purchased: false // Reset purchased status
    })));
    setIsOptimized(true);
    setIsAIProcessed(true); // Assume saved lists were AI processed
    setListName(list.name);
    
    const savedStoreId = list.storeId; // e.g., Lidl's ID
    console.log('=== LOADING SAVED LIST (Revised Logic) ===');
    console.log('list.storeId from saved list:', savedStoreId);
    console.log('Current availableStores when selecting list:', availableStores);

    // Always set selectedStoreId to the ID from the saved list.
    // The useEffect for currentStoreName will handle resolving the name
    // once availableStores is populated.
    setSelectedStoreId(savedStoreId);
    console.log('Set selectedStoreId directly to:', savedStoreId);

    // Optional: Log a warning if stores are loaded but the specific ID isn't found yet,
    // or if stores are not loaded yet. The name will update reactively.
    if (availableStores.length > 0) {
      const storeExistsNow = availableStores.find(s => s.id === savedStoreId);
      if (!storeExistsNow) {
        console.warn(`Store with ID ${savedStoreId} not found in currently loaded availableStores. Name should update once stores fully sync or if ID is valid.`);
      }
    } else {
      console.log('Available stores are currently empty. Store name will update after stores load, using selectedStoreId:', savedStoreId);
    }
    
    setIsEditingExistingList(false);
    setAppState(AppState.OPTIMIZED); // Switch state after all updates
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

  const deleteList = useCallback(async (listId: string) => {
    if (!currentUserId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/shopping-list?listId=${listId}&userId=${currentUserId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete list');
      }

      if (data.success) {
        // Show success result and update the list
        console.log('[DELETE] List deleted successfully:', data.metadata);
        // Update saved lists
        loadSavedLists();
      } else {
        throw new Error(data.message || 'Failed to delete list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete list');
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, loadSavedLists]);

  // Update activeTab based on appState
  useEffect(() => {
    switch (appState) {
      case AppState.LOGIN:
      case AppState.SAVED_LISTS:
        setActiveTab("home");
        break;
      case AppState.CREATE_NEW:
        setActiveTab("new");
        break;
      case AppState.OPTIMIZED:
        setActiveTab("cart");
        break;
    }
  }, [appState]);
  
  // Handle authenticate - update to set active tab
  const handleAuthenticate = useCallback((userId: string) => {
    setCurrentUserId(userId);
    setAppState(AppState.SAVED_LISTS);
    setActiveTab("home");
  }, []);

  // Main render logic for different views
  // Additional handler functions for mobile UI
  const handleItemCheck = useCallback((itemId: string) => {
    setOptimizedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
    );
  }, []);
  
  const handleLoadList = useCallback((list: any) => {
    // Implementation would go here
    console.log("Loading list", list);
    
    // Set form values
    setRawText(list.rawText || '');
    setListName(list.name || '');
    setSelectedStoreId(list.storeId || '');
    setIsEditingExistingList(true);
    
    // If list has items, set them
    if (list.items && list.items.length > 0) {
      setOptimizedItems(list.items);
      setIsOptimized(true);
      setAppState(AppState.OPTIMIZED);
    } else {
      setAppState(AppState.CREATE_NEW);
    }
  }, []);

  const handleCreateNewList = useCallback(() => {
    setAppState(AppState.CREATE_NEW);
    setRawText('');
    setListName('');
    setIsEditingExistingList(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    if (isEditingExistingList) {
      setAppState(AppState.SAVED_LISTS);
    }
    // If not editing an existing list, there's nowhere to go back to
  }, [isEditingExistingList]);
  
  const renderCurrentView = useCallback(() => {
    switch (appState) {
      case AppState.LOGIN:
        return <UserLogin onUserSelect={handleAuthenticate} />;
      
      case AppState.SAVED_LISTS:
        return (
          <SavedListsView
            userId={currentUserId}
            savedLists={savedLists}
            isLoading={isLoadingSavedLists}
            onSelectList={handleLoadList}
            onCreateNew={handleCreateNewList}
            onLogout={() => {
              setCurrentUserId('');
              setAppState(AppState.LOGIN);
            }}
            onRefresh={loadSavedLists}
          />
        );
      
      case AppState.CREATE_NEW:
        return (
          <ShoppingListForm
            rawText={rawText}
            setRawText={setRawText}
            useAI={useAI}
            setUseAI={setUseAI}
            listName={listName}
            setListName={setListName}
            availableStores={availableStores}
            selectedStoreId={selectedStoreId}
            setSelectedStoreId={setSelectedStoreId}
            isEditingExistingList={isEditingExistingList}
            onAddStore={handleAddStore}
            onOptimize={handleOptimize}
            isOptimized={isOptimized}
            userId={currentUserId}
            setUserId={setCurrentUserId}
            isLoading={isLoading}
            onReset={handleCancelEdit}
          />
        );
      
      case AppState.OPTIMIZED:
        return (
          <OptimizedListView
            items={optimizedItems}
            storeName={currentStoreName}
            onToggleItem={handleItemCheck}
            onReset={handleReset}
            isAIProcessed={isAIProcessed}
            onToggleForm={() => setShowForm(!showForm)}
          />
        );
      
      default:
        return null;
    }
  }, [
    appState, 
    currentUserId, 
    rawText, 
    listName, 
    availableStores,
    selectedStoreId, 
    isEditingExistingList, 
    optimizedItems, 
    savedLists, 
    isLoadingSavedLists,
    useAI,
    currentStoreName,
    appliedFilters,
    handleAuthenticate,
    handleAddStore,
    handleOptimize
  ]);

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <DeviceProvider>
      <OrientationHandler forcePortrait={false}>
        <DeviceRender 
          mobile={
            <div className="min-h-screen">
              <MainClientContent
                appState={appState}
                isOptimized={isOptimized}
                isLoading={isLoading}
                isAIProcessed={isAIProcessed}
                error={error}
                renderCurrentView={renderCurrentView}
                handleReset={handleReset}
                showForm={showForm}
                optimizedItems={optimizedItems}
              />
              
              {/* Only show bottom navigation when user is logged in */}
              {appState !== AppState.LOGIN && (
                <MobileBottomNavigation 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange}
                  onFilterClick={() => appState === AppState.OPTIMIZED && setIsFilterDrawerOpen(true)}
                />
              )}
            </div>
          }
          tablet={
            <TabletLayout
              activeTab={activeTab}
              onChangeTab={handleTabChange}
              onOpenSettings={() => setIsSettingsDrawerOpen(true)}
            >
              <MainClientContent
                appState={appState}
                isOptimized={isOptimized}
                isLoading={isLoading}
                isAIProcessed={isAIProcessed}
                error={error}
                renderCurrentView={renderCurrentView}
                handleReset={handleReset}
                showForm={showForm}
                optimizedItems={optimizedItems}
              />
            </TabletLayout>
          }
          desktop={
            <DesktopLayout
              activeTab={activeTab}
              onChangeTab={handleTabChange}
              onOpenSettings={() => setIsSettingsDrawerOpen(true)}
              currentUserId={currentUserId}
              onLogout={() => {
                setCurrentUserId('');
                setAppState(AppState.LOGIN);
              }}
            >
              <DesktopMainContent
                appState={appState}
                isOptimized={isOptimized}
                isLoading={isLoading}
                isAIProcessed={isAIProcessed}
                error={error}
                renderCurrentView={renderCurrentView}
                handleReset={handleReset}
                showForm={showForm}
                optimizedItems={optimizedItems}
              />
            </DesktopLayout>
          }
          default={
            <div className="min-h-screen">
              <MainClientContent
                appState={appState}
                isOptimized={isOptimized}
                isLoading={isLoading}
                isAIProcessed={isAIProcessed}
                error={error}
                renderCurrentView={renderCurrentView}
                handleReset={handleReset}
                showForm={showForm}
                optimizedItems={optimizedItems}
              />
            </div>
          }
        />
        
        {/* Filter drawer for optimized shopping list */}
        <MobileDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Фильтры"
          position="bottom"
        >
          <MobileFilter 
            onApplyFilters={handleApplyFilters}
            onClose={() => setIsFilterDrawerOpen(false)}
          />
        </MobileDrawer>
        
        {/* Settings drawer */}
        <MobileDrawer
          isOpen={isSettingsDrawerOpen}
          onClose={() => setIsSettingsDrawerOpen(false)}
          title="Настройки"
          position="right"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Тёмная тема</span>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                {theme === 'dark' ? 
                  <Sun className="h-5 w-5 text-yellow-400" /> : 
                  <Moon className="h-5 w-5 text-gray-700" />
                }
              </button>
            </div>
            
            {/* More settings would go here */}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {currentUserId && (
                <button 
                  onClick={() => {
                    setCurrentUserId('');
                    setAppState(AppState.LOGIN);
                    setIsSettingsDrawerOpen(false);
                  }}
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-sm"
                >
                  Выйти
                </button>
              )}
            </div>
          </div>
        </MobileDrawer>
        
        {/* App installation prompt */}
        <InstallPrompt />
      </OrientationHandler>
    </DeviceProvider>
  );
}
