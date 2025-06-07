"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Типы устройств
type DeviceType = "mobile" | "tablet" | "desktop";
type OrientationType = "portrait" | "landscape";

// Интерфейс контекста
interface DeviceContextType {
  deviceType: DeviceType;
  orientation: OrientationType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
}

// Создаем контекст с начальными значениями
const DeviceContext = createContext<DeviceContextType>({
  deviceType: "mobile",
  orientation: "portrait",
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  isPortrait: true,
  isLandscape: false,
});

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceContextType>({
    deviceType: "mobile",
    orientation: "portrait",
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isPortrait: true,
    isLandscape: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      // Получаем ширину окна
      const width = window.innerWidth;
      
      // Определяем тип устройства по ширине
      let deviceType: DeviceType = "mobile";
      if (width > 1024) {
        deviceType = "desktop";
      } else if (width > 640) {
        deviceType = "tablet";
      }
      
      // Определяем ориентацию
      const isPortrait = window.innerHeight > window.innerWidth;
      const orientation: OrientationType = isPortrait ? "portrait" : "landscape";
      
      // Добавляем классы к body для CSS
      if (typeof document !== 'undefined') {
        // Удаляем все классы устройств
        document.body.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
        document.documentElement.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
        
        // Добавляем соответствующий класс
        document.body.classList.add(`${deviceType}-device`);
        document.documentElement.classList.add(`${deviceType}-device`);
        
        // Добавляем класс ориентации
        document.body.classList.remove('portrait-orientation', 'landscape-orientation');
        document.body.classList.add(`${orientation}-orientation`);
      }
      
      // Обновляем состояние
      setDeviceInfo({
        deviceType,
        orientation,
        isMobile: deviceType === "mobile",
        isTablet: deviceType === "tablet",
        isDesktop: deviceType === "desktop",
        isPortrait,
        isLandscape: !isPortrait,
      });
    };
    
    // Начальное определение
    detectDevice();
    
    // Слушаем изменения размеров окна и ориентации
    window.addEventListener("resize", detectDevice);
    window.addEventListener("orientationchange", detectDevice);
    
    // Очистка
    return () => {
      window.removeEventListener("resize", detectDevice);
      window.removeEventListener("orientationchange", detectDevice);
    };
  }, []);

  return (
    <DeviceContext.Provider value={deviceInfo}>
      {children}
    </DeviceContext.Provider>
  );
};

// Хук для использования контекста
export const useDevice = () => useContext(DeviceContext);

// Компонент для рендеринга по типу устройства
interface DeviceRenderProps {
  mobile?: ReactNode;
  tablet?: ReactNode;
  desktop?: ReactNode;
  default?: ReactNode;
}

export const DeviceRender: React.FC<DeviceRenderProps> = ({ 
  mobile, 
  tablet, 
  desktop, 
  default: defaultContent 
}) => {
  const { deviceType } = useDevice();
  
  if (deviceType === "mobile" && mobile) return <>{mobile}</>;
  if (deviceType === "tablet" && tablet) return <>{tablet}</>;
  if (deviceType === "desktop" && desktop) return <>{desktop}</>;
  
  return <>{defaultContent}</>;
};

export default DeviceProvider;
