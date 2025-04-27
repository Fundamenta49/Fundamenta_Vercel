# Jungle Path Integration Guide

This guide provides step-by-step instructions for integrating the Jungle Path gamification system into the existing Fundamenta application.

## Step 1: Theme Provider Integration

Add the Jungle Theme Provider to your application's root component:

```jsx
// In client/src/App.tsx
import { JungleThemeProvider } from './jungle-path';

function App() {
  return (
    <JungleThemeProvider>
      {/* Existing app structure */}
    </JungleThemeProvider>
  );
}
```

## Step 2: Theme Toggle in User Settings

Add the jungle theme toggle to the user settings page:

```jsx
// In client/src/components/account-settings.tsx
import { useJungleTheme } from '@/jungle-path';

// Inside your settings component
const { isJungleTheme, toggleTheme } = useJungleTheme();

// Add this to your form
<div className="flex items-center space-x-2 py-4">
  <Switch
    id="jungle-theme"
    checked={isJungleTheme}
    onCheckedChange={toggleTheme}
  />
  <Label htmlFor="jungle-theme">
    Enable Jungle Adventure Theme
  </Label>
  <InfoPopover>
    Transform your learning experience into an adventure through a mysterious jungle.
    This theme reimagines learning paths as quests and tracks your progress as you
    explore different skill zones.
  </InfoPopover>
</div>
```

## Step 3: Arcade Page Transformation

Update the arcade page to use jungle-themed components:

```jsx
// In client/src/pages/arcade.tsx
import {
  useJungleTheme,
  RankProgress,
  QuestList,
  useQuestProgress,
  useJungleRank
} from '@/jungle-path';

// Inside your component
const { isJungleTheme } = useJungleTheme();
const { jungleQuests, questProgress, zoneProgress } = useQuestProgress(
  ACHIEVEMENTS, 
  userProgress
);
const { userRank } = useJungleRank(userProgress);

// Conditional rendering based on theme
{isJungleTheme ? (
  <RankProgress userRank={userRank} />
) : (
  <RankCard userProgress={userProgress} />
)}

// Replace achievement cards with quest cards when jungle theme is active
{isJungleTheme ? (
  <QuestList
    quests={jungleQuests}
    userAchievements={questProgress}
    userRank={userRank.level}
    showFilters={true}
  />
) : (
  // Original achievement cards
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {filteredAchievements.map(achievement => (
      <AchievementCard
        key={achievement.id}
        achievement={achievement}
        userProgress={userProgress}
      />
    ))}
  </div>
)}
```

## Step 4: Create Jungle Map Page

Add a new jungle map page that's accessible when the jungle theme is active:

```jsx
// In client/src/pages/jungle-map.tsx
import { useJungleTheme, JungleMap, ZoneCard, useQuestProgress } from '@/jungle-path';
import { useNavigate } from 'wouter';
import { ACHIEVEMENTS, createSampleUserProgress } from '@/shared/arcade-schema';

export default function JungleMapPage() {
  const { isJungleTheme } = useJungleTheme();
  const navigate = useNavigate();
  const userProgress = createSampleUserProgress('user1');
  
  const { zoneProgress } = useQuestProgress(
    ACHIEVEMENTS,
    userProgress
  );
  
  // Redirect if jungle theme isn't active
  useEffect(() => {
    if (!isJungleTheme) {
      navigate('/arcade');
    }
  }, [isJungleTheme, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Jungle Map</h1>
      <p className="text-muted-foreground mb-6">
        Navigate the mysterious jungle and discover new skills in different zones. 
        Your journey is just beginning!
      </p>
      
      <JungleMap
        userRank={userProgress.rank.level}
        zoneProgress={zoneProgress}
      />
      
      <h2 className="text-xl font-bold mt-10 mb-4">Explore Zones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getAllZones().map(zone => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            progress={zoneProgress[zone.category]}
            isUnlocked={isZoneUnlocked(zone.category, userProgress.rank.level)}
            questCount={jungleQuests.filter(q => q.category === zone.category).length}
            completedQuests={Object.entries(questProgress)
              .filter(([id, data]) => 
                data.unlockedAt !== null && 
                jungleQuests.find(q => q.id === id)?.category === zone.category
              ).length
            }
          />
        ))}
      </div>
    </div>
  );
}
```

## Step 5: Add Navigation Link

Add a conditional jungle map link to the navigation when the theme is active:

```jsx
// In client/src/components/navigation.tsx
import { useJungleTheme } from '@/jungle-path';

// Inside your component
const { isJungleTheme } = useJungleTheme();

// Add this to your navigation links
{isJungleTheme && (
  <Link href="/jungle-map">
    <a className="flex items-center gap-2 px-3 py-2 text-sm">
      <Map className="h-4 w-4" />
      <span>Jungle Map</span>
    </a>
  </Link>
)}
```

## Step 6: Companion Integration

Add the companion system to your app layout:

```jsx
// In client/src/components/layout.tsx
import {
  CompanionProvider,
  CompanionDialog,
  CompanionCard,
  useCompanion,
  useJungleTheme
} from '@/jungle-path';

// Inside your layout component
const { isJungleTheme } = useJungleTheme();

// Wrap the app content
return (
  <>
    {isJungleTheme ? (
      <CompanionProvider
        userAchievements={Object.keys(userProgress.achievements)
          .filter(id => userProgress.achievements[id].unlockedAt !== null)
        }
        userTier="free" // or match user's subscription tier
      >
        <MainLayout>
          {children}
        </MainLayout>
        <CompanionDialogManager />
      </CompanionProvider>
    ) : (
      <MainLayout>
        {children}
      </MainLayout>
    )}
  </>
);

// Create a companion dialog manager
function CompanionDialogManager() {
  const { activeCompanion, dialogVisible, hideCompanionDialog } = useCompanion();
  
  if (!activeCompanion || !dialogVisible) return null;
  
  return (
    <CompanionDialog
      isOpen={dialogVisible}
      onClose={hideCompanionDialog}
      companion={activeCompanion}
    />
  );
}
```

## Step 7: Add Companion Selection Page

Create a page for managing jungle companions:

```jsx
// In client/src/pages/jungle-companions.tsx
import { useJungleTheme, CompanionCard, useCompanion } from '@/jungle-path';
import { useNavigate } from 'wouter';

export default function JungleCompanionsPage() {
  const { isJungleTheme } = useJungleTheme();
  const navigate = useNavigate();
  const { companions, activeCompanion, setActiveCompanion } = useCompanion();
  
  // Redirect if jungle theme isn't active
  useEffect(() => {
    if (!isJungleTheme) {
      navigate('/arcade');
    }
  }, [isJungleTheme, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Jungle Companions</h1>
      <p className="text-muted-foreground mb-6">
        Meet the animal guides who will accompany you on your jungle adventure.
        Each companion specializes in different areas of your journey.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companions.map(companion => (
          <CompanionCard
            key={companion.id}
            companion={companion}
            isUnlocked={true}
            isActive={activeCompanion?.id === companion.id}
            onSelect={setActiveCompanion}
          />
        ))}
      </div>
    </div>
  );
}
```

## Step 8: Update Learning Pages

Enhance learning pages with quest theming:

```jsx
// In client/src/pages/learning/{specific-page}.tsx
import { useJungleTheme, QuestProgress, useQuestProgress } from '@/jungle-path';
import { ACHIEVEMENTS } from '@/shared/arcade-schema';

// Inside your component
const { isJungleTheme } = useJungleTheme();
const { jungleQuests, questProgress, recommendedQuests } = useQuestProgress(
  ACHIEVEMENTS,
  userProgress
);

// Find the current quest
const currentPageId = 'page-specific-id'; // Replace with actual ID logic
const currentQuest = jungleQuests.find(q => q.id === currentPageId);

// Add this to your page header area
{isJungleTheme && currentQuest && (
  <div className="mb-6">
    <QuestProgress
      quest={currentQuest}
      userProgress={questProgress[currentPageId]?.progress || 0}
      nextQuests={recommendedQuests.slice(0, 2)}
    />
  </div>
)}
```

## Step 9: Add Rank Celebration

Implement the rank up celebration dialog:

```jsx
// In client/src/pages/arcade.tsx or your app layout
import { useJungleTheme, RankUpCelebration, useJungleRank } from '@/jungle-path';

// Inside your component
const { isJungleTheme } = useJungleTheme();
const { 
  userRank, 
  showRankUpCelebration, 
  hideRankUpCelebration,
  previousRank 
} = useJungleRank(userProgress);

// Add this at the end of your component
{isJungleTheme && (
  <RankUpCelebration
    isOpen={showRankUpCelebration}
    onClose={hideRankUpCelebration}
    previousRank={previousRank}
    newRank={userRank.level}
  />
)}
```

## Step 10: Integration Testing

Create a test plan to verify the integration:

1. Toggle jungle theme on/off in user settings
2. Verify arcade page transitions correctly
3. Navigate through the jungle map
4. Test companion interaction
5. Complete an achievement and verify quest styling
6. Test rank progress and celebrations
7. Verify mobile responsiveness

## Troubleshooting

### Theme Not Applying

Verify that:
- `JungleThemeProvider` is properly placed at the app root
- `useJungleTheme()` is called within the provider's children
- CSS variables are not being overridden by other styles

### Component Rendering Issues

Check for:
- Correct prop types being passed to components
- Missing data in the quest objects
- Zone category matching established categories
- Console errors related to theme components

### Navigation Problems

Ensure that:
- Route definitions are correctly set up
- Conditional rendering is working as expected
- Redirects are handling theme state properly

## Performance Optimizations

- Use React.memo for jungle components that re-render frequently
- Implement skeleton states for map loading
- Consider code-splitting jungle components for initial load performance
- Cache transformed quest data to avoid recalculations