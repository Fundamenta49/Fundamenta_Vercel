import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, HelpCircle, X, GraduationCap, DollarSign, 
  Briefcase, Heart, Activity, AlertCircle 
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
  
  // Get user's actual name
  const userName = user?.name 
    ? user.name.split(' ')[0] // Get first name only
    : 'there';
  
  // Tour steps that explain each card but don't navigate
  const steps = [
    {
      title: `Welcome to Fundamenta, ${userName}!`,
      content: 'I\'m Fundi, your AI guide to a more confident life! I\'m here to show you around and help you get the most out of Fundamenta. Let\'s explore the features together!',
      icon: <HelpCircle className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'Life Skills',
      content: 'Learn essential skills for daily life, boost your personal development, and discover resources for continuous learning. This is your hub for becoming more confident in everyday situations.',
      icon: <GraduationCap className="h-6 w-6 text-orange-500" />
    },
    {
      title: 'Financial Literacy',
      content: 'Take control of your money with budgeting tools, savings strategies, and long-term financial planning. Become financially independent with personalized guidance.',
      icon: <DollarSign className="h-6 w-6 text-green-500" />
    },
    {
      title: 'Career Development',
      content: 'Build an outstanding resume, prepare for job interviews, and develop professional skills that make you stand out to employers.',
      icon: <Briefcase className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'Wellness & Nutrition',
      content: 'Support your mental health with meditation guides, stress management tools, and nutrition advice tailored to your lifestyle goals.',
      icon: <Heart className="h-6 w-6 text-purple-500" />
    },
    {
      title: 'Active You',
      content: 'Get personalized AI-powered workout plans, track your fitness progress, and stay motivated with custom exercise routines.',
      icon: <Activity className="h-6 w-6 text-pink-500" />
    },
    {
      title: 'Emergency Guidance',
      content: 'Access step-by-step guidance for handling emergency situations confidently. Be prepared for the unexpected with clear instructions.',
      icon: <AlertCircle className="h-6 w-6 text-red-500" />
    },
    {
      title: `You're All Set, ${userName}!`,
      content: 'That\'s it! You\'ve seen all the amazing features Fundamenta has to offer. After you close this tour, feel free to click on any card to explore that feature. I\'m here whenever you need me. Let\'s make life more LIFEABLE together!',
      icon: <HelpCircle className="h-6 w-6 text-blue-500" />
    }
  ];
  
  // Simple tour control functions without navigation
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
              <p className="mb-6">{steps[currentStep].content}</p>
              
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