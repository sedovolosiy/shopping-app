
'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShoppingItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface ListItemEntryProps {
  item: ShoppingItem;
  onToggle: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  index: number;
}

const ListItemEntry: React.FC<ListItemEntryProps> = ({ item, onToggle, onDelete, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md group ${
        item.purchased
          ? 'bg-green-50 border-green-200 opacity-75'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <Checkbox
        id={item.id}
        checked={item.purchased}
        onCheckedChange={() => onToggle(item.id)}
        className="flex-shrink-0"
      />
      <label
        htmlFor={item.id}
        className={`flex-1 cursor-pointer text-sm font-medium transition-all duration-200 ${
          item.purchased
            ? 'line-through text-gray-500'
            : 'text-gray-900 hover:text-gray-700'
        }`}
      >
        {item.name}
      </label>
      <div className="flex items-center gap-2">
        {item.purchased && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-600 text-xs font-semibold bg-green-100 px-2 py-1 rounded-full"
          >
            ✓ Куплено
          </motion.div>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ListItemEntry;
