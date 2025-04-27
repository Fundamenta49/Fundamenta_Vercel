import { UserRank, RankInfo } from '../types/rank';

/**
 * Jungle explorer ranks definition
 */
export const JUNGLE_RANKS: RankInfo[] = [
  {
    level: 0,
    title: 'Newcomer',
    description: 'You have just arrived at the jungle\'s edge, eager to begin your adventure.',
    minPoints: 0,
    maxPoints: 100,
    color: '#94C973', // Canopy Light
    perks: [
      'Access to Explorer\'s Basecamp',
      'Basic quest discovery',
      'Jungle map overview'
    ]
  },
  {
    level: 1,
    title: 'Explorer',
    description: 'You have ventured into the jungle and begun to discover its mysteries.',
    minPoints: 100,
    maxPoints: 300,
    color: '#3B82C4', // River Blue
    perks: [
      'Access to River of Resources',
      'Access to Ancient Wellness Trail',
      'Companion selection',
      'Enhanced quest rewards'
    ]
  },
  {
    level: 2,
    title: 'Pathfinder',
    description: 'You have mastered basic navigation and can now access deeper jungle territories.',
    minPoints: 300,
    maxPoints: 600,
    color: '#E6B933', // Temple Gold
    perks: [
      'Access to Temple of Knowledge',
      'Access to Emergency Waterfall',
      'Access to Peak Performance Summit',
      'Advanced companion interactions',
      'Quest chaining abilities'
    ]
  },
  {
    level: 3,
    title: 'Trailblazer',
    description: 'Your expertise has grown, allowing you to tackle the jungle\'s most challenging regions.',
    minPoints: 600,
    maxPoints: 1000,
    color: '#E67E33', // Sunset Orange
    perks: [
      'Access to Transformation Volcano',
      'Access to Crystal Cave of Reflection',
      'Premium companion unlocks',
      'Challenge quest access',
      'Discovery sharing abilities'
    ]
  },
  {
    level: 4,
    title: 'Jungle Guardian',
    description: 'You have mastered the jungle\'s secrets and now help guide others through its challenges.',
    minPoints: 1000,
    maxPoints: Number.MAX_SAFE_INTEGER,
    color: '#1E4A3D', // Jungle Green
    perks: [
      'Access to Hidden Valley of Mastery',
      'Full companion collection',
      'Master quest access',
      'Mentor abilities',
      'Special recognition'
    ]
  }
];

/**
 * Calculate user's jungle rank based on points
 */
export const calculateRank = (userPoints: number): UserRank => {
  // Find the right rank based on points
  const currentRank = JUNGLE_RANKS.find(
    (rank, index) => 
      userPoints >= rank.minPoints && 
      (index === JUNGLE_RANKS.length - 1 || userPoints < JUNGLE_RANKS[index + 1].minPoints)
  ) || JUNGLE_RANKS[0];
  
  // Calculate progress to next rank
  const isMaxRank = currentRank.level === JUNGLE_RANKS.length - 1;
  const nextRank = isMaxRank ? null : JUNGLE_RANKS[currentRank.level + 1];
  
  let progress = 0;
  if (nextRank) {
    const pointsInCurrentRank = userPoints - currentRank.minPoints;
    const pointsRequiredForNextRank = nextRank.minPoints - currentRank.minPoints;
    progress = Math.min(pointsInCurrentRank / pointsRequiredForNextRank, 1);
  } else {
    // Max rank - show progress as complete
    progress = 1;
  }
  
  return {
    level: currentRank.level,
    title: currentRank.title,
    points: userPoints,
    nextRankPoints: nextRank ? nextRank.minPoints : currentRank.maxPoints,
    progress,
    color: currentRank.color,
    badgeUrl: undefined // To be implemented when we have badge assets
  };
};

/**
 * Get rank name by level
 */
export const getRankName = (level: number): string => {
  const rank = JUNGLE_RANKS.find(r => r.level === level);
  return rank ? rank.title : 'Unknown';
};

/**
 * Get rank color by level
 */
export const getRankColor = (level: number): string => {
  const rank = JUNGLE_RANKS.find(r => r.level === level);
  return rank ? rank.color : '#94C973'; // Default to Newcomer color
};