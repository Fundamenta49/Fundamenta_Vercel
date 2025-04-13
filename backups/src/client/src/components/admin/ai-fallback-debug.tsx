import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, RefreshCwIcon, BarChart3Icon } from "lucide-react";

interface FallbackStatus {
  useFallback: boolean;
  failureCount: number;
  timeSinceLastFailure: number | null;
  cooldownPeriod: number;
  maxFailures: number;
  primaryProvider: string;
  fallbackProvider: string;
}

interface AdminStats {
  fallbackStatus: FallbackStatus;
  providerInfo: {
    primary: {
      name: string;
      status: string;
    };
    fallback: {
      name: string;
      status: string;
    };
  };
}

const AIFallbackDebug: React.FC = () => {
  const [status, setStatus] = useState<FallbackStatus | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch current status on mount and periodically (every 10 seconds)
  useEffect(() => {
    fetchStatus();
    fetchAdminStats();
    
    const intervalId = setInterval(() => {
      fetchStatus();
      fetchAdminStats();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/ai/fallback-status');
      const data = await response.json();
      
      if (data.success && data.status) {
        setStatus(data.status);
        setError(null);
      } else {
        setError('Failed to fetch fallback status: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error connecting to API: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/ai/admin-stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
        setError(null);
      } else {
        console.error('Failed to fetch admin stats:', data.error);
      }
    } catch (err) {
      console.error('Error connecting to admin stats API:', err);
    }
  };

  const resetFallback = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/reset-fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Fallback system reset successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchStatus(); // Refresh status after reset
      } else {
        setError('Failed to reset fallback system: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error connecting to API: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleFallbackMode = async () => {
    if (!status) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/toggle-fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          useFallback: !status.useFallback
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchStatus(); // Refresh status after toggle
      } else {
        setError('Failed to toggle fallback mode: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error connecting to API: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const performHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/health-check');
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchStatus(); // Refresh status after health check
      } else {
        setError('Health check failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('Error connecting to API: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Format time since last failure in a human-readable way
  const formatTimeSinceLastFailure = (ms: number | null): string => {
    if (ms === null) return 'No failures recorded';
    
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours} hours ago`;
  };

  if (!status) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCwIcon className="animate-spin" />
            AI Fallback Status Loading
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon />
            AI Fallback System Status
          </CardTitle>
          <CardDescription>
            Monitor and control the AI fallback mechanism between providers
          </CardDescription>
        </CardHeader>
        
        {error && (
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        )}
        
        {successMessage && (
          <CardContent>
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </CardContent>
        )}
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Current Provider</h3>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={status.useFallback ? "outline" : "default"} className="text-lg py-1 px-3">
                  {status.useFallback ? status.fallbackProvider : status.primaryProvider}
                </Badge>
                {status.useFallback && (
                  <Badge variant="destructive" className="text-sm">Fallback Mode</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-6">
                <Switch
                  checked={status.useFallback}
                  onCheckedChange={toggleFallbackMode}
                  disabled={loading}
                  id="fallback-mode"
                />
                <Label htmlFor="fallback-mode">
                  {status.useFallback 
                    ? `Using ${status.fallbackProvider} (fallback)` 
                    : `Using ${status.primaryProvider} (primary)`}
                </Label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">System Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Failure Count:</span>
                  <Badge variant={status.failureCount > 0 ? "destructive" : "outline"}>
                    {status.failureCount}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span>Last Failure:</span>
                  <span>{formatTimeSinceLastFailure(status.timeSinceLastFailure)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Max Failures Allowed:</span>
                  <span>{status.maxFailures}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Cooldown Period:</span>
                  <span>{status.cooldownPeriod / 1000}s</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetFallback} 
            disabled={loading}
            className="gap-1"
          >
            {loading && <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />}
            Reset Fallback System
          </Button>
          
          <Button 
            variant="default" 
            onClick={performHealthCheck} 
            disabled={loading}
            className="gap-1"
          >
            {loading && <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />}
            Perform Health Check
          </Button>
        </CardFooter>
      </Card>
      
      {stats && (
        <Card className="my-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircleIcon />
              AI Provider Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Primary Provider ({stats.providerInfo.primary.name})</h3>
                <Badge 
                  variant={stats.providerInfo.primary.status === 'active' ? 'default' : 'destructive'}
                >
                  {stats.providerInfo.primary.status}
                </Badge>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Fallback Provider ({stats.providerInfo.fallback.name})</h3>
                <Badge 
                  variant={stats.providerInfo.fallback.status === 'active' ? 'default' : 'destructive'}
                >
                  {stats.providerInfo.fallback.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIFallbackDebug;