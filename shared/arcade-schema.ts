import { z } from "zod";

// Achievement Tier (rarity)
export const AchievementTier = z.enum([
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary"
]);
export type AchievementTier = z.infer<typeof AchievementTier>;

// Achievement Categories
export const AchievementCategory = z.enum([
  "finance",
  "career",
  "wellness",
  "fitness",
  "learning",
  "emergency",
  "general"
]);
export type AchievementCategory = z.infer<typeof AchievementCategory>;

// Achievement Schema
export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  requirement: z.string(),
  category: AchievementCategory,
  tier: AchievementTier,
  points: z.number().int().positive(),
  hidden: z.boolean().default(false),
  iconName: z.string().nullable().default(null)
});
export type Achievement = z.infer<typeof AchievementSchema>;

// User Achievement Schema (for tracking user progress)
export const UserAchievementSchema = z.object({
  achievementId: z.string(),
  progress: z.number().min(0).max(100).default(0),
  unlockedAt: z.date().nullable().default(null),
});
export type UserAchievement = z.infer<typeof UserAchievementSchema>;

// User Rank Schema
export const UserRankSchema = z.object({
  userId: z.string(),
  level: z.number().int().positive().default(1),
  title: z.string().default("Beginner"),
  currentPoints: z.number().int().default(0),
  nextLevelPoints: z.number().int().positive().default(100),
  categoryLevels: z.record(z.number().int().positive().default(1)),
});
export type UserRank = z.infer<typeof UserRankSchema>;

// User's Overall Arcade Progress
export const UserArcadeProgressSchema = z.object({
  userId: z.string(),
  achievements: z.record(z.object({
    unlockedAt: z.date().nullable(),
    progress: z.number().min(0).max(100),
  })),
  rank: UserRankSchema,
  streakDays: z.number().int().default(0),
  lastActive: z.date().default(() => new Date()),
});
export type UserArcadeProgress = z.infer<typeof UserArcadeProgressSchema>;

// Sample data for ranks
export const RANK_DEFINITIONS = [
  { level: 1, title: "Beginner", pointsNeeded: 0 },
  { level: 2, title: "Novice", pointsNeeded: 100 },
  { level: 3, title: "Apprentice", pointsNeeded: 250 },
  { level: 4, title: "Adept", pointsNeeded: 500 },
  { level: 5, title: "Expert", pointsNeeded: 1000 },
  { level: 6, title: "Master", pointsNeeded: 2000 },
  { level: 7, title: "Grandmaster", pointsNeeded: 3500 },
  { level: 8, title: "Legend", pointsNeeded: 5000 },
  { level: 9, title: "Mythic", pointsNeeded: 7500 },
  { level: 10, title: "Transcendent", pointsNeeded: 10000 },
];

// Sample achievement data
export const ACHIEVEMENTS: Achievement[] = [
  // Finance achievements
  {
    id: "fin-budget-basics",
    title: "Budget Basics",
    description: "Create your first monthly budget",
    requirement: "Complete the budget setup in Financial Literacy",
    category: "finance",
    tier: "common",
    points: 10,
    hidden: false,
    iconName: "DollarSign"
  },
  {
    id: "fin-savings-starter",
    title: "Savings Starter",
    description: "Set up a savings goal and make your first contribution",
    requirement: "Add a savings goal and track a deposit",
    category: "finance",
    tier: "common",
    points: 15,
    hidden: false,
    iconName: "Piggy"
  },
  {
    id: "fin-investment-initiate",
    title: "Investment Initiate",
    description: "Learn about investment basics and risk profiles",
    requirement: "Complete the Investment Basics module",
    category: "finance",
    tier: "uncommon",
    points: 25,
    hidden: false,
    iconName: "TrendingUp"
  },
  {
    id: "fin-debt-destroyer",
    title: "Debt Destroyer",
    description: "Create a debt payoff plan",
    requirement: "Set up a debt tracker with payoff dates",
    category: "finance",
    tier: "rare",
    points: 50,
    hidden: false,
    iconName: "Scissors"
  },
  
  // Career achievements
  {
    id: "car-resume-ready",
    title: "Resume Ready",
    description: "Create a polished, professional resume",
    requirement: "Complete your resume in Career Development",
    category: "career",
    tier: "common",
    points: 15,
    hidden: false,
    iconName: "FileText"
  },
  {
    id: "car-interview-ace",
    title: "Interview Ace",
    description: "Complete interview preparation training",
    requirement: "Finish all interview simulation exercises",
    category: "career",
    tier: "uncommon",
    points: 30,
    hidden: false,
    iconName: "Users"
  },
  
  // Wellness achievements
  {
    id: "well-meal-planner",
    title: "Meal Planner",
    description: "Create your first weekly meal plan",
    requirement: "Plan meals for a full week",
    category: "wellness",
    tier: "common",
    points: 10,
    hidden: false,
    iconName: "Utensils"
  },
  {
    id: "well-nutrition-novice",
    title: "Nutrition Novice",
    description: "Learn the basics of balanced nutrition",
    requirement: "Complete the Nutrition Fundamentals module",
    category: "wellness",
    tier: "common",
    points: 15,
    hidden: false,
    iconName: "Apple"
  },
  {
    id: "well-sleep-master",
    title: "Sleep Master",
    description: "Establish a consistent sleep schedule",
    requirement: "Log a consistent sleep schedule for 7 days",
    category: "wellness",
    tier: "uncommon",
    points: 25,
    hidden: false,
    iconName: "Moon"
  },
  
  // Fitness achievements
  {
    id: "fit-first-workout",
    title: "First Workout",
    description: "Complete your first tracked workout",
    requirement: "Log any workout activity",
    category: "fitness",
    tier: "common",
    points: 10,
    hidden: false,
    iconName: "Dumbbell"
  },
  {
    id: "fit-yoga-beginner",
    title: "Yoga Beginner",
    description: "Complete your first yoga session",
    requirement: "Finish a yoga session in the Yoga section",
    category: "fitness",
    tier: "common",
    points: 15,
    hidden: false,
    iconName: "Activity"
  },
  {
    id: "fit-consistency",
    title: "Consistency is Key",
    description: "Work out 3 times in one week",
    requirement: "Log 3 workouts within a 7-day period",
    category: "fitness",
    tier: "uncommon",
    points: 25,
    hidden: false,
    iconName: "Calendar"
  },
  
  // Learning achievements
  {
    id: "learn-first-course",
    title: "First Course",
    description: "Complete your first learning course",
    requirement: "Finish any course in Life Skills",
    category: "learning",
    tier: "common",
    points: 15,
    hidden: false,
    iconName: "GraduationCap"
  },
  {
    id: "learn-cooking-basics",
    title: "Cooking Fundamentals",
    description: "Learn essential cooking techniques",
    requirement: "Complete the Cooking Basics course",
    category: "learning",
    tier: "uncommon",
    points: 25,
    hidden: false,
    iconName: "ChefHat"
  },
  {
    id: "learn-knowledge-seeker",
    title: "Knowledge Seeker",
    description: "Complete 5 different courses",
    requirement: "Finish 5 unique courses in Life Skills",
    category: "learning",
    tier: "rare",
    points: 50,
    hidden: false,
    iconName: "BookOpen"
  },
  
  // Emergency preparedness achievements
  {
    id: "emerg-first-aid",
    title: "First Aid Ready",
    description: "Learn basic first aid procedures",
    requirement: "Complete the First Aid Basics module",
    category: "emergency",
    tier: "common",
    points: 20,
    hidden: false,
    iconName: "Heart"
  },
  {
    id: "emerg-safety-plan",
    title: "Safety Planner",
    description: "Create a home emergency plan",
    requirement: "Set up your household emergency plan",
    category: "emergency",
    tier: "uncommon",
    points: 30,
    hidden: false,
    iconName: "Shield"
  },
  
  // Hidden achievements
  {
    id: "hidden-early-bird",
    title: "Early Bird",
    description: "Log in to the app before 7 AM three days in a row",
    requirement: "Early morning login streak",
    category: "general",
    tier: "uncommon",
    points: 20,
    hidden: true,
    iconName: "Sunrise"
  },
  {
    id: "hidden-night-owl",
    title: "Night Owl",
    description: "Use the app after 11 PM five times",
    requirement: "Late night usage",
    category: "general",
    tier: "uncommon",
    points: 20,
    hidden: true,
    iconName: "Moon"
  }
];

// Function to create sample user progress 
export const createSampleUserProgress = (userId: string): UserArcadeProgress => {
  // Initialize some unlocked achievements with progress
  const achievements = {
    "fin-budget-basics": { 
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      progress: 100 
    },
    "fin-savings-starter": { 
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      progress: 100 
    },
    "car-resume-ready": { 
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      progress: 100 
    },
    "well-meal-planner": { 
      unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      progress: 100 
    },
    "learn-first-course": { 
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      progress: 100 
    },
    // Achievements in progress
    "fit-first-workout": { 
      unlockedAt: null, 
      progress: 75 
    },
    "learn-cooking-basics": { 
      unlockedAt: null, 
      progress: 60 
    },
    "fit-yoga-beginner": { 
      unlockedAt: null, 
      progress: 40 
    },
    "well-nutrition-novice": { 
      unlockedAt: null, 
      progress: 30 
    },
    "fin-investment-initiate": { 
      unlockedAt: null, 
      progress: 20 
    }
  };
  
  // Calculate total points from unlocked achievements
  const unlockedPoints = Object.entries(achievements)
    .filter(([id, data]) => data.unlockedAt !== null)
    .reduce((total, [id]) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      return total + (achievement ? achievement.points : 0);
    }, 0);
  
  // Determine rank based on points
  let rankData = RANK_DEFINITIONS[0]; // Start with beginner
  let nextRankData = RANK_DEFINITIONS[1];
  
  for (let i = 0; i < RANK_DEFINITIONS.length; i++) {
    if (unlockedPoints >= RANK_DEFINITIONS[i].pointsNeeded) {
      rankData = RANK_DEFINITIONS[i];
      nextRankData = RANK_DEFINITIONS[i + 1] || RANK_DEFINITIONS[i];
    } else {
      break;
    }
  }
  
  // Create category levels based on achievements in each category
  const categoryLevels: Record<string, number> = {
    finance: 2,  // Example: user has 2 finance achievements
    career: 1,
    wellness: 1,
    fitness: 0,  // No completed fitness achievements yet
    learning: 1,
    emergency: 0, // No completed emergency achievements yet
    general: 0    // No hidden achievements unlocked
  };
  
  return {
    userId,
    achievements,
    rank: {
      userId,
      level: rankData.level,
      title: rankData.title,
      currentPoints: unlockedPoints,
      nextLevelPoints: nextRankData.pointsNeeded,
      categoryLevels
    },
    streakDays: 5, // Example: user has a 5-day streak
    lastActive: new Date()
  };
};