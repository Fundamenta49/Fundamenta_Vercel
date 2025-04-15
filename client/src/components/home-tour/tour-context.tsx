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
      // Set data attribute on body to indicate tour is active (for CSS targeting)
      document.body.setAttribute('data-tour-active', 'true');
      
      // Add step-specific attribute for targeted styling
      const stepTypeMap: Record<number, string> = {
        9: 'calendar', // Calendar step (index 9 - 0-based indexing)
        10: 'arcade'   // Arcade step (index 10 - 0-based indexing)
      };
      
      if (stepTypeMap[currentStep]) {
        document.body.setAttribute('data-tour-step', stepTypeMap[currentStep]);
      } else {
        document.body.removeAttribute('data-tour-step');
      }
      
      // Delay sidebar opening slightly to ensure the DOM is fully ready
      const sidebarOpenDelay = currentStep === 0 ? 800 : 300;
      setTimeout(() => handleMobileSidebarForStep(currentStep), sidebarOpenDelay);
    } else {
      // Remove data attributes when tour is not active
      document.body.removeAttribute('data-tour-active');
      document.body.removeAttribute('data-tour-step');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTourActive, currentStep]);
  
  // Start the tour
  const startTour = () => {
    setCurrentStep(0);
    setIsTourActive(true);
  };
  
  // Add cleanup effect to remove data attributes when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any data attributes on unmount
      document.body.removeAttribute('data-tour-active');
      document.body.removeAttribute('data-tour-step');
    };
  }, []);
  
  // End the tour
  const endTour = () => {
    setIsTourActive(false);
    setCurrentStep(0);
    // Remove data attributes
    document.body.removeAttribute('data-tour-active');
    document.body.removeAttribute('data-tour-step');
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
    
    // Calendar step is at index 9 and Arcade at index 10 in the steps array
    // These are the steps that need the sidebar open on mobile
    const sidebarSteps = [9, 10]; // Step indices for Calendar and Arcade
    
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
            // Find the element to highlight - either Calendar or Arcade button
            const targetElement = stepIndex === 9 
              ? document.querySelector('[data-tour-id="nav-smart-calendar"]')
              : document.querySelector('[data-tour-id="nav-arcade"]');
              
            if (targetElement) {
              // Create a pulsing highlight effect similar to the homepage cards
              const targetHtmlElement = targetElement as HTMLElement;
              
              // Store original styles to restore later
              const originalBg = targetHtmlElement.style.backgroundColor;
              const originalTransform = targetHtmlElement.style.transform;
              const originalTransition = targetHtmlElement.style.transition;
              const originalZIndex = targetHtmlElement.style.zIndex;
              
              // Apply enhanced highlight effects
              targetHtmlElement.style.transition = "all 0.5s ease-in-out";
              targetHtmlElement.style.zIndex = "100";
              
              // Apply specific highlighting based on the step
              if (stepIndex === 9) {
                // Calendar - Indigo theme
                targetHtmlElement.style.backgroundColor = "#e0e7ff"; // indigo-100
                targetHtmlElement.style.boxShadow = "0 0 15px 5px rgba(99, 102, 241, 0.7)"; // indigo glow
                // Add a subtle pulsing outline animation
                const keyframes = `
                  @keyframes calendarPulse {
                    0% { box-shadow: 0 0 15px 5px rgba(99, 102, 241, 0.7); }
                    50% { box-shadow: 0 0 25px 8px rgba(99, 102, 241, 0.9); }
                    100% { box-shadow: 0 0 15px 5px rgba(99, 102, 241, 0.7); }
                  }
                `;
                const styleElement = document.createElement('style');
                styleElement.innerHTML = keyframes;
                document.head.appendChild(styleElement);
                targetHtmlElement.style.animation = "calendarPulse 1.5s infinite";
              } else {
                // Arcade - Amber theme
                targetHtmlElement.style.backgroundColor = "#fef3c7"; // amber-100
                targetHtmlElement.style.boxShadow = "0 0 15px 5px rgba(245, 158, 11, 0.7)"; // amber glow
                // Add a subtle pulsing outline animation
                const keyframes = `
                  @keyframes arcadePulse {
                    0% { box-shadow: 0 0 15px 5px rgba(245, 158, 11, 0.7); }
                    50% { box-shadow: 0 0 25px 8px rgba(245, 158, 11, 0.9); }
                    100% { box-shadow: 0 0 15px 5px rgba(245, 158, 11, 0.7); }
                  }
                `;
                const styleElement = document.createElement('style');
                styleElement.innerHTML = keyframes;
                document.head.appendChild(styleElement);
                targetHtmlElement.style.animation = "arcadePulse 1.5s infinite";
              }
              
              // Add a subtle scale effect
              targetHtmlElement.style.transform = "scale(1.05)";
              
              // Remove the highlight effect after a few seconds
              setTimeout(() => {
                // Restore original styles
                targetHtmlElement.style.backgroundColor = originalBg;
                targetHtmlElement.style.boxShadow = "";
                targetHtmlElement.style.transform = originalTransform;
                targetHtmlElement.style.transition = originalTransition;
                targetHtmlElement.style.zIndex = originalZIndex;
                targetHtmlElement.style.animation = "";
              }, 6000); // Longer duration for better visibility
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