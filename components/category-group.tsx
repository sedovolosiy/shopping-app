'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingItem } from '@/lib/types';
import ListItemEntry from './list-item-entry';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryGroupProps {
  categoryName: string;
  items: ShoppingItem[];
  onToggleItem: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  categoryIndex: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  categoryName,
  items,
  onToggleItem,
  onDeleteItem,
  categoryIndex,
  isExpanded: externalIsExpanded,
  onToggleExpand: externalToggleExpand
}) => {
  // Use internal state if external state is not provided
  const [internalIsExpanded, setInternalIsExpanded] = useState<boolean>(true);
  
  // Use the external state if provided, otherwise use internal state
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  
  // Use a default icon for now, since storeType is removed
  const iconName = 'Package';
  const IconComponent = (Icons as any)[iconName] || Icons.Package;
  
  const completedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleExpand = () => {
    // Use external toggle if provided, otherwise use internal state
    if (externalToggleExpand) {
      externalToggleExpand();
    } else {
      setInternalIsExpanded(!internalIsExpanded);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: categoryIndex * 0.05, duration: 0.3 }}
      className="route-category"
    >
      <div 
        className="route-category-header cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{categoryName}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="font-medium text-primary">{completedCount}/{totalCount}</span>
                <span>товаров</span>
                {completionPercentage === 100 && (
                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs ml-1">
                    Завершено
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {completionPercentage > 0 && completionPercentage < 100 && (
              <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-1 px-1 mt-2 border-t border-gray-100">
                {items.map((item, index) => (
                  <ListItemEntry
                    key={item.id}
                    item={item}
                    onToggle={onToggleItem}
                    onDelete={onDeleteItem}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
};

export default CategoryGroup;
