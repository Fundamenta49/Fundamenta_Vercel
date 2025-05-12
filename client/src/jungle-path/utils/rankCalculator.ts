/**
 * Utility functions for calculating and displaying ranks in the jungle theme
 */

/**
 * Jungle-themed rank titles in ascending order
 */
const RANK_TITLES = [
  'Jungle Novice',     // Rank 0
  'Path Finder',       // Rank 1
  'Terrain Tracker',   // Rank 2
  'Vine Swinger',      // Rank 3
  'River Navigator',   // Rank 4
  'Canopy Explorer',   // Rank 5
  'Wildlife Whisperer', // Rank 6
  'Tribal Scout',      // Rank 7
  'Expedition Leader', // Rank 8
  'Jungle Guardian',   // Rank 9
  'Wilderness Sage',   // Rank 10
  'Jungle Legend'      // Rank 11+
];

/**
 * Gets the title for a specific rank number
 */
export const getRankTitle = (rank: number): string => {
  // Safety check for negative rank
  if (rank < 0) return RANK_TITLES[0];
  
  // Return the highest rank title for ranks beyond our defined list
  if (rank >= RANK_TITLES.length) {
    return RANK_TITLES[RANK_TITLES.length - 1];
  }
  
  return RANK_TITLES[rank];
};

/**
 * Gets the next rank title from the current rank
 */
export const getNextRankTitle = (currentRank: number): string => {
  return getRankTitle(currentRank + 1);
};

/**
 * Calculates XP needed for the next rank
 */
export const getXpForNextRank = (currentRank: number): number => {
  // Simple rank calculation: 100 XP per rank
  return (currentRank + 1) * 100;
};

/**
 * Calculates progress percentage toward next rank
 */
export const getRankProgress = (currentXp: number): number => {
  // Calculate the current rank based on XP
  const currentRank = Math.floor(currentXp / 100);
  
  // Calculate the XP needed for the current rank
  const currentRankXp = currentRank * 100;
  
  // Calculate the XP needed for the next rank
  const nextRankXp = (currentRank + 1) * 100;
  
  // Calculate progress percentage between current rank and next rank
  const xpSinceLastRank = currentXp - currentRankXp;
  const xpForNextRank = nextRankXp - currentRankXp;
  
  return Math.round((xpSinceLastRank / xpForNextRank) * 100);
};

/**
 * Checks if a user has reached a new rank after gaining XP
 */
export const hasReachedNewRank = (oldXp: number, newXp: number): boolean => {
  const oldRank = Math.floor(oldXp / 100);
  const newRank = Math.floor(newXp / 100);
  
  return newRank > oldRank;
};

/**
 * Returns the rank information with current and next rank details
 */
export const getRankInfo = (xp: number) => {
  const currentRank = Math.floor(xp / 100);
  const nextRank = currentRank + 1;
  
  return {
    currentRank,
    currentRankTitle: getRankTitle(currentRank),
    nextRankTitle: getRankTitle(nextRank),
    progress: getRankProgress(xp),
    xpToNextRank: getXpForNextRank(currentRank) - xp
  };
};