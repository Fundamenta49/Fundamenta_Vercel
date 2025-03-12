
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
}

export function YouTubeVideo({ videoId, title }: YouTubeVideoProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    const validateVideo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/youtube/validate?videoId=${videoId}`);
        const data = await response.json();
        setIsValid(data.isValid);
      } catch (e) {
        console.error("Error validating YouTube video:", e);
        setError("Failed to validate video");
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateVideo();
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-slate-100 animate-pulse flex items-center justify-center rounded-md">
        <span className="text-slate-400">Loading video...</span>
      </div>
    );
  }

  if (!isValid) {
    return (
      <Alert className="my-2 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-800">
          {error || "This video is currently unavailable."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full aspect-video rounded-md overflow-hidden">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
