/**
 * Represents a jungle zone on the map
 */
export interface JungleZone {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  requiredRank: number;
  mapX?: number; // X position on map (0-100)
  mapY?: number; // Y position on map (0-100)
  iconName?: string; // Icon to display on map
  connectedTo?: string[]; // IDs of connected zones
}

/**
 * Represents progress within a zone
 */
export interface ZoneProgress {
  zoneId: string;
  questsCompleted: number;
  totalQuests: number;
  progress: number; // 0-100
  unlockedAt: string | null;
}

/**
 * Represents a point of interest within a zone
 */
export interface ZonePointOfInterest {
  id: string;
  zoneId: string;
  name: string;
  description: string;
  type: 'quest' | 'challenge' | 'landmark';
  mapX: number; // X position on map (0-100)
  mapY: number; // Y position on map (0-100)
  iconName: string;
  unlocked: boolean;
}