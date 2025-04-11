import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

interface CardSkeletonProps {
  hasImage?: boolean;
  imageHeight?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasDescription?: boolean;
  hasAction?: boolean;
  className?: string;
}

/**
 * A skeleton loader for card layouts
 * 
 * @param hasImage Whether to show an image skeleton
 * @param imageHeight Height of the image skeleton (e.g., "200px")
 * @param hasHeader Whether to show a header skeleton
 * @param hasFooter Whether to show a footer skeleton
 * @param hasDescription Whether to show a description skeleton
 * @param hasAction Whether to show an action button skeleton
 * @param className Additional classes for the card
 */
export function CardSkeleton({
  hasImage = true,
  imageHeight = "200px",
  hasHeader = true,
  hasFooter = true,
  hasDescription = true,
  hasAction = true,
  className = "",
}: CardSkeletonProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {hasImage && (
        <Skeleton className={`w-full h-[200px]`} style={{ height: imageHeight }} />
      )}
      
      {hasHeader && (
        <CardHeader className="p-4 pb-0">
          <Skeleton className="h-5 w-full mb-2" />
          {hasDescription && (
            <Skeleton className="h-4 w-2/3" />
          )}
        </CardHeader>
      )}
      
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
      
      {hasFooter && hasAction && (
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      )}
    </Card>
  );
}