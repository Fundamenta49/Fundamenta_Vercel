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
      title: `Hey there, ${firstName}! 👋`,
      content: `I'm Fundi, your personal AI sidekick on this adventure! Think of me as your friendly guide to all those life skills nobody taught you in school. You can always find me in the top-right corner of your screen. Ready for a quick tour?`,
      target: 'body',
      placement: 'center',
      showFundiAnimation: true,
      animationType: 'wave'
    },
    
    // Step 2: Introduce Fundi with fun animations
    {
      title: 'Your Personal Life Coach!',
      content: `Whenever you need me, I'll pop up with personalized advice, answer your questions (even the embarrassing ones!), and cheer you on like your biggest fan. Just tap me in the corner of your screen anytime you need help!`,
      target: 'body',
      placement: 'center',
      showFundiAnimation: true,
      animationType: 'dance'
    },
    
    // Step 3: Introduce the double-click feature
    {
      title: 'Pro Tip: Double-Click Me!',
      content: `Need more screen space? Double-click on me to minimize me to a small icon! Double-click again when you need me back. It's a neat way to keep me around without taking up too much space while you explore.`,
      target: 'body',
      placement: 'center',
      showFundiAnimation: true,
      animationType: 'jump'
    },
    
    // Step 3: Life Skills card
    {
      title: 'Life Skills Academy',
      content: `Ever stared blankly at a car's engine or burned pasta? 😅 This is your no-judgment zone for mastering everyday essentials! From fixing stuff to cooking meals that don't set off smoke alarms, I've got your back!`,
      target: 'card-life-skills',
      placement: 'bottom',
      highlightColor: '#f97316', // orange
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 4: Financial Literacy card
    {
      title: 'Money Mastery',
      content: `Adulting is expensive, right? 💰 Let's decode the money mystery together! From "where did it all go?" budgeting to "future you will thank you" investing, we'll turn financial stress into financial success!`,
      target: 'card-financial-literacy',
      placement: 'bottom',
      highlightColor: '#22c55e', // green
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 5: Career Development card
    {
      title: 'Career Launchpad',
      content: `Ready to dazzle employers and climb that career ladder? 🚀 From crafting resumes that don't get ghosted to interview skills that'll make you memorable (in the good way!), your professional glow-up starts here!`,
      target: 'card-career-development',
      placement: 'bottom',
      highlightColor: '#3b82f6', // blue
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 6: Wellness & Nutrition card
    {
      title: 'Wellness Wonderland',
      content: `Because you can't pour from an empty cup! ✨ Discover meditation that doesn't make you fall asleep, nutrition that's about joy (not just kale), and self-care that fits your real life. Your mind and body will high-five you!`,
      target: 'card-wellness--nutrition',
      placement: 'bottom',
      highlightColor: '#a855f7', // purple
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 7: Active You Fitness card - Added
    {
      title: 'Active You Fitness',
      content: `Ready to get moving? 🏃‍♀️ No gym membership required! From quick home workouts to yoga flows that won't tie you in knots, we'll make fitness fun, accessible, and best of all - actually doable for your real life!`,
      target: 'card-active-you',
      placement: 'bottom',
      highlightColor: '#ec4899', // pink
      showFundiAnimation: true,
      animationType: 'jump'
    },
    
    // Step 8: Emergency Prep card - Added
    {
      title: 'Emergency Preparedness',
      content: `Better safe than sorry! 🚨 Let's make sure you're ready for anything life throws your way - from first aid basics to what to do when your car breaks down. Small preparations now can make a huge difference when it matters most!`,
      target: 'card-emergency-guidance',
      placement: 'bottom',
      highlightColor: '#ef4444', // red
      showFundiAnimation: true,
      animationType: 'nod'
    },
    
    // Step 9: Show smart calendar in sidebar
    {
      title: 'Your Smart Calendar',
      content: `Psst! 📅 Over here in the sidebar! This magical calendar keeps track of your learning journey without you having to remember everything. It's like having a personal assistant who never judges your procrastination habits!`,
      target: 'body', // Using body for mobile targeting since we'll use a custom approach
      placement: 'center', // Center placement for better mobile visibility
      highlightColor: '#6366f1', // indigo
      showFundiAnimation: false, // Turn off animation to avoid covering sidebar elements
      animationType: 'point'
    },
    
    // Step 10: Show arcade in sidebar
    {
      title: 'Fun Break Station',
      content: `All learn and no play? Not on my watch! 🎮 Our Arcade is where serious skills meet serious fun. Games that teach while you play! Think of it as "productive procrastination" – your brain will thank you for the refreshing break!`,
      target: 'body', // Using body for mobile targeting since we'll use a custom approach
      placement: 'center', // Center placement for better mobile visibility
      highlightColor: '#f59e0b', // amber
      showFundiAnimation: false, // Turn off animation to avoid covering sidebar elements
      animationType: 'jump'
    },
    
    // Step 11: Closing with user's name again
    {
      title: `High Five, ${firstName}!`,
      content: `You're officially ready to rock this Fundamenta journey! 🙌 Remember, I'm always in the top-right corner of your screen, ready to help! Just tap my icon whenever you need assistance or want to chat. Before you dive in, our founder has a special message...`,
      target: 'body',
      placement: 'center',
      showFundiAnimation: true,
      animationType: 'wave'
    },
    
    // Step 12: Why Fundamenta letter from the CEO
    {
      title: 'A Note From Our Founder',
      content: `At Fundamenta, we believe everyone deserves access to practical life skills – the kind school forgot to teach us! We've created this space where you can learn at your own pace, make mistakes without judgment, and build confidence in areas that matter. Welcome to our community – we're thrilled you're here!`,
      target: 'body',
      placement: 'center',
      highlightColor: '#1C3D5A',
      showFundiAnimation: false
    }
  ];
  
  return tourSteps;
};