import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    content: 'These courses are designed to be practical and engaging. You can learn at your own pace with step-by-step guidance.',
    category: 'general',
    route: '/learning',
    highlightSelector: '.course-list',
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
    content: 'Try our interactive budgeting tools and calculators to plan your finances better.',
    category: 'finance',
    route: '/finance',
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
    content: 'Track your progress with our easy-to-use fitness trackers and get personalized recommendations.',
    category: 'fitness',
    route: '/active',
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
  const [, setLocation] = useLocation();
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // Import auth context to check authentication status and get user info
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  
  // Tour control functions
  const startTour = () => {
    setIsTourActive(true);
    setCurrentStepIndex(0);
    // Add tour-active class to body when tour starts
    document.body.classList.add('tour-active');
  };

  const endTour = () => {
    setIsTourActive(false);
    localStorage.setItem('hasSeenTour', 'true');
    setHasSeenTour(true);
    // Remove tour-active class from body when tour ends
    document.body.classList.remove('tour-active');
    // Reset location to home
    setLocation('/');
  };

  const nextStep = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < tourSteps.length) {
      setCurrentStepIndex(index);
    }
  };

  const skipTour = () => {
    if (window.confirm('Are you sure you want to skip the tour? You can always restart it later.')) {
      endTour();
    }
  };

  const restartTour = () => {
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
  };

  // Check if the user has seen the tour before and load user name,
  // but only after authentication is checked and user is authenticated
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
      // If user hasn't seen tour, auto-start it for authenticated users or visitors
      if (isAuthenticated || user) {
        // Small delay to ensure everything is loaded
        setTimeout(() => {
          startTour();
        }, 500);
      }
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

  // Get current step data
  const currentStep = isTourActive && currentStepIndex < tourSteps.length 
    ? tourSteps[currentStepIndex] 
    : null;

  // Navigate to the correct route when step changes
  useEffect(() => {
    if (isTourActive && currentStep?.route) {
      setLocation(currentStep.route);
    }
  }, [currentStepIndex, isTourActive, currentStep, setLocation]);
  
  // Clean up when component unmounts to ensure tour-active class is removed
  useEffect(() => {
    return () => {
      document.body.classList.remove('tour-active');
    };
  }, []);

  // Highlight the relevant element if specified
  useEffect(() => {
    // Clean up any existing highlights first to avoid stale highlights
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
    
    // Now we can highlight elements for any step, as the tour uses speech bubbles instead of dialogs
    if (isTourActive && currentStep && typeof currentStep.highlightSelector === 'string') {
      // Small delay to ensure the element is rendered
      const timeout = setTimeout(() => {
        const selector = currentStep.highlightSelector as string;
        const element = document.querySelector(selector);
        
        if (element) {
          // Check if element is visible and exists in the DOM
          if (element.getBoundingClientRect().height > 0) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Explicitly check that we're not highlighting a dialog
            if (!element.closest('[role="dialog"]') && 
                !element.closest('[role="alertdialog"]') && 
                !element.closest('.DialogContent') && 
                !element.closest('.DialogOverlay')) {
              element.classList.add('tour-highlight');
            }
          }
        }
      }, 300);

      return () => {
        clearTimeout(timeout);
        // Remove highlight from all elements on cleanup
        document.querySelectorAll('.tour-highlight').forEach(el => {
          el.classList.remove('tour-highlight');
        });
      };
    }
  }, [currentStepIndex, isTourActive, currentStep]);

  // Process template strings in content to include user name
  const processStepContent = (content: string) => {
    // If userName is empty, show just the message without the placeholder
    if (!userName) {
      return content.replace('{userName} ', '').replace(' {userName}', '').replace('{userName}', '');
    }
    // Otherwise, use their name
    return content.replace('{userName}', userName);
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
