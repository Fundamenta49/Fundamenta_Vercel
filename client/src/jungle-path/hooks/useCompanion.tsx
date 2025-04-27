import { useContext } from 'react';
import CompanionContext from '../components/companion/CompanionProvider';
import { getRandomCompanionMessage } from '../data/companions';
import { AchievementCategory } from '@/shared/arcade-schema';

/**
 * Hook for using the companion system
 */
export const useCompanion = () => {
  const companionContext = useContext(CompanionContext);
  
  // Get a random message from the active companion
  const getCompanionMessage = (
    messageType: 'encouragement' | 'celebration' = 'encouragement'
  ): string => {
    if (!companionContext.activeCompanion) {
      return "I'm here to guide you through the jungle!";
    }
    
    return getRandomCompanionMessage(companionContext.activeCompanion, messageType);
  };
  
  // Get a tip for the current zone
  const getZoneTip = (zone: AchievementCategory): string => {
    if (!companionContext.activeCompanion) {
      return "Explore this zone carefully to discover all its secrets.";
    }
    
    const { messages } = companionContext.activeCompanion;
    
    // Return zone-specific tip if available, otherwise general tip
    return messages.tips[zone] || messages.tips.general || messages.greeting;
  };
  
  // Check if a companion is unlocked
  const isCompanionUnlocked = (companionId: string): boolean => {
    return companionContext.isCompanionUnlocked(companionId);
  };
  
  // Show companion dialog
  const showCompanionDialog = () => {
    companionContext.setShowCompanionDialog(true);
  };
  
  // Hide companion dialog
  const hideCompanionDialog = () => {
    companionContext.setShowCompanionDialog(false);
  };
  
  // Set the current zone (to update active companion)
  const setCurrentZone = (zone: AchievementCategory | null) => {
    companionContext.setCurrentZone(zone);
  };

  return {
    companions: companionContext.companions,
    activeCompanion: companionContext.activeCompanion,
    setActiveCompanion: companionContext.setActiveCompanion,
    isCompanionUnlocked,
    showCompanionDialog,
    hideCompanionDialog,
    dialogVisible: companionContext.showCompanionDialog,
    getCompanionMessage,
    getZoneTip,
    setCurrentZone,
    currentZone: companionContext.currentZone
  };
};

export default useCompanion;