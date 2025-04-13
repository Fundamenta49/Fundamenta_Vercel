import { GuidedTour } from '@/contexts/guided-tour-context';

// Sample application tour
export const appTour: GuidedTour = {
  id: 'app-tour',
  name: 'Application Overview',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Fundamenta',
      content: 'Welcome to Fundamenta, {userName}! Let\'s take a quick tour to help you get started with the platform.',
      position: 'center',
      showSkipButton: true,
      showPrevButton: false,
      isIntroStep: true,
    },
    {
      id: 'navigation',
      title: 'Navigation',
      content: 'Use the sidebar to navigate between different sections of the application.',
      targetSelector: '.sidebar, nav.main-navigation',
      position: 'right',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'finance-section',
      title: 'Finance Tools',
      content: 'Our finance section offers tools like mortgage calculators, budget planners, and investment guidance.',
      path: '/finance',
      position: 'bottom',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'mortgage-calculator',
      title: 'Mortgage Calculator',
      content: 'The mortgage calculator helps you estimate monthly payments and understand closing costs.',
      targetSelector: '.mortgage-calculator, .calculator-card',
      path: '/finance',
      position: 'bottom',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'wellness-section',
      title: 'Wellness Center',
      content: 'The wellness section provides tools for your mental and physical health.',
      path: '/wellness',
      position: 'bottom',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'learning-center',
      title: 'Learning Resources',
      content: 'Find educational content and tutorials in the learning center.',
      path: '/learning',
      position: 'bottom',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'vehicle-maintenance',
      title: 'Vehicle Maintenance',
      content: 'Learn about vehicle maintenance and troubleshooting.',
      path: '/learning/courses/vehicle-maintenance',
      position: 'center',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'conclusion',
      title: 'Start Exploring',
      content: 'That\'s it, {userName}! You\'re now ready to explore Fundamenta and take control of your life skills. Enjoy your journey!',
      position: 'center',
      showSkipButton: false,
      showPrevButton: true,
      isOutroStep: true,
    },
  ],
};

// Additional tours can be defined here
export const financeTour: GuidedTour = {
  id: 'finance-tour',
  name: 'Finance Tools',
  steps: [
    {
      id: 'finance-welcome',
      title: 'Finance Tools',
      content: 'Welcome to the Finance section, {userName}! Let\'s explore the tools available to help manage your finances.',
      position: 'center',
      showSkipButton: true,
      showPrevButton: false,
      isIntroStep: true,
    },
    {
      id: 'budget-planner',
      title: 'Budget Planner',
      content: 'Create a personalized budget with our interactive budget planner.',
      targetSelector: '.budget-planner, .budget-card',
      position: 'bottom',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'mortgage-calculator',
      title: 'Mortgage Calculator',
      content: 'Calculate mortgage payments and understand closing costs.',
      targetSelector: '.mortgage-calculator, .calculator-card',
      position: 'bottom',
      showSkipButton: true,
      showPrevButton: true,
    },
    {
      id: 'finance-conclusion',
      title: 'Take Control of Your Finances',
      content: 'Now you know how to use our finance tools, {userName}. Start planning for your financial future!',
      position: 'center',
      showSkipButton: false,
      showPrevButton: true,
      isOutroStep: true,
    },
  ],
};

// Collection of all available tours
export const availableTours: GuidedTour[] = [
  appTour,
  financeTour,
];

// Export a function to programmatically trigger a tour
let tourStartCallback: ((tourId: string) => void) | null = null;

export const registerTourCallback = (callback: (tourId: string) => void) => {
  tourStartCallback = callback;
};

export const startTour = (tourId: string) => {
  if (tourStartCallback) {
    tourStartCallback(tourId);
  } else {
    console.warn('Tour callback not registered. Call registerTourCallback first.');
  }
};

// Event handler for external systems to trigger tours
export const setupTourEvents = () => {
  document.addEventListener('start-guided-tour', ((event: CustomEvent) => {
    const { tourId } = event.detail;
    startTour(tourId);
  }) as EventListener);
};

// Cleanup function to avoid memory leaks
export const cleanupTourEvents = () => {
  document.removeEventListener('start-guided-tour', (() => {}) as EventListener);
};