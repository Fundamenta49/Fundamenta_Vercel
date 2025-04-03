import React, { useState, useEffect } from 'react';

interface EmbeddedYouTubePlayerProps {
  videoId: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  autoplay?: boolean;
  onError?: () => void;
  onPlay?: () => void;
}

export const EmbeddedYouTubePlayer: React.FC<EmbeddedYouTubePlayerProps> = ({
  videoId,
  title = 'YouTube video player',
  width = '100%',
  height = '100%',
  className = '',
  autoplay = false,
  onError,
  onPlay
}) => {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Reset error state if videoId changes
  useEffect(() => {
    setError(false);
    setLoading(true);
    console.log(`EmbeddedYouTubePlayer mounted with videoId: ${videoId}`);
  }, [videoId]);

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log(`YouTube iframe loaded for video ID: ${videoId}`);
    setLoading(false);
    if (onPlay) onPlay();
  };

  // Handle iframe error
  const handleIframeError = () => {
    console.error(`Error loading YouTube iframe for video ID: ${videoId}`);
    setError(true);
    setLoading(false);
    if (onError) onError();
  };

  // Create proper YouTube embed URL with origin
  const createYouTubeEmbedUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      rel: '0', // Don't show related videos
      modestbranding: '1', // Minimal YouTube branding
      origin: origin
    });

    if (autoplay) {
      params.append('autoplay', '1');
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  return (
    <div 
      className={`relative aspect-video ${className}`}
      style={{ width, height: 'auto' }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-learning-color"></div>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">Video unavailable</p>
          <a 
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            Try watching on YouTube
          </a>
        </div>
      ) : (
        <iframe
          src={createYouTubeEmbedUrl()}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
    </div>
  );
};