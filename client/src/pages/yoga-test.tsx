import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import YogaPromptFlow, { YogaSession } from "@/components/yoga-prompt-flow";

export default function YogaTest() {
  const [yogaPromptOpen, setYogaPromptOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<YogaSession | null>(null);

  const handleYogaPromptComplete = (session?: YogaSession) => {
    // Only close if no session was selected (user manually closed it)
    if (!session) {
      setYogaPromptOpen(false);
    } else {
      setSelectedSession(session);
      // Keep dialog open for video/audio session
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Yoga Test Page</h1>
      <p className="mb-6">
        This page allows you to test the Yoga Prompt Flow component with audio-guided sessions.
      </p>
      
      <div className="flex justify-center">
        <Button 
          onClick={() => setYogaPromptOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          Open Yoga Flow
        </Button>
      </div>
      
      {selectedSession && (
        <div className="mt-8 p-4 border rounded-md">
          <h2 className="text-xl font-bold mb-2">Selected Session:</h2>
          <p><strong>Title:</strong> {selectedSession.title}</p>
          <p><strong>Type:</strong> {selectedSession.type}</p>
          <p><strong>Duration:</strong> {selectedSession.duration} minutes</p>
          <p><strong>Audio Only:</strong> {selectedSession.isAudioOnly ? "Yes" : "No"}</p>
        </div>
      )}
      
      {yogaPromptOpen && (
        <YogaPromptFlow 
          onComplete={handleYogaPromptComplete}
          onClose={() => setYogaPromptOpen(false)}
        />
      )}
    </div>
  );
}