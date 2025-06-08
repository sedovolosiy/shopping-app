"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorDisplay from "@/components/error-display";
import { ErrorInfo } from "@/lib/error-handling";

interface DesktopMainContentProps {
  appState: string;
  isOptimized: boolean;
  isLoading: boolean;
  isAIProcessed: boolean;
  error: ErrorInfo | null;
  renderCurrentView: () => React.ReactNode;
  handleReset: () => void;
  showForm: boolean;
  optimizedItems: any[];
  onRetryError?: () => void;
  onDismissError?: () => void;
}

const DesktopMainContent: React.FC<DesktopMainContentProps> = ({
  appState,
  isOptimized,
  isLoading,
  isAIProcessed,
  error,
  renderCurrentView,
  handleReset,
  showForm,
  optimizedItems,
  onRetryError,
  onDismissError
}) => {
  // Определяем layout в зависимости от состояния
  const isOptimizedState = appState === "optimized" && isOptimized && optimizedItems.length > 0;
  
  if (isOptimizedState) {
    // Двухколоночный layout для оптимизированного списка
    return (
      <div className="desktop-list-container">
        {/* Панель прогресса и информации */}
        <div className="desktop-categories-panel">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Прогресс покупок</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {Math.round((optimizedItems.filter(item => item.purchased).length / optimizedItems.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {optimizedItems.filter(item => item.purchased).length} из {optimizedItems.length} товаров
                    </div>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(optimizedItems.filter(item => item.purchased).length / optimizedItems.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Дополнительная информация */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Всего категорий:</span>
                  <span className="font-medium">
                    {new Set(optimizedItems.map(item => item.category)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI обработка:</span>
                  <span className={`font-medium ${isAIProcessed ? 'text-green-600' : 'text-gray-500'}`}>
                    {isAIProcessed ? 'Включена' : 'Отключена'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Основной контент */}
        <div className="desktop-content-panel">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            {renderCurrentView()}
          </motion.div>
        </div>
      </div>
    );
  }

  // Одноколоночный layout для других состояний
  return (
    <div className="desktop-main-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        {/* Заголовок */}
        {appState === "create_new" && (
          <div className="desktop-page-header">
            <h1 className="desktop-heading">Создание нового списка</h1>
            <p className="desktop-text text-muted-foreground">
              Введите товары и выберите магазин для оптимизации маршрута
            </p>
          </div>
        )}
        
        {appState === "home" && (
          <div className="desktop-page-header">
            <h1 className="desktop-heading">Главная страница</h1>
            <p className="desktop-text text-muted-foreground">
              Управляйте своими списками покупок
            </p>
          </div>
        )}
        
        {appState === "saved" && (
          <div className="desktop-page-header">
            <h1 className="desktop-heading">Сохраненные списки</h1>
            <p className="desktop-text text-muted-foreground">
              Ваши ранее созданные списки покупок
            </p>
          </div>
        )}

        {/* Ошибки */}
        <ErrorDisplay 
          error={error} 
          onRetry={error?.retryable && onRetryError ? onRetryError : undefined}
          onDismiss={onDismissError}
          className="mb-4"
        />
        
        {/* Основной контент без лишних карточек */}
        <div className="desktop-content-wrapper">
          {renderCurrentView()}
        </div>
      </motion.div>
    </div>
  );
};

export default DesktopMainContent;
