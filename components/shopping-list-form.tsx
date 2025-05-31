
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Store } from 'lucide-react';
import { StoreType } from '@/lib/types';

interface ShoppingListFormProps {
  rawText: string;
  setRawText: (text: string) => void;
  selectedStore: StoreType;
  setSelectedStore: (store: StoreType) => void;
  onOptimize: () => void;
  isOptimized: boolean;
}

const ShoppingListForm: React.FC<ShoppingListFormProps> = ({
  rawText,
  setRawText,
  selectedStore,
  setSelectedStore,
  onOptimize,
  isOptimized
}) => {
  const handleExampleLoad = () => {
    const exampleList = `молоко
хлеб
яблоки
сыр
курица
макароны
помидоры
йогурт
мыло
шампунь
конфеты
вода`;
    setRawText(exampleList);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <ShoppingCart className="h-6 w-6" />
          Оптимизатор списка покупок
        </CardTitle>
        <CardDescription className="text-blue-100">
          Введите список товаров и выберите магазин для оптимального маршрута
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="store-select" className="text-base font-semibold flex items-center gap-2">
            <Store className="h-4 w-4" />
            Выберите магазин
          </Label>
          <Select value={selectedStore} onValueChange={(value: StoreType) => setSelectedStore(value)}>
            <SelectTrigger id="store-select" className="w-full">
              <SelectValue placeholder="Выберите магазин" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lidl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  Lidl
                </div>
              </SelectItem>
              <SelectItem value="biedronka">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  Biedronka
                </div>
              </SelectItem>
              <SelectItem value="aldi">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  Aldi
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopping-list" className="text-base font-semibold">
            Список покупок
          </Label>
          <Textarea
            id="shopping-list"
            placeholder="Введите товары, каждый с новой строки:&#10;молоко&#10;хлеб&#10;яблоки&#10;..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExampleLoad}
              className="text-sm"
            >
              Загрузить пример
            </Button>
            <span className="text-sm text-muted-foreground">
              {rawText.split('\n').filter(line => line.trim()).length} товаров
            </span>
          </div>
        </div>

        <Button
          onClick={onOptimize}
          disabled={!rawText.trim() || !selectedStore}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
        >
          {isOptimized ? 'Обновить маршрут' : 'Оптимизировать маршрут'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShoppingListForm;
