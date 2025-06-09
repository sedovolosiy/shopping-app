// components/ShoppingListTextArea.tsx - Компонент для ввода списка покупок

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingListTextAreaProps } from '../types';
import { EXAMPLE_SHOPPING_LIST, getItemCount } from '../utils/examples';

export const ShoppingListTextArea: React.FC<ShoppingListTextAreaProps> = ({
  rawText,
  setRawText,
  isDesktop = false,
  isTablet = false,
}) => {
  const handleExampleLoad = () => {
    setRawText(EXAMPLE_SHOPPING_LIST);
  };

  const itemCount = getItemCount(rawText);

  if (isDesktop) {
    return (
      <div className="desktop-card-section h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="desktop-section-title flex items-center">
            Список покупок
            <span className="ml-3 desktop-badge">
              {itemCount} товаров
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
      </div>
    );
  }

  return (
    <div className="form-input-group">
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor="shopping-list" className="form-label flex items-center">
          Список покупок
          <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {itemCount} товаров
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
  );
};

ShoppingListTextArea.displayName = 'ShoppingListTextArea';
