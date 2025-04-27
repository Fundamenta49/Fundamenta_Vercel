/**
 * Jungle Path Gamification System
 * 
 * This module provides a complete adventure-themed gamification layer
 * for the Fundamenta learning platform.
 */

// Theme System
export { JungleThemeProvider, useJungleTheme } from './contexts/JungleThemeContext';
export type { JungleThemeContextType } from './contexts/JungleThemeContext';

// Components - Map System
export { default as JungleMap } from './components/map/JungleMap';
export { default as ZoneCard } from './components/map/ZoneCard';
export { default as PathMarker } from './components/map/PathMarker';

// Components - Quest System
export { default as QuestCard } from './components/quest/QuestCard';
export { default as QuestList } from './components/quest/QuestList';
export { default as QuestProgress } from './components/quest/QuestProgress';
export { default as QuestFilter } from './components/quest/QuestFilter';

// Components - Companion System
export { CompanionProvider, useCompanion } from './components/companion/CompanionProvider';
export { default as CompanionCard } from './components/companion/CompanionCard';
export { default as CompanionDialog } from './components/companion/CompanionDialog';
export { default as CompanionBubble } from './components/companion/CompanionBubble';

// Components - Rank System
export { default as RankBadge } from './components/rank/RankBadge';
export { default as RankProgress } from './components/rank/RankProgress';
export { default as RankUpCelebration } from './components/rank/RankUpCelebration';

// Hooks
export { useQuestProgress } from './hooks/useQuestProgress';
export { useJungleRank } from './hooks/useJungleRank';
export { useQuestMapper } from './hooks/useQuestMapper';
export { useZoneProgress } from './hooks/useZoneProgress';

// Utilities
export { transformToJungleQuest, getQuestDifficulty } from './utils/questMapper';
export { isZoneUnlocked, getZoneByCategory, getAllZones } from './utils/zoneUtils';
export { calculateRank, getRankName, getRankColor } from './utils/rankCalculator';
export { getZoneColor, getZoneStyle } from './utils/zoneStyler';

// Type Definitions
export type { JungleQuest } from './types/quest';
export type { JungleZone } from './types/zone';
export type { Companion } from './types/companion';
export type { UserRank, RankInfo } from './types/rank';

// Demo Page
export { default as JunglePathDemo } from './demo/JunglePathDemo';