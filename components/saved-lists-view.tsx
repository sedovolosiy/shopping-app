'use client';

import React, { useState } from 'react';
import { useDevice } from '@/components/device-detector';
import {
  ViewHeader,
  StoreFilter,
  ActiveListsGrid,
  CompletedListsSection,
  DeleteConfirmationDialog,
  LoadingState,
  useStoresData,
  useListFilters,
  useDeleteList,
  type SavedListsViewProps
} from '@/components/saved-lists';

export default function SavedListsView({ 
  userId, 
  savedLists, 
  isLoading, 
  onSelectList, 
  onCreateNew, 
  onLogout,
  onRefresh,
  onDeleteList
}: SavedListsViewProps) {
  const [selectedStore, setSelectedStore] = useState<string>('all');
  
  // Device detection
  const { isDesktop, isTablet } = useDevice();
  
  // Custom hooks for data management
  const { isClient, getStoreDisplayName } = useStoresData();
  const { getUniqueStores, getFilteredLists, getCompletedLists } = useListFilters(savedLists);
  const { 
    listToDelete, 
    isDeleting, 
    handleDeleteRequest, 
    handleDeleteConfirm, 
    handleDeleteCancel 
  } = useDeleteList(onDeleteList, onRefresh);

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Data processing
  const uniqueStores = getUniqueStores();
  const filteredLists = getFilteredLists(selectedStore);
  const completedLists = getCompletedLists();

  // Determine container classes based on device
  const containerClasses = isDesktop 
    ? "desktop-content-panel space-y-8" 
    : isTablet 
      ? "space-y-6 tablet-form-container"
      : "space-y-4 w-full max-w-md mx-auto pb-20 px-4 max-h-[calc(100vh-6rem)] overflow-y-auto";

  return (
    <div 
      className={containerClasses} 
      style={{
        ...(!(isDesktop || isTablet) && {
          maxHeight: 'calc(100vh - 6rem)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        })
      }}
    >
      {/* Header */}
      <ViewHeader />

      {/* Store Filter */}
      {isClient && uniqueStores.length > 1 && (
        <StoreFilter
          selectedStore={selectedStore}
          onStoreChange={setSelectedStore}
          stores={uniqueStores}
          getStoreDisplayName={getStoreDisplayName}
        />
      )}

      {/* Active Lists */}
      <ActiveListsGrid
        lists={filteredLists}
        onSelectList={onSelectList}
        onCreateNew={onCreateNew}
        onDeleteList={handleDeleteRequest}
        getStoreDisplayName={getStoreDisplayName}
        isClient={isClient}
      />

      {/* Completed Lists */}
      <CompletedListsSection
        completedLists={completedLists}
        onSelectList={onSelectList}
        getStoreDisplayName={getStoreDisplayName}
        isClient={isClient}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={!!listToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
