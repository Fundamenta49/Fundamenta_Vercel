import React from 'react';
import JungleDemoCard from '@/components/jungle-demo-card';

export default function JunglePathDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Jungle Path Demo</h1>
      <p className="text-center mb-8 max-w-2xl mx-auto text-muted-foreground">
        This demo showcases the Jungle Path theme's ability to transform standard learning content into an immersive, adventure-themed experience without changing the underlying educational value.
      </p>
      
      <div className="flex justify-center">
        <JungleDemoCard />
      </div>
      
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Adventure-Themed Learning</h3>
            <p className="text-sm text-muted-foreground">
              Transform standard learning modules into exciting "quests" and "expeditions" to make the learning journey more engaging and fun.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Jungle-Themed Styling</h3>
            <p className="text-sm text-muted-foreground">
              Deep green backgrounds, gold accents, and natural textures create an immersive jungle environment that makes learning more visually engaging.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Zone-Based Exploration</h3>
            <p className="text-sm text-muted-foreground">
              Different learning categories are represented as distinct "zones" in the jungle, each with their own visual identity and thematic elements.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Fundi Integration</h3>
            <p className="text-sm text-muted-foreground">
              The Fundi guide provides contextual help and encouragement with jungle-themed messaging without changing the familiar avatar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}