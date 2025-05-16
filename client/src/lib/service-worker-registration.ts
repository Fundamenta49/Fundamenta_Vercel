/**
 * Service worker registration script
 * 
 * This utility handles registering and updating the service worker
 * to enable advanced caching and offline functionality.
 */

/**
 * Register the service worker for caching and offline support
 * @returns Promise that resolves when registration is complete
 */
export async function registerServiceWorker(): Promise<void> {
  // Only register in production and if service workers are supported
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      // Check if service worker was installed successfully
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed and waiting');
      } else if (registration.active) {
        console.log('Service worker active');
      }
      
      // Set up update checking
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check for updates every hour
      
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  } else {
    console.info('Service workers are not supported in this browser');
  }
}

/**
 * Check if the app is being used offline
 * @returns Boolean indicating online status
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Add event listeners for online/offline status changes
 * @param onlineCallback - Function to call when online
 * @param offlineCallback - Function to call when offline
 */
export function addConnectivityListeners(
  onlineCallback: () => void,
  offlineCallback: () => void
): void {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
}

/**
 * Remove event listeners for online/offline status changes
 * @param onlineCallback - Function to call when online
 * @param offlineCallback - Function to call when offline
 */
export function removeConnectivityListeners(
  onlineCallback: () => void,
  offlineCallback: () => void
): void {
  window.removeEventListener('online', onlineCallback);
  window.removeEventListener('offline', offlineCallback);
}

// Automatically register the service worker
registerServiceWorker();