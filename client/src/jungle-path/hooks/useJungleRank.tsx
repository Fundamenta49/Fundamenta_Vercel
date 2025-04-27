import { useState, useEffect, useMemo } from 'react';
import { UserRank, UserArcadeProgress } from '@/shared/arcade-schema';
import { calculateRank, hasReachedNewRank, getRecommendedAchievements } from '../utils/rankCalculator';

/**
 * Hook for managing the user's jungle rank and progression
 */
export const useJungleRank = (userProgress: UserArcadeProgress) => {
  const { rank: userRank } = userProgress;
  const [showRankUpCelebration, setShowRankUpCelebration] = useState(false);
  const [previousRank, setPreviousRank] = useState(userRank.level);
  
  // Calculate rank display data based on points
  const rankData = useMemo(() => 
    calculateRank(userRank.currentPoints),
    [userRank.currentPoints]
  );
  
  // Get recommended achievements for current rank
  const recommendedAchievements = useMemo(() => 
    getRecommendedAchievements(userRank.level),
    [userRank.level]
  );
  
  // Check for rank up when points change
  useEffect(() => {
    if (previousRank !== userRank.level) {
      const isRankUp = userRank.level > previousRank;
      
      if (isRankUp) {
        // Show rank up celebration
        setShowRankUpCelebration(true);
      }
      
      setPreviousRank(userRank.level);
    }
  }, [userRank.level, previousRank]);
  
  // Check progress to next rank
  const nextRankProgress = useMemo(() => {
    const currentPoints = userRank.currentPoints;
    const nextLevelPoints = userRank.nextLevelPoints;
    const pointsNeeded = nextLevelPoints - currentPoints;
    const progressPercentage = (currentPoints / nextLevelPoints) * 100;
    
    return {
      current: currentPoints,
      required: nextLevelPoints,
      needed: pointsNeeded,
      percentage: progressPercentage
    };
  }, [userRank.currentPoints, userRank.nextLevelPoints]);
  
  // Get points needed for each category to level up
  const categoryPointsNeeded = useMemo(() => {
    // Create an object with points needed for each category to level up
    const pointsNeeded: Record<string, number> = {};
    
    Object.entries(userRank.categoryLevels).forEach(([category, level]) => {
      // Each category level requires level * 50 points to advance
      const nextLevelRequirement = (level + 1) * 50;
      
      // Estimate current category points based on level
      // (This is just an estimation since we don't have exact category points)
      const estimatedCurrentPoints = level * 50;
      
      pointsNeeded[category] = nextLevelRequirement - estimatedCurrentPoints;
    });
    
    return pointsNeeded;
  }, [userRank.categoryLevels]);
  
  return {
    userRank,
    rankData,
    nextRankProgress,
    categoryPointsNeeded,
    recommendedAchievements,
    showRankUpCelebration,
    hideRankUpCelebration: () => setShowRankUpCelebration(false),
    previousRank
  };
};

export default useJungleRank;