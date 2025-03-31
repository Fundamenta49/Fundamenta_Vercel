import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

// Define the types for our tour steps
export interface TourStep {
  targetSelector?: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  disableBeacon?: boolean;
  disableOverlayClose?: boolean;
  showProgress?: boolean;
  action?: () => void;
}

export interface Tour {
  id: string;
  title: string;
  steps: TourStep[];
  requiredPath?: string;
}

// Define onboarding state interface
interface OnboardingState {
  hasCompletedInitialTour: boolean;
  completedTours: string[];
  activeTour: Tour | null;
  currentStepIndex: number;
  isTourActive: boolean;
  disableAllTours: boolean; // Global toggle to disable all tours
}

// Define context interface
interface OnboardingContextType {
  onboardingState: OnboardingState;
  availableTours: Tour[];
  startTour: (tourId: string) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  markTourAsCompleted: (tourId: string) => void;
  resetAllTours: () => void;
  currentStep: TourStep | null;
  disableAllTours: () => void; // Method to disable all tours
  enableAllTours: () => void; // Method to re-enable tours if needed
}

// Create context with default values
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Define props for provider
interface OnboardingProviderProps {
  children: ReactNode;
  tours: Tour[];
}

// Define constant key for localStorage
const ONBOARDING_STATE_KEY = 'fundamenta_onboarding_state';

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ 
  children, 
  tours 
}) => {
  const [location] = useLocation();
  
  // Initialize state from localStorage or with defaults
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(() => {
    const savedState = localStorage.getItem(ONBOARDING_STATE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse onboarding state from localStorage', e);
      }
    }
    
    return {
      hasCompletedInitialTour: false,
      completedTours: [],
      activeTour: null,
      currentStepIndex: 0,
      isTourActive: false,
      disableAllTours: false
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(onboardingState));
  }, [onboardingState]);

  // Compute current step based on state
  const currentStep = onboardingState.activeTour && onboardingState.isTourActive
    ? onboardingState.activeTour.steps[onboardingState.currentStepIndex]
    : null;

  // Start a tour by ID
  const startTour = (tourId: string) => {
    // If all tours are disabled, don't start a new tour
    if (onboardingState.disableAllTours) {
      console.log('All tours are disabled. Use enableAllTours() to re-enable tours.');
      return;
    }
    
    const tour = tours.find(t => t.id === tourId);
    
    if (!tour) {
      console.error(`Tour with ID ${tourId} not found`);
      return;
    }
    
    // If the tour requires a specific path, check if we're on that path
    if (tour.requiredPath && location !== tour.requiredPath) {
      console.log(`Tour ${tourId} requires path ${tour.requiredPath}, but we're on ${location}`);
      return;
    }
    
    setOnboardingState(prev => ({
      ...prev,
      activeTour: tour,
      currentStepIndex: 0,
      isTourActive: true
    }));
  };

  // End the current tour
  const endTour = () => {
    if (onboardingState.activeTour) {
      markTourAsCompleted(onboardingState.activeTour.id);
    }
    
    setOnboardingState(prev => ({
      ...prev,
      activeTour: null,
      currentStepIndex: 0,
      isTourActive: false
    }));
  };

  // Go to next step in tour
  const nextStep = () => {
    if (!onboardingState.activeTour) return;
    
    const nextIndex = onboardingState.currentStepIndex + 1;
    
    if (nextIndex >= onboardingState.activeTour.steps.length) {
      // End of tour
      endTour();
      return;
    }
    
    setOnboardingState(prev => ({
      ...prev,
      currentStepIndex: nextIndex
    }));
    
    // Execute step action if defined
    const step = onboardingState.activeTour.steps[nextIndex];
    if (step.action) {
      step.action();
    }
  };

  // Go to previous step in tour
  const prevStep = () => {
    if (!onboardingState.activeTour) return;
    
    const prevIndex = onboardingState.currentStepIndex - 1;
    
    if (prevIndex < 0) {
      // Beginning of tour, do nothing
      return;
    }
    
    setOnboardingState(prev => ({
      ...prev,
      currentStepIndex: prevIndex
    }));
    
    // Execute step action if defined
    const step = onboardingState.activeTour.steps[prevIndex];
    if (step.action) {
      step.action();
    }
  };

  // Skip the current tour
  const skipTour = () => {
    if (onboardingState.activeTour) {
      // Mark as completed without going through all steps
      markTourAsCompleted(onboardingState.activeTour.id);
    }
    
    setOnboardingState(prev => ({
      ...prev,
      activeTour: null,
      currentStepIndex: 0,
      isTourActive: false
    }));
  };

  // Mark a tour as completed
  const markTourAsCompleted = (tourId: string) => {
    setOnboardingState(prev => {
      // If tour is already marked as completed, don't add it again
      if (prev.completedTours.includes(tourId)) {
        return prev;
      }
      
      // Special case for initial tour
      const isInitialTour = tourId === 'initial-tour';
      
      return {
        ...prev,
        completedTours: [...prev.completedTours, tourId],
        hasCompletedInitialTour: prev.hasCompletedInitialTour || isInitialTour
      };
    });
  };

  // Reset all tours (for testing or when user wants to see tours again)
  const resetAllTours = () => {
    setOnboardingState({
      hasCompletedInitialTour: false,
      completedTours: [],
      activeTour: null,
      currentStepIndex: 0,
      isTourActive: false,
      disableAllTours: false
    });
  };
  
  // Permanently disable all tours
  const disableAllTours = () => {
    setOnboardingState(prev => ({
      ...prev,
      disableAllTours: true,
      isTourActive: false,
      activeTour: null
    }));
  };
  
  // Re-enable tours if needed
  const enableAllTours = () => {
    setOnboardingState(prev => ({
      ...prev,
      disableAllTours: false
    }));
  };

  // Filter tours that are available based on current location
  const availableTours = tours.filter(tour => {
    // If tour doesn't have a required path, it's available everywhere
    if (!tour.requiredPath) return true;
    
    // If tour has a required path, check if we're on that path
    return location === tour.requiredPath;
  });

  const contextValue: OnboardingContextType = {
    onboardingState,
    availableTours,
    startTour,
    endTour,
    nextStep,
    prevStep,
    skipTour,
    markTourAsCompleted,
    resetAllTours,
    currentStep,
    disableAllTours,
    enableAllTours
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};