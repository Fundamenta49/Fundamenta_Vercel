import { useState, useEffect } from 'react';
import { getCachedData, setCachedData } from '@/lib/cache-utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  cacheKey?: string;
  cacheNamespace?: string;
  cacheTtl?: number;
  lowQualityPlaceholder?: string;
  lazyLoad?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component that implements performance improvements:
 * - Caching images in localStorage (where appropriate)
 * - Low-quality image placeholders
 * - Lazy loading
 * - Error handling with fallbacks
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  cacheKey,
  cacheNamespace = 'images',
  cacheTtl = 60 * 60 * 1000, // 1 hour default
  lowQualityPlaceholder,
  lazyLoad = true,
  className,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(lowQualityPlaceholder || src);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Generate a cache key if not provided
  const actualCacheKey = cacheKey || `img:${src.split('/').pop()}`;
  
  // Only SVGs and small images < 10KB should be cached in localStorage
  const isCacheable = (dataUrl: string): boolean => {
    // Cache SVGs
    if (src.endsWith('.svg') || dataUrl.includes('image/svg+xml')) {
      return true;
    }
    
    // Only cache small images to avoid localStorage quota issues
    const estimatedSize = (dataUrl.length * 3) / 4; // base64 size estimate
    return estimatedSize < 10 * 1024; // < 10KB
  };
  
  useEffect(() => {
    if (!src) return;
    
    // Check for cached version first
    const cachedImage = getCachedData<string>(actualCacheKey, {
      namespace: cacheNamespace,
    });
    
    if (cachedImage) {
      setImageSrc(cachedImage);
      setIsLoaded(true);
      onLoad?.();
      return;
    }
    
    // If not in cache and we have a lowQualityPlaceholder, start with that
    if (lowQualityPlaceholder && !isLoaded) {
      setImageSrc(lowQualityPlaceholder);
    }
    
    // Then load the full image
    const img = new Image();
    
    // Set up loading handler
    img.onload = async () => {
      setImageSrc(src);
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
      
      // Try to cache the image for future use
      try {
        // Only try to cache if it's an appropriate size
        if (isCacheable(src)) {
          // For SVGs and other small assets, try to fetch and store as data URL
          const response = await fetch(src);
          const blob = await response.blob();
          
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            
            if (isCacheable(dataUrl)) {
              setCachedData(actualCacheKey, dataUrl, {
                namespace: cacheNamespace,
                ttl: cacheTtl,
              });
            }
          };
        }
      } catch (error) {
        console.error('Failed to cache image:', error);
      }
    };
    
    // Set up error handler
    img.onerror = () => {
      setHasError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
      onError?.();
    };
    
    // Start loading
    img.src = src;
    
    // If using lazy loading and the browser supports it
    if (lazyLoad && 'loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
    }
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc, actualCacheKey, cacheNamespace, cacheTtl, lowQualityPlaceholder, lazyLoad, onLoad, onError]);
  
  return (
    <img
      src={hasError && fallbackSrc ? fallbackSrc : imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-70'}`}
      loading={lazyLoad ? 'lazy' : undefined}
      {...props}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setHasError(true);
        onError?.();
      }}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        ...props.style,
      }}
    />
  );
}