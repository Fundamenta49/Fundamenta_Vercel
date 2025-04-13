import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

// Tour context interface
interface TourContextType {
  isTourActive: boolean;
  currentStep: number;
  totalSteps: number;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  showFounderMessage: () => void;
}

// Default context values
const defaultContext: TourContextType = {
  isTourActive: false,
  currentStep: 0,
  totalSteps: 10, // Total number of steps in our tour (updated with Why Fundamenta final step)
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  showFounderMessage: () => {},
};

// Create the context
const TourContext = createContext<TourContextType>(defaultContext);

// Tour context provider component
export const TourProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  
  // Use localStorage to track if user has seen tour before
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('fundamenta-tour-completed');
    
    // If user is logged in and hasn't seen the tour, auto-start it
    if (user && !hasSeenTour) {
      const timer = setTimeout(() => {
        setIsTourActive(true);
      }, 1500); // Small delay to let the page load first
      
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  // Start the tour
  const startTour = () => {
    setCurrentStep(0);
    setIsTourActive(true);
  };
  
  // End the tour
  const endTour = () => {
    setIsTourActive(false);
    setCurrentStep(0);
    // Mark that user has seen the tour
    localStorage.setItem('fundamenta-tour-completed', 'true');
  };
  
  // Show the founder message (final step)
  const showFounderMessage = () => {
    // Dispatch a custom event to open the founder message without page reload
    const customEvent = new CustomEvent('openFounderMessage', { detail: { open: true } });
    document.dispatchEvent(customEvent);
  };
  
  // Go to next step
  const nextStep = () => {
    if (currentStep < defaultContext.totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // If we're at the last step, trigger the founder message
      endTour();
      showFounderMessage();
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Go to specific step
  const goToStep = (step: number) => {
    if (step >= 0 && step < defaultContext.totalSteps) {
      setCurrentStep(step);
    }
  };
  
  // Context value
  const value = {
    isTourActive,
    currentStep,
    totalSteps: defaultContext.totalSteps,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    showFounderMessage,
  };
  
  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

// Custom hook to use the tour context
export function useTour() {
  return useContext(TourContext);
}