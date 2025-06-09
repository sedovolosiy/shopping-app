// components/ActionButtons.tsx - Компонент для кнопок действий

import React from 'react';
import { Button } from '@/components/ui/button';
import { ActionButtonsProps } from '../types';

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOptimize,
  onReset,
  userId,
  listName,
  rawText,
  selectedStoreId,
  isOptimized,
  isLoading,
  isDesktop = false,
  isTablet = false,
}) => {
  const isDisabled = !rawText.trim() || !selectedStoreId || !userId.trim() || isLoading;

  if (isDesktop) {
    return (
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <Button
          onClick={() => onOptimize(userId, listName)}
          disabled={isDisabled}
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
    );
  }

  return (
    <div className="sticky-footer bg-white pt-4 -mx-5 -mb-5 px-5 pb-5 border-t border-gray-100 mt-6">
      <Button
        onClick={() => onOptimize(userId, listName)}
        disabled={isDisabled}
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
  );
};

ActionButtons.displayName = 'ActionButtons';
