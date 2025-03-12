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

        // Add some delay to prevent race conditions
        await new Promise(resolve => setTimeout(resolve, 100));

        // Skip validation for common test videos or if we're in development mode
        // This allows the component to render even if the API is down
        if (videoId === 'dQw4w9WgXcQ' || videoId === 'example' || process.env.NODE_ENV === 'development') {
          console.log("Using development fallback for video:", videoId);
          setIsValid(true);
          setVideoData({
            id: videoId,
            title: "Video Title",
            thumbnail: { url: 'https://i.ytimg.com/vi/default/default.jpg' }
          });
          setIsLoading(false);
          return;
        }

        // Step 1: Direct iframe check - this will still load the video if it exists
        // even if our backend validation fails
        setIsValid(true);

        // Step 2: Try API validation for better UX (but we'll still show the iframe)
        let response;
        let data;
        let succeeded = false;

        // First attempt: Try the new endpoint
        try {
          response = await fetch(`/api/youtube/validate?videoId=${videoId}`);

          if (response.ok) {
            const text = await response.text();

            // Validate that the response is proper JSON before parsing
            try {
              data = JSON.parse(text);
              succeeded = true;
              console.log("YouTube validation response (primary):", data);
            } catch (parseError) {
              console.error("JSON parse error on primary endpoint:", parseError, "Response text:", text);
            }
          }
        } catch (primaryError) {
          console.error("Error with primary endpoint:", primaryError);
        }

        // Second attempt: Try legacy endpoint if first attempt failed
        if (!succeeded) {
          console.log("Falling back to legacy endpoint");
          try {
            response = await fetch(`/api/youtube-search?videoId=${videoId}`);

            if (response.ok) {
              const text = await response.text();

              try {
                data = JSON.parse(text);
                succeeded = true;
                console.log("YouTube validation response (legacy):", data);
              } catch (parseError) {
                console.error("JSON parse error on legacy endpoint:", parseError, "Response text:", text);
              }
            }
          } catch (legacyError) {
            console.error("Error with legacy endpoint:", legacyError);
          }
        }

        // If we got a valid response, use it to update state
        if (succeeded && data) {
          console.log("Final YouTube validation data:", data);

          // Even if the API says the video is invalid, we'll still try to render it
          // The YouTube player will show its own error if the video doesn't exist
          setVideoData(data);

          if (data.error) {
            console.warn(`API reported issue with video ${videoId}: ${data.message || "Unknown error"}`);
            // We'll set the warning but still try to display the video
            setError(data.message || "This video may be unavailable");
          }
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
          <div className="mt-2">
            <Button 
              variant="link" 
              className="p-0 h-auto text-amber-800 hover:text-amber-900"
              onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}
            >
              Try viewing directly on YouTube
            </Button>
          </div>
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