import React, { useState, useEffect } from 'react';
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// Utility function for class names
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cache priority levels
enum CachePriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

interface CachedImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: keyof typeof CachePriority;
  loadingColor?: string;
  preload?: boolean;
  imgClassName?: string;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

/**
 * CachedImage Component
 * 
 * An enhanced image component that improves the user experience
 * by handling loading states, errors, and providing fallbacks.
 */
export function CachedImage({
  src,
  alt,
  fallbackSrc = '',
  priority = 'NORMAL',
  loadingColor = '#f3f4f6',
  preload = false,
  className,
  imgClassName,
  onImageLoad,
  onImageError,
  ...props
}: CachedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(src);

  // Handle image loading
  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    setError(false);

    // Create a new image object
    const img = new Image();
    
    img.onload = () => {
      if (mounted) {
        setImageSrc(src);
        setLoaded(true);
        onImageLoad?.();
      }
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      if (mounted) {
        setError(true);
        if (fallbackSrc) {
          setImageSrc(fallbackSrc);
          setLoaded(true);
        }
        onImageError?.();
      }
    };
    
    img.src = src;

    return () => {
      mounted = false;
    };
  }, [src, fallbackSrc, preload, onImageLoad, onImageError]);

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
          imgClassName
        )}
        loading={preload ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          if (fallbackSrc && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
          }
          onImageError?.();
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