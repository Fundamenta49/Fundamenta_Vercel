import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Companion } from '../../types/companion';

// Sample companion data
const COMPANIONS: Companion[] = [
  {
    id: 'owl',
    name: 'Professor Hoot',
    species: 'Owl',
    description: 'A wise owl who guides you through the knowledge temples.',
    avatarSrc: '/companions/owl.svg', // Placeholder path
    color: '#724E91', // Shadow Purple
    specialtyZones: ['temple', 'crystal-cave'],
    personality: 'wise',
    introMessage: 'Greetings, explorer! I am Professor Hoot, keeper of ancient knowledge. I shall guide you through the mysteries of the temple.',
    tips: [
      {
        id: 'tip1',
        text: 'Remember to take notes on your discoveries. The greatest explorers are also the most diligent record-keepers.',
        context: ['temple', 'learning']
      },
      {
        id: 'tip2',
        text: 'When faced with a complex challenge, break it down into smaller parts, just as you would map an unexplored territory section by section.',
        context: ['difficulty', 'challenge']
      }
    ]
  },
  {
    id: 'monkey',
    name: 'Zippy',
    species: 'Monkey',
    description: 'An energetic monkey who helps you navigate the jungle canopy.',
    avatarSrc: '/companions/monkey.svg', // Placeholder path
    color: '#94C973', // Canopy Light
    specialtyZones: ['ancient-trail', 'mountaintop'],
    personality: 'energetic',
    introMessage: 'Hey there! I\'m Zippy! Ready to swing through the jungle and tackle some awesome challenges?',
    tips: [
      {
        id: 'tip1',
        text: 'Sometimes the best path isn\'t a straight line! Look for creative ways to approach your goals.',
        context: ['wellness', 'fitness']
      },
      {
        id: 'tip2',
        text: 'Don\'t forget to stretch and move around regularly during your journey. Even a quick movement break keeps your energy up!',
        context: ['wellness', 'energy']
      }
    ]
  },
  {
    id: 'turtle',
    name: 'Shelly',
    species: 'Turtle',
    description: 'A patient turtle who helps you manage resources and plan ahead.',
    avatarSrc: '/companions/turtle.svg', // Placeholder path
    color: '#3B82C4', // River Blue
    specialtyZones: ['river', 'waterfall'],
    personality: 'cautious',
    introMessage: 'Hello, young explorer. I am Shelly. Take your time, plan wisely, and you will navigate even the most challenging rapids.',
    tips: [
      {
        id: 'tip1',
        text: 'Remember that consistent small steps will carry you further than occasional bursts of effort.',
        context: ['finance', 'planning']
      },
      {
        id: 'tip2',
        text: 'Before diving into new waters, take a moment to survey what lies ahead. Preparation prevents many missteps.',
        context: ['caution', 'preparation']
      }
    ]
  }
];

interface CompanionContextType {
  companions: Companion[];
  activeCompanion: Companion | null;
  setActiveCompanion: (companionId: string) => void;
  dialogVisible: boolean;
  showCompanionDialog: () => void;
  hideCompanionDialog: () => void;
  getRandomTip: (context?: string) => string | null;
}

const CompanionContext = createContext<CompanionContextType | undefined>(undefined);

interface CompanionProviderProps {
  children: ReactNode;
  userAchievements: string[]; // Array of achievement IDs the user has completed
  userTier: 'free' | 'tier1' | 'tier2';
}

/**
 * Provider component for the companion system
 */
export const CompanionProvider: React.FC<CompanionProviderProps> = ({
  children,
  userAchievements,
  userTier
}) => {
  const [companions] = useState<Companion[]>(COMPANIONS);
  const [activeCompanion, setActiveCompanionState] = useState<Companion | null>(null);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  
  // Set the active companion by ID
  const setActiveCompanion = (companionId: string) => {
    const companion = companions.find(c => c.id === companionId);
    if (companion) {
      setActiveCompanionState(companion);
      // When switching companions, show their intro message
      setDialogVisible(true);
    }
  };
  
  // Show the companion dialog
  const showCompanionDialog = () => {
    setDialogVisible(true);
  };
  
  // Hide the companion dialog
  const hideCompanionDialog = () => {
    setDialogVisible(false);
  };
  
  // Get a random tip appropriate for the current context
  const getRandomTip = (context?: string): string | null => {
    if (!activeCompanion) return null;
    
    const relevantTips = activeCompanion.tips.filter(tip => 
      !context || tip.context.includes(context)
    );
    
    if (relevantTips.length === 0) return null;
    
    const randomTip = relevantTips[Math.floor(Math.random() * relevantTips.length)];
    return randomTip.text;
  };
  
  // Set default companion on mount
  useEffect(() => {
    if (companions.length > 0 && !activeCompanion) {
      setActiveCompanionState(companions[0]);
    }
  }, [companions, activeCompanion]);
  
  // Context value
  const value = {
    companions,
    activeCompanion,
    setActiveCompanion,
    dialogVisible,
    showCompanionDialog,
    hideCompanionDialog,
    getRandomTip
  };
  
  return (
    <CompanionContext.Provider value={value}>
      {children}
    </CompanionContext.Provider>
  );
};

/**
 * Custom hook to access the companion context
 */
export const useCompanion = (): CompanionContextType => {
  const context = useContext(CompanionContext);
  
  if (context === undefined) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  
  return context;
};