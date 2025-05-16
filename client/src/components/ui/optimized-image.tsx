import React, { useState, useEffect } from 'react';
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// Bring in our own version of the cn utility
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define cache priority levels to match those in cache-utils.js
const CACHE_PRIORITY = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
  CRITICAL: 3
} as const;

// Simple implementation of image caching for our component
const cacheImage = (src: string, options: any = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(src);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
};

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: keyof typeof CACHE_PRIORITY;
  loadingColor?: string;
  preload?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * An enhanced image component that optimizes image loading using caching,
 * lazy loading, and providing improved user experience with loading states.
 * 
 * Features:
 * - Automatic image caching for faster repeat views
 * - Smooth loading transitions
 * - Fallback image support
 * - Prioritized loading for important images
 * - Lazy loading support
 * - Detailed error handling
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '',
  priority = 'NORMAL',
  loadingColor = '#f3f4f6',
  preload = false,
  className,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(src);

  // Handle image loading with caching
  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    setError(false);

    // If we should preload or the component is mounted, cache the image
    if (preload || mounted) {
      cacheImage(src, {
        priority: CACHE_PRIORITY[priority],
      })
        .then((cachedSrc) => {
          if (mounted) {
            setImageSrc(cachedSrc);
            setLoaded(true);
            onLoad?.();
          }
        })
        .catch((err) => {
          console.warn(`Failed to load image: ${src}`, err);
          if (mounted) {
            setError(true);
            if (fallbackSrc) {
              setImageSrc(fallbackSrc);
              setLoaded(true);
            }
            onError?.();
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, [src, fallbackSrc, priority, preload, onLoad, onError]);

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {!loaded && !error && (
        <div 
          className="absolute inset-0 animate-pulse" 
          style={{ backgroundColor: loadingColor }}
          aria-hidden="true"
        />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading={preload ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          if (fallbackSrc && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
          }
          onError?.();
        }}
      />
      
      {error && !fallbackSrc && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      )}
    </div>
  );
}