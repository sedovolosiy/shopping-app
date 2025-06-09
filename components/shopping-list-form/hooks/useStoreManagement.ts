// hooks/useStoreManagement.ts - Хук для управления магазинами

import React from 'react';
import { Store } from '../types';

export const useStoreManagement = (
  availableStores: Store[],
  selectedStoreId: string,
  setSelectedStoreId: (storeId: string) => void,
  onAddStore: (storeName: string) => Promise<Store | null>
) => {
  const [newStoreName, setNewStoreName] = React.useState('');
  const [isAddingStore, setIsAddingStore] = React.useState(false);
  const [addStoreError, setAddStoreError] = React.useState<string | null>(null);

  const currentStores = Array.isArray(availableStores) ? availableStores : [];

  const handleAddStore = async () => {
    if (!newStoreName.trim()) {
      setAddStoreError('Store name cannot be empty.');
      return;
    }

    setIsAddingStore(true);
    setAddStoreError(null);

    try {
      const newStore = await onAddStore(newStoreName.trim());
      if (newStore) {
        setSelectedStoreId(newStore.id);
        setNewStoreName('');
      }
    } catch (error: any) {
      setAddStoreError(error.message || 'Failed to add store. Please try again.');
    }

    setIsAddingStore(false);
  };

  const clearAddStoreError = () => setAddStoreError(null);

  return {
    newStoreName,
    setNewStoreName,
    isAddingStore,
    addStoreError,
    currentStores,
    handleAddStore,
    clearAddStoreError,
  };
};
