# Jungle Path Implementation Guide

This guide provides technical details for developers implementing the Jungle Path gamification system in the Fundamenta platform.

## Overview

The Jungle Path system transforms standard learning modules into an adventure-themed journey. It provides a complete set of components, hooks, utilities, and data structures to create an immersive gamification experience.

## Directory Structure

```
/client/src/jungle-path/
  /components/      # UI components for the jungle theme
    /map/           # Map visualization components
    /quest/         # Quest (learning module) components
    /companion/     # Animal guide companion components
    /rank/          # User rank/progression components
  /hooks/           # Custom React hooks
  /utils/           # Utility functions
  /contexts/        # React context providers
  /data/            # Data structures and transformations
  /styles/          # Theme and animation definitions
  /demo/            # Demo implementation
  index.ts          # Main export file
```

## Key Implementation Files

| File | Purpose |
|------|---------|
| `styles/theme.ts` | Core color palette and styling rules |
| `styles/animations.ts` | Animation definitions and keyframes |
| `contexts/JungleThemeContext.tsx` | Theme toggle system provider |
| `utils/questMapper.ts` | Transforms module titles to jungle quests |
| `utils/zoneUtils.ts` | Zone/category management utilities |
| `utils/rankCalculator.ts` | User rank calculation functions |
| `data/companions.ts` | Animal companion character definitions |
| `data/zones.ts` | Zone data and map positioning |
| `data/quests.ts` | Quest transformation and relationships |

## Integration Points

### Global Theme Integration

To enable the jungle theme toggle throughout the app:

```jsx
// In your top-level App component
import { JungleThemeProvider } from './jungle-path';

function App() {
  return (
    <JungleThemeProvider>
      {/* Rest of your app */}
    </JungleThemeProvider>
  );
}
```

### User Settings Integration

Add the theme toggle to user settings:

```jsx
// In your settings component
import { useJungleTheme } from './jungle-path';

function UserSettings() {
  const { isJungleTheme, toggleTheme } = useJungleTheme();
  
  return (
    <div>
      <h2>Theme Preferences</h2>
      <div>
        <input 
          type="checkbox" 
          checked={isJungleTheme} 
          onChange={toggleTheme} 
          id="jungle-theme-toggle"
        />
        <label htmlFor="jungle-theme-toggle">
          Enable Jungle Adventure Theme
        </label>
      </div>
    </div>
  );
}
```

### Achievement/Learning Page Integration

Replace standard learning module cards with jungle-themed quest cards:

```jsx
// In your learning modules page
import { QuestList, useQuestProgress } from './jungle-path';
import { ACHIEVEMENTS } from '@/shared/arcade-schema';

function LearningModulesPage({ userProgress }) {
  const { jungleQuests, questProgress } = useQuestProgress(
    ACHIEVEMENTS, 
    userProgress
  );
  
  return (
    <div className="container mx-auto">
      <h1>Learning Paths</h1>
      <QuestList 
        quests={jungleQuests}
        userAchievements={questProgress}
        userRank={userProgress.rank.level}
      />
    </div>
  );
}
```

### User Profile Integration

Add the jungle rank display to the user profile:

```jsx
// In your user profile component
import { RankProgress, useJungleRank } from './jungle-path';

function UserProfile({ userProgress }) {
  const { userRank } = useJungleRank(userProgress);
  
  return (
    <div>
      <h2>Your Progress</h2>
      <RankProgress userRank={userRank} />
      {/* Rest of profile */}
    </div>
  );
}
```

### Companion System Integration

Integrate the animal companion system:

```jsx
// In your app layout
import { 
  CompanionProvider, 
  CompanionDialog, 
  useCompanion
} from './jungle-path';

function AppLayout({ userProgress, children }) {
  // Get unlocked achievements
  const unlockedAchievements = Object.entries(userProgress.achievements)
    .filter(([_, data]) => data.unlockedAt !== null)
    .map(([id]) => id);
  
  return (
    <CompanionProvider 
      userAchievements={unlockedAchievements}
      userTier="tier1" // Based on user subscription
    >
      <MainContent />
      {/* Add this to display the companion dialog */}
      <CompanionDialogManager />
    </CompanionProvider>
  );
}

function CompanionDialogManager() {
  const { 
    activeCompanion, 
    dialogVisible, 
    hideCompanionDialog 
  } = useCompanion();
  
  if (!activeCompanion || !dialogVisible) return null;
  
  return (
    <CompanionDialog
      isOpen={dialogVisible}
      onClose={hideCompanionDialog}
      companion={activeCompanion}
    />
  );
}

function MainContent() {
  const { setActiveCompanion } = useCompanion();
  
  // Later in some component where you want to show the companion
  const handleCompanionClick = (companionId) => {
    setActiveCompanion(companionId);
  };
  
  // ...
}
```

## Map Implementation

The map system represents skill categories as jungle zones:

```jsx
// In a dedicated map page
import { JungleMap, useQuestProgress } from './jungle-path';

function JungleMapPage({ userProgress }) {
  const { zoneProgress } = useQuestProgress(
    ACHIEVEMENTS, 
    userProgress
  );
  
  return (
    <div className="container mx-auto">
      <h1>Your Jungle Journey</h1>
      <JungleMap 
        userRank={userProgress.rank.level}
        zoneProgress={zoneProgress}
      />
    </div>
  );
}
```

## Phased Implementation Approach

For a gradual rollout, follow this sequence:

1. **Phase 1 - Foundation**
   - Integrate `JungleThemeProvider` at the app root
   - Add theme toggle to user settings
   - Implement CSS variable application

2. **Phase 2 - Achievements & Learning**
   - Replace standard achievement cards with `QuestCard` components
   - Implement `QuestList` in learning module pages
   - Add quest mapping translations

3. **Phase 3 - Profile & Progression**
   - Add `RankProgress` component to user profile
   - Implement `RankUpCelebration` for level ups
   - Update user dashboard with jungle theme

4. **Phase 4 - Map & Navigation**
   - Create dedicated jungle map page with `JungleMap`
   - Add zone navigation using `ZoneCard` components
   - Implement path visualization

5. **Phase 5 - Companions**
   - Add `CompanionProvider` to app layout
   - Implement companion selection interface
   - Add contextual tips and encouragement

## Testing

Ensure that all components render properly on different screen sizes:

```jsx
// Example test for a quest card
import { render, screen } from '@testing-library/react';
import { QuestCard } from './jungle-path';

test('renders jungle quest card with correct styling', () => {
  const quest = {
    id: 'test-quest',
    title: 'Test Quest',
    description: 'A test quest',
    category: 'learning',
    // ... other properties
  };
  
  render(
    <QuestCard
      quest={quest}
      progress={50}
      isUnlocked={true}
      isCompleted={false}
    />
  );
  
  const titleElement = screen.getByText(/Test Quest/i);
  expect(titleElement).toBeInTheDocument();
  
  // Check for jungle styling classes
  const cardElement = titleElement.closest('.border-2');
  expect(cardElement).toHaveClass('border-[#724E91]');
});
```

## Performance Considerations

- Lazy load the jungle map on demand
- Use React.memo for frequently rendered components
- Optimize SVG paths in the map for file size
- Cache transformed quest data to avoid re-processing

## Accessibility Compliance

The Jungle Path system is designed to meet WCAG 2.1 AA standards:

- Color contrast meets 4.5:1 minimum ratio
- All interactive elements are keyboard-navigable
- Appropriate aria-labels are provided
- Focus states are clearly visible
- Screen reader compatible messaging

## Fallback Behavior

For users who disable the jungle theme or use assistive technologies:

- All jungle-themed components gracefully fallback to standard styling
- Core functionality remains accessible without visual theming
- Educational content maintains its clarity and effectiveness

## Troubleshooting

Common issues and solutions:

- **Theme not applying**: Check if `JungleThemeProvider` is properly implemented at the app root
- **Quest titles not transforming**: Verify that the category is correctly passed to `useQuestMapper`
- **Map not displaying**: Ensure SVG viewBox dimensions match the defined zone positions
- **Companions not appearing**: Check that user achievements are correctly passed to `CompanionProvider`