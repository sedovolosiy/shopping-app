"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AIStatus from "@/components/ai-status";
import FullPageLoader from "@/components/full-page-loader";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";

// Типы пропсов для клиента
interface MainClientContentProps {
  appState: any;
  isOptimized: boolean;
  isLoading: boolean;
  isAIProcessed: boolean;
  error: string | null;
  renderCurrentView: () => React.ReactNode;
  handleReset: () => void;
  showForm: boolean;
  optimizedItems: any[];
}

const MainClientContent: React.FC<MainClientContentProps> = ({
  appState,
  isOptimized,
  isLoading,
  isAIProcessed,
  error,
  renderCurrentView,
  handleReset,
  showForm,
  optimizedItems,
}) => {
  return (
    <>
      {/* Full-page loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FullPageLoader
              message="Оптимизируем ваш маршрут..."
              subMessage="Мы группируем товары и создаем оптимальный путь по магазину"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8 space-y-8 relative">
        {(appState === "create_new" || appState === "optimized") && (
          <AIStatus isActive={isAIProcessed} aiModel="Gemini" />
        )}

        {/* Сообщение об ошибке */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Исправлено: не показывать ничего если optimizedItems пустой и optimized */}
          {!isLoading && (appState !== "optimized" || (isOptimized && optimizedItems.length > 0)) && renderCurrentView()}
        </AnimatePresence>

        <AnimatePresence>
          {/* Пустое состояние */}
          {appState === "optimized" && isOptimized && optimizedItems.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              key="empty-state"
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg">
                Список покупок пуст. Добавьте товары для оптимизации маршрута.
              </div>
              <Button
                onClick={handleReset}
                variant="outline"
                className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <ListPlus className="h-5 w-5 mr-2" />
                Создать новый список
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default MainClientContent;
