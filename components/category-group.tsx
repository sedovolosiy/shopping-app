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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: categoryIndex * 0.1, duration: 0.4 }}
    >
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
        <CardHeader 
          className="pb-3 cursor-pointer"
          onClick={toggleExpand}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconComponent className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800">{categoryName}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand();
                }}
                className="ml-2 p-1 rounded-full hover:bg-gray-200"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {completedCount}/{totalCount}
              </span>
              {completionPercentage > 0 && (
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-2">
                {items.map((item, index) => (
                  <ListItemEntry
                    key={item.id}
                    item={item}
                    onToggle={onToggleItem}
                    onDelete={onDeleteItem}
                    index={index}
                  />
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default CategoryGroup;
