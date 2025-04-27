/**
 * Jungle Path Zone Definitions
 * Detailed data for each jungle zone including visual elements
 */
import { AchievementCategory } from '@/shared/arcade-schema';
import { getZoneData } from '../utils/zoneUtils';
import { 
  Landmark, 
  Crown, 
  Heart, 
  BookOpen, 
  Shield, 
  Compass, 
  DollarSign 
} from 'lucide-react';

// Zone icon mapping
export const ZONE_ICONS = {
  finance: DollarSign,
  career: Landmark,
  wellness: Heart,
  fitness: Crown,
  learning: BookOpen,
  emergency: Shield,
  general: Compass
};

// Extended zone descriptions for detailed view
export const ZONE_EXTENDED_DESCRIPTIONS = {
  finance: `
    The Treasury Temple stands as an ancient stone structure, its golden dome gleaming in the jungle sun. 
    Here, explorers learn the sacred arts of resource management, investment, and financial wisdom passed 
    down through generations of jungle guardians. The mysterious symbols carved into its walls reveal 
    secrets of wealth preservation and growth to those patient enough to study them.
  `,
  career: `
    Career Canyon stretches vast and deep, its walls etched with the paths of countless successful explorers 
    before you. Each winding trail represents a different professional journey, with hidden caves housing 
    specialized knowledge and lookout points offering perspective on potential paths ahead. The echoes of 
    wisdom from past pathfinders guide new travelers seeking their true calling.
  `,
  wellness: `
    The Wellness Waterfall cascades with crystalline waters said to possess healing properties. Around its 
    pool grow rare medicinal plants tended by generations of wellness sages. The mist creates a perpetual 
    rainbow, symbolizing the balance of elements needed for true well-being. Explorers come here to learn 
    the ancient practices of self-care, nutrition, and mental harmony.
  `,
  fitness: `
    Fitness Peaks rise dramatically from the jungle floor, offering increasingly challenging terrain for 
    those seeking physical mastery. Stone steps carved by ancient warriors lead to training plateaus where 
    explorers can practice different disciplines. At the summit, the most dedicated athletes find the Temple 
    of Vitality, where the secrets of peak performance are taught by the jungle's greatest physical masters.
  `,
  learning: `
    The Scholar's Grove stands as a natural cathedral of towering trees, their branches creating a canopy 
    under which all forms of knowledge are gathered and shared. Ancient scrolls and modern teachings coexist 
    in this sanctuary of wisdom. The Grove's centerpiece is a massive tree said to have been growing since 
    the dawn of knowledge itself, its roots connecting to every corner of the jungle.
  `,
  emergency: `
    Guardian Ruins remain from an advanced civilization that mastered the art of preparation and protection. 
    Though partially reclaimed by jungle vegetation, the stone structures still stand as a testament to proper 
    planning and resilience. Explorers who study these ruins learn critical skills for handling unexpected 
    dangers and protecting themselves and others during times of crisis.
  `,
  general: `
    The Central Clearing serves as the heart of the jungle expedition, where all paths converge and new journeys 
    begin. A communal fire burns perpetually at its center, symbolizing the shared knowledge of all explorers. 
    Stone markers indicate the directions to specialized zones, while expedition planners offer guidance to 
    newcomers. This is where all great jungle adventures are born.
  `
};

// Visual elements for each zone on the map
export const ZONE_VISUAL_ELEMENTS = {
  finance: {
    background: "temple-bg.svg",
    decorative: ["coins.svg", "treasure-chest.svg", "golden-statue.svg"],
    atmosphere: "golden light filtering through temple windows"
  },
  career: {
    background: "canyon-bg.svg",
    decorative: ["path-signs.svg", "mountain-peaks.svg", "lookout-tower.svg"],
    atmosphere: "echoing canyon with multiple branching paths"
  },
  wellness: {
    background: "waterfall-bg.svg",
    decorative: ["healing-plants.svg", "meditation-stones.svg", "rainbow.svg"],
    atmosphere: "misty clearing with healing waters"
  },
  fitness: {
    background: "mountain-peaks-bg.svg",
    decorative: ["training-ground.svg", "stone-steps.svg", "summit-flag.svg"],
    atmosphere: "challenging ascent with training plateaus"
  },
  learning: {
    background: "ancient-grove-bg.svg",
    decorative: ["scrolls.svg", "wisdom-tree.svg", "study-circles.svg"],
    atmosphere: "dappled light through ancient canopy"
  },
  emergency: {
    background: "stone-ruins-bg.svg",
    decorative: ["guardian-statues.svg", "protective-shields.svg", "warning-totems.svg"],
    atmosphere: "ancient protective structures emerging from jungle"
  },
  general: {
    background: "clearing-bg.svg",
    decorative: ["central-fire.svg", "directional-stones.svg", "expedition-tents.svg"],
    atmosphere: "bustling hub of activity and planning"
  }
};

// Get all zone data in a structured format
export const getAllZones = () => {
  return Object.values(AchievementCategory.enum).map(category => {
    const zoneData = getZoneData(category as AchievementCategory);
    return {
      ...zoneData,
      extendedDescription: ZONE_EXTENDED_DESCRIPTIONS[category],
      visuals: ZONE_VISUAL_ELEMENTS[category]
    };
  });
};

// Get connection paths between zones for the map
export const getZoneConnections = () => {
  const zones = getAllZones();
  const connections: {from: string, to: string}[] = [];
  
  zones.forEach(zone => {
    zone.connections.forEach(connectedZoneId => {
      // Only add connection if it doesn't already exist (prevents duplicates)
      const connectionExists = connections.some(
        c => (c.from === zone.id && c.to === connectedZoneId) || 
             (c.from === connectedZoneId && c.to === zone.id)
      );
      
      if (!connectionExists) {
        connections.push({
          from: zone.id,
          to: connectedZoneId
        });
      }
    });
  });
  
  return connections;
};