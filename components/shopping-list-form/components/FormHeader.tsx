// components/FormHeader.tsx - Компонент заголовка формы

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface FormHeaderProps {
  isEditingExistingList: boolean;
  isDesktop: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  isEditingExistingList,
  isDesktop,
}) => {
  if (!isDesktop) {
    return (
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
    );
  }

  return (
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
  );
};

FormHeader.displayName = 'FormHeader';
