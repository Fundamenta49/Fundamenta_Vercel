import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon, AlertTriangleIcon, ShieldAlertIcon } from "lucide-react";
import { cn } from '@/lib/utils';

// Must match server-side enums
export enum ContentCategory {
  MENTAL_HEALTH = 'mental_health',
  SUBSTANCE_USE = 'substance_use',
  VIOLENCE = 'violence',
  FINANCIAL_RISK = 'financial_risk',
  MEDICAL = 'medical',
  GENERAL = 'general'
}

export enum AdvisoryLevel {
  NONE = 'none',
  INFORMATIVE = 'info',
  CAUTIONARY = 'caution',
  RESTRICTED = 'restrict'
}

export interface AdvisoryMessage {
  title: string;
  description: string;
  category: ContentCategory;
  level: AdvisoryLevel;
}

interface ContentAdvisoryProps {
  advisory: AdvisoryMessage;
  onAcknowledge?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const ContentAdvisory: React.FC<ContentAdvisoryProps> = ({
  advisory,
  onAcknowledge,
  onCancel,
  className
}) => {
  // Determine icon and style based on advisory level
  const getAdvisoryStyle = () => {
    switch (advisory.level) {
      case AdvisoryLevel.INFORMATIVE:
        return {
          icon: <InfoIcon className="h-5 w-5" />,
          className: 'bg-blue-50 text-blue-800 border-blue-300'
        };
      case AdvisoryLevel.CAUTIONARY:
        return {
          icon: <AlertTriangleIcon className="h-5 w-5" />,
          className: 'bg-amber-50 text-amber-800 border-amber-300'
        };
      case AdvisoryLevel.RESTRICTED:
        return {
          icon: <ShieldAlertIcon className="h-5 w-5" />,
          className: 'bg-red-50 text-red-800 border-red-300'
        };
      default:
        return {
          icon: <InfoIcon className="h-5 w-5" />,
          className: 'bg-gray-50 text-gray-800 border-gray-300'
        };
    }
  };

  const { icon, className: styleClassName } = getAdvisoryStyle();

  return (
    <Alert className={cn('mb-4', styleClassName, className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <AlertTitle className="text-base font-medium">{advisory.title}</AlertTitle>
          <AlertDescription className="mt-1 text-sm">{advisory.description}</AlertDescription>
          
          {(onAcknowledge || onCancel) && (
            <div className="mt-3 flex space-x-2">
              {onAcknowledge && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onAcknowledge}
                  className={advisory.level === AdvisoryLevel.RESTRICTED ? 'border-red-300 text-red-800 hover:bg-red-100' : ''}
                >
                  I understand, continue
                </Button>
              )}
              
              {onCancel && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCancel}
                >
                  Go back
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

interface ContentAdvisoryWrapperProps {
  children: React.ReactNode;
  advisory: AdvisoryMessage | null;
  onAcknowledge?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const ContentAdvisoryWrapper: React.FC<ContentAdvisoryWrapperProps> = ({
  children,
  advisory,
  onAcknowledge,
  onCancel,
  className
}) => {
  const [acknowledged, setAcknowledged] = React.useState(false);
  
  // If there's no advisory or it's already acknowledged, just render the children
  if (!advisory || acknowledged) {
    return <>{children}</>;
  }
  
  const handleAcknowledge = () => {
    setAcknowledged(true);
    if (onAcknowledge) {
      onAcknowledge();
    }
  };
  
  return (
    <div className={className}>
      <ContentAdvisory 
        advisory={advisory}
        onAcknowledge={handleAcknowledge}
        onCancel={onCancel}
      />
      <div className={advisory.level === AdvisoryLevel.RESTRICTED && !acknowledged ? 'hidden' : ''}>
        {children}
      </div>
    </div>
  );
};