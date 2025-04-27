# Jungle Path Development Rulebook

This rulebook establishes strict guidelines for implementing and maintaining the Jungle Path gamification system. All developers working on the project must adhere to these rules.

## Core Implementation Rules

### Rule 1: Never Mix Terminology Systems

❌ **Forbidden**: "Complete this lesson to earn jungle points"  
✅ **Correct**: "Complete this quest to earn expedition tokens"

Maintain the immersive jungle narrative by using adventure terminology consistently. Never mix standard educational terms with jungle terms within the same interface element.

### Rule 2: Component Integrity

❌ **Forbidden**: `<QuestCard title="Budget Basics" progress={50} />`  
✅ **Correct**: `<QuestCard quest={questData} progress={50} isUnlocked={true} />`

Always pass the full quest object to components and let the component handle transformation internally. Never transform only parts of the data manually.

### Rule 3: Theme Management

❌ **Forbidden**: `document.body.classList.add('jungle-theme')`  
✅ **Correct**: `const { enableJungleTheme } = useJungleTheme()`

All theme changes must be managed through the ThemeContext system. Never manually add or remove theme classes.

### Rule 4: Color System Adherence

❌ **Forbidden**: `className="text-green-500 bg-yellow-300"`  
✅ **Correct**: `className="text-[#1E4A3D] bg-[#E6B933]"` or `className={zoneStyle.textClass}`

Always use the exact hex codes from the jungle theme palette or the utility functions. Never use non-jungle colors for themed components.

### Rule 5: Content Transformation

❌ **Forbidden**: Manually writing jungle-style descriptions  
✅ **Correct**: `const { title, description } = useQuestMapper(originalTitle, originalDescription, category)`

All content transformation must use the established mapping utilities. Never hardcode transformed content.

## Visual Design Rules

### Rule 6: Zone Consistency

❌ **Forbidden**: Mixing color schemes within a zone  
✅ **Correct**: Using zone-specific styling provided by `getZoneStyle(category)`

Each jungle zone must maintain its unique visual identity. Components within the same zone must use consistent styling.

### Rule 7: Animation Usage

❌ **Forbidden**: Custom animations that don't match the jungle theme  
✅ **Correct**: `className="animate-[floraMovement_4s_ease-in-out_infinite]"`

Only use the predefined animations from `JUNGLE_ANIMATIONS`. Never create one-off animations that break visual consistency.

### Rule 8: Responsive Behavior

❌ **Forbidden**: Fixed pixel measurements that break on mobile  
✅ **Correct**: Percentage/viewport units and responsive breakpoints

All jungle-themed components must be fully responsive. The map must provide an alternative card-based view on mobile.

### Rule 9: Typography Rules

❌ **Forbidden**: Using exotic fonts or inconsistent text sizes  
✅ **Correct**: Following the typography scale in the style guide

Typography must follow the established hierarchy. Never introduce new font families or drastically different text sizes.

## Interaction Rules

### Rule 10: Companion Integration

❌ **Forbidden**: Showing companion tips without context  
✅ **Correct**: `const tip = getZoneTip(currentZone)`

Companion interactions must be contextually appropriate. Never show generic tips when zone-specific ones are available.

### Rule 11: Feedback Consistency

❌ **Forbidden**: Mixing feedback styles between components  
✅ **Correct**: Using consistent toast/dialog styles from the system

All user feedback must use the same visual language. Celebration moments, error messages, and hints should feel part of the same world.

### Rule 12: Progressive Disclosure

❌ **Forbidden**: Overwhelming users with all jungle elements at once  
✅ **Correct**: Introducing elements gradually as users progress

Follow the rank-based unlocking system. Never show advanced jungle features to beginners.

### Rule 13: Accessibility Requirements

❌ **Forbidden**: Relying solely on color or animation for meaning  
✅ **Correct**: Using multiple indicators (color + icon + text)

All jungle elements must be accessible. Never implement features that exclude users with disabilities.

## Development Process Rules

### Rule 14: Component Documentation

❌ **Forbidden**: Undocumented component props or behavior  
✅ **Correct**: Complete JSDoc comments on all exported components

Every component must be fully documented. Include prop descriptions, usage examples, and edge cases.

### Rule 15: Style Guide Compliance

❌ **Forbidden**: Creating components that don't match the style guide  
✅ **Correct**: Using the QA checklist before PR submission

All new components must pass the style guide checklist. Never merge code that breaks visual consistency.

### Rule 16: Performance Budget

❌ **Forbidden**: Heavy animations or large SVGs that impact performance  
✅ **Correct**: Optimized assets and animation throttling when needed

Maintain performance standards. Components should never significantly impact page load or interaction times.

### Rule 17: Implementation Phases

❌ **Forbidden**: Skipping implementation phases or rushing features  
✅ **Correct**: Following the established phase sequence

Respect the phased rollout plan. Never deploy features from a later phase before earlier phases are complete.

## Code Organization Rules

### Rule 18: Directory Structure

❌ **Forbidden**: Placing jungle components outside the jungle-path directory  
✅ **Correct**: Maintaining proper folder organization

All jungle-related code must live in the designated directory structure. Never scatter components throughout the codebase.

### Rule 19: Import Rules

❌ **Forbidden**: `import { JungleMap } from '../../jungle-path/components/map/JungleMap'`  
✅ **Correct**: `import { JungleMap } from '@/jungle-path'`

Always use the main index exports. Never import directly from internal jungle-path folders.

### Rule 20: Model Extension

❌ **Forbidden**: Creating parallel data structures that duplicate existing models  
✅ **Correct**: Extending existing models with jungle properties

The jungle system should extend rather than replace the existing data model. Never create completely separate data structures.

## Enforcement

These rules will be enforced through:

1. Automated PR checks that validate compliance
2. Style guide audits during code review
3. Regular visual consistency tests
4. User testing to verify immersion
5. Performance regression testing

Exceptions to these rules require explicit approval from the project lead and must be documented in the PR.