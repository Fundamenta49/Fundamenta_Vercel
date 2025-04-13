import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, HelpCircle, X, GraduationCap, DollarSign, 
  Briefcase, Heart, Activity, AlertCircle, Calendar, Gamepad2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

/**
 * A simplified, direct implementation of a tour system.
 * This keeps the user on the home page and focuses on explaining 
 * the different feature cards without navigating between pages.
 */
export function SimpleTourButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);
  const [fundiAnimating, setFundiAnimating] = useState(false);
  
  // Get user's actual name
  const userName = user?.name 
    ? user.name.split(' ')[0] // Get first name only
    : 'there';
  
  // Tour steps that explain each card but don't navigate
  const steps = [
    {
      title: `Welcome to Fundamenta, ${userName}!`,
      content: 'I\'m Fundi, your AI guide to a more confident life! I\'m here to show you around and help you get the most out of Fundamenta. Let\'s explore the features together!',
      icon: <HelpCircle className="h-6 w-6 text-blue-500" />,
      highlightCard: null
    },
    {
      title: 'Life Skills',
      content: 'Learn essential skills for daily life, boost your personal development, and discover resources for continuous learning. This is your hub for becoming more confident in everyday situations.',
      icon: <GraduationCap className="h-6 w-6 text-orange-500" />,
      highlightCard: 'card-life-skills'
    },
    {
      title: 'Financial Literacy',
      content: 'Take control of your money with budgeting tools, savings strategies, and long-term financial planning. Become financially independent with personalized guidance.',
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      highlightCard: 'card-financial-literacy'
    },
    {
      title: 'Career Development',
      content: 'Build an outstanding resume, prepare for job interviews, and develop professional skills that make you stand out to employers.',
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      highlightCard: 'card-career-development'
    },
    {
      title: 'Wellness & Nutrition',
      content: 'Support your mental health with meditation guides, stress management tools, and nutrition advice tailored to your lifestyle goals.',
      icon: <Heart className="h-6 w-6 text-purple-500" />,
      highlightCard: 'card-wellness---nutrition'
    },
    {
      title: 'Active You',
      content: 'Get personalized AI-powered workout plans, track your fitness progress, and stay motivated with custom exercise routines.',
      icon: <Activity className="h-6 w-6 text-pink-500" />,
      highlightCard: 'card-active-you'
    },
    {
      title: 'Emergency Guidance',
      content: 'Access step-by-step guidance for handling emergency situations confidently. Be prepared for the unexpected with clear instructions.',
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      highlightCard: 'card-emergency-guidance'
    },
    {
      title: 'Smart Calendar',
      content: 'Schedule your activities, set reminders, and manage your time effectively with our intelligent calendar that adapts to your lifestyle needs.',
      icon: <Calendar className="h-6 w-6 text-cyan-500" />,
      highlightCard: 'nav-smart-calendar'
    },
    {
      title: 'Arcade',
      content: 'Take a break and have some fun with educational games that also help improve your cognitive skills while you relax and enjoy yourself.',
      icon: <Gamepad2 className="h-6 w-6 text-indigo-500" />,
      highlightCard: 'nav-arcade'
    },
    {
      title: `You're All Set, ${userName}!`,
      content: 'That\'s it! You\'ve seen all the amazing features Fundamenta has to offer. After you close this tour, feel free to click on any card to explore that feature. I\'m here whenever you need me. Let\'s make life more LIFEABLE together!',
      icon: <HelpCircle className="h-6 w-6 text-blue-500" />,
      highlightCard: null
    }
  ];
  
  // Highlight colors for each section
  const highlightColors: Record<string, string> = {
    'card-life-skills': 'ring-orange-500',
    'card-financial-literacy': 'ring-green-500',
    'card-career-development': 'ring-blue-500',
    'card-wellness---nutrition': 'ring-purple-500',
    'card-active-you': 'ring-pink-500',
    'card-emergency-guidance': 'ring-red-500',
    'nav-smart-calendar': 'ring-cyan-500',
    'nav-arcade': 'ring-amber-500'
  };

  // Add card highlighting when step changes
  useEffect(() => {
    if (isOpen) {
      // Clear any previous highlight
      document.querySelectorAll('[data-tour-id]').forEach(card => {
        card.classList.remove('ring-4');
        // Remove all possible highlight colors
        Object.values(highlightColors).forEach(color => {
          card.classList.remove(color);
        });
        card.classList.remove('ring-offset-2', 'z-10', 'relative');
      });
      
      // Set the new highlight
      const highlightId = steps[currentStep].highlightCard;
      if (highlightId) {
        setHighlightedCard(highlightId);
        const card = document.querySelector(`[data-tour-id="${highlightId}"]`);
        if (card) {
          const ringColor = highlightColors[highlightId] || 'ring-blue-400';
          card.classList.add('ring-4', ringColor, 'ring-offset-2');
          card.classList.add('z-10', 'relative');
          
          // Scroll the card into view
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        setHighlightedCard(null);
      }
    }
  }, [currentStep, isOpen]);
  
  // Clean up highlights when tour closes
  useEffect(() => {
    if (!isOpen) {
      document.querySelectorAll('[data-tour-id]').forEach(card => {
        card.classList.remove('ring-4', 'ring-offset-2');
        // Remove all possible highlight colors
        Object.values(highlightColors).forEach(color => {
          card.classList.remove(color);
        });
        card.classList.remove('z-10', 'relative');
      });
    }
  }, [isOpen, highlightColors]);
  
  // Create a silly animation for Fundi when mentioned in the first step
  useEffect(() => {
    if (isOpen && currentStep === 0) {
      // Find the content text that mentions Fundi in the first step
      const fundiMention = document.querySelector('.tour-content-text');
      
      // Add animation to Fundi avatar
      const fundiAvatar = document.querySelector('[data-fundi-robot]');
      if (fundiAvatar) {
        setFundiAnimating(true);
        
        // Add the animation class
        fundiAvatar.classList.add('fundi-silly-animation');
        
        // Remove it after animation completes
        setTimeout(() => {
          fundiAvatar.classList.remove('fundi-silly-animation');
          setFundiAnimating(false);
        }, 3000);
      }
    }
  }, [isOpen, currentStep]);
  
  // Simple tour control functions
  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };
  
  const closeTour = () => {
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Tour Button */}
      <div 
        onClick={startTour}
        className="cursor-pointer text-primary hover:scale-110 transition-transform flex items-center justify-center bg-white p-2 rounded-full shadow-sm border border-gray-100"
        aria-label="Take a tour"
      >
        <HelpCircle size={22} className="hover:text-primary/80" />
      </div>
      
      {/* Tour Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9990]"
              onClick={closeTour}
            />
            
            {/* Tour Dialog */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] 
                        bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-2 border border-blue-100/50"
            >
              <button 
                onClick={closeTour}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full bg-slate-100 flex items-center justify-center`}>
                  {steps[currentStep].icon}
                </div>
                <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
              </div>
              <p className="mb-6 tour-content-text">{steps[currentStep].content}</p>
              
              {/* Progress indicator */}
              <div className="w-full h-1 bg-gray-200 rounded-full mb-4">
                <div 
                  className="h-1 bg-blue-500 rounded-full"
                  style={{ width: `${(currentStep + 1) / steps.length * 100}%` }}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={nextStep} className="px-4">
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep !== steps.length - 1 && <ChevronRight className="ml-1" size={16} />}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default SimpleTourButton;