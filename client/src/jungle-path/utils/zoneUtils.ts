import { JungleZone } from '../types/zone';

// Define jungle zones (categories mapped to jungle areas)
const JUNGLE_ZONES: JungleZone[] = [
  {
    id: 'basecamp',
    name: 'Explorer\'s Basecamp',
    description: 'Where all journeys begin. Learn the fundamentals of jungle exploration.',
    category: 'basics',
    mapX: 50,
    mapY: 80,
    color: '#94C973', // Canopy Light
    iconName: 'Tent',
    requiredRank: 0,
    connectedTo: ['river', 'ancient-trail']
  },
  {
    id: 'river',
    name: 'River of Resources',
    description: 'Navigate the currents of financial wisdom and resource management.',
    category: 'finance',
    mapX: 30,
    mapY: 60,
    color: '#3B82C4', // River Blue
    iconName: 'Waves',
    requiredRank: 1,
    connectedTo: ['basecamp', 'temple', 'waterfall']
  },
  {
    id: 'ancient-trail',
    name: 'Ancient Wellness Trail',
    description: 'Follow paths of physical and mental wellbeing known to ancient explorers.',
    category: 'wellness',
    mapX: 70,
    mapY: 65,
    color: '#94C973', // Canopy Light
    iconName: 'Leaf',
    requiredRank: 1,
    connectedTo: ['basecamp', 'temple', 'mountaintop']
  },
  {
    id: 'temple',
    name: 'Temple of Knowledge',
    description: 'Discover the ancient wisdom of career development and professional growth.',
    category: 'career',
    mapX: 50,
    mapY: 40,
    color: '#E6B933', // Temple Gold
    iconName: 'Building',
    requiredRank: 2,
    connectedTo: ['river', 'ancient-trail', 'volcano', 'crystal-cave']
  },
  {
    id: 'waterfall',
    name: 'Emergency Waterfall',
    description: 'Learn essential survival skills for handling life\'s unexpected challenges.',
    category: 'emergency',
    mapX: 20,
    mapY: 35,
    color: '#C24D4D', // Clay Red
    iconName: 'Shield',
    requiredRank: 2,
    connectedTo: ['river', 'volcano']
  },
  {
    id: 'mountaintop',
    name: 'Peak Performance Summit',
    description: 'Reach new heights in physical fitness and mental performance.',
    category: 'fitness',
    mapX: 80,
    mapY: 40,
    color: '#8B8682', // Stone Gray
    iconName: 'Mountain',
    requiredRank: 2,
    connectedTo: ['ancient-trail', 'crystal-cave']
  },
  {
    id: 'volcano',
    name: 'Transformation Volcano',
    description: 'Powerful lessons for major life transformations and overcoming obstacles.',
    category: 'transformation',
    mapX: 30,
    mapY: 20,
    color: '#E67E33', // Sunset Orange
    iconName: 'Flame',
    requiredRank: 3,
    connectedTo: ['temple', 'waterfall', 'hidden-valley']
  },
  {
    id: 'crystal-cave',
    name: 'Crystal Cave of Reflection',
    description: 'Discover deeper insights about yourself and your personal journey.',
    category: 'personal',
    mapX: 70,
    mapY: 20,
    color: '#724E91', // Shadow Purple
    iconName: 'Diamond',
    requiredRank: 3,
    connectedTo: ['temple', 'mountaintop', 'hidden-valley']
  },
  {
    id: 'hidden-valley',
    name: 'Hidden Valley of Mastery',
    description: 'The most advanced challenges and deepest wisdom for true jungle masters.',
    category: 'advanced',
    mapX: 50,
    mapY: 10,
    color: '#1E4A3D', // Jungle Green
    iconName: 'Star',
    requiredRank: 4,
    connectedTo: ['volcano', 'crystal-cave']
  }
];

/**
 * Check if a zone is unlocked based on user rank
 */
export const isZoneUnlocked = (zoneCategory: string, userRank: number): boolean => {
  const zone = JUNGLE_ZONES.find(z => z.category === zoneCategory);
  if (!zone) return false;
  return userRank >= zone.requiredRank;
};

/**
 * Get zone by category
 */
export const getZoneByCategory = (category: string): JungleZone | undefined => {
  return JUNGLE_ZONES.find(zone => zone.category === category);
};

/**
 * Get all jungle zones
 */
export const getAllZones = (): JungleZone[] => {
  return [...JUNGLE_ZONES];
};

/**
 * Get connected zones
 */
export const getConnectedZones = (zoneId: string): JungleZone[] => {
  const zone = JUNGLE_ZONES.find(z => z.id === zoneId);
  if (!zone) return [];
  
  return JUNGLE_ZONES.filter(z => zone.connectedTo.includes(z.id));
};