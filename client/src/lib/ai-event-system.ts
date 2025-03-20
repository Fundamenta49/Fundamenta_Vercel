import { create } from 'zustand';

interface AIEventState {
  formFillData: Record<string, any> | null;
  activeGuideSection: string | null;
  activeFeature: {
    name: string;
    params: Record<string, any>;
  } | null;
  selectedTopic: string | null;
  focusContent: string | null;
  setFormFillData: (data: Record<string, any> | null) => void;
  setActiveGuideSection: (section: string | null) => void;
  setActiveFeature: (feature: { name: string; params: Record<string, any>; } | null) => void;
  setSelectedTopic: (topic: string | null) => void;
  setFocusContent: (content: string | null) => void;
}

export const useAIEventStore = create<AIEventState>((set) => ({
  formFillData: null,
  activeGuideSection: null,
  activeFeature: null,
  selectedTopic: null,
  focusContent: null,
  setFormFillData: (data) => set({ formFillData: data }),
  setActiveGuideSection: (section) => set({ activeGuideSection: section }),
  setActiveFeature: (feature) => set({ activeFeature: feature }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  setFocusContent: (content) => set({ focusContent: content })
}));

// Global event handler for AI actions
export const handleAIAction = (action: {
  type: string;
  payload: Record<string, any>;
}, navigate: (path: string) => void) => {
  const store = useAIEventStore.getState();

  switch (action.type) {
    case 'navigate':
      if (action.payload.route || action.payload.section) {
        // Update the store state first
        if (action.payload.section) {
          store.setSelectedTopic(action.payload.section);
        }
        if (action.payload.focusContent) {
          store.setFocusContent(action.payload.focusContent);
        }

        // Navigate to the route (if different from current)
        if (action.payload.route && action.payload.route !== '/') {
          navigate(action.payload.route);
        }

        // Notify components about the navigation
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('ai-navigation-complete', {
            detail: {
              section: action.payload.section,
              focusContent: action.payload.focusContent,
              autoFocus: true
            }
          }));
        }, 100);
      }
      break;

    case 'show_guide':
      if (action.payload.guideSection) {
        store.setActiveGuideSection(action.payload.guideSection);
        if (action.payload.focusContent) {
          store.setFocusContent(action.payload.focusContent);
        }

        window.dispatchEvent(new CustomEvent('show-guide-section', {
          detail: {
            section: action.payload.guideSection,
            focusContent: action.payload.focusContent,
            autoFocus: true
          }
        }));
      }
      break;

    case 'fill_form':
      store.setFormFillData(action.payload.formData);
      window.dispatchEvent(new CustomEvent('ai-form-fill', {
        detail: {
          formId: action.payload.formId,
          formData: action.payload.formData,
          autoFocus: true
        }
      }));
      break;

    case 'trigger_feature':
      if (action.payload.feature) {
        store.setActiveFeature({
          name: action.payload.feature,
          params: action.payload
        });

        window.dispatchEvent(new CustomEvent('trigger-feature', {
          detail: {
            feature: action.payload.feature,
            params: action.payload,
            autoOpen: true
          }
        }));
      }
      break;
  }
};

// Hook for components to use
export function useAIEvents() {
  const store = useAIEventStore();

  return {
    formFillData: store.formFillData,
    activeGuideSection: store.activeGuideSection,
    activeFeature: store.activeFeature,
    selectedTopic: store.selectedTopic,
    focusContent: store.focusContent,
    clearFormFillData: () => store.setFormFillData(null),
    clearActiveGuideSection: () => store.setActiveGuideSection(null),
    clearActiveFeature: () => store.setActiveFeature(null),
    clearSelectedTopic: () => store.setSelectedTopic(null),
    clearFocusContent: () => store.setFocusContent(null),
  };
}