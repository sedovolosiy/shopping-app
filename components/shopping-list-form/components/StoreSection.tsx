// components/StoreSection.tsx - Компонент для выбора и добавления магазинов

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store as StoreIcon } from 'lucide-react';
import { StoreSectionProps } from '../types';
import { useStoreManagement } from '../hooks/useStoreManagement';

export const StoreSection: React.FC<StoreSectionProps> = ({
  selectedStoreId,
  setSelectedStoreId,
  availableStores,
  onAddStore,
  isDesktop = false,
}) => {
  const {
    newStoreName,
    setNewStoreName,
    isAddingStore,
    addStoreError,
    currentStores,
    handleAddStore,
    clearAddStoreError,
  } = useStoreManagement(availableStores, selectedStoreId, setSelectedStoreId, onAddStore);

  if (isDesktop) {
    return (
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
                if (addStoreError) clearAddStoreError();
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
    );
  }

  return (
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
              if (addStoreError) clearAddStoreError();
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
        {addStoreError && (
          <p className="text-sm text-red-600 mt-1">{addStoreError}</p>
        )}
      </div>
    </div>
  );
};

StoreSection.displayName = 'StoreSection';
