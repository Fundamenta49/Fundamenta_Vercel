import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Maximize2 } from 'lucide-react';

// Import the fullscreen components
import ResumeBuilderFullscreen from '@/components/resume-builder-fullscreen';
import JobSearchFullscreen from '@/components/career/job-search-fullscreen';
import InterviewPracticeFullscreen from '@/components/career/interview-practice-fullscreen';

export type CareerToolType = 'resume' | 'job-search' | 'interview' | 'assessment' | 'resilience' | 'rights';

interface CareerFullscreenTriggerProps extends ButtonProps {
  toolType: CareerToolType;
  label?: string;
  showIcon?: boolean;
}

export default function CareerFullscreenTrigger({
  toolType,
  label,
  showIcon = true,
  className,
  ...props
}: CareerFullscreenTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get the appropriate label for the button based on the tool type
  const getLabel = () => {
    if (label) return label;
    
    switch (toolType) {
      case 'resume':
        return 'Resume Builder';
      case 'job-search':
        return 'Job Search';
      case 'interview':
        return 'Interview Practice';
      case 'assessment':
        return 'Career Assessment';
      case 'resilience':
        return 'EQ & Resilience';
      case 'rights':
        return 'Employment Rights';
      default:
        return 'Open';
    }
  };

  // Handle opening the fullscreen component
  const handleOpen = () => {
    setIsOpen(true);
  };

  // Handle closing the fullscreen component
  const handleClose = () => {
    setIsOpen(false);
  };

  // Render the appropriate fullscreen component based on the tool type
  const renderFullscreenComponent = () => {
    if (!isOpen) return null;

    switch (toolType) {
      case 'resume':
        return <ResumeBuilderFullscreen onClose={handleClose} />;
      case 'job-search':
        return <JobSearchFullscreen onClose={handleClose} />;
      case 'interview':
        return <InterviewPracticeFullscreen onClose={handleClose} />;
      case 'assessment':
        // Placeholder for future implementation
        return <div className="fixed inset-0 bg-background z-50 p-6">
          <h1>Career Assessment (Coming Soon)</h1>
          <Button onClick={handleClose}>Close</Button>
        </div>;
      case 'resilience':
        // Placeholder for future implementation
        return <div className="fixed inset-0 bg-background z-50 p-6">
          <h1>EQ & Resilience (Coming Soon)</h1>
          <Button onClick={handleClose}>Close</Button>
        </div>;
      case 'rights':
        // Placeholder for future implementation
        return <div className="fixed inset-0 bg-background z-50 p-6">
          <h1>Employment Rights (Coming Soon)</h1>
          <Button onClick={handleClose}>Close</Button>
        </div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className={cn("gap-1.5", className)}
        {...props}
      >
        {showIcon && <Maximize2 className="h-4 w-4" />}
        {getLabel()}
      </Button>
      
      {renderFullscreenComponent()}
    </>
  );
}