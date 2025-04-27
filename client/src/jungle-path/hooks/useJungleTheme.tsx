import { useContext, useEffect } from 'react';
import JungleThemeContext from '../contexts/JungleThemeContext';

// Custom CSS properties for the jungle theme
const JUNGLE_CSS_VARS = {
  // Primary colors
  '--jungle-green': '#1E4A3D',
  '--jungle-blue': '#3B82C4',
  '--jungle-gold': '#E6B933',
  '--jungle-orange': '#E67E33',
  
  // Secondary colors
  '--jungle-light-green': '#94C973',
  '--jungle-stone': '#8B8682',
  '--jungle-purple': '#724E91',
  '--jungle-clay': '#C24D4D',
  
  // Background gradients
  '--jungle-bg-gradient-from': '#E6F2E3',
  '--jungle-bg-gradient-to': '#F4FBF3',
  
  // Component-specific colors
  '--jungle-quest-card-border': '#1E4A3D',
  '--jungle-quest-title': '#1E4A3D',
  '--jungle-rank-badge-bg': '#E6B933',
  '--jungle-rank-badge-text': '#1E4A3D',
  
  // Typography
  '--jungle-heading-font': 'system-ui, sans-serif',
  '--jungle-body-font': 'system-ui, sans-serif',
  '--jungle-heading-spacing': '0.02em',
};

/**
 * Hook for using and controlling the jungle theme
 * Applies CSS variables when theme is active and handles theme toggling
 */
export const useJungleTheme = () => {
  const themeContext = useContext(JungleThemeContext);
  
  // Apply or remove CSS variables when theme changes
  useEffect(() => {
    const applyTheme = () => {
      if (themeContext.isJungleTheme) {
        // Apply jungle theme CSS variables
        Object.entries(JUNGLE_CSS_VARS).forEach(([property, value]) => {
          document.documentElement.style.setProperty(property, value);
        });
        
        // Add jungle theme class to body
        document.body.classList.add('jungle-theme');
      } else {
        // Remove jungle theme CSS variables
        Object.keys(JUNGLE_CSS_VARS).forEach(property => {
          document.documentElement.style.removeProperty(property);
        });
        
        // Remove jungle theme class from body
        document.body.classList.remove('jungle-theme');
      }
    };
    
    applyTheme();
    
    // Cleanup function to remove variables when component unmounts
    return () => {
      if (themeContext.isJungleTheme) {
        Object.keys(JUNGLE_CSS_VARS).forEach(property => {
          document.documentElement.style.removeProperty(property);
        });
        document.body.classList.remove('jungle-theme');
      }
    };
  }, [themeContext.isJungleTheme]);
  
  return {
    isJungleTheme: themeContext.isJungleTheme,
    toggleTheme: themeContext.toggleTheme,
    enableJungleTheme: themeContext.enableJungleTheme,
    disableJungleTheme: themeContext.disableJungleTheme
  };
};

export default useJungleTheme;