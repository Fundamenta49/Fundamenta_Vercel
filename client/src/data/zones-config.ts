/**
 * Unified Learning Zone Schema for Fundamenta
 * Supports both standard and jungle themed interfaces
 */

// Define zone categories and theme types
export type ZoneCategory = 'finance' | 'wellness' | 'fitness' | 'career' | 'emergency';
export type ThemeType = 'standard' | 'jungle';

// Define the learning zone interface
export interface LearningZone {
  id: string;
  category: ZoneCategory;
  title: {
    standard: string;
    jungle: string;
  };
  description: {
    standard: string;
    jungle: string;
  };
  themeColor: string;
  unlockRank: number;
  iconType: 'coins' | 'heart' | 'flame' | 'briefcase' | 'shield';
  connections?: string[]; // IDs of connected zones
  position?: {
    x: number;
    y: number;
  };
}

// Define the learning zones data
export const learningZones: LearningZone[] = [
  {
    id: 'finance',
    category: 'finance',
    title: {
      standard: 'Financial Literacy',
      jungle: 'Golden Temple',
    },
    description: {
      standard: 'Learn how to budget, save, and grow your money.',
      jungle: 'Track your treasures and unlock the secrets of wealth.',
    },
    themeColor: '#E6B933',
    unlockRank: 0,
    iconType: 'coins',
    connections: ['wellness', 'career'],
    position: {
      x: 30,
      y: 20
    }
  },
  {
    id: 'wellness',
    category: 'wellness',
    title: {
      standard: 'Wellness & Nutrition',
      jungle: 'Healing Springs',
    },
    description: {
      standard: 'Improve your physical and emotional well-being.',
      jungle: 'Soak in restorative knowledge from the springs of health.',
    },
    themeColor: '#94C973',
    unlockRank: 1,
    iconType: 'heart',
    connections: ['finance', 'fitness'],
    position: {
      x: 65,
      y: 35
    }
  },
  {
    id: 'fitness',
    category: 'fitness',
    title: {
      standard: 'Fitness & Movement',
      jungle: 'Rugged Peaks',
    },
    description: {
      standard: 'Develop strength, endurance, and body confidence.',
      jungle: 'Climb higher and conquer physical challenges.',
    },
    themeColor: '#D86C70',
    unlockRank: 2,
    iconType: 'flame',
    connections: ['wellness', 'emergency'],
    position: {
      x: 80,
      y: 65
    }
  },
  {
    id: 'career',
    category: 'career',
    title: {
      standard: 'Career Development',
      jungle: 'Ancient Library',
    },
    description: {
      standard: 'Gain skills for the professional world.',
      jungle: 'Explore the ancient scrolls of opportunity.',
    },
    themeColor: '#5B8BD9',
    unlockRank: 2,
    iconType: 'briefcase',
    connections: ['finance', 'emergency'],
    position: {
      x: 20,
      y: 60
    }
  },
  {
    id: 'emergency',
    category: 'emergency',
    title: {
      standard: 'Emergency Preparedness',
      jungle: 'Storm Shelter',
    },
    description: {
      standard: 'Get ready for real-world emergencies.',
      jungle: 'Prepare for the chaos beyond the canopy.',
    },
    themeColor: '#C077DF',
    unlockRank: 3,
    iconType: 'shield',
    connections: ['career', 'fitness'],
    position: {
      x: 50,
      y: 80
    }
  },
];

// Helper functions for working with zones
export const getZoneById = (id: string): LearningZone | undefined => {
  return learningZones.find(zone => zone.id === id);
};

export const getZonesByRank = (rank: number): LearningZone[] => {
  return learningZones.filter(zone => zone.unlockRank <= rank);
};

export const getZonesByCategory = (category: ZoneCategory): LearningZone[] => {
  return learningZones.filter(zone => zone.category === category);
};

export const getConnectedZones = (zoneId: string): LearningZone[] => {
  const zone = getZoneById(zoneId);
  if (!zone || !zone.connections) return [];
  
  return zone.connections
    .map(id => getZoneById(id))
    .filter((zone): zone is LearningZone => zone !== undefined);
};