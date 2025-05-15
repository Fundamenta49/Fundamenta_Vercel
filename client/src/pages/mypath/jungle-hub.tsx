import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningThemeProvider, useLearningTheme } from '@/contexts/LearningThemeContext';
import JungleHub from '@/components/jungle/JungleHub';

/**
 * JungleHubView - Wrapper component that ensures the jungle theme
 * is applied when viewing the jungle hub page
 */
const JungleHubView: React.FC = () => {
  return (
    <LearningThemeProvider initialTheme="jungle">
      <JungleHubContent />
    </LearningThemeProvider>
  );
};

/**
 * The actual content of the JungleHub page
 * Separated to ensure theme context is properly applied
 */
const JungleHubContent: React.FC = () => {
  const { isJungleTheme } = useLearningTheme();
  const [, navigate] = useLocation();

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jungle Hub</h1>
          <p className="text-muted-foreground mt-2">
            Explore learning pathways in jungle adventure style
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/mypath')}
          className="ml-auto"
        >
          Switch to Standard View
        </Button>
      </div>

      {isJungleTheme ? (
        <JungleHub />
      ) : (
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>Theme Switch Error</CardTitle>
            <CardDescription>The jungle theme did not properly activate</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/mypath')}>
              Return to Standard View
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default JungleHubView;