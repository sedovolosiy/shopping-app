'use client';

import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { ShoppingItem } from '@/lib/types';
import { processShoppingList, categorizeItem, getCategoryOrder } from '@/lib/store-data';
import MainClientContent from "./MainClientContent";
import InstallPrompt from '@/components/install-prompt';
import OrientationHandler from '@/components/orientation-handler';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import DeviceProvider, { useDevice, DeviceRender } from '@/components/device-detector';
import ErrorDisplay from '@/components/error-display';
import { ErrorInfo, handleError, useErrorHandler, withRetry, ErrorCodes } from '@/lib/error-handling';

// Dynamic imports for heavy components
const ShoppingListForm = lazy(() => import('@/components/shopping-list-form'));
const OptimizedListView = lazy(() => import('@/components/optimized-list-view'));
const UserLogin = lazy(() => import('@/components/user-login'));
const SavedListsView = lazy(() => import('@/components/saved-lists-view'));
const MobileBottomNavigation = lazy(() => import('@/components/mobile-bottom-navigation'));
const MobileDrawer = lazy(() => import('@/components/mobile-drawer'));
const TabletLayout = lazy(() => import('@/components/tablet-layout'));
const DesktopLayout = lazy(() => import('@/components/desktop-layout'));
const DesktopMainContent = lazy(() => import('@/components/desktop-main-content'));

// Loading component
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
  </div>
);

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
  const { handleErrorWithFeedback } = useErrorHandler();
  
  // Mobile UI state
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState<boolean>(false);
  
  // Main app state
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  // Shopping list state
  const [rawText, setRawText] = useState<string>('');
  const [optimizedItems, setOptimizedItems] = useState<ShoppingItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
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
      const errorInfo = handleErrorWithFeedback(error);
      setError(errorInfo);
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
      const mockNewStore = { id: `mock-${Date.now()}`, name: storeName };
      setAvailableStores(prev => [...prev, mockNewStore]);
      setSelectedStoreId(mockNewStore.id);
      return mockNewStore;
    }
  }, []);

  const handleOptimize = useCallback(async (currentUserIdParam?: string, currentListName?: string) => {
    if (!rawText.trim()) return;
    

    
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
          const { category, categoryOrder } = await categorizeItem(itemText, storeCode);
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
        setError({
          message: "ИИ-обработка недоступна. Используется базовая категоризация.",
          code: ErrorCodes.AI_UNAVAILABLE,
          type: 'system',
          retryable: false,
        });
      }
      
      // Show feedback based on action taken
      const actionType = apiResponse.metadata?.action || (isEditingExistingList ? 'updated' : 'created');
      
      // Show success message if list was updated
      if (actionType === 'updated') {
        // Clear any previous errors since update was successful
        setError(null);
      }
    } catch (error) {
      setError({
        message: "Не удалось обработать список онлайн. Используется локальная обработка.",
        code: ErrorCodes.API_UNAVAILABLE,
        type: 'network',
        retryable: true,
      });
      
      // Fallback to completely local processing if API fails
      const storeForProcessing = availableStores.find(s => s.id === selectedStoreId)?.name?.toLowerCase() || 'default';
      let processedItems = await processShoppingList(rawText, storeForProcessing as any);
      if (!Array.isArray(processedItems)) {
        processedItems = processedItems ? [processedItems] : [];
      }
      // Категоризация и порядок категории для каждого продукта (асинхронно)
      const normalizedItems = await Promise.all(processedItems.map(async (item: any, idx: number) => {
        const itemText = item.normalizedText || item.originalText || item.name || '';
        const { category, categoryOrder } = await categorizeItem(itemText, storeForProcessing); // always lowercase
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

    // Always set selectedStoreId to the ID from the saved list.
    // The useEffect for currentStoreName will handle resolving the name
    // once availableStores is populated.
    setSelectedStoreId(savedStoreId);

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

  // Error handling functions
  const handleRetryError = useCallback(() => {
    if (error?.retryable) {
      setError(null);
      // Retry the last operation based on current app state
      switch (appState) {
        case AppState.CREATE_NEW:
          if (rawText.trim()) {
            handleOptimize();
          }
          break;
        case AppState.SAVED_LISTS:
          loadSavedLists();
          break;
        default:
          // For other states, just clear the error
          break;
      }
    }
  }, [error, appState, rawText, handleOptimize, loadSavedLists]);

  const handleDismissError = useCallback(() => {
    setError(null);
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
        // Update saved lists
        loadSavedLists();
      } else {
        throw new Error(data.message || 'Failed to delete list');
      }
    } catch (error) {
      const errorInfo = handleErrorWithFeedback(error);
      setError(errorInfo);
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
  const handleItemCheck = useCallback(async (itemId: string) => {
    // First, find the current item to determine the new status
    const currentItem = optimizedItems.find(item => item.id === itemId);
    if (!currentItem) {
      return;
    }
    
    const newPurchasedStatus = !currentItem.purchased;
    
    // Update the UI optimistically
    setOptimizedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, purchased: newPurchasedStatus };
        }
        return item;
      })
    );
    
    // Then update the database
    try {
      const response = await fetch('/api/shopping-list/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itemId, 
          purchased: newPurchasedStatus 
        }),
      });
      
      const data = await response.json();
      if (!data.success) {
        // Revert the UI change if the API call failed
        setOptimizedItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId
              ? { ...item, purchased: !newPurchasedStatus }
              : item
          )
        );
      }
    } catch (error) {
      // Revert the UI change if the API call failed
      setOptimizedItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, purchased: !newPurchasedStatus }
            : item
        )
      );
    }
  }, [optimizedItems]);
  
  const handleLoadList = useCallback((list: any) => {
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
        return (
          <Suspense fallback={<ComponentLoader />}>
            <UserLogin onUserSelect={handleAuthenticate} />
          </Suspense>
        );
      
      case AppState.SAVED_LISTS:
        return (
          <Suspense fallback={<ComponentLoader />}>
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
          </Suspense>
        );
      
      case AppState.CREATE_NEW:
        return (
          <Suspense fallback={<ComponentLoader />}>
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
          </Suspense>
        );
      
      case AppState.OPTIMIZED:
        // Find the current listId from savedLists if possible
        let currentListId = null;
        // Try to find by matching items and name (fallback if needed)
        if (isEditingExistingList && savedLists.length > 0 && listName) {
          const found = savedLists.find(l => l.name === listName && l.items.length === optimizedItems.length);
          if (found) currentListId = found.id;
        } else if (savedLists.length > 0 && optimizedItems.length > 0) {
          // fallback: find by items
          const found = savedLists.find(l => l.items.length === optimizedItems.length && l.items.every((item: ShoppingItem, idx: number) => item.name === optimizedItems[idx].name));
          if (found) currentListId = found.id;
        }
        // fallback: if optimizedItems[0] has listId
        if (!currentListId && optimizedItems[0] && optimizedItems[0].listId) {
          currentListId = optimizedItems[0].listId;
        }
        // fallback: if savedLists[0] exists
        if (!currentListId && savedLists.length > 0) {
          currentListId = savedLists[0].id;
        }
        return (
          <Suspense fallback={<ComponentLoader />}>
            <OptimizedListView
              items={optimizedItems}
              storeName={currentStoreName}
              onToggleItem={handleItemCheck}
              onReset={handleReset}
              isAIProcessed={isAIProcessed}
              onToggleForm={() => setShowForm(!showForm)}
              listId={currentListId}
              onStatusChange={loadSavedLists} // call to refresh saved lists after PATCH
            />
          </Suspense>
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
            <div className="mobile-main-container" style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>
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
                onRetryError={handleRetryError}
                onDismissError={handleDismissError}
              />
              
              {/* Only show bottom navigation when user is logged in */}
              {appState !== AppState.LOGIN && (
                <Suspense fallback={<ComponentLoader />}>
                  <MobileBottomNavigation 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange}
                  />
                </Suspense>
              )}
            </div>
          }
          tablet={
            <Suspense fallback={<ComponentLoader />}>
              <TabletLayout
                activeTab={activeTab}
                onChangeTab={handleTabChange}
                onOpenSettings={() => setIsSettingsDrawerOpen(true)}
                currentUserId={currentUserId}
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
                  onRetryError={handleRetryError}
                  onDismissError={handleDismissError}
                />
              </TabletLayout>
            </Suspense>
          }
          desktop={
            <Suspense fallback={<ComponentLoader />}>
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
                  onRetryError={handleRetryError}
                  onDismissError={handleDismissError}
                />
              </DesktopLayout>
            </Suspense>
          }
          default={
            <div className="mobile-main-container">
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
                onRetryError={handleRetryError}
                onDismissError={handleDismissError}
              />
            </div>
          }
        />
        
        {/* Settings drawer */}
        <Suspense fallback={<ComponentLoader />}>
          <MobileDrawer
            isOpen={isSettingsDrawerOpen}
            onClose={() => setIsSettingsDrawerOpen(false)}
            title="Настройки"
            position="right"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 text-sm">Тёмная тема</span>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === 'dark' ? 
                    <Sun className="h-4 w-4 text-yellow-400" /> : 
                    <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  }
                </button>
              </div>
              
              {/* More settings would go here */}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {currentUserId && (
                  <div className="w-full">
                    <button 
                      onClick={() => {
                        setCurrentUserId('');
                        setAppState(AppState.LOGIN);
                        setIsSettingsDrawerOpen(false);
                      }}
                      className="w-full px-3 py-2.5 text-red-500 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      Выйти из аккаунта
                    </button>
                  </div>
                )}
              </div>
            </div>
          </MobileDrawer>
        </Suspense>
        
        {/* App installation prompt */}
        <InstallPrompt />
      </OrientationHandler>
    </DeviceProvider>
  );
}
