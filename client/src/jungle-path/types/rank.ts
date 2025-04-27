/**
 * User rank in the jungle theme system
 */
export interface UserRank {
  level: number;
  title: string;
  points: number;
  nextRankPoints: number;
  progress: number; // 0-1 percentage to next rank
  color: string;
  badgeUrl?: string;
}

/**
 * Rank information for the jungle theme system
 */
export interface RankInfo {
  level: number;
  title: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  badgeUrl?: string;
  perks: string[];
}