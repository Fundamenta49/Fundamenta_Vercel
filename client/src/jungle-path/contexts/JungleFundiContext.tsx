import React, { createContext, useContext, useState, useEffect } from 'react';
import { useJungleTheme } from './JungleThemeContext';

interface JungleFundiContextType {
  isGuideMode: boolean;
  toggleGuideMode: () => void;
  fundiMessage: string;
  setFundiMessage: (message: string) => void;
  fundiPosition: 'left' | 'right' | 'center';
  setFundiPosition: (position: 'left' | 'right' | 'center') => void;
  showFundi: boolean;
  setShowFundi: (show: boolean) => void;
}

const JungleFundiContext = createContext<JungleFundiContextType | undefined>(undefined);

export function JungleFundiProvider({ children }: { children: React.ReactNode }) {
  const { isJungleTheme } = useJungleTheme();
  const [isGuideMode, setIsGuideMode] = useState(false);
  const [fundiMessage, setFundiMessage] = useState('');
  const [fundiPosition, setFundiPosition] = useState<'left' | 'right' | 'center'>('right');
  const [showFundi, setShowFundi] = useState(false);

  // Automatically enable guide mode when jungle theme is active
  useEffect(() => {
    if (isJungleTheme) {
      // Default welcome message in jungle mode
      setFundiMessage("Welcome to the jungle adventure! I'll be your guide through this expedition.");
      setShowFundi(true);
    } else {
      setShowFundi(false);
    }
  }, [isJungleTheme]);

  const toggleGuideMode = () => {
    setIsGuideMode(!isGuideMode);
  };

  return (
    <JungleFundiContext.Provider
      value={{
        isGuideMode,
        toggleGuideMode,
        fundiMessage,
        setFundiMessage,
        fundiPosition,
        setFundiPosition,
        showFundi,
        setShowFundi,
      }}
    >
      {children}
    </JungleFundiContext.Provider>
  );
}

export function useJungleFundi() {
  const context = useContext(JungleFundiContext);
  if (context === undefined) {
    throw new Error('useJungleFundi must be used within a JungleFundiProvider');
  }
  return context;
}