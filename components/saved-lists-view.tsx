'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, Package, Plus, User, LogOut, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  storeType: string;
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

  const [error, setError] = useState<string | null>(null);

  const handleDeleteList = async () => {
    if (!listToDelete || !onDeleteList) return;
    
    try {
      setError(null);
      setIsDeleting(true);
      await onDeleteList(listToDelete);
      setListToDelete(null);
      onRefresh(); // Обновляем список после удаления
    } catch (error) {
      console.error('Error deleting list:', error);
      setError(error instanceof Error ? error.message : 'Не удалось удалить список');
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

  const getStoreDisplayName = (storeType: string) => {
    const storeNames: Record<string, string> = {
      'lidl': 'Lidl',
      'biedronka': 'Biedronka',
      'aldi': 'Aldi',
      'default': 'Магазин'
    };
    return storeNames[storeType] || storeType;
  };

  const filteredLists = selectedStore === 'all' 
    ? savedLists 
    : savedLists.filter(list => list.storeType === selectedStore);

  const uniqueStores = Array.from(new Set(savedLists.map(list => list.storeType)));

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-2 text-blue-600" />
            Мои списки покупок
          </h1>
          <p className="text-muted-foreground mt-1">
            Пользователь: <span className="font-medium">{userId}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            Обновить
          </Button>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      {/* Store Filter */}
      {uniqueStores.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedStore === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStore('all')}
          >
            Все магазины
          </Button>
          {uniqueStores.map(store => (
            <Button
              key={store}
              variant={selectedStore === store ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStore(store)}
            >
              {getStoreDisplayName(store)}
            </Button>
          ))}
        </div>
      )}

      {/* Create New Button */}
      <Card className="border-dashed border-2 hover:border-blue-300 transition-colors cursor-pointer" onClick={onCreateNew}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">Создать новый список</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Начните с создания нового списка покупок
          </p>
        </CardContent>
      </Card>

      {/* Saved Lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold">{list.name}</CardTitle>
                  <div className="flex space-x-2">
                    {onDeleteList && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setListToDelete(list.id);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent onClick={() => onSelectList(list)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1" />
                      {list.items.length} товаров
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${list.items.length > 0 ? (list.items.filter(item => item.purchased).length / list.items.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {list.items.filter(item => item.purchased).length}/{list.items.length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {list.items.slice(0, 3).map((item) => (
                        <Badge key={item.id} variant="outline" className="text-xs">
                          {item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
                        </Badge>
                      ))}
                      {list.items.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{list.items.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Create New List Card */}
        <Card className="border-dashed border-2 hover:border-blue-300 transition-colors cursor-pointer" onClick={onCreateNew}>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">Создать новый список</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Начните с создания нового списка покупок
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!listToDelete} 
        onOpenChange={(open) => {
          if (!open) {
            setListToDelete(null);
            setError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить список покупок?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Список покупок будет удален навсегда.
              {error && (
                <div className="mt-2 text-red-500">
                  {error}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteList}
              disabled={isDeleting}
              className={`${error ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
