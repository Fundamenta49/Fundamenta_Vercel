/**
 * Represents a user's progress on a quest
 */
export interface QuestProgress {
  /** Percentage of quest completion (0-100) */
  progressPercent: number;
  
  /** Timestamp when the quest was started */
  startedAt: string | null;
  
  /** Timestamp when the quest was completed (null if not completed) */
  completedAt: string | null;
}

/**
 * Represents a reward for completing a quest
 */
export interface QuestReward {
  /** Type of reward (e.g., 'badge', 'rank-points', 'item') */
  type: 'badge' | 'rank-points' | 'item' | 'currency';
  
  /** Value of the reward (e.g., badge ID, number of points) */
  value: string | number;
  
  /** Optional display name for the reward */
  name?: string;
  
  /** Optional description of the reward */
  description?: string;
  
  /** Optional icon/image URL for the reward */
  icon?: string;
}

/**
 * Represents a jungle-themed quest that maps to an original learning module
 */
export interface JungleQuest {
  /** Original module ID (used for tracking) */
  id: string;
  
  /** Original module title */
  originalTitle: string;
  
  /** Jungle-themed title for the module */
  jungleTitle: string;
  
  /** Original module description */
  originalDescription: string;
  
  /** Jungle-themed description for the module */
  jungleDescription: string;
  
  /** Category of the quest/module */
  category: string;
  
  /** Associated zone ID where this quest is located */
  zoneId?: string;
  
  /** Estimated time to complete in minutes */
  estimatedTime: number;
  
  /** Difficulty level of the quest (1-5) */
  difficulty?: number;
  
  /** Minimum rank required to access this quest (0-based) */
  requiredRank?: number;
  
  /** List of prerequisite quest IDs that must be completed first */
  prerequisites?: string[];
  
  /** Rewards for completing the quest */
  rewards?: QuestReward[];
  
  /** Icon or image URL representing the quest */
  icon?: string;
  
  /** Background image URL for the quest card */
  backgroundImage?: string;
  
  /** Whether this quest is featured/highlighted */
  featured?: boolean;
  
  /** Tags associated with the quest for filtering */
  tags?: string[];
  
  /** Optional structured objectives for the quest */
  objectives?: Array<{
    id: string;
    description: string;
    completed: boolean;
  }>;
  
  /** Optional metadata for extensibility */
  metadata?: Record<string, any>;
}