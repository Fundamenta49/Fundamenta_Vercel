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
  // Start with component flags enabled for testing but section flags disabled
  USE_STANDARD_CARDS: true,
  USE_STANDARD_TABS: true,
  USE_STANDARD_DIALOGS: true,
  USE_STANDARD_SEARCH: true,
  USE_STANDARD_MOBILE_SCROLL: true,
  
  UI_STANDARDIZE_FINANCIAL: false,
  UI_STANDARDIZE_CAREER: false,
  UI_STANDARDIZE_WELLNESS: false,
  UI_STANDARDIZE_EMERGENCY: false,
  UI_STANDARDIZE_EDUCATION: false,
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