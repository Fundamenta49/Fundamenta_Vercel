# Jungle Path: Style Guide & Implementation Rulebook

## 1. Visual Identity

### Color System

**Primary Palette**
- **Jungle Green** (#1E4A3D): Primary background, headers, navigation
- **River Blue** (#3B82C4): Water elements, progress bars, interactive elements
- **Temple Gold** (#E6B933): Highlights, achievements, special elements
- **Sunset Orange** (#E67E33): Alerts, important actions, energy indicators

**Secondary Palette**
- **Canopy Light** (#94C973): Success states, growth indicators
- **Stone Gray** (#8B8682): Neutral elements, secondary text
- **Shadow Purple** (#724E91): Mystery elements, locked content
- **Clay Red** (#C24D4D): Warning elements, challenge indicators

**Usage Rules**
1. Always use the defined color variables, never hardcode HEX values
2. Maintain proper contrast ratios (4.5:1 minimum) for accessibility
3. Use Temple Gold sparingly for emphasis and rewards only
4. Apply color consistently across related elements

### Typography

**Hierarchy**
- **H1 (Main Headers)**: 2rem, bold, Jungle Green, optional text-shadow
- **H2 (Section Headers)**: 1.5rem, semibold, Jungle Green
- **H3 (Card Headers)**: 1.25rem, semibold, depends on zone
- **Body Text**: 1rem, regular, dark gray (#333)
- **Small Text/Captions**: 0.875rem, light gray (#666)

**Styling Rules**
1. Use system fonts with consistent class-based styling
2. Apply letter-spacing (0.02em) to headings for the "adventure" feel
3. Maintain readable contrast on all backgrounds
4. Use jungle-themed terms in headings when appropriate

### Iconography

**System**
- Primary source: Lucide icon library
- Secondary options: Simple SVG icons with jungle theme

**Themed Icons by Category**
- **Finance**: Gold coins, treasure chests, gem icons
- **Wellness**: Leaves, water drops, sun symbols
- **Fitness**: Mountains, footprints, campfire
- **Career**: Maps, compass, ancient scrolls
- **Emergency**: Shelters, shields, warning symbols

**Icon Usage Rules**
1. Maintain consistent size within context (24px navigation, 20px cards, etc.)
2. Apply appropriate colors based on zone and function
3. Use outlined style for navigation, filled for active/completed states
4. Include appropriate aria-labels for accessibility

## 2. Interface Components

### Zone Map

**Visual Structure**
- Divided into 5-7 distinct biomes corresponding to skill categories
- Connected by paths showing progression requirements
- Current zone highlighted, completed zones marked with flags/camps
- Locked zones partially obscured or grayed out

**Interaction Rules**
1. All zones must be keyboard-navigable
2. Tooltip information appears on hover/focus
3. Clear visual feedback on click/tap
4. Consistent transitions between zones

### Quest Cards

**Structure**
- Consistent card dimensions (responsive but maintaining proportions)
- Clear visual hierarchy: Title → Description → Progress → Action
- Zone-specific styling (color accents, icons)
- Status indicators (available, in-progress, completed, locked)

**Content Rules**
1. All titles must follow the jungle narrative convention
2. Descriptions limited to 1-2 sentences
3. Always include progress indicator
4. Use consistent action button language

### Rank Badges

**Visual System**
- Circular base design with increasing complexity by rank
- Distinct color scheme for each rank level
- Consistent placement in profile and navigation
- Clear visual hierarchy between ranks

**Implementation Rules**
1. Badges must scale appropriately across viewports
2. Include tooltip explanation of rank requirements
3. Animate transitions between ranks
4. Display partial progress toward next rank

### Companion Elements

**Visual Appearance**
- Consistent avatar size and framing
- Zone-specific styling that matches environment
- Simple expressions/states (neutral, encouraging, celebrating)
- Non-intrusive placement in interface

**Interaction Rules**
1. Companions should never block important content
2. Interaction must be optional (dismissible)
3. Messages limited to 1-2 sentences
4. Appear at contextually appropriate moments

## 3. Narrative Framework

### Terminology & Language

**Core Vocabulary**
- **Quests** (not courses, modules, or lessons)
- **Expeditions** (not programs or curricula)
- **Exploration** (not learning or studying)
- **Discoveries** (not achievements or completions)
- **Provisions** (not resources or materials)

**Voice & Tone**
- Encouraging but not childish
- Adventurous without being overly dramatic
- Clear instructions despite thematic language
- Consistent perspective (second-person: "you discover" not "the user discovers")

**Naming Convention Rules**
1. All module titles must be transformed using the quest mapping system
2. Use active verbs (Navigate, Discover, Forge, etc.)
3. Include jungle-themed location or object
4. Maintain subject clarity despite theming

### Progression Framework

**Rank Progression Rules**
1. **Newcomer** (0-100 points): Basic introduction, limited access
2. **Explorer** (101-300 points): Full map access, basic companions
3. **Pathfinder** (301-600 points): Advanced quests, additional companions
4. **Trailblazer** (601-1000 points): Challenge quests, special rewards
5. **Jungle Guardian** (1001+ points): Master quests, mentor abilities

**Advancement Rules**
1. Clear point thresholds for each rank
2. Celebration moment on rank advancement
3. New privileges/access with each rank
4. Visual indicators of current rank always visible

## 4. Technical Implementation Rules

### Component Architecture

**Structure Rules**
1. Create a dedicated `/jungle-path` folder for all themed components
2. Implement theme toggle at global level
3. Maintain parallel component structure to main app
4. Use consistent naming convention with `Jungle` prefix

**State Management**
1. Store theme preference in user settings
2. Cache map progress for performance
3. Use consistent state management across themed components
4. Maintain separation between theme and functional logic

### CSS Guidelines

**Implementation Approach**
1. Use Tailwind utility classes with consistent patterns
2. Create custom component classes for complex jungle elements
3. Define jungle theme variables in a central configuration
4. Use CSS modules or styled components for complex elements

**Responsive Rules**
1. Design mobile-first with appropriate breakpoints
2. Simplify map on smaller screens (cards instead of geographic)
3. Maintain touch targets of at least 44×44px
4. Test on multiple viewport sizes

### Accessibility Requirements

**Implementation Rules**
1. Maintain WCAG 2.1 AA compliance across all components
2. Include appropriate aria-labels on interactive elements
3. Ensure keyboard navigation for all interactive components
4. Maintain focus management during transitions
5. Provide alternative text for all visual elements
6. Test with screen readers

### Performance Guidelines

**Implementation Rules**
1. Lazy-load map sections not currently in view
2. Optimize images and SVGs for size
3. Implement appropriate caching strategies
4. Avoid expensive animations on lower-end devices
5. Track and optimize render performance

## 5. Quality Assurance Checklist

Before implementing any component, verify:

1. **Visual Consistency**
   - Follows color palette rules
   - Uses correct typography
   - Matches zone-specific styling
   - Properly implements iconography

2. **Narrative Consistency**
   - Uses appropriate jungle terminology
   - Maintains adventure tone
   - Follows naming conventions
   - Aligns with progression framework

3. **Technical Quality**
   - Follows component architecture
   - Implements responsive design
   - Meets accessibility requirements
   - Performs efficiently

4. **User Experience**
   - Provides clear feedback
   - Maintains intuitive navigation
   - Presents consistent interactions
   - Supports progressive disclosure

## 6. Implementation Process

For each new feature or component:

1. Reference this guide before beginning development
2. Create a component spec that shows compliance with rules
3. Develop according to the guidelines
4. Test against the quality assurance checklist
5. Document any approved exceptions to the rules