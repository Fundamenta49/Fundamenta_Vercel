import { JungleQuest, QuestProgress } from '../types/quest';
import { getZoneByCategory } from './zoneUtils';

// Type for the original learning module data structure
interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  href?: string;
  difficulty?: number;
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
 * Category-specific prefix mapping object for consistent naming
 * Each category has multiple prefix options for variety
 */
const CATEGORY_PREFIXES: Record<string, string[]> = {
  // Finance-related themes
  financial: [
    'Treasure Hunt:',
    'Resource Expedition:',
    'Navigate the River of',
    'Golden Trail:',
    'Wealth Seeker:'
  ],
  finance: [
    'Treasure Hunt:',
    'Golden Trail:',
    'Wealth Seeker:',
    'Resource Expedition:',
    'Jungle Treasury:'
  ],
  money: [
    'Gem Collector:',
    'Trading Post:',
    'Treasure Map to',
    'Guild of',
    'Ancient Riches:'
  ],
  // Wellness-related themes
  wellness: [
    'Healing Grove:',
    'Mind Oasis:',
    'Tranquil Pools of',
    'Serene Canopy:',
    'Spirit Journey:'
  ],
  health: [
    'Vitality Springs:',
    'Healing Ritual:',
    'Ancient Remedy for',
    'Jungle Medicine:',
    'Natural Balance:'
  ],
  nutrition: [
    'Foraging Expedition:',
    'Nature\'s Bounty:',
    'Wild Harvest of',
    'Sacred Plants:',
    'Jungle Diet:'
  ],
  // Fitness-related themes
  fitness: [
    'Strength Challenge:',
    'Jungle Traverse:',
    'Swift Rapids of',
    'Endurance Trek:',
    'Primal Power:'
  ],
  workout: [
    'Warrior Training:',
    'Jungle Warrior:',
    'Predator Agility:',
    'Primal Movement:',
    'Survival Strength:'
  ],
  exercise: [
    'Vine Swinger:',
    'Jungle Sprints:',
    'Wild Movement:',
    'Hunter\'s Agility:',
    'Tribal Training:'
  ],
  // Career-related themes
  career: [
    'Summit Climb:',
    'Highland Strategy:',
    'Career Peaks of',
    'Professional Expedition:',
    'Leadership Vista:'
  ],
  work: [
    'Tribal Council:',
    'Hunting Party:',
    'Scouting Mission:',
    'Jungle Craft:',
    'Expert Pathfinder:'
  ],
  job: [
    'Village Builder:',
    'Jungle Trade:',
    'Expedition Leader:',
    'Resource Scout:',
    'Tribe Specialist:'
  ],
  // Leadership themes
  leadership: [
    'Ancient Temple of',
    'Command Ritual:',
    'Wisdom Path:',
    'Ancient Scrolls of',
    'Legacy Trial:'
  ],
  // Adventure themes
  adventure: [
    'Uncharted Territory:',
    'Danger Falls:',
    'Secret Cave of',
    'Epic Expedition:',
    'Legendary Quest:'
  ],
  // Cooking themes
  cooking: [
    'Forest Feast:',
    'Wild Harvest:',
    'Jungle Kitchen:',
    'Tribal Recipe:',
    'Exotic Flavors:'
  ],
  // Home themes
  home: [
    'Jungle Shelter:',
    'Canopy Home:',
    'Habitat Craft:',
    'Tribe Dwelling:',
    'Nature\'s Refuge:'
  ],
  // Emergency themes  
  emergency: [
    'Survival Protocol:',
    'Danger Alert:',
    'Jungle Rescue:',
    'Crisis Navigation:',
    'Protection Ritual:'
  ]
};

/**
 * Gets a consistent prefix for a module based on its ID and category
 * This ensures the same module always gets the same themed name
 */
const getCategoryPrefix = (moduleId: string, category: string): string => {
  // Normalize the category to match our mapping keys
  const normalizedCategory = category.toLowerCase();
  
  // Find the appropriate prefix list, or use default
  let prefixList: string[] = [];
  
  // Check for direct category match
  if (normalizedCategory in CATEGORY_PREFIXES) {
    prefixList = CATEGORY_PREFIXES[normalizedCategory];
  } else {
    // Check for partial matches
    const matchingCategories = Object.keys(CATEGORY_PREFIXES).filter(key => 
      normalizedCategory.includes(key) || key.includes(normalizedCategory)
    );
    
    if (matchingCategories.length > 0) {
      prefixList = CATEGORY_PREFIXES[matchingCategories[0]];
    } else {
      // Default to general if no match found
      prefixList = [
        'Jungle Discovery:',
        'Wild Path of',
        'Mysterious Journey:',
        'Forest Secrets:',
        'Hidden Knowledge:'
      ];
    }
  }
  
  // Use a deterministic selection based on the module ID
  const idSum = moduleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const prefixIndex = idSum % prefixList.length;
  
  return prefixList[prefixIndex];
};

/**
 * Category-specific thematic words for descriptions
 */
const THEMATIC_WORDS: Record<string, string[]> = {
  financial: ['treasure', 'resources', 'wealth', 'gold', 'riches', 'trading', 'gems', 'fortune'],
  finance: ['treasure', 'gold', 'wealth', 'gems', 'riches', 'fortune', 'trading', 'abundance'],
  money: ['treasure', 'gold', 'riches', 'gems', 'trading', 'fortune', 'resources', 'wealth'],
  wellness: ['healing', 'balance', 'tranquility', 'spirit', 'harmony', 'nature', 'vitality', 'serenity'],
  health: ['vitality', 'healing', 'strength', 'medicine', 'remedy', 'balance', 'vigor', 'restoration'],
  nutrition: ['foraging', 'harvest', 'nourishment', 'plants', 'fruits', 'berries', 'roots', 'herbs'],
  fitness: ['strength', 'endurance', 'agility', 'power', 'swiftness', 'stamina', 'prowess', 'vigor'],
  workout: ['training', 'strength', 'power', 'agility', 'warrior', 'endurance', 'prowess', 'movement'],
  exercise: ['movement', 'agility', 'training', 'prowess', 'technique', 'practice', 'ritual', 'skill'],
  career: ['climb', 'summit', 'path', 'journey', 'vista', 'strategy', 'advancement', 'mastery'],
  work: ['craft', 'skill', 'tribe', 'community', 'trade', 'expertise', 'mastery', 'vocation'],
  job: ['trade', 'craft', 'skill', 'hunting', 'gathering', 'building', 'creating', 'leading'],
  leadership: ['wisdom', 'ancient', 'command', 'ritual', 'legacy', 'tribe', 'council', 'guidance'],
  adventure: ['danger', 'expedition', 'discovery', 'quest', 'challenge', 'legend', 'journey', 'exploration'],
  cooking: ['feast', 'harvest', 'flavors', 'preparation', 'ritual', 'nourishment', 'gathering', 'cuisine'],
  home: ['shelter', 'dwelling', 'sanctuary', 'habitat', 'territory', 'construction', 'building', 'fortress'],
  emergency: ['survival', 'danger', 'safety', 'protection', 'alert', 'rescue', 'preparation', 'protocol']
};

/**
 * Gets thematic words for a specific category 
 */
const getThematicWords = (category: string): string[] => {
  // Normalize the category
  const normalizedCategory = category.toLowerCase();
  
  // Check for direct match
  if (normalizedCategory in THEMATIC_WORDS) {
    return THEMATIC_WORDS[normalizedCategory];
  }
  
  // Check for partial match
  const matchingCategories = Object.keys(THEMATIC_WORDS).filter(key => 
    normalizedCategory.includes(key) || key.includes(normalizedCategory)
  );
  
  if (matchingCategories.length > 0) {
    return THEMATIC_WORDS[matchingCategories[0]];
  }
  
  // Default to adventure words
  return THEMATIC_WORDS.adventure;
};

/**
 * Jungle-themed narrative introduction patterns
 */
const JUNGLE_INTROS = [
  (word1: string, word2: string) => `Deep in the jungle, you'll discover ${word1} and ${word2} as you`,
  (word1: string, word2: string) => `Venture through dense foliage to ${word1} your way as you`,
  (word1: string, word2: string) => `Navigate treacherous terrain with ${word1} and ${word2} while you`,
  (word1: string, word2: string) => `Under the jungle canopy, seek ${word1} and master ${word2} as you`,
  (word1: string, word2: string) => `With the calls of exotic birds overhead, you'll explore ${word1} and ${word2} when you`,
  (word1: string, word2: string) => `Ancient tribal wisdom teaches us to harness ${word1} and ${word2} to`,
  (word1: string, word2: string) => `Following secret paths marked with ${word1}, discover the power of ${word2} to`,
  (word1: string, word2: string) => `The journey through untamed wilderness reveals ${word1} and ${word2} when you`
];

/**
 * Word replacement mapping for jungle theme
 */
const WORD_REPLACEMENTS: Record<string, string> = {
  'learn': 'discover',
  'understand': 'uncover',
  'create': 'craft',
  'develop': 'forge',
  'build': 'construct',
  'analyze': 'track',
  'study': 'observe',
  'practice': 'train',
  'master': 'conquer',
  'comprehend': 'decipher',
  'improve': 'enhance',
  'grow': 'flourish',
  'explore': 'traverse',
  'investigate': 'scout',
  'research': 'hunt for',
  'examine': 'inspect',
  'review': 'survey',
  'complete': 'achieve',
  'finish': 'accomplish',
  'begin': 'embark on',
  'start': 'initiate',
  'make': 'fashion',
  'use': 'wield',
  'implement': 'deploy',
  'apply': 'harness',
  'work': 'labor',
  'strategy': 'tactics',
  'plan': 'map',
  'guide': 'navigate',
  'advise': 'counsel',
  'help': 'aid',
  'assist': 'support'
};

/**
 * Transforms a standard description into a jungle-themed description
 * Uses deterministic selection based on module ID for consistency
 */
const createJungleDescription = (moduleId: string, description: string, category: string): string => {
  // Get thematic words for this category
  const words = getThematicWords(category);
  
  // Select two words deterministically based on module ID
  const idSum = moduleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const word1Index = idSum % words.length;
  const word2Index = (idSum + 7) % words.length; // Offset to avoid same word
  
  const selectedWords = [
    words[word1Index],
    words[word1Index === word2Index ? (word2Index + 1) % words.length : word2Index]
  ];
  
  // Select intro pattern deterministically
  const introIndex = (idSum + 3) % JUNGLE_INTROS.length;
  const introFn = JUNGLE_INTROS[introIndex];
  const intro = introFn(selectedWords[0], selectedWords[1]);
  
  // Convert the first letter of the description to lowercase if it's not already
  const firstChar = description.charAt(0).toLowerCase();
  const restOfDesc = description.slice(1);
  const lowerCaseDesc = firstChar + restOfDesc;
  
  // Replace words with jungle-themed alternatives
  let themedDesc = lowerCaseDesc;
  Object.entries(WORD_REPLACEMENTS).forEach(([original, replacement]) => {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    themedDesc = themedDesc.replace(regex, replacement);
  });
  
  return `${intro} ${themedDesc}`;
};

/**
 * Maps original learning modules to jungle-themed quests
 * This function ensures consistent transformation of content
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
    
    // Generate a jungle-themed title (consistent for the same module)
    const prefix = getCategoryPrefix(module.id, module.category);
    const jungleTitle = prefix.includes(':') 
      ? `${prefix} ${module.title}`
      : `${prefix} ${module.title}`;
      
    // Generate a jungle-themed description
    const jungleDescription = createJungleDescription(
      module.id, 
      module.description, 
      module.category
    );
    
    // Calculate difficulty if not provided (1-3 scale)
    const difficulty = module.difficulty || (
      // Deterministic "random" based on module ID
      (module.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3) + 1
    );
    
    return {
      id: module.id,
      originalTitle: module.title,
      jungleTitle,
      originalDescription: module.description,
      jungleDescription,
      category: module.category,
      zoneId: zone?.id,
      estimatedTime: module.estimatedTime,
      difficulty,
      requiredRank: zone?.requiredRank || 0,
      href: module.href,
      // Tags and metadata can be added here in future enhancements
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

/**
 * Utility function to get jungle-themed title for a single module
 */
export const getJungleTitle = (
  moduleId: string, 
  title: string, 
  category: string
): string => {
  const prefix = getCategoryPrefix(moduleId, category);
  return prefix.includes(':') 
    ? `${prefix} ${title}`
    : `${prefix} ${title}`;
};

/**
 * Utility function to get jungle-themed description for a single module
 */
export const getJungleDescription = (
  moduleId: string, 
  description: string, 
  category: string
): string => {
  return createJungleDescription(moduleId, description, category);
};