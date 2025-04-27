/**
 * Quest Mapper
 * Transforms standard learning modules into jungle-themed quests
 */
import { AchievementCategory } from '@/shared/arcade-schema';

// Quest mapping database: transforms standard titles to jungle-themed versions
export const QUEST_MAPPING: Record<string, Record<string, { title: string, description: string }>> = {
  "finance": {
    "Budget Basics": {
      title: "Navigate the River of Resources",
      description: "Master the flow of your resources through the jungle economy. Chart your path to financial clarity through the mist."
    },
    "Savings Starter": {
      title: "Plant the Seeds of Fortune",
      description: "Discover how to nurture your treasure to grow over time in the fertile jungle soil."
    },
    "Investment Initiate": {
      title: "Uncover the Hidden Treasures",
      description: "Learn the ancient secrets of growing wealth through the power of jungle investments."
    },
    "Debt Destroyer": {
      title: "Escape the Quicksand of Debt",
      description: "Master techniques to free yourself from financial traps that lurk in the jungle's shadows."
    },
    "First Budget": {
      title: "Map Your First Resource Trail",
      description: "Create your first chart of resources flowing through your personal jungle economy."
    }
  },
  "career": {
    "Resume Ready": {
      title: "Craft Your Explorer's Scroll",
      description: "Create a powerful document showcasing your jungle expeditions and skills to impress the Council of Elders."
    },
    "Interview Ace": {
      title: "Master the Elder's Trial",
      description: "Prepare for the ancient ritual of questions to prove your worth to the Expedition Leaders."
    },
    "Career Path": {
      title: "Choose Your Expedition Route",
      description: "Explore different paths through the professional jungle and find your true calling."
    },
    "Networking Skills": {
      title: "Form Alliances with Fellow Explorers",
      description: "Learn to create bonds with other jungle travelers to strengthen your expedition."
    }
  },
  "wellness": {
    "Meal Planner": {
      title: "Chart Your Jungle Provisions",
      description: "Plan your nourishment to maintain energy through your jungle expeditions."
    },
    "Nutrition Novice": {
      title: "Identify the Fruits of Vitality",
      description: "Learn which jungle fruits and plants provide the best nourishment for your journey."
    },
    "Sleep Master": {
      title: "Master the Dreaming Canopy",
      description: "Create the perfect resting routine for jungle explorers to rejuvenate fully."
    },
    "Stress Management": {
      title: "Find Peace in the Meditation Grove",
      description: "Learn ancient techniques to calm your mind amidst the jungle chaos."
    }
  },
  "fitness": {
    "First Workout": {
      title: "Begin Your Jungle Training",
      description: "Take your first steps in building the strength needed for jungle exploration."
    },
    "Yoga Beginner": {
      title: "Learn the Poses of the Ancient Sages",
      description: "Master the foundations of body control taught by the jungle's wisest inhabitants."
    },
    "Consistency is Key": {
      title: "Establish Your Warrior's Routine",
      description: "Develop the discipline of regular training needed for serious jungle explorers."
    },
    "Strength Building": {
      title: "Forge the Muscles of a Guardian",
      description: "Build the power needed to overcome physical challenges in the dense jungle."
    }
  },
  "learning": {
    "First Course": {
      title: "Complete Your Initial Expedition",
      description: "Finish your first guided journey through the knowledge territories."
    },
    "Cooking Fundamentals": {
      title: "Master the Flame of Sustenance",
      description: "Learn the ancient arts of preparing nourishment from the jungle's bounty."
    },
    "Knowledge Seeker": {
      title: "Collect the Scrolls of Wisdom",
      description: "Gather diverse knowledge from the various temples hidden throughout the jungle."
    },
    "Language Arts": {
      title: "Decipher the Ancient Symbols",
      description: "Master the mystical communication methods of past jungle civilizations."
    }
  },
  "emergency": {
    "First Aid Ready": {
      title: "Learn the Healing Arts",
      description: "Master life-saving techniques for when dangers strike in the remote jungle."
    },
    "Safety Planner": {
      title: "Establish Your Jungle Haven",
      description: "Create a secure refuge plan for when storms threaten your expedition."
    },
    "Crisis Response": {
      title: "Prepare for the Temple's Trials",
      description: "Learn to navigate unexpected dangers with the wisdom of ancient guardians."
    }
  },
  "general": {
    "Streak Achievement": {
      title: "Follow the Path Consistently",
      description: "Show dedication by returning to the jungle trail day after day without fail."
    },
    "Point Milestone": {
      title: "Amass Ancient Wisdom",
      description: "Collect the sacred tokens of knowledge through multiple jungle expeditions."
    },
    "Profile Complete": {
      title: "Record Your Explorer's Chronicle",
      description: "Document your skills and background in the Great Book of Jungle Travelers."
    }
  }
};

// Default descriptions if specific mapping not found
const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  "finance": "Navigate financial challenges with the wisdom of a jungle explorer.",
  "career": "Forge your professional path through the dense career jungle.",
  "wellness": "Discover natural remedies and practices from the jungle's bounty.",
  "fitness": "Build the strength and endurance of a seasoned jungle warrior.",
  "learning": "Collect knowledge scrolls from the ancient jungle temples.",
  "emergency": "Prepare for unexpected dangers lurking in the jungle shadows.",
  "general": "Master various skills necessary for jungle survival."
};

/**
 * Transforms a standard module title into a jungle-themed quest title
 */
export const mapQuestTitle = (
  originalTitle: string, 
  category: string | AchievementCategory
): string => {
  const categoryKey = category as keyof typeof QUEST_MAPPING;
  
  // Check if we have a specific mapping for this title
  if (QUEST_MAPPING[categoryKey]?.[originalTitle]) {
    return QUEST_MAPPING[categoryKey][originalTitle].title;
  }
  
  // If no specific mapping, add a generic prefix based on category
  const prefixes: Record<string, string[]> = {
    "finance": ["Treasure ", "Golden ", "Wealthy "],
    "career": ["Explorer's ", "Expedition ", "Jungle "],
    "wellness": ["Healing ", "Peaceful ", "Balanced "],
    "fitness": ["Warrior's ", "Strong ", "Agile "],
    "learning": ["Wisdom ", "Ancient ", "Scholar's "],
    "emergency": ["Guardian's ", "Protected ", "Safe "],
    "general": ["Jungle ", "Mysterious ", "Sacred "]
  };
  
  const categoryPrefixes = prefixes[categoryKey] || prefixes.general;
  const randomPrefix = categoryPrefixes[Math.floor(Math.random() * categoryPrefixes.length)];
  
  return `${randomPrefix}${originalTitle}`;
};

/**
 * Transforms a standard module description into a jungle-themed quest description
 */
export const mapQuestDescription = (
  originalTitle: string, 
  category: string | AchievementCategory
): string => {
  const categoryKey = category as keyof typeof QUEST_MAPPING;
  
  // Check if we have a specific mapping for this title
  if (QUEST_MAPPING[categoryKey]?.[originalTitle]) {
    return QUEST_MAPPING[categoryKey][originalTitle].description;
  }
  
  // Return default description based on category
  return DEFAULT_DESCRIPTIONS[categoryKey] || DEFAULT_DESCRIPTIONS.general;
};

/**
 * Custom hook to transform both title and description
 */
export const useQuestMapper = (
  originalTitle: string, 
  originalDescription: string, 
  category: string | AchievementCategory
) => {
  const title = mapQuestTitle(originalTitle, category);
  const description = mapQuestDescription(originalTitle, category);
  
  return { title, description };
};