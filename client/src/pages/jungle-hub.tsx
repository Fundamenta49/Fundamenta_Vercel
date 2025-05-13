/**
 * Jungle-themed Hub Page
 * This page serves as the primary entry point for the jungle-themed learning path
 */

import { useCallback } from "react";
import { useLocation } from "wouter";
import { learningZones, LearningZone } from "@/data/zones-config";
import { ZoneCard } from "@/components/unified/ZoneCard";
import { useUserProfile } from "@/hooks/use-user-profile";

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
  
  return (
    <HubLayout
      title="Choose your next expedition, explorer!"
      description="Select a path through the jungle to continue your learning journey."
      theme="jungle"
    >
      {learningZones.map((zone: LearningZone) => (
        <ZoneCard
          key={zone.id}
          zone={zone}
          theme="jungle"
          userRank={userRank}
          onClick={handleZoneClick}
        />
      ))}
    </HubLayout>
  );
}