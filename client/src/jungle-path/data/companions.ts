/**
 * Jungle Path Companion System
 * Data for animal companions that guide users through the jungle experience
 */
import { AchievementCategory } from '@/shared/arcade-schema';

// Companion type definition
export interface Companion {
  id: string;
  name: string;
  type: string;
  specialtyZone: AchievementCategory;
  personality: string;
  unlockRequirements: string[]; // Achievement IDs required to unlock
  tier: 'free' | 'tier1' | 'tier2' | 'tier3'; // Which payment tier this is available in
  avatar: string; // Path to SVG or URL
  messages: {
    greeting: string;
    encouragement: string[];
    celebration: string[];
    tips: Record<string, string>; // Category-specific tips
  };
}

// Base collection of companions
export const COMPANIONS: Companion[] = [
  {
    id: "wisdom_owl",
    name: "Professor Hoot",
    type: "owl",
    specialtyZone: "learning",
    personality: "scholarly",
    unlockRequirements: ["learn-first-course"],
    tier: "free",
    avatar: "/assets/companions/owl.svg", // Path will need to be created
    messages: {
      greeting: "Greetings, knowledge seeker! I'm Professor Hoot, guardian of jungle wisdom.",
      encouragement: [
        "Every quest completed adds a page to your book of wisdom!",
        "The ancient scrolls await your discovery in the Scholar's Grove.",
        "Knowledge is the true treasure of the jungle. Seek it diligently!"
      ],
      celebration: [
        "Magnificent discovery! Your knowledge grows like the ancient trees!",
        "The wisdom of the ages is now yours to command!",
        "The jungle reveals its secrets to those who study its patterns."
      ],
      tips: {
        learning: "Try connecting concepts across different paths of study.",
        finance: "Financial wisdom is built through consistent practice.",
        career: "Your expedition scroll should highlight your unique journey.",
        wellness: "Balance in knowledge leads to balance in life.",
        fitness: "A strong mind requires a strong vessel.",
        emergency: "Preparation is the foundation of all wisdom."
      }
    }
  },
  {
    id: "jaguar_swift",
    name: "Sprint",
    type: "jaguar",
    specialtyZone: "fitness",
    personality: "energetic",
    unlockRequirements: ["fit-first-workout"],
    tier: "free",
    avatar: "/assets/companions/jaguar.svg", // Path will need to be created
    messages: {
      greeting: "Ready to race through the jungle trails? I'm Sprint, your fitness guide!",
      encouragement: [
        "Push harder! The jungle rewards those with endurance!",
        "Feel your strength growing with each movement!",
        "The greatest explorers maintain their physical prowess!"
      ],
      celebration: [
        "Incredible pace! You're becoming one with the jungle's rhythm!",
        "Your agility rivals the most skilled jungle creatures!",
        "Few explorers achieve the physical mastery you've demonstrated!"
      ],
      tips: {
        fitness: "Consistency builds strength faster than intensity alone.",
        wellness: "Proper recovery is as important as the exertion.",
        learning: "The body and mind must both be exercised to grow.",
        finance: "Invest in your physical wellbeing as you would your gold.",
        career: "Demonstrating vitality shows you can handle challenges.",
        emergency: "Physical readiness is crucial in unexpected situations."
      }
    }
  },
  {
    id: "toucan_bright",
    name: "Chirpy",
    type: "toucan",
    specialtyZone: "career",
    personality: "optimistic",
    unlockRequirements: ["car-resume-ready"],
    tier: "tier1",
    avatar: "/assets/companions/toucan.svg", // Path will need to be created
    messages: {
      greeting: "Hello, ambitious explorer! I'm Chirpy, here to help you soar in your career journey!",
      encouragement: [
        "Your expedition scroll is looking more impressive every day!",
        "The Council of Elders will certainly be impressed by your growing skills!",
        "Keep adding colorful achievements to your professional plumage!"
      ],
      celebration: [
        "Look how high you're flying on your career path now!",
        "You've added such vibrant experiences to your professional journey!",
        "The jungle's opportunities unfold before someone with your talents!"
      ],
      tips: {
        career: "Highlight the unique skills that make you stand out from other explorers.",
        learning: "Specialized knowledge opens rare pathways through the jungle.",
        finance: "Career advancement often leads to greater treasure discoveries.",
        wellness: "Maintain your vibrant energy during professional challenges.",
        fitness: "Endurance helps you persist when career paths become steep.",
        emergency: "Always have a contingency route mapped for your career journey."
      }
    }
  },
  {
    id: "elephant_wise",
    name: "Memoria",
    type: "elephant",
    specialtyZone: "finance",
    personality: "methodical",
    unlockRequirements: ["fin-budget-basics"],
    tier: "tier1",
    avatar: "/assets/companions/elephant.svg", // Path will need to be created
    messages: {
      greeting: "Welcome, prudent jungle traveler. I am Memoria, keeper of resource wisdom.",
      encouragement: [
        "Your resource management shows promising growth, like a well-tended garden.",
        "The careful explorer always tracks the flow of their provisions.",
        "Small, consistent efforts create great abundance over time."
      ],
      celebration: [
        "Your treasury flourishes! You've mastered the ancient arts of resource cultivation!",
        "Few explorers demonstrate such skillful management of their jungle treasures!",
        "The future path looks abundant and secure thanks to your careful planning!"
      ],
      tips: {
        finance: "Track every resource, no matter how small. They accumulate over time.",
        learning: "Financial wisdom is built through study and consistent application.",
        career: "Greater skills often lead to more abundant resource discoveries.",
        wellness: "Balance spending between immediate needs and future security.",
        fitness: "Invest in your physical wellbeing; it pays dividends in energy.",
        emergency: "Always maintain a reserve of resources for unexpected challenges."
      }
    }
  },
  {
    id: "monkey_clever",
    name: "Nimble",
    type: "monkey",
    specialtyZone: "general",
    personality: "playful",
    unlockRequirements: [],
    tier: "free",
    avatar: "/assets/companions/monkey.svg", // Path will need to be created
    messages: {
      greeting: "Hi there, jungle friend! I'm Nimble, ready to swing through adventures with you!",
      encouragement: [
        "The jungle is full of surprises - let's discover them together!",
        "Every path has something fun to learn. Which shall we explore today?",
        "Keep climbing higher! The view gets better with each achievement!"
      ],
      celebration: [
        "Woohoo! You're swinging through the jungle paths like a natural!",
        "Look at all the colorful achievements you've collected!",
        "You're making this jungle journey look easy and fun!"
      ],
      tips: {
        general: "Try something new each day to discover hidden talents.",
        learning: "Approach challenges with curiosity rather than frustration.",
        finance: "Even small treasure collections grow impressive over time.",
        career: "Sometimes the most fruitful branches aren't the obvious ones.",
        wellness: "Remember to enjoy the fruits of your labor along the way.",
        fitness: "Play and exploration are excellent forms of exercise.",
        emergency: "Adaptability is your greatest tool in unexpected situations."
      }
    }
  },
  {
    id: "sloth_calm",
    name: "Serenity",
    type: "sloth",
    specialtyZone: "wellness",
    personality: "peaceful",
    unlockRequirements: ["well-sleep-master"],
    tier: "tier2",
    avatar: "/assets/companions/sloth.svg", // Path will need to be created
    messages: {
      greeting: "Peace be with you, jungle traveler. I am Serenity, guide to balanced living.",
      encouragement: [
        "Take each step mindfully along your path.",
        "The wisest explorers know when to rest beneath the jungle canopy.",
        "Inner harmony creates strength that no external challenge can diminish."
      ],
      celebration: [
        "Your inner garden flourishes with tranquility and balance!",
        "You've discovered the sacred rhythm of wellness that sustains all great journeys!",
        "The jungle responds to your harmonious presence with abundant energy!"
      ],
      tips: {
        wellness: "Consistency in small practices brings greater peace than occasional grand efforts.",
        learning: "A calm mind absorbs wisdom more effectively.",
        finance: "Balanced resource management prevents stressful scarcity.",
        career: "Your peaceful presence makes you a valued expedition member.",
        fitness: "Movement should bring joy, not merely exertion.",
        emergency: "A calm mind makes clearer decisions in challenging moments."
      }
    }
  },
  {
    id: "turtle_ancient",
    name: "Aeon",
    type: "turtle",
    specialtyZone: "emergency",
    personality: "wise",
    unlockRequirements: ["emerg-safety-plan"],
    tier: "tier3",
    avatar: "/assets/companions/turtle.svg", // Path will need to be created
    messages: {
      greeting: "Greetings, young explorer. I am Aeon, guardian of safety through the ages.",
      encouragement: [
        "Preparation is the shield that has protected explorers since ancient times.",
        "The jungle's challenges become manageable when anticipated.",
        "Safety is not mere caution, but wisdom applied to protection."
      ],
      celebration: [
        "You now carry the ancient wisdom of jungle protection!",
        "Few explorers have mastered the sacred arts of preparation as you have!",
        "The jungle acknowledges your readiness to face its greatest challenges!"
      ],
      tips: {
        emergency: "Review your emergency plans regularly as the jungle changes.",
        learning: "Study the patterns of those who have safely completed expeditions before you.",
        finance: "Always maintain resources reserved exclusively for unexpected challenges.",
        career: "Being prepared for difficulties makes you invaluable to any expedition.",
        wellness: "Mental preparation creates resilience during actual emergencies.",
        fitness: "Your physical readiness may determine your safety in critical moments."
      }
    }
  }
];

/**
 * Get unlocked companions based on user achievements
 */
export const getUnlockedCompanions = (userAchievements: string[], userTier: string): Companion[] => {
  // User can access companions based on:
  // 1. Having unlocked the required achievements
  // 2. Being in the appropriate subscription tier
  
  const tierAccess = {
    'free': ['free'],
    'tier1': ['free', 'tier1'],
    'tier2': ['free', 'tier1', 'tier2'],
    'tier3': ['free', 'tier1', 'tier2', 'tier3']
  };
  
  const accessibleTiers = tierAccess[userTier as keyof typeof tierAccess] || ['free'];
  
  return COMPANIONS.filter(companion => 
    // Check tier access
    accessibleTiers.includes(companion.tier) && 
    // Check if all required achievements are unlocked
    (companion.unlockRequirements.length === 0 || 
     companion.unlockRequirements.every(req => userAchievements.includes(req)))
  );
};

/**
 * Get a companion for a specific zone
 */
export const getCompanionForZone = (zone: AchievementCategory, unlockedCompanions: Companion[]): Companion | undefined => {
  // First try to find a specialist in this zone
  const specialist = unlockedCompanions.find(c => c.specialtyZone === zone);
  if (specialist) return specialist;
  
  // Otherwise return a general companion
  return unlockedCompanions.find(c => c.specialtyZone === 'general');
};

/**
 * Get a random encouragement message from a companion
 */
export const getRandomCompanionMessage = (companion: Companion, messageType: 'encouragement' | 'celebration' = 'encouragement'): string => {
  const messages = companion.messages[messageType];
  if (!Array.isArray(messages) || messages.length === 0) {
    return companion.messages.greeting;
  }
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};