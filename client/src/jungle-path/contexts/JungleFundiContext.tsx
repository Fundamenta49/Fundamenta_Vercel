import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useJungleTheme } from './JungleThemeContext';
import { QuestType, ZoneType, getFundiGuidance, getFundiZoneTip, getRandomEncouragement } from '../utils/fundiGuidance';
import { useAIEventStore, AIResponse } from '../../lib/ai-event-system';

interface JungleFundiContextType {
  isGuideMode: boolean;
  toggleGuideMode: () => void;
  // Helper methods for contextual guidance
  showQuestGuidance: (questType: QuestType, phase: 'intro' | 'hint' | 'completion', hintIndex?: number) => void;
  showZoneGuidance: (zone: ZoneType) => void;
  showEncouragement: () => void;
  // Message management methods
  sendJungleMessage: (message: string, category?: string) => void;
}

const JungleFundiContext = createContext<JungleFundiContextType | undefined>(undefined);

// This provider integrates with the existing Fundi system instead of creating a custom component
export function JungleFundiProvider({ children }: { children: React.ReactNode }) {
  const { isJungleTheme } = useJungleTheme();
  const [isGuideMode, setIsGuideMode] = useState(false);
  const { setLastResponse } = useAIEventStore();

  // Send a message to the existing Fundi system - memoized to prevent infinite loops
  const sendJungleMessage = useCallback((message: string, category: string = 'learning') => {
    if (!isJungleTheme) return;
    
    // Create a response object that will be processed by the regular Fundi system
    const jungleResponse: AIResponse = {
      response: message,
      category: category,
      confidence: 0.95,
      sentiment: 'positive'
    };
    
    // Use the existing AI event store to send the message to Fundi
    setLastResponse(jungleResponse);
  }, [isJungleTheme, setLastResponse]);

  // Automatically set welcome message when jungle theme becomes active
  useEffect(() => {
    if (isJungleTheme) {
      // Default welcome message when entering jungle mode
      sendJungleMessage("Welcome to the jungle adventure! I'll be your guide through this expedition.");
    }
  }, [isJungleTheme, sendJungleMessage]);

  const toggleGuideMode = useCallback(() => {
    setIsGuideMode(prev => !prev);
  }, []);

  // Helper methods for contextual guidance - memoized to prevent dependency issues
  const showQuestGuidance = useCallback((questType: QuestType, phase: 'intro' | 'hint' | 'completion', hintIndex = 0) => {
    if (!isJungleTheme) return;
    const message = getFundiGuidance(questType, phase, hintIndex);
    sendJungleMessage(message);
  }, [isJungleTheme, sendJungleMessage]);

  const showZoneGuidance = useCallback((zone: ZoneType) => {
    if (!isJungleTheme) return;
    const message = getFundiZoneTip(zone);
    sendJungleMessage(message);
  }, [isJungleTheme, sendJungleMessage]);

  const showEncouragement = useCallback(() => {
    if (!isJungleTheme) return;
    const message = getRandomEncouragement();
    sendJungleMessage(message);
  }, [isJungleTheme, sendJungleMessage]);

  return (
    <JungleFundiContext.Provider
      value={{
        isGuideMode,
        toggleGuideMode,
        showQuestGuidance,
        showZoneGuidance,
        showEncouragement,
        sendJungleMessage
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