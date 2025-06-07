'use client';

import React, { useEffect } from 'react';
import { registerServiceWorker } from './sw-register';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Register service worker on client side only
    if (typeof window !== 'undefined') {
      registerServiceWorker()
        .then((registration) => {
          console.log('Service worker registration successful');
          
          // Handle service worker updates
          if (registration) {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Show "update available" notification or prompt
                    console.log('New service worker version installed');
                  }
                });
              }
            });
          }
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error);
        });
        
      // Check for updates periodically (every 6 hours)
      const interval = setInterval(() => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATES' });
        }
      }, 6 * 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // This component doesn't render anything
  return null;
}
