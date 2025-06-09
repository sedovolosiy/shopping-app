'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useDevice } from '@/components/device-detector';

interface StoreFilterProps {
  selectedStore: string;
  onStoreChange: (storeId: string) => void;
  stores: string[];
  getStoreDisplayName: (storeId: string) => string;
}

export const StoreFilter: React.FC<StoreFilterProps> = ({
  selectedStore,
  onStoreChange,
  stores,
  getStoreDisplayName
}) => {
  const { isDesktop } = useDevice();

  if (stores.length <= 1) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`flex flex-wrap justify-center ${isDesktop ? 'gap-3' : 'gap-2'} mb-6`}
    >
      <Button
        variant={selectedStore === 'all' ? 'default' : 'outline'}
        size={isDesktop ? 'default' : 'sm'}
        onClick={() => onStoreChange('all')}
        className={`rounded-full transition-all duration-200 hover:scale-105 ${
          isDesktop ? 'px-6' : 'px-4'
        } ${selectedStore === 'all' ? 'shadow-lg' : ''}`}
      >
        Все магазины
      </Button>
      
      {stores.map(store => (
        <Button
          key={store}
          variant={selectedStore === store ? 'default' : 'outline'}
          size={isDesktop ? 'default' : 'sm'}
          onClick={() => onStoreChange(store)}
          className={`rounded-full transition-all duration-200 hover:scale-105 ${
            isDesktop ? 'px-6' : 'px-4'
          } ${selectedStore === store ? 'shadow-lg' : ''}`}
        >
          {getStoreDisplayName(store)}
        </Button>
      ))}
    </motion.div>
  );
};

StoreFilter.displayName = 'StoreFilter';
