import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';

// Types for our tour steps
export interface TourStep {
  id: string;
  title: string;
  content: string;
  image?: string;
  route?: string;
  highlightSelector?: string;
  category?: string;
}

export interface TourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: TourStep | null;
  userName: string;
  setUserName: (name: string) => void;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  skipTour: () => void;
  restartTour: () => void;
}

// Create the context with default values
const TourContext = createContext<TourContextType>({
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

// Define the tour steps
const tourSteps: TourStep[] = [
  // Welcome and intro
  {
    id: 'welcome',
    title: 'Welcome to Fundamenta',
    content: 'Pssst.... Welcome {userName}!! You\'re officially one of the first humans to ever enter the world of Fundamenta. I\'ve got secrets to show you—and awkward life wins to celebrate. Wanna go on a mini quest? I\'m Fundi, and I\'m here to make life LIFEABLE!!!',
    category: 'general',
    route: '/',
  },
  {
    id: 'fundi-intro',
    title: 'Meet Fundi',
    content: '{userName}, I\'m your personal AI assistant. You can drag me anywhere on the screen, and click on me whenever you need help or want to chat!',
    category: 'general',
    route: '/',
    highlightSelector: '.robot-fundi',
  },
  // Rest of tour steps omitted for brevity
  // Conclusion
  {
    id: 'conclusion',
    title: 'All Set!',
    content: 'Well done, {userName}! You\'ve completed the tour. Remember, I\'m always here to help - just click on me anytime you need assistance. Is there any particular area you\'d like to explore first?',
    category: 'general',
    route: '/',
  },
];

// Create the provider component
export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Location hook for navigation
  const [, setLocation] = useLocation();
  
  // State for tour
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [hasSeenTour, setHasSeenTour] = useState(false);
  
  // EMERGENCY FIX: Add navigation state control
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastNavigatedRoute, setLastNavigatedRoute] = useState<string | null>(null);

  // Import auth context to check authentication status and get user info
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  
  // Tour control functions
  const startTour = useCallback(() => {
    setIsTourActive(true);
    setCurrentStepIndex(0);
    // Add tour-active class to body when tour starts
    document.body.classList.add('tour-active');
  }, []);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    localStorage.setItem('hasSeenTour', 'true');
    setHasSeenTour(true);
    // Remove tour-active class from body when tour ends
    document.body.classList.remove('tour-active');
    // Reset location to home
    setLocation('/');
  }, [setLocation]);

  // EMERGENCY FIX: Completely reworked nextStep function to ensure smooth navigation
  const nextStep = useCallback(() => {
    if (currentStepIndex < tourSteps.length - 1) {
      // Prevent rapid double-clicks
      if (isNavigating) {
        console.log("EMERGENCY FIX: Navigation already in progress, ignoring request");
        return;
      }
      
      // Set navigating flag to prevent multiple calls
      setIsNavigating(true);
      
      console.log(`EMERGENCY FIX: Advancing tour from step ${currentStepIndex} to ${currentStepIndex + 1}`);
      
      // Use setTimeout to avoid race conditions
      setTimeout(() => {
        // Force a direct step change with a functional update
        setCurrentStepIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          
          // Store the step in a data attribute on body
          document.body.setAttribute('data-tour-step', String(newIndex));
          
          console.log(`EMERGENCY FIX: Setting current step to ${newIndex}`);
          return newIndex; 
        });
        
        // Release the navigation lock after a longer delay
        setTimeout(() => {
          setIsNavigating(false);
        }, 800);
      }, 100);
    } else {
      console.log('Tour complete, ending tour');
      endTour();
    }
  }, [currentStepIndex, isNavigating, endTour, tourSteps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      console.log(`Going back from step ${currentStepIndex} to ${currentStepIndex - 1}`);
      // Use a functional update to ensure we're working with the latest state
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    } else {
      console.log('Already at first step, cannot go back');
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < tourSteps.length) {
      // Set the index directly since it's an explicit value
      setCurrentStepIndex(index);
    }
  }, [tourSteps.length]);

  const skipTour = useCallback(() => {
    if (window.confirm('Are you sure you want to skip the tour? You can always restart it later.')) {
      endTour();
    }
  }, [endTour]);

  const restartTour = useCallback(() => {
    // Remove all highlights first to ensure a clean state
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Remove tour-active class from body in case tour is still active
    document.body.classList.remove('tour-active');
    
    // Clear any stored tour state and user name
    localStorage.removeItem('hasSeenTour');
    localStorage.removeItem('tourUserName');
    setHasSeenTour(false);
    setUserName('');
    
    // Also reset any stored chat messages
    try {
      // Reset welcome message in chat interface
      const chatStorage = localStorage.getItem('fundiChatMessages');
      if (chatStorage) {
        localStorage.removeItem('fundiChatMessages');
      }
    } catch (e) {
      console.error('Error clearing chat history:', e);
    }
    
    // Dispatch a custom event to notify components of tour reset
    window.dispatchEvent(new CustomEvent('tour-reset'));
    
    // Ensure we go back to the home page
    setLocation('/');
    
    // Use a small delay to ensure navigation completes before starting the tour
    setTimeout(() => {
      startTour();
    }, 100);
  }, [setLocation, startTour]);

  // Get current step data
  const currentStep = isTourActive && currentStepIndex < tourSteps.length 
    ? tourSteps[currentStepIndex] 
    : null;

  // Get current location
  const [currentLocation] = useLocation();

  // EMERGENCY FIX: Simplified navigation effect to prevent infinite loops
  useEffect(() => {
    if (!isTourActive || !currentStep || !currentStep.route) return;

    // Only navigate if we're on a different route or haven't navigated to this route yet
    if (currentStep.route !== lastNavigatedRoute) {
      console.log(`EMERGENCY FIX: Navigation to ${currentStep.route} for step ${currentStepIndex}`);
      
      // Set the flag first before navigation
      setLastNavigatedRoute(currentStep.route);
      
      // Add a forced delay to ensure stable navigation
      setTimeout(() => {
        if (currentStep && currentStep.route) {
          // Type assertion for TypeScript
          const route = currentStep.route as string;
          console.log(`EMERGENCY FIX: Actually navigating to ${route}`);
          setLocation(route);
          
          // Store location in data attribute
          document.body.setAttribute('data-tour-route', route);
        }
      }, 100);
    }
  }, [isTourActive, currentStep, currentStepIndex, lastNavigatedRoute, setLocation]);
  
  // Check if the user has seen the tour before and load user name,
  // but only after authentication is checked
  useEffect(() => {
    // Wait until auth is no longer loading
    if (authLoading) {
      return; // Exit early if auth is still loading
    }
    
    // Check if tour has been seen
    const tourSeen = localStorage.getItem('hasSeenTour');
    if (tourSeen) {
      setHasSeenTour(true);
    } else {
      // If user hasn't seen tour, auto-start it for all users
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        startTour();
      }, 500);
    }
    
    // First try to use the name from the authenticated user profile
    if (user && user.name) {
      setUserName(user.name);
      localStorage.setItem('tourUserName', user.name);
    } else {
      // Fall back to checking if user name is stored in localStorage
      const savedUserName = localStorage.getItem('tourUserName');
      if (savedUserName) {
        setUserName(savedUserName);
      } else if (isAuthenticated && user && user.email) {
        // If we have an authenticated user with email but no name, use email username
        const usernameFromEmail = user.email.split('@')[0];
        setUserName(usernameFromEmail);
        localStorage.setItem('tourUserName', usernameFromEmail);
      } else {
        // Set a default greeting (this will get replaced with username when available)
        setUserName('');
      }
    }
  }, [isAuthenticated, authLoading, user, startTour]);
  
  // Save user name to localStorage when it changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem('tourUserName', userName);
    }
  }, [userName]);

  // Clean up when component unmounts to ensure tour-active class is removed
  useEffect(() => {
    return () => {
      document.body.classList.remove('tour-active');
    };
  }, []);

  // Process template strings in content to include user name
  const processStepContent = (content: string) => {
    // If userName is empty, show just the message without the placeholder
    if (!userName) {
      return content
        .replace('{userName}!!', '!')
        .replace('{userName},', '')
        .replace('{userName} ', '')
        .replace(' {userName}', '')
        .replace('{userName}', '');
    }
    // Otherwise, use their name
    return content.replace(/\{userName\}/g, userName);
  };

  // Process current step to include user name
  const processedCurrentStep = currentStep
    ? {
        ...currentStep,
        content: processStepContent(currentStep.content),
        title: processStepContent(currentStep.title),
        // With the new speech bubble tour, we keep all highlightSelectors as is
        highlightSelector: currentStep.highlightSelector
      }
    : null;

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        totalSteps: tourSteps.length,
        currentStep: processedCurrentStep,
        userName,
        setUserName,
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

// Custom hook for easy context usage
export const useTour = () => useContext(TourContext);

export default TourContext;