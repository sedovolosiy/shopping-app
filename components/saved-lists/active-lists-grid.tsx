'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '@/components/device-detector';
import { SavedListCard } from './saved-list-card';
import { CreateNewButton } from './create-new-button';
import { SavedList } from './types';

interface ActiveListsGridProps {
  lists: SavedList[];
  onSelectList: (list: SavedList) => void;
  onCreateNew: () => void;
  onDeleteList?: (listId: string) => void;
  getStoreDisplayName: (storeId: string) => string;
  isClient: boolean;
}

export const ActiveListsGrid: React.FC<ActiveListsGridProps> = ({
  lists,
  onSelectList,
  onCreateNew,
  onDeleteList,
  getStoreDisplayName,
  isClient
}) => {
  const { isDesktop, isTablet } = useDevice();

  // Determine grid classes based on device  
  const gridClasses = isDesktop 
    ? "desktop-three-column" 
    : isTablet 
      ? "grid gap-4 md:grid-cols-2"
      : "flex flex-col gap-4";

  if (lists.length === 0) {
    return (
      <div className={gridClasses}>
        <CreateNewButton onCreateNew={onCreateNew} variant="standalone" />
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      <AnimatePresence>
        {/* Create New Button when lists exist */}
        <CreateNewButton onCreateNew={onCreateNew} variant="inline" />
        
        {lists.map((list) => (
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
              onDelete={onDeleteList}
              getStoreDisplayName={getStoreDisplayName}
              isClient={isClient}
              showDeleteButton={true}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

ActiveListsGrid.displayName = 'ActiveListsGrid';
