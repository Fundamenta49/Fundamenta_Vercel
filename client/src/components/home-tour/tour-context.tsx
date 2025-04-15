import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useIsMobile } from '@/hooks/use-mobile';

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
  totalSteps: 11, // Total number of steps in our tour (updated with double-click and Why Fundamenta final steps)
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
  
  // Handle sidebar opening when tour is active and current step changes
  useEffect(() => {
    // Only check for sidebar steps when tour is active
    if (isTourActive) {
      // Delay sidebar opening slightly to ensure the DOM is fully ready
      const sidebarOpenDelay = currentStep === 0 ? 800 : 300;
      setTimeout(() => handleMobileSidebarForStep(currentStep), sidebarOpenDelay);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTourActive, currentStep]);
  
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
  
  // Function to toggle mobile sidebar for specific steps that need it
  const handleMobileSidebarForStep = (stepIndex: number) => {
    const isMobile = window.innerWidth < 768; // Match the mobile breakpoint used in the app
    
    if (!isMobile) return; // Only execute for mobile devices
    
    // Calendar step is typically at index 8 and Arcade at index 9 (after adding double-click step)
    // These are the steps that need the sidebar open on mobile
    const sidebarSteps = [8, 9]; // Step indices for Calendar and Arcade
    
    if (sidebarSteps.includes(stepIndex)) {
      // Use a custom event to directly communicate with the Navigation component
      // This is more reliable than trying to find and click the button
      try {
        document.dispatchEvent(new CustomEvent('openMobileNavigation', { 
          bubbles: true,
          detail: { open: true }
        }));
        console.log('Mobile sidebar opened for tour step');
        
        // After sidebar opens, add highlight effect to Calendar/Arcade item
        setTimeout(() => {
          try {
            const targetElement = stepIndex === 8 
              ? document.querySelector('button:has(svg[data-lucide="Calendar"])')
              : document.querySelector('button:has(svg[data-lucide="Gamepad2"])');
              
            if (targetElement) {
              // Apply highlight effect
              const targetHtmlElement = targetElement as HTMLElement;
              targetHtmlElement.style.transition = "all 0.3s ease-in-out";
              targetHtmlElement.style.boxShadow = stepIndex === 8 
                ? "0 0 15px #6366f1" // Indigo for Calendar
                : "0 0 15px #f59e0b"; // Amber for Arcade
              
              // Remove the highlight effect after a few seconds
              setTimeout(() => {
                targetHtmlElement.style.boxShadow = "";
              }, 3000);
            }
          } catch (e) {
            console.warn("Could not add highlight effect to sidebar item:", e);
          }
        }, 500);
      } catch (e) {
        console.error('Failed to dispatch custom event:', e);
        
        // If custom event fails, fall back to trying to click the button directly
        const mobileButton = document.querySelector('button.fixed.top-4.left-4') as HTMLButtonElement;
        if (mobileButton) {
          mobileButton.click();
          console.log('Mobile sidebar opened by direct button click (fallback)');
        } else {
          console.warn('Could not find mobile menu button to open sidebar for tour');
        }
      }
    }
  };
  
  // Go to next step
  const nextStep = () => {
    if (currentStep < defaultContext.totalSteps - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      // Handle sidebar opening for specific steps
      setTimeout(() => handleMobileSidebarForStep(nextStepIndex), 300);
    } else {
      // If we're at the last step, trigger the founder message
      endTour();
      showFounderMessage();
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      
      // Handle sidebar opening for specific steps
      setTimeout(() => handleMobileSidebarForStep(prevStepIndex), 300);
    }
  };
  
  // Go to specific step
  const goToStep = (step: number) => {
    if (step >= 0 && step < defaultContext.totalSteps) {
      setCurrentStep(step);
      
      // Handle sidebar opening for specific steps
      setTimeout(() => handleMobileSidebarForStep(step), 300);
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