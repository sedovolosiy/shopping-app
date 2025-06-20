"use client";

import React from "react";
import { useDevice } from "@/components/device-detector";
import TabletNavigation from "@/components/tablet-navigation";

interface TabletLayoutProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSettings: () => void;
  children: React.ReactNode;
  currentUserId?: string;
}

const TabletLayout: React.FC<TabletLayoutProps> = ({
  activeTab,
  onChangeTab,
  onOpenSettings,
  children,
  currentUserId,
}) => {
  const { orientation } = useDevice();
  const isLandscape = orientation === 'landscape';

  return (
    <div className="tablet-device h-screen w-screen overflow-hidden">
      <TabletNavigation
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        onOpenSettings={onOpenSettings}
        isLoggedIn={!!currentUserId}
      />
      
      <main 
        className={`
          ${isLandscape ? 'ml-20' : 'mb-20'}
          h-full overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800
        `}
      >
        <div className={`
          max-w-4xl mx-auto p-6 
          ${isLandscape ? 'h-full pt-8' : 'h-full pb-24'}
        `}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default TabletLayout;
