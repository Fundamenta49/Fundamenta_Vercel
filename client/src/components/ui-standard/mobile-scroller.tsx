import React from 'react';
import { cn } from '@/lib/utils';

export interface MobileScrollerProps {
  /** The items to display in the scroller */
  children: React.ReactNode;
  /** CSS classes to apply to the container */
  className?: string;
  /** Number of columns for grid display on different breakpoints */
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Spacing between items (in Tailwind gap units) */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  /** Whether to hide the scrollbar */
  hideScrollbar?: boolean;
  /** Mobile item minimum width */
  mobileMinWidth?: number;
}

/**
 * MobileScroller component that provides horizontal scrolling on mobile
 * and responsive grid layout on larger screens
 */
export function MobileScroller({
  children,
  className,
  columns = { sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 'md',
  hideScrollbar = true,
  mobileMinWidth = 240
}: MobileScrollerProps) {
  // Map gap sizes to Tailwind classes
  const gapSizeMap = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };
  
  // Map column counts to Tailwind grid classes
  const getGridColsClass = () => {
    const classes = [];
    
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  };
  
  // Generate scrollbar hiding styles
  const scrollbarClass = hideScrollbar ? 'hide-scrollbar' : '';
  
  // Apply scroll behavior on mobile, grid on larger screens
  return (
    <div className={cn(
      'flex sm:grid',
      getGridColsClass(),
      gapSizeMap[gap],
      'overflow-x-auto pb-3 -mx-3 sm:mx-0 px-3 sm:px-0',
      scrollbarClass,
      className
    )}>
      {/* Wrap each child in a container with appropriate mobile sizing */}
      {React.Children.map(children, (child) => (
        <div className={`min-w-[${mobileMinWidth}px] sm:min-w-0 flex-shrink-0 sm:flex-shrink-initial`}>
          {child}
        </div>
      ))}
    </div>
  );
}

// Add scrollbar-hiding styles to your global CSS or in your component
// Include this in your app's CSS:
/* 
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
*/