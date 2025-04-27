/**
 * Companion type represents an animal guide in the jungle system
 */
export interface Companion {
  id: string;
  name: string;
  species: string;
  description: string;
  
  // Appearance
  avatarSrc: string;
  color: string;
  
  // Specializations
  specialtyZones: string[];
  personality: 'friendly' | 'wise' | 'energetic' | 'cautious' | 'bold';
  
  // Unlock requirements
  requiredAchievements?: string[];
  requiredRank?: number;
  premiumOnly?: boolean;
  
  // Tips and dialogue
  introMessage: string;
  tips: Array<{
    id: string;
    text: string;
    context: string[];
    minRank?: number;
  }>;
}