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
  // Special flags for vehicle maintenance tour fix
  skipScroll?: boolean;
  fixedPosition?: { x: number, y: number };
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
  {
    id: 'home-overview',
    title: 'Main Dashboard',
    content: 'This is your main dashboard, {userName}. From here, you can access all the different areas of Fundamenta to help you develop essential life skills.',
    category: 'general',
    route: '/',
  },
  
  // Life Skills section
  {
    id: 'life-skills',
    title: 'Life Skills',
    content: 'Let\'s explore the Life Skills section, {userName}. Here you\'ll find practical courses on everything from cooking to home maintenance.',
    category: 'general',
    route: '/learning',
  },
  {
    id: 'life-skills-courses',
    title: 'Interactive Courses',
    content: 'These courses are designed to be practical and engaging. You can learn at your own pace with step-by-step guidance. Let\'s look at the Vehicle Maintenance course as an example.',
    category: 'general',
    route: '/learning/courses/vehicle-maintenance',
    highlightSelector: '.course-content',
    skipScroll: true, // Prevent automatic scrolling for this step
    fixedPosition: { x: 166, y: 120 }, // Keep Fundi at the top of the page
  },
  
  // Financial Literacy section
  {
    id: 'financial-literacy',
    title: 'Financial Literacy',
    content: '{userName}, managing money is an essential life skill. In this section, you\'ll learn budgeting, savings strategies, and smart financial planning.',
    category: 'finance',
    route: '/finance',
  },
  {
    id: 'finance-tools',
    title: 'Financial Tools',
    content: 'Try our interactive budgeting tools and calculators to plan your finances better. Our mortgage calculator can help you understand home buying costs.',
    category: 'finance',
    route: '/finance/mortgage',
    highlightSelector: '.finance-tools',
  },
  
  // Career Development
  {
    id: 'career-development',
    title: 'Career Development',
    content: 'Looking to advance your career, {userName}? This section helps you with resume building, interview preparation, and job search strategies.',
    category: 'career',
    route: '/career',
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    content: 'Our AI-powered resume builder will help you create professional resumes tailored to specific job listings.',
    category: 'career',
    route: '/career',
    highlightSelector: '.resume-builder',
  },
  
  // Wellness & Nutrition
  {
    id: 'wellness',
    title: 'Wellness & Nutrition',
    content: '{userName}, your mental and physical health are connected. This section offers resources for both.',
    category: 'wellness',
    route: '/wellness',
  },
  {
    id: 'meditation-guides',
    title: 'Meditation Guides',
    content: 'Try our guided meditation sessions designed to reduce stress and improve focus.',
    category: 'wellness',
    route: '/wellness',
    highlightSelector: '.meditation-guide',
  },
  
  // Active You
  {
    id: 'active-you',
    title: 'Active You',
    content: 'Ready to get moving, {userName}? This section provides personalized workout plans and fitness tracking.',
    category: 'fitness',
    route: '/active',
  },
  {
    id: 'fitness-tracking',
    title: 'Fitness Tracking',
    content: 'Track your progress with our easy-to-use fitness trackers and get personalized recommendations. Let\'s check out the yoga features too!',
    category: 'fitness',
    route: '/yoga-progression',
    highlightSelector: '.fitness-tracker',
  },
  
  // Emergency Guidance
  {
    id: 'emergency',
    title: 'Emergency Guidance',
    content: 'I hope you never need this, {userName}, but just in case - this section provides step-by-step guidance for various emergency situations.',
    category: 'general',
    route: '/emergency',
  },
  {
    id: 'emergency-guides',
    title: 'Emergency Guides',
    content: 'Access quick, clear instructions for first aid, natural disasters, and other emergencies.',
    category: 'general',
    route: '/emergency',
    highlightSelector: '.emergency-guides',
  },
  
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
    console.log("EMERGENCY FIX: Restarting tour");
    
    // Remove all highlights first to ensure a clean state
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Always ensure tour-active class is present
    document.body.classList.add('tour-active');
    
    // Preserve userName if it exists
    const userNameToUse = userName || '';
    
    // Clear stored tour state
    localStorage.removeItem('hasSeenTour');
    setHasSeenTour(false);
    
    // Do NOT reset userName if it's already set - this helps with tour continuity
    // But do save it to localStorage for persistence
    if (userNameToUse) {
      localStorage.setItem('tourUserName', userNameToUse);
    } 
    
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
    
    // Always navigate to home page to ensure a clean start
    console.log("EMERGENCY FIX: Navigating to home before starting tour");
    
    // Navigate to homepage
    setLocation('/');
    
    // Use a slightly longer delay to ensure navigation completes
    setTimeout(() => {
      // Set DOM attributes as fallback storage (emergency feature)
      document.body.setAttribute('data-tour-active', 'true');
      document.body.setAttribute('data-tour-restarted', 'true');
      
      startTour();
    }, 300);
  }, [setLocation, startTour, userName]);

  // Get current location first so it can be used in other hooks
  const [currentLocation] = useLocation();
  
  // Get current step data
  const currentStep = isTourActive && currentStepIndex < tourSteps.length 
    ? tourSteps[currentStepIndex] 
    : null;

  // Thoroughly enhanced navigation effect for smooth page transitions during tour
  useEffect(() => {
    if (!isTourActive || !currentStep || !currentStep.route) return;

    // Check if we're already on the correct route or page
    const isOnCorrectRoute = currentLocation === currentStep.route;
    const isAlreadyNavigated = currentStep.route === lastNavigatedRoute;

    // Only navigate if we need to change routes
    if (!isOnCorrectRoute || !isAlreadyNavigated) {
      console.log(`TOUR NAVIGATION: Moving to ${currentStep.route} for step ${currentStepIndex}`);
      
      // Set the flag first before navigation
      setLastNavigatedRoute(currentStep.route);
      
      // Clear existing highlights before navigation
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      
      // Add a forced delay to ensure stable navigation and allow speech bubble to show first
      setTimeout(() => {
        if (currentStep && currentStep.route) {
          // Type assertion for TypeScript
          const route = currentStep.route as string;
          console.log(`TOUR NAVIGATION: Navigating to ${route}`);
          
          // Store the current route in localStorage and DOM for persistence
          localStorage.setItem('lastTourRoute', route);
          document.body.setAttribute('data-tour-route', route);
          
          // Keep a backup of the current step
          document.body.setAttribute('data-tour-current-step', String(currentStepIndex));
          
          // Flag for special handling - for detecting forced navigation
          document.body.setAttribute('data-tour-navigating', 'true');
          
          // CRITICAL: Force navigation even if we think we're already there
          // This handles cases where the route is correct but component didn't fully load
          setLocation(route);
          
          // Extended delay for large pages to load
          const loadDelay = route.includes('/learning/courses/') ? 800 : 
                          route.includes('/finance/mortgage') ? 800 : 
                          route.includes('/yoga') ? 800 : 500;
          
          // After navigation, check for elements to highlight after the page loads
          setTimeout(() => {
            // Reset the navigation flag
            document.body.removeAttribute('data-tour-navigating');
            
            // Verify we're on the correct page after navigation
            try {
              // If there's a specific element to highlight, focus on it
              if (currentStep.highlightSelector) {
                // Clean up any existing highlights again (safety check)
                document.querySelectorAll('.tour-highlight').forEach(el => {
                  el.classList.remove('tour-highlight');
                });
                
                // Find and highlight the element
                const elementToHighlight = document.querySelector(currentStep.highlightSelector as string);
                if (elementToHighlight) {
                  console.log(`TOUR HIGHLIGHT: Found element matching ${currentStep.highlightSelector}`);
                  elementToHighlight.classList.add('tour-highlight');
                  
                  // Scroll the element into view with smooth behavior
                  elementToHighlight.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                  });
                } else {
                  console.log(`TOUR HIGHLIGHT: Could not find element matching ${currentStep.highlightSelector} - will try again`);
                  
                  // Try one more time with a longer delay
                  setTimeout(() => {
                    const retryElement = document.querySelector(currentStep.highlightSelector as string);
                    if (retryElement) {
                      retryElement.classList.add('tour-highlight');
                      retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }, 800);
                }
              }
            } catch (e) {
              console.error('Error highlighting element:', e);
            }
          }, loadDelay); // Adaptive delay for page rendering to complete
        }
      }, 600); // Increased delay for better user experience
    }
  }, [isTourActive, currentStep, currentStepIndex, lastNavigatedRoute, setLocation, currentLocation]);
  
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