import { JungleZone } from '../types/zone';

// Sample zones data - in a real implementation, this would be loaded from the server
const JUNGLE_ZONES: JungleZone[] = [
  {
    id: 'financial-jungle',
    name: 'Financial Jungle',
    description: 'Navigate the complex terrain of financial knowledge and resources',
    category: 'financial',
    requiredRank: 0,
    color: '#E6B933', // Temple Gold
    position: { x: 20, y: 30 },
    connectedZones: ['wellness-grove', 'career-highlands'],
  },
  {
    id: 'wellness-grove',
    name: 'Wellness Grove',
    description: 'Discover natural remedies and practices for mental and physical health',
    category: 'wellness',
    requiredRank: 0,
    color: '#94C973', // Canopy Light
    position: { x: 50, y: 20 },
    connectedZones: ['financial-jungle', 'fitness-rapids'],
  },
  {
    id: 'fitness-rapids',
    name: 'Fitness Rapids',
    description: 'Challenge your body and build strength through physical training',
    category: 'fitness',
    requiredRank: 1,
    color: '#3B82C4', // River Blue
    position: { x: 70, y: 40 },
    connectedZones: ['wellness-grove', 'adventure-peaks'],
  },
  {
    id: 'career-highlands',
    name: 'Career Highlands',
    description: 'Climb the mountains of professional development and opportunity',
    category: 'career',
    requiredRank: 1,
    color: '#724E91', // Shadow Purple
    position: { x: 40, y: 60 },
    connectedZones: ['financial-jungle', 'leadership-temple'],
  },
  {
    id: 'leadership-temple',
    name: 'Leadership Temple',
    description: 'Master the ancient arts of leadership and influence',
    category: 'leadership',
    requiredRank: 2,
    color: '#C24D4D', // Clay Red
    position: { x: 60, y: 70 },
    connectedZones: ['career-highlands'],
  },
  {
    id: 'adventure-peaks',
    name: 'Adventure Peaks',
    description: 'Reach the pinnacle of personal challenge and achievement',
    category: 'adventure',
    requiredRank: 3,
    color: '#1E4A3D', // Jungle Green
    position: { x: 80, y: 80 },
    connectedZones: ['fitness-rapids'],
  },
];

/**
 * Get all available zones in the jungle
 */
export const getAllZones = (): JungleZone[] => {
  return JUNGLE_ZONES;
};

/**
 * Get a specific zone by its ID
 */
export const getZoneById = (zoneId: string): JungleZone | undefined => {
  return JUNGLE_ZONES.find(zone => zone.id === zoneId);
};

/**
 * Get a zone by content category
 */
export const getZoneByCategory = (category: string): JungleZone | undefined => {
  return JUNGLE_ZONES.find(zone => zone.category === category);
};

/**
 * Check if a zone is unlocked based on user's rank
 */
export const isZoneUnlocked = (zoneId: string, userRank: number): boolean => {
  const zone = getZoneById(zoneId);
  if (!zone) return false;
  return userRank >= zone.requiredRank;
};

/**
 * Get zones connected to the specified zone
 */
export const getConnectedZones = (zoneId: string): JungleZone[] => {
  const zone = getZoneById(zoneId);
  if (!zone || !zone.connectedZones) return [];
  
  return zone.connectedZones
    .map(connectedId => getZoneById(connectedId))
    .filter((zone): zone is JungleZone => zone !== undefined);
};

/**
 * Get zones accessible to a user based on their rank
 */
export const getAccessibleZones = (userRank: number): JungleZone[] => {
  return JUNGLE_ZONES.filter(zone => zone.requiredRank <= userRank);
};

/**
 * Get the next zone a user should focus on
 */
export const getNextRecommendedZone = (
  userRank: number, 
  completedZoneIds: string[]
): JungleZone | undefined => {
  // Filter for zones that are unlocked but not completed
  const availableZones = JUNGLE_ZONES.filter(
    zone => zone.requiredRank <= userRank && !completedZoneIds.includes(zone.id)
  );
  
  // Sort by required rank (ascending)
  return availableZones.sort((a, b) => a.requiredRank - b.requiredRank)[0];
};