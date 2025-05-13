/**
 * Jungle-themed Hub Page
 * This page serves as the primary entry point for the jungle-themed learning path
 */

import { useCallback } from "react";
import { useLocation } from "wouter";
import { learningZones, LearningZone } from "@/data/zones-config";
import { ZoneCard } from "@/components/unified/ZoneCard";
import { useUserProfile } from "@/hooks/use-user-profile";
import { LearningThemeProvider } from "@/contexts/LearningThemeContext";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

// Components
import { HubLayout } from "@/components/layouts/HubLayout";

export default function JungleHubPage() {
  // Get user profile for rank information (to determine unlocked zones)
  const { userProfile } = useUserProfile();
  const userRank = userProfile?.rank || 1; // Default to rank 1 if unavailable
  
  // For navigation to zone content
  const [_, setLocation] = useLocation();
  
  // Handler for zone card clicks
  const handleZoneClick = useCallback((zoneId: string) => {
    // Navigate to zone content with jungle theme parameter
    setLocation(`/zone/${zoneId}?theme=jungle`);
  }, [setLocation]);
  
  // Create a custom header with the Basecamp button
  const customHeader = (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-amber-300">Jungle Expedition Hub</h1>
      <Button 
        variant="outline" 
        className="border-amber-700 text-amber-200 hover:bg-[#28362E]"
        onClick={() => setLocation('/basecamp')}
      >
        <Trophy className="mr-2 h-4 w-4" />
        Expedition Basecamp
      </Button>
    </div>
  );

  return (
    <LearningThemeProvider initialTheme="jungle">
      <HubLayout
        title="Choose your next expedition, explorer!"
        description="Select a path through the jungle to continue your learning journey."
        theme="jungle"
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