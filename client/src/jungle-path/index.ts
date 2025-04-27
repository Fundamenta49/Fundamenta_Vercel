/**
 * Jungle Path - Gamification System
 * Main export file
 */

// Components exports
export { default as RankBadge } from './components/rank/RankBadge';
export { default as RankProgress } from './components/rank/RankProgress';
export { default as RankUpCelebration } from './components/rank/RankUpCelebration';

export { default as QuestCard } from './components/quest/QuestCard';
export { default as QuestList } from './components/quest/QuestList';
export { default as QuestProgress } from './components/quest/QuestProgress';

export { default as CompanionCard } from './components/companion/CompanionCard';
export { default as CompanionDialog } from './components/companion/CompanionDialog';
export { default as CompanionProvider } from './components/companion/CompanionProvider';

export { default as JungleMap } from './components/map/JungleMap';
export { default as ZoneCard } from './components/map/ZoneCard';
export { default as PathIndicator } from './components/map/PathIndicator';

// Context providers exports
export { JungleThemeProvider } from './contexts/JungleThemeContext';

// Hook exports
export { default as useJungleTheme } from './hooks/useJungleTheme';
export { default as useQuestProgress } from './hooks/useQuestProgress';
export { default as useJungleRank } from './hooks/useJungleRank';
export { default as useCompanion } from './hooks/useCompanion';

// Utility exports
export { mapQuestTitle, mapQuestDescription, useQuestMapper } from './utils/questMapper';
export { getZoneData, getAvailableZones, isZoneUnlocked } from './utils/zoneUtils';
export { calculateRank, getRankDisplay } from './utils/rankCalculator';

// Theme and styles exports
export { JUNGLE_THEME, getZoneStyle, getRankStyle } from './styles/theme';
export { JUNGLE_ANIMATIONS } from './styles/animations';

// Data exports
export { COMPANIONS, getUnlockedCompanions, getCompanionForZone } from './data/companions';
export { getAllZones, getZoneConnections, ZONE_ICONS } from './data/zones';
export { transformToJungleQuests, getQuestsForZone } from './data/quests';