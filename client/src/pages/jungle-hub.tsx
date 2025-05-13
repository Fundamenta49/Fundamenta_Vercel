/**
 * Jungle-themed Hub Page
 * This page serves as the primary entry point for the jungle-themed learning path
 */

import { useCallback } from "react";
import { useLocation } from "wouter";
import { learningZones } from "@/data/zones-config";
import { ZoneCard } from "@/components/unified/ZoneCard";
import { useUserProfile } from "@/hooks/use-user-profile";

// Components
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

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
    <Container>
      <div className="py-8 space-y-8">
        {/* Page Header */}
        <PageHeader 
          title="Choose your next expedition, explorer!" 
          description="Select a path through the jungle to continue your learning journey."
        />
        
        {/* Zone Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningZones.map((zone: LearningZone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              theme="jungle"
              userRank={userRank}
              onClick={handleZoneClick}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}