import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

interface VideoThumbnailSkeletonProps {
  aspectRatio?: "square" | "video";
  hasTitle?: boolean;
  hasChannel?: boolean;
  hasDescription?: boolean;
  hasAction?: boolean;
  className?: string;
}

/**
 * A skeleton loader specifically for video thumbnails and content
 * 
 * @param aspectRatio Aspect ratio of the thumbnail ("square" or "video" for 16:9)
 * @param hasTitle Whether to show a title skeleton
 * @param hasChannel Whether to show a channel name skeleton
 * @param hasDescription Whether to show a description skeleton
 * @param hasAction Whether to show a button skeleton
 * @param className Additional classes for the container
 */
export function VideoThumbnailSkeleton({
  aspectRatio = "video",
  hasTitle = true,
  hasChannel = true,
  hasDescription = true,
  hasAction = true,
  className = "",
}: VideoThumbnailSkeletonProps) {
  return (
    <Card className={`overflow-hidden flex flex-col h-full ${className}`}>
      <div className={`relative ${aspectRatio === "video" ? "aspect-video" : "aspect-square"}`}>
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>
      
      <CardHeader className="p-4 pb-2">
        {hasTitle && <Skeleton className="h-5 w-full mb-2" />}
        {hasChannel && <Skeleton className="h-4 w-1/2" />}
      </CardHeader>
      
      {hasDescription && (
        <CardContent className="p-4 pt-0 flex-grow">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </CardContent>
      )}
      
      {hasAction && (
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      )}
    </Card>
  );
}