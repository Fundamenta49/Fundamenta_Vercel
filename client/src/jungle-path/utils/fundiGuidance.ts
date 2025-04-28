/**
 * Utility functions for Fundi's jungle-themed guidance
 */

export type QuestType = 'exploration' | 'challenge' | 'knowledge' | 'skill';

interface QuestGuidance {
  intro: string;
  hints: string[];
  completion: string;
}

// Quest-specific guidance messages
const questGuidanceMap: Record<QuestType, QuestGuidance> = {
  exploration: {
    intro: "Welcome, explorer! This quest will take you through uncharted territories. Keep your eyes open for hidden knowledge!",
    hints: [
      "Take your time to absorb all the information around you.",
      "The journey itself contains valuable lessons.",
      "Look for patterns in what you discover."
    ],
    completion: "Well done, adventurer! You've successfully explored this area and gained valuable insights!"
  },
  challenge: {
    intro: "A challenge awaits you, brave explorer! This quest will test your skills and knowledge.",
    hints: [
      "Think carefully before answering.",
      "Remember what you've learned in previous expeditions.",
      "Sometimes the most obvious answer isn't the correct one."
    ],
    completion: "Congratulations! You've conquered this challenge with true explorer spirit!"
  },
  knowledge: {
    intro: "This part of the jungle holds ancient wisdom. Your quest is to absorb this knowledge.",
    hints: [
      "Take notes on key information.",
      "Try to connect this knowledge with what you already know.",
      "The most valuable treasures here are the insights you'll gain."
    ],
    completion: "You've successfully acquired this ancient knowledge. It will serve you well on future expeditions!"
  },
  skill: {
    intro: "To survive in the jungle, you must master certain skills. This quest will help you develop an important one.",
    hints: [
      "Practice makes perfect - don't hesitate to try multiple times.",
      "Focus on understanding the fundamentals.",
      "Every expert was once a beginner."
    ],
    completion: "Impressive! You've mastered this skill like a true jungle navigator!"
  }
};

// Function to get guidance for a specific quest
export function getFundiGuidance(questType: QuestType, phase: 'intro' | 'hint' | 'completion', hintIndex = 0): string {
  const guidance = questGuidanceMap[questType];
  
  if (phase === 'intro') return guidance.intro;
  if (phase === 'hint') return guidance.hints[hintIndex % guidance.hints.length];
  return guidance.completion;
}

// Function to get a random encouraging message
export function getRandomEncouragement(): string {
  const encouragements = [
    "You're making excellent progress on your jungle expedition!",
    "Keep going, explorer! The jungle holds many more secrets to discover.",
    "Your navigation skills are improving with each quest!",
    "The path may be challenging, but you're handling it like a pro!",
    "Remember, every great explorer faced obstacles - it's part of the adventure!"
  ];
  
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

// Zone-specific information
export type ZoneType = 'riverlands' | 'ancient-ruins' | 'canopy' | 'cave-system' | 'volcano';

interface ZoneInfo {
  name: string;
  description: string;
  fundiTips: string[];
  challenges: string[];
}

export const zoneInformation: Record<ZoneType, ZoneInfo> = {
  'riverlands': {
    name: "The Flowing Riverlands",
    description: "A network of rivers and streams that provide life to the jungle. The knowledge flows like water here.",
    fundiTips: [
      "The river represents your learning journey - sometimes calm, sometimes challenging.",
      "Don't rush through the quests here - let the knowledge flow naturally.",
      "Look for connections between different streams of knowledge."
    ],
    challenges: [
      "Navigate the currents of information without getting overwhelmed.",
      "Build bridges between different concepts to create a complete understanding.",
      "Find the source of knowledge to understand its true nature."
    ]
  },
  'ancient-ruins': {
    name: "The Ancient Wisdom Ruins",
    description: "Structures from a forgotten civilization, containing timeless knowledge and tested techniques.",
    fundiTips: [
      "These ruins contain techniques proven effective over generations.",
      "Some knowledge may seem basic, but it forms the foundation of greater wisdom.",
      "Pay attention to the details in these ruins - they contain subtle but important lessons."
    ],
    challenges: [
      "Decipher the ancient methods and apply them to modern situations.",
      "Restore and preserve valuable techniques that might otherwise be forgotten.",
      "Connect ancient wisdom with contemporary knowledge."
    ]
  },
  'canopy': {
    name: "The Elevated Canopy",
    description: "The highest level of the jungle, offering perspective and advanced concepts for those who climb there.",
    fundiTips: [
      "From up here, you can see how different concepts connect.",
      "This elevated perspective allows you to plan your learning journey more effectively.",
      "The view may be dizzying at first, but you'll adapt to this higher level of understanding."
    ],
    challenges: [
      "Maintain your balance while navigating complex concepts.",
      "See the forest for the trees - understand the big picture.",
      "Build upon your knowledge foundation to reach new heights."
    ]
  },
  'cave-system': {
    name: "The Mystery Caves",
    description: "Dark but enlightening passages that require careful navigation but yield deep insights.",
    fundiTips: [
      "In these caves, you'll need to shine your own light of curiosity to see clearly.",
      "What seems confusing at first will make sense as you explore further.",
      "The echoes in these caves represent how knowledge reverberates through your life."
    ],
    challenges: [
      "Overcome the initial discomfort of challenging concepts.",
      "Find your way through confusion to clarity.",
      "Discover hidden connections between seemingly unrelated ideas."
    ]
  },
  'volcano': {
    name: "The Transformation Volcano",
    description: "The most challenging region, where knowledge is forged in the heat of practical application.",
    fundiTips: [
      "The heat of challenge transforms knowledge into wisdom.",
      "Just like volcanic soil is fertile, these difficulties will yield rich growth.",
      "When facing the most intense challenges, remember your previous successes."
    ],
    challenges: [
      "Apply your knowledge under pressure.",
      "Transform theoretical understanding into practical skills.",
      "Emerge stronger from challenging learning experiences."
    ]
  }
};

export function getZoneInfo(zone: ZoneType): ZoneInfo {
  return zoneInformation[zone];
}

export function getFundiZoneTip(zone: ZoneType): string {
  const info = zoneInformation[zone];
  return info.fundiTips[Math.floor(Math.random() * info.fundiTips.length)];
}