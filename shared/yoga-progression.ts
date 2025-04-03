// Yoga Progression System Types
import { z } from "zod";

// Define the difficulty levels for poses
export const DifficultyLevel = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert"
]);
export type DifficultyLevel = z.infer<typeof DifficultyLevel>;

// Define the structure for XP and levels
export const ProgressionLevelSchema = z.object({
  level: z.number().min(1),
  title: z.string(),
  xpRequired: z.number(),
  unlocks: z.array(z.string())
});
export type ProgressionLevel = z.infer<typeof ProgressionLevelSchema>;

// Define user achievement for a specific pose
export const PoseAchievementSchema = z.object({
  poseId: z.string(),
  masteryLevel: z.number().min(0).max(5), // 0-5 stars mastery rating
  attemptsCount: z.number().default(0),
  lastPracticedAt: z.date().optional(),
  bestScore: z.number().min(0).max(100).default(0),
  unlocked: z.boolean().default(false)
});
export type PoseAchievement = z.infer<typeof PoseAchievementSchema>;

// Define a user's yoga progression
export const UserYogaProgressionSchema = z.object({
  userId: z.string(),
  currentLevel: z.number().default(1),
  totalXp: z.number().default(0),
  streakDays: z.number().default(0),
  lastPracticeDate: z.date().optional(),
  poseAchievements: z.record(z.string(), PoseAchievementSchema).default({}),
  completedChallenges: z.array(z.string()).default([])
});
export type UserYogaProgression = z.infer<typeof UserYogaProgressionSchema>;

// Define a yoga pose with progression details
export const YogaPoseProgressionSchema = z.object({
  id: z.string(),
  name: z.string(),
  sanskritName: z.string().optional(),
  description: z.string(),
  benefits: z.array(z.string()),
  difficulty: DifficultyLevel,
  category: z.string(),
  xpValue: z.number(), // XP earned for mastering this pose
  prerequisites: z.array(z.string()).optional(), // Poses that should be mastered first
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  levelRequired: z.number().default(1), // Minimum user level to unlock
  challengeId: z.string().optional() // Associated challenge if any
});
export type YogaPoseProgression = z.infer<typeof YogaPoseProgressionSchema>;

// Define a yoga challenge
export const YogaChallengeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  poses: z.array(z.string()), // Array of pose IDs
  difficulty: DifficultyLevel,
  xpReward: z.number(),
  levelRequired: z.number().default(1),
  durationDays: z.number().default(7), // Number of days to complete
  badgeImageUrl: z.string().optional()
});
export type YogaChallenge = z.infer<typeof YogaChallengeSchema>;

// Progression levels configuration
export const PROGRESSION_LEVELS: ProgressionLevel[] = [
  { 
    level: 1, 
    title: "Yoga Novice", 
    xpRequired: 0,
    unlocks: ["mountain", "child", "corpse"] 
  },
  { 
    level: 2, 
    title: "Steady Practitioner", 
    xpRequired: 100,
    unlocks: ["downward_dog", "cat_cow", "forward_fold"] 
  },
  { 
    level: 3, 
    title: "Balanced Yogi", 
    xpRequired: 250,
    unlocks: ["tree", "warrior_1", "warrior_2"] 
  },
  { 
    level: 4, 
    title: "Focused Adept", 
    xpRequired: 500,
    unlocks: ["triangle", "chair", "bridge"] 
  },
  { 
    level: 5, 
    title: "Flexible Master", 
    xpRequired: 1000,
    unlocks: ["half_moon", "eagle", "pigeon"] 
  },
  { 
    level: 6, 
    title: "Strength Guru", 
    xpRequired: 2000,
    unlocks: ["crow", "side_plank", "boat"] 
  },
  { 
    level: 7, 
    title: "Inversion Explorer", 
    xpRequired: 3500,
    unlocks: ["headstand_prep", "dolphin", "forearm_stand_prep"] 
  },
  { 
    level: 8, 
    title: "Balance Virtuoso", 
    xpRequired: 5000,
    unlocks: ["dancer", "warrior_3", "half_bound_lotus"] 
  },
  { 
    level: 9, 
    title: "Enlightened Practitioner", 
    xpRequired: 7500,
    unlocks: ["king_pigeon", "firefly_prep", "peacock_prep"] 
  },
  { 
    level: 10, 
    title: "Yoga Master", 
    xpRequired: 10000,
    unlocks: ["handstand", "forearm_stand", "full_lotus"] 
  }
];