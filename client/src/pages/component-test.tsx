import React, { useState } from 'react';
import { StandardCard, MobileScroller, SearchBar, TabNav, StandardDialog } from '@/components/ui-standard';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, Settings, Bell, Book, HelpCircle } from 'lucide-react';
import { useFeatureFlags } from '@/contexts/feature-flags-context';

export default function ComponentTest() {
  const featureFlags = useFeatureFlags();
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Only render if the feature flags are enabled
  if (!featureFlags.USE_STANDARD_CARDS || 
      !featureFlags.USE_STANDARD_TABS || 
      !featureFlags.USE_STANDARD_DIALOGS || 
      !featureFlags.USE_STANDARD_SEARCH) {
    return (
      <div className="container py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <h2 className="text-lg font-medium mb-2">Component Testing Disabled</h2>
          <p>Standard component testing is disabled via feature flags. Enable the following flags to view the test page:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>USE_STANDARD_CARDS</li>
            <li>USE_STANDARD_TABS</li>
            <li>USE_STANDARD_DIALOGS</li>
            <li>USE_STANDARD_SEARCH</li>
          </ul>
        </div>
      </div>
    );
  }
  
  // Sample tabs for demonstration
  const tabItems = [
    {
      value: 'home',
      label: 'Home',
      icon: <Home className="h-4 w-4" />,
      content: (
        <div>
          <h3 className="text-lg font-medium mb-4">Home Content</h3>
          <p className="text-gray-600">This is the home tab content area.</p>
        </div>
      )
    },
    {
      value: 'messages',
      label: 'Messages',
      icon: <MessageCircle className="h-4 w-4" />,
      content: (
        <div>
          <h3 className="text-lg font-medium mb-4">Messages Content</h3>
          <p className="text-gray-600">This is the messages tab content area.</p>
        </div>
      )
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div>
          <h3 className="text-lg font-medium mb-4">Settings Content</h3>
          <p className="text-gray-600">This is the settings tab content area.</p>
        </div>
      )
    }
  ];
  
  // Mock data for mobile scroller
  const cardItems = [
    { id: 1, title: 'Financial Planning', theme: 'financial' },
    { id: 2, title: 'Wellness Activities', theme: 'wellness' },
    { id: 3, title: 'Career Development', theme: 'career' },
    { id: 4, title: 'Emergency Resources', theme: 'emergency' },
    { id: 5, title: 'Learning Resources', theme: 'learning' },
    { id: 6, title: 'Financial Tips', theme: 'financial' }
  ];
  
  return (
    <div className="container py-8 space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Standardized Component Library</h1>
        <p className="text-gray-600 max-w-2xl">
          This page demonstrates the new standardized UI components based on the Yoga section design patterns.
          These components create a consistent look and feel across the Fundamenta platform.
        </p>
      </header>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">StandardCard Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Financial theme card */}
          <StandardCard
            title="Financial Planning"
            description="Track your spending and build a budget"
            sectionTheme="financial"
            headerRight={<Bell className="h-5 w-5 text-gray-400" />}
          >
            <p className="text-gray-600">Content area for financial information would go here.</p>
          </StandardCard>
          
          {/* Wellness theme card */}
          <StandardCard
            title="Wellness Activities"
            description="Improve your mental and physical health"
            sectionTheme="wellness"
          >
            <p className="text-gray-600">Content area for wellness activities would go here.</p>
          </StandardCard>
          
          {/* Career theme card */}
          <StandardCard
            title="Career Development"
            description="Enhance your professional skills"
            sectionTheme="career"
            footer={
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="mr-2">Cancel</Button>
                <Button size="sm">View Details</Button>
              </div>
            }
          >
            <p className="text-gray-600">Content area for career development would go here.</p>
          </StandardCard>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">MobileScroller Component</h2>
        <div className="bg-gray-50 p-6 rounded-xl">
          <p className="text-gray-600 mb-4">This component provides horizontal scrolling on mobile devices and a grid layout on larger screens:</p>
          
          <MobileScroller
            columns={{ sm: 2, md: 3, lg: 3 }}
            gap="md"
            hideScrollbar={true}
            mobileMinWidth={240}
          >
            {cardItems.map((item) => (
              <StandardCard
                key={item.id}
                title={item.title}
                sectionTheme={item.theme as any}
                className="h-[200px]"
              >
                <p className="text-gray-600">Sample card content for {item.title}</p>
              </StandardCard>
            ))}
          </MobileScroller>
          
          <p className="text-gray-500 text-sm mt-4">
            Note: Resize your browser window to see how this component adapts to different screen sizes.
            On mobile screens, it allows horizontal scrolling. On larger screens, it displays as a grid.
          </p>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">SearchBar Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Default (Pill Style)</h3>
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search items..."
              sectionTheme="wellness"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">With Blur Effect</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <SearchBar
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search with blur effect..."
                useBlurEffect={true}
                sectionTheme="career"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">TabNav Component</h2>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <TabNav
            tabs={tabItems}
            variant="pill"
            size="md"
            sectionTheme="learning"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Underline Style</h3>
            <TabNav
              tabs={tabItems}
              variant="underline"
              size="sm"
              sectionTheme="financial"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Contained Style</h3>
            <TabNav
              tabs={tabItems}
              variant="contained"
              size="sm"
              sectionTheme="emergency"
            />
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">StandardDialog Component</h2>
        <div className="flex space-x-4">
          <Button onClick={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
          
          <StandardDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title="Dialog Example"
            description="This is a standardized dialog component"
            sectionTheme="wellness"
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
              </div>
            }
          >
            <div className="space-y-4">
              <p>This dialog demonstrates the standardized dialog component with:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Fixed header with title and close button</li>
                <li>Scrollable content area</li>
                <li>Fixed footer with action buttons</li>
                <li>Section-specific theme colors</li>
                <li>Gradient accent line at the top</li>
              </ul>
              
              {/* Add some extra content to demonstrate scrolling */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <h3 className="font-medium mb-2">Additional Information</h3>
                <p className="text-gray-600 mb-3">
                  The content area of this dialog can scroll independently while the header and footer stay fixed.
                  This is particularly useful for mobile viewports where space is limited.
                </p>
                <p className="text-gray-600 mb-3">
                  The standardized dialog keeps proper z-index management and positioning to ensure it works
                  well across various devices and screen sizes.
                </p>
                <p className="text-gray-600">
                  Each section's theme color can be applied for visual consistency with the rest of that section's UI.
                </p>
              </div>
            </div>
          </StandardDialog>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">CSS Utilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium mb-3">Gradient Text</h3>
            <p className="gradient-text-financial text-xl font-semibold mb-2">Financial Section</p>
            <p className="gradient-text-wellness text-xl font-semibold mb-2">Wellness Section</p>
            <p className="gradient-text-career text-xl font-semibold mb-2">Career Section</p>
            <p className="gradient-text-emergency text-xl font-semibold mb-2">Emergency Section</p>
            <p className="gradient-text-learning text-xl font-semibold mb-2">Learning Section</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium mb-3">Background Subtle Colors</h3>
            <div className="bg-financial-subtle p-3 rounded-lg mb-2">Financial Background</div>
            <div className="bg-wellness-subtle p-3 rounded-lg mb-2">Wellness Background</div>
            <div className="bg-career-subtle p-3 rounded-lg mb-2">Career Background</div>
            <div className="bg-emergency-subtle p-3 rounded-lg mb-2">Emergency Background</div>
            <div className="bg-learning-subtle p-3 rounded-lg mb-2">Learning Background</div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-gray-200 pt-8 mt-12">
        <div className="flex items-center text-gray-500">
          <HelpCircle className="h-5 w-5 mr-2" />
          <p>
            These components are part of the UI standardization effort based on the Yoga section design patterns.
            They can be enabled/disabled via feature flags and integrated gradually into different sections of the application.
          </p>
        </div>
      </footer>
    </div>
  );
}