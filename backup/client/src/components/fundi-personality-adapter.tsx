import React, { useEffect, useState } from 'react';
import { useAIEventStore } from '@/lib/ai-event-system';

interface FundiPersonalityProps {
  children: React.ReactNode;
}

/**
 * Component that adapts Fundi's appearance based on user interactions
 * and conversation context
 */
export default function FundiPersonalityAdapter({ children }: FundiPersonalityProps) {
  const { lastResponse, currentCategory } = useAIEventStore();
  const [personality, setPersonality] = useState<string>('neutral');
  const [adaptationLevel, setAdaptationLevel] = useState<number>(0);
  
  // Update personality based on AI response
  useEffect(() => {
    if (lastResponse) {
      // Check if the response contains personality information
      if (lastResponse.sentiment) {
        switch (lastResponse.sentiment) {
          case 'encouraging':
            setPersonality('supportive');
            break;
          case 'cautious':
            setPersonality('thoughtful');
            break;
          case 'excited':
            setPersonality('enthusiastic');
            break;
          case 'empathetic':
            setPersonality('caring');
            break;
          case 'professional':
            setPersonality('formal');
            break;
          case 'humorous':
            setPersonality('witty');
            break;
          default:
            setPersonality('neutral');
        }
      }
      
      // Gradually increase adaptation level over time
      // This simulates Fundi learning and adapting to the user's style
      if (adaptationLevel < 5) {
        setAdaptationLevel(prev => Math.min(prev + 0.5, 5));
      }
    }
  }, [lastResponse]);
  
  // Reset adaptation level when category changes
  useEffect(() => {
    // When switching to a completely different context, reset adaptation somewhat
    setAdaptationLevel(Math.max(adaptationLevel - 2, 0));
  }, [currentCategory]);
  
  // Render children with personality context
  return (
    <div className="fundi-personality" data-personality={personality} data-adaptation={adaptationLevel}>
      {children}
    </div>
  );
}