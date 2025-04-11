import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

interface FormSkeletonProps {
  title?: boolean;
  description?: boolean;
  inputs?: number;
  hasSelects?: boolean;
  hasTextarea?: boolean;
  hasButtons?: boolean;
  buttonCount?: number;
  className?: string;
}

/**
 * A skeleton loader for form layouts
 * 
 * @param title Whether to show a title skeleton
 * @param description Whether to show a description skeleton
 * @param inputs Number of input fields to show
 * @param hasSelects Whether to include select field skeletons
 * @param hasTextarea Whether to include a textarea skeleton
 * @param hasButtons Whether to include button skeletons
 * @param buttonCount Number of buttons to show
 * @param className Additional classes for the container
 */
export function FormSkeleton({
  title = true,
  description = true,
  inputs = 3,
  hasSelects = false,
  hasTextarea = false,
  hasButtons = true,
  buttonCount = 1,
  className = "",
}: FormSkeletonProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <Skeleton className="h-7 w-3/4 mb-2" />}
          {description && <Skeleton className="h-4 w-full" />}
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {/* Input fields */}
        {Array.from({ length: inputs }).map((_, i) => (
          <div key={`input-${i}`} className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
        ))}
        
        {/* Select fields */}
        {hasSelects && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Select */}
          </div>
        )}
        
        {/* Textarea */}
        {hasTextarea && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
          </div>
        )}
      </CardContent>
      
      {/* Buttons */}
      {hasButtons && (
        <CardFooter className="flex justify-end gap-2">
          {buttonCount > 1 && (
            <Skeleton className="h-10 w-24" /> /* Secondary button */
          )}
          <Skeleton className="h-10 w-28" /> {/* Primary button */}
        </CardFooter>
      )}
    </Card>
  );
}