import { Tour } from '@/contexts/tours/tour-context';

/**
 * Initial onboarding tour for new users
 */
export const initialTour: Tour = {
  id: 'initial-tour',
  title: 'Welcome to Fundamenta',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Fundamenta, {userName}!',
      content: 'I\'m Fundi, your AI guide to a more confident life! I\'m here to show you around and help you get the most out of Fundamenta. Ready for a quick tour?',
      placement: 'right',
      showPrevButton: false,
    },
    {
      id: 'navigation',
      title: 'Easy Navigation',
      content: 'Use these navigation buttons to explore different areas of Fundamenta - from finances to fitness to life skills!',
      targetSelector: 'header',
      placement: 'bottom',
      highlightSize: 'md',
    },
    {
      id: 'cards',
      title: 'Featured Skills',
      content: 'These cards are your gateway to different skills and resources. Click any card to start exploring that area.',
      targetSelector: '.grid',
      placement: 'top',
      highlightSize: 'lg',
      fundiPosition: { x: 20, y: 300 },
    },
    {
      id: 'fundi-avatar',
      title: 'Meet Your Guide',
      content: 'That\'s me! Click on my avatar anytime you need help, have questions, or just want to chat. I\'m here to help you on your journey!',
      targetSelector: '[data-fundi-robot]',
      placement: 'left',
      highlightSize: 'sm',
      fundiPosition: { x: 250, y: 30 },
    },
    {
      id: 'conclusion',
      title: 'You\'re All Set, {userName}!',
      content: 'That\'s it! You\'re ready to start building life skills with Fundamenta. Remember, I\'m always here if you need me. Let\'s make life more LIFEABLE together!',
      placement: 'center',
      showSkipButton: false,
      fundiPosition: { x: 100, y: 200 },
    }
  ]
};

/**
 * Finance section tour
 */
export const financeTour: Tour = {
  id: 'finance-tour',
  title: 'Finance Features',
  requiredPath: '/finance',
  steps: [
    {
      id: 'finance-welcome',
      title: 'Welcome to Financial Literacy',
      content: 'Here you\'ll learn essential financial skills like budgeting, saving, and planning for your future.',
      placement: 'right',
      showPrevButton: false,
    },
    {
      id: 'finance-tools',
      title: 'Powerful Financial Tools',
      content: 'Explore our calculators, planners, and educational resources to build your financial knowledge.',
      targetSelector: '.finance-tools',
      placement: 'bottom',
      highlightSize: 'md',
    },
    {
      id: 'finance-conclusion',
      title: 'Start Your Financial Journey',
      content: 'Financial literacy is a journey, not a destination. Take it step by step and watch your confidence grow!',
      placement: 'center',
      showSkipButton: false,
    }
  ]
};

/**
 * Career section tour
 */
export const careerTour: Tour = {
  id: 'career-tour',
  title: 'Career Development',
  requiredPath: '/career',
  steps: [
    {
      id: 'career-welcome',
      title: 'Career Development Center',
      content: 'Here you\'ll find tools to build your resume, practice interviews, and explore career paths.',
      placement: 'right',
      showPrevButton: false,
    },
    {
      id: 'career-resume',
      title: 'Resume Builder',
      content: 'Create a professional resume with our guided builder - no experience needed!',
      targetSelector: '.resume-section',
      placement: 'bottom',
      highlightSize: 'md',
    },
    {
      id: 'career-conclusion',
      title: 'Ready for Your Job Search',
      content: 'Use these tools to prepare for your career journey. I\'m here to help with any questions along the way!',
      placement: 'center',
      showSkipButton: false,
    }
  ]
};

/**
 * Collection of all available tours 
 */
export const availableTours: Tour[] = [
  initialTour,
  financeTour,
  careerTour,
];

export default availableTours;