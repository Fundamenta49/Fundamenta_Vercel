# Fundi Size Configuration Guide

This guide documents how to properly adjust the size of the Fundi robot avatar in the application.

## Overview

Fundi's size is controlled by several key components:

1. Size variants in robot-fundi.tsx
2. Container dimensions in floating-chat.tsx
3. Inline styles that enforce specific dimensions
4. Size prop passed to the RobotFundi component

## Key Files

- client/src/components/robot-fundi.tsx - Contains the robot avatar SVG and size configurations
- client/src/components/floating-chat.tsx - Contains the container that houses the robot

## Size Adjustment Steps

### 1. Adjust Size Variants in robot-fundi.tsx

Size variants for different screen sizes:
```
const sizeVariants = {
  xs: 'w-16 h-16',  // 64px
  sm: 'w-20 h-20',  // 80px
  md: 'w-24 h-24',  // 96px
  lg: 'w-28 h-28',  // 112px
  xl: 'w-32 h-32'   // 128px
};
```

These Tailwind classes control the base dimensions - increase/decrease these values to adjust Fundi's size.

### 2. Update Inline Styles in robot-fundi.tsx

Inline styles:
```
style={{
  // Other properties...
  width: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
  height: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
  minWidth: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
  minHeight: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px'
}}
```

These inline styles enforce exact pixel dimensions based on the size prop. Make sure these match the values in the size variants.

### 3. Adjust Container in floating-chat.tsx

Container style:
```
style={{
  width: "60px",
  height: "60px",
  minWidth: "60px", 
  minHeight: "60px"
}}
```

This controls the motion.div container holding the button with Fundi. Adjust to match robot dimensions.

### 4. Update Button Style in floating-chat.tsx

Button style:
```
style={{
  // Other properties...
  width: "100%",
  height: "100%",
  minWidth: "60px", 
  minHeight: "60px"
}}
```

These dimensions should match the container dimensions above.

### 5. Set Size Prop in floating-chat.tsx

Size prop:
```
<RobotFundi
  speaking={isSpeaking}
  size="md"  // Change this to "xs", "sm", "md", "lg", or "xl"
  category={category}
  onOpen={() => setIsExpanded(true)}
/>
```

Choose the appropriate size from the available options.

### 6. Position Fundi on the Screen

In floating-chat.tsx:
```
className="fixed right-6 sm:right-8 md:right-10 top-2 sm:top-2 md:top-2 z-[99999] flex flex-col items-center"
```

Position values:
- top-2: 8px from top (just below the question mark, above the Fundamenta logo)
- right-6: 24px from right on mobile
- right-8: 32px from right on tablet
- right-10: 40px from right on desktop

In robot-fundi.tsx (for initial position):
```
top: '8px',
right: '24px',
```

## Troubleshooting Size Issues

If Fundi appears too large or too small:

1. **For too large Fundi**:
   - Reduce the dimensions in sizeVariants 
   - Decrease the pixel values in the inline styles
   - Use a smaller size prop (e.g., "sm" instead of "md")
   - Reduce container dimensions in floating-chat.tsx

2. **For too small Fundi**:
   - Increase the dimensions in sizeVariants
   - Increase the pixel values in the inline styles
   - Use a larger size prop (e.g., "lg" instead of "md")
   - Increase container dimensions in floating-chat.tsx

3. **For specific device adjustments**:
   - Use responsive Tailwind classes (e.g., w-16 sm:w-20 md:w-24)
   - Add media queries to the inline styles if needed

## Current Configuration

The current configuration (as of April 4, 2025) uses:

- Size variants: xs=64px, sm=80px, md=96px, lg=112px, xl=128px
- Container dimensions: 60px × 60px
- Size prop: "md" (96px)
- Position: top-2 (8px from top of screen)
- Right position: right-6, sm:right-8, md:right-10 (responsive)

This configuration provides a balanced size that's visible without being overwhelming across device sizes and positions Fundi in the top right corner above the Fundamenta logo and below the question mark.
