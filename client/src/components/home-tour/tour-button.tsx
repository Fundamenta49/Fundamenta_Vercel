import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTour } from './tour-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface TourButtonProps {
  className?: string;
}

const TourButton: React.FC<TourButtonProps> = ({ className = '' }) => {
  const { startTour } = useTour();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={startTour}
              variant="outline"
              size="sm"
              className={`tour-button h-12 w-12 p-0 flex items-center justify-center transition-all duration-300 bg-transparent border-0 ${className}`}
              aria-label="Start Tour"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </motion.div>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Take a guided tour of Fundamenta</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TourButton;