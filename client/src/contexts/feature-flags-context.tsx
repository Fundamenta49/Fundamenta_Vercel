import React, { createContext, useContext, ReactNode } from 'react';

type FeatureFlags = {
  // UI Component Flags
  USE_STANDARD_CARDS: boolean;
  USE_STANDARD_TABS: boolean;
  USE_STANDARD_DIALOGS: boolean;
  USE_STANDARD_SEARCH: boolean;
  USE_STANDARD_MOBILE_SCROLL: boolean;
  
  // Section Standardization Flags
  UI_STANDARDIZE_FINANCIAL: boolean;
  UI_STANDARDIZE_CAREER: boolean;
  UI_STANDARDIZE_WELLNESS: boolean;
  UI_STANDARDIZE_EMERGENCY: boolean;
  UI_STANDARDIZE_EDUCATION: boolean;
};

const defaultFlags: FeatureFlags = {
  // Enable all component standardization flags
  USE_STANDARD_CARDS: true,
  USE_STANDARD_TABS: true,
  USE_STANDARD_DIALOGS: true,
  USE_STANDARD_SEARCH: true,
  USE_STANDARD_MOBILE_SCROLL: true,
  
  // Enable section standardization flags for testing
  UI_STANDARDIZE_FINANCIAL: true,
  UI_STANDARDIZE_CAREER: true,
  UI_STANDARDIZE_WELLNESS: true,
  UI_STANDARDIZE_EMERGENCY: true,
  UI_STANDARDIZE_EDUCATION: true,
};

const FeatureFlagsContext = createContext<FeatureFlags>(defaultFlags);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  // This could be expanded to load from localStorage, API, etc.
  // For now, use a simple static configuration
  const flags = defaultFlags;
  
  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagsContext);
}