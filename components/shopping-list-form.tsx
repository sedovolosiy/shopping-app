'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Store as StoreIcon } from 'lucide-react'; // Renamed Store to StoreIcon to avoid conflict
import { useDevice } from '@/components/device-detector';

// Define a type for the store object fetched from the API
interface Store {
  id: string;
  name: string;
  // Add any other relevant store properties if needed
}

interface ShoppingListFormProps {
  rawText: string;
  setRawText: (text: string) => void;
  selectedStoreId: string; // Changed from selectedStore: StoreType
  setSelectedStoreId: (storeId: string) => void; // Changed from setSelectedStore: (store: StoreType) => void
  onOptimize: (userId: string, listName?: string) => void;
  isOptimized: boolean;
  userId: string;
  setUserId: (userId: string) => void;
  listName: string;
  setListName: (listName: string) => void;
  availableStores: Store[]; // Added prop for available stores
  onAddStore: (storeName: string) => Promise<Store | null>; // Added prop to handle adding a new store
  isLoading?: boolean; // Added to show spinner while waiting for server response
  onReset?: () => void; // Added to handle "New List" functionality
  isEditingExistingList?: boolean; // Added to show if we're editing an existing list
  useAI: boolean; // Новый проп для AI режима
  setUseAI: (v: boolean) => void; // Новый проп для управления AI
}

const ShoppingListForm: React.FC<ShoppingListFormProps> = ({
  rawText,
  setRawText,
  selectedStoreId,
  setSelectedStoreId,
  onOptimize,
  isOptimized,
  userId,
  setUserId,
  listName,
  setListName,
  availableStores,
  onAddStore,
  isLoading = false,
  onReset,
  isEditingExistingList = false,
  useAI,
  setUseAI
}) => {
  const [newStoreName, setNewStoreName] = React.useState('');
  const [isAddingStore, setIsAddingStore] = React.useState(false);
  const [addStoreError, setAddStoreError] = React.useState<string | null>(null);
  
  // Определяем тип устройства для адаптивного интерфейса
  const { isTablet, isDesktop, orientation } = useDevice();

  // Safeguard: ensure availableStores is an array.
  const currentStores = Array.isArray(availableStores) ? availableStores : [];

  const handleExampleLoad = () => {
    const exampleList = `молоко
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
    setRawText(exampleList);
  };

  const handleAddStore = async () => {
    if (!newStoreName.trim()) {
      setAddStoreError('Store name cannot be empty.'); // TODO: Localize
      return;
    }
    setIsAddingStore(true);
    setAddStoreError(null);
    try {
      const newStore = await onAddStore(newStoreName.trim());
      if (newStore) {
        setSelectedStoreId(newStore.id); // Select the newly added store
        setNewStoreName(''); // Clear the input field
      }
    } catch (error: any) {
      // Assuming onAddStore might throw an error with a message property
      setAddStoreError(error.message || 'Failed to add store. Please try again.'); // TODO: Localize
    }
    setIsAddingStore(false);
  };

  // Определяем классы в зависимости от типа устройства
  const cardClasses = isDesktop
    ? "desktop-form-clean"
    : isTablet 
      ? "screen-card w-full max-w-2xl mx-auto shadow-md tablet-form-container"
      : "screen-card w-full max-w-md mx-auto shadow-md";
    
  return (
    <Card className={cardClasses}>
      {!isDesktop ? (
        <CardHeader className="text-center bg-gradient-to-r from-primary to-accent text-white rounded-t-lg py-5">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <ShoppingCart className="h-6 w-6" />
            {isEditingExistingList ? 'Редактировать список' : 'Оптимизатор списка покупок'}
          </CardTitle>
          <CardDescription className="text-white/80 text-sm">
            {isEditingExistingList 
              ? 'Измените товары и обновите маршрут'
              : 'Введите список товаров для оптимизации'
            }
          </CardDescription>
        </CardHeader>
      ) : (
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="desktop-subheading">
                {isEditingExistingList ? 'Редактировать список' : 'Создание списка покупок'}
              </CardTitle>
              <CardDescription className="desktop-text">
                {isEditingExistingList 
                  ? 'Внесите изменения в ваш список и обновите оптимальный маршрут'
                  : 'Добавьте товары, выберите магазин и получите оптимизированный маршрут'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={`space-y-5 ${isDesktop ? 'p-4' : 'p-5'}`}>
        {isDesktop ? (
          // Desktop two-column layout
          <div className="desktop-form-grid">
            {/* Left column - Settings and configuration */}
            <div className="desktop-form-left space-y-6">
              {/* AI toggle */}
              <div className="desktop-card-section">
                <h3 className="desktop-section-title">Настройки оптимизации</h3>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <label htmlFor="ai-toggle-form" className="desktop-text font-medium text-gray-700 dark:text-blue-100">
                    Использовать AI для оптимизации:
                  </label>
                  <div className="flex items-center">
                    <div 
                      className={`desktop-toggle ${useAI ? 'desktop-toggle-on' : 'desktop-toggle-off'}`} 
                      onClick={() => setUseAI(!useAI)}
                    >
                      <div className="desktop-toggle-slider" />
                    </div>
                    <span className="desktop-small-text ml-3 font-medium text-gray-500">
                      {useAI ? 'Включено' : 'Выключено'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User and list information */}
              <div className="desktop-card-section space-y-4">
                <h3 className="desktop-section-title">Информация о списке</h3>
                
                <div className="desktop-form-group">
                  <Label htmlFor="user-id" className="desktop-label">
                    ID пользователя
                  </Label>
                  <input 
                    type="text"
                    id="user-id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Введите ваш email или ID" 
                    className="desktop-input"
                    readOnly={isEditingExistingList}
                  />
                  {userId && (
                    <p className="desktop-helper-text">
                      Списки будут сохранены под этим ID
                    </p>
                  )}
                </div>

                <div className="desktop-form-group">
                  <Label htmlFor="list-name" className="desktop-label">
                    Название списка
                  </Label>
                  <input 
                    type="text"
                    id="list-name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Например: Еженедельные покупки" 
                    className="desktop-input"
                  />
                  <p className="desktop-helper-text">Необязательное поле</p>
                </div>
              </div>

              {/* Store selection */}
              <div className="desktop-card-section">
                <h3 className="desktop-section-title flex items-center gap-2">
                  <StoreIcon className="h-5 w-5 text-primary" />
                  Выбор магазина
                </h3>
                
                <div className="desktop-form-group">
                  <Label htmlFor="store-select" className="desktop-label">
                    Магазин для оптимизации
                  </Label>
                  <Select value={selectedStoreId} onValueChange={(value: string) => setSelectedStoreId(value)}>
                    <SelectTrigger id="store-select" className="desktop-select">
                      <SelectValue placeholder="Выберите магазин" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-60">
                      {currentStores.length > 0 ? (
                        currentStores.map((store) => (
                          <SelectItem key={store.id} value={store.id} className="py-3">
                            {store.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-stores-available" disabled>
                          Нет доступных магазинов
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Label htmlFor="new-store-name" className="desktop-label flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                    Добавить новый магазин
                  </Label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="text"
                      id="new-store-name"
                      value={newStoreName}
                      onChange={(e) => {
                        setNewStoreName(e.target.value);
                        if (addStoreError) setAddStoreError(null);
                      }}
                      placeholder="Название нового магазина"
                      className={`desktop-input flex-1 ${addStoreError ? 'border-red-500' : ''}`}
                      disabled={isAddingStore}
                    />
                    <Button 
                      onClick={handleAddStore} 
                      disabled={isAddingStore || !newStoreName.trim()} 
                      className="desktop-button-secondary"
                    >
                      {isAddingStore ? 'Добавление...' : 'Добавить'}
                    </Button>
                  </div>
                  {addStoreError && (
                    <p className="desktop-error-text mt-2">{addStoreError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - Shopping list and actions */}
            <div className="desktop-form-right">
              <div className="desktop-card-section h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="desktop-section-title flex items-center">
                    Список покупок
                    <span className="ml-3 desktop-badge">
                      {rawText.split('\n').filter(line => line.trim()).length} товаров
                    </span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExampleLoad}
                    className="desktop-button-ghost"
                  >
                    Пример списка
                  </Button>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <Textarea
                    id="shopping-list"
                    placeholder="Введите товары, по одному на строку:

молоко
хлеб
яблоки
сыр
..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="desktop-textarea flex-1 min-h-[400px]"
                  />
                  <p className="desktop-helper-text mt-2">
                    Каждый товар с новой строки
                  </p>
                </div>

                {/* Action buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <Button
                    onClick={() => onOptimize(userId, listName)}
                    disabled={!rawText.trim() || !selectedStoreId || !userId.trim() || isLoading}
                    className="desktop-button-primary w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin mr-3"></div>
                        <span>Обработка...</span>
                      </div>
                    ) : (
                      <>{isOptimized ? 'Обновить маршрут' : 'Оптимизировать маршрут'}</>
                    )}
                  </Button>
                  
                  {isOptimized && !isLoading && onReset && (
                    <Button
                      onClick={onReset}
                      variant="outline"
                      className="desktop-button-secondary w-full"
                    >
                      Новый список
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Mobile/Tablet single-column layout
          <>
            {/* AI toggle inside the form */}
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <label htmlFor="ai-toggle-form" className="text-sm font-medium text-gray-700 dark:text-blue-100">Использовать AI для оптимизации:</label>
              <div className="flex items-center">
                <div 
                  className={`mobile-toggle ${useAI ? 'mobile-toggle-on' : 'mobile-toggle-off'}`} 
                  onClick={() => setUseAI(!useAI)}
                >
                  <div className="mobile-toggle-slider" />
                </div>
                <span className="text-xs ml-2 font-medium text-gray-500">{useAI ? 'Вкл' : 'Выкл'}</span>
              </div>
            </div>

            {/* User Identifier Input - Mobile and Tablet friendly version */}
            <div className="form-input-group">
              <Label htmlFor="user-id" className={`form-label ${isTablet ? 'tablet-text-lg' : ''}`}>
                ID пользователя
              </Label>
              <input 
                type="text"
                id="user-id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Введите ваш email или ID" 
                className={`form-input ${isTablet ? 'h-14 text-lg' : ''}`}
                readOnly={isEditingExistingList}
              />
              {userId && <p className="text-xs text-gray-500 mt-1">Списки будут сохранены под этим ID</p>}
            </div>

            <div className="form-input-group">
              <Label htmlFor="list-name" className="form-label">
                Название списка
              </Label>
              <input 
                type="text"
                id="list-name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Например: Еженедельные покупки" 
                className="form-input"
              />
              <p className="text-xs text-gray-500 mt-1">Необязательное поле</p>
            </div>

            <div className="form-input-group">
              <Label htmlFor="store-select" className="form-label flex items-center gap-2">
                <StoreIcon className="h-4 w-4 text-primary" />
                Выберите магазин
              </Label>
              <Select value={selectedStoreId} onValueChange={(value: string) => setSelectedStoreId(value)}>
                <SelectTrigger id="store-select" className="form-select h-12">
                  <SelectValue placeholder="Выберите магазин" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-60">
                  {currentStores.length > 0 ? (
                    currentStores.map((store) => (
                      <SelectItem key={store.id} value={store.id} className="py-3">
                        {store.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-stores-available" disabled>
                      Нет доступных магазинов
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Label htmlFor="new-store-name" className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Добавить новый магазин:
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="text"
                    id="new-store-name"
                    value={newStoreName}
                    onChange={(e) => {
                      setNewStoreName(e.target.value);
                      if (addStoreError) setAddStoreError(null);
                    }}
                    placeholder="Название нового магазина"
                    className={`form-input ${addStoreError ? 'border-red-500' : ''}`}
                    disabled={isAddingStore}
                  />
                </div>
                <div className="mt-2">
                  <Button 
                    onClick={handleAddStore} 
                    disabled={isAddingStore || !newStoreName.trim()} 
                    className="w-full h-10 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                  >
                    {isAddingStore ? 'Добавление...' : 'Добавить новый магазин'}
                  </Button>
                </div>
                {addStoreError && <p className="text-sm text-red-600 mt-1">{addStoreError}</p>}
              </div>
            </div>

            <div className="form-input-group">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="shopping-list" className="form-label flex items-center">
                  Список покупок
                  <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {rawText.split('\n').filter(line => line.trim()).length} товаров
                  </span>
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExampleLoad}
                  className="text-xs text-primary h-7"
                >
                  Пример списка
                </Button>
              </div>
              <Textarea
                id="shopping-list"
                placeholder="Введите товары, по одному на строку:

молоко
хлеб
яблоки
сыр
..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="form-textarea min-h-[180px]"
              />
              <p className="text-xs text-gray-500 mt-1">Каждый товар с новой строки</p>
            </div>

            {/* Action buttons with mobile-friendly styling */}
            <div className="sticky-footer bg-white pt-4 -mx-5 -mb-5 px-5 pb-5 border-t border-gray-100 mt-6">
              {/* Optimize button */}
              <Button
                onClick={() => onOptimize(userId, listName)}
                disabled={!rawText.trim() || !selectedStoreId || !userId.trim() || isLoading}
                className={`w-full ${isTablet ? 'h-16 text-xl tablet-button' : 'h-14 text-lg'} font-medium bg-gradient-to-r from-primary to-accent text-white hover:opacity-95 shadow-md rounded-xl`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
                    <span>Обработка...</span>
                  </div>
                ) : (
                  <>{isOptimized ? 'Обновить маршрут' : 'Оптимизировать маршрут'}</>
                )}
              </Button>
              
              {/* New List button - show only after optimization */}
              {isOptimized && !isLoading && onReset && (
                <Button
                  onClick={onReset}
                  variant="outline"
                  className="w-full h-12 mt-3 text-base font-medium border-gray-300 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Новый список
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingListForm;
