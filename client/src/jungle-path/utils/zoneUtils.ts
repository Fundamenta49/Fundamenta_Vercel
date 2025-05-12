import { JungleZone } from '../types/zone';

/**
 * Predefined jungle zones, each representing a life skills category
 */
const JUNGLE_ZONES: JungleZone[] = [
  // Golden Temple (Finance Zone)
  {
    id: 'golden-temple',
    name: 'Golden Temple',
    description: 'Ancient ruins filled with wealth wisdom and financial secrets waiting to be uncovered.',
    category: 'financial',
    requiredRank: 0, // Available from the start
    color: '#E6B933', // Gold
    position: {
      x: 30,
      y: 20
    },
    connectedZones: ['healing-springs', 'ancient-library']
  },
  
  // Healing Springs (Wellness Zone)
  {
    id: 'healing-springs',
    name: 'Healing Springs',
    description: 'Natural oasis where wellness and balanced living flow from crystal-clear waters.',
    category: 'wellness',
    requiredRank: 1, // Requires Rank 1
    color: '#94C973', // Green
    position: {
      x: 65,
      y: 35
    },
    connectedZones: ['golden-temple', 'rugged-peaks']
  },
  
  // Rugged Peaks (Fitness Zone)
  {
    id: 'rugged-peaks',
    name: 'Rugged Peaks',
    description: 'Challenging mountainous terrain where strength and endurance are tested and developed.',
    category: 'fitness',
    requiredRank: 2, // Requires Rank 2
    color: '#D86C70', // Red
    position: {
      x: 80,
      y: 65
    },
    connectedZones: ['healing-springs', 'storm-shelter']
  },
  
  // Ancient Library (Career Zone)
  {
    id: 'ancient-library',
    name: 'Ancient Library',
    description: 'Repository of career wisdom and professional knowledge from generations of jungle dwellers.',
    category: 'career',
    requiredRank: 2, // Requires Rank 2
    color: '#7FAFE6', // Blue
    position: {
      x: 20,
      y: 60
    },
    connectedZones: ['golden-temple', 'storm-shelter']
  },
  
  // Storm Shelter (Emergency Zone)
  {
    id: 'storm-shelter',
    name: 'Storm Shelter',
    description: 'Fortress of protection where survival skills and emergency preparation are mastered.',
    category: 'emergency',
    requiredRank: 3, // Requires Rank 3
    color: '#C077DF', // Purple
    position: {
      x: 50,
      y: 80
    },
    connectedZones: ['ancient-library', 'rugged-peaks']
  }
];

/**
 * Category mapping to zone IDs for easy lookup
 */
const CATEGORY_TO_ZONE: Record<string, string> = {
  // Finance categories
  'financial': 'golden-temple',
  'finance': 'golden-temple',
  'money': 'golden-temple',
  'budget': 'golden-temple',
  'investing': 'golden-temple',
  'savings': 'golden-temple',
  
  // Wellness categories
  'wellness': 'healing-springs',
  'health': 'healing-springs',
  'mental': 'healing-springs',
  'mindfulness': 'healing-springs',
  'nutrition': 'healing-springs',
  'cooking': 'healing-springs',
  
  // Fitness categories
  'fitness': 'rugged-peaks',
  'exercise': 'rugged-peaks',
  'workout': 'rugged-peaks',
  'strength': 'rugged-peaks',
  'training': 'rugged-peaks',
  'endurance': 'rugged-peaks',
  
  // Career categories
  'career': 'ancient-library',
  'job': 'ancient-library',
  'work': 'ancient-library',
  'professional': 'ancient-library',
  'leadership': 'ancient-library',
  'education': 'ancient-library',
  
  // Emergency categories
  'emergency': 'storm-shelter',
  'safety': 'storm-shelter',
  'preparedness': 'storm-shelter',
  'survival': 'storm-shelter',
  'security': 'storm-shelter',
  'protection': 'storm-shelter'
};

/**
 * Gets all available jungle zones
 */
export const getAllZones = (): JungleZone[] => {
  return [...JUNGLE_ZONES];
};

/**
 * Gets a zone by its ID
 */
export const getZoneById = (zoneId: string): JungleZone | undefined => {
  return JUNGLE_ZONES.find(zone => zone.id === zoneId);
};

/**
 * Gets a zone by category name
 * Performs fuzzy matching for various category names
 */
export const getZoneByCategory = (category: string): JungleZone | undefined => {
  // Normalize the category to lowercase
  const normalizedCategory = category.toLowerCase();
  
  // Check for direct match in our mapping
  if (normalizedCategory in CATEGORY_TO_ZONE) {
    const zoneId = CATEGORY_TO_ZONE[normalizedCategory];
    return getZoneById(zoneId);
  }
  
  // Check for partial matches
  for (const [key, zoneId] of Object.entries(CATEGORY_TO_ZONE)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return getZoneById(zoneId);
    }
  }
  
  // Default to the first zone if no match found
  return undefined;
};

/**
 * Gets connected zones for a given zone ID
 */
export const getConnectedZones = (zoneId: string): JungleZone[] => {
  const zone = getZoneById(zoneId);
  if (!zone) return [];
  
  return zone.connectedZones
    .map(connectedId => getZoneById(connectedId))
    .filter((zone): zone is JungleZone => zone !== undefined);
};

/**
 * Checks if a zone is connected to another zone
 */
export const isZoneConnected = (zoneId: string, connectedZoneId: string): boolean => {
  const zone = getZoneById(zoneId);
  return zone ? zone.connectedZones.includes(connectedZoneId) : false;
};

/**
 * Gets zones accessible at a given rank
 */
export const getAccessibleZones = (rank: number): JungleZone[] => {
  return JUNGLE_ZONES.filter(zone => zone.requiredRank <= rank);
};