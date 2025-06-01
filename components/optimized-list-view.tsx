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
  const groupedItems = groupItemsByCategory(items);
  // Сортировка категорий по алфавиту (или оставить без сортировки)
  const sortedCategories = Object.keys(groupedItems).sort();

  const totalItems = items.length;
  const completedItems = items.filter(item => item.purchased).length;
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Заголовок с прогрессом */}
      <Card className="shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Route className="h-6 w-6" />
              <span>Оптимальный маршрут для {storeName}</span>
              {isAIProcessed && <AITag isActive={true} />}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleExpandAll}
                className="text-indigo-600 border-white hover:bg-white hover:text-indigo-700"
              >
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                {expandAll ? 'Свернуть все' : 'Развернуть все'}
              </Button>
              {onToggleForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleForm}
                  className="text-indigo-600 border-white hover:bg-white hover:text-indigo-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Изменить список
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="text-indigo-600 border-white hover:bg-white hover:text-indigo-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Следуйте порядку категорий для эффективного похода по магазину
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {completionPercentage === 100 ? (
                <CheckCircle2 className="h-5 w-5 text-green-300" />
              ) : (
                <Circle className="h-5 w-5 text-white" />
              )}
              <span className="text-lg font-semibold">
                Прогресс: {completedItems}/{totalItems} товаров
              </span>
            </div>
            <span className="text-lg font-bold">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          </div>
          
          {completionPercentage === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 bg-green-500 rounded-lg text-center"
            >
              <motion.div 
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 2, duration: 0.7 }}
              >
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
              </motion.div>
              <p className="font-semibold text-lg mb-3">Поздравляем! Все товары куплены!</p>
              <Button
                variant="outline"
                size="lg"
                onClick={onReset}
                className="mt-2 bg-white text-green-700 hover:bg-green-50 border-white font-medium"
              >
                <ListPlus className="h-5 w-5 mr-2" />
                Новый список
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Список категорий */}
      <div className="space-y-4">
        {sortedCategories.map((categoryName, index) => (
          <CategoryGroup
            key={categoryName}
            categoryName={categoryName}
            items={groupedItems[categoryName]}
            onToggleItem={onToggleItem}
            onDeleteItem={onDeleteItem}
            categoryIndex={index}
            isExpanded={expandAll}
            onToggleExpand={() => {}}
          />
        ))}
      </div>

      {/* Информация о маршруте */}
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Совет:</strong> Следуйте порядку категорий сверху вниз для оптимального маршрута в {storeName}
            </p>
            <p className="text-xs text-gray-500">
              Маршрут основан на типичной планировке магазинов {storeName}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedListView;
