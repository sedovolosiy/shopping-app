
'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShoppingItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useDevice } from '@/components/device-detector';

interface ListItemEntryProps {
  item: ShoppingItem;
  onToggle: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  index: number;
}

const ListItemEntry: React.FC<ListItemEntryProps> = ({ item, onToggle, onDelete, index }) => {
  // Определяем тип устройства
    // Определяем тип устройства
  const { isTablet } = useDevice();
  
  // Дополнительные классы для планшета
  const tabletClasses = isTablet ? 'py-3 tablet-text-lg' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`route-item group ${
        item.purchased
          ? 'opacity-75'
          : ''
      } ${tabletClasses}`}
    >
      <div
        className={`route-item-checkbox ${item.purchased ? 'route-item-checked' : ''}`}
        onClick={() => onToggle(item.id)}
      >
        {item.purchased && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-xs"
          >
            ✓
          </motion.span>
        )}
      </div>
      <label
        onClick={() => onToggle(item.id)}
        className={`flex-1 cursor-pointer ${isTablet ? 'text-base' : 'text-sm'} transition-all duration-200 ${
          item.purchased
            ? 'line-through text-gray-400'
            : 'text-gray-800'
        }`}
      >
        {item.name}
        {/* Проверка на quantity не требуется, так как его нет в типе ShoppingItem */}
      </label>
      <div className="flex items-center">
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity py-1 px-2 h-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ListItemEntry;
