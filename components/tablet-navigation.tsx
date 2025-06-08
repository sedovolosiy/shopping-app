"use client";

import React from 'react';
import { useDevice } from '@/components/device-detector';
import { motion } from 'framer-motion';
import { Home, Clipboard, List, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface TabletNavigationProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSettings: () => void;
  isLoggedIn?: boolean;
}

const TabletNavigation: React.FC<TabletNavigationProps> = ({
  activeTab,
  onChangeTab,
  onOpenSettings,
  isLoggedIn = false,
}) => {
  // Не показываем навигацию, если пользователь не авторизован
  if (!isLoggedIn) {
    return null;
  }
  const { theme, setTheme } = useTheme();
  const { orientation } = useDevice();
  
  // Выбираем расположение в зависимости от ориентации
  const isLandscape = orientation === 'landscape';
  const navClassName = isLandscape 
    ? 'fixed left-0 top-0 h-screen w-20 flex flex-col py-8 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 border-r border-gray-200 dark:border-gray-700 z-50'
    : 'fixed bottom-0 left-0 right-0 h-20 flex bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 border-t border-gray-200 dark:border-gray-700 z-50';
  
  const itemsContainerClassName = isLandscape
    ? 'flex flex-col h-full items-center justify-between py-8 w-full'
    : 'flex h-full items-center justify-evenly w-full';
  
  return (
    <nav className={navClassName}>
      <div className={itemsContainerClassName}>
        <NavItem 
          icon={<Home size={20} />} 
          label="Главная" 
          isActive={activeTab === 'home'} 
          onClick={() => onChangeTab('home')}
          isVertical={isLandscape}
        />
        
        <NavItem 
          icon={<Clipboard size={20} />} 
          label="Новый список" 
          isActive={activeTab === 'new'} 
          onClick={() => onChangeTab('new')}
          isVertical={isLandscape}
        />
        
        <NavItem 
          icon={<List size={20} />} 
          label="Сохраненные" 
          isActive={activeTab === 'saved'} 
          onClick={() => onChangeTab('saved')}
          isVertical={isLandscape}
        />
        
        <NavItem 
          icon={<Settings size={20} />} 
          label="Настройки" 
          isActive={activeTab === 'settings'} 
          onClick={onOpenSettings}
          isVertical={isLandscape}
        />
        
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-500" />}
        </button>
      </div>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isVertical: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isVertical }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative flex ${isVertical ? 'flex-col w-full min-h-[48px]' : 'items-center'} justify-center items-center p-1.5 rounded-xl
        ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}
        hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
      `}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {isActive && (
        <motion.div
          className={`
            bg-primary
            ${isVertical ? 'absolute right-0 top-1/2 w-1 h-8 -translate-y-1/2 rounded-l-full' : 'absolute bottom-0 left-1/2 w-8 h-1 -translate-x-1/2 rounded-t-full'}
          `}
          layoutId="activeNavIndicator"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
      <span className={`text-[11px] leading-tight ${isVertical ? 'mt-1 text-center break-words w-full px-0.5 max-w-[64px]' : 'ml-1 hidden md:block'}`}>{label}</span>
    </motion.button>
  );
};

export default TabletNavigation;
