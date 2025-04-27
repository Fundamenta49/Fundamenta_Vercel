/**
 * Represents a learning module transformed into a jungle quest
 */
export interface JungleQuest {
  id: string;
  originalTitle: string;
  originalDescription: string;
  jungleTitle: string;
  jungleDescription: string;
  category: string;
  estimatedTime: number;
  requiredRank: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  rewards?: {
    points: number;
    badges?: string[];
  };
}

/**
 * Represents a user's progress on a specific quest
 */
export interface QuestProgress {
  questId: string;
  progress: number; // 0-100
  startedAt: string | null;
  completedAt: string | null;
  currentStep?: number;
  totalSteps?: number;
}

/**
 * Represents a quest reward that a user receives upon completion
 */
export interface QuestReward {
  questId: string;
  type: 'points' | 'badge' | 'item';
  value: number | string;
  receivedAt: string;
}