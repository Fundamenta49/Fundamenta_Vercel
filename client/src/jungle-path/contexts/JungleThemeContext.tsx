import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface JungleThemeContextType {
  isJungleTheme: boolean;
  toggleJungleTheme: () => void;
  enableJungleTheme: () => void;
  disableJungleTheme: () => void;
}

const JungleThemeContext = createContext<JungleThemeContextType | undefined>(undefined);

interface JungleThemeProviderProps {
  children: ReactNode;
  defaultEnabled?: boolean;
}

/**
 * Provider component for the jungle theme system
 * Allows toggling between normal app appearance and jungle-themed appearance
 */
export const JungleThemeProvider: React.FC<JungleThemeProviderProps> = ({
  children,
  defaultEnabled = false
}) => {
  // State to track if jungle theme is active
  const [isJungleTheme, setIsJungleTheme] = useState<boolean>(defaultEnabled);
  
  // Toggle jungle theme
  const toggleJungleTheme = () => {
    setIsJungleTheme(prev => !prev);
  };
  
  // Enable jungle theme
  const enableJungleTheme = () => {
    setIsJungleTheme(true);
  };
  
  // Disable jungle theme
  const disableJungleTheme = () => {
    setIsJungleTheme(false);
  };
  
  // Apply theme-specific classes to the body when theme changes
  useEffect(() => {
    if (isJungleTheme) {
      document.body.classList.add('jungle-theme');
    } else {
      document.body.classList.remove('jungle-theme');
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('jungle-theme');
    };
  }, [isJungleTheme]);
  
  // Context value
  const value = {
    isJungleTheme,
    toggleJungleTheme,
    enableJungleTheme,
    disableJungleTheme
  };
  
  return (
    <JungleThemeContext.Provider value={value}>
      <div className={isJungleTheme ? 'jungle-theme' : ''}>
        {children}
      </div>
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