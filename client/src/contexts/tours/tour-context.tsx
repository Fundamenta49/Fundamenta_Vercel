import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';

/**
 * Tour step interface - represents a single step in the tour
 */
export interface TourStep {
  id: string;
  title: string;
  content: string;
  targetSelector?: string; // CSS selector to highlight (optional)
  path?: string; // Route path if navigation is needed
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center'; // Dialog placement
  highlightSize?: 'sm' | 'md' | 'lg'; // Size of the highlight
  showSkipButton?: boolean;
  showPrevButton?: boolean;
  isMobile?: boolean; // Whether this step is mobile-optimized
  isDesktop?: boolean; // Whether this step is desktop-optimized
  fundiPosition?: { x: number; y: number }; // Custom position for Fundi
  onComplete?: () => void; // Callback executed when this step is completed
}

/**
 * Tour definition interface - represents a complete tour
 */
export interface Tour {
  id: string;
  title: string;
  steps: TourStep[];
  requiredPath?: string; // Path where this tour should be triggered
}

// Local storage keys
const STORAGE_KEY_COMPLETED_TOURS = 'fundamenta_completed_tours';
const STORAGE_KEY_USER_NAME = 'fundamenta_user_name';

// Context interface
interface TourContextProps {
  // Tour state
  isTourActive: boolean;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: TourStep | null;
  
  // User info
  userName: string;
  setUserName: (name: string) => void;
  
  // Tour controls
  startTour: (tourId: string) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  skipTour: () => void;
  restartTour: () => void;
}

// Create the context
const TourContext = createContext<TourContextProps>({
  isTourActive: false,
  currentStepIndex: 0,
  totalSteps: 0,
  currentStep: null,
  
  userName: '',
  setUserName: () => {},
  
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  skipTour: () => {},
  restartTour: () => {},
});

interface TourProviderProps {
  children: ReactNode;
  tours: Tour[];
}

// Tour Provider component
export const TourProvider: React.FC<TourProviderProps> = ({ children, tours }) => {
  // Location hook for navigation
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  
  // State for current tour
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  
  // Track if we're currently navigating to prevent race conditions
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Get user name from auth or local storage
  useEffect(() => {
    // Try to get user name from auth context
    if (user?.email) {
      // If we have an email, extract the name part (before the @)
      const nameFromEmail = user.email.split('@')[0];
      // Make it title case for better presentation
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      setUserName(formattedName);
      localStorage.setItem(STORAGE_KEY_USER_NAME, formattedName);
    } else {
      // Try to get from local storage
      const storedName = localStorage.getItem(STORAGE_KEY_USER_NAME);
      if (storedName) {
        setUserName(storedName);
      }
    }
    
    // Load completed tours from local storage
    const storedCompletedTours = localStorage.getItem(STORAGE_KEY_COMPLETED_TOURS);
    if (storedCompletedTours) {
      try {
        const parsed = JSON.parse(storedCompletedTours);
        if (Array.isArray(parsed)) {
          setCompletedTours(parsed);
        }
      } catch (error) {
        console.error('Error parsing completed tours from localStorage:', error);
      }
    }
  }, [user]);
  
  // Save completed tours to local storage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLETED_TOURS, JSON.stringify(completedTours));
  }, [completedTours]);
  
  // A. Navigate to step path if needed
  useEffect(() => {
    if (!isTourActive || !currentTour) return;
    
    const currentStep = currentTour.steps[currentStepIndex];
    
    // If step has a path and it's different from current location, navigate
    if (currentStep?.path && currentStep.path !== location && !isNavigating) {
      setIsNavigating(true);
      navigate(currentStep.path);
      
      // Reset navigating flag after navigation
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    }
  }, [isTourActive, currentTour, currentStepIndex, location, navigate, isNavigating]);
  
  // B. Handle step highlighting and scrolling
  useEffect(() => {
    if (!isTourActive || !currentTour) return;
    
    const currentStep = currentTour.steps[currentStepIndex];
    
    // If current step has a selector, highlight and scroll to element
    if (currentStep?.targetSelector) {
      // Clean up previous highlights
      document.querySelectorAll(
        '.tour-highlight, .tour-highlight-sm, .tour-highlight-md, .tour-highlight-lg, .tour-highlight-life-skills, .tour-highlight-finance, .tour-highlight-career, .tour-highlight-wellness, .tour-highlight-active, .tour-highlight-emergency, .tour-highlight-calendar, .tour-highlight-arcade'
      ).forEach(el => {
        el.classList.remove('tour-highlight');
        el.classList.remove('tour-highlight-sm');
        el.classList.remove('tour-highlight-md');
        el.classList.remove('tour-highlight-lg');
        el.classList.remove('tour-highlight-life-skills');
        el.classList.remove('tour-highlight-finance');
        el.classList.remove('tour-highlight-career');
        el.classList.remove('tour-highlight-wellness');
        el.classList.remove('tour-highlight-active');
        el.classList.remove('tour-highlight-emergency');
        el.classList.remove('tour-highlight-calendar');
        el.classList.remove('tour-highlight-arcade');
      });
      
      // Find and highlight target element
      const targetElement = document.querySelector(currentStep.targetSelector);
      if (targetElement) {
        targetElement.classList.add('tour-highlight');
        
        // Add size-specific class
        const highlightSize = currentStep.highlightSize || 'md';
        targetElement.classList.add(`tour-highlight-${highlightSize}`);
        
        // Add category-specific highlight based on step ID
        const stepId = currentStep.id.toLowerCase();
        if (stepId.includes('life-skills')) {
          targetElement.classList.add('tour-highlight-life-skills');
        } else if (stepId.includes('finance')) {
          targetElement.classList.add('tour-highlight-finance');
        } else if (stepId.includes('career')) {
          targetElement.classList.add('tour-highlight-career');
        } else if (stepId.includes('wellness')) {
          targetElement.classList.add('tour-highlight-wellness');
        } else if (stepId.includes('active')) {
          targetElement.classList.add('tour-highlight-active');
        } else if (stepId.includes('emergency')) {
          targetElement.classList.add('tour-highlight-emergency');
        } else if (stepId.includes('calendar')) {
          targetElement.classList.add('tour-highlight-calendar');
        } else if (stepId.includes('arcade')) {
          targetElement.classList.add('tour-highlight-arcade');
        }
        
        // Scroll element into view with smooth behavior
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      }
    }
    
    // Clean up on component unmount
    return () => {
      document.querySelectorAll(
        '.tour-highlight, .tour-highlight-sm, .tour-highlight-md, .tour-highlight-lg, .tour-highlight-life-skills, .tour-highlight-finance, .tour-highlight-career, .tour-highlight-wellness, .tour-highlight-active, .tour-highlight-emergency, .tour-highlight-calendar, .tour-highlight-arcade'
      ).forEach(el => {
        el.classList.remove('tour-highlight');
        el.classList.remove('tour-highlight-sm');
        el.classList.remove('tour-highlight-md');
        el.classList.remove('tour-highlight-lg');
        el.classList.remove('tour-highlight-life-skills');
        el.classList.remove('tour-highlight-finance');
        el.classList.remove('tour-highlight-career');
        el.classList.remove('tour-highlight-wellness');
        el.classList.remove('tour-highlight-active');
        el.classList.remove('tour-highlight-emergency');
        el.classList.remove('tour-highlight-calendar');
        el.classList.remove('tour-highlight-arcade');
      });
    };
  }, [isTourActive, currentTour, currentStepIndex]);
  
  // Get current step with user name inserted
  const processedCurrentStep = currentTour && currentStepIndex < currentTour.steps.length
    ? {
        ...currentTour.steps[currentStepIndex],
        title: currentTour.steps[currentStepIndex].title.replace('{userName}', userName || 'there'),
        content: currentTour.steps[currentStepIndex].content.replace('{userName}', userName || 'there')
      }
    : null;
  
  // Tour navigation methods
  const startTour = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) {
      console.error(`Tour with ID ${tourId} not found`);
      return;
    }
    
    // If tour requires a specific path and we're not on it, navigate first
    if (tour.requiredPath && location !== tour.requiredPath) {
      setIsNavigating(true);
      navigate(tour.requiredPath);
      
      // Start tour after navigation
      setTimeout(() => {
        setCurrentTour(tour);
        setCurrentStepIndex(0);
        setIsTourActive(true);
        setIsNavigating(false);
      }, 500);
    } else {
      // Start tour immediately
      setCurrentTour(tour);
      setCurrentStepIndex(0);
      setIsTourActive(true);
    }
  };
  
  const endTour = () => {
    // Execute onComplete callback for current step if defined
    if (currentTour) {
      const currentStep = currentTour.steps[currentStepIndex];
      if (currentStep?.onComplete) {
        currentStep.onComplete();
      }
      
      if (!completedTours.includes(currentTour.id)) {
        setCompletedTours([...completedTours, currentTour.id]);
      }
    }
    
    setIsTourActive(false);
    setCurrentTour(null);
    setCurrentStepIndex(0);
    
    // Clean up highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
  };
  
  const nextStep = () => {
    if (!currentTour) return;
    
    // Execute onComplete callback for current step if defined
    const currentStep = currentTour.steps[currentStepIndex];
    if (currentStep?.onComplete) {
      currentStep.onComplete();
    }
    
    const nextIndex = currentStepIndex + 1;
    
    // If we're at the last step, end the tour
    if (nextIndex >= currentTour.steps.length) {
      endTour();
      return;
    }
    
    // Update current step index
    setCurrentStepIndex(nextIndex);
  };
  
  const prevStep = () => {
    if (!currentTour || currentStepIndex <= 0) return;
    
    // Update current step index
    setCurrentStepIndex(currentStepIndex - 1);
  };
  
  const goToStep = (index: number) => {
    if (!currentTour) return;
    
    // Validate index
    if (index < 0 || index >= currentTour.steps.length) {
      console.error(`Invalid step index: ${index}`);
      return;
    }
    
    // Update current step index
    setCurrentStepIndex(index);
  };
  
  const skipTour = () => {
    // Skip tour without marking as completed
    setIsTourActive(false);
    setCurrentTour(null);
    setCurrentStepIndex(0);
    
    // Clean up highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
  };
  
  const restartTour = () => {
    if (!currentTour) return;
    
    // Reset to first step
    setCurrentStepIndex(0);
  };
  
  // Handle userName update
  const handleSetUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem(STORAGE_KEY_USER_NAME, name);
  };
  
  // Calculate total steps
  const tourSteps = currentTour?.steps || [];
  
  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        totalSteps: tourSteps.length,
        currentStep: processedCurrentStep,
        userName,
        setUserName: handleSetUserName,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
        skipTour,
        restartTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

// Custom hook for easy context access
export const useTour = () => useContext(TourContext);

export default TourContext;