import { UserRank } from '../types/rank';

// Define rank level thresholds
const RANK_THRESHOLDS = [
  { level: 0, name: 'Newcomer', minPoints: 0, color: '#94C973' },
  { level: 1, name: 'Explorer', minPoints: 100, color: '#3B82C4' },
  { level: 2, name: 'Pathfinder', minPoints: 300, color: '#F3B54A' },
  { level: 3, name: 'Trailblazer', minPoints: 700, color: '#724E91' },
  { level: 4, name: 'Jungle Guardian', minPoints: 1500, color: '#E67E33' }
];

/**
 * Calculate user rank based on points
 */
export const calculateRank = (points: number): UserRank => {
  // Sort ranks in descending order by minPoints
  const sortedRanks = [...RANK_THRESHOLDS].sort((a, b) => b.minPoints - a.minPoints);
  
  // Find the highest rank that the user's points exceed the threshold for
  const userRank = sortedRanks.find(rank => points >= rank.minPoints) || RANK_THRESHOLDS[0];
  
  // Calculate progress to next rank
  let nextRank;
  let progress = 100;
  
  if (userRank.level < RANK_THRESHOLDS.length - 1) {
    nextRank = RANK_THRESHOLDS.find(rank => rank.level === userRank.level + 1);
    
    if (nextRank) {
      const pointsInCurrentRank = points - userRank.minPoints;
      const pointsRequiredForNextRank = nextRank.minPoints - userRank.minPoints;
      progress = Math.min(Math.round((pointsInCurrentRank / pointsRequiredForNextRank) * 100), 99);
    }
  }
  
  return {
    level: userRank.level,
    name: userRank.name,
    color: userRank.color,
    points,
    nextRankName: nextRank?.name || null,
    nextRankPoints: nextRank?.minPoints || null,
    progress
  };
};

/**
 * Get points needed for the next rank
 */
export const getPointsForNextRank = (currentRank: number): number | null => {
  const nextRank = RANK_THRESHOLDS.find(rank => rank.level === currentRank + 1);
  return nextRank ? nextRank.minPoints : null;
};

/**
 * Estimate rank points based on completed quests and achievements
 */
export const estimateRankPoints = (
  completedQuestCount: number,
  achievementCount: number,
  streakDays: number
): number => {
  const questPoints = completedQuestCount * 10;
  const achievementPoints = achievementCount * 25;
  const streakPoints = Math.min(streakDays * 5, 100); // Cap streak points at 100
  
  return questPoints + achievementPoints + streakPoints;
};