/**
 * Optimized Image Component
 * 
 * An enhanced image component with:
 * - Lazy loading
 * - Blur-up loading effect
 * - Responsive sizing
 * - Error handling
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const defaultPlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23f0f0f0"/%3E%3C/svg%3E';

/**
 * OptimizedImage component with lazy loading and progressive loading
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  placeholderSrc,
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(priority ? src : placeholderSrc || defaultPlaceholder);
  
  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images
    
    const imgElement = document.getElementById(`optimized-img-${props.id || Math.random().toString(36).substring(2, 9)}`);
    
    if (!imgElement) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImgSrc(src);
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading when within 200px of viewport
      threshold: 0.01
    });
    
    observer.observe(imgElement);
    
    return () => {
      observer.disconnect();
    };
  }, [src, priority, props.id]);
  
  // Handle image load events
  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };
  
  // Handle image error events
  const handleError = (e) => {
    setError(true);
    console.error('Image failed to load:', src);
    onError?.(e);
  };
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{
        width: width || '100%',
        height: height || 'auto',
        backgroundColor: '#f0f0f0',
      }}
    >
      <img
        id={`optimized-img-${props.id || Math.random().toString(36).substring(2, 9)}`}
        src={imgSrc}
        alt={alt || 'Image'}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          objectFit === 'cover' && 'object-cover w-full h-full',
          objectFit === 'contain' && 'object-contain',
          error && 'hidden'
        )}
        {...props}
      />
      
      {/* Placeholder visible until image loads */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.5 8.25H13.51M4.5 21.75h15a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 7.5v12a2.25 2.25 0 0 0 2.25 2.25Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m2.25 17.25 5.25-5.25a2.25 2.25 0 0 1 3 0l5.25 5.25M14.25 13.5l.75-.75a2.25 2.25 0 0 1 3 0l3.75 3.75"
            />
          </svg>
        </div>
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Image failed to load</p>
        </div>
      )}
    </div>
  );
}

/**
 * Background image component with lazy loading
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  className,
  children,
  overlay = true,
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  priority = false,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [bgSrc, setBgSrc] = useState(priority ? src : null);
  
  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images
    
    const element = document.getElementById(`bg-img-${props.id || Math.random().toString(36).substring(2, 9)}`);
    
    if (!element) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setBgSrc(src);
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading when within 200px of viewport
      threshold: 0.01
    });
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [src, priority, props.id]);
  
  // Handle background image loading
  useEffect(() => {
    if (!bgSrc) return;
    
    const img = new Image();
    img.src = bgSrc;
    img.onload = () => setLoaded(true);
    
    return () => {
      img.onload = null;
    };
  }, [bgSrc]);
  
  return (
    <div
      id={`bg-img-${props.id || Math.random().toString(36).substring(2, 9)}`}
      className={cn(
        'relative bg-gray-100 overflow-hidden',
        loaded && 'bg-cover bg-center',
        className
      )}
      style={{
        backgroundImage: loaded ? `url(${bgSrc})` : 'none',
        transition: 'background-image 0.3s ease-in-out',
      }}
      {...props}
    >
      {/* Dark overlay for better text readability */}
      {loaded && overlay && (
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: overlayColor }}
        />
      )}
      
      {/* Loading state */}
      {!loaded && bgSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.5 8.25H13.51M4.5 21.75h15a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 7.5v12a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
      )}
      
      {/* Content */}
      <div className={cn('relative z-10')}>
        {children}
      </div>
    </div>
  );
}

/**
 * Avatar image component with fallback
 */
export function OptimizedAvatar({
  src,
  alt,
  size = 'md',
  className,
  fallback,
  ...props
}) {
  const [error, setError] = useState(!src);
  
  // Size map
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };
  
  // Get initials from alt text for fallback
  const getInitials = () => {
    if (!alt) return '?';
    
    const words = alt.split(' ');
    if (words.length === 1) {
      return alt.substring(0, 2).toUpperCase();
    }
    
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  
  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-primary-100 flex items-center justify-center text-primary-700 font-medium',
        sizeMap[size] || sizeMap.md,
        className
      )}
      {...props}
    >
      {/* Show image if available and no error */}
      {src && !error && (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      )}
      
      {/* Show fallback or initials if no image or error */}
      {(!src || error) && (
        <>
          {fallback || getInitials()}
        </>
      )}
    </div>
  );
}