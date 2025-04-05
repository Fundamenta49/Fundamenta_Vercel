import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useAIProviderStatus } from '@/lib/ai-provider-service';

/**
 * A component that shows a notice when the AI system is in fallback mode.
 * This component will query the AI provider status API and display a notification
 * when the system is using the fallback provider.
 */
export function AIFallbackNotice() {
  const { status, isLoading, error, fetchStatus } = useAIProviderStatus();
  const [expanded, setExpanded] = useState(false);
  
  // Fetch status on mount and poll periodically
  useEffect(() => {
    // Fetch immediately on mount
    fetchStatus();
    
    // Then poll every 5 minutes
    const intervalId = setInterval(() => {
      fetchStatus();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchStatus]);
  
  // Only show when using fallback
  if (isLoading || !status || !status.useFallback) {
    return null;
  }
  
  return (
    <Alert variant="default" className="mb-4 border border-amber-200 bg-amber-50/80 shadow-sm">
      <InfoIcon className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 flex items-center justify-between">
        <span>Fundi is in simplified mode</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-amber-700 hover:text-amber-900 underline"
        >
          {expanded ? 'Show Less' : 'Learn More'}
        </button>
      </AlertTitle>
      <AlertDescription className="text-amber-700">
        {expanded ? (
          <div className="space-y-2 mt-1">
            <p>
              Fundi is currently using simplified AI capabilities. All essential features remain available, but some advanced responses may be more basic than usual.
            </p>
            <p className="text-xs">
              This temporary mode is activated during high usage periods or maintenance. Our team has been automatically notified.
            </p>
          </div>
        ) : (
          <p>
            Fundi is using simplified AI capabilities. All features remain available, but responses may be more basic than usual.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}