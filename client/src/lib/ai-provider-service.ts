import { create } from 'zustand';

/**
 * NOTE: This service is for internal use only by administrators.
 * It should not be exposed to end users as part of the regular UI.
 * The dual API approach (OpenAI and HuggingFace) is designed to work
 * seamlessly in the background without user awareness or intervention.
 */

// Types for AI provider status
export interface AIProviderStatus {
  useFallback: boolean;
  failureCount: number;
  timeSinceLastFailure: number | null;
  cooldownPeriod: number;
  maxFailures: number;
  primaryProvider: string;
  fallbackProvider: string;
}

// Store for AI provider monitoring
interface AIProviderState {
  isLoading: boolean;
  status: AIProviderStatus | null;
  error: string | null;
  
  // Admin-only methods
  fetchStatus: () => Promise<void>;
  toggleFallbackMode: (useFallback?: boolean) => Promise<void>;
  resetFallbackSystem: () => Promise<void>;
}

// Create the store with Zustand
export const useAIProviderStore = create<AIProviderState>((set) => ({
  isLoading: false,
  status: null,
  error: null,
  
  // Admin-only: Fetch the current status of the AI providers
  fetchStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Try with timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch('/api/ai/fallback-status', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch AI provider status: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Unknown error fetching AI provider status');
        }
        
        set({ status: data.status, isLoading: false });
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // If fetch fails, provide a default fallback status so the UI doesn't break
        // This is just for UI display purposes - the actual server status is determined server-side
        set({ 
          status: {
            useFallback: false, // Assume primary is working to avoid showing unnecessary alerts
            failureCount: 0,
            timeSinceLastFailure: null,
            cooldownPeriod: 3600000, // 1 hour
            maxFailures: 3,
            primaryProvider: "OpenAI",
            fallbackProvider: "Local Model"
          },
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error fetching AI provider status:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch AI provider status', 
        isLoading: false 
      });
    }
  },
  
  // Admin-only: Force a specific provider mode
  toggleFallbackMode: async (useFallback?: boolean) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/ai/toggle-fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ useFallback })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle AI provider: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error toggling AI provider');
      }
      
      // Refetch the status after toggle
      const statusResponse = await fetch('/api/ai/fallback-status');
      const statusData = await statusResponse.json();
      
      if (statusData.success) {
        set({ status: statusData.status, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error toggling AI provider:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to toggle AI provider', 
        isLoading: false 
      });
    }
  },
  
  // Admin-only: Reset the fallback system and clear any failure counters
  resetFallbackSystem: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/ai/reset-fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reset fallback system: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error resetting fallback system');
      }
      
      // Update the status with the response from the reset
      set({ 
        status: data.status, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error resetting fallback system:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset fallback system', 
        isLoading: false 
      });
    }
  }
}));

// Utility function to get a human-readable status message (for admin use only)
export function getProviderStatusMessage(status: AIProviderStatus | null): string {
  if (!status) {
    return 'AI provider status unknown';
  }
  
  const provider = status.useFallback ? status.fallbackProvider : status.primaryProvider;
  const mode = status.useFallback ? 'fallback' : 'primary';
  
  return `Using ${provider} (${mode} mode)${status.failureCount > 0 ? 
    ` - ${status.failureCount} recent failures` : 
    ''}`;
}

// Hook for monitoring AI provider status (admin use only)
export function useAIProviderStatus() {
  const { status, isLoading, error, fetchStatus, toggleFallbackMode, resetFallbackSystem } = useAIProviderStore();
  
  return {
    status,
    isLoading,
    error,
    fetchStatus,
    toggleFallbackMode,
    resetFallbackSystem,
    statusMessage: getProviderStatusMessage(status)
  };
}

/**
 * Performs a health check on the AI system and resets it if needed
 * This is used to prevent accumulated failures from permanently 
 * triggering the fallback system
 */
export const performAIHealthCheck = async (): Promise<{
  action: 'reset_performed' | 'none_needed';
  previousStatus?: any;
  currentStatus?: any;
  message: string;
  success: boolean;
}> => {
  try {
    const response = await fetch('/api/ai/health-check');
    if (!response.ok) {
      throw new Error('Failed to perform AI health check');
    }
    const data = await response.json();
    
    if (data.action === 'reset_performed') {
      console.log('AI system was automatically reset during health check', data);
    }
    
    return data;
  } catch (error) {
    console.error('Error performing AI health check:', error);
    return {
      success: false,
      message: 'Health check failed',
      action: 'none_needed'
    };
  }
};