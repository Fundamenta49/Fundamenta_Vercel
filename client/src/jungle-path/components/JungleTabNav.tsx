import React from 'react';
import { useLocation } from 'wouter';
import { JungleTabs, JungleTabItem } from './JungleTabs';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import { cn } from '@/lib/utils';

export interface JungleNavItem extends Omit<JungleTabItem, 'content'> {
  path: string; // URL path for navigation
}

export interface JungleTabNavProps {
  // Array of navigation items to display
  items: JungleNavItem[];
  
  // Currently active item value
  active?: string;
  
  // Called when a tab is selected
  onTabChange?: (value: string) => void;
  
  // Visual styling variant - jungle theme or standard
  variant?: 'jungle' | 'standard';
  
  // Size of the tabs
  size?: 'sm' | 'md' | 'lg';
  
  // Orientation of the tabs - horizontal or vertical
  orientation?: 'horizontal' | 'vertical';
  
  // Additional className to apply
  className?: string;
}

export function JungleTabNav({
  items,
  active,
  onTabChange,
  variant: propVariant,
  size = 'md',
  orientation = 'horizontal',
  className
}: JungleTabNavProps) {
  const [location, navigate] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  
  // Determine if we should use jungle theme
  const variant = propVariant || (isJungleTheme ? 'jungle' : 'standard');
  
  // Convert navigation items to tab items
  const tabItems: JungleTabItem[] = items.map(item => ({
    label: item.label,
    value: item.value,
    icon: item.icon,
    disabled: item.disabled
  }));
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    const selectedItem = items.find(item => item.value === value);
    
    if (selectedItem) {
      // If the path is a URL with hash, don't navigate but update the value
      if (selectedItem.path.startsWith('#')) {
        onTabChange?.(value);
      } else {
        // If it's a full URL path, navigate to it
        navigate(selectedItem.path);
        onTabChange?.(value);
      }
    }
  };
  
  // Determine the active tab value
  const determineActiveTab = (): string => {
    if (active) return active;
    
    // Try to find a matching tab based on the current location
    const matchingItem = items.find(item => {
      if (item.path.startsWith('#')) {
        // For hash paths, check if the current URL has that hash
        return location.includes(item.path);
      } else {
        // For regular paths, check if the current location matches
        return location === item.path;
      }
    });
    
    return matchingItem?.value || (items.length > 0 ? items[0].value : '');
  };
  
  return (
    <div 
      className={cn(
        orientation === 'vertical' ? "flex flex-col h-full" : "w-full max-w-full overflow-hidden",
        className
      )}
    >
      <JungleTabs
        tabs={tabItems}
        value={determineActiveTab()}
        onValueChange={handleTabChange}
        variant={variant}
        size={size}
        stretch={orientation === 'horizontal'}
        className={cn(
          orientation === 'vertical' && [
            "flex flex-col h-full",
            "w-auto min-w-[160px]"
          ],
          orientation === 'horizontal' && "w-full max-w-full"
        )}
        tabsListClassName={cn(
          orientation === 'vertical' && [
            "flex-col items-stretch", 
            "!justify-start !gap-2"
          ],
          orientation === 'horizontal' && "flex-wrap !gap-0 sm:!gap-1"
        )}
      />
    </div>
  );
}