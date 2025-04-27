import { getZoneByCategory } from './zoneUtils';

// Fallback color for zones
const DEFAULT_ZONE_COLOR = '#94C973'; // Canopy Light

/**
 * Get color of a zone by category
 */
export const getZoneColor = (category: string): string => {
  const zone = getZoneByCategory(category);
  return zone?.color || DEFAULT_ZONE_COLOR;
};

/**
 * Get tailwind styles for a zone
 */
export interface ZoneStyles {
  borderClass: string;
  bgClass: string;
  textClass: string;
  hoverClass: string;
  activeClass: string;
  fillClass: string;
  strokeClass: string;
}

/**
 * Get Tailwind CSS classes for a particular zone
 */
export const getZoneStyle = (category: string): ZoneStyles => {
  const color = getZoneColor(category);
  
  // Create inline styles using the color
  return {
    borderClass: `border-[${color}]`,
    bgClass: `bg-[${color}]`,
    textClass: `text-[${color}]`,
    hoverClass: `hover:bg-[${color}] hover:bg-opacity-10`,
    activeClass: `active:bg-[${color}] active:bg-opacity-20`,
    fillClass: `fill-[${color}]`,
    strokeClass: `stroke-[${color}]`
  };
};

/**
 * Get CSS variables for the zone colors
 */
export const getZoneColorVars = (): Record<string, string> => {
  const zones = {
    basecamp: '#94C973', // Canopy Light
    river: '#3B82C4', // River Blue
    'ancient-trail': '#94C973', // Canopy Light
    temple: '#E6B933', // Temple Gold
    waterfall: '#C24D4D', // Clay Red
    mountaintop: '#8B8682', // Stone Gray
    volcano: '#E67E33', // Sunset Orange
    'crystal-cave': '#724E91', // Shadow Purple
    'hidden-valley': '#1E4A3D', // Jungle Green
  };
  
  // Convert to CSS variable format
  const cssVars: Record<string, string> = {};
  Object.entries(zones).forEach(([zone, color]) => {
    cssVars[`--zone-${zone}`] = color;
  });
  
  return cssVars;
};

/**
 * Generate a CSS variable string for all zone colors
 */
export const getZoneColorCSSVars = (): string => {
  const vars = getZoneColorVars();
  return Object.entries(vars)
    .map(([name, value]) => `${name}: ${value};`)
    .join('\n');
};