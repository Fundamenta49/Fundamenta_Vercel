import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';

/**
 * Tour step interface - represents a single step in the tour
 */
export interface GuidedTourStep {
  id: string;
  title: string;
  content: string;
  targetSelector?: string; // CSS selector to highlight (optional)
  path?: string; // Route path if navigation is needed
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center'; // Tooltip position
  showSkipButton?: boolean;
  showPrevButton?: boolean;
  isIntroStep?: boolean; // Special flag for intro step with user's name
  isOutroStep?: boolean; // Special flag for conclusion step with user's name
}

/**
 * Tour definition interface - groups related steps
 */
export interface GuidedTour {
  id: string;
  name: string;
  steps: GuidedTourStep[];
}

/**
 * Tour context interface - defines the shape of the context
 */
interface GuidedTourContextProps {
  // State
  activeTour: GuidedTour | null;
  currentStepIndex: number;
  isTourActive: boolean;
  completedTours: string[];
  userName: string;
  
  // Methods
  startTour: (tourId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  skipTour: () => void;
  getCurrentStep: () => GuidedTourStep | null;
  setUserName: (name: string) => void;
}

// Create the context with default values
const GuidedTourContext = createContext<GuidedTourContextProps>({
  activeTour: null,
  currentStepIndex: 0,
  isTourActive: false,
  completedTours: [],
  userName: '',
  
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTour: () => {},
  skipTour: () => {},
  getCurrentStep: () => null,
  setUserName: () => {},
});

// Provider props interface
interface GuidedTourProviderProps {
  children: ReactNode;
  tours: GuidedTour[];
}

// Local storage keys
const STORAGE_KEY_COMPLETED_TOURS = 'guided_tours_completed';
const STORAGE_KEY_USER_NAME = 'guided_tours_user_name';

/**
 * Tour Provider Component
 */
export const GuidedTourProvider: React.FC<GuidedTourProviderProps> = ({ children, tours }) => {
  // State
  const [activeTour, setActiveTour] = useState<GuidedTour | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [completedTours, setCompletedTours] = useState<string[]>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem(STORAGE_KEY_COMPLETED_TOURS);
    return stored ? JSON.parse(stored) : [];
  });
  const [userName, setUserName] = useState<string>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem(STORAGE_KEY_USER_NAME) || '';
  });

  // Hooks
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  // Get user's first name from auth context
  useEffect(() => {
    if (user?.name && !userName) {
      // Extract first name
      const firstName = user.name.split(' ')[0];
      setUserName(firstName);
      localStorage.setItem(STORAGE_KEY_USER_NAME, firstName);
    }
  }, [user, userName]);

  // Save completed tours to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLETED_TOURS, JSON.stringify(completedTours));
  }, [completedTours]);

  // Methods
  const startTour = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) {
      console.error(`Tour with ID ${tourId} not found`);
      return;
    }

    setActiveTour(tour);
    setCurrentStepIndex(0);
    setIsTourActive(true);
    
    // Get the first step
    const firstStep = tour.steps[0];
    
    // If the first step has a different path, navigate there
    if (firstStep.path && firstStep.path !== location) {
      navigate(firstStep.path);
    }
  };

  const nextStep = () => {
    if (!activeTour) return;
    
    const nextIndex = currentStepIndex + 1;
    
    // Check if we've reached the end
    if (nextIndex >= activeTour.steps.length) {
      // Mark tour as completed
      if (!completedTours.includes(activeTour.id)) {
        setCompletedTours([...completedTours, activeTour.id]);
      }
      
      // End the tour
      setIsTourActive(false);
      setActiveTour(null);
      return;
    }
    
    // If next step has a path and it's different from current location, navigate
    const nextStep = activeTour.steps[nextIndex];
    if (nextStep.path && nextStep.path !== location) {
      navigate(nextStep.path);
    }
    
    // Update current step index
    setCurrentStepIndex(nextIndex);
  };

  const prevStep = () => {
    if (!activeTour || currentStepIndex <= 0) return;
    
    const prevIndex = currentStepIndex - 1;
    const prevStep = activeTour.steps[prevIndex];
    
    // If previous step has a path and it's different from current location, navigate
    if (prevStep.path && prevStep.path !== location) {
      navigate(prevStep.path);
    }
    
    // Update current step index
    setCurrentStepIndex(prevIndex);
  };

  const endTour = () => {
    if (activeTour && !completedTours.includes(activeTour.id)) {
      setCompletedTours([...completedTours, activeTour.id]);
    }
    
    setIsTourActive(false);
    setActiveTour(null);
  };

  const skipTour = () => {
    // Skip tour without marking as completed
    setIsTourActive(false);
    setActiveTour(null);
  };

  const getCurrentStep = (): GuidedTourStep | null => {
    if (!activeTour || !isTourActive) return null;
    return activeTour.steps[currentStepIndex] || null;
  };

  // Update userName and save to localStorage
  const handleSetUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem(STORAGE_KEY_USER_NAME, name);
  };

  // Context value
  const contextValue: GuidedTourContextProps = {
    activeTour,
    currentStepIndex,
    isTourActive,
    completedTours,
    userName,
    
    startTour,
    nextStep,
    prevStep,
    endTour,
    skipTour,
    getCurrentStep,
    setUserName: handleSetUserName,
  };

  return (
    <GuidedTourContext.Provider value={contextValue}>
      {children}
    </GuidedTourContext.Provider>
  );
};

// Custom hook to use the guided tour context
export const useGuidedTour = () => useContext(GuidedTourContext);