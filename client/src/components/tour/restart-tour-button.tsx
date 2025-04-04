import React from 'react';
import { useTour } from '@/contexts/tour-context';
import { Button, ButtonProps } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface RestartTourButtonProps extends ButtonProps {
  showIcon?: boolean;
  label?: string;
}

const RestartTourButton = ({ 
  showIcon = true, 
  label = 'Restart Tour',
  className,
  ...props 
}: RestartTourButtonProps) => {
  const { restartTour } = useTour();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={restartTour}
      className={className}
      {...props}
    >
      {showIcon && <HelpCircle className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  );
};

export default RestartTourButton;