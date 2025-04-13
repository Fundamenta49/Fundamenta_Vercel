/**
 * CLEAN IMPLEMENTATION OF TOUR GUIDE
 * This is a specialized component for displaying guided tours
 * with proper positioning of Fundi and tour content
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RobotFundi from '@/components/robot-fundi';

// Type for tour step configuration
interface TourStep {
  id: string;
  title: string;
  content: string;
  showPrevButton?: boolean;
  showSkipButton?: boolean;
  placement?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  targetSelector?: string;
  highlightSize?: 'sm' | 'md' | 'lg';
  fundiPosition?: { x: number; y: number };
}

// Props for the tour guide component
interface TourGuideProps {
  steps: TourStep[];
  initialStep?: number;
  onComplete?: () => void;
  onSkip?: () => void;
  userName?: string;
}

// Personality adapter for Fundi (placeholder)
const FundiPersonalityAdapter = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

/**
 * Main tour guide component with proper positioning for both
 * desktop and mobile views
 */
export function TourGuide({ 
  steps, 
  initialStep = 0, 
  onComplete, 
  onSkip,
  userName = 'there'
}: TourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isTourActive, setIsTourActive] = useState(true);
  
  // Current tour step
  const currentStep = steps[currentStepIndex];
  
  // For animation states
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  
  // Tour control functions
  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsTourActive(false);
      onComplete?.();
    }
  };
  
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const skipTour = () => {
    setIsTourActive(false);
    onSkip?.();
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  
  // Check for mobile device
  const isMobile = 
    typeof window !== 'undefined' && 
    (window.innerWidth < 768 || window.matchMedia('(any-pointer: coarse)').matches);
  
  // Apply mobile adjustments
  useEffect(() => {
    // Check if device is mobile
    const isMobileDevice = window.innerWidth < 768 || window.matchMedia('(any-pointer: coarse)').matches;
    
    // Set document class for CSS targeting
    if (isMobileDevice) {
      document.body.classList.add('tour-mobile-mode');
    } else {
      document.body.classList.remove('tour-mobile-mode'); 
    }
    
    return () => {
      document.body.classList.remove('tour-mobile-mode');
    };
  }, []);
  
  // Add animation when step changes
  useEffect(() => {
    if (isTourActive && currentStep) {
      // Animate Fundi
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setSpeaking(true);
        setTimeout(() => setSpeaking(false), 2000);
      }, 800);
    }
  }, [currentStepIndex, isTourActive, currentStep]);
  
  // If tour is no longer active, don't render
  if (!isTourActive || !currentStep) return null;
  
  return (
    <>
      {/* Semi-transparent overlay */}
      <motion.div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[9990]"
        onClick={skipTour}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Fundi Avatar - Centered on screen */}
      <motion.div
        className="fixed z-[99999]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          // Position in center of screen instead of using custom coordinates
          x: isMobile ? window.innerWidth / 2 - 30 : window.innerWidth / 2 - 55,
          y: isMobile ? 140 : 180
        }}
        transition={{ 
          type: "spring", 
          stiffness: 80,
          damping: 16
        }}
        style={{ 
          width: isMobile ? '60px' : '110px', 
          height: isMobile ? '60px' : '110px',
          willChange: 'transform'
        }}
        data-fundi="true"
      >
        {/* Fundi Character */}
        <div
          className={cn(
            isMobile ? "w-16 h-16" : "w-28 h-28"
          )}
          data-fundi-robot
        >
          <FundiPersonalityAdapter>
            <RobotFundi
              speaking={speaking}
              thinking={thinking}
              size={isMobile ? "sm" : "lg"}
              interactive={false}
              emotion="happy"
              category="tour"
            />
          </FundiPersonalityAdapter>
        </div>
        
        {/* Speech Bubble - Positioned directly below Fundi */}
        <AnimatePresence>
          <motion.div
            className={cn(
              "absolute bg-white rounded-xl shadow-xl p-6 text-base",
              "w-80 sm:w-[370px] max-w-[370px]"  // Increase size by 5px all around (360px → 370px)
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(8px)',
              // Position below Fundi instead of using placement
              top: isMobile ? '80px' : '120px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            data-tour-dialog="true"
          >
            {/* Title */}
            <motion.h3 
              className="font-bold text-lg md:text-xl mb-3"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {currentStep.title}
            </motion.h3>
            
            {/* Content */}
            <motion.p 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {currentStep.content}
            </motion.p>
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 rounded-full mb-4">
              <div
                className="h-1 bg-blue-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Previous button (conditionally shown) */}
                {currentStepIndex > 0 && currentStep.showPrevButton !== false && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                )}
                
                {/* Skip button (conditionally shown) */}
                {currentStep.showSkipButton !== false && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="text-gray-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <span>Skip</span>
                  </Button>
                )}
              </div>
              
              {/* Next/Finish button */}
              <Button
                variant="default"
                size="sm"
                onClick={nextStep}
                className="gap-1"
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Finish</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      {/* Add CSS for tour styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Global tour styles */
          body.tour-mobile-mode [data-fundi="true"] {
            position: fixed !important;
            top: 140px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }
          
          body.tour-mobile-mode [data-tour-dialog="true"] {
            position: fixed !important;
            top: 210px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            max-width: calc(100vw - 30px) !important;
            width: calc(100vw - 30px) !important;
          }
        `
      }} />
    </>
  );
}

export default TourGuide;