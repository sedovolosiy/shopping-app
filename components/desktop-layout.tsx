"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, Clipboard, List, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

interface DesktopLayoutProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSettings: () => void;
  children: React.ReactNode;
  onLogout?: () => void;
  currentUserId?: string;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  activeTab,
  onChangeTab,
  onOpenSettings,
  children,
  onLogout,
  currentUserId
}) => {
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'new', label: 'Новый список', icon: Clipboard },
    { id: 'saved', label: 'Сохраненные', icon: List },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="desktop-force intermediate-responsive">
      {/* Sidebar Navigation */}
      <aside className="desktop-sidebar intermediate-sidebar">
        {/* Logo and Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 intermediate-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white desktop-heading">
                Shopping Optimizer
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 desktop-text">
                Умный помощник
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 intermediate-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`
                  desktop-nav-button intermediate-nav-button relative
                  ${isActive 
                    ? 'desktop-nav-button-active intermediate-nav-active' 
                    : 'desktop-nav-button-inactive intermediate-nav-inactive'
                  }
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-left truncate">{item.label}</span>
                
                {isActive && (
                  <motion.div
                    className="absolute right-0 top-1/2 w-1 h-8 bg-white rounded-l-full -translate-y-1/2"
                    layoutId="desktopActiveIndicator"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3 intermediate-bottom">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full justify-start gap-3 text-gray-600 dark:text-gray-300 text-left intermediate-theme-btn"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            ) : (
              <Moon className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="truncate">{theme === 'dark' ? 'Светлая тема' : 'Темная тема'}</span>
          </Button>

          {/* User Info and Logout */}
          {currentUserId && (
            <div className="space-y-2">
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Пользователь</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={currentUserId}>
                  {currentUserId}
                </p>
              </div>
              
              {onLogout && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 text-left intermediate-logout-btn"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Выйти</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="desktop-main-content-panel intermediate-main">
        <div className="desktop-container intermediate-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DesktopLayout;
