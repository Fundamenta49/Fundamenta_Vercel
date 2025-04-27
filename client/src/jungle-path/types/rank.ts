/**
 * Represents a user's rank in the jungle system
 */
export interface UserRank {
  level: number;
  name: string;
  color: string;
  points: number;
  nextRankName: string | null;
  nextRankPoints: number | null;
  progress: number; // 0-100
}

/**
 * Represents a rank threshold in the system
 */
export interface RankThreshold {
  level: number;
  name: string;
  minPoints: number;
  color: string;
  perks?: string[];
}

/**
 * Represents an activity that awards rank points
 */
export interface RankActivity {
  type: 'quest_completion' | 'daily_login' | 'achievement' | 'streak';
  points: number;
  description: string;
  timestamp: string;
}