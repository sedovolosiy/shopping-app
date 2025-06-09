'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Загрузка ваших списков...'
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <motion.div 
          className="relative mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full absolute top-0 left-0 animate-spin"></div>
        </motion.div>
        
        <motion.p 
          className="text-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

LoadingState.displayName = 'LoadingState';
