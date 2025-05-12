import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useJungleTheme } from './JungleThemeContext';
import { getZoneByCategory } from '../utils/zoneUtils';

// Interface for JungleFundi context
interface JungleFundiContextValue {
  // Send a message to the AI assistant in jungle style
  sendJungleMessage: (message: string) => void;
  
  // Open the chat with a pre-filled jungle message
  startJungleConversation: (message: string) => void;
  
  // Configure zone-specific assistant styles
  setActiveZone: (zoneCategory: string) => void;
  
  // Current active zone category for theming
  activeZoneCategory: string | null;
}

// Create the context
const JungleFundiContext = createContext<JungleFundiContextValue>({
  sendJungleMessage: () => {},
  startJungleConversation: () => {},
  setActiveZone: () => {},
  activeZoneCategory: null
});

// Props for the provider component
interface JungleFundiProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages the jungle-themed AI assistant 
 */
export const JungleFundiProvider: React.FC<JungleFundiProviderProps> = ({ children }) => {
  const { isJungleTheme, jungleProgress } = useJungleTheme();
  const [activeZoneCategory, setActiveZoneCategory] = useState<string | null>(null);

  // Update active zone based on last zone in progress if not explicitly set
  useEffect(() => {
    if (!activeZoneCategory && jungleProgress.lastZoneId) {
      const zone = getZoneByCategory(jungleProgress.lastZoneId);
      if (zone) {
        setActiveZoneCategory(zone.category);
      }
    }
  }, [activeZoneCategory, jungleProgress.lastZoneId]);

  /**
   * Send a message to the AI assistant with jungle theming
   */
  const sendJungleMessage = (message: string) => {
    if (!isJungleTheme) {
      console.warn('Attempted to send jungle message when jungle theme is inactive');
      return;
    }

    // Send message to the AI assistant (implementation will depend on how the chat system is built)
    // This is a placeholder - actual implementation requires integrating with the existing chat system
    try {
      // This is where we'd dispatch an action or call a method to send the message
      console.log('Jungle Fundi message sent:', message);
      
      // Access global Fundi interface if available (example, actual implementation will vary)
      const globalFundiInterface = (window as any).__FUNDI_INTERFACE__;
      if (globalFundiInterface?.sendMessage) {
        globalFundiInterface.sendMessage(message, {
          theme: 'jungle',
          zoneCategory: activeZoneCategory || 'general',
          rank: jungleProgress.rank
        });
      }
    } catch (error) {
      console.error('Error sending jungle message:', error);
    }
  };

  /**
   * Start a conversation with the AI assistant
   */
  const startJungleConversation = (message: string) => {
    if (!isJungleTheme) {
      console.warn('Attempted to start jungle conversation when jungle theme is inactive');
      return;
    }

    // Open the chat UI and pre-fill a message
    try {
      // This is where we'd open the chat UI with a pre-filled message
      console.log('Starting jungle conversation:', message);
      
      // Access global Fundi interface if available (example, actual implementation will vary)
      const globalFundiInterface = (window as any).__FUNDI_INTERFACE__;
      if (globalFundiInterface?.openChat) {
        globalFundiInterface.openChat(message, {
          theme: 'jungle',
          zoneCategory: activeZoneCategory || 'general',
          rank: jungleProgress.rank
        });
      }
    } catch (error) {
      console.error('Error starting jungle conversation:', error);
    }
  };

  /**
   * Set the active zone for contextual assistant styling
   */
  const setActiveZone = (zoneCategory: string) => {
    setActiveZoneCategory(zoneCategory);
  };

  // Create the context value
  const contextValue: JungleFundiContextValue = {
    sendJungleMessage,
    startJungleConversation,
    setActiveZone,
    activeZoneCategory
  };

  // Provide the context to children
  return (
    <JungleFundiContext.Provider value={contextValue}>
      {children}
    </JungleFundiContext.Provider>
  );
};

/**
 * Custom hook to use the jungle AI assistant context
 */
export const useJungleFundi = (): JungleFundiContextValue => {
  const context = useContext(JungleFundiContext);
  
  if (context === undefined) {
    throw new Error('useJungleFundi must be used within a JungleFundiProvider');
  }
  
  return context;
};