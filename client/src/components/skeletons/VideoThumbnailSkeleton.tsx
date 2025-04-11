import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface VideoThumbnailSkeletonProps {
  className?: string;
  aspectRatio?: "square" | "video" | "vertical";
  showTitle?: boolean;
  showChannel?: boolean;
}

/**
 * A skeleton loader for video thumbnails
 * 
 * @param className Additional classes to apply to the component
 * @param aspectRatio The aspect ratio of the thumbnail ("square" | "video" | "vertical")
 * @param showTitle Whether to show a title placeholder
 * @param showChannel Whether to show a channel name placeholder
 */
export function VideoThumbnailSkeleton({
  className = "",
  aspectRatio = "video",
  showTitle = true,
  showChannel = true,
}: VideoThumbnailSkeletonProps) {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "vertical":
        return "aspect-[9/16]";
      default:
        return "aspect-video";
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <Skeleton className={`w-full ${getAspectRatioClass()}`} />
      <CardContent className="p-3">
        {showTitle && (
          <Skeleton className="h-5 w-full mb-2" />
        )}
        {showChannel && (
          <div className="flex items-center">
            <Skeleton className="h-6 w-6 rounded-full mr-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}