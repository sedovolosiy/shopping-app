// components/DesktopLayout.tsx - Компонент desktop версии формы

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { AIToggleSection } from './AIToggleSection';
import { UserInfoSection } from './UserInfoSection';
import { StoreSection } from './StoreSection';
import { ShoppingListTextArea } from './ShoppingListTextArea';
import { ActionButtons } from './ActionButtons';
import { ShoppingListFormProps } from '../types';

export const DesktopLayout: React.FC<ShoppingListFormProps> = (props) => {
  const {
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
    setUseAI,
  } = props;

  return (
    <CardContent className="space-y-5 p-4">
      <div className="desktop-form-grid">
        {/* Left column - Settings and configuration */}
        <div className="desktop-form-left space-y-6">
          <AIToggleSection useAI={useAI} setUseAI={setUseAI} isDesktop />
          
          <UserInfoSection
            userId={userId}
            setUserId={setUserId}
            listName={listName}
            setListName={setListName}
            isEditingExistingList={isEditingExistingList}
            isDesktop
          />

          <StoreSection
            selectedStoreId={selectedStoreId}
            setSelectedStoreId={setSelectedStoreId}
            availableStores={availableStores}
            onAddStore={onAddStore}
            isDesktop
          />
        </div>

        {/* Right column - Shopping list and actions */}
        <div className="desktop-form-right">
          <ShoppingListTextArea
            rawText={rawText}
            setRawText={setRawText}
            isDesktop
          />

          <ActionButtons
            onOptimize={onOptimize}
            onReset={onReset}
            userId={userId}
            listName={listName}
            rawText={rawText}
            selectedStoreId={selectedStoreId}
            isOptimized={isOptimized}
            isLoading={isLoading}
            isDesktop
          />
        </div>
      </div>
    </CardContent>
  );
};

DesktopLayout.displayName = 'DesktopLayout';
