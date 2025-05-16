/**
 * Client-side cache utilities to work with the server's cache versioning
 */

/**
 * Append a cache-busting version parameter to a URL
 * Use this for resources that need to be refreshed when updated
 */
export function appendCacheVersion(url: string, version?: string): string {
  // If no version provided, use the current timestamp as version
  const cacheVersion = version || Date.now().toString(36);
  
  // Add version parameter to URL
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${cacheVersion}`;
}

/**
 * Creates a versioned URL for an image source
 * @param src - The image source URL
 * @returns A cache-versioned URL
 */
export function getVersionedImageSrc(src: string): string {
  // Only add version for relative URLs (not external CDNs)
  if (src.startsWith('/')) {
    return appendCacheVersion(src);
  }
  return src;
}

/**
 * Store a resource in the browser's cache
 * @param key - Cache key
 * @param data - Data to cache
 * @param expirationMinutes - Optional cache duration in minutes
 */
export async function cacheResource(key: string, data: any, expirationMinutes = 60): Promise<void> {
  try {
    const cacheItem = {
      data,
      expiration: Date.now() + (expirationMinutes * 60 * 1000)
    };
    
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Failed to cache resource:', error);
  }
}

/**
 * Retrieve a resource from the browser's cache
 * @param key - Cache key
 * @returns The cached data or null if not found or expired
 */
export function getCachedResource<T>(key: string): T | null {
  try {
    const cacheItemJson = localStorage.getItem(`cache_${key}`);
    if (!cacheItemJson) return null;
    
    const cacheItem = JSON.parse(cacheItemJson);
    
    // Check if cache has expired
    if (cacheItem.expiration < Date.now()) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    
    return cacheItem.data as T;
  } catch (error) {
    console.error('Failed to retrieve cached resource:', error);
    return null;
  }
}

/**
 * Clear a specific item from the cache
 * @param key - Cache key to clear
 */
export function clearCacheItem(key: string): void {
  try {
    localStorage.removeItem(`cache_${key}`);
  } catch (error) {
    console.error('Failed to clear cache item:', error);
  }
}

/**
 * Clear all cached resources
 */
export function clearAllCache(): void {
  try {
    // Only clear items that start with our cache prefix
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}