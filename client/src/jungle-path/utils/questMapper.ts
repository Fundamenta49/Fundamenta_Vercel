import { JungleQuest, QuestProgress } from '../types/quest';
import { getZoneByCategory } from './zoneUtils';

// Type for the original learning module data structure
interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
}

// Type for user progress data
interface UserProgressData {
  [moduleId: string]: {
    progressPercent: number;
    startedAt: string | null;
    completedAt: string | null;
  };
}

/**
 * Maps a category to a jungle-themed quest prefix
 */
const getCategoryPrefix = (category: string): string => {
  const prefixMap: Record<string, string[]> = {
    financial: [
      'Treasure Hunt:',
      'Resource Expedition:',
      'Navigate the River of',
      'Golden Trail:',
      'Wealth Seeker:'
    ],
    wellness: [
      'Healing Grove:',
      'Mind Oasis:',
      'Tranquil Pools of',
      'Serene Canopy:',
      'Spirit Journey:'
    ],
    fitness: [
      'Strength Challenge:',
      'Jungle Traverse:',
      'Swift Rapids of',
      'Endurance Trek:',
      'Primal Power:'
    ],
    career: [
      'Summit Climb:',
      'Highland Strategy:',
      'Career Peaks of',
      'Professional Expedition:',
      'Leadership Vista:'
    ],
    leadership: [
      'Ancient Temple of',
      'Command Ritual:',
      'Wisdom Path:',
      'Ancient Scrolls of',
      'Legacy Trial:'
    ],
    adventure: [
      'Uncharted Territory:',
      'Danger Falls:',
      'Secret Cave of',
      'Epic Expedition:',
      'Legendary Quest:'
    ]
  };

  // Default to general if category not found
  const options = prefixMap[category] || [
    'Jungle Discovery:',
    'Wild Path of',
    'Mysterious Journey:',
    'Forest Secrets:',
    'Hidden Knowledge:'
  ];

  // Randomly select one prefix from the list
  return options[Math.floor(Math.random() * options.length)];
};

/**
 * Transforms the description into a jungle-themed description
 */
const getJungleDescription = (description: string, category: string): string => {
  // Get 2-3 thematic words based on the category
  const thematicWords: Record<string, string[]> = {
    financial: ['treasure', 'resources', 'wealth', 'gold', 'riches', 'trading'],
    wellness: ['healing', 'balance', 'tranquility', 'spirit', 'harmony', 'nature'],
    fitness: ['strength', 'endurance', 'agility', 'power', 'swiftness', 'stamina'],
    career: ['climb', 'summit', 'path', 'journey', 'vista', 'strategy'],
    leadership: ['wisdom', 'ancient', 'command', 'ritual', 'legacy', 'tribe'],
    adventure: ['danger', 'expedition', 'discovery', 'quest', 'challenge', 'legend']
  };

  const words = thematicWords[category] || thematicWords.adventure;
  
  // Select 2 random words from the category's themed words
  const selectedWords: string[] = [];
  while (selectedWords.length < 2) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (!selectedWords.includes(randomWord)) {
      selectedWords.push(randomWord);
    }
  }

  // Get a random jungle narrative intro
  const jungleIntros = [
    `Deep in the jungle, you'll discover ${selectedWords[0]} and ${selectedWords[1]} as you`,
    `Venture through dense foliage to ${selectedWords[0]} your way as you`,
    `Navigate treacherous terrain with ${selectedWords[0]} and ${selectedWords[1]} while you`,
    `Under the jungle canopy, seek ${selectedWords[0]} and master ${selectedWords[1]} as you`,
    `With the calls of exotic birds overhead, you'll explore ${selectedWords[0]} and ${selectedWords[1]} when you`
  ];

  const intro = jungleIntros[Math.floor(Math.random() * jungleIntros.length)];
  
  // Convert the first letter of the description to lowercase if it's not already
  const firstChar = description.charAt(0).toLowerCase();
  const restOfDesc = description.slice(1);
  const lowerCaseDesc = firstChar + restOfDesc;
  
  // Replace certain words to make it more jungle-themed
  const themedDesc = lowerCaseDesc
    .replace(/learn/gi, 'discover')
    .replace(/understand/gi, 'uncover')
    .replace(/create/gi, 'craft')
    .replace(/develop/gi, 'forge')
    .replace(/build/gi, 'construct')
    .replace(/analyze/gi, 'track')
    .replace(/study/gi, 'observe')
    .replace(/practice/gi, 'train');
  
  return `${intro} ${themedDesc}`;
};

/**
 * Maps original learning modules to jungle-themed quests
 */
export const mapModulesToQuests = (
  modules: LearningModule[], 
  progressData: UserProgressData = {}
): { 
  jungleQuests: JungleQuest[],
  questProgress: Record<string, QuestProgress>
} => {
  const jungleQuests: JungleQuest[] = modules.map(module => {
    // Get the corresponding zone based on module category
    const zone = getZoneByCategory(module.category);
    
    // Generate a jungle-themed title
    const prefix = getCategoryPrefix(module.category);
    const jungleTitle = prefix.includes(':') 
      ? `${prefix} ${module.title}`
      : `${prefix} ${module.title}`;
      
    // Generate a jungle-themed description
    const jungleDescription = getJungleDescription(module.description, module.category);
    
    return {
      id: module.id,
      originalTitle: module.title,
      jungleTitle,
      originalDescription: module.description,
      jungleDescription,
      category: module.category,
      zoneId: zone?.id,
      estimatedTime: module.estimatedTime,
      difficulty: Math.floor(Math.random() * 3) + 1, // Random difficulty between 1-3
      requiredRank: zone?.requiredRank || 0,
    };
  });
  
  // Map progress data to a standardized format
  const questProgress: Record<string, QuestProgress> = {};
  
  Object.entries(progressData).forEach(([moduleId, progress]) => {
    questProgress[moduleId] = {
      progressPercent: progress.progressPercent,
      startedAt: progress.startedAt,
      completedAt: progress.completedAt
    };
  });
  
  return { jungleQuests, questProgress };
};