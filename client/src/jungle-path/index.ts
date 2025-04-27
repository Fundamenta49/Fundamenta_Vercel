// Components - Rank
export { default as RankBadge } from './components/rank/RankBadge';
export { default as RankProgress } from './components/rank/RankProgress';
export { default as RankUpCelebration } from './components/rank/RankUpCelebration';

// Components - Map
export { default as JungleMap } from './components/map/JungleMap';
export { default as ZoneCard } from './components/map/ZoneCard';

// Components - Quest
export { default as QuestCard } from './components/quest/QuestCard';
export { default as QuestList } from './components/quest/QuestList';
export { default as QuestProgress } from './components/quest/QuestProgress';

// Components - Companion
export { default as CompanionCard } from './components/companion/CompanionCard';
export { default as CompanionDialog } from './components/companion/CompanionDialog';
export { default as CompanionBubble, RandomTipBubble } from './components/companion/CompanionBubble';
export { CompanionProvider, useCompanion } from './components/companion/CompanionProvider';

// Hooks
export { useJungleRank } from './hooks/useJungleRank';
export { useZoneProgress } from './hooks/useZoneProgress';
export { useQuestMapper } from './hooks/useQuestMapper';

// Utils
export { 
  mapQuestToJungle,
  mapModulesToJungleQuests 
} from './utils/questMapper';
export { 
  calculateRank,
  getPointsForNextRank,
  estimateRankPoints 
} from './utils/rankCalculator';
export { 
  getZoneColor,
  getQuestCardStyle,
  getZoneCardStyle,
  getProgressBarStyle 
} from './utils/zoneStyler';
export {
  getAllZones,
  getZoneById,
  getZoneByCategory,
  isZoneUnlocked
} from './utils/zoneUtils';

// Types
export type { JungleQuest } from './types/quest';
export type { QuestProgress as UserQuestProgress } from './types/quest';
export type { QuestReward } from './types/quest';
export type { JungleZone, ZoneProgress, ZonePointOfInterest } from './types/zone';
export type { Companion, CompanionTip, CompanionRelationship } from './types/companion';
export type { UserRank, RankThreshold, RankActivity } from './types/rank';

// Contexts
export { JungleThemeProvider, useJungleTheme } from './contexts/JungleThemeContext';