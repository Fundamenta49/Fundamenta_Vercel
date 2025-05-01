import { Tour } from '@/lib/onboarding-context';

/**
 * Initial onboarding tour for new users
 */
export const initialTour: Tour = {
  id: 'initial-tour',
  title: 'Welcome to Fundamenta',
  steps: [
    {
      targetSelector: 'header',
      title: 'Welcome to Fundamenta!',
      content: 'Pssst… you\'re officially one of the first humans to ever enter the world of Fundamenta. I\'ve got secrets to show you—and awkward life wins to celebrate. Wanna go on a mini quest? I\'m Fundi, and I\'m here to make life LIFEABLE!!!',
      placement: 'bottom',
    },
    {
      targetSelector: '.main-navigation',
      title: 'Easy Navigation',
      content: 'Use these navigation buttons to move between different sections of the app.',
      placement: 'bottom',
    },
    {
      targetSelector: '.card-grid',
      title: 'Explore Features',
      content: 'Each card represents a different feature. Click on any card to explore that feature in more detail.',
      placement: 'top',
    },
    // Calendar tour step removed
    {
      targetSelector: '.fundi-button',
      title: 'Meet Fundi',
      content: 'This is Fundi, your personal AI assistant. You can find Fundi in the bottom-right corner of your screen. Click here anytime you need help or have questions about the app.',
      placement: 'left',
    },
    {
      targetSelector: '.fundi-button',
      title: 'Double-Click Feature',
      content: 'Pro tip: You can double-click on Fundi to minimize or maximize him! This keeps him out of the way when you need more screen space, and brings him back when you need help.',
      placement: 'left',
    },
    {
      title: 'Let\'s Get Started!',
      content: 'That\'s it for the quick tour! Feel free to explore the app, and remember Fundi is always here to help.',
      placement: 'center',
    }
  ]
};

/**
 * Finance section tour
 */
export const financeTour: Tour = {
  id: 'finance-tour',
  title: 'Finance Section Guide',
  steps: [
    {
      targetSelector: '.finance-header',
      title: 'Financial Skills',
      content: 'Welcome to the Finance section! Here you can learn essential financial literacy skills.',
      placement: 'bottom',
    },
    {
      targetSelector: '.budget-card',
      title: 'Budget Tool',
      content: 'Create and manage your budget to track income and expenses.',
      placement: 'right',
    },
    {
      targetSelector: '.credit-card',
      title: 'Credit Education',
      content: 'Learn about credit scores and how to build good credit history.',
      placement: 'right',
    },
    {
      targetSelector: '.mortgage-card',
      title: 'Mortgage Calculator',
      content: 'Estimate mortgage payments and understand homebuying costs.',
      placement: 'right',
    },
    {
      targetSelector: '.finance-ai-card',
      title: 'Financial Coach',
      content: 'Get personalized financial advice from your AI financial coach.',
      placement: 'left',
    }
  ]
};

/**
 * Career section tour
 */
export const careerTour: Tour = {
  id: 'career-tour',
  title: 'Career Development Guide',
  steps: [
    {
      targetSelector: '.career-header',
      title: 'Career Development',
      content: 'Welcome to the Career section! Build your professional skills and prepare for job success.',
      placement: 'bottom',
    },
    {
      targetSelector: '.resume-card',
      title: 'Resume Builder',
      content: 'Create and optimize your resume with our AI-powered tools.',
      placement: 'right',
    },
    {
      targetSelector: '.jobs-card',
      title: 'Job Search',
      content: 'Find job opportunities and salary insights tailored to your skills.',
      placement: 'right',
    },
    {
      targetSelector: '.interview-card',
      title: 'Interview Prep',
      content: 'Practice interview questions and get feedback to improve your performance.',
      placement: 'right',
    },
    {
      targetSelector: '.career-ai-card',
      title: 'Career Mentor',
      content: 'Your AI career mentor can provide personalized career guidance and advice.',
      placement: 'left',
    }
  ]
};

/**
 * Wellness section tour
 */
export const wellnessTour: Tour = {
  id: 'wellness-tour',
  title: 'Wellness Section Guide',
  steps: [
    {
      targetSelector: '.wellness-header',
      title: 'Wellness Center',
      content: 'Welcome to the Wellness section! Take care of your mental and physical health.',
      placement: 'bottom',
    },
    {
      targetSelector: '.nutrition-card',
      title: 'Nutrition Assessment',
      content: 'Track your nutrition habits and get personalized dietary recommendations.',
      placement: 'right',
    },
    {
      targetSelector: '.mental-health-card',
      title: 'Mental Health Tools',
      content: 'Access tools for managing stress, anxiety, and improving mental wellness.',
      placement: 'right',
    },
    {
      targetSelector: '.journal-card',
      title: 'Wellness Journal',
      content: 'Record your thoughts and track your mood with smart insights from our AI.',
      placement: 'right',
    },
    {
      targetSelector: '.wellness-ai-card',
      title: 'Wellness Guide',
      content: 'Your AI wellness guide can provide personalized health recommendations.',
      placement: 'left',
    }
  ]
};

/**
 * Learning section tour
 */
export const learningTour: Tour = {
  id: 'learning-tour',
  title: 'Learning Section Guide',
  steps: [
    {
      targetSelector: '.learning-header',
      title: 'Learning Center',
      content: 'Welcome to the Learning section! Develop new skills and knowledge.',
      placement: 'bottom',
    },
    {
      targetSelector: '.courses-card',
      title: 'Life Skills Courses',
      content: 'Explore interactive courses on essential life skills topics.',
      placement: 'right',
    },
    {
      targetSelector: '.quiz-card',
      title: 'Knowledge Quizzes',
      content: 'Test your knowledge with quizzes on different topics.',
      placement: 'right',
    },
    {
      targetSelector: '.learning-ai-card',
      title: 'Learning Facilitator',
      content: 'Your AI learning facilitator can help explain concepts and suggest learning resources.',
      placement: 'left',
    }
  ]
};

/**
 * Active section tour
 */
export const activeTour: Tour = {
  id: 'active-tour',
  title: 'Active Living Guide',
  steps: [
    {
      targetSelector: '.active-header',
      title: 'Active Living',
      content: 'Welcome to the Active section! Develop fitness and physical well-being.',
      placement: 'bottom',
    },
    {
      targetSelector: '.workout-card',
      title: 'Workout Plans',
      content: 'Discover workout routines tailored to your fitness level and goals.',
      placement: 'right',
    },
    {
      targetSelector: '.tracking-card',
      title: 'Activity Tracking',
      content: 'Track your physical activity and monitor your progress over time.',
      placement: 'right',
    },
    {
      targetSelector: '.active-ai-card',
      title: 'Fitness Coach',
      content: 'Your AI fitness coach can provide personalized exercise recommendations.',
      placement: 'left',
    }
  ]
};

/**
 * Emergency section tour
 */
export const emergencyTour: Tour = {
  id: 'emergency-tour',
  title: 'Emergency Preparedness Guide',
  steps: [
    {
      targetSelector: '.emergency-header',
      title: 'Emergency Preparedness',
      content: 'Welcome to the Emergency section! Learn how to prepare for and respond to emergencies.',
      placement: 'bottom',
    },
    {
      targetSelector: '.first-aid-card',
      title: 'First Aid Guide',
      content: 'Access quick first aid instructions for common emergencies.',
      placement: 'right',
    },
    {
      targetSelector: '.safety-card',
      title: 'Safety Planning',
      content: 'Create and store emergency plans for different scenarios.',
      placement: 'right',
    },
    {
      targetSelector: '.resources-card',
      title: 'Emergency Resources',
      content: 'Find local emergency services and resources in your area.',
      placement: 'right',
    },
    {
      targetSelector: '.emergency-ai-card',
      title: 'Emergency Assistant',
      content: 'Your AI emergency assistant can provide guidance during urgent situations.',
      placement: 'left',
    }
  ]
};

// Calendar tour removed

// Export all tours in a single object for easy access
export const tours: Record<string, Tour> = {
  'initial-tour': initialTour,
  'finance-tour': financeTour,
  'career-tour': careerTour,
  'wellness-tour': wellnessTour,
  'learning-tour': learningTour,
  'active-tour': activeTour,
  'emergency-tour': emergencyTour
  // calendar-tour removed
};