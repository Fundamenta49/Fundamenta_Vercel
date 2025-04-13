import { useAuth } from '@/lib/auth-context';

export interface TourStep {
  title: string;
  content: string;
  target: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlightColor?: string;
  showFundiAnimation?: boolean;
  animationType?: 'wave' | 'jump' | 'spin' | 'dance' | 'nod' | 'point';
}

export const useTourSteps = () => {
  const { user } = useAuth();
  // Since the user type might not have firstName or displayName, we'll use a fallback
  const firstName = user?.name?.split(' ')[0] || 'friend';
  
  const tourSteps: TourStep[] = [
    // Step 1: Welcome greeting with user's first name
    {
      title: `Welcome, ${firstName}! 👋`,
      content: `I'm Fundi, your personal AI guide to essential life skills! I'm excited to show you around our platform and help you get started on your journey to personal growth.`,
      target: 'body',
      placement: 'center',
      showFundiAnimation: true,
      animationType: 'wave'
    },
    
    // Step 2: Introduce Fundi with fun animations
    {
      title: 'Let Me Show You Around!',
      content: `I'll be with you throughout your Fundamenta journey, offering personalized guidance, answering questions, and cheering you on as you learn new skills. Let's explore what we can do together!`,
      target: 'body',
      placement: 'center',
      showFundiAnimation: true,
      animationType: 'dance'
    },
    
    // Step 3: Life Skills card
    {
      title: 'Life Skills',
      content: `Want to master essential everyday skills? This section offers courses on everything from vehicle maintenance to cooking basics. Think of it as your go-to resource for practical knowledge!`,
      target: 'card-life-skills',
      placement: 'bottom',
      highlightColor: '#f97316', // orange
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 4: Financial Literacy card
    {
      title: 'Financial Literacy',
      content: `Need help managing money? Dive into budgeting, savings strategies, and financial planning. I'll help you build financial confidence, one step at a time!`,
      target: 'card-financial-literacy',
      placement: 'bottom',
      highlightColor: '#22c55e', // green
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 5: Career Development card
    {
      title: 'Career Development',
      content: `Ready to level up professionally? Get help with resume building, interview prep, and career planning. Your dream job is waiting!`,
      target: 'card-career-development',
      placement: 'bottom',
      highlightColor: '#3b82f6', // blue
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 6: Wellness & Nutrition card
    {
      title: 'Wellness & Nutrition',
      content: `Take care of your mental and physical health with meditation guides, nutrition advice, and wellness tips. Remember, a healthy mind lives in a healthy body!`,
      target: 'card-wellness-nutrition',
      placement: 'bottom',
      highlightColor: '#a855f7', // purple
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 7: Show smart calendar in sidebar
    {
      title: 'Smart Calendar',
      content: `Don't miss our Smart Calendar feature in the sidebar! It helps you organize your learning journey and keeps track of your progress. Stay organized, stay motivated!`,
      target: 'nav-smart-calendar',
      placement: 'right',
      highlightColor: '#6366f1', // indigo
      showFundiAnimation: true,
      animationType: 'point'
    },
    
    // Step 8: Show arcade in sidebar
    {
      title: 'Fundamenta Arcade',
      content: `Need a brain break? Check out our Arcade section! Learning through play is one of the best ways to reinforce new skills. Plus, it's just plain fun!`,
      target: 'nav-arcade',
      placement: 'right',
      highlightColor: '#f59e0b', // amber
      showFundiAnimation: true,
      animationType: 'jump'
    },
    
    // Step 9: Closing with user's name again
    {
      title: `You're All Set, ${firstName}!`,
      content: `I'm so excited to be your guide on this journey! Remember, I'm always here to help - just look for me in the corner of your screen. Before you go, I'd like to share our founder's vision for Fundamenta.`,
      target: 'body',
      placement: 'center',
      showFundiAnimation: true,
      animationType: 'wave'
    },
    
    // Step 10: Why Fundamenta letter from the CEO
    {
      title: 'Why Fundamenta?',
      content: `At Fundamenta, we believe life skills shouldn't be a mystery. Our mission is to empower you with practical knowledge that traditional education often misses. From financial literacy to everyday tasks, we're here to help you build confidence through personalized learning. Thank you for joining us on this journey!`,
      target: 'body',
      placement: 'center',
      highlightColor: '#1C3D5A',
      showFundiAnimation: false
    }
  ];
  
  return tourSteps;
};