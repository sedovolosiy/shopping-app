"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, ListPlus, ShoppingCart, Settings } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileBottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onTabChange
}) => {
  const tabs = [
    { id: "home", label: "Главная", icon: <Home className="h-5 w-5" /> },
    { id: "new", label: "Новый", icon: <ListPlus className="h-5 w-5" /> },
    { id: "cart", label: "Корзина", icon: <ShoppingCart className="h-5 w-5" /> },
    { id: "settings", label: "Настройки", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-30 safe-area-bottom">
      {/* Navigation tabs */}
      <div className="flex justify-around items-center h-16 pb-safe">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center flex-1 h-full relative touch-target ${
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
