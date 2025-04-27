# Jungle Path: Quick Start Guide

This guide provides a rapid overview of implementing the Jungle Path gamification system in your application.

## What is Jungle Path?

Jungle Path transforms standard learning modules into an adventure-themed journey through a mysterious jungle. Users progress through explorer ranks, complete quests (instead of courses), and are guided by animal companions.

## Key Benefits

- **Increased Engagement**: Adventure framing makes learning more compelling
- **Clearer Progression**: Visual journey map shows learning path
- **Built-in Motivation**: Jungle ranks and achievements provide regular rewards
- **Thematic Consistency**: Complete visual design system maintains immersion
- **Minimal Refactoring**: Works as a layer on top of existing content

## 5-Minute Implementation

1. **Add Theme Provider**

```jsx
// In App.tsx or index.tsx
import { JungleThemeProvider } from '@/jungle-path';

function App() {
  return (
    <JungleThemeProvider>
      {/* Your app */}
    </JungleThemeProvider>
  );
}
```

2. **Add Theme Toggle**

```jsx
// In settings or user preferences component
import { useJungleTheme } from '@/jungle-path';

function Settings() {
  const { isJungleTheme, toggleTheme } = useJungleTheme();
  
  return (
    <div>
      <input 
        type="checkbox" 
        checked={isJungleTheme} 
        onChange={toggleTheme} 
      />
      <label>Enable Jungle Adventure Theme</label>
    </div>
  );
}
```

3. **Transform Learning Cards**

```jsx
// In your learning modules page
import { QuestCard, useQuestMapper } from '@/jungle-path';

function transformedModuleCard({ module }) {
  const { title, description } = useQuestMapper(
    module.title, 
    module.description, 
    module.category
  );
  
  return (
    <QuestCard
      quest={{
        id: module.id,
        jungleTitle: title,
        jungleDescription: description,
        category: module.category,
        // other properties
      }}
      progress={module.progress}
      isUnlocked={true}
      isCompleted={module.completed}
    />
  );
}
```

4. **Add Rank Display**

```jsx
// In user profile or dashboard
import { RankProgress } from '@/jungle-path';

function UserProfile({ userRank }) {
  return (
    <div>
      <RankProgress userRank={userRank} />
    </div>
  );
}
```

## Core Components

| Component | Purpose | Example Usage |
|-----------|---------|---------------|
| `JungleMap` | Interactive zone navigation | `<JungleMap userRank={3} zoneProgress={progressData} />` |
| `QuestCard` | Themed learning module card | `<QuestCard quest={questData} progress={75} isUnlocked={true} />` |
| `RankProgress` | Shows user's explorer rank | `<RankProgress userRank={userRankData} />` |
| `CompanionCard` | Animal guide character card | `<CompanionCard companion={companionData} isUnlocked={true} isActive={false} />` |

## Essential Hooks

| Hook | Purpose | Example Usage |
|------|---------|---------------|
| `useJungleTheme()` | Access theme state and controls | `const { isJungleTheme, toggleTheme } = useJungleTheme()` |
| `useQuestMapper()` | Transform content to jungle theme | `const { title, description } = useQuestMapper(origTitle, origDesc, category)` |
| `useJungleRank()` | Get rank info and progression | `const { rankData, nextRankProgress } = useJungleRank(userProgress)` |
| `useCompanion()` | Access companion system | `const { activeCompanion, setActiveCompanion } = useCompanion()` |

## Theme-Based Conditional Rendering

```jsx
import { useJungleTheme } from '@/jungle-path';

function MyComponent() {
  const { isJungleTheme } = useJungleTheme();
  
  return (
    <div>
      {isJungleTheme ? (
        <h1>Welcome to the Jungle Expedition!</h1>
      ) : (
        <h1>Welcome to the Learning Platform</h1>
      )}
      
      {/* Content that appears regardless of theme */}
      <div>{/* ... */}</div>
      
      {/* Jungle-specific elements */}
      {isJungleTheme && (
        <JungleThemeElements />
      )}
    </div>
  );
}
```

## Mobile Considerations

- The `JungleMap` component automatically provides a card-based alternative view on mobile devices
- All components are responsive and touch-friendly
- Test touch targets (44×44px minimum) for all interactive elements
- Consider simplified views for very small screens

## Next Steps

After this quick implementation:

1. Review the comprehensive `JUNGLE_STYLE_GUIDE.md` document
2. Explore the complete API in `JUNGLE_PATH_IMPLEMENTATION.md`
3. Follow integration steps in `JUNGLE_PATH_INTEGRATION_GUIDE.md`
4. Adhere to development rules in `JUNGLE_PATH_RULEBOOK.md`

## Common Questions

**Q: Do I need to rewrite existing components?**  
A: No, jungle components can conditionally replace or wrap existing ones.

**Q: Will this impact performance?**  
A: The impact is minimal. Components are optimized and only load when the jungle theme is active.

**Q: How do I handle users who don't want the jungle theme?**  
A: The theme is opt-in. Use `isJungleTheme` to conditionally render the appropriate interface.

**Q: Can I customize the jungle theme?**  
A: Yes, but stay within the established style guide. Core colors and terminology should remain consistent.

**Q: How do I add new quest mappings?**  
A: Update the `questMapper.ts` file to include new module title transformations.

## Quick Tips

- Start with the theme toggle and one component to test integration
- Remember that all content transformation happens at the display layer, not the data layer
- Use the `compact` prop for smaller UI areas
- Follow the phase-based implementation approach for a smooth rollout