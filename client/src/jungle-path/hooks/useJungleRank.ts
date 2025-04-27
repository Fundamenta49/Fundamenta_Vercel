import { useState, useEffect } from 'react';
import { UserRank } from '../types/rank';
import { calculateRank } from '../utils/rankCalculator';

/**
 * Hook to manage user's jungle rank and rank up celebrations
 */
export const useJungleRank = (
  userProgress: { 
    rank: { 
      level: number; 
      points: number 
    } 
  }
) => {
  // Calculate user rank
  const userRank: UserRank = calculateRank(userProgress.rank.points);
  
  // State for handling rank up celebration
  const [previousRank, setPreviousRank] = useState<number>(userRank.level);
  const [showRankUpCelebration, setShowRankUpCelebration] = useState<boolean>(false);
  
  // Check for rank up
  useEffect(() => {
    if (previousRank !== userRank.level && previousRank < userRank.level) {
      // User has ranked up
      setShowRankUpCelebration(true);
    }
    setPreviousRank(userRank.level);
  }, [userRank.level, previousRank]);
  
  // Hide rank up celebration
  const hideRankUpCelebration = () => {
    setShowRankUpCelebration(false);
  };
  
  return {
    userRank,
    previousRank,
    showRankUpCelebration,
    hideRankUpCelebration
  };
};