'use client';

import React, { useEffect } from 'react';
import { registerServiceWorker } from './sw-register';

// Helper function outside of component to handle service worker setup
const setupServiceWorker = async () => {
  let swRegistration: ServiceWorkerRegistration | null = null;
  
  try {
    // First check if we already have an active controller
    if (navigator.serviceWorker.controller) {
      console.log('Service worker is already controlling this page');
      
      // Check if we need to update the registration
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration?.active) {
        swRegistration = existingRegistration;
        console.log('Using existing service worker registration');
        return existingRegistration;
      }
    }
    
    // Register or update service worker
    swRegistration = await registerServiceWorker();
    console.log('Service worker registration successful');
    
    // Handle service worker updates
    if (swRegistration) {
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration?.installing;
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
    
    return swRegistration;
  } catch (error) {
    console.error('Service worker initialization failed:', error);
    return null;
  }
};

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Register service worker on client side only
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      let initialized = false;
      
      // Initial setup using the helper function
      setupServiceWorker().then(() => {
        initialized = true;
      });
      
      // Check for updates periodically (every 6 hours)
      const interval = setInterval(() => {
        if (
          'serviceWorker' in navigator && 
          navigator.serviceWorker.controller && 
          initialized && 
          navigator.onLine // Only try to update when online
        ) {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATES' });
        }
      }, 6 * 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // This component doesn't render anything
  return null;
}
