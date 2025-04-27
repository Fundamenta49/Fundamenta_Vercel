/**
 * JungleQuest type represents a learning module transformed into a jungle-themed quest
 */
export interface JungleQuest {
  // Original identification
  id: string;
  originalTitle: string;
  originalDescription: string;
  
  // Jungle theme transformed content
  jungleTitle: string;
  jungleDescription: string;
  
  // Classification and metadata
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  estimatedTime: number; // in minutes
  
  // Logical structure
  prerequisites?: string[];
  unlocks?: string[];
  
  // Quest properties
  zone: string;
  requiredRank: number;
  
  // Visual styling
  imagePath?: string;
  iconName?: string;
}