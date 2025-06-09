'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useDevice } from '@/components/device-detector';
import { FormHeader } from '@/components/shopping-list-form/components/FormHeader';
import { DesktopLayout } from '@/components/shopping-list-form/components/DesktopLayout';
import { MobileTabletLayout } from '@/components/shopping-list-form/components/MobileTabletLayout';
import type { ShoppingListFormProps } from '@/components/shopping-list-form/types';

const ShoppingListForm: React.FC<ShoppingListFormProps> = (props) => {
  const { isEditingExistingList = false } = props;
  
  // Определяем тип устройства для адаптивного интерфейса
  const { isTablet, isDesktop } = useDevice();

  // Определяем классы в зависимости от типа устройства
  const cardClasses = isDesktop
    ? "desktop-form-clean"
    : isTablet 
      ? "screen-card w-full max-w-2xl mx-auto shadow-md tablet-form-container"
      : "screen-card w-full max-w-md mx-auto shadow-md";
    
  return (
    <Card className={cardClasses}>
      <FormHeader 
        isEditingExistingList={isEditingExistingList} 
        isDesktop={isDesktop} 
      />
      
      {isDesktop ? (
        <DesktopLayout {...props} />
      ) : (
        <MobileTabletLayout {...props} isTablet={isTablet} />
      )}
    </Card>
  );
};

export default ShoppingListForm;
