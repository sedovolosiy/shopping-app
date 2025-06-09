'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreateNewButtonProps {
  onCreateNew: () => void;
  variant?: 'standalone' | 'inline';
  className?: string;
}

export const CreateNewButton: React.FC<CreateNewButtonProps> = ({
  onCreateNew,
  variant = 'standalone',
  className = ''
}) => {
  const buttonContent = (
    <>
      <Plus className="h-5 w-5 mr-2" />
      Создать список покупок
    </>
  );

  const baseClasses = "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium";

  if (variant === 'standalone') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl mb-6">
          <Plus className="h-16 w-16 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Пока нет списков покупок
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Создайте свой первый список, чтобы начать планировать
        </p>
        <Button
          onClick={onCreateNew}
          className={`w-[280px] h-14 text-lg ${baseClasses} ${className}`}
        >
          {buttonContent}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="col-span-full flex justify-center mb-6"
    >
      <Button
        onClick={onCreateNew}
        className={`w-[280px] h-12 ${baseClasses} ${className}`}
      >
        {buttonContent}
      </Button>
    </motion.div>
  );
};

CreateNewButton.displayName = 'CreateNewButton';
