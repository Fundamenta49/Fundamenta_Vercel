import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  MapPin, Award, Compass, Sparkles, Star, Leaf, Mountain, TreePine, 
  LifeBuoy, FlaskConical, BookOpen, Map, Trees 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useJungleTheme } from '../../jungle-path/contexts/JungleThemeContext';
import { useJungleFundi } from '../../jungle-path/contexts/JungleFundiContext';
import { getAllZones, getAccessibleZones } from '../../jungle-path/utils/zoneUtils';
import { getRankTitle, getRankInfo } from '../../jungle-path/utils/rankCalculator';
import ZoneCard from '@/components/ZoneCard';
import QuestCard from '@/components/QuestCard';
import JungleHeader from '../../jungle-path/components/JungleHeader';
import ExpeditionCard from '../../jungle-path/components/expedition-card';

// Sample data
const SAMPLE_QUESTS = [
  {
    id: 'budget-101',
    originalTitle: 'Budgeting Basics',
    jungleTitle: 'Treasure Hunt: Budgeting Basics',
    originalDescription: 'Learn fundamental budgeting techniques to manage your finances effectively.',
    jungleDescription: 'Deep in the jungle, you\'ll discover treasure and wealth as you uncover the ancient techniques of tracking resources and planning for future expeditions.',
    category: 'finance',
    zoneId: 'golden-temple',
    estimatedTime: 25,
    difficulty: 1,
    requiredRank: 0
  },
  {
    id: 'meditation-intro',
    originalTitle: 'Introduction to Meditation',
    jungleTitle: 'Mind Oasis: Introduction to Meditation',
    originalDescription: 'Learn basic meditation techniques for stress reduction and mental clarity.',
    jungleDescription: 'Under the jungle canopy, seek tranquility and master harmony as you observe the ancient ritual of quieting the mind and connecting with the sounds of nature.',
    category: 'wellness',
    zoneId: 'healing-springs',
    estimatedTime: 15,
    difficulty: 1,
    requiredRank: 1
  },
  {
    id: 'hiit-workout',
    originalTitle: 'High-Intensity Interval Training',
    jungleTitle: 'Jungle Warrior: High-Intensity Interval Training',
    originalDescription: 'Learn efficient workout techniques that maximize results in minimal time.',
    jungleDescription: 'Venture through dense foliage to strength your way as you train like the ancient warriors, harnessing short bursts of power followed by strategic rest.',
    category: 'fitness',
    zoneId: 'rugged-peaks',
    estimatedTime: 30,
    difficulty: 2,
    requiredRank: 2
  },
  {
    id: 'interview-skills',
    originalTitle: 'Mastering Job Interviews',
    jungleTitle: 'Summit Climb: Mastering Job Interviews',
    originalDescription: 'Develop confidence and skills for successful job interviews.',
    jungleDescription: 'Navigate treacherous terrain with strategy and advancement while you prepare to face the tribal elders who will test your knowledge and determine your worthiness.',
    category: 'career',
    zoneId: 'ancient-library',
    estimatedTime: 45,
    difficulty: 2,
    requiredRank: 2
  },
  {
    id: 'emergency-kit',
    originalTitle: 'Building an Emergency Kit',
    jungleTitle: 'Survival Protocol: Building an Emergency Kit',
    originalDescription: 'Learn how to assemble a comprehensive emergency preparedness kit.',
    jungleDescription: 'Ancient tribal wisdom teaches us to harness protection and preparation to gather and organize the essential tools and supplies that will ensure survival when dangers threaten your tribe.',
    category: 'emergency',
    zoneId: 'storm-shelter',
    estimatedTime: 20,
    difficulty: 1,
    requiredRank: 3
  }
];

// Sample completed quests
const COMPLETED_QUESTS = [
  {
    id: 'savings-101',
    originalTitle: 'Savings Strategies',
    jungleTitle: 'Golden Trail: Savings Strategies',
    originalDescription: 'Discover effective methods to build your savings.',
    jungleDescription: 'Following secret paths marked with wealth, discover the power of treasure to gradually accumulate resources through disciplined resource management.',
    category: 'finance',
    zoneId: 'golden-temple',
    estimatedTime: 20,
    difficulty: 1,
    requiredRank: 0
  },
  {
    id: 'yoga-basics',
    originalTitle: 'Yoga Fundamentals',
    jungleTitle: 'Serene Canopy: Yoga Fundamentals',
    originalDescription: 'Learn basic yoga poses and breathing techniques.',
    jungleDescription: 'With the calls of exotic birds overhead, you\'ll explore balance and tranquility when you practice the ancient movement rituals that connect body and spirit.',
    category: 'wellness',
    zoneId: 'healing-springs',
    estimatedTime: 30,
    difficulty: 1,
    requiredRank: 1
  }
];

/**
 * Jungle Theme Demo Page
 * 
 * This page showcases the jungle-themed UI components and interaction patterns
 */
const JungleDemoPage: React.FC = () => {
  const { 
    isJungleTheme, 
    toggleJungleTheme, 
    jungleProgress,
    addXP 
  } = useJungleTheme();

  const { sendJungleMessage } = useJungleFundi();
  const [, navigate] = useLocation();
  
  // State to track which quests are unlocked/completed
  const [questProgress, setQuestProgress] = useState<Record<string, { progress: number, completed: boolean }>>({
    'budget-101': { progress: 65, completed: false },
    'meditation-intro': { progress: 0, completed: false },
    'savings-101': { progress: 100, completed: true },
    'yoga-basics': { progress: 100, completed: true }
  });
  
  // Get all zones and filter based on user rank
  const allZones = getAllZones();
  const accessibleZones = getAccessibleZones(jungleProgress.rank);
  
  // Get rank information
  const rankInfo = getRankInfo(jungleProgress.xp);
  
  // Toggle quest completion status (for demo purposes)
  const toggleQuestCompletion = (questId: string) => {
    setQuestProgress(prev => {
      const currentQuest = prev[questId] || { progress: 0, completed: false };
      
      // If completing the quest
      if (!currentQuest.completed) {
        // Award XP based on difficulty
        const quest = SAMPLE_QUESTS.find(q => q.id === questId);
        if (quest) {
          const xpToAward = quest.difficulty ? quest.difficulty * 10 : 10;
          addXP(xpToAward);
        }
      }
      
      return {
        ...prev,
        [questId]: {
          progress: currentQuest.completed ? 65 : 100,
          completed: !currentQuest.completed
        }
      };
    });
  };
  
  // Ask jungle Fundi about a topic
  const askFundi = (topic: string) => {
    const messages = [
      `Tell me more about the ${topic} zone and what I can learn there.`,
      `What skills can I develop in the ${topic} zone?`,
      `How do the lessons in the ${topic} zone apply to real life?`
    ];
    
    // Select a random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    sendJungleMessage(randomMessage);
  };
  
  // Get icon for zone
  const getZoneIcon = (zoneId: string) => {
    const icons: Record<string, React.ReactNode> = {
      'golden-temple': <Star className="h-5 w-5" />,
      'healing-springs': <Leaf className="h-5 w-5" />,
      'rugged-peaks': <Mountain className="h-5 w-5" />,
      'ancient-library': <BookOpen className="h-5 w-5" />,
      'storm-shelter': <LifeBuoy className="h-5 w-5" />
    };
    
    return icons[zoneId] || <Compass className="h-5 w-5" />;
  };
  
  return (
    <div className="container py-6 max-w-6xl">
      {/* Jungle theme header that appears only when jungle theme is active */}
      <JungleHeader 
        showProgress={true}
        currentZoneCategory="exploration"
        currentQuestTitle="Jungle Theme Demo"
        questProgress={50}
      />
      
      <div className="space-y-8">
        {/* Theme toggle section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Jungle Theme Controls</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-normal">
                  {isJungleTheme ? 'Jungle Mode Active' : 'Standard Mode'}
                </span>
                <Switch
                  checked={isJungleTheme}
                  onCheckedChange={toggleJungleTheme}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Current Rank:</span>
                    <Badge className="bg-green-700">
                      <Award className="h-3.5 w-3.5 mr-1.5" />
                      {getRankTitle(jungleProgress.rank)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>XP:</span>
                    <span className="font-medium">{jungleProgress.xp} points</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span>Progress to {rankInfo.nextRankTitle}</span>
                      <span>{rankInfo.progress}%</span>
                    </div>
                    <Progress value={rankInfo.progress} className="h-2" />
                    <div className="text-xs text-right text-muted-foreground">
                      {rankInfo.xpToNextRank} XP needed
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => addXP(10)}
                    className="flex items-center"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Add 10 XP
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => addXP(50)}
                    className="flex items-center"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Add 50 XP
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/learning/jungle-pathways')}
                    className="flex items-center"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Jungle Map
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => sendJungleMessage("Tell me about this jungle world and how I can explore it.")}
                    className="flex items-center"
                  >
                    <TreePine className="h-4 w-4 mr-2" />
                    Jungle Guide
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main content area */}
        <div>
          <Tabs defaultValue="zones">
            <TabsList className="mb-4">
              <TabsTrigger value="zones" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Zones
              </TabsTrigger>
              <TabsTrigger value="quests" className="flex items-center">
                <Compass className="h-4 w-4 mr-2" />
                Quests
              </TabsTrigger>
              <TabsTrigger value="expeditions" className="flex items-center">
                <Trees className="h-4 w-4 mr-2" />
                Expeditions
              </TabsTrigger>
            </TabsList>
            
            {/* Zones tab */}
            <TabsContent value="zones" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Jungle Zones</h2>
                <Badge variant="outline" className="flex items-center">
                  <FlaskConical className="h-3.5 w-3.5 mr-1.5" />
                  {accessibleZones.length} of {allZones.length} Zones Unlocked
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allZones.map(zone => (
                  <ZoneCard
                    key={zone.id}
                    zone={zone}
                    variant="jungle"
                    isUnlocked={accessibleZones.some(z => z.id === zone.id)}
                    questCount={5}
                    completedQuests={
                      zone.id === 'golden-temple' ? 2 :
                      zone.id === 'healing-springs' ? 1 : 0
                    }
                    progress={
                      zone.id === 'golden-temple' ? 40 :
                      zone.id === 'healing-springs' ? 20 : 0
                    }
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Quests tab */}
            <TabsContent value="quests" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Available Quests</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-700/10">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                    New Quests Available
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {SAMPLE_QUESTS.map(quest => {
                  const progress = questProgress[quest.id]?.progress || 0;
                  const completed = questProgress[quest.id]?.completed || false;
                  const isUnlocked = jungleProgress.rank >= (quest.requiredRank || 0);
                  
                  return (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      progress={progress}
                      isUnlocked={isUnlocked}
                      isCompleted={completed}
                      onClick={() => isUnlocked && toggleQuestCompletion(quest.id)}
                    />
                  );
                })}
              </div>
            </TabsContent>
            
            {/* Expeditions tab */}
            <TabsContent value="expeditions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Expeditions</h2>
                <Badge variant="outline">
                  <Award className="h-3.5 w-3.5 mr-1.5" />
                  {COMPLETED_QUESTS.length} Quests Completed
                </Badge>
              </div>
              
              <ExpeditionCard 
                completedQuests={COMPLETED_QUESTS}
                expeditionTitle="Jungle Beginnings"
              />
              
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">More Expeditions Await</h3>
                    <p className="text-muted-foreground">
                      Complete more quests to unlock additional expeditions and earn rewards.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/learning/quests')}
                    >
                      Find New Quests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Zone exploration cards with Fundi integration */}
        {isJungleTheme && (
          <div className="space-y-4">
            <Separator />
            
            <h2 className="text-2xl font-bold">Explore With Your Guide</h2>
            <p className="text-muted-foreground">
              Ask your jungle guide about any zone to learn more about what you can discover there.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {accessibleZones.map(zone => (
                <Card key={zone.id} className="overflow-hidden border-2" style={{ borderColor: zone.color }}>
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mt-2"
                      style={{ backgroundColor: zone.color }}
                    >
                      {getZoneIcon(zone.id)}
                    </div>
                    <h3 className="font-bold">{zone.name}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => askFundi(zone.name)}
                    >
                      Ask Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JungleDemoPage;