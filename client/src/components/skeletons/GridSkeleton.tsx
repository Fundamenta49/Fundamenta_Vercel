import React from "react";
import { CardSkeleton } from "./CardSkeleton";
import { VideoThumbnailSkeleton } from "./VideoThumbnailSkeleton";

interface GridSkeletonProps {
  count?: number;
  type?: "card" | "video";
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
  itemClassName?: string;
}

/**
 * A skeleton loader for grid layouts
 * 
 * @param count Number of skeleton items to display
 * @param type Type of skeleton item to display ('card' or 'video')
 * @param columns Number of columns at different breakpoints
 * @param className Additional classes for the grid container
 * @param itemClassName Additional classes for individual skeleton items
 */
export function GridSkeleton({
  count = 6,
  type = "card",
  columns = { sm: 1, md: 2, lg: 3 },
  className = "",
  itemClassName = "",
}: GridSkeletonProps) {
  // Create the grid template columns CSS
  const gridCols = `
    grid-cols-${columns.sm || 1}
    md:grid-cols-${columns.md || 2}
    lg:grid-cols-${columns.lg || 3}
  `;

  return (
    <div className={`grid gap-4 ${gridCols} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={itemClassName}>
          {type === "card" ? (
            <CardSkeleton 
              hasImage={true}
              hasFooter={false}
              imageHeight="h-40"
              descriptionLines={2}
            />
          ) : (
            <VideoThumbnailSkeleton 
              aspectRatio="video"
              showTitle={true}
              showChannel={true}
            />
          )}
        </div>
      ))}
    </div>
  );
}