import { JungleQuest } from '../types/quest';
import { getZoneByCategory } from './zoneUtils';

/**
 * Maps for transforming regular titles into jungle-themed quest titles
 */
const TITLE_PREFIXES = {
  // Finance zone transformations
  finance: [
    { original: 'budget', jungle: 'navigate the river of' },
    { original: 'saving', jungle: 'collect the golden' },
    { original: 'investment', jungle: 'plant the seeds of' },
    { original: 'debt', jungle: 'escape the quicksand of' },
    { original: 'tax', jungle: 'map the territory of' },
    { original: 'retirement', jungle: 'discover the ancient treasure of' },
    { original: 'insurance', jungle: 'build a shelter against' },
    
    // Generic finance fallbacks
    { original: '', jungle: 'navigate the currents of' },
    { original: '', jungle: 'uncover the hidden wealth of' },
    { original: '', jungle: 'chart a course through' }
  ],
  
  // Wellness zone transformations
  wellness: [
    { original: 'meditation', jungle: 'find serenity in the temple of' },
    { original: 'sleep', jungle: 'restore at the sacred pools of' },
    { original: 'stress', jungle: 'calm the wild winds of' },
    { original: 'mindfulness', jungle: 'attune to the whispers of' },
    { original: 'mental health', jungle: 'strengthen the inner canopy of' },
    { original: 'balance', jungle: 'walk the ancient path of' },
    
    // Generic wellness fallbacks
    { original: '', jungle: 'discover the healing springs of' },
    { original: '', jungle: 'breathe the revitalizing air of' },
    { original: '', jungle: 'harmonize with the rhythms of' }
  ],
  
  // Career zone transformations
  career: [
    { original: 'interview', jungle: 'face the guardian of' },
    { original: 'resume', jungle: 'craft the scroll of' },
    { original: 'networking', jungle: 'forge alliances at the' },
    { original: 'negotiation', jungle: 'barter with the keepers of' },
    { original: 'leadership', jungle: 'ascend the peak of' },
    { original: 'skills', jungle: 'master the ancient arts of' },
    
    // Generic career fallbacks
    { original: '', jungle: 'unlock the temple gate of' },
    { original: '', jungle: 'decipher the stone tablets of' },
    { original: '', jungle: 'claim your rightful place in' }
  ],
  
  // Fitness zone transformations
  fitness: [
    { original: 'strength', jungle: 'build the power of the' },
    { original: 'cardio', jungle: 'race through the valley of' },
    { original: 'flexibility', jungle: 'flow like the river of' },
    { original: 'endurance', jungle: 'outlast the trials of the' },
    { original: 'training', jungle: 'conquer the mountains of' },
    { original: 'nutrition', jungle: 'harvest the fruits of' },
    
    // Generic fitness fallbacks
    { original: '', jungle: 'test your might against the' },
    { original: '', jungle: 'journey beyond the peaks of' },
    { original: '', jungle: 'harness the primal energy of' }
  ],
  
  // Default transformations for all categories
  default: [
    { original: 'basics', jungle: 'first steps into' },
    { original: 'introduction', jungle: 'gateway to' },
    { original: 'fundamentals', jungle: 'uncover the secrets of' },
    { original: 'guide', jungle: 'expedition through' },
    { original: 'essentials', jungle: 'gather vital provisions for' },
    { original: 'advanced', jungle: 'master the mysteries of' },
    
    // Pure fallbacks
    { original: '', jungle: 'venture into the unknown' },
    { original: '', jungle: 'explore the wilderness of' },
    { original: '', jungle: 'trek through the wonders of' }
  ]
};

/**
 * Transform regular module into a jungle quest
 */
export const transformToJungleQuest = (
  moduleId: string,
  title: string,
  description: string,
  category: string,
  points: number,
  estimatedTime: number
): JungleQuest => {
  const jungleTitle = transformTitle(title, category);
  const jungleDescription = transformDescription(description, category);
  const zone = getZoneByCategory(category)?.id || 'basecamp';
  const difficulty = getQuestDifficulty(points);
  
  return {
    id: moduleId,
    originalTitle: title,
    originalDescription: description,
    jungleTitle,
    jungleDescription,
    category,
    zone,
    difficulty,
    points,
    estimatedTime,
    requiredRank: getZoneByCategory(category)?.requiredRank || 0
  };
};

/**
 * Transform a regular title into a jungle-themed quest title
 */
export const transformTitle = (title: string, category: string): string => {
  // Convert title to lowercase for matching
  const lowerTitle = title.toLowerCase();
  
  // Get appropriate mapping for this category
  const categoryMapping = TITLE_PREFIXES[category as keyof typeof TITLE_PREFIXES] || TITLE_PREFIXES.default;
  
  // Find a specific match
  for (const mapping of categoryMapping) {
    if (mapping.original && lowerTitle.includes(mapping.original)) {
      // Replace the matched term with the jungle prefix
      const regex = new RegExp(mapping.original, 'i');
      return title.replace(
        regex, 
        mapping.jungle.charAt(0).toUpperCase() + mapping.jungle.slice(1)
      );
    }
  }
  
  // If no specific match found, use a fallback (empty original string)
  const fallbacks = categoryMapping.filter(m => m.original === '');
  if (fallbacks.length > 0) {
    // Pick a random fallback
    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return `${fallback.jungle.charAt(0).toUpperCase() + fallback.jungle.slice(1)} ${title}`;
  }
  
  // Ultimate fallback
  return `Explore the Jungle of ${title}`;
};

/**
 * Transform a regular description into a jungle-themed quest description
 */
export const transformDescription = (description: string, category: string): string => {
  // For the MVP, we'll just add a jungle-themed prefix to the description
  const prefixes = [
    "Trek through the wilderness as you ",
    "Your expedition awaits as you ",
    "Journey into uncharted territory to ",
    "Venture beyond the jungle's edge and ",
    "Brave the untamed wilderness to "
  ];
  
  // Select a random prefix
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  // Ensure the description starts with a lowercase letter to flow from the prefix
  let processedDesc = description;
  if (processedDesc.charAt(0) === processedDesc.charAt(0).toUpperCase()) {
    processedDesc = processedDesc.charAt(0).toLowerCase() + processedDesc.slice(1);
  }
  
  return `${prefix}${processedDesc}`;
};

/**
 * Determine quest difficulty based on points
 */
export const getQuestDifficulty = (points: number): 'beginner' | 'intermediate' | 'advanced' => {
  if (points < 50) return 'beginner';
  if (points < 150) return 'intermediate';
  return 'advanced';
};