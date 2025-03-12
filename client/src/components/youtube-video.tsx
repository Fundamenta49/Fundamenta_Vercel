
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeVideo({ videoId, title, className = '' }: YouTubeVideoProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    if (!videoId) {
      setIsValid(false);
      setIsLoading(false);
      setError("No video ID provided");
      return;
    }

    const validateVideo = async () => {
      setIsLoading(true);
      try {
        console.log(`Validating video ID: ${videoId}`);
        // Try the new endpoint first
        let response = await fetch(`/api/youtube/validate?videoId=${videoId}`);

        if (!response.ok) {
          // Fall back to legacy endpoint if the new one fails
          console.log("Falling back to legacy endpoint");
          response = await fetch(`/api/youtube-search?videoId=${videoId}`);

          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
        }

        // Safely parse the response JSON
        let data;
        try {
          data = await response.json();
        } catch (err) {
          console.error("Error parsing JSON response:", err);
          throw new Error("Invalid response format");
        }
        
        console.log("YouTube validation response:", data);

        // Set state based on response
        setIsValid(!data.error);
        setVideoData(data);

        if (data.error) {
          setError(data.message || "This video is unavailable");
          setIsValid(false);
        }
      } catch (e) {
        console.error("Error validating YouTube video:", e);
        setError("Failed to validate video: " + (e instanceof Error ? e.message : "Unknown error"));
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateVideo();
  }, [videoId]);

  if (isLoading) {
    return (
      <div className={`w-full aspect-video bg-slate-100 animate-pulse flex items-center justify-center rounded-md ${className}`}>
        <span className="text-slate-400">Loading video...</span>
      </div>
    );
  }

  if (!isValid) {
    return (
      <Alert className="my-2 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-800">
          Video resource currently unavailable. {error && `Reason: ${error}`}
        </AlertDescription>
        {videoId && (
          <Button 
            variant="link" 
            className="p-0 mt-1 h-auto text-amber-800 hover:text-amber-900"
            onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}
          >
            Try viewing directly on YouTube
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {title && <h3 className="font-medium mb-2 text-sm">{title}</h3>}
      <div className="relative aspect-video">
        <iframe
          className="absolute inset-0 w-full h-full rounded-md"
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
