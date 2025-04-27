import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface for the context value
interface JungleThemeContextValue {
  isJungleTheme: boolean;
  toggleJungleTheme: () => void;
  enableJungleTheme: () => void;
  disableJungleTheme: () => void;
}

// Create the context with a default value
const JungleThemeContext = createContext<JungleThemeContextValue>({
  isJungleTheme: false,
  toggleJungleTheme: () => {},
  enableJungleTheme: () => {},
  disableJungleTheme: () => {},
});

// Props for the provider component
interface JungleThemeProviderProps {
  children: ReactNode;
  defaultEnabled?: boolean;
}

/**
 * Provider component that manages the jungle theme state
 */
export const JungleThemeProvider: React.FC<JungleThemeProviderProps> = ({ 
  children, 
  defaultEnabled = false 
}) => {
  // State to track whether the jungle theme is enabled
  const [isJungleTheme, setIsJungleTheme] = useState<boolean>(defaultEnabled);

  // Toggle the jungle theme on/off
  const toggleJungleTheme = () => {
    setIsJungleTheme(prev => !prev);
  };

  // Explicitly enable the jungle theme
  const enableJungleTheme = () => {
    setIsJungleTheme(true);
  };

  // Explicitly disable the jungle theme
  const disableJungleTheme = () => {
    setIsJungleTheme(false);
  };

  // Create the context value object
  const contextValue: JungleThemeContextValue = {
    isJungleTheme,
    toggleJungleTheme,
    enableJungleTheme,
    disableJungleTheme,
  };

  // Provide the context to children
  return (
    <JungleThemeContext.Provider value={contextValue}>
      {children}
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