import React from 'react';
import { useLocation } from 'wouter';
import { JungleTabs, TabItem } from './JungleTabs';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import { cn } from '@/lib/utils';

export interface NavigationItem extends Omit<TabItem, 'content'> {
  /** Path to navigate to when tab is clicked */
  path: string;
  
  /** Badge to display (optional) */
  badge?: React.ReactNode;
}

interface JungleTabNavProps {
  /** Navigation items */
  items: NavigationItem[];
  
  /** Currently active tab */
  active?: string;
  
  /** Theme variant */
  variant?: 'jungle' | 'standard';
  
  /** Orientation of tabs */
  orientation?: 'horizontal' | 'vertical';
  
  /** Size of tabs */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether tabs should stretch to fill container */
  stretch?: boolean;
  
  /** CSS class name for the container */
  className?: string;
  
  /** CSS class name for the tab list */
  tabsListClassName?: string;
  
  /** Callback when a tab is changed */
  onTabChange?: (value: string) => void;
}

/**
 * Navigation component that supports both jungle and standard themes
 * Primarily used for section navigation with optional path integration
 */
export function JungleTabNav({
  items,
  active,
  variant: propVariant,
  orientation = 'horizontal',
  size = 'md',
  stretch = true,
  className,
  tabsListClassName,
  onTabChange
}: JungleTabNavProps) {
  const [location, navigate] = useLocation();
  const { isJungleTheme: contextIsJungle } = useJungleTheme();
  
  // Use prop variant if provided, otherwise use context
  const isJungleTheme = propVariant ? propVariant === 'jungle' : contextIsJungle;
  
  // Determine active tab based on path or prop
  const currentPath = location.split('?')[0]; // Remove query parameters
  const determineActive = (): string => {
    if (active) return active;
    
    // Find the item with a matching path, defaulting to the first item
    const matchingItem = items.find(item => item.path === currentPath);
    return matchingItem?.value || items[0]?.value;
  };
  
  // Convert navigation items to tab items
  const tabItems: TabItem[] = items.map(({ path, ...item }) => ({
    ...item
  }));
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    // Find the corresponding path
    const selectedItem = items.find(item => item.value === value);
    
    if (selectedItem) {
      // Navigate to the path if it exists
      if (selectedItem.path) {
        navigate(selectedItem.path);
      }
      
      // Call the onTabChange callback if provided
      if (onTabChange) {
        onTabChange(value);
      }
    }
  };
  
  // Apply jungle theme styling
  const containerStyles = cn(
    isJungleTheme ? 'bg-[#1E4A3D] border-[#E6B933]/50' : '',
    className
  );
  
  // Custom tab list class for jungle theme
  const tabsListStyles = cn(
    isJungleTheme ? 'bg-[#162E26] border-[#E6B933]/50 rounded-md' : '',
    orientation === 'vertical' ? 'flex-col' : '',
    tabsListClassName
  );
  
  return (
    <div className={containerStyles}>
      <JungleTabs
        tabs={tabItems}
        value={determineActive()}
        variant={propVariant || (isJungleTheme ? 'jungle' : 'standard')}
        onValueChange={handleTabChange}
        className={className}
        tabsListClassName={tabsListStyles}
        size={size}
        stretch={stretch}
        renderContent={false}
      />
    </div>
  );
}

export default JungleTabNav;