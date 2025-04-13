import React, { useEffect } from 'react';
import { useAIProviderStatus } from '@/lib/ai-provider-service';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

/**
 * Admin Component: AI Provider Status Monitor and Control
 * 
 * This component provides an admin interface for monitoring the status
 * of the AI provider fallback system and allows for manual intervention
 * when needed. It displays the current AI provider status, any error
 * messages, and provides controls for toggling fallback mode or resetting
 * the fallback system.
 * 
 * Note: This component should only be accessible to administrators.
 */
export function AIProviderStatusPanel() {
  const {
    status,
    isLoading,
    error,
    fetchStatus,
    toggleFallbackMode,
    resetFallbackSystem,
    statusMessage
  } = useAIProviderStatus();

  // Fetch status on mount
  useEffect(() => {
    fetchStatus();
    // Poll for status updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchStatus();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchStatus]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AI Provider Status</CardTitle>
        <CardDescription>
          Monitor and manage the AI provider fallback system
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Current Provider:</h3>
                <p className="text-lg font-bold">
                  {status?.useFallback ? status?.fallbackProvider : status?.primaryProvider}
                  <Badge 
                    className="ml-2" 
                    variant={status?.useFallback ? "destructive" : "default"}
                  >
                    {status?.useFallback ? "FALLBACK MODE" : "PRIMARY MODE"}
                  </Badge>
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="fallback-mode"
                  checked={status?.useFallback || false}
                  onCheckedChange={(checked) => toggleFallbackMode(checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="fallback-mode">Force Fallback Mode</Label>
              </div>
            </div>
            
            {status?.failureCount && status.failureCount > 0 && (
              <Alert variant="destructive" className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Recent API Failures Detected</AlertTitle>
                <AlertDescription className="text-amber-700">
                  There have been {status.failureCount} failures recorded recently. 
                  {status?.cooldownPeriod && status?.timeSinceLastFailure !== null && (
                    <span>
                      {' '}The system will automatically attempt to use the primary provider again in{' '}
                      {Math.max(0, Math.ceil((status.cooldownPeriod - status.timeSinceLastFailure) / 1000))} seconds.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">System Information:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Primary Provider: {status?.primaryProvider}</li>
                <li>Fallback Provider: {status?.fallbackProvider}</li>
                <li>Current Failure Count: {status?.failureCount || 0}</li>
                <li>Maximum Failures Before Cooldown: {status?.maxFailures || 3}</li>
                <li>Cooldown Period: {status?.cooldownPeriod ? `${status.cooldownPeriod / 1000} seconds` : 'Unknown'}</li>
                {status?.timeSinceLastFailure !== null && (
                  <li>
                    Time Since Last Failure: {Math.floor((status?.timeSinceLastFailure || 0) / 1000)} seconds
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => fetchStatus()}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Refresh Status
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => resetFallbackSystem()}
          disabled={isLoading || (status?.failureCount === 0 && !status?.useFallback)}
        >
          Reset Fallback System
        </Button>
      </CardFooter>
    </Card>
  );
}