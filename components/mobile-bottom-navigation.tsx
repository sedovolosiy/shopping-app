"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, ListPlus, ShoppingCart, Settings, Filter } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFilterClick?: () => void;
}

const MobileBottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  onFilterClick 
}) => {
  const tabs = [
    { id: "home", label: "Главная", icon: <Home className="h-5 w-5" /> },
    { id: "new", label: "Новый", icon: <ListPlus className="h-5 w-5" /> },
    { id: "cart", label: "Корзина", icon: <ShoppingCart className="h-5 w-5" /> },
    { id: "settings", label: "Настройки", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-30">
      {/* Filter button (floating above the navigation) */}
      {onFilterClick && (
        <div className="absolute top-0 right-4 transform -translate-y-1/2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-md"
            onClick={onFilterClick}
            aria-label="Filters"
          >
            <Filter className="h-5 w-5" />
          </motion.button>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center flex-1 h-full relative ${
              activeTab === tab.id ? "text-primary" : "text-gray-500"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute top-0 w-10 h-1 bg-primary rounded-b-md"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
