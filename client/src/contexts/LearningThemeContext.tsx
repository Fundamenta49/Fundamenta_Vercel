import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';

// Define available learning themes
type ThemeType = 'standard' | 'jungle';

// Context interface
interface LearningThemeContextValue {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isJungleTheme: boolean;
}

// Create context with default values
const LearningThemeContext = createContext<LearningThemeContextValue>({
  theme: 'standard',
  setTheme: () => {},
  isJungleTheme: false,
});

// Props for the provider component
interface LearningThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeType;
}

/**
 * Provider for the learning theme context
 * This is a lightweight wrapper around the JungleThemeContext
 * that specifically handles learning content presentation
 */
export const LearningThemeProvider: React.FC<LearningThemeProviderProps> = ({ 
  children, 
  initialTheme = 'standard' 
}) => {
  const [theme, setTheme] = useState<ThemeType>(initialTheme);
  const { enableJungleTheme, disableJungleTheme } = useJungleTheme();
  
  // Effect to synchronize with JungleTheme
  React.useEffect(() => {
    if (theme === 'jungle') {
      enableJungleTheme();
    } else {
      disableJungleTheme();
    }
  }, [theme, enableJungleTheme, disableJungleTheme]);
  
  // Create context value
  const contextValue: LearningThemeContextValue = {
    theme,
    setTheme,
    isJungleTheme: theme === 'jungle',
  };
  
  return (
    <LearningThemeContext.Provider value={contextValue}>
      {children}
    </LearningThemeContext.Provider>
  );
};

/**
 * Hook to use the learning theme context
 */
export const useLearningTheme = (): LearningThemeContextValue => {
  const context = useContext(LearningThemeContext);
  
  if (context === undefined) {
    throw new Error('useLearningTheme must be used within a LearningThemeProvider');
  }
  
  return context;
};

/**
 * Alias for useLearningTheme to maintain compatibility with existing code
 * @deprecated Use useLearningTheme instead
 */
export const useTheme = useLearningTheme;