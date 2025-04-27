import React, { useState, useEffect } from 'react';

interface EmbeddedYoutubePlayerProps {
  videoId: string;
  title: string;
  width?: string;
  height?: string;
  className?: string;
  onError?: () => void;
}

export function EmbeddedYouTubePlayer({ 
  videoId, 
  title,
  width = "100%",
  height = "100%",
  className = "",
  onError
}: EmbeddedYoutubePlayerProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile view on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add additional parameters for better mobile experience
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  
  return (
    <iframe
      className={className}
      width={width}
      height={height}
      src={embedUrl}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      onError={onError}
    ></iframe>
  );
}

// Export both named and default for compatibility
export default EmbeddedYouTubePlayer;