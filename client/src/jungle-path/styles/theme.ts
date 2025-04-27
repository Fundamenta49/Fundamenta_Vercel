/**
 * Jungle Path Theme Configuration
 * Core colors, typography, and styling variables for the jungle-themed gamification system
 */

export const JUNGLE_THEME = {
  colors: {
    primary: {
      green: "#1E4A3D", // Deep Jungle Green - Primary background, headers, navigation
      blue: "#3B82C4",  // River Blue - Water elements, progress bars, interactive elements
      gold: "#E6B933",  // Temple Gold - Highlights, achievements, special elements
      orange: "#E67E33" // Sunset Orange - Alerts, important actions, energy indicators
    },
    secondary: {
      lightGreen: "#94C973", // Canopy Light - Success states, growth indicators
      stone: "#8B8682",      // Stone Gray - Neutral elements, secondary text
      purple: "#724E91",     // Shadow Purple - Mystery elements, locked content
      clay: "#C24D4D"        // Clay Red - Warning elements, challenge indicators
    },
    zones: {
      finance: {
        primary: "#E6B933",   // Gold
        secondary: "#8B7E2F", // Dark gold
        accent: "#F4D77D",    // Light gold
        icon: "Coins"         // Lucide icon name
      },
      career: {
        primary: "#3B82C4",   // Blue
        secondary: "#235A91", // Dark blue
        accent: "#9CC7F0",    // Light blue
        icon: "Briefcase"     // Lucide icon name
      },
      wellness: {
        primary: "#94C973",   // Light green
        secondary: "#5A9A48", // Medium green
        accent: "#C6E5B3",    // Very light green
        icon: "Leaf"          // Lucide icon name
      },
      fitness: {
        primary: "#E67E33",   // Orange
        secondary: "#A75A24", // Dark orange
        accent: "#F4BF9D",    // Light orange
        icon: "Mountain"      // Lucide icon name
      },
      learning: {
        primary: "#724E91",   // Purple
        secondary: "#4A2B6B", // Dark purple
        accent: "#B99CD1",    // Light purple
        icon: "BookOpen"      // Lucide icon name
      },
      emergency: {
        primary: "#C24D4D",   // Red
        secondary: "#872323", // Dark red
        accent: "#E5A0A0",    // Light red
        icon: "Shield"        // Lucide icon name
      },
      general: {
        primary: "#1E4A3D",   // Deep green
        secondary: "#0F2A22", // Very dark green
        accent: "#6A8C7F",    // Medium green
        icon: "Compass"       // Lucide icon name
      }
    }
  },
  typography: {
    headings: {
      fontFamily: "system-ui, sans-serif",
      letterSpacing: "0.02em"
    },
    body: {
      fontFamily: "system-ui, sans-serif"
    }
  },
  cardStyles: {
    common: {
      base: "border-2 rounded-lg shadow-sm transition-all",
      locked: "border-gray-200 bg-gray-50 opacity-75",
      hover: "hover:shadow-md hover:border-opacity-100"
    }
  },
  mapStyles: {
    paths: {
      unlocked: "stroke-[#3B82C4] stroke-[3px]",
      locked: "stroke-[#8B8682] stroke-[2px] stroke-dashed opacity-50"
    },
    nodes: {
      unlocked: "fill-[#E6B933] stroke-[#8B7E2F] stroke-2",
      current: "fill-[#E67E33] stroke-[#A75A24] stroke-2",
      locked: "fill-[#8B8682] stroke-[#555] stroke-2 opacity-60",
      completed: "fill-[#94C973] stroke-[#5A9A48] stroke-2"
    }
  },
  // Jungle-themed button variants
  buttons: {
    primary: "bg-[#1E4A3D] hover:bg-[#2E5A4D] text-white",
    secondary: "bg-[#E6B933] hover:bg-[#F6C943] text-[#1E4A3D]",
    warning: "bg-[#C24D4D] hover:bg-[#D25D5D] text-white",
    zone: {
      finance: "bg-[#E6B933] hover:bg-[#F6C943] text-[#0F2A22]",
      career: "bg-[#3B82C4] hover:bg-[#4B92D4] text-white",
      wellness: "bg-[#94C973] hover:bg-[#A4D983] text-[#0F2A22]",
      fitness: "bg-[#E67E33] hover:bg-[#F68E43] text-white",
      learning: "bg-[#724E91] hover:bg-[#825EA1] text-white",
      emergency: "bg-[#C24D4D] hover:bg-[#D25D5D] text-white",
      general: "bg-[#1E4A3D] hover:bg-[#2E5A4D] text-white"
    }
  },
  // Rank styles for progression system
  rankStyles: {
    newcomer: {
      badge: "bg-[#8B8682] text-white",
      card: "border-[#8B8682] bg-gray-50"
    },
    explorer: {
      badge: "bg-[#94C973] text-[#0F2A22]",
      card: "border-[#94C973] bg-green-50" 
    },
    pathfinder: {
      badge: "bg-[#3B82C4] text-white",
      card: "border-[#3B82C4] bg-blue-50"
    },
    trailblazer: {
      badge: "bg-[#E6B933] text-[#0F2A22]",
      card: "border-[#E6B933] bg-amber-50"
    },
    guardian: {
      badge: "bg-[#724E91] text-white",
      card: "border-[#724E91] bg-purple-50"
    }
  }
};

// Utility function to get zone-specific styling
export const getZoneStyle = (category: string) => {
  const zoneKey = category as keyof typeof JUNGLE_THEME.colors.zones;
  const zoneColors = JUNGLE_THEME.colors.zones[zoneKey] || JUNGLE_THEME.colors.zones.general;
  
  return {
    primary: zoneColors.primary,
    secondary: zoneColors.secondary,
    accent: zoneColors.accent,
    icon: zoneColors.icon,
    buttonClass: JUNGLE_THEME.buttons.zone[zoneKey] || JUNGLE_THEME.buttons.zone.general,
    iconBg: `bg-[${zoneColors.accent}]`,
    textClass: `text-[${zoneColors.secondary}]`,
    cardClass: `border-[${zoneColors.primary}] hover:border-[${zoneColors.secondary}]`,
    progressClass: `bg-[${zoneColors.primary}]`
  };
};

// Utility function to get rank style
export const getRankStyle = (rankName: string) => {
  const rankKey = rankName.toLowerCase() as keyof typeof JUNGLE_THEME.rankStyles;
  return JUNGLE_THEME.rankStyles[rankKey] || JUNGLE_THEME.rankStyles.newcomer;
};