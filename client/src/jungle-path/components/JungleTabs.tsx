import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useJungleTheme } from '../contexts/JungleThemeContext';

export interface TabItem {
  label: string;
  value: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface JungleTabsProps {
  /** List of tab items */
  tabs: TabItem[];
  
  /** Default selected tab */
  defaultValue?: string;
  
  /** Currently active tab */
  value?: string;
  
  /** Theme variant */
  variant?: 'jungle' | 'standard';
  
  /** Change handler */
  onValueChange?: (value: string) => void;
  
  /** Tab list container class name */
  tabsListClassName?: string;
  
  /** Tab content container class name */
  contentClassName?: string;
  
  /** Root container class name */
  className?: string;
  
  /** Whether tabs should stretch to fill width */
  stretch?: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether content should be rendered */
  renderContent?: boolean;
}

/**
 * Unified Tabs component that supports both jungle and standard themes
 */
export function JungleTabs({
  tabs,
  defaultValue,
  value,
  variant: propVariant,
  onValueChange,
  tabsListClassName,
  contentClassName,
  className,
  stretch = false,
  size = 'md',
  renderContent = true
}: JungleTabsProps) {
  // Get jungle theme context if not explicitly provided
  const { isJungleTheme: contextIsJungle } = useJungleTheme();
  
  // Use prop variant if provided, otherwise use context
  const isJungleTheme = propVariant ? propVariant === 'jungle' : contextIsJungle;
  
  // Default tab is the first tab if not provided
  const defaultTab = defaultValue || tabs[0]?.value;
  
  // Size mapping
  const sizeStyles = {
    sm: 'h-8 min-h-8',
    md: 'h-10 min-h-10',
    lg: 'h-12 min-h-12'
  };
  
  // Handle value change
  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };
  
  // Custom styles for the jungle theme
  const jungleStyles = {
    root: "",
    list: "bg-[#162E26] border border-[#E6B933]/50 rounded-md overflow-hidden",
    tab: "data-[state=active]:bg-[#162E26] data-[state=active]:text-[#E6B933] data-[state=active]:border-b-2 data-[state=active]:border-[#E6B933] text-[#94C973] relative"
  };
  
  // Custom styles for the standard theme
  const standardStyles = {
    root: "",
    list: "bg-secondary/30 rounded-full",
    tab: "data-[state=active]:bg-white data-[state=active]:text-foreground rounded-full"
  };
  
  // Get the appropriate styles based on theme
  const themeStyles = isJungleTheme ? jungleStyles : standardStyles;
  
  return (
    <Tabs 
      defaultValue={defaultTab} 
      value={value}
      onValueChange={handleValueChange}
      className={cn('w-full', className)}
    >
      <TabsList 
        className={cn(
          themeStyles.list,
          sizeStyles[size],
          stretch ? 'w-full' : 'w-auto',
          'inline-flex',
          tabsListClassName
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              themeStyles.tab,
              'font-medium transition-all',
              stretch ? 'flex-1' : '',
              'min-w-[70px]'
            )}
          >
            {tab.icon && (
              <span className="mr-1.5">{tab.icon}</span>
            )}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {renderContent && tabs.map((tab) => (
        <TabsContent 
          key={tab.value} 
          value={tab.value}
          className={cn('mt-4', contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default JungleTabs;