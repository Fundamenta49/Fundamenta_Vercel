# Git Workflow for UI Standardization

This document outlines a safe git workflow for standardizing UI components across the Fundamenta platform based on the Yoga section design patterns.

## Branch Structure

```
main
└── ui-standardization-base (base branch with shared components)
    ├── ui-std-shared-components (standardized shared components only)
    ├── ui-std-financial (financial section standardization)
    ├── ui-std-career (career section standardization)
    ├── ui-std-wellness (wellness section standardization)
    └── ui-std-emergency (emergency section standardization)
```

## Workflow Steps

### 1. Create Base Branch

```bash
# Start with a fresh checkout of main
git checkout main
git pull

# Create base branch for UI standardization
git checkout -b ui-standardization-base
```

### 2. Create Standard Component Library

```bash
# Create a branch specifically for standard components
git checkout ui-standardization-base
git checkout -b ui-std-shared-components

# Make changes to create standard component library
# Commit frequently with descriptive messages
git add .
git commit -m "Add StandardCard component based on Yoga pattern"
```

The standard component library should include:
- `StandardCard.tsx`
- `MobileScroller.tsx` 
- `SearchBar.tsx`
- `TabNavPills.tsx`
- `DialogPopover.tsx`

### 3. Test Standard Components in Isolation

```bash
# Create a test page to verify components
git add client/src/pages/component-test.tsx
git commit -m "Add component test page for standardized UI"

# Test thoroughly, then merge back to base
git checkout ui-standardization-base
git merge ui-std-shared-components
```

### 4. Create Feature Flag System

Implement a simple feature flag system to enable/disable new UI components:

```tsx
// In client/src/contexts/feature-flags-context.tsx
import React, { createContext, useContext, ReactNode } from 'react';

type FeatureFlags = {
  USE_STANDARD_CARDS: boolean;
  USE_STANDARD_TABS: boolean;
  USE_STANDARD_DIALOGS: boolean;
  UI_STANDARDIZE_FINANCIAL: boolean;
  UI_STANDARDIZE_CAREER: boolean;
  UI_STANDARDIZE_WELLNESS: boolean;
  UI_STANDARDIZE_EMERGENCY: boolean;
};

const defaultFlags: FeatureFlags = {
  USE_STANDARD_CARDS: true,
  USE_STANDARD_TABS: true,
  USE_STANDARD_DIALOGS: true,
  UI_STANDARDIZE_FINANCIAL: false,
  UI_STANDARDIZE_CAREER: false,
  UI_STANDARDIZE_WELLNESS: false,
  UI_STANDARDIZE_EMERGENCY: false,
};

const FeatureFlagsContext = createContext<FeatureFlags>(defaultFlags);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  // Could be expanded to load from localStorage, API, etc.
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
```

### 5. Implement Section by Section

For each section (example: Financial):

```bash
# Create a branch for financial section standardization
git checkout ui-standardization-base
git checkout -b ui-std-financial

# Make changes to standardize financial components
# Use feature flags to conditionally render new components
git add .
git commit -m "Standardize financial calculator UI"

# Take screenshots before and after for verification
# Make more changes and commits as needed
```

### 6. Test Each Section Thoroughly

For each section branch:
1. Start the app and verify all components on desktop and mobile
2. Create screenshots documenting before/after
3. Test all functionality to ensure it still works

### 7. Merge and Update Feature Flags

After successful testing:

```bash
# Merge to base branch
git checkout ui-standardization-base
git merge ui-std-financial

# Update feature flags to enable the section
# Edit client/src/contexts/feature-flags-context.tsx
# Set UI_STANDARDIZE_FINANCIAL to true
```

### 8. Repeat for Each Section

Follow the same pattern for each section of the app:
1. Create section branch from base
2. Implement standardized components using feature flags
3. Test thoroughly
4. Merge back to base
5. Update feature flags

### 9. Safe Deployment Strategy

Once you have multiple sections standardized:

1. Deploy to a staging environment if available
2. Test entire flow across sections
3. If issues appear, disable problematic sections via feature flags
4. Make fixes in specific section branches
5. Merge and test again

### 10. Final Merge to Main

When all sections are standardized and tested:

```bash
git checkout main
git merge ui-standardization-base
```

## Rollback Strategy

If issues are discovered after deployment:

1. Use feature flags to disable problematic sections
2. Create a fix in a dedicated branch
3. Test and merge

If emergency rollback is needed:

```bash
# Revert the merge commit
git revert -m 1 <merge-commit-hash>
```

## Resources and Documentation

For each section branch, maintain documentation in:
- `ui-std-[section]/README.md` - Documentation of changes
- `ui-std-[section]/screenshots/` - Before/after screenshots

## Verification Checklist

Before merging any branch:

- [ ] Test on mobile viewport (320px width)
- [ ] Test on tablet viewport (768px width)
- [ ] Test on desktop viewport (1280px width)
- [ ] Verify all interactive elements function correctly
- [ ] Ensure no text overlaps or overflows containers
- [ ] Verify modals/dialogs position correctly
- [ ] Check responsive layouts at various breakpoints