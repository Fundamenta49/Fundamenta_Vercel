import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface JungleThemeContextType {
  isJungleTheme: boolean;
  toggleTheme: () => void;
  enableJungleTheme: () => void;
  disableJungleTheme: () => void;
}

const JungleThemeContext = createContext<JungleThemeContextType | undefined>(undefined);

interface JungleThemeProviderProps {
  children: ReactNode;
  defaultTheme?: boolean;
}

/**
 * Provider component that enables jungle theme functionality throughout the app
 */
export const JungleThemeProvider: React.FC<JungleThemeProviderProps> = ({
  children,
  defaultTheme = false
}) => {
  // State to track if jungle theme is active
  const [isJungleTheme, setIsJungleTheme] = useState<boolean>(() => {
    // Try to get saved preference from localStorage
    const savedPreference = localStorage.getItem('jungle-theme-enabled');
    return savedPreference !== null ? JSON.parse(savedPreference) : defaultTheme;
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('jungle-theme-enabled', JSON.stringify(isJungleTheme));
    
    // Add or remove the jungle-theme class from the document element
    if (isJungleTheme) {
      document.documentElement.classList.add('jungle-theme');
    } else {
      document.documentElement.classList.remove('jungle-theme');
    }
  }, [isJungleTheme]);

  // Toggle between jungle and standard themes
  const toggleTheme = () => {
    setIsJungleTheme(prev => !prev);
  };

  // Explicitly enable jungle theme
  const enableJungleTheme = () => {
    setIsJungleTheme(true);
  };

  // Explicitly disable jungle theme
  const disableJungleTheme = () => {
    setIsJungleTheme(false);
  };

  // Context value
  const value = {
    isJungleTheme,
    toggleTheme,
    enableJungleTheme,
    disableJungleTheme
  };

  return (
    <JungleThemeContext.Provider value={value}>
      {children}
    </JungleThemeContext.Provider>
  );
};

/**
 * Custom hook to access the jungle theme context
 */
export const useJungleTheme = (): JungleThemeContextType => {
  const context = useContext(JungleThemeContext);
  
  if (context === undefined) {
    throw new Error('useJungleTheme must be used within a JungleThemeProvider');
  }
  
  return context;
};