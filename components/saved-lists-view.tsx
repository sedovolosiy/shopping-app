'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, Package, Plus, User, LogOut, Trash2 } from 'lucide-react';
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

  const filteredLists = selectedStore === 'all' 
    ? savedLists 
    : savedLists.filter(list => list.storeId === selectedStore);

  const uniqueStores = Array.from(new Set(savedLists.map(list => list.storeId)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка ваших списков...</p>
        </div>
      </div>
    );
  }

  // Determine container classes based on device
  const containerClasses = isDesktop 
    ? "desktop-content-panel space-y-8" 
    : isTablet 
      ? "space-y-6 tablet-form-container"
      : "space-y-6 w-full max-w-md mx-auto";

  // Determine grid classes based on device  
  const gridClasses = isDesktop 
    ? "desktop-three-column" 
    : isTablet 
      ? "grid gap-4 md:grid-cols-2"
      : "grid gap-4";

  return (
    <div className={containerClasses}>
      {/* Header - адаптивная компоновка */}
      {isDesktop ? (
        // Desktop: заголовок и кнопки в одной строке
        <div className="flex items-center justify-between">
          <div>
            <h1 className="desktop-heading font-bold text-gray-900 dark:text-white flex items-center">
              <User className="mr-2 text-blue-600 h-8 w-8" />
              Мои списки покупок
            </h1>
            <p className="desktop-text text-muted-foreground mt-1">
              Пользователь: <span className="font-medium">{userId}</span>
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onRefresh} 
              disabled={isLoading}
              className="desktop-button-secondary"
            >
              Обновить
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="desktop-button-secondary"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Выйти
            </Button>
          </div>
        </div>
      ) : (
        // Mobile/Tablet: заголовок сверху, кнопки снизу
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
              <User className="mr-2 text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="leading-tight">Мои списки покупок</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Пользователь: <span className="font-medium">{userId}</span>
            </p>
          </div>
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              onClick={onRefresh} 
              disabled={isLoading}
              size="sm"
              className="px-3 py-2 text-sm"
            >
              Обновить
            </Button>
            <Button 
              variant="outline" 
              onClick={onLogout}
              size="sm"
              className="px-3 py-2 text-sm"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      )}

      {/* Store Filter */}
      {isClient && uniqueStores.length > 1 && (
        <div className={`flex flex-wrap ${isDesktop ? 'gap-3' : 'gap-2'}`}>
          <Button
            variant={selectedStore === 'all' ? 'default' : 'outline'}
            size={isDesktop ? 'default' : 'sm'}
            onClick={() => setSelectedStore('all')}
            className={isDesktop ? 'desktop-button-secondary' : ''}
          >
            Все магазины
          </Button>
          {uniqueStores.map(store => (
            <Button
              key={store}
              variant={selectedStore === store ? 'default' : 'outline'}
              size={isDesktop ? 'default' : 'sm'}
              onClick={() => setSelectedStore(store)}
              className={isDesktop ? 'desktop-button-secondary' : ''}
            >
              {getStoreDisplayName(store)}
            </Button>
          ))}
        </div>
      )}

      {/* Create New Button */}
      <Card className={`border-dashed border-2 hover:border-blue-300 transition-colors cursor-pointer ${
        isDesktop ? 'desktop-card hover:shadow-lg' : ''
      }`} onClick={onCreateNew}>
        <CardContent className={`flex flex-col items-center justify-center ${
          isDesktop ? 'py-12' : 'py-8'
        }`}>
          <Plus className={`text-muted-foreground mb-4 ${
            isDesktop ? 'h-16 w-16' : 'h-12 w-12'
          }`} />
          <h3 className={`font-semibold text-muted-foreground ${
            isDesktop ? 'desktop-subheading' : 'text-lg'
          }`}>
            Создать новый список
          </h3>
          <p className={`text-muted-foreground text-center mt-2 ${
            isDesktop ? 'desktop-text' : 'text-sm'
          }`}>
            Начните с создания нового списка покупок
          </p>
        </CardContent>
      </Card>

      {/* Saved Lists */}
      <div className={gridClasses}>
        <AnimatePresence>
          {filteredLists.map((list) => (
            <motion.div
              key={list.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`cursor-pointer transition-shadow ${
                isDesktop 
                  ? 'desktop-card hover:shadow-xl' 
                  : 'hover:shadow-lg'
              }`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex flex-col">
                    <CardTitle className={`font-semibold flex items-center gap-2 ${
                      isDesktop ? 'desktop-subheading' : 'text-xl'
                    }`}>
                      {list.name}
                      {isClient && (
                        <span className={`font-normal text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded px-2 py-0.5 ml-2 ${
                          isDesktop ? 'desktop-text' : 'text-base'
                        }`}>
                          {getStoreDisplayName(list.storeId)}
                        </span>
                      )}
                    </CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    {onDeleteList && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setListToDelete(list.id);
                        }}
                        className={`text-red-500 hover:text-red-700 hover:bg-red-50 ${
                          isDesktop ? 'h-10 w-10' : ''
                        }`}
                      >
                        <Trash2 className={isDesktop ? 'h-5 w-5' : 'h-4 w-4'} />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent onClick={() => onSelectList(list)}>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center text-muted-foreground ${
                      isDesktop ? 'desktop-text' : 'text-sm'
                    }`}>
                      <Package className={`mr-1 ${isDesktop ? 'h-5 w-5' : 'h-4 w-4'}`} />
                      {list.items.length} товаров
                    </div>
                    
                    <div className={`flex items-center ${
                      isDesktop ? 'desktop-text' : 'text-sm'
                    }`}>
                      <div className={`bg-gray-200 rounded-full h-2 mr-2 ${
                        isDesktop ? 'w-20' : 'w-16'
                      }`}>
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${list.items.length > 0 ? (list.items.filter(item => item.purchased).length / list.items.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className={`text-muted-foreground ${
                        isDesktop ? 'desktop-small-text' : 'text-xs'
                      }`}>
                        {list.items.filter(item => item.purchased).length}/{list.items.length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {list.items.slice(0, 3).map((item) => (
                        <Badge key={item.id} variant="outline" className={
                          isDesktop ? 'desktop-small-text' : 'text-xs'
                        }>
                          {item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
                        </Badge>
                      ))}
                      {list.items.length > 3 && (
                        <Badge variant="outline" className={
                          isDesktop ? 'desktop-small-text' : 'text-xs'
                        }>
                          +{list.items.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center text-muted-foreground mt-2 ${
                    isDesktop ? 'desktop-text' : 'text-sm'
                  }`}>
                    <ShoppingCart className={`mr-1 ${isDesktop ? 'h-5 w-5' : 'h-4 w-4'}`} />
                    {isClient ? getStoreDisplayName(list.storeId) : 'Магазин'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!listToDelete} 
        onOpenChange={(open) => {
          if (!open) {
            setListToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить список покупок?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Список покупок будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteList}
              disabled={isDeleting}
              className={`${isDeleting ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
