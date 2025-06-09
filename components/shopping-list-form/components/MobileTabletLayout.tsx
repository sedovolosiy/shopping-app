// components/MobileTabletLayout.tsx - Компонент mobile/tablet версии формы

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { AIToggleSection } from './AIToggleSection';
import { UserInfoSection } from './UserInfoSection';
import { StoreSection } from './StoreSection';
import { ShoppingListTextArea } from './ShoppingListTextArea';
import { ActionButtons } from './ActionButtons';
import { ShoppingListFormProps } from '../types';

interface MobileTabletLayoutProps extends ShoppingListFormProps {
  isTablet: boolean;
}

export const MobileTabletLayout: React.FC<MobileTabletLayoutProps> = (props) => {
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
    isTablet,
  } = props;

  return (
    <CardContent className="space-y-5 p-5">
      <AIToggleSection useAI={useAI} setUseAI={setUseAI} />

      <UserInfoSection
        userId={userId}
        setUserId={setUserId}
        listName={listName}
        setListName={setListName}
        isEditingExistingList={isEditingExistingList}
        isTablet={isTablet}
      />

      <StoreSection
        selectedStoreId={selectedStoreId}
        setSelectedStoreId={setSelectedStoreId}
        availableStores={availableStores}
        onAddStore={onAddStore}
      />

      <ShoppingListTextArea
        rawText={rawText}
        setRawText={setRawText}
        isTablet={isTablet}
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
        isTablet={isTablet}
      />
    </CardContent>
  );
};

MobileTabletLayout.displayName = 'MobileTabletLayout';
