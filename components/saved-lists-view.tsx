'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, Package, Plus, User, Trash2, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '@/components/device-detector';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedList {
  id: string;
  name: string;
  createdAt: string;
  storeId: string;
  status: 'active' | 'completed';
  items: Array<{
    id: string;
    name: string;
    category: string;
    purchased: boolean;
  }>;
}

interface SavedListsViewProps {
  userId: string;
  savedLists: SavedList[];
  isLoading: boolean;
  onSelectList: (list: SavedList) => void;
  onCreateNew: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  onDeleteList?: (listId: string) => Promise<void>;
}

export default function SavedListsView({ 
  userId, 
  savedLists, 
  isLoading, 
  onSelectList, 
  onCreateNew, 
  onLogout,
  onRefresh,
  onDeleteList
}: SavedListsViewProps) {
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [storesMap, setStoresMap] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);
  
  // Add device detection
  const { isDesktop, isTablet } = useDevice();

  useEffect(() => {
    setIsClient(true);
    async function fetchStores() {
      try {
        const res = await fetch('/api/stores');
        if (!res.ok) return;
        const stores = await res.json();
        const map: Record<string, string> = {};
        (stores || []).forEach((store: { id: string; name: string }) => {
          if (store && store.id && store.name) {
            map[store.id] = store.name;
          }
        });
        setStoresMap(map);
      } catch (e) {
        // ignore
      }
    }
    fetchStores();
  }, []);

  const handleDeleteList = async () => {
    if (!listToDelete || !onDeleteList) return;
    
    try {
      setIsDeleting(true);
      await onDeleteList(listToDelete);
      setListToDelete(null);
      onRefresh(); // Обновляем список после удаления
    } catch (error) {
      console.error('Error deleting list:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получение имени магазина по storeId из storesMap
  const getStoreDisplayName = (storeId: string) => {
    // На сервере или до загрузки данных возвращаем значение по умолчанию
    if (!isClient) return 'Магазин';
    return storesMap[storeId] || 'Магазин';
  };

  // Фильтрация: показывать только активные списки
  const filteredLists = selectedStore === 'all' 
    ? savedLists.filter(list => list.status !== 'completed')
    : savedLists.filter(list => list.storeId === selectedStore && list.status !== 'completed');

  // Списки завершённые
  const completedLists = savedLists.filter(list => list.status === 'completed');

  const uniqueStores = Array.from(new Set(savedLists.map(list => list.storeId)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div 
            className="relative mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full absolute top-0 left-0 animate-spin"></div>
          </motion.div>
          <motion.p 
            className="text-muted-foreground font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Загрузка ваших списков...
          </motion.p>
        </div>
      </div>
    );
  }

  // Determine container classes based on device
  const containerClasses = isDesktop 
    ? "desktop-content-panel space-y-8" 
    : isTablet 
      ? "space-y-6 tablet-form-container"
      : "space-y-4 w-full max-w-md mx-auto pb-20 px-4 max-h-[calc(100vh-6rem)] overflow-y-auto";

  // Determine grid classes based on device  
  const gridClasses = isDesktop 
    ? "desktop-three-column" 
    : isTablet 
      ? "grid gap-4 md:grid-cols-2"
      : "flex flex-col gap-4";

  return (
    <div className={containerClasses} style={{
      ...(!(isDesktop || isTablet) && {
        maxHeight: 'calc(100vh - 6rem)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      })
    }}>
      {/* Modern Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1 
          className={`font-bold text-gray-900 dark:text-white flex items-center justify-center ${
            isDesktop ? 'text-3xl' : 'text-2xl'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div 
            className={`bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-2 rounded-2xl mr-3 shadow-lg ${
              isDesktop ? 'p-3' : 'p-2'
            }`}
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <User className={`text-white ${
              isDesktop ? 'h-8 w-8' : 'h-6 w-6'
            }`} />
          </motion.div>
          <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Мои списки покупок
          </span>
        </motion.h1>
        <motion.p 
          className="text-gray-600 dark:text-gray-400 mt-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Управляйте своими покупками эффективно
        </motion.p>
      </motion.div>

      {/* Store Filter */}
      {isClient && uniqueStores.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex flex-wrap justify-center ${isDesktop ? 'gap-3' : 'gap-2'} mb-6`}
        >
          <Button
            variant={selectedStore === 'all' ? 'default' : 'outline'}
            size={isDesktop ? 'default' : 'sm'}
            onClick={() => setSelectedStore('all')}
            className={`rounded-full transition-all duration-200 hover:scale-105 ${
              isDesktop ? 'px-6' : 'px-4'
            } ${selectedStore === 'all' ? 'shadow-lg' : ''}`}
          >
            Все магазины
          </Button>
          {uniqueStores.map(store => (
            <Button
              key={store}
              variant={selectedStore === store ? 'default' : 'outline'}
              size={isDesktop ? 'default' : 'sm'}
              onClick={() => setSelectedStore(store)}
              className={`rounded-full transition-all duration-200 hover:scale-105 ${
                isDesktop ? 'px-6' : 'px-4'
              } ${selectedStore === store ? 'shadow-lg' : ''}`}
            >
              {getStoreDisplayName(store)}
            </Button>
          ))}
        </motion.div>
      )}



      {/* Saved Lists */}
      <div className={gridClasses}>
        <AnimatePresence>
          {filteredLists.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl mb-6">
                <ShoppingCart className="h-16 w-16 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Пока нет списков покупок
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Создайте свой первый список, чтобы начать планировать
              </p>
              <Button
                onClick={onCreateNew}
                className="w-[280px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Создать список покупок
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Create New Button when lists exist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-full flex justify-center mb-6"
              >
                <Button
                  onClick={onCreateNew}
                  className="w-[280px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl h-12 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Создать список покупок
                </Button>
              </motion.div>
              
              {filteredLists.map((list) => (
              <motion.div
                key={list.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
              <Card className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-2xl overflow-hidden backdrop-blur-sm ${
                isDesktop ? 'p-2' : 'p-1'
              }`} onClick={() => onSelectList(list)}>
                {/* ...existing card content... */}
              </Card>
            </motion.div>
          ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Завершённые списки */}
      {completedLists.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl mr-3">
              <Package className="text-white h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Завершённые списки
            </h3>
            <Badge variant="outline" className="ml-3 rounded-full">
              {completedLists.length}
            </Badge>
          </div>
          <div className={gridClasses}>
            <AnimatePresence>
              {completedLists.map((list) => (
                <motion.div
                  key={list.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 border-0 shadow-md hover:shadow-lg bg-gradient-to-br from-green-50/50 via-gray-50 to-emerald-50/30 dark:from-gray-900 dark:via-gray-850 dark:to-green-900/20 rounded-2xl overflow-hidden backdrop-blur-sm ${
                    isDesktop ? 'p-2' : 'p-1'
                  }`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <div className="flex flex-col flex-1">
                        <CardTitle className={`font-bold flex items-center gap-3 ${
                          isDesktop ? 'text-lg' : 'text-base'
                        }`}>
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                            <ShoppingCart className="text-white h-3 w-3" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                              {list.name}
                            </span>
                            {isClient && (
                              <span className="text-sm font-normal text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 mt-1 w-fit">
                                {getStoreDisplayName(list.storeId)}
                              </span>
                            )}
                          </div>
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                        <Package className="mr-2 h-4 w-4" />
                        <span className="font-medium">{list.items.length} товаров выполнено</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {list.items.slice(0, 3).map((item) => (
                          <Badge 
                            key={item.id} 
                            variant="outline" 
                            className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 rounded-full px-3 py-1.5 font-medium"
                          >
                            ✓ {item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name}
                          </Badge>
                        ))}
                        {list.items.length > 3 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200 rounded-full px-3 py-1.5 font-semibold"
                          >
                            +{list.items.length - 3} выполнено
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!listToDelete} 
        onOpenChange={(open) => {
          if (!open) {
            setListToDelete(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-lg font-bold">
                Удалить список покупок?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Это действие нельзя будет отменить. Список покупок будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteList}
              disabled={isDeleting}
              className={`rounded-xl ${
                isDeleting 
                  ? 'bg-red-300 dark:bg-red-800' 
                  : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
              } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
