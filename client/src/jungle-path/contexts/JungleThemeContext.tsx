import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface for user jungle progress information
interface JungleProgress {
  lastZoneId?: string;
  xp: number;
  rank: number;
  lastPosition?: { x: number; y: number };
}

// Interface for the context value
interface JungleThemeContextValue {
  // Theme state
  isJungleTheme: boolean;
  toggleJungleTheme: () => void;
  enableJungleTheme: () => void;
  disableJungleTheme: () => void;
  
  // Animation state for transitions
  isTransitioning: boolean;
  
  // User progress
  jungleProgress: JungleProgress;
  updateJungleProgress: (progress: Partial<JungleProgress>) => void;
  setLastZone: (zoneId: string) => void;
  addXP: (amount: number) => void;
}

// Default progress values
const DEFAULT_JUNGLE_PROGRESS: JungleProgress = {
  xp: 0,
  rank: 0
};

// Storage keys for persisting state
const STORAGE_KEYS = {
  THEME_ENABLED: 'jungle_theme_enabled',
  PROGRESS: 'jungle_progress'
};

// Create the context with a default value
const JungleThemeContext = createContext<JungleThemeContextValue>({
  isJungleTheme: false,
  toggleJungleTheme: () => {},
  enableJungleTheme: () => {},
  disableJungleTheme: () => {},
  isTransitioning: false,
  jungleProgress: DEFAULT_JUNGLE_PROGRESS,
  updateJungleProgress: () => {},
  setLastZone: () => {},
  addXP: () => {}
});

// Props for the provider component
interface JungleThemeProviderProps {
  children: ReactNode;
  defaultEnabled?: boolean;
}

/**
 * Provider component that manages the jungle theme state and user progress
 */
export const JungleThemeProvider: React.FC<JungleThemeProviderProps> = ({ 
  children, 
  defaultEnabled = false 
}) => {
  // Load theme preference from localStorage
  const loadSavedThemePreference = (): boolean => {
    try {
      const savedPreference = localStorage.getItem(STORAGE_KEYS.THEME_ENABLED);
      return savedPreference !== null ? JSON.parse(savedPreference) : defaultEnabled;
    } catch (error) {
      console.error('Error loading jungle theme preference:', error);
      return defaultEnabled;
    }
  };
  
  // Load saved progress from localStorage
  const loadSavedProgress = (): JungleProgress => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return savedProgress ? JSON.parse(savedProgress) : DEFAULT_JUNGLE_PROGRESS;
    } catch (error) {
      console.error('Error loading jungle progress:', error);
      return DEFAULT_JUNGLE_PROGRESS;
    }
  };

  // State to track whether the jungle theme is enabled
  const [isJungleTheme, setIsJungleTheme] = useState<boolean>(loadSavedThemePreference());
  
  // State to track animation transitions
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  // State to track user jungle progress
  const [jungleProgress, setJungleProgress] = useState<JungleProgress>(loadSavedProgress());

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME_ENABLED, JSON.stringify(isJungleTheme));
    } catch (error) {
      console.error('Error saving jungle theme preference:', error);
    }
  }, [isJungleTheme]);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(jungleProgress));
    } catch (error) {
      console.error('Error saving jungle progress:', error);
    }
  }, [jungleProgress]);

  // Toggle the jungle theme on/off with transition animation
  const toggleJungleTheme = () => {
    setIsTransitioning(true);
    
    // Add a small delay to allow animation to complete
    setTimeout(() => {
      setIsJungleTheme(prev => !prev);
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Animation duration
    }, 50);
  };

  // Explicitly enable the jungle theme
  const enableJungleTheme = () => {
    if (!isJungleTheme) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsJungleTheme(true);
        setTimeout(() => setIsTransitioning(false), 500);
      }, 50);
    }
  };

  // Explicitly disable the jungle theme
  const disableJungleTheme = () => {
    if (isJungleTheme) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsJungleTheme(false);
        setTimeout(() => setIsTransitioning(false), 500);
      }, 50);
    }
  };
  
  // Update jungle progress
  const updateJungleProgress = (progress: Partial<JungleProgress>) => {
    setJungleProgress(prev => ({
      ...prev,
      ...progress
    }));
  };
  
  // Set the last visited zone
  const setLastZone = (zoneId: string) => {
    updateJungleProgress({ lastZoneId: zoneId });
  };
  
  // Add XP and potentially update rank (simple implementation - can be expanded)
  const addXP = (amount: number) => {
    updateJungleProgress({
      xp: jungleProgress.xp + amount
    });
    
    // Simplified rank calculation (can be replaced with more complex logic)
    const newXpTotal = jungleProgress.xp + amount;
    const newRank = Math.floor(newXpTotal / 100); // Simple rank calculation: 1 rank per 100 XP
    
    if (newRank > jungleProgress.rank) {
      updateJungleProgress({ rank: newRank });
    }
  };

  // Create the context value object
  const contextValue: JungleThemeContextValue = {
    isJungleTheme,
    toggleJungleTheme,
    enableJungleTheme,
    disableJungleTheme,
    isTransitioning,
    jungleProgress,
    updateJungleProgress,
    setLastZone,
    addXP
  };

  // Provide the context to children with transitions class
  return (
    <JungleThemeContext.Provider value={contextValue}>
      <div className={`
        transition-colors duration-500
        ${isTransitioning ? 'jungle-transition' : ''}
        ${isJungleTheme ? 'jungle-theme-active' : 'jungle-theme-inactive'}
      `}>
        {children}
      </div>
    </JungleThemeContext.Provider>
  );
};

/**
 * Custom hook to use the jungle theme context
 */
export const useJungleTheme = (): JungleThemeContextValue => {
  const context = useContext(JungleThemeContext);
  
  if (context === undefined) {
    throw new Error('useJungleTheme must be used within a JungleThemeProvider');
  }
  
  return context;
};