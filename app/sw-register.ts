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
        // Set up background sync only when service worker is active
        await setupBackgroundSync(registration);
      } else {
        console.log('Service worker registered in state:', registration.installing ? 'installing' : 'waiting');
        
        // Wait for the service worker to become active before registering sync
        if (registration.installing) {
          registration.installing.addEventListener('statechange', (event) => {
            if ((event.target as ServiceWorker).state === 'activated') {
              setupBackgroundSync(registration);
            }
          });
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
      throw error;
    }
  }
  throw new Error('Service workers are not supported in this browser');
}

// Separate function to setup background sync
async function setupBackgroundSync(registration: ServiceWorkerRegistration) {
  try {
    // Check if SyncManager is available in the browser
    // @ts-ignore: TypeScript doesn't know about the SyncManager interface
    if (typeof window !== 'undefined' && 'SyncManager' in window) {
      // Make sure the sync API is available on the registration
      // @ts-ignore: TypeScript doesn't know about the sync API
      if (registration.sync) {
        // Wait a moment to ensure service worker is fully activated
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // TypeScript doesn't know about the sync API, so we need to use a type assertion
          // Use a plain try/catch inside to avoid failing the entire setup if sync fails
          // @ts-ignore: TypeScript doesn't know about the sync API
          await registration.sync.register('sync-shopping-lists');
          console.log('Background sync registered successfully');
        } catch (syncError) {
          console.error('Background sync registration failed:', syncError);
          console.log('Falling back to regular online operations');
        }
      } else {
        console.log('Sync API not available on service worker registration');
      }
    } else {
      console.log('SyncManager not supported in this browser, using fallback');
    }
  } catch (error) {
    // Catch any other unexpected errors in the sync setup process
    console.error('Error in setupBackgroundSync:', error);
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
