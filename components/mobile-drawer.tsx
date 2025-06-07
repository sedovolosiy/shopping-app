"use client";

import React, { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  position?: "bottom" | "right";
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "bottom"
}) => {
  // Animation variants based on drawer position
  const variants = {
    bottom: {
      hidden: { y: "100%" },
      visible: { y: 0 }
    },
    right: {
      hidden: { x: "100%" },
      visible: { x: 0 }
    }
  };
  
  // Classes based on position
  const positionClasses = {
    bottom: "fixed bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh] overflow-auto",
    right: "fixed top-0 right-0 bottom-0 max-w-[85vw] w-full overflow-auto"
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className={`${positionClasses[position]} bg-white shadow-lg z-50`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants[position]}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
          >
            {/* Handle for bottom drawer */}
            {position === "bottom" && (
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-medium">{title}</h3>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
