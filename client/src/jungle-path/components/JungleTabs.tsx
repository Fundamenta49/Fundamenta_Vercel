import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useJungleTheme } from '../contexts/JungleThemeContext';

export interface JungleTabItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface JungleTabsProps {
  // Array of tab items to display
  tabs: JungleTabItem[];
  
  // Currently selected tab value
  value?: string;
  
  // Called when a tab is selected
  onValueChange?: (value: string) => void;
  
  // Visual styling variant - jungle theme or standard
  variant?: 'jungle' | 'standard';
  
  // Size of the tabs
  size?: 'sm' | 'md' | 'lg';
  
  // Whether tabs should stretch to fill available width
  stretch?: boolean;
  
  // Additional className to apply
  className?: string;
  
  // Additional className for the tab list
  tabsListClassName?: string;
}

export function JungleTabs({
  tabs,
  value,
  onValueChange,
  variant: propVariant,
  size = 'md',
  stretch = true,
  className,
  tabsListClassName
}: JungleTabsProps) {
  // Get jungle theme context
  const { isJungleTheme } = useJungleTheme();
  
  // Determine if we should use jungle theme
  const variant = propVariant || (isJungleTheme ? 'jungle' : 'standard');
  
  // State for controlled component
  const [selectedTab, setSelectedTab] = useState<string>(value || (tabs.length > 0 ? tabs[0].value : ''));
  
  // Update selected tab when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);
  
  // Handle tab click
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };
  
  // Helper function to determine if a tab is active
  const isTabActive = (tabValue: string) => selectedTab === tabValue;
  
  // Generate content for the selected tab
  const activeTabContent = React.useMemo(() => {
    const activeTab = tabs.find(tab => tab.value === selectedTab);
    return activeTab?.content || null;
  }, [selectedTab, tabs]);
  
  return (
    <div className={cn("w-full max-w-full overflow-hidden", className)}>
      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full max-w-full">
        <TabsList
          className={cn(
            "w-full h-auto flex flex-wrap p-1 rounded-lg",
            variant === 'jungle' ? "bg-[#1E4A3D] border border-[#2A5542]" : "bg-muted",
            stretch ? "justify-between" : "justify-start",
            "overflow-x-auto max-w-full scrollbar-thin", // Better mobile handling
            tabsListClassName
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={cn(
                // Base styles - improved for mobile
                "flex items-center gap-1 sm:gap-2 transition-all relative rounded",
                "px-2 sm:px-4", // Different padding for mobile/desktop
                "min-w-[50px] sm:min-w-fit", // Ensure minimum width on small screens
                // Size variants - adjusted for mobile
                size === 'sm' && "text-xs py-1",
                size === 'md' && "text-xs sm:text-sm py-1 sm:py-1.5",
                size === 'lg' && "text-sm sm:text-base py-1.5 sm:py-2",
                // Width based on stretch prop
                stretch ? "flex-grow text-center justify-center" : "flex-initial",
                // Jungle theme styles
                variant === 'jungle' && [
                  "text-[#94C973]",
                  "data-[state=active]:bg-transparent",
                  "data-[state=active]:text-[#EBCE67]",
                  "data-[state=active]:border-b-2 data-[state=active]:border-[#EBCE67]",
                  "data-[state=active]:rounded-none",
                  "hover:text-[#EBCE67]"
                ],
                // Standard theme styles
                variant === 'standard' && [
                  "data-[state=active]:bg-background",
                  "data-[state=active]:text-foreground",
                  "data-[state=active]:shadow-sm"
                ]
              )}
            >
              {tab.icon && <span className="tab-icon hidden sm:inline-block">{tab.icon}</span>}
              <span>{tab.label}</span>
              {/* Small screen icon-only version for very narrow viewports */}
              {tab.icon && <span className="tab-icon sm:hidden absolute top-[-18px] left-1/2 transform -translate-x-1/2 opacity-80">{tab.icon}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Render active tab content if available */}
      {activeTabContent && (
        <div className={cn(
          "tab-content mt-2 sm:mt-4 p-2 sm:p-4 rounded-md",
          "overflow-x-auto max-w-full",
          variant === 'jungle' ? "bg-[#8BA89F] bg-opacity-50 text-gray-800" : "bg-background"
        )}>
          {activeTabContent}
        </div>
      )}
    </div>
  );
}