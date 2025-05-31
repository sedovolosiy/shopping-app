
'use client';

import React, { useState, useCallback } from 'react';
import { ShoppingItem, StoreType } from '@/lib/types';
import { processShoppingList } from '@/lib/store-data';
import ShoppingListForm from '@/components/shopping-list-form';
import OptimizedListView from '@/components/optimized-list-view';
// import { motion } from 'framer-motion';

export default function HomePage() {
  const [rawText, setRawText] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<StoreType>('lidl');
  const [optimizedItems, setOptimizedItems] = useState<ShoppingItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);

  const handleOptimize = useCallback(() => {
    if (!rawText.trim()) return;
    
    const processedItems = processShoppingList(rawText, selectedStore);
    setOptimizedItems(processedItems);
    setIsOptimized(true);
  }, [rawText, selectedStore]);

  const handleToggleItem = useCallback((itemId: string) => {
    setOptimizedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, purchased: !item.purchased }
          : item
      )
    );
  }, []);

  const handleReset = useCallback(() => {
    setOptimizedItems([]);
    setIsOptimized(false);
    setRawText('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Заголовок приложения */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 
            className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Умный помощник для покупок
          </h1>
          <p 
            className="text-center text-gray-600 mt-2"
          >
            Оптимизируйте свой маршрут в магазинах Lidl, Biedronka и Aldi
          </p>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Форма ввода */}
        <div>
          <ShoppingListForm
            rawText={rawText}
            setRawText={setRawText}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            onOptimize={handleOptimize}
            isOptimized={isOptimized}
          />
        </div>

        {/* Оптимизированный список */}
        {isOptimized && optimizedItems.length > 0 && (
          <div>
            <OptimizedListView
              items={optimizedItems}
              storeType={selectedStore}
              onToggleItem={handleToggleItem}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Пустое состояние */}
        {isOptimized && optimizedItems.length === 0 && (
          <div
            className="text-center py-12"
          >
            <div className="text-gray-500 text-lg">
              Список покупок пуст. Добавьте товары для оптимизации маршрута.
            </div>
          </motion.div>
        )}

        {/* Информационные карточки */}
        {!isOptimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl mb-3">🛒</div>
              <h3 className="font-semibold text-lg mb-2">Простой ввод</h3>
              <p className="text-gray-600 text-sm">
                Вставьте список покупок из любого источника - Telegram, SMS, заметок
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-green-600 text-2xl mb-3">🗺️</div>
              <h3 className="font-semibold text-lg mb-2">Умная оптимизация</h3>
              <p className="text-gray-600 text-sm">
                Автоматическая группировка товаров по категориям и оптимальный маршрут
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-purple-600 text-2xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2">Мобильная версия</h3>
              <p className="text-gray-600 text-sm">
                Удобное использование на телефоне прямо в магазине
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Подвал */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              Приложение основано на исследовании планировки магазинов Lidl, Biedronka и Aldi
            </p>
            <p className="text-xs text-gray-500">
              Маршруты могут отличаться в зависимости от конкретного магазина
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
