'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '@/components/device-detector';
import { SavedListCard } from './saved-list-card';
import { SavedList } from './types';

interface CompletedListsSectionProps {
  completedLists: SavedList[];
  onSelectList: (list: SavedList) => void;
  getStoreDisplayName: (storeId: string) => string;
  isClient: boolean;
}

export const CompletedListsSection: React.FC<CompletedListsSectionProps> = ({
  completedLists,
  onSelectList,
  getStoreDisplayName,
  isClient
}) => {
  const { isDesktop, isTablet } = useDevice();

  if (completedLists.length === 0) {
    return null;
  }

  // Determine grid classes based on device  
  const gridClasses = isDesktop 
    ? "desktop-three-column" 
    : isTablet 
      ? "grid gap-4 md:grid-cols-2"
      : "flex flex-col gap-4";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
    >
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl mr-3">
          <Package className="text-white h-4 w-4" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Завершённые списки
        </h3>
        <Badge variant="outline" className="ml-3 rounded-full">
          {completedLists.length}
        </Badge>
      </div>
      
      <div className={gridClasses}>
        <AnimatePresence>
          {completedLists.map((list) => (
            <motion.div
              key={list.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SavedListCard
                list={list}
                onSelect={onSelectList}
                getStoreDisplayName={getStoreDisplayName}
                isClient={isClient}
                showDeleteButton={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

CompletedListsSection.displayName = 'CompletedListsSection';
