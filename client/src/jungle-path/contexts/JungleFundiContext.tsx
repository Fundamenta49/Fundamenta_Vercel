import React, { createContext, useContext, useState, useEffect } from 'react';
import { useJungleTheme } from './JungleThemeContext';
import { QuestType, ZoneType, getFundiGuidance, getFundiZoneTip, getRandomEncouragement } from '../utils/fundiGuidance';

interface JungleFundiContextType {
  isGuideMode: boolean;
  toggleGuideMode: () => void;
  fundiMessage: string;
  setFundiMessage: (message: string) => void;
  fundiPosition: 'left' | 'right' | 'center';
  setFundiPosition: (position: 'left' | 'right' | 'center') => void;
  showFundi: boolean;
  setShowFundi: (show: boolean) => void;
  // New helper methods for contextual guidance
  showQuestGuidance: (questType: QuestType, phase: 'intro' | 'hint' | 'completion', hintIndex?: number) => void;
  showZoneGuidance: (zone: ZoneType) => void;
  showEncouragement: () => void;
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

  // Helper methods for contextual guidance
  const showQuestGuidance = (questType: QuestType, phase: 'intro' | 'hint' | 'completion', hintIndex = 0) => {
    const message = getFundiGuidance(questType, phase, hintIndex);
    setFundiMessage(message);
    setShowFundi(true);
  };

  const showZoneGuidance = (zone: ZoneType) => {
    const message = getFundiZoneTip(zone);
    setFundiMessage(message);
    setShowFundi(true);
  };

  const showEncouragement = () => {
    const message = getRandomEncouragement();
    setFundiMessage(message);
    setShowFundi(true);
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
        showQuestGuidance,
        showZoneGuidance,
        showEncouragement,
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