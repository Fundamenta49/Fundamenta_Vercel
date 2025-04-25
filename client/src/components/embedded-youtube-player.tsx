import React from 'react';

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
  return (
    <iframe
      className={className}
      width={width}
      height={height}
      src={`https://www.youtube.com/embed/${videoId}`}
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