'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Store as StoreIcon } from 'lucide-react'; // Renamed Store to StoreIcon to avoid conflict
// import { StoreType } from '@/lib/types'; // This might need to be updated or augmented as StoreType might be a string literal union

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

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <ShoppingCart className="h-6 w-6" />
          {/* TODO: Localize this title based on user preferences */}
          {isEditingExistingList ? 'Редактировать список покупок' : 'Оптимизатор списка покупок'}
        </CardTitle>
        <CardDescription className="text-blue-100">
          {/* TODO: Localize this description */}
          {isEditingExistingList 
            ? 'Измените товары в списке и обновите маршрут'
            : 'Введите список товаров и выберите магазин для оптимального маршрута'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* AI toggle inside the form */}
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="ai-toggle-form" className="text-sm font-medium text-gray-700">AI:</label>
          <input
            id="ai-toggle-form"
            type="checkbox"
            checked={useAI}
            onChange={() => setUseAI(!useAI)}
            className="accent-blue-600 h-4 w-4"
          />
          <span className="text-xs text-gray-500">{useAI ? 'Включен' : 'Выключен'}</span>
        </div>

        {/* User Identifier Input - Simple version for now */}
        <div className="space-y-2">
          <Label htmlFor="user-id" className="text-base font-semibold">
            {/* TODO: Localize this label */}
            Ваш ID пользователя (для сохранения списков)
          </Label>
          <input 
            type="text"
            id="user-id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Введите ваш email или имя пользователя" // TODO: Localize
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="list-name" className="text-base font-semibold">
            {/* TODO: Localize this label */}
            Название списка (необязательно)
          </Label>
          <input 
            type="text"
            id="list-name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Например, Еженедельные покупки" // TODO: Localize
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="store-select" className="text-base font-semibold flex items-center gap-2">
            <StoreIcon className="h-4 w-4" />
            {/* TODO: Localize this label */}
            Выберите магазин
          </Label>
          <Select value={selectedStoreId} onValueChange={(value: string) => setSelectedStoreId(value)}>
            <SelectTrigger id="store-select" className="w-full">
              {/* TODO: Localize this placeholder */}
              <SelectValue placeholder="Выберите магазин" />
            </SelectTrigger>
            <SelectContent>
              {currentStores.length > 0 ? ( // Use currentStores instead of availableStores
                currentStores.map((store) => ( // Use currentStores instead of availableStores
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-stores-available" disabled>
                  {/* TODO: Localize */}
                  Нет доступных магазинов. Добавьте новый.
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Label htmlFor="new-store-name" className="text-sm font-medium">
                {/* TODO: Localize */}
                Или добавьте новый магазин:
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="text"
                id="new-store-name"
                value={newStoreName}
                onChange={(e) => {
                  setNewStoreName(e.target.value);
                  if (addStoreError) setAddStoreError(null); // Clear error on typing
                }}
                placeholder="Название нового магазина" // TODO: Localize
                className={`w-full p-2 border rounded-md ${addStoreError ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isAddingStore}
              />
              <Button onClick={handleAddStore} disabled={isAddingStore || !newStoreName.trim()} className="whitespace-nowrap">
                {/* TODO: Localize */}
                {isAddingStore ? 'Добавление...' : 'Добавить магазин'}
              </Button>
            </div>
            {addStoreError && <p className="text-sm text-red-600 mt-1">{addStoreError}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopping-list" className="text-base font-semibold">
            {/* TODO: Localize this label */}
            Список покупок
          </Label>
          <Textarea
            id="shopping-list"
            // TODO: Localize this placeholder
            placeholder="Введите товары, каждый с новой строки:&#10;молоко&#10;хлеб&#10;яблоки&#10;..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExampleLoad}
              className="text-sm"
            >
              {/* TODO: Localize this button text */}
              Загрузить пример
            </Button>
            <span className="text-sm text-muted-foreground">
              {/* TODO: Localize this text */}
              {rawText.split('\n').filter(line => line.trim()).length} товаров
            </span>
          </div>
        </div>

        {/* Show the appropriate buttons based on state */}
        <div className="flex flex-col gap-3">
          {/* Optimize button */}
          <Button
            onClick={() => onOptimize(userId, listName)}
            disabled={!rawText.trim() || !selectedStoreId || !userId.trim() || isLoading} // Added isLoading to disable during loading
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
          >
            {/* TODO: Localize button text based on isOptimized and user language */}
            {isOptimized ? 'Обновить маршрут' : 'Оптимизировать маршрут'}
          </Button>
          
          {/* New List button - show only after optimization */}
          {isOptimized && !isLoading && onReset && (
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full h-10 text-base font-medium border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Новый список
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingListForm;
