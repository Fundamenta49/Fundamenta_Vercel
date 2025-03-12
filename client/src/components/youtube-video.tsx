import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeVideo({ videoId, title, className = '' }: YouTubeVideoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any>(null);

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
    
    // We'll skip the validation to avoid potential API issues
    console.log(`Rendering video with ID: ${cleanVideoId}`);

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

  // Always attempt to display the video, regardless of validation
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${cleanVideoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
          title={title || `YouTube Video ${cleanVideoId}`}
          onError={(e) => {
            console.error("Video failed to load:", cleanVideoId);
            setError("Video unavailable. Please try another video ID.");
          }}
        />
      </div>
      {error && (
        <Alert className="mt-2 bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}