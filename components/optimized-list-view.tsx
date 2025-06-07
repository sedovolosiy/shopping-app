'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingItem } from '@/lib/types';
import { groupItemsByCategory } from '@/lib/store-data';
import CategoryGroup from './category-group';
import { motion } from 'framer-motion';
import { Route, RotateCcw, CheckCircle2, Circle, ChevronsUpDown, Edit, ListPlus } from 'lucide-react';
import { AITag } from './ai-status';

interface OptimizedListViewProps {
  items: ShoppingItem[];
  storeName: string; // Имя магазина для отображения
  onToggleItem: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onReset: () => void;
  isAIProcessed?: boolean;
  onToggleForm?: () => void;
}

const OptimizedListView: React.FC<OptimizedListViewProps> = ({
  items,
  storeName,
  onToggleItem,
  onDeleteItem,
  onReset,
  isAIProcessed = false,
  onToggleForm
}) => {
  const [expandAll, setExpandAll] = useState<boolean>(true);
  // Добавляем состояние для отслеживания развернутых/свёрнутых категорий
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const safeItems = Array.isArray(items) ? items : [];
  const groupedItems: Record<string, ShoppingItem[]> = groupItemsByCategory(safeItems) || {};
  // Сортировка категорий по алфавиту (или оставить без сортировки)
  const sortedCategories = Object.keys(groupedItems).sort();

  const totalItems = safeItems.length;
  const completedItems = safeItems.filter(item => item.purchased).length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
    // Сбрасываем отдельные настройки категорий при глобальном переключении
    setExpandedCategories({});
  };
  
  // Функция для переключения состояния отдельной категории
  const toggleCategoryExpand = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !(prev[categoryName] ?? expandAll)
    }));
  };
  
  // Определяем, развернута ли категория, с учетом индивидуальных настроек
  const isCategoryExpanded = (categoryName: string) => {
    // Проверяем, есть ли индивидуальная настройка для категории
    if (categoryName in expandedCategories) {
      return expandedCategories[categoryName];
    }
    // Если нет, используем глобальную настройку
    return expandAll;
  };

  if (safeItems.length === 0) {
    return null;
  }

  return (
    <div className="route-screen w-full max-w-md mx-auto">
      {/* Progress bar at the top */}
      <div className="route-progress">
        <div
          className="route-progress-value"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      {/* Header with controls */}
      <div className="route-header">
        <div className="flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          <h2 className="text-base font-medium">Маршрут <span className="font-normal text-sm">• {storeName}</span></h2>
          {isAIProcessed && <AITag isActive={true} />}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpandAll}
            className="h-8 w-8 text-gray-600"
            title={expandAll ? 'Свернуть все' : 'Развернуть все'}
          >
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
          {onToggleForm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleForm}
              className="h-8 w-8 text-gray-600"
              title="Редактировать список"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-8 w-8 text-gray-600"
            title="Новый список"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <Card className="shadow-md bg-gradient-to-r from-primary to-accent text-white mb-4">
        <CardHeader className="py-3 px-4">
          <CardDescription className="text-white/80 text-xs">
            Следуйте порядку категорий для оптимального маршрута
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-3 px-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {completionPercentage === 100 ? (
                <CheckCircle2 className="h-5 w-5 text-green-300" />
              ) : (
                <Circle className="h-5 w-5 text-white/70" />
              )}
              <span className="text-base">
                <span className="font-medium">{completedItems}/{totalItems}</span> товаров
              </span>
            </div>
            <span className="text-xl font-bold">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          
          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-green-400 rounded-full"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Congratulations card when completed */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 p-5 bg-green-500 rounded-xl text-center text-white shadow-lg"
        >
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: 1, duration: 0.7 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.div>
          <p className="font-medium text-lg mb-4">Поздравляем! Все товары куплены!</p>
          <Button
            variant="secondary"
            size="lg"
            onClick={onReset}
            className="w-full h-12 bg-white text-green-700 hover:bg-green-50 border-0 font-medium"
          >
            <ListPlus className="h-5 w-5 mr-2" />
            Новый список
          </Button>
        </motion.div>
      )}

      {/* Список категорий */}
      <div className="space-y-3 mb-20">
        {sortedCategories.map((categoryName, index) => (
          <CategoryGroup
            key={categoryName}
            categoryName={categoryName}
            items={groupedItems[categoryName]}
            onToggleItem={onToggleItem}
            onDeleteItem={onDeleteItem}
            categoryIndex={index}
            isExpanded={isCategoryExpanded(categoryName)}
            onToggleExpand={() => toggleCategoryExpand(categoryName)}
          />
        ))}
      </div>

      {/* Информация и подсказки внизу */}
      <div className="text-center text-xs text-gray-500 mb-4">
        <p>Оптимальный маршрут для планировки {storeName}</p>
      </div>
      
      {/* Fixed footer with actions */}
      <div className="route-footer">
        <div className="flex items-center">
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Route className="h-4 w-4 text-primary" />
            <span>Оптимизировано для {storeName}</span>
          </div>
        </div>
        {onToggleForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleForm}
            className="text-sm bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100"
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Изменить список
          </Button>
        )}
      </div>
    </div>
  );
};

export default OptimizedListView;
