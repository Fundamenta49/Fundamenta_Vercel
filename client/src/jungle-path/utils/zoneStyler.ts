import { getZoneByCategory } from './zoneUtils';

/**
 * Get the color associated with a category/zone
 */
export const getZoneColor = (category: string): string => {
  const zone = getZoneByCategory(category);
  return zone?.color || '#1E4A3D'; // Default to jungle green if zone not found
};

/**
 * Get CSS styles for a quest card based on its category
 */
export const getQuestCardStyle = (category: string, isUnlocked: boolean = true) => {
  const zoneColor = getZoneColor(category);
  
  return {
    borderColor: isUnlocked ? zoneColor : '#ccc',
    // Add more quest card styling based on zone as needed
  };
};

/**
 * Get CSS styles for a zone card
 */
export const getZoneCardStyle = (category: string, isUnlocked: boolean = true) => {
  const zoneColor = getZoneColor(category);
  
  return {
    borderColor: isUnlocked ? zoneColor : '#ccc',
    // Add more zone card styling as needed
  };
};

/**
 * Get CSS styles for progress bars based on category
 */
export const getProgressBarStyle = (category: string, isCompleted: boolean = false) => {
  const zoneColor = getZoneColor(category);
  const completedColor = '#94C973'; // Success green
  
  return {
    '--progress-foreground': isCompleted ? completedColor : zoneColor
  } as React.CSSProperties;
};