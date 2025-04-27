/**
 * Rank Calculator
 * Utilities for handling the jungle-themed rank progression system
 */
import { UserRank } from '@/shared/arcade-schema';
import { getRankStyle } from '../styles/theme';

// Jungle-themed rank definitions
export const JUNGLE_RANKS = [
  { level: 1, title: "Newcomer", pointsNeeded: 0, description: "Your first steps into the mysterious jungle." },
  { level: 2, title: "Explorer", pointsNeeded: 100, description: "You've begun to understand the jungle's secrets." },
  { level: 3, title: "Pathfinder", pointsNeeded: 250, description: "You can now navigate the twisting jungle paths." },
  { level: 4, title: "Trailblazer", pointsNeeded: 500, description: "You forge new routes through uncharted territory." },
  { level: 5, title: "Jungle Guardian", pointsNeeded: 1000, description: "You've mastered the jungle's mysteries." }
];

// Extended ranks beyond the core progression
export const EXTENDED_JUNGLE_RANKS = [
  ...JUNGLE_RANKS,
  { level: 6, title: "Jungle Master", pointsNeeded: 2000, description: "Your wisdom transcends the jungle itself." },
  { level: 7, title: "Ancient Guide", pointsNeeded: 3500, description: "You've attained knowledge from the jungle's ancient past." },
  { level: 8, title: "Temple Keeper", pointsNeeded: 5000, description: "You safeguard the jungle's most sacred temples." },
  { level: 9, title: "Spirit Walker", pointsNeeded: 7500, description: "You commune with the ancient spirits of the jungle." },
  { level: 10, title: "Jungle Legend", pointsNeeded: 10000, description: "Your name echoes throughout the jungle's history." }
];

/**
 * Calculate rank data based on points
 */
export const calculateRank = (points: number) => {
  // Find the current rank
  let currentRank = JUNGLE_RANKS[0];
  let nextRank = JUNGLE_RANKS[1];
  
  for (let i = 0; i < JUNGLE_RANKS.length; i++) {
    if (points >= JUNGLE_RANKS[i].pointsNeeded) {
      currentRank = JUNGLE_RANKS[i];
      nextRank = JUNGLE_RANKS[i + 1] || JUNGLE_RANKS[i];
    } else {
      break;
    }
  }
  
  // Calculate progress percentage to next rank
  const currentPoints = points - currentRank.pointsNeeded;
  const pointsForNextRank = nextRank.pointsNeeded - currentRank.pointsNeeded;
  const progressPercentage = currentRank === nextRank ? 100 : Math.min(100, (currentPoints / pointsForNextRank) * 100);
  
  return {
    currentRank,
    nextRank,
    progress: {
      current: currentPoints,
      required: pointsForNextRank,
      percentage: progressPercentage
    },
    style: getRankStyle(currentRank.title)
  };
};

/**
 * Get the display properties for a rank, including styling
 */
export const getRankDisplay = (rank: UserRank) => {
  // Find the matching jungle rank
  const jungleRank = JUNGLE_RANKS.find(r => r.level === rank.level) || JUNGLE_RANKS[0];
  
  // Get the next rank
  const nextRankIndex = JUNGLE_RANKS.findIndex(r => r.level === rank.level) + 1;
  const nextRank = nextRankIndex < JUNGLE_RANKS.length ? JUNGLE_RANKS[nextRankIndex] : jungleRank;
  
  // Calculate progress to next rank
  const pointsEarned = rank.currentPoints - jungleRank.pointsNeeded;
  const pointsRequired = nextRank.pointsNeeded - jungleRank.pointsNeeded;
  const progressPercentage = jungleRank === nextRank ? 100 : Math.min(100, (pointsEarned / pointsRequired) * 100);
  
  return {
    rank: jungleRank,
    nextRank,
    progress: {
      current: pointsEarned,
      required: pointsRequired,
      percentage: progressPercentage
    },
    style: getRankStyle(jungleRank.title)
  };
};

/**
 * Check if user has reached a rank milestone
 */
export const hasReachedNewRank = (previousPoints: number, currentPoints: number): boolean => {
  // Get previous rank
  const previousRank = JUNGLE_RANKS.find(
    (rank, index, array) => 
      previousPoints >= rank.pointsNeeded && 
      (index === array.length - 1 || previousPoints < array[index + 1].pointsNeeded)
  );
  
  // Get current rank
  const currentRank = JUNGLE_RANKS.find(
    (rank, index, array) => 
      currentPoints >= rank.pointsNeeded && 
      (index === array.length - 1 || currentPoints < array[index + 1].pointsNeeded)
  );
  
  // Compare ranks to see if a new one was reached
  return previousRank?.level !== currentRank?.level;
};

/**
 * Get recommended achievements based on rank progression
 */
export const getRecommendedAchievements = (currentRank: number) => {
  // Each rank has specific achievements that are recommended
  const RANK_ACHIEVEMENT_FOCUS: Record<number, string[]> = {
    1: ["fin-budget-basics", "fit-first-workout", "learn-first-course"],
    2: ["fin-savings-starter", "car-resume-ready", "well-meal-planner"],
    3: ["fin-investment-initiate", "car-interview-ace", "well-nutrition-novice"],
    4: ["fit-yoga-beginner", "emerg-first-aid", "learn-cooking-basics"],
    5: ["fin-debt-destroyer", "fit-consistency", "emerg-safety-plan"]
  };
  
  return RANK_ACHIEVEMENT_FOCUS[currentRank] || RANK_ACHIEVEMENT_FOCUS[1];
};