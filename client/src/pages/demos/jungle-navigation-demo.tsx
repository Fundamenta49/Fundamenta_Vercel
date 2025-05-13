import React, { useState } from 'react';
import { 
  Leaf, Flame, Award, BadgeCheck,
  DollarSign, Heart, BookOpen, Briefcase, 
  ShieldCheck, Trees, Flower, Gem, 
  Mountain, LandPlot, GraduationCap,
  Coins, Flower2, ScrollText, Axe, Map,
  BriefcaseMedical, TreePine, Tent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { JungleTabs } from '../../jungle-path/components/JungleTabs';
import { JungleTabNav } from '../../jungle-path/components/JungleTabNav';

// Sample content for tabs
const TabContent = ({ title }: { title: string }) => (
  <div className="p-4 rounded-md bg-background/50">
    <h3 className="font-semibold mb-2">{title} Content</h3>
    <p className="text-sm text-muted-foreground">
      This is the content for the {title} tab. In a real application, this would contain
      the relevant information or components for this section.
    </p>
  </div>
);

/**
 * A demo page to showcase JungleTabs and JungleTabNav components
 */
export default function JungleNavigationDemo() {
  // State for theme toggle
  const [isJungleTheme, setIsJungleTheme] = useState(true);
  
  // State for active basic tab
  const [activeBasicTab, setActiveBasicTab] = useState('finance');
  
  // State for active nav tab
  const [activeNavTab, setActiveNavTab] = useState('finance');
  
  // Toggle theme
  const toggleTheme = () => {
    setIsJungleTheme(!isJungleTheme);
  };
  
  // Helper function to get icons based on theme
  const getThemeIcon = (category: string) => {
    // Return different icons based on the current theme
    if (isJungleTheme) {
      switch (category) {
        case 'finance':
          return <Coins className="h-4 w-4 text-[#EBCE67]" />; // Gold coins for finance
        case 'wellness':
          return <Flower2 className="h-4 w-4 text-[#94C973]" />; // Flower for wellness
        case 'career':
          return <ScrollText className="h-4 w-4 text-[#EBCE67]" />; // Ancient scroll for career
        case 'life-skills':
          return <Axe className="h-4 w-4 text-[#EBCE67]" />; // Tools for life skills
        case 'emergency':
          return <BriefcaseMedical className="h-4 w-4 text-[#FF6B6B]" />; // Medical kit for emergency
        default:
          return <Map className="h-4 w-4" />; // Default jungle icon
      }
    } else {
      // Standard theme icons
      switch (category) {
        case 'finance':
          return <DollarSign className="h-4 w-4" />;
        case 'wellness':
          return <Heart className="h-4 w-4" />;
        case 'career':
          return <Briefcase className="h-4 w-4" />;
        case 'life-skills':
          return <BookOpen className="h-4 w-4" />;
        case 'emergency':
          return <ShieldCheck className="h-4 w-4" />;
        default:
          return <Leaf className="h-4 w-4" />;
      }
    }
  };

  // Tab data for basic tabs demo with dynamic icons
  const basicTabs = [
    { label: 'Finance', value: 'finance', content: <TabContent title="Finance" />, icon: getThemeIcon('finance') },
    { label: 'Wellness', value: 'wellness', content: <TabContent title="Wellness" />, icon: getThemeIcon('wellness') },
    { label: 'Career', value: 'career', content: <TabContent title="Career" />, icon: getThemeIcon('career') },
    { label: 'Life Skills', value: 'life-skills', content: <TabContent title="Life Skills" />, icon: getThemeIcon('life-skills') },
    { label: 'Emergency', value: 'emergency', content: <TabContent title="Emergency" />, icon: getThemeIcon('emergency') }
  ];
  
  // Tab data for navigation tabs demo
  const navTabs = [
    { label: 'Finance', value: 'finance', path: '#finance', icon: getThemeIcon('finance') },
    { label: 'Wellness', value: 'wellness', path: '#wellness', icon: getThemeIcon('wellness') },
    { label: 'Career', value: 'career', path: '#career', icon: getThemeIcon('career') },
    { label: 'Life Skills', value: 'life-skills', path: '#life-skills', icon: getThemeIcon('life-skills') }
  ];
  
  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jungle Navigation Components</h1>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="theme-toggle" className="text-sm">
            {isJungleTheme ? 'Jungle Theme' : 'Standard Theme'}
          </Label>
          <Switch 
            id="theme-toggle" 
            checked={isJungleTheme} 
            onCheckedChange={toggleTheme} 
          />
        </div>
      </div>
      
      <div className="space-y-12">
        {/* JungleTabs Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">JungleTabs Component</h2>
          <p className="text-muted-foreground mb-6">
            The JungleTabs component provides a unified way to create tabs that work in both jungle and standard themes.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Basic Tabs Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={isJungleTheme 
                ? "bg-[#1E4A3D] p-6 rounded-md relative overflow-hidden" 
                : "bg-card p-6 rounded-md"
              }>
                {isJungleTheme && (
                  <>
                    {/* Jungle decorative elements */}
                    <div className="absolute top-0 left-0 opacity-10">
                      <TreePine className="h-16 w-16 text-[#94C973]" />
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Leaf className="h-12 w-12 text-[#94C973]" />
                    </div>
                  </>
                )}
                <div className="relative z-10">
                  <JungleTabs
                    tabs={basicTabs}
                    value={activeBasicTab}
                    onValueChange={setActiveBasicTab}
                    variant={isJungleTheme ? 'jungle' : 'standard'}
                    className="mb-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Various Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${isJungleTheme ? "bg-[#1E4A3D]" : "bg-card"} p-6 rounded-md space-y-6`}>
                  <div>
                    <h3 className={`text-sm font-medium mb-2 ${isJungleTheme ? "text-[#94C973]" : "text-muted-foreground"}`}>Small</h3>
                    <JungleTabs
                      tabs={basicTabs.slice(0, 3)}
                      variant={isJungleTheme ? 'jungle' : 'standard'}
                      size="sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-medium mb-2 ${isJungleTheme ? "text-[#94C973]" : "text-muted-foreground"}`}>Medium (Default)</h3>
                    <JungleTabs
                      tabs={basicTabs.slice(0, 3)}
                      variant={isJungleTheme ? 'jungle' : 'standard'}
                      size="md"
                    />
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-medium mb-2 ${isJungleTheme ? "text-[#94C973]" : "text-muted-foreground"}`}>Large</h3>
                    <JungleTabs
                      tabs={basicTabs.slice(0, 3)}
                      variant={isJungleTheme ? 'jungle' : 'standard'}
                      size="lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stretched and Compact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${isJungleTheme ? "bg-[#1E4A3D]" : "bg-card"} p-6 rounded-md space-y-6`}>
                  <div>
                    <h3 className={`text-sm font-medium mb-2 ${isJungleTheme ? "text-[#94C973]" : "text-muted-foreground"}`}>Stretched (Full Width)</h3>
                    <JungleTabs
                      tabs={basicTabs.slice(0, 3)}
                      variant={isJungleTheme ? 'jungle' : 'standard'}
                      stretch={true}
                    />
                  </div>
                  
                  <div>
                    <h3 className={`text-sm font-medium mb-2 ${isJungleTheme ? "text-[#94C973]" : "text-muted-foreground"}`}>Compact (Auto Width)</h3>
                    <JungleTabs
                      tabs={basicTabs.slice(0, 3)}
                      variant={isJungleTheme ? 'jungle' : 'standard'}
                      stretch={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <Separator />
        
        {/* JungleTabNav Demo */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">JungleTabNav Component</h2>
          <p className="text-muted-foreground mb-6">
            The JungleTabNav component provides a specialized navigation interface with both jungle and standard theme support.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Basic Navigation Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={isJungleTheme ? "bg-[#1E4A3D] p-6 rounded-md" : "bg-card p-6 rounded-md"}>
                <JungleTabNav
                  items={navTabs}
                  active={activeNavTab}
                  variant={isJungleTheme ? 'jungle' : 'standard'}
                  onTabChange={setActiveNavTab}
                  className="mb-6"
                />
                
                <div className="p-4 rounded-md bg-background/50">
                  <h3 className="font-semibold mb-2">Selected: {navTabs.find(tab => tab.value === activeNavTab)?.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    This is simulating content for the selected tab. In a real application, this would
                    contain the page content for the selected navigation item.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Horizontal Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${isJungleTheme ? "bg-[#1E4A3D]" : "bg-card"} p-6 rounded-md`}>
                  <JungleTabNav
                    items={navTabs}
                    variant={isJungleTheme ? 'jungle' : 'standard'}
                    orientation="horizontal"
                    size="md"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Vertical Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${isJungleTheme ? "bg-[#1E4A3D]" : "bg-card"} p-6 rounded-md h-64 flex items-start`}>
                  <JungleTabNav
                    items={navTabs}
                    variant={isJungleTheme ? 'jungle' : 'standard'}
                    orientation="vertical"
                    size="md"
                    className="h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <div className="bg-muted p-6 rounded-md mt-12">
          <h2 className="text-xl font-semibold mb-2">Usage Notes</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Both components automatically respect the <code>variant</code> prop or use the theme context if not specified.</li>
            <li>The JungleTabs component is for general tabbed interfaces with content.</li>
            <li>The JungleTabNav component is specialized for navigation without content rendering.</li>
            <li>All styling is handled internally based on the theme.</li>
            <li>Both components are fully responsive and support various sizes and layouts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}