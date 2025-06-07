"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface InstallPromptProps {
  appName?: string;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({
  appName = "Умный помощник для покупок"
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Check if the app is already installed
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is in standalone mode (PWA installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsAppInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      
      // Don't show the prompt immediately, wait a bit for better UX
      setTimeout(() => {
        // Check if user hasn't dismissed the prompt yet
        const hasPromptBeenDismissed = localStorage.getItem('installPromptDismissed');
        if (!hasPromptBeenDismissed) {
          setIsVisible(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the deferred prompt regardless of outcome
    setDeferredPrompt(null);
    setIsVisible(false);
    
    // Optionally track the outcome
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // You could send analytics here
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember this dismissal for a while (e.g. 7 days)
    const now = new Date();
    const expiry = now.getTime() + 7 * 24 * 60 * 60 * 1000; // 7 days
    localStorage.setItem('installPromptDismissed', expiry.toString());
  };

  // Don't render if already installed or if we don't have anything to show
  if (isAppInstalled || !isVisible) return null;

  return (
    <motion.div 
      className="install-prompt"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25 }}
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">Установите {appName}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Установите приложение для быстрого доступа без браузера
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleInstall}
          variant="default"
          className="bg-primary text-white"
        >
          Установить
        </Button>
        
        <button
          onClick={handleDismiss}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default InstallPrompt;
