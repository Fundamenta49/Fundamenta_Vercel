import React, { createContext, useContext, useState, useEffect } from 'react';
import { Companion, getUnlockedCompanions, getCompanionForZone } from '../../data/companions';
import { AchievementCategory } from '@/shared/arcade-schema';

interface CompanionContextType {
  companions: Companion[];
  activeCompanion: Companion | null;
  setActiveCompanion: (companionId: string) => void;
  showCompanionDialog: boolean;
  setShowCompanionDialog: (show: boolean) => void;
  currentZone: AchievementCategory | null;
  setCurrentZone: (zone: AchievementCategory | null) => void;
  getCompanionById: (id: string) => Companion | undefined;
  isCompanionUnlocked: (companionId: string) => boolean;
}

const CompanionContext = createContext<CompanionContextType>({
  companions: [],
  activeCompanion: null,
  setActiveCompanion: () => {},
  showCompanionDialog: false,
  setShowCompanionDialog: () => {},
  currentZone: null,
  setCurrentZone: () => {},
  getCompanionById: () => undefined,
  isCompanionUnlocked: () => false
});

interface CompanionProviderProps {
  children: React.ReactNode;
  userAchievements: string[];
  userTier: string;
}

export const CompanionProvider: React.FC<CompanionProviderProps> = ({ 
  children, 
  userAchievements, 
  userTier 
}) => {
  // Get unlocked companions based on user achievements and subscription tier
  const unlockedCompanions = getUnlockedCompanions(userAchievements, userTier);
  
  const [companions, setCompanions] = useState<Companion[]>(unlockedCompanions);
  const [activeCompanionId, setActiveCompanionId] = useState<string | null>(null);
  const [showCompanionDialog, setShowCompanionDialog] = useState(false);
  const [currentZone, setCurrentZone] = useState<AchievementCategory | null>(null);
  
  // Get the active companion object
  const activeCompanion = companions.find(c => c.id === activeCompanionId) || null;
  
  // Update companions when user achievements or tier changes
  useEffect(() => {
    const newUnlockedCompanions = getUnlockedCompanions(userAchievements, userTier);
    setCompanions(newUnlockedCompanions);
    
    // Set default active companion if none selected
    if (!activeCompanionId && newUnlockedCompanions.length > 0) {
      setActiveCompanionId(newUnlockedCompanions[0].id);
    }
  }, [userAchievements, userTier]);
  
  // Update active companion when zone changes (if applicable)
  useEffect(() => {
    if (currentZone) {
      const zoneCompanion = getCompanionForZone(currentZone, companions);
      if (zoneCompanion) {
        setActiveCompanionId(zoneCompanion.id);
      }
    }
  }, [currentZone, companions]);
  
  // Set active companion
  const setActiveCompanion = (companionId: string) => {
    setActiveCompanionId(companionId);
    setShowCompanionDialog(true);
  };
  
  // Get a companion by ID
  const getCompanionById = (id: string) => {
    return companions.find(c => c.id === id);
  };
  
  // Check if a companion is unlocked
  const isCompanionUnlocked = (companionId: string) => {
    return companions.some(c => c.id === companionId);
  };
  
  const contextValue = {
    companions,
    activeCompanion,
    setActiveCompanion,
    showCompanionDialog,
    setShowCompanionDialog,
    currentZone,
    setCurrentZone,
    getCompanionById,
    isCompanionUnlocked
  };
  
  return (
    <CompanionContext.Provider value={contextValue}>
      {children}
    </CompanionContext.Provider>
  );
};

// Custom hook to use the companion context
export const useCompanion = () => useContext(CompanionContext);

export default CompanionContext;