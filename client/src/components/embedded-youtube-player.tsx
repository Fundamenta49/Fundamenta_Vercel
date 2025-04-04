import React, { useState, useEffect, useRef } from 'react';

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
  const [processedVideoId, setProcessedVideoId] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Process and validate videoId when it changes
  useEffect(() => {
    setError(false);
    setLoading(true);
    
    if (!videoId || videoId.trim() === '') {
      console.error('Empty videoId provided to EmbeddedYouTubePlayer');
      setError(true);
      return;
    }
    
    // Extract video ID from URLs if needed, or use as is if it's already just an ID
    let extractedId = videoId.trim();
    
    // Handle different YouTube URL formats
    if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
      try {
        // youtube.com/watch?v=VIDEO_ID
        if (videoId.includes('watch?v=')) {
          const urlParts = videoId.split('watch?v=');
          if (urlParts.length > 1) {
            extractedId = urlParts[1].split('&')[0];
          }
        } 
        // youtu.be/VIDEO_ID
        else if (videoId.includes('youtu.be/')) {
          extractedId = videoId.split('youtu.be/')[1]?.split('?')[0] || '';
        }
        // youtube.com/embed/VIDEO_ID
        else if (videoId.includes('/embed/')) {
          extractedId = videoId.split('/embed/')[1]?.split('?')[0] || '';
        }
      } catch (e) {
        console.error('Error parsing YouTube URL:', e);
      }
    }
    
    // Validate that we have a proper video ID (typically 11 characters)
    if (extractedId && extractedId.length >= 10) {
      console.log(`EmbeddedYouTubePlayer: processed videoId from ${videoId} to ${extractedId}`);
      setProcessedVideoId(extractedId);
    } else {
      console.error('Invalid YouTube video ID:', extractedId, 'from original:', videoId);
      setError(true);
    }
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
      origin: origin,
      enablejsapi: '1' // Enable JavaScript API
    });

    if (autoplay) {
      params.append('autoplay', '1');
    }

    // Always use the processed ID to ensure proper formatting
    return `https://www.youtube.com/embed/${processedVideoId}?${params.toString()}`;
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{ width, height }}
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
            href={`https://www.youtube.com/watch?v=${processedVideoId || videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            Try watching on YouTube
          </a>
        </div>
      ) : processedVideoId ? (
        <iframe
          ref={iframeRef}
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
      ) : null}
    </div>
  );
};