import { create } from 'zustand';

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

// Store for AI provider preference and status
interface AIProviderState {
  isLoading: boolean;
  status: AIProviderStatus | null;
  error: string | null;
  
  fetchStatus: () => Promise<void>;
  toggleFallbackMode: (useFallback?: boolean) => Promise<void>;
}

// Create the store with Zustand
export const useAIProviderStore = create<AIProviderState>((set) => ({
  isLoading: false,
  status: null,
  error: null,
  
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

// Utility function to get a human-readable status message
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

// Hook for easily accessing the status message
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