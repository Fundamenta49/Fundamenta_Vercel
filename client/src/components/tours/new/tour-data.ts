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
      title: `Hey there, friend! 👋`,
      content: "I'm Fundi, your AI sidekick for all things life skills! I've got personality, wit, and a wealth of knowledge to help you navigate this adventure. Let me show you around!",
      placement: 'center',
      showPrevButton: false,
      fundiPosition: { x: 100, y: 100 },
    },
    {
      id: 'fundi-intro',
      title: 'Nice to Meet You!',
      content: "I'm programmed to be friendly, helpful, and occasionally funny. Think of me as your personal life coach, but with better jokes and no hourly rate!",
      placement: 'center',
      targetSelector: '[data-fundi-robot]',
      highlightSize: 'md',
      fundiPosition: { x: 150, y: 100 },
    },
    {
      id: 'life-skills',
      title: 'Life Skills & Learning',
      content: "Learning essential life skills doesn't have to be boring! From cooking basics to home repairs, we've got practical guides to help you adult like a pro.",
      targetSelector: '[data-tour-id="card-life-skills"]',
      placement: 'right',
      highlightSize: 'md',
      fundiPosition: { x: 20, y: 300 },
    },
    {
      id: 'finance',
      title: 'Financial Literacy',
      content: "Money matters can be confusing, but I'm here to demystify them! Budgeting, saving, investing – we'll tackle them together without the financial jargon.",
      targetSelector: '[data-tour-id="card-financial-literacy"]',
      placement: 'right',
      highlightSize: 'md',
      fundiPosition: { x: 20, y: 350 },
    },
    {
      id: 'career',
      title: 'Career Development',
      content: "Looking to level up professionally? I'll help you craft killer resumes, ace those interviews, and navigate your career path with confidence!",
      targetSelector: '[data-tour-id="card-career-development"]',
      placement: 'right',
      highlightSize: 'md',
      fundiPosition: { x: 20, y: 400 },
    },
    {
      id: 'wellness',
      title: 'Wellness & Nutrition',
      content: "Your physical and mental wellbeing matters! From meditation guides to nutrition tips, we've got tools to help you feel your best inside and out.",
      targetSelector: '[data-tour-id="card-wellness-nutrition"]',
      placement: 'left',
      highlightSize: 'md',
      fundiPosition: { x: 300, y: 300 },
    },
    {
      id: 'active',
      title: 'Active You',
      content: "Ready to get moving? Our fitness section has tailored workout plans, yoga sequences, and activity tracking to keep you motivated and healthy!",
      targetSelector: '[data-tour-id="card-active-you"]',
      placement: 'left',
      highlightSize: 'md',
      fundiPosition: { x: 300, y: 350 },
    },
    {
      id: 'emergency',
      title: 'Emergency Guidance',
      content: "When urgent situations arise, I've got your back with clear, step-by-step guidance to help you handle emergencies with confidence.",
      targetSelector: '[data-tour-id="card-emergency-guidance"]',
      placement: 'left',
      highlightSize: 'md',
      fundiPosition: { x: 300, y: 400 },
    },
    {
      id: 'calendar',
      title: 'Smart Calendar',
      content: "Stay organized with our Smart Calendar! Track appointments, set reminders, and never miss an important event again.",
      targetSelector: '[href="/calendar"]',
      placement: 'right',
      highlightSize: 'sm',
      fundiPosition: { x: 50, y: 150 },
    },
    {
      id: 'arcade',
      title: 'Fun & Games',
      content: "All work and no play? Not on my watch! Visit our Arcade for some brain-boosting games that make learning fun!",
      targetSelector: '[href="/arcade"]',
      placement: 'right',
      highlightSize: 'sm',
      fundiPosition: { x: 50, y: 200 },
    },
    {
      id: 'conclusion',
      title: `Ready to begin, friend?`,
      content: "You're all set to start your journey! Remember, I'm always here to chat, answer questions, or just brighten your day with a random fact. Let's make life more LIFEABLE together!",
      placement: 'center',
      showSkipButton: false,
      fundiPosition: { x: 150, y: 150 },
    },
    {
      id: 'founder-message',
      title: 'One Last Thing...',
      content: "Before you go, our founder has a special message about why we created Fundamenta. It's worth checking out!",
      placement: 'center',
      showSkipButton: false,
      fundiPosition: { x: 150, y: 150 },
      onComplete: () => {
        // Open the founder message dialog when this step completes
        // We'll trigger this via URL parameter
        window.history.replaceState({}, document.title, window.location.pathname + '?openFounderMessage=true');
        // Force a reload of the URL parameters
        window.dispatchEvent(new Event('popstate'));
      }
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