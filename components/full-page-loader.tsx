'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Route } from 'lucide-react';

interface FullPageLoaderProps {
  message?: string;
  subMessage?: string;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = "Оптимизируем ваш маршрут...",
  subMessage = "Пожалуйста, подождите"
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-500/95 to-indigo-600/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-white text-center p-8 max-w-md">
        {/* Cart animation with path */}
        <div className="relative h-32 mb-8 mx-auto">
          {/* Path for cart to follow */}
          <svg width="200" height="120" viewBox="0 0 200 120" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <path
              d="M20,60 C20,20 50,20 100,20 C150,20 180,60 180,100"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              strokeDasharray="5,5"
              className="path-animation"
            />
          </svg>
          
          {/* Moving cart icon */}
          <motion.div
            initial={{ x: 0, y: 40, rotate: 0 }}
            animate={{ 
              x: [0, 30, 80, 130, 160], 
              y: [40, 20, 20, 60, 80], 
              rotate: [0, -10, 0, 10, 0] 
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute"
          >
            <ShoppingCart size={36} className="text-white" />
          </motion.div>
          
          {/* Pulsing route icon */}
          <motion.div 
            initial={{ opacity: 0.7, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute right-8 bottom-0"
          >
            <Route size={28} className="text-white" />
          </motion.div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-2xl font-bold mb-3">{message}</h2>
        <p className="text-blue-100 mb-6">{subMessage}</p>
        
        {/* Loading spinner */}
        <div className="flex justify-center items-center gap-3">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-4 border-blue-200 border-t-white rounded-full"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.2 }}
            className="w-6 h-6 border-4 border-blue-200 border-t-white rounded-full"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
            className="w-4 h-4 border-4 border-blue-200 border-t-white rounded-full"
          />
        </div>
        
        {/* Additional animated elements - product items flying in */}
        <div className="relative h-16 mt-8">
          {["🍎", "🥖", "🥛", "🧀", "🥩"].map((emoji, index) => (
            <motion.div
              key={index}
              initial={{ 
                x: -100, 
                y: 50, 
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                x: [-100, 50, 200],
                y: [50, -20, 50],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0]
              }}
              transition={{
                duration: 2,
                delay: index * 0.7,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute text-2xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;
