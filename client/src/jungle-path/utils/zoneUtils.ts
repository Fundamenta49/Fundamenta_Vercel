import { JungleZone } from '../types/zone';

// Sample zone data
const JUNGLE_ZONES: JungleZone[] = [
  {
    id: 'wellness',
    name: 'Ancient Trail',
    category: 'wellness',
    description: 'A path of physical and mental wellness winding through ancient trees.',
    color: '#94C973', // Canopy Light
    requiredRank: 0
  },
  {
    id: 'finance',
    name: 'River Crossing',
    category: 'finance',
    description: 'Navigate the flowing waters of financial knowledge and resource management.',
    color: '#3B82C4', // River Blue
    requiredRank: 0
  },
  {
    id: 'career',
    name: 'Temple Ruins',
    category: 'career',
    description: 'Discover career wisdom within the walls of ancient temple structures.',
    color: '#F3B54A', // Temple Gold
    requiredRank: 1
  },
  {
    id: 'relationships',
    name: 'Banyan Grove',
    category: 'relationships',
    description: 'Explore the interconnected roots of relationships and social skills.',
    color: '#C24D4D', // Berry Red
    requiredRank: 2
  },
  {
    id: 'skills',
    name: 'Crystal Cave',
    category: 'skills',
    description: 'Sharpen your skills in the glittering caverns of practical knowledge.',
    color: '#724E91', // Shadow Purple
    requiredRank: 2
  },
  {
    id: 'growth',
    name: 'Mountain Peak',
    category: 'growth',
    description: 'Reach new heights of personal growth and self-actualization.',
    color: '#E67E33', // Sunset Orange
    requiredRank: 3
  }
];

/**
 * Get all jungle zones
 */
export const getAllZones = (): JungleZone[] => {
  return JUNGLE_ZONES;
};

/**
 * Get a zone by its ID
 */
export const getZoneById = (zoneId: string): JungleZone | undefined => {
  return JUNGLE_ZONES.find(zone => zone.id === zoneId);
};

/**
 * Get a zone by its category
 */
export const getZoneByCategory = (category: string): JungleZone | undefined => {
  return JUNGLE_ZONES.find(zone => zone.category === category);
};

/**
 * Check if a zone is unlocked based on user rank
 */
export const isZoneUnlocked = (category: string, userRank: number): boolean => {
  const zone = getZoneByCategory(category);
  if (!zone) return false;
  return userRank >= zone.requiredRank;
};