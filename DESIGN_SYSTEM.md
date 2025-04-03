# Application Design System

This document outlines the design system and UI/UX protocol for the application to ensure consistency across all components and sections.

## Color Palette

### Primary Colors
- **Primary Red:** `#b91c1c` - Used for emergency sections, warnings, and critical information
- **Primary Blue:** `#3b82f6` - Used for informational elements, learning resources, and navigation
- **Primary Green:** `#10b981` - Used for success states, confirmation, and positive actions

### Neutral Colors
- **Background:** `#ffffff` (Light mode), `#1f2937` (Dark mode)
- **Text Primary:** `#1a202c` (Light mode), `#f3f4f6` (Dark mode)
- **Text Secondary:** `#4b5563` (Light mode), `#9ca3af` (Dark mode)
- **Border Color:** `#e5e7eb` (Light mode), `#374151` (Dark mode)

### Semantic Colors
- **Warning:** `#f59e0b` - Used for cautionary information and mild warnings
- **Error:** `#ef4444` - Used for error states and critical warnings
- **Info:** `#3b82f6` - Used for informational messages and hints
- **Success:** `#10b981` - Used for success messages and confirmations

## Typography

### Font Family
- Primary Font: 'Lora' for headings
- Secondary Font: System font stack for body text

### Font Sizes
- **Heading 1:** 2rem (32px)
- **Heading 2:** 1.5rem (24px)
- **Heading 3:** 1.25rem (20px)
- **Body Text:** 1rem (16px)
- **Small Text:** 0.875rem (14px)
- **X-Small Text:** 0.75rem (12px)

### Font Weights
- **Regular:** 400
- **Medium:** 500
- **Bold:** 700

## Spacing System

We use a consistent spacing scale throughout the application:
- **2xs:** 0.25rem (4px)
- **xs:** 0.5rem (8px)
- **sm:** 0.75rem (12px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)
- **2xl:** 2.5rem (40px)
- **3xl:** 3rem (48px)

## Card Components

### Standard Card
- **Padding:** lg (1.5rem)
- **Border Radius:** md (0.5rem)
- **Border:** 1px solid border color
- **Shadow:** sm (0 1px 2px 0 rgba(0, 0, 0, 0.05))
- **Background:** Background color

### Interactive Card
- Same as Standard Card, plus:
- **Hover Effect:** Scale to 1.02
- **Active State:** Slightly darker background
- **Transition:** 0.2s ease-in-out for all transitions

### Emergency Card
- Same as Standard Card, plus:
- **Border:** 1px solid Primary Red
- **Icon Color:** Primary Red
- **Heading Color:** Primary Red

### Resource Card
- Same as Standard Card, plus:
- **Icon Background:** Light primary color (blue/10%)
- **Icon Color:** Primary Blue

## Dialog Components

### Full Screen Dialog
- **Background:** Background color
- **Z-index:** 45 (to ensure it appears above other elements)
- **Animation:** Fade in and scale up
- **Header:**
  - Sticky positioned at top
  - Border bottom: 1px solid border color
  - Padding: md (1rem) lg (1.5rem)
- **Footer:**
  - Sticky positioned at bottom
  - Border top: 1px solid border color
  - Padding: md (1rem) lg (1.5rem)
- **Close Button:**
  - Position: top-right
  - Size: md (1.5rem)
  - Color: Primary color with 80% opacity
- **Swipe Indicator:**
  - Width: 3rem
  - Height: 0.25rem
  - Color: Border color
  - Border Radius: Full

### Pop-out Dialog
- **Padding:** lg (1.5rem)
- **Border Radius:** lg (0.5rem)
- **Background:** Background color
- **Shadow:** xl (0 20px 25px -5px rgba(0, 0, 0, 0.1))
- **Animation:** Fade in and scale up from 95% to 100%

## Button Styles

### Primary Button
- **Background:** Primary color
- **Text Color:** White
- **Padding:** sm (0.75rem) md (1rem)
- **Border Radius:** md (0.5rem)
- **Hover:** Darken by 10%
- **Active:** Darken by 15%
- **Focus:** Ring offset: 2px, Ring color: Primary color at 50% opacity

### Secondary Button
- **Background:** Transparent
- **Text Color:** Primary color
- **Border:** 1px solid Primary color
- **Padding:** sm (0.75rem) md (1rem)
- **Border Radius:** md (0.5rem)
- **Hover:** Background: Primary color at 10% opacity
- **Active:** Background: Primary color at 20% opacity
- **Focus:** Ring offset: 2px, Ring color: Primary color at 50% opacity

### Danger Button
- Same as Primary Button, but using Error color

## Form Elements

### Input Field
- **Height:** 2.5rem (40px)
- **Padding:** sm (0.75rem)
- **Border:** 1px solid border color
- **Border Radius:** md (0.5rem)
- **Focus:** Ring offset: 2px, Ring color: Primary color at 50% opacity

### Checkbox
- **Size:** 1rem (16px)
- **Border:** 1px solid border color
- **Border Radius:** sm (0.25rem)
- **Checked Background:** Primary color
- **Checked Icon:** White checkmark

### Toggle
- **Height:** 1.5rem (24px)
- **Width:** 3rem (48px)
- **Border Radius:** Full
- **Inactive Background:** Border color
- **Active Background:** Primary color
- **Thumb:** White circle

## Navigation Components

### Top Bar
- **Height:** 3.5rem (56px)
- **Background:** Background color
- **Border Bottom:** 1px solid border color
- **Padding:** md (1rem) lg (1.5rem)

### Tab Navigation
- **Height:** 2.5rem (40px)
- **Padding:** md (1rem)
- **Active Indicator:** 2px solid Primary color
- **Inactive Color:** Text secondary
- **Active Color:** Text primary

### Menu Button
- **Size:** 2.5rem (40px)
- **Border Radius:** md (0.5rem)
- **Hover:** Background: border color at 10% opacity

## Section Layout

### Standard Section
- **Padding:** xl (2rem)
- **Margin Bottom:** xl (2rem)
- **Heading Margin Bottom:** lg (1.5rem)

### Content Grid
- **Gap:** lg (1.5rem)
- **Columns:** 1 (Mobile), 2 (Tablet), 3 (Desktop)

## Icons

- Use `lucide-react` icons throughout the application for consistency
- **Standard Size:** 1.5rem (24px)
- **Small Size:** 1rem (16px)
- **Large Size:** 2rem (32px)
- **Color:** Inherit from text color, or specified semantic color

## Emergency Module Standards

### Emergency Section Header
- **Color:** Primary Red
- **Icon:** Alert or Emergency-related icon from Lucide
- **Border:** Bottom border 1px solid Primary Red

### Warning/Alert Box
- **Background:** Primary Red at 10% opacity
- **Border:** 1px solid Primary Red
- **Icon Color:** Primary Red
- **Text Color:** Primary Red
- **Border Radius:** md (0.5rem)
- **Padding:** md (1rem)

### Instruction Lists
- **Item Spacing:** md (1rem)
- **Icon:** Check or numbered bullets
- **Icon Color:** Primary color

### Before/During/After Tabs
- **Background:** Primary Red
- **Text Color:** White
- **Active Tab:** Slightly darker shade of Primary Red
- **Border Radius:** md (0.5rem) md (0.5rem) 0 0
- **Padding:** sm (0.75rem) md (1rem)

## Animation Standards

- **Duration:** 0.2s for hover/focus, 0.3s for transitions, 0.4s for major animations
- **Easing:** ease-in-out for most transitions
- **Hover Scale:** 1.02 for interactive elements
- **Animation Principles:** Only animate opacity, transform, and background properties for performance

## Accessibility Standards

- **Contrast Ratio:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators:** Visible focus states for all interactive elements
- **Alt Text:** Descriptive alt text for all images
- **Aria Labels:** For all interactive elements without visible text
- **Keyboard Navigation:** All interactive elements must be keyboard accessible

## Responsive Behavior

- **Mobile First:** Design for mobile first, then enhance for larger screens
- **Breakpoints:**
  - **Small:** 640px
  - **Medium:** 768px
  - **Large:** 1024px
  - **X-Large:** 1280px
- **Touch Targets:** Minimum 44px × 44px for all interactive elements on touch devices

## Implementation Notes

- Use Tailwind CSS utilities consistently
- Use Shadcn UI components as the foundation
- Custom components should follow these standards and extend Shadcn UI patterns
- Use CSS variables where appropriate to ensure theme consistency