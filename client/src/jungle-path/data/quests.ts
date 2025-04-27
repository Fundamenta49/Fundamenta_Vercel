/**
 * Jungle Path Quest Definitions
 * Maps achievement data to jungle-themed quests with additional properties
 */
import { Achievement, AchievementCategory } from '@/shared/arcade-schema';
import { QUEST_MAPPING } from '../utils/questMapper';

// Quest difficulty levels
export type QuestDifficulty = 'beginner' | 'explorer' | 'pathfinder' | 'master' | 'legendary';

// Extended quest interface with jungle-themed properties
export interface JungleQuest extends Achievement {
  jungleTitle: string;
  jungleDescription: string;
  difficulty: QuestDifficulty;
  estimatedTime: number; // in minutes
  prerequisiteQuests: string[]; // IDs of quests that should be completed first
  zonePath: string; // Path within the zone for map visualization
  rewards: {
    points: number;
    companions?: string[];
    specialItems?: string[];
  };
}

// Helper function to get the appropriate difficulty
const getDifficultyFromTier = (tier: string): QuestDifficulty => {
  switch (tier) {
    case 'common': return 'beginner';
    case 'uncommon': return 'explorer';
    case 'rare': return 'pathfinder';
    case 'epic': return 'master';
    case 'legendary': return 'legendary';
    default: return 'beginner';
  }
};

// Helper function to get the estimated time based on points
const getEstimatedTime = (points: number): number => {
  // Roughly, 1 point = 1-2 minutes of effort
  return Math.max(5, Math.round(points * 1.5));
};

// Helper function to get prerequisites based on achievement ID
const getPrerequisites = (id: string): string[] => {
  // Map certain achievements to prerequisites
  const PREREQ_MAP: Record<string, string[]> = {
    'fin-investment-initiate': ['fin-budget-basics', 'fin-savings-starter'],
    'fin-debt-destroyer': ['fin-budget-basics', 'fin-investment-initiate'],
    'car-interview-ace': ['car-resume-ready'],
    'well-sleep-master': ['well-meal-planner', 'well-nutrition-novice'],
    'fit-consistency': ['fit-first-workout'],
    'learn-knowledge-seeker': ['learn-first-course', 'learn-cooking-basics'],
    'emerg-safety-plan': ['emerg-first-aid']
  };
  
  return PREREQ_MAP[id] || [];
};

// Transform standard achievements into jungle quests
export const transformToJungleQuests = (achievements: Achievement[]): JungleQuest[] => {
  return achievements.map(achievement => {
    // Get the jungle-themed title and description
    const categoryKey = achievement.category as keyof typeof QUEST_MAPPING;
    const jungleData = QUEST_MAPPING[categoryKey]?.[achievement.title];
    
    const jungleTitle = jungleData?.title || `Jungle ${achievement.title}`;
    const jungleDescription = jungleData?.description || `Complete this jungle challenge: ${achievement.description}`;
    
    return {
      ...achievement,
      jungleTitle,
      jungleDescription,
      difficulty: getDifficultyFromTier(achievement.tier),
      estimatedTime: getEstimatedTime(achievement.points),
      prerequisiteQuests: getPrerequisites(achievement.id),
      zonePath: `${achievement.category}/quest-${achievement.id}`,
      rewards: {
        points: achievement.points,
        companions: achievement.id === 'fin-debt-destroyer' ? ['elephant_wise'] : 
                     achievement.id === 'well-sleep-master' ? ['sloth_calm'] : 
                     achievement.id === 'emerg-safety-plan' ? ['turtle_ancient'] : 
                     undefined,
        specialItems: achievement.tier === 'rare' || achievement.tier === 'epic' || achievement.tier === 'legendary' ? 
                     ['jungle_badge'] : undefined
      }
    };
  });
};

// Get quests for a specific zone
export const getQuestsForZone = (
  achievements: Achievement[], 
  zone: AchievementCategory
): JungleQuest[] => {
  const filteredAchievements = achievements.filter(a => a.category === zone);
  return transformToJungleQuests(filteredAchievements);
};

// Get a quest path sequence based on prerequisites
export const getQuestPathSequence = (quests: JungleQuest[]): string[][] => {
  // Group quests by their prerequisite depth
  const pathLevels: string[][] = [[]];
  const processedQuestIds = new Set<string>();
  
  // First add quests with no prerequisites
  quests.forEach(quest => {
    if (quest.prerequisiteQuests.length === 0) {
      pathLevels[0].push(quest.id);
      processedQuestIds.add(quest.id);
    }
  });
  
  // Then process remaining quests based on prerequisites
  let currentLevel = 1;
  let hasAddedQuests = true;
  
  while (hasAddedQuests) {
    hasAddedQuests = false;
    pathLevels[currentLevel] = [];
    
    quests.forEach(quest => {
      if (processedQuestIds.has(quest.id)) return;
      
      // Check if all prerequisites are satisfied in previous levels
      const prereqsMet = quest.prerequisiteQuests.every(prereqId => 
        processedQuestIds.has(prereqId)
      );
      
      if (prereqsMet) {
        pathLevels[currentLevel].push(quest.id);
        processedQuestIds.add(quest.id);
        hasAddedQuests = true;
      }
    });
    
    if (pathLevels[currentLevel].length === 0) {
      pathLevels.pop(); // Remove empty level
    } else {
      currentLevel++;
    }
  }
  
  return pathLevels;
};