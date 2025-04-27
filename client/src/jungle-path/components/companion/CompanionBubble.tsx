import React, { useState, useEffect } from 'react';
import { useCompanion } from './CompanionProvider';
import { X } from 'lucide-react';

interface CompanionBubbleProps {
  message: string;
  context?: string;
  duration?: number; // in milliseconds, 0 = doesn't auto-hide
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  onDismiss?: () => void;
  className?: string;
}

/**
 * CompanionBubble displays a floating message from the active companion
 */
const CompanionBubble: React.FC<CompanionBubbleProps> = ({
  message,
  context,
  duration = 10000,
  position = 'bottom-right',
  onDismiss,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { activeCompanion, showCompanionDialog } = useCompanion();
  
  // Auto-hide message after duration if duration > 0
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (duration > 0 && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration, isVisible, onDismiss]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };
  
  // Handle click on companion avatar
  const handleCompanionClick = () => {
    showCompanionDialog();
  };
  
  // If not visible or no companion, don't render
  if (!isVisible || !activeCompanion) {
    return null;
  }
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4'
  };
  
  return (
    <div 
      className={`fixed ${positionClasses[position]} max-w-xs z-50 flex items-start space-x-2 ${className}`}
      style={{ animation: 'floraMovement 4s ease-in-out infinite' }}
    >
      {/* Companion avatar */}
      <div 
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer"
        style={{ 
          backgroundColor: activeCompanion.color,
          border: '2px solid white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
        onClick={handleCompanionClick}
      >
        {/* Placeholder for companion avatar */}
        <span className="text-white font-bold">{activeCompanion.species.charAt(0)}</span>
      </div>
      
      {/* Message bubble */}
      <div 
        className="bg-white rounded-lg shadow-lg p-3 relative"
        style={{ 
          borderLeft: `3px solid ${activeCompanion.color}`,
          maxWidth: 'calc(100% - 3rem)'
        }}
      >
        {/* Close button */}
        <button 
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          onClick={handleDismiss}
        >
          <X size={14} />
        </button>
        
        {/* Message content */}
        <div className="pr-4">
          <div className="text-xs font-bold mb-1">{activeCompanion.name}</div>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Helper component for random tips
export const RandomTipBubble: React.FC<Omit<CompanionBubbleProps, 'message'> & { 
  contextHint?: string 
}> = ({
  contextHint,
  ...props
}) => {
  const { getRandomTip } = useCompanion();
  const tip = getRandomTip(contextHint);
  
  if (!tip) return null;
  
  return <CompanionBubble message={tip} {...props} />;
};

export default CompanionBubble;