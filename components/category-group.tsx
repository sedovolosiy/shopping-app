
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingItem, StoreType } from '@/lib/types';
import { getCategoryIcon } from '@/lib/store-data';
import ListItemEntry from './list-item-entry';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface CategoryGroupProps {
  categoryName: string;
  items: ShoppingItem[];
  storeType: StoreType;
  onToggleItem: (itemId: string) => void;
  categoryIndex: number;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  categoryName,
  items,
  storeType,
  onToggleItem,
  categoryIndex
}) => {
  const iconName = getCategoryIcon(categoryName, storeType);
  const IconComponent = (Icons as any)[iconName] || Icons.Package;
  
  const completedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: categoryIndex * 0.1, duration: 0.4 }}
    >
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconComponent className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800">{categoryName}</span>
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
        
        <CardContent className="space-y-2">
          {items.map((item, index) => (
            <ListItemEntry
              key={item.id}
              item={item}
              onToggle={onToggleItem}
              index={index}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryGroup;
