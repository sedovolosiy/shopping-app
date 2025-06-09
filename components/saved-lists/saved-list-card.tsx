'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calendar, Package, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDevice } from '@/components/device-detector';
import { SavedList } from './types';

interface SavedListCardProps {
  list: SavedList;
  onSelect: (list: SavedList) => void;
  onDelete?: (listId: string) => void;
  getStoreDisplayName: (storeId: string) => string;
  isClient: boolean;
  showDeleteButton?: boolean;
}

export const SavedListCard: React.FC<SavedListCardProps> = ({
  list,
  onSelect,
  onDelete,
  getStoreDisplayName,
  isClient,
  showDeleteButton = true
}) => {
  const { isDesktop } = useDevice();

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(list.id);
    }
  };

  const cardGradient = list.status === 'completed' 
    ? 'from-green-50/50 via-gray-50 to-emerald-50/30 dark:from-gray-900 dark:via-gray-850 dark:to-green-900/20'
    : 'from-white via-gray-50/50 to-blue-50/30 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900';

  const hoverScale = list.status === 'completed' ? 'hover:scale-[1.01]' : 'hover:scale-[1.02]';
  const shadowEffect = list.status === 'completed' ? 'shadow-md hover:shadow-lg' : 'shadow-lg hover:shadow-2xl';

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${hoverScale} hover:-translate-y-1 border-0 ${shadowEffect} bg-gradient-to-br ${cardGradient} rounded-2xl overflow-hidden backdrop-blur-sm ${
        isDesktop ? 'p-2' : 'p-1'
      }`}
      onClick={() => onSelect(list)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex flex-col flex-1">
          <CardTitle className={`font-bold flex items-center gap-3 ${
            isDesktop ? 'text-lg' : 'text-base'
          }`}>
            <div className={`p-2 rounded-xl ${
              list.status === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              <ShoppingCart className="text-white h-3 w-3" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                {list.name}
              </span>
              {isClient && (
                <span className={`text-sm font-normal rounded-full px-3 py-1 mt-1 w-fit ${
                  list.status === 'completed'
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                    : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {getStoreDisplayName(list.storeId)}
                </span>
              )}
            </div>
          </CardTitle>
        </div>
        
        {showDeleteButton && onDelete && list.status !== 'completed' && (
          <motion.button
            onClick={handleDeleteClick}
            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="h-4 w-4 text-red-500 group-hover:text-red-600" />
          </motion.button>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
          {list.status === 'completed' ? (
            <>
              <Package className="mr-2 h-4 w-4" />
              <span className="font-medium">{list.items.length} товаров выполнено</span>
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              <span className="text-sm">{formatDate(list.createdAt)}</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {list.items.slice(0, 3).map((item: SavedList['items'][0]) => (
            <Badge 
              key={item.id} 
              variant="outline" 
              className={`text-xs rounded-full px-3 py-1.5 font-medium ${
                list.status === 'completed'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
                  : item.purchased
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
              }`}
            >
              {(list.status === 'completed' || item.purchased) && '✓ '}
              {item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name}
            </Badge>
          ))}
          
          {list.items.length > 3 && (
            <Badge 
              variant="outline" 
              className={`text-xs rounded-full px-3 py-1.5 font-semibold ${
                list.status === 'completed'
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200'
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200'
              }`}
            >
              {list.status === 'completed' 
                ? `+${list.items.length - 3} выполнено`
                : `+${list.items.length - 3} ещё`
              }
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

SavedListCard.displayName = 'SavedListCard';
