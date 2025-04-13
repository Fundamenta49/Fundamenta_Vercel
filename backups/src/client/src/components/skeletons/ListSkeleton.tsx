import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  count?: number;
  hasIcon?: boolean;
  hasDescription?: boolean;
  hasAction?: boolean;
  itemClassName?: string;
  className?: string;
}

/**
 * A skeleton loader for list layouts
 * 
 * @param count Number of list items to show
 * @param hasIcon Whether to include an icon placeholder
 * @param hasDescription Whether to include description text
 * @param hasAction Whether to include an action button
 * @param itemClassName Additional classes for list items
 * @param className Additional classes for the list container
 */
export function ListSkeleton({
  count = 5,
  hasIcon = true,
  hasDescription = true,
  hasAction = false,
  itemClassName = "",
  className = "",
}: ListSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={`flex items-start p-3 rounded-md border ${itemClassName}`}
        >
          {/* Icon */}
          {hasIcon && (
            <Skeleton className="h-10 w-10 rounded-md mr-3 flex-shrink-0" />
          )}
          
          {/* Content */}
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            {hasDescription && (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </>
            )}
          </div>
          
          {/* Action button */}
          {hasAction && (
            <Skeleton className="h-8 w-8 rounded-md flex-shrink-0 ml-2" />
          )}
        </div>
      ))}
    </div>
  );
}