import React, { useState } from 'react';
import { ACHIEVEMENTS, createSampleUserProgress } from '@/shared/arcade-schema';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Import Jungle Path components
import {
  JungleThemeProvider,
  useJungleTheme,
  RankProgress,
  RankUpCelebration,
  QuestList,
  QuestProgress,
  JungleMap,
  ZoneCard,
  CompanionProvider,
  CompanionCard,
  CompanionDialog,
  useQuestProgress,
  useJungleRank,
  useCompanion,
  getAllZones
} from '../index';

// Sample user progress
const sampleUserProgress = createSampleUserProgress('demo-user');

/**
 * Theme toggle component
 */
const ThemeToggle: React.FC = () => {
  const { isJungleTheme, toggleTheme } = useJungleTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="theme-toggle" 
        checked={isJungleTheme}
        onCheckedChange={toggleTheme}
      />
      <Label htmlFor="theme-toggle">
        {isJungleTheme ? 'Jungle Theme Enabled' : 'Standard Theme'}
      </Label>
    </div>
  );
};

/**
 * Demo page for showing Jungle Path components
 */
const JunglePathDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRankUp, setShowRankUp] = useState(false);
  
  // Get quest progress information
  const {
    jungleQuests,
    questProgress,
    zoneProgress,
    recommendedQuests
  } = useQuestProgress(ACHIEVEMENTS, sampleUserProgress);
  
  // Get rank information
  const {
    userRank,
    rankData
  } = useJungleRank(sampleUserProgress);
  
  // Get companion information
  const {
    activeCompanion,
    setActiveCompanion,
    dialogVisible,
    hideCompanionDialog
  } = useCompanion();
  
  // Get all zones
  const zones = getAllZones();

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Jungle Path Demo</h1>
          <p className="text-gray-500">Interactive preview of the gamification system</p>
        </div>
        <ThemeToggle />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ranks">Ranks</TabsTrigger>
          <TabsTrigger value="quests">Quests</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="companions">Companions</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <RankProgress userRank={userRank} />
            
            <Card>
              <CardHeader>
                <CardTitle>Jungle Path Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Jungle Path gamification system transforms the standard learning experience 
                  into an adventure-themed journey through a mysterious jungle landscape.
                </p>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setActiveTab('ranks')}
                    className="bg-[#1E4A3D] hover:bg-[#2E5A4D]"
                  >
                    View Rank System
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('quests')}
                    className="bg-[#E6B933] hover:bg-[#F6C943] text-black"
                  >
                    Explore Quests
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('map')}
                    className="bg-[#3B82C4] hover:bg-[#4B92D4]"
                  >
                    See Jungle Map
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('companions')}
                    className="bg-[#94C973] hover:bg-[#A4D983] text-black"
                  >
                    Meet Companions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {recommendedQuests.slice(0, 3).map(quest => {
              const userAchievement = questProgress[quest.id] || { unlockedAt: null, progress: 0 };
              const progress = userAchievement.progress || 0;
              
              return (
                <QuestProgress
                  key={quest.id}
                  quest={quest}
                  userProgress={progress}
                  nextQuests={recommendedQuests.filter(q => q.id !== quest.id).slice(0, 2)}
                />
              );
            })}
          </div>
        </TabsContent>
        
        {/* Ranks Tab */}
        <TabsContent value="ranks" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <RankProgress userRank={userRank} />
            
            <Card>
              <CardHeader>
                <CardTitle>Rank System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Progress through five explorer ranks from Newcomer to Jungle Guardian.
                  Each rank unlocks new zones and abilities in the jungle.
                </p>
                <Button 
                  onClick={() => setShowRankUp(true)}
                  className="w-full"
                >
                  Simulate Rank Up
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Quests Tab */}
        <TabsContent value="quests" className="space-y-6">
          <QuestList 
            quests={jungleQuests} 
            userAchievements={questProgress}
            userRank={userRank.level}
          />
        </TabsContent>
        
        {/* Map Tab */}
        <TabsContent value="map" className="space-y-6">
          <JungleMap 
            userRank={userRank.level}
            zoneProgress={zoneProgress}
          />
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {zones.slice(0, 3).map(zone => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                progress={zoneProgress[zone.category]}
                isUnlocked={zone.requiredRank <= userRank.level}
                questCount={jungleQuests.filter(q => q.category === zone.category).length}
                completedQuests={Object.entries(questProgress)
                  .filter(([id, data]) => 
                    data.unlockedAt !== null && 
                    jungleQuests.find(q => q.id === id)?.category === zone.category
                  ).length
                }
              />
            ))}
          </div>
        </TabsContent>
        
        {/* Companions Tab */}
        <TabsContent value="companions" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Show all companions from the context */}
            {useCompanion().companions.map(companion => (
              <CompanionCard
                key={companion.id}
                companion={companion}
                isUnlocked={true}
                isActive={activeCompanion?.id === companion.id}
                onSelect={setActiveCompanion}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Rank Up Celebration Dialog */}
      <RankUpCelebration
        isOpen={showRankUp}
        onClose={() => setShowRankUp(false)}
        previousRank={userRank.level - 1}
        newRank={userRank.level}
      />
      
      {/* Companion Dialog */}
      {activeCompanion && (
        <CompanionDialog
          isOpen={dialogVisible}
          onClose={hideCompanionDialog}
          companion={activeCompanion}
        />
      )}
    </div>
  );
};

/**
 * Wrapped Demo with necessary providers
 */
const WrappedJunglePathDemo: React.FC = () => {
  return (
    <JungleThemeProvider>
      <CompanionProvider 
        userAchievements={Object.keys(sampleUserProgress.achievements)
          .filter(id => sampleUserProgress.achievements[id].unlockedAt !== null)
        }
        userTier="tier1"
      >
        <JunglePathDemo />
      </CompanionProvider>
    </JungleThemeProvider>
  );
};

export default WrappedJunglePathDemo;