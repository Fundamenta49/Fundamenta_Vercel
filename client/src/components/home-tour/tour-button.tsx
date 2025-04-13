import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTour } from './tour-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TourButtonProps {
  className?: string;
}

const TourButton: React.FC<TourButtonProps> = ({ className = '' }) => {
  const { startTour } = useTour();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={startTour}
            variant="outline"
            size="sm"
            className={`rounded-full h-10 w-10 p-0 flex items-center justify-center ${className}`}
            aria-label="Start Tour"
          >
            <HelpCircle className="h-5 w-5 text-[#1C3D5A]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Take a tour of Fundamenta</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TourButton;