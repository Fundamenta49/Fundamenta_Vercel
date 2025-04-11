import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  hasImage?: boolean;
  hasFooter?: boolean;
  imageHeight?: string;
  titleWidth?: string;
  descriptionLines?: number;
  className?: string;
}

/**
 * A skeleton loader for card components
 * 
 * @param hasImage Whether to include an image placeholder
 * @param hasFooter Whether to include a footer section
 * @param imageHeight Height of the image placeholder
 * @param titleWidth Width of the title placeholder
 * @param descriptionLines Number of description lines to show
 * @param className Additional classes to apply to the card
 */
export function CardSkeleton({
  hasImage = true,
  hasFooter = false,
  imageHeight = "h-40",
  titleWidth = "w-3/4",
  descriptionLines = 2,
  className = "",
}: CardSkeletonProps) {
  return (
    <Card className={className}>
      {hasImage && (
        <Skeleton className={`rounded-b-none rounded-t-md ${imageHeight} w-full`} />
      )}
      <CardHeader className="pb-2">
        <Skeleton className={`h-6 ${titleWidth} mb-2`} />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="pb-3">
        {Array.from({ length: descriptionLines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={`h-4 mb-2 ${i === descriptionLines - 1 ? "w-4/5" : "w-full"}`} 
          />
        ))}
      </CardContent>
      {hasFooter && (
        <CardFooter>
          <Skeleton className="h-9 w-24 mr-2" />
          <Skeleton className="h-9 w-24" />
        </CardFooter>
      )}
    </Card>
  );
}