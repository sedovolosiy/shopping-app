"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AIStatus from "@/components/ai-status";
import FullPageLoader from "@/components/full-page-loader";
import { Button } from "@/components/ui/button";
import { ListPlus, ArrowLeft, X } from "lucide-react";
import { useSwipeable } from "react-swipeable"; // We'll need to install this package
import { useDevice } from "@/components/device-detector";

// Types for client props
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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isDesktop } = useDevice();

  // Handle pull-to-refresh behavior
  const handlePullToRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Configure swipe handlers for mobile interactions - only for mobile/tablet
  const swipeHandlers = !isDesktop ? useSwipeable({
    onSwipedDown: (eventData: any) => {
      // If we're at the top of the page and user swipes down, trigger refresh
      if (window.scrollY < 10) {
        handlePullToRefresh();
      }
    },
    onSwipedLeft: () => {
      // If we're in optimized view, could implement a specific action
      if (appState === "optimized") {
        // Optional: handle category navigation
      }
    },
    delta: 50, // min distance before swipe is recognized
    trackTouch: true,
  }) : {};

  // Screen transition variants for smoother mobile experience
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  // Reset the bottom sheet state when app state changes
  useEffect(() => {
    setIsBottomSheetOpen(false);
  }, [appState]);

  return (
    <div {...swipeHandlers}>
      {/* Pull-to-refresh indicator - ONLY show on mobile/tablet */}
      {!isDesktop && (
        <AnimatePresence>
          {refreshing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 60, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-center text-primary bg-gray-50 w-full overflow-hidden"
            >
              <div className="flex flex-col items-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-1"></div>
                <span className="text-xs">Обновление...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Full-page loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
          >
            <FullPageLoader
              message="Оптимизируем ваш маршрут..."
              subMessage="Мы группируем товары и создаем оптимальный путь по магазину"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`${!isDesktop ? 'container mx-auto px-4 py-6 space-y-6' : ''} relative min-h-[calc(100vh-4rem)]`}>
        {/* Mobile app header with back button for nested views - ONLY show on mobile/tablet */}
        {!isDesktop && appState !== "login" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky-header flex items-center justify-between mb-2 py-2"
          >
            {appState === "optimized" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="flex items-center text-gray-600 hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm">Новый список</span>
              </Button>
            )}

            <div className="flex-grow">
              {appState === "create_new" && (
                <h1 className="text-lg font-medium text-center">Новый список</h1>
              )}
              {appState === "optimized" && (
                <h1 className="text-lg font-medium text-center">
                  Оптимизированный маршрут
                </h1>
              )}
            </div>

            {(appState === "create_new" || appState === "optimized") && (
              <AIStatus isActive={isAIProcessed} aiModel="Gemini" />
            )}
          </motion.div>
        )}

        {/* Error message with touch-friendly dismiss */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex justify-between items-start"
          >
            <p className="text-red-700 text-sm">{error}</p>
            <button className="text-red-700" onClick={() => {}}>
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!isLoading && (appState !== "optimized" || (isOptimized && optimizedItems.length > 0)) && (
            <motion.div key={appState} {...pageTransition} className="screen-flow">
              {renderCurrentView()}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Empty state with mobile-friendly action button */}
          {appState === "optimized" && isOptimized && optimizedItems.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              key="empty-state"
              className="text-center py-12 flex flex-col items-center justify-center min-h-[50vh]"
            >
              <div className="bg-gray-50 rounded-full p-8 mb-6">
                <ListPlus className="h-12 w-12 text-gray-400" />
              </div>
              <div className="text-gray-600 text-lg font-medium mb-2">
                Список покупок пуст
              </div>
              <div className="text-gray-500 text-sm mb-6">
                Добавьте товары для оптимизации маршрута
              </div>
              <Button
                onClick={handleReset}
                className="w-full max-w-xs bg-primary hover:bg-primary/90 text-white py-3"
              >
                <ListPlus className="h-5 w-5 mr-2" />
                Создать новый список
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom sheet for mobile controls - ONLY show on mobile/tablet */}
        {!isDesktop && (
          <>
            <AnimatePresence>
              {isBottomSheetOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/30 z-40"
                  onClick={() => setIsBottomSheetOpen(false)}
                />
              )}
            </AnimatePresence>

            <motion.div
              className={`bottom-sheet ${
                isBottomSheetOpen ? "bottom-sheet-visible" : "bottom-sheet-hidden"
              }`}
              animate={{ y: isBottomSheetOpen ? 0 : "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="bottom-sheet-handle" />
              <div className="p-5">
                <h3 className="text-lg font-medium mb-4">Фильтры и настройки</h3>
                {/* Filter and settings controls would go here */}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setIsBottomSheetOpen(false)}
                >
                  Закрыть
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default MainClientContent;
