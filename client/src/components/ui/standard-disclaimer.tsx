import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';

export type DisclaimerCategory = 'health' | 'finance' | 'legal' | 'mental_health' | 'general';
export type DisclaimerSeverity = 'info' | 'warning' | 'alert';
export type DisclaimerDisplay = 'always' | 'first_visit' | 'periodic';

interface DisclaimerContent {
  title?: string;
  description: string;
  icon?: React.ReactNode;
}

interface StandardDisclaimerProps {
  category: DisclaimerCategory;
  severity?: DisclaimerSeverity;
  display?: DisclaimerDisplay;
  className?: string;
  onAcknowledge?: () => void;
}

const disclaimerContent: Record<DisclaimerCategory, DisclaimerContent> = {
  health: {
    title: "Educational Content Only",
    description: "This content is educational and not medical advice. Individual situations vary. Consult healthcare professionals for personal medical guidance."
  },
  finance: {
    title: "Financial Information",
    description: "This information is educational and not financial advice. Consider consulting with financial professionals for personalized guidance."
  },
  legal: {
    title: "Legal Information",
    description: "This content provides general information, not legal advice. Laws vary by location. Consult a legal professional for guidance on your specific situation."
  },
  mental_health: {
    title: "Wellness Support",
    description: "This content offers educational information and support strategies, not psychological treatment. If you're struggling, please consult with a mental health professional."
  },
  general: {
    title: "Information Notice",
    description: "This content is provided for educational purposes. For personalized advice, please consult with the appropriate professionals."
  }
};

export function StandardDisclaimer({
  category,
  severity = 'info',
  display = 'always',
  className = '',
  onAcknowledge
}: StandardDisclaimerProps) {
  const [visible, setVisible] = useState(true);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  
  // Get styled content based on category and severity
  const content = disclaimerContent[category];
  
  // Determine icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'warning': return content.icon || <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'alert': return content.icon || <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return content.icon || <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Determine styling based on severity
  const getSeverityStyles = () => {
    switch (severity) {
      case 'warning': return 'border-amber-200 bg-amber-50 text-amber-800';
      case 'alert': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };
  
  // Check if we should show this disclaimer based on display setting
  useEffect(() => {
    if (display === 'always') {
      setVisible(true);
      return;
    }
    
    const key = `disclaimer_seen_${category}`;
    const hasSeenBefore = localStorage.getItem(key) === 'true';
    
    if (display === 'first_visit' && !hasSeenBefore) {
      setVisible(true);
      localStorage.setItem(key, 'true');
    } else if (display === 'periodic') {
      // Show periodically (e.g., every 30 days)
      const lastSeen = localStorage.getItem(`${key}_timestamp`);
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      if (!lastSeen || parseInt(lastSeen) < thirtyDaysAgo) {
        setVisible(true);
        localStorage.setItem(`${key}_timestamp`, Date.now().toString());
      } else {
        setVisible(false);
      }
    } else {
      setVisible(false);
    }
    
    setHasBeenSeen(hasSeenBefore);
  }, [category, display]);
  
  // Handle acknowledgment
  const handleDismiss = () => {
    setVisible(false);
    if (onAcknowledge) {
      onAcknowledge();
    }
  };
  
  if (!visible) return null;
  
  return (
    <Alert 
      className={`disclaimer-component ${getSeverityStyles()} ${className}`}
      variant="default"
    >
      {getIcon()}
      <div>
        {content.title && <AlertTitle className="text-sm font-medium">{content.title}</AlertTitle>}
        <AlertDescription className="flex justify-between items-center w-full">
          <span className="text-sm">{content.description}</span>
          {(display !== 'always') && (
            <button 
              onClick={handleDismiss} 
              className="ml-2 text-xs underline hover:no-underline"
              aria-label="Acknowledge disclaimer"
            >
              I understand
            </button>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}