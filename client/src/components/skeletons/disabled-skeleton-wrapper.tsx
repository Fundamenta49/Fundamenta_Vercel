/**
 * This component completely disables skeleton animations throughout the app
 * by overriding the skeleton components with simple loading indicators
 */
import React from 'react';
import { FallbackLoading } from "@/components/ui/fallback-loading";

// Override all skeleton components with this wrapper
export function DisabledCardSkeleton() {
  return <FallbackLoading text="Loading content..." className="h-[300px]" />;
}

export function DisabledVideoThumbnailSkeleton() {
  return <FallbackLoading text="Loading videos..." className="h-[250px]" />;
}

export function DisabledFormSkeleton() {
  return <FallbackLoading text="Loading form..." className="h-[300px]" />;
}

export function DisabledListSkeleton() {
  return <FallbackLoading text="Loading list..." className="h-[200px]" />;
}

export function DisabledGridSkeleton({ 
  count = 4,
  className = ""
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <FallbackLoading key={i} text="Loading item..." className="h-[200px]" />
      ))}
    </div>
  );
}