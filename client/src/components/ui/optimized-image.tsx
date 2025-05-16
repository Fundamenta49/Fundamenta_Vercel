import React, { useState } from 'react';
import { getVersionedImageSrc } from '@/lib/cache-utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  blurhash?: string; // Optional blurhash for progressive loading effect
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  blurhash,
  className,
  loading = 'lazy', // Default to lazy loading
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Handle error in image loading
  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setError(true);
  };
  
  // Handle successful image load
  const handleLoad = () => {
    setLoaded(true);
  };
  
  // Determine the final source URL
  const imageSource = error ? fallbackSrc : (src ? getVersionedImageSrc(src) : fallbackSrc);
  
  // Don't render anything if no source is available
  if (!imageSource) {
    return null;
  }
  
  return (
    <div className="relative">
      {/* Show blurhash placeholder while loading if provided */}
      {blurhash && !loaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(data:image/svg+xml;base64,${blurhash})`,
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      )}
      
      {/* The actual image */}
      <img
        src={imageSource}
        alt={alt || 'Image'}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        className={className}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;