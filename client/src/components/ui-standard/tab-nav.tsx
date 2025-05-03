import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TabItem {
  /** Unique identifier for the tab */
  value: string;
  /** Display label for the tab */
  label: React.ReactNode;
  /** Content to display when tab is active */
  content: React.ReactNode;
  /** Optional icon to display alongside label */
  icon?: React.ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

export interface TabNavProps {
  /** List of tabs to display */
  tabs: TabItem[];
  /** The currently active tab value */
  activeTab?: string;
  /** Function called when active tab changes */
  onTabChange?: (value: string) => void;
  /** Style variant for the tabs */
  variant?: 'pill' | 'underline' | 'contained';
  /** Tab size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to stretch tabs to fill container */
  stretch?: boolean;
  /** Extra CSS classes for the tabs container */
  className?: string;
  /** Extra CSS classes for the tabs list */
  tabsListClassName?: string;
  /** Extra CSS classes for the content container */
  contentClassName?: string;
  /** Section theme to apply */
  sectionTheme?: 'financial' | 'wellness' | 'career' | 'emergency' | 'learning';
}

/**
 * StandardTabNav component based on Yoga section design patterns
 * Provides consistent tab navigation styling across the application
 */
export function TabNav({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pill',
  size = 'md',
  stretch = true,
  className,
  tabsListClassName,
  contentClassName,
  sectionTheme = 'wellness'
}: TabNavProps) {
  // Default to first tab if no activeTab provided
  const defaultTab = activeTab || (tabs.length > 0 ? tabs[0].value : '');
  
  // Map variant styles
  const variantStyles = {
    pill: {
      list: 'bg-gray-100 p-1 rounded-full',
      tab: 'rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm'
    },
    underline: {
      list: 'border-b border-gray-200 p-0',
      tab: 'border-b-2 border-transparent data-[state=active]:border-current rounded-none pb-2'
    },
    contained: {
      list: 'bg-gray-100 border border-gray-200 rounded-lg p-1',
      tab: 'rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'
    }
  };
  
  // Map size styles
  const sizeStyles = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };
  
  // Map theme colors
  const themeColorMap = {
    financial: 'data-[state=active]:text-blue-600',
    wellness: 'data-[state=active]:text-green-600',
    career: 'data-[state=active]:text-purple-600',
    emergency: 'data-[state=active]:text-red-600',
    learning: 'data-[state=active]:text-yellow-600'
  };
  
  // Handle tab change
  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };
  
  return (
    <Tabs 
      defaultValue={defaultTab} 
      value={activeTab}
      onValueChange={handleValueChange}
      className={cn('w-full', className)}
    >
      <TabsList 
        className={cn(
          variantStyles[variant].list, 
          sizeStyles[size],
          'w-full inline-flex',
          tabsListClassName
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              variantStyles[variant].tab,
              themeColorMap[sectionTheme],
              'font-medium',
              stretch ? 'flex-1' : '',
              'min-w-[70px]',
              'transition-all duration-200'
            )}
          >
            {tab.icon && (
              <span className="mr-1.5">{tab.icon}</span>
            )}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.value} 
          value={tab.value}
          className={cn('pt-4', contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}