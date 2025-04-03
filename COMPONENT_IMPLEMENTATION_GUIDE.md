# Component Implementation Guide

This document provides practical implementation examples based on the design system to ensure consistency across all application sections.

## Basic Section Card Implementation

### Example Card Structure

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Icon } from "lucide-react";

// Define section colors as variables to maintain consistency
const SECTION_COLORS = {
  emergency: "#b91c1c",
  financial: "#3b82f6",
  wellness: "#10b981",
  career: "#8b5cf6",
  learning: "#f59e0b"
};

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  sectionType: keyof typeof SECTION_COLORS;
  onClick: () => void;
}

export function SectionCard({ title, icon, sectionType, onClick }: SectionCardProps) {
  const sectionColor = SECTION_COLORS[sectionType];
  
  return (
    <Card 
      className="cursor-pointer hover:scale-102 transition-all duration-200 overflow-hidden relative"
      onClick={onClick}
      style={{ borderColor: sectionColor }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl" style={{ color: sectionColor }}>
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground text-sm">View details</p>
          <ArrowRight size={18} style={{ color: sectionColor }} />
        </div>
      </CardContent>
    </Card>
  );
}
```

## Dialog Implementation

### Basic Dialog Pattern

```tsx
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
  FullScreenDialogHeader,
  FullScreenDialogBody,
  FullScreenDialogTitle
} from "@/components/ui/full-screen-dialog";
import { Menu } from "lucide-react";

interface SectionDialogProps {
  title: string;
  themeColor: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export function SectionDialog({ title, themeColor, children, trigger }: SectionDialogProps) {
  return (
    <FullScreenDialog>
      <FullScreenDialogTrigger asChild>
        {trigger}
      </FullScreenDialogTrigger>
      <FullScreenDialogContent themeColor={themeColor}>
        {/* Menu button with proper positioning and z-index */}
        <div className="absolute top-4 right-4 z-50">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ 
              backgroundColor: `${themeColor}10`,
              pointerEvents: "auto" // Ensures the button remains clickable
            }}
          >
            <Menu style={{ color: themeColor }} />
          </button>
        </div>
        
        <FullScreenDialogHeader>
          <FullScreenDialogTitle style={{ color: themeColor }}>
            {title}
          </FullScreenDialogTitle>
        </FullScreenDialogHeader>
        
        <FullScreenDialogBody>
          {children}
        </FullScreenDialogBody>
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
}
```

## Consistent Video Player Implementation

```tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { useState } from "react";

interface VideoPlayerDialogProps {
  videoId: string;
  trigger: React.ReactNode;
  title?: string;
}

export function VideoPlayerDialog({ videoId, trigger, title }: VideoPlayerDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        {title && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        
        <div className="relative aspect-video w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Loader className="animate-spin" />
            </div>
          )}
          
          <iframe 
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Section-Specific Checklist Implementation

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ChecklistItem {
  id: string;
  label: string;
}

interface SectionChecklistProps {
  items: ChecklistItem[];
  themeColor: string;
  title: string;
}

export function SectionChecklist({ items, themeColor, title }: SectionChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium" style={{ color: themeColor }}>{title}</h3>
      
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-start space-x-3">
            <Checkbox 
              id={item.id} 
              checked={checkedItems[item.id] || false}
              onCheckedChange={() => toggleItem(item.id)}
              style={{ 
                borderColor: checkedItems[item.id] ? themeColor : undefined,
                backgroundColor: checkedItems[item.id] ? themeColor : undefined 
              }}
            />
            <Label htmlFor={item.id} className="text-base leading-tight">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Warning Box Implementation (Emergency Only)

```tsx
import { AlertTriangle } from "lucide-react";

interface WarningBoxProps {
  children: React.ReactNode;
}

export function WarningBox({ children }: WarningBoxProps) {
  const emergencyColor = "#b91c1c"; // Emergency Red
  
  return (
    <div 
      className="rounded-md p-4 my-4 flex items-start space-x-3"
      style={{ 
        backgroundColor: `${emergencyColor}10`,
        borderColor: emergencyColor,
        borderWidth: "1px",
        borderStyle: "solid"
      }}
    >
      <AlertTriangle style={{ color: emergencyColor }} className="mt-0.5 flex-shrink-0" />
      <div style={{ color: emergencyColor }}>{children}</div>
    </div>
  );
}
```

## Section Header with Appropriate Spacing

```tsx
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  icon: ReactNode;
  themeColor: string;
  description?: string;
}

export function SectionHeader({ title, icon, themeColor, description }: SectionHeaderProps) {
  return (
    <div 
      className="pb-4 mb-6 border-b flex flex-col space-y-2"
      style={{ borderColor: themeColor }}
    >
      <div className="flex items-center">
        <span className="mr-2" style={{ color: themeColor }}>{icon}</span>
        <h2 className="text-2xl font-bold" style={{ color: themeColor }}>{title}</h2>
      </div>
      
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
```

## Tab Navigation (Before/During/After)

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabData {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface SectionTabsProps {
  tabs: TabData[];
  themeColor: string;
}

export function SectionTabs({ tabs, themeColor }: SectionTabsProps) {
  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList 
        className="w-full grid" 
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            style={{ 
              backgroundColor: `${themeColor}80`,
              '--color-active': themeColor // CSS variable for active state
            }}
            className="text-white data-[state=active]:bg-[var(--color-active)]"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
```

## Usage Example

```tsx
// Example implementation of a Emergency Guide page
import { Card } from "@/components/ui/card";
import { SectionCard } from "@/components/section-card";
import { SectionDialog } from "@/components/section-dialog";
import { SectionHeader } from "@/components/section-header";
import { WarningBox } from "@/components/warning-box";
import { SectionTabs } from "@/components/section-tabs";
import { SectionChecklist } from "@/components/section-checklist";
import { AlertTriangle, CheckSquare, Car } from "lucide-react";

export default function EmergencyPage() {
  // Section-specific color
  const emergencyColor = "#b91c1c";
  
  // Sample data
  const autoChecklistItems = [
    { id: "item1", label: "Move to a safe location" },
    { id: "item2", label: "Check for injuries" },
    { id: "item3", label: "Call emergency services" },
    // ...more items
  ];
  
  const autoTabs = [
    {
      value: "before",
      label: "Before",
      content: (
        <div className="space-y-4">
          <p>Steps to take before an accident:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep emergency contacts easily accessible</li>
            <li>Maintain current insurance information</li>
            <li>Check your vehicle regularly</li>
          </ul>
        </div>
      )
    },
    {
      value: "during",
      label: "During",
      content: (
        <div className="space-y-4">
          <WarningBox>
            If you're involved in an accident, safety is your first priority.
          </WarningBox>
          
          <SectionChecklist 
            title="Immediate Actions" 
            items={autoChecklistItems} 
            themeColor={emergencyColor} 
          />
        </div>
      )
    },
    {
      value: "after",
      label: "After",
      content: (
        <div className="space-y-4">
          <p>Steps to take after an accident:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Exchange information with other drivers</li>
            <li>Document the scene with photos</li>
            <li>Contact your insurance company</li>
          </ul>
        </div>
      )
    }
  ];
  
  return (
    <div className="p-6">
      <SectionHeader 
        title="Emergency Resources" 
        icon={<AlertTriangle size={24} />}
        themeColor={emergencyColor}
        description="Access guides for emergency situations"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SectionDialog
          title="Auto Accident Guide"
          themeColor={emergencyColor}
          trigger={
            <SectionCard 
              title="Auto Accident" 
              icon={<Car size={20} />}
              sectionType="emergency"
              onClick={() => {}}
            />
          }
        >
          <SectionTabs tabs={autoTabs} themeColor={emergencyColor} />
        </SectionDialog>
        
        {/* More emergency cards would follow the same pattern */}
      </div>
    </div>
  );
}
```

## Notes for Implementation

1. Always maintain the section's unique color identity
2. Use consistent component structure across sections
3. Ensure menu buttons remain accessible
4. Follow appropriate spacing guidelines
5. Use appropriate dialog nesting
6. Keep warnings/alerts only for emergency sections
7. Maintain consistent animation behavior
8. Ensure all interactive elements are properly accessible