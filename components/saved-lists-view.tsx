'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, Package, Plus, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export default function SavedListsView({ 
  userId, 
  savedLists, 
  isLoading, 
  onSelectList, 
  onCreateNew, 
  onLogout,
  onRefresh 
}: SavedListsViewProps) {
  const [selectedStore, setSelectedStore] = useState<string>('all');

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
      <AnimatePresence>
        {filteredLists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {selectedStore === 'all' ? 'Нет сохранённых списков' : `Нет списков для ${getStoreDisplayName(selectedStore)}`}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Создайте ваш первый список покупок
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLists.map((list, index) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onSelectList(list)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{list.name}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(list.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {getStoreDisplayName(list.storeType)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
