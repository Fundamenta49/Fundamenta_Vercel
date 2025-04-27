import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'default' | 'jungle';

interface JungleThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  enableJungleTheme: () => void;
  disableJungleTheme: () => void;
  isJungleTheme: boolean;
}

const JungleThemeContext = createContext<JungleThemeContextType>({
  themeMode: 'default',
  toggleTheme: () => {},
  enableJungleTheme: () => {},
  disableJungleTheme: () => {},
  isJungleTheme: false
});

const THEME_STORAGE_KEY = 'fundamenta-jungle-theme';

export const JungleThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('default');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'jungle') {
      setThemeMode('jungle');
    }
  }, []);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    
    // Add or remove jungle theme class from body
    if (themeMode === 'jungle') {
      document.body.classList.add('jungle-theme');
    } else {
      document.body.classList.remove('jungle-theme');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'default' ? 'jungle' : 'default');
  };

  const enableJungleTheme = () => {
    setThemeMode('jungle');
  };

  const disableJungleTheme = () => {
    setThemeMode('default');
  };

  return (
    <JungleThemeContext.Provider 
      value={{ 
        themeMode, 
        toggleTheme, 
        enableJungleTheme,
        disableJungleTheme,
        isJungleTheme: themeMode === 'jungle'
      }}
    >
      {children}
    </JungleThemeContext.Provider>
  );
};

export const useJungleTheme = () => useContext(JungleThemeContext);

export default JungleThemeContext;