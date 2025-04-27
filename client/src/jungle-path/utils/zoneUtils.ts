/**
 * Zone Utilities
 * Functionality for managing jungle zones, their styling, and progression
 */
import { AchievementCategory } from '@/shared/arcade-schema';
import { getZoneStyle } from '../styles/theme';

// Zone-specific styling and structure data
export interface ZoneData {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  position: {
    x: number;
    y: number;
  };
  connections: string[]; // IDs of connected zones
  requiredRank: number;
  styles: {
    primary: string;
    secondary: string;
    accent: string;
    icon: string;
    buttonClass: string;
    iconBg: string;
    textClass: string;
    cardClass: string;
    progressClass: string;
  };
}

// Map category to zone name
export const ZONE_NAMES: Record<AchievementCategory, string> = {
  finance: "Treasury Temple",
  career: "Career Canyon",
  wellness: "Wellness Waterfall",
  fitness: "Fitness Peaks",
  learning: "Scholar's Grove",
  emergency: "Guardian Ruins",
  general: "Central Clearing"
};

// Map category to zone descriptions
export const ZONE_DESCRIPTIONS: Record<AchievementCategory, string> = {
  finance: "Ancient stone temples housing the secrets of wealth and resource management.",
  career: "A vast canyon where the paths of many successful explorers have been carved.",
  wellness: "A serene waterfall area where healing plants and balanced living can be studied.",
  fitness: "Challenging mountain terrain that builds strength and endurance in those who climb.",
  learning: "A sacred grove where the wisest sages share knowledge from all disciplines.",
  emergency: "Ruins of an ancient guardian civilization that mastered protection techniques.",
  general: "The central hub where all jungle paths converge. The starting point for new explorers."
};

// Get full zone data for a specific zone
export const getZoneData = (category: AchievementCategory): ZoneData => {
  // Positioning is based on a 800x600 SVG viewBox
  // Each zone has a specific position on the map
  const ZONE_POSITIONS: Record<AchievementCategory, {x: number, y: number}> = {
    general: { x: 400, y: 300 },    // Center
    finance: { x: 600, y: 200 },    // Upper right
    career: { x: 200, y: 200 },     // Upper left
    wellness: { x: 500, y: 400 },   // Lower right
    fitness: { x: 300, y: 400 },    // Lower left
    learning: { x: 400, y: 150 },   // Top center
    emergency: { x: 400, y: 450 }   // Bottom center
  };

  // Which zones are connected to each other
  const ZONE_CONNECTIONS: Record<AchievementCategory, AchievementCategory[]> = {
    general: ["finance", "career", "wellness", "fitness", "learning", "emergency"],
    finance: ["general", "learning", "wellness"],
    career: ["general", "learning", "fitness"],
    wellness: ["general", "finance", "emergency"],
    fitness: ["general", "career", "emergency"],
    learning: ["general", "finance", "career"],
    emergency: ["general", "wellness", "fitness"]
  };

  // Required rank to unlock each zone (general is always available)
  const ZONE_RANK_REQUIREMENTS: Record<AchievementCategory, number> = {
    general: 1,   // Available from the beginning
    finance: 1,   // Available from the beginning
    career: 1,    // Available from the beginning
    wellness: 2,  // Requires rank 2 (Novice)
    fitness: 2,   // Requires rank 2 (Novice)
    learning: 3,  // Requires rank 3 (Apprentice)
    emergency: 4  // Requires rank 4 (Adept)
  };

  return {
    id: category,
    name: ZONE_NAMES[category],
    description: ZONE_DESCRIPTIONS[category],
    category,
    icon: getZoneStyle(category).icon,
    position: ZONE_POSITIONS[category],
    connections: ZONE_CONNECTIONS[category],
    requiredRank: ZONE_RANK_REQUIREMENTS[category],
    styles: getZoneStyle(category)
  };
};

// Get available zones based on user's rank
export const getAvailableZones = (userRank: number): AchievementCategory[] => {
  return Object.entries(ZONE_RANK_REQUIREMENTS)
    .filter(([_, requiredRank]) => userRank >= requiredRank)
    .map(([category]) => category as AchievementCategory);
};

// Map a standard category to a zone-specific class
export const getZoneClassForCategory = (category: AchievementCategory): string => {
  const zoneStyle = getZoneStyle(category);
  return zoneStyle.cardClass;
};

// Map of zone-specific difficulty/intensity
export const ZONE_INTENSITY: Record<AchievementCategory, number> = {
  general: 1,    // Easiest/introductory
  finance: 2,    // Moderate difficulty
  career: 2,     // Moderate difficulty
  wellness: 2,   // Moderate difficulty
  fitness: 3,    // Higher difficulty
  learning: 3,   // Higher difficulty
  emergency: 4   // Most challenging
};

// Helper interfaces
interface ZoneRequirement {
  id: AchievementCategory;
  name: string;
  requiredRank: number;
}

// Get a list of all zones with their unlock requirements
export const getAllZoneRequirements = (): ZoneRequirement[] => {
  return Object.values(AchievementCategory.enum).map(category => ({
    id: category as AchievementCategory,
    name: ZONE_NAMES[category as AchievementCategory],
    requiredRank: ZONE_RANK_REQUIREMENTS[category as AchievementCategory]
  })).sort((a, b) => a.requiredRank - b.requiredRank);
};

// Utility function to check if a zone is unlocked for a specific rank
export const isZoneUnlocked = (zone: AchievementCategory, rank: number): boolean => {
  return rank >= ZONE_RANK_REQUIREMENTS[zone];
};