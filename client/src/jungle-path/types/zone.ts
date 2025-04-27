/**
 * JungleZone type represents a category/area in the jungle map
 */
export interface JungleZone {
  id: string;
  name: string;
  description: string;
  category: string;
  
  // Map positioning
  mapX: number;
  mapY: number;
  
  // Appearance
  color: string;
  iconName: string;
  
  // Requirements
  requiredRank: number;
  
  // Connected zones
  connectedTo: string[];
  
  // Optional visual elements
  bgImagePath?: string;
  decorations?: Array<{
    type: string;
    x: number;
    y: number;
    scale: number;
    rotation?: number;
  }>;
}