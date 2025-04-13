import React from "react";
import { CardSkeleton } from "./CardSkeleton";
import { VideoThumbnailSkeleton } from "./VideoThumbnailSkeleton";

interface ColumnConfig {
  sm?: number;
  md?: number;
  lg?: number;
}

interface GridSkeletonProps {
  count?: number;
  type?: "card" | "video" | "custom";
  columns?: ColumnConfig;
  className?: string;
  itemClassName?: string;
  customItem?: React.ReactNode;
}

/**
 * A skeleton loader for grid layouts
 * 
 * @param count Number of skeleton items to display
 * @param type Type of skeleton item to display ("card" or "video")
 * @param columns Column configuration for different breakpoints
 * @param className Additional classes for the grid container
 * @param itemClassName Additional classes for each grid item
 * @param customItem Custom React node to use instead of built-in types
 */
export function GridSkeleton({
  count = 4,
  type = "card",
  columns = { sm: 1, md: 2, lg: 3 },
  className = "",
  itemClassName = "",
  customItem,
}: GridSkeletonProps) {
  // Build grid classes based on column configuration
  const gridColClasses = [
    columns.sm ? `grid-cols-${columns.sm}` : "grid-cols-1",
    columns.md ? `md:grid-cols-${columns.md}` : "md:grid-cols-2",
    columns.lg ? `lg:grid-cols-${columns.lg}` : "lg:grid-cols-3",
  ].join(" ");

  return (
    <div className={`grid ${gridColClasses} gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        if (type === "card") {
          return <CardSkeleton key={i} className={itemClassName} />;
        } else if (type === "video") {
          return <VideoThumbnailSkeleton key={i} className={itemClassName} />;
        } else if (customItem) {
          return <React.Fragment key={i}>{customItem}</React.Fragment>;
        }
        return null;
      })}
    </div>
  );
}