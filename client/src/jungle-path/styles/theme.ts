/**
 * Jungle Path Theme System
 * 
 * This file contains the core color palette and theme definitions
 * for the jungle-themed gamification system.
 */

/**
 * Jungle theme color palette
 */
export const JUNGLE_COLORS = {
  // Primary palette
  jungleGreen: '#1E4A3D', // Primary background, headers, navigation
  riverBlue: '#3B82C4',   // Water elements, progress bars, interactive elements
  templeGold: '#E6B933',  // Highlights, achievements, special elements
  sunsetOrange: '#E67E33', // Alerts, important actions, energy indicators
  
  // Secondary palette
  canopyLight: '#94C973', // Success states, growth indicators
  stoneGray: '#8B8682',   // Neutral elements, secondary text
  shadowPurple: '#724E91', // Mystery elements, locked content
  clayRed: '#C24D4D',     // Warning elements, challenge indicators
  
  // Utility colors
  textPrimary: '#333333', // Primary text
  textSecondary: '#666666', // Secondary text
  bgLight: '#F6F8F4',     // Light background
  bgDark: '#142C25',      // Dark background
  
  // Transparency variants
  overlay10: 'rgba(30, 74, 61, 0.1)',
  overlay20: 'rgba(30, 74, 61, 0.2)',
  overlay50: 'rgba(30, 74, 61, 0.5)',
};

/**
 * Generates CSS variables for the jungle theme
 */
export const getJungleThemeCSS = (): string => {
  return `
    .jungle-theme {
      /* Primary colors */
      --jungle-green: ${JUNGLE_COLORS.jungleGreen};
      --river-blue: ${JUNGLE_COLORS.riverBlue};
      --temple-gold: ${JUNGLE_COLORS.templeGold};
      --sunset-orange: ${JUNGLE_COLORS.sunsetOrange};
      
      /* Secondary colors */
      --canopy-light: ${JUNGLE_COLORS.canopyLight};
      --stone-gray: ${JUNGLE_COLORS.stoneGray};
      --shadow-purple: ${JUNGLE_COLORS.shadowPurple};
      --clay-red: ${JUNGLE_COLORS.clayRed};
      
      /* Text and backgrounds */
      --text-primary: ${JUNGLE_COLORS.textPrimary};
      --text-secondary: ${JUNGLE_COLORS.textSecondary};
      --bg-light: ${JUNGLE_COLORS.bgLight};
      --bg-dark: ${JUNGLE_COLORS.bgDark};
      
      /* Component theme overrides */
      --card-border-color: var(--jungle-green);
      --header-bg-color: var(--jungle-green);
      --accent-color: var(--temple-gold);
      --button-primary-bg: var(--jungle-green);
      --button-primary-hover: #2E5A4D;
      --button-secondary-bg: var(--river-blue);
      --button-secondary-hover: #4B92D4;
      --highlight-color: var(--temple-gold);
      
      /* Animation properties */
      --transition-standard: 0.3s ease-in-out;
      --transition-slow: 0.5s ease-in-out;
      --transition-fast: 0.15s ease-in-out;
    }
  `;
};

/**
 * Animates a path reveal for the jungle map
 */
export const getPathRevealKeyframes = (): string => {
  return `
    @keyframes pathReveal {
      0% {
        stroke-dashoffset: 1000;
        opacity: 0;
      }
      
      50% {
        opacity: 0.7;
      }
      
      100% {
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }
  `;
};

/**
 * Get celebration animation keyframes for rank/achievement celebration
 */
export const getCelebrationKeyframes = (): string => {
  return `
    @keyframes celebrationPulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    
    @keyframes celebrationGlow {
      0% {
        box-shadow: 0 0 0 rgba(230, 185, 51, 0.5);
      }
      50% {
        box-shadow: 0 0 20px rgba(230, 185, 51, 0.8);
      }
      100% {
        box-shadow: 0 0 0 rgba(230, 185, 51, 0.5);
      }
    }
    
    @keyframes celebrationSpin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
};

/**
 * Get jungle-themed ambient animations
 */
export const getAmbientAnimations = (): string => {
  return `
    @keyframes floraMovement {
      0% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(1deg);
      }
      75% {
        transform: rotate(-1deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
    
    @keyframes waterFlow {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    @keyframes forestLight {
      0% {
        opacity: 0.8;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.8;
      }
    }
  `;
};

/**
 * Combine all CSS animations and variables
 */
export const getJungleThemeStyles = (): string => {
  return `
    ${getJungleThemeCSS()}
    ${getPathRevealKeyframes()}
    ${getCelebrationKeyframes()}
    ${getAmbientAnimations()}
  `;
};