'use client';

import React from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDevice } from '@/components/device-detector';

interface ViewHeaderProps {
  title?: string;
  subtitle?: string;
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  title = 'Мои списки покупок',
  subtitle = 'Управляйте своими покупками эффективно'
}) => {
  const { isDesktop } = useDevice();

  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1 
        className={`font-bold text-gray-900 dark:text-white flex items-center justify-center ${
          isDesktop ? 'text-3xl' : 'text-2xl'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.div 
          className={`bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-2 rounded-2xl mr-3 shadow-lg ${
            isDesktop ? 'p-3' : 'p-2'
          }`}
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <User className={`text-white ${
            isDesktop ? 'h-8 w-8' : 'h-6 w-6'
          }`} />
        </motion.div>
        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          {title}
        </span>
      </motion.h1>
      
      <motion.p 
        className="text-gray-600 dark:text-gray-400 mt-2 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};

ViewHeader.displayName = 'ViewHeader';
