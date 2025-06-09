// components/AIToggleSection.tsx - Компонент переключателя AI

import React from 'react';
import { AIToggleSectionProps } from '../types';

export const AIToggleSection: React.FC<AIToggleSectionProps> = ({
  useAI,
  setUseAI,
  isDesktop = false,
}) => {
  if (isDesktop) {
    return (
      <div className="desktop-card-section">
        <h3 className="desktop-section-title">Настройки оптимизации</h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <label htmlFor="ai-toggle-form" className="desktop-text font-medium text-gray-700 dark:text-blue-100">
            Использовать AI для оптимизации:
          </label>
          <div className="flex items-center">
            <div 
              className={`desktop-toggle ${useAI ? 'desktop-toggle-on' : 'desktop-toggle-off'}`} 
              onClick={() => setUseAI(!useAI)}
            >
              <div className="desktop-toggle-slider" />
            </div>
            <span className="desktop-small-text ml-3 font-medium text-gray-500">
              {useAI ? 'Включено' : 'Выключено'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
      <label htmlFor="ai-toggle-form" className="text-sm font-medium text-gray-700 dark:text-blue-100">
        Использовать AI для оптимизации:
      </label>
      <div className="flex items-center">
        <div 
          className={`mobile-toggle ${useAI ? 'mobile-toggle-on' : 'mobile-toggle-off'}`} 
          onClick={() => setUseAI(!useAI)}
        >
          <div className="mobile-toggle-slider" />
        </div>
        <span className="text-xs ml-2 font-medium text-gray-500">
          {useAI ? 'Вкл' : 'Выкл'}
        </span>
      </div>
    </div>
  );
};

AIToggleSection.displayName = 'AIToggleSection';
