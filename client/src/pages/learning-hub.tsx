/**
 * Standard Learning Hub Page
 * This page serves as the primary entry point for the standard learning path
 */

import { useCallback } from "react";
import { useLocation } from "wouter";
import { learningZones, LearningZone } from "@/data/zones-config";
import { ZoneCard } from "@/components/unified/ZoneCard";
import { useUserProfile } from "@/hooks/use-user-profile";
import { LearningThemeProvider } from "@/contexts/LearningThemeContext";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

// Components
import { HubLayout } from "@/components/layouts/HubLayout";

export default function LearningHubPage() {
  // Get user profile for rank information (to determine unlocked zones)
  const { userProfile } = useUserProfile();
  const userRank = userProfile?.rank || 1; // Default to rank 1 if unavailable
  
  // For navigation to zone content
  const [_, setLocation] = useLocation();
  
  // Handler for zone card clicks
  const handleZoneClick = useCallback((zoneId: string) => {
    // Navigate to zone content with standard theme parameter
    setLocation(`/zone/${zoneId}?theme=standard`);
  }, [setLocation]);
  
  // Create a custom header with the Basecamp button
  const customHeader = (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Learning Hub</h1>
      <Button onClick={() => setLocation('/basecamp')}>
        <BarChart className="mr-2 h-4 w-4" />
        View Progress
      </Button>
    </div>
  );

  return (
    <LearningThemeProvider initialTheme="standard">
      <HubLayout
        title="Select a life skill path to continue"
        description="Choose a learning zone to explore and develop essential life skills."
        theme="standard"
        customHeader={customHeader}
      >
        {learningZones.map((zone: LearningZone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            userRank={userRank}
            onClick={handleZoneClick}
          />
        ))}
      </HubLayout>
    </LearningThemeProvider>
  );
}