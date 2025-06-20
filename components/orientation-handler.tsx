"use client";

import React, { useEffect, useState, ReactNode } from "react";

interface OrientationHandlerProps {
  children: ReactNode;
  portraitMessage?: string;
  forcePortrait?: boolean;
}

const OrientationHandler: React.FC<OrientationHandlerProps> = ({
  children,
  portraitMessage = "Для лучшего опыта использования, пожалуйста, поверните устройство в портретный режим",
  forcePortrait = false
}) => {
  const [isLandscape, setIsLandscape] = useState(false);
  
  useEffect(() => {
    const checkOrientation = () => {
      // Определение типа устройства
      const isMobile = window.innerWidth <= 640;
      const isTablet = window.innerWidth > 640 && window.innerWidth <= 1024;
      
      if (isMobile) {
        // Для мобильных устройств всегда проверяем ориентацию
        setIsLandscape(window.innerWidth > window.innerHeight);
      } else if (isTablet && forcePortrait) {
        // Для планшетов проверяем ориентацию только если forcePortrait=true
        setIsLandscape(window.innerWidth > window.innerHeight);
      } else {
        // Для планшетов с forcePortrait=false и десктопов не ограничиваем ориентацию
        setIsLandscape(false);
      }
    };
    
    // Initial check
    checkOrientation();
    
    // Add event listener
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, [forcePortrait]);
  
  if (isLandscape && forcePortrait) {
    return (
      <div className="fixed inset-0 bg-primary/90 flex flex-col items-center justify-center text-white p-6 z-50">
        <div className="w-20 h-20 border-4 border-white rounded-lg mb-6 animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="animate-bounce"
            >
              <polyline points="16 4 20 4 20 8"></polyline>
              <line x1="14" y1="10" x2="20" y2="4"></line>
              <polyline points="8 20 4 20 4 16"></polyline>
              <line x1="4" y1="20" x2="10" y2="14"></line>
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">Поверните устройство</h3>
        <p className="text-center text-white/80">{portraitMessage}</p>
      </div>
    );
  }
  
  // Определяем тип устройства
  const isTablet = typeof window !== 'undefined' && 
    window.innerWidth > 640 && window.innerWidth <= 1024;
  
  return (
    <div className={`
      ${isLandscape ? "landscape-mode" : "portrait-mode"}
      ${isTablet ? "tablet-device" : ""}
      ${isTablet && isLandscape ? "tablet-landscape" : ""}
      ${isTablet && !isLandscape ? "tablet-portrait" : ""}
    `}>
      {children}
    </div>
  );
};

export default OrientationHandler;
