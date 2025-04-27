import { JungleQuest } from '../types/quest';
import { getZoneByCategory } from './zoneUtils';

// Quest transformation templates by category
const QUEST_TEMPLATES: Record<string, Array<{
  titleTemplate: string;
  descriptionTemplate: string;
}>> = {
  wellness: [
    {
      titleTemplate: 'Traverse the $1 Trail',
      descriptionTemplate: 'Journey through ancient paths to discover $1 practices for your well-being.'
    },
    {
      titleTemplate: 'The Hidden $1 Grove',
      descriptionTemplate: 'Uncover secret wellness techniques guarded by the keepers of the $1 Grove.'
    }
  ],
  finance: [
    {
      titleTemplate: 'River of $1 Resources',
      descriptionTemplate: 'Navigate the flowing waters of $1 to master your financial journey.'
    },
    {
      titleTemplate: 'Treasure Map: $1',
      descriptionTemplate: 'Follow the ancient markings to uncover the hidden wealth of $1 knowledge.'
    }
  ],
  career: [
    {
      titleTemplate: 'Temple of $1 Wisdom',
      descriptionTemplate: 'Study the ancient hieroglyphs carved into the walls of the $1 Temple.'
    },
    {
      titleTemplate: 'The $1 Expedition',
      descriptionTemplate: 'Join a band of career explorers on a quest to master $1 skills.'
    }
  ],
  relationships: [
    {
      titleTemplate: 'Banyan Connections: $1',
      descriptionTemplate: 'Explore the interconnected roots of $1 and build stronger relationship skills.'
    },
    {
      titleTemplate: 'Campfire Stories: $1',
      descriptionTemplate: 'Share wisdom around the ancient campfire to understand the art of $1.'
    }
  ],
  skills: [
    {
      titleTemplate: 'Crystal Cavern of $1',
      descriptionTemplate: 'Mine the glittering crystals of knowledge to master $1 skills.'
    },
    {
      titleTemplate: 'Artifact of $1 Mastery',
      descriptionTemplate: 'Recover a lost artifact containing the secrets of $1 excellence.'
    }
  ],
  growth: [
    {
      titleTemplate: 'Summit of $1 Achievement',
      descriptionTemplate: 'Climb to new heights and master the peaks of $1 for personal growth.'
    },
    {
      titleTemplate: 'Jungle Transformation: $1',
      descriptionTemplate: 'Witness the metamorphosis of your skills as you journey through $1 practices.'
    }
  ],
  default: [
    {
      titleTemplate: 'Jungle Expedition: $1',
      descriptionTemplate: 'Embark on a journey through uncharted territory to master $1.'
    }
  ]
};

/**
 * Substitutes keywords into templates
 */
const applyTemplate = (template: string, keyword: string): string => {
  return template.replace('$1', keyword);
};

/**
 * Generates a title keyword from the original title
 */
const getKeyword = (title: string): string => {
  // Remove common filler words and get main concepts
  const fillerWords = ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'with', 'about'];
  const words = title.split(' ');
  
  // Try to find the most meaningful word
  const mainWords = words.filter(word => 
    word.length > 3 && !fillerWords.includes(word.toLowerCase())
  );
  
  if (mainWords.length > 0) {
    // Use the longest word or phrase as the keyword
    return mainWords.sort((a, b) => b.length - a.length)[0];
  }
  
  // Fallback to the original title if no good keyword found
  return title;
};

/**
 * Transforms a regular module into a jungle-themed quest
 */
export const mapQuestToJungle = (module: {
  id: string;
  title: string;
  description: string;
  type: string; 
  category: string;
  estimatedTime: number;
}): JungleQuest => {
  // Get templates for this category
  const templates = QUEST_TEMPLATES[module.category] || QUEST_TEMPLATES.default;
  
  // Pick a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Get the keyword from the title
  const keyword = getKeyword(module.title);
  
  // Apply templates
  const jungleTitle = applyTemplate(template.titleTemplate, keyword);
  const jungleDescription = applyTemplate(template.descriptionTemplate, keyword);
  
  // Determine required rank based on category
  const zone = getZoneByCategory(module.category);
  const requiredRank = zone ? zone.requiredRank : 0;
  
  // Return transformed quest
  return {
    id: module.id,
    originalTitle: module.title,
    originalDescription: module.description,
    jungleTitle,
    jungleDescription,
    category: module.category,
    type: module.type,
    estimatedTime: module.estimatedTime,
    requiredRank
  };
};

/**
 * Maps an array of modules to jungle quests
 */
export const mapModulesToJungleQuests = (modules: Array<{
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  estimatedTime: number;
}>): JungleQuest[] => {
  return modules.map(module => mapQuestToJungle(module));
};