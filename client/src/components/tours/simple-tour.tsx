import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, HelpCircle, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

/**
 * A simplified, direct implementation of a tour system.
 * This avoids the complexity of context providers and multiple files.
 */
export function SimpleTourButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  
  // Get user's first name
  const userName = user?.email 
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'there';
  
  // Tour steps - simple and direct
  const steps = [
    {
      title: `Welcome to Fundamenta, ${userName}!`,
      content: 'I\'m Fundi, your AI guide to a more confident life! I\'m here to show you around and help you get the most out of Fundamenta.',
    },
    {
      title: 'Explore Different Areas',
      content: 'Use the cards below to explore different life skills, from finances to fitness to personal development!',
    },
    {
      title: 'Need Help?',
      content: 'Click on Fundi (that\'s me!) anytime you need guidance, have questions, or just want to chat. I\'m here to help!',
    },
    {
      title: `You're All Set, ${userName}!`,
      content: 'That\'s it! You\'re ready to start building life skills with Fundamenta. Let\'s make life more LIFEABLE together!',
    }
  ];
  
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
                        bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-2"
            >
              <button 
                onClick={closeTour}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold mb-2">{steps[currentStep].title}</h3>
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