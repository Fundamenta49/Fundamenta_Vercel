/**
 * Represents a jungle companion character that assists users
 */
export interface Companion {
  id: string;
  name: string;
  species: string;
  description: string;
  avatarSrc: string; // Path to image
  color: string; // Primary color for styling
  specialtyZones: string[]; // Zone categories where this companion is an expert
  personality: 'friendly' | 'wise' | 'energetic' | 'cautious' | 'bold';
  introMessage: string;
  tips: CompanionTip[];
}

/**
 * Represents a tip or hint from a companion
 */
export interface CompanionTip {
  id: string;
  text: string;
  context: string[]; // Contexts in which this tip is relevant
}

/**
 * Represents user progress/relationship with a companion
 */
export interface CompanionRelationship {
  companionId: string;
  unlockedAt: string;
  interactionCount: number;
  lastInteraction: string | null;
  favoriteStatus: boolean;
}