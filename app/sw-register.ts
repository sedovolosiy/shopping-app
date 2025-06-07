'use client';

/**
 * Service Worker Registration
 * This script registers a service worker for offline capabilities,
 * caching, and push notifications.
 */

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      // Check if service worker was successfully registered
      if (registration.active) {
        console.log('Service worker is active');
      } else {
        console.log('Service worker registered in state:', registration.scope);
      }
      
      // Set up background sync
      // Check for background sync support
      if ('sync' in registration) {
        try {
          // TypeScript doesn't know about the sync API, so we need to use a type assertion
          await (registration as any).sync.register('sync-shopping-lists');
          console.log('Background sync registered');
        } catch (error) {
          console.error('Background sync registration failed:', error);
        }
      }
      
      // Set up push notifications
      if ('PushManager' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted');
            // Could subscribe to push service here
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
        }
      }
      
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const result = await registration.unregister();
        if (result) {
          console.log('Service worker unregistered');
        } else {
          console.log('Service worker could not be unregistered');
        }
      }
    } catch (error) {
      console.error('Error unregistering service worker:', error);
    }
  }
}

// Check for service worker updates
export async function checkForServiceWorkerUpdates() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service worker updated');
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  }
}
