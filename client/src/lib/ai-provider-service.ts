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
      const response = await fetch('/api/ai/fallback-status');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch AI provider status: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error fetching AI provider status');
      }
      
      set({ status: data.status, isLoading: false });
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
  const { status, isLoading, error, fetchStatus, toggleFallbackMode } = useAIProviderStore();
  
  return {
    status,
    isLoading,
    error,
    fetchStatus,
    toggleFallbackMode,
    statusMessage: getProviderStatusMessage(status)
  };
}