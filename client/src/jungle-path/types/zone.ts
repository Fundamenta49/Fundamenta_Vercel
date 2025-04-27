/**
 * Represents a geographic area in the jungle with associated learning content
 */
export interface JungleZone {
  /** Unique identifier for the zone */
  id: string;
  
  /** Display name of the zone */
  name: string;
  
  /** Detailed description of the zone and what it represents */
  description: string;
  
  /** Associated content category (e.g., 'financial', 'wellness', etc.) */
  category: string;
  
  /** Minimum rank required for a user to access this zone (0-based) */
  requiredRank: number;
  
  /** The primary color associated with this zone for visual styling */
  color: string;
  
  /** Position of the zone on the map (in percentages) */
  position: {
    x: number;
    y: number;
  };
  
  /** IDs of zones connected to this one (for pathways and navigation) */
  connectedZones: string[];
  
  /** Optional icon to represent the zone */
  icon?: string;
  
  /** Optional background image for the zone card */
  backgroundImage?: string;
  
  /** Optional metadata for additional zone information */
  metadata?: Record<string, any>;
}