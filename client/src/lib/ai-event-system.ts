import { create } from 'zustand';

interface AIEventState {
  formFillData: Record<string, any> | null;
  activeGuideSection: string | null;
  activeFeature: {
    name: string;
    params: Record<string, any>;
  } | null;
  setFormFillData: (data: Record<string, any> | null) => void;
  setActiveGuideSection: (section: string | null) => void;
  setActiveFeature: (feature: { name: string; params: Record<string, any>; } | null) => void;
}

export const useAIEventStore = create<AIEventState>((set) => ({
  formFillData: null,
  activeGuideSection: null,
  activeFeature: null,
  setFormFillData: (data) => set({ formFillData: data }),
  setActiveGuideSection: (section) => set({ activeGuideSection: section }),
  setActiveFeature: (feature) => set({ activeFeature: feature }),
}));

// Initialize event listeners
export function initializeAIEventSystem() {
  window.addEventListener('ai-form-fill', ((event: CustomEvent) => {
    useAIEventStore.getState().setFormFillData(event.detail);
  }) as EventListener);

  window.addEventListener('show-guide-section', ((event: CustomEvent) => {
    useAIEventStore.getState().setActiveGuideSection(event.detail.section);
  }) as EventListener);

  window.addEventListener('trigger-feature', ((event: CustomEvent) => {
    useAIEventStore.getState().setActiveFeature({
      name: event.detail.feature,
      params: event.detail.params
    });
  }) as EventListener);
}

// Hook for components to use
export function useAIEvents() {
  const store = useAIEventStore();
  
  return {
    formFillData: store.formFillData,
    activeGuideSection: store.activeGuideSection,
    activeFeature: store.activeFeature,
    clearFormFillData: () => store.setFormFillData(null),
    clearActiveGuideSection: () => store.setActiveGuideSection(null),
    clearActiveFeature: () => store.setActiveFeature(null),
  };
}
