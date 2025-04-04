import React from 'react';
import { useTour } from '@/contexts/tour-context';
import { Button, ButtonProps } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface RestartTourButtonProps extends ButtonProps {
  showLabel?: boolean;
  tooltipText?: string;
  position?: 'fixed' | 'absolute' | 'relative';
}

const RestartTourButton = ({ 
  showLabel = false, 
  tooltipText = 'Restart Tour',
  position = 'fixed',
  className,
  ...props 
}: RestartTourButtonProps) => {
  const { restartTour } = useTour();
  const isMobile = useIsMobile();
  
  // Simple button for mobile without tooltip
  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          restartTour();
        }}
        className={`${position === 'fixed' ? 'fixed top-2 right-2 z-50' : ''} 
                    rounded-full w-8 h-8 p-0 bg-white/90 shadow-md
                    text-muted-foreground hover:text-primary
                    ${className}`}
        aria-label="Restart tour"
        {...props}
      >
        <HelpCircle className="h-5 w-5" />
        {showLabel && <span className="ml-2">Help</span>}
      </Button>
    );
  }

  // Desktop version with tooltip
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={restartTour}
            className={`${position === 'fixed' ? 'fixed top-4 right-4 z-50' : ''} 
                        rounded-full w-8 h-8 p-0 hover:bg-primary/10 
                        text-muted-foreground hover:text-primary
                        ${className}`}
            aria-label="Restart tour"
            {...props}
          >
            <HelpCircle className="h-5 w-5" />
            {showLabel && <span className="ml-2">Help</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RestartTourButton;