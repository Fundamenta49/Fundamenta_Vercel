import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardSkeleton, VideoThumbnailSkeleton, GridSkeleton, FormSkeleton, ListSkeleton } from "@/components/skeletons";

export function SkeletonDemoPage() {
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div className="container mx-auto py-6 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Skeleton Loading Patterns</h1>
        <Button onClick={toggleLoading}>
          {isLoading ? "Show Content" : "Show Skeletons"}
        </Button>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Card Grid Pattern</h2>
        <p className="text-gray-500 mb-4">
          Used for recipe cards, job listings, and content cards throughout the app.
        </p>
        
        {isLoading ? (
          <GridSkeleton 
            count={8} 
            type="card" 
            columns={{ sm: 1, md: 2, lg: 4 }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-green-100 p-4 rounded-md h-[300px] flex items-center justify-center">
                <span className="text-xl">Content {i+1}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Video Content Pattern</h2>
        <p className="text-gray-500 mb-4">
          Used for video tutorials, educational content, and media throughout the app.
        </p>
        
        {isLoading ? (
          <GridSkeleton 
            count={4} 
            type="video" 
            columns={{ sm: 1, md: 2, lg: 2 }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-blue-100 p-4 rounded-md h-[300px] flex items-center justify-center">
                <span className="text-xl">Video {i+1}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Form Pattern</h2>
        <p className="text-gray-500 mb-4">
          Used for input forms, settings panels, and user input areas.
        </p>
        
        {isLoading ? (
          <FormSkeleton 
            inputs={4}
            hasSelects={true}
            hasTextarea={true}
            buttonCount={2}
            className="max-w-xl mx-auto"
          />
        ) : (
          <div className="bg-purple-100 p-4 rounded-md h-[400px] max-w-xl mx-auto flex items-center justify-center">
            <span className="text-xl">Form Content</span>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">List Pattern</h2>
        <p className="text-gray-500 mb-4">
          Used for lists, timelines, and sequence-based content.
        </p>
        
        {isLoading ? (
          <ListSkeleton 
            count={5}
            hasIcon={true}
            hasDescription={true}
            hasAction={true}
            className="max-w-3xl mx-auto"
          />
        ) : (
          <div className="space-y-3 max-w-3xl mx-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-yellow-100 p-4 rounded-md h-[100px] flex items-center justify-center">
                <span className="text-xl">List Item {i+1}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}