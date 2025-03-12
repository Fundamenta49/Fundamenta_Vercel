import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  className?: string;
  topic?: string;
}

export function YouTubeVideo({ videoId, title, className = '', topic }: YouTubeVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [fallbackVideoId, setFallbackVideoId] = useState<string | null>(null);

  // Extract video ID from URL if needed
  const cleanVideoId = videoId?.includes('youtube.com') || videoId?.includes('youtu.be') 
    ? videoId.includes('v=')
      ? videoId.split('v=')[1]?.split('&')[0]
      : videoId.split('/').pop()
    : videoId;

  useEffect(() => {
    if (!cleanVideoId) {
      setIsLoading(false);
      setError("No video ID provided");
      return;
    }
    
    // If there's a topic and the video fails, we can search for a replacement
    if (topic && !fallbackVideoId) {
      const checkVideo = async () => {
        try {
          setIsLoading(true);
          // First try loading with the provided ID
          console.log(`Rendering video with ID: ${cleanVideoId}`);
          setIsLoading(false);
        } catch (err) {
          console.error("Error loading video:", err);
          
          // If loading fails, try to find a replacement video
          try {
            console.log(`Attempting to find replacement video for topic: ${topic}`);
            const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(topic + " guide")}`);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
              const newVideoId = data.items[0].id.videoId;
              console.log(`Found replacement video: ${newVideoId}`);
              setFallbackVideoId(newVideoId);
            } else {
              setError("Could not find a replacement video");
            }
          } catch (searchErr) {
            console.error("Error finding replacement:", searchErr);
            setError("Video unavailable and could not find replacement");
          } finally {
            setIsLoading(false);
          }
        }
      };
      
      checkVideo();
    } else {
      setIsLoading(false);
    }
  }, [cleanVideoId, topic, fallbackVideoId]);

        // Always try to fetch metadata for better UX, but don't block rendering
        try {
          const response = await fetch(`/api/youtube/validate?videoId=${cleanVideoId}`);
          if (response.ok) {
            const data = await response.json();
            setVideoData(data);
            if (data.error) {
              console.warn(`API reported issue with video ${cleanVideoId}: ${data.message || "Unknown error"}`);
              setError(data.message || "This video may be unavailable");
            }
          }
        } catch (apiError) {
          console.error("API validation error:", apiError);
          // Continue anyway - we'll still try to display the video
        }
      } catch (e) {
        console.error("Error processing video ID:", e);
      } finally {
        setIsLoading(false);
      }
    };

    validateVideo();
  }, [cleanVideoId]);

  if (isLoading) {
    return (
      <div className={`w-full aspect-video bg-slate-100 animate-pulse flex items-center justify-center rounded-md ${className}`}>
        <span className="text-slate-400">Loading video...</span>
      </div>
    );
  }

  // Try to display the video - use fallback if available and primary fails
  const videoIdToUse = fallbackVideoId || cleanVideoId;
  
  return (
    <div className={`space-y-2 ${className}`}>
      {isLoading ? (
        <div className="aspect-video w-full flex items-center justify-center bg-gray-100 rounded-md">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoIdToUse}?rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-md"
            title={title || `YouTube Video ${videoIdToUse}`}
            onError={(e) => {
              console.error("Video failed to load:", videoIdToUse);
              if (!fallbackVideoId && videoIdToUse === cleanVideoId) {
                setError("Video unavailable. Please try another video.");
              } else if (fallbackVideoId) {
                setError("All video options unavailable at this time.");
              }
            }}
          />
        </div>
      )}
      {error && (
        <Alert className="mt-2 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
      {fallbackVideoId && videoIdToUse === fallbackVideoId && !error && (
        <Alert className="mt-2 bg-blue-50 border-blue-200">
          <InfoCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800">
            Original video was unavailable, showing alternative content.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}