import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Award,
  BarChart3,
  BookOpenCheck,
  Brain,
  Dumbbell,
  Flame,
  Gift,
  Medal,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
  Share2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { SocialShare } from "@/components/social-sharing";

import { 
  AchievementCategory, 
  ACHIEVEMENTS, 
  Achievement,
  createSampleUserProgress, 
  UserArcadeProgress 
} from "@/shared/arcade-schema";
import { fundiInteractionsService } from "@/services/fundi-interactions-service";

// Map of category icons
const CATEGORY_ICONS: Record<AchievementCategory, React.ReactNode> = {
  finance: <Award className="h-5 w-5" />,
  career: <BookOpenCheck className="h-5 w-5" />,
  wellness: <Flame className="h-5 w-5" />,
  fitness: <Dumbbell className="h-5 w-5" />,
  learning: <Rocket className="h-5 w-5" />,
  emergency: <Zap className="h-5 w-5" />,
  general: <Star className="h-5 w-5" />
};

// Getting a sample user progress - would normally be fetched from API
const userProgress = createSampleUserProgress("user1");

// Category labels for display
const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  finance: "Financial Literacy",
  career: "Career Development",
  wellness: "Wellness & Nutrition",
  fitness: "Active Fitness",
  learning: "Life Skills",
  emergency: "Emergency Readiness",
  general: "All Categories"
};

// Tier colors and styles
const TIER_STYLES: Record<string, { bg: string, border: string, text: string }> = {
  common: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700" },
  uncommon: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700" },
  rare: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
  epic: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" },
  legendary: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" }
};

// Achievement Card Component
const AchievementCard = ({ 
  achievement, 
  userProgress 
}: { 
  achievement: Achievement, 
  userProgress: UserArcadeProgress 
}) => {
  const userAchievement = userProgress.achievements[achievement.id];
  const isUnlocked = userAchievement?.unlockedAt !== undefined;
  const progress = userAchievement?.progress || 0;
  const tierStyle = TIER_STYLES[achievement.tier];

  // If it's hidden and not unlocked, don't show it
  if (achievement.hidden && !isUnlocked) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2 opacity-50">
              <div className="rounded-full bg-gray-100 p-1">
                <Gift className="h-5 w-5 text-gray-400" />
              </div>
              <CardTitle className="text-sm">Hidden Achievement</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">???</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 italic">Complete special actions to unlock this achievement</p>
          <Progress value={0} className="h-1.5 mt-3" />
        </CardContent>
      </Card>
    );
  }

  // Dynamic icon based on the achievement's category
  const IconComponent = achievement.iconName ? 
    // @ts-ignore - dynamically using Lucide icons
    {Trophy, Medal, Star, Flame, Dumbbell, BookOpenCheck, Target, Rocket, Sparkles, Users}[achievement.iconName] || 
    Trophy : 
    Trophy;

  // Handle sharing achievements to social media
  const handleShareAchievement = () => {
    // If this is the first time the user is sharing this achievement
    // We could mark it as shared in the database
    if (isUnlocked) {
      toast({
        title: "Achievement Shared!",
        description: "Your achievement has been shared to social media.",
        duration: 3000,
      });
      
      // Trigger a witty Fundi comment about sharing achievements
      fundiInteractionsService.processEvent({
        type: 'achievement_unlocked',
        userId: userProgress.userId,
        achievementId: achievement.id,
        achievementTitle: achievement.title,
        category: achievement.category
      });
    }
  };

  return (
    <Card className={`border-2 ${isUnlocked ? tierStyle.border : 'border-gray-200 bg-gray-50 opacity-75'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-1 ${isUnlocked ? tierStyle.bg : 'bg-gray-100'}`}>
              <IconComponent className={`h-5 w-5 ${isUnlocked ? tierStyle.text : 'text-gray-400'}`} />
            </div>
            <CardTitle className="text-sm">{achievement.title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {achievement.points} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500">{achievement.description}</p>
        <Progress 
          value={progress} 
          className="h-1.5 mt-3" 
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">{achievement.requirement}</span>
          <span className="text-xs font-medium">
            {isUnlocked 
              ? <span className="text-green-600">Complete</span> 
              : `${progress}%`
            }
          </span>
        </div>
      </CardContent>
      
      {/* Add social sharing if achievement is unlocked */}
      {isUnlocked && (
        <CardFooter className="pt-0 flex justify-end">
          <SocialShare
            title={`I just earned the "${achievement.title}" achievement!`}
            description={achievement.description}
            onShare={handleShareAchievement}
          />
        </CardFooter>
      )}
    </Card>
  );
};

// Learning Module Card for quick access to learning content
const LearningModuleCard = ({ 
  title, 
  description, 
  progress, 
  category, 
  points, 
  href 
}: { 
  title: string, 
  description: string, 
  progress: number, 
  category: AchievementCategory, 
  points: number, 
  href: string 
}) => {
  const [, navigate] = useLocation();
  const CategoryIcon = CATEGORY_ICONS[category];

  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-50 p-1">
              {CategoryIcon}
            </div>
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {points} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-3">{description}</p>
        <Progress value={progress} className="h-1.5" />
        <div className="flex justify-between mt-3">
          <span className="text-xs text-gray-500">{progress}% complete</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => navigate(href)}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RankCard = ({ userProgress }: { userProgress: UserArcadeProgress }) => {
  const { rank } = userProgress;
  const progressToNext = 
    (rank.currentPoints / rank.nextLevelPoints) * 100;

  return (
    <Card className="border-2 border-amber-200 bg-amber-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Level {rank.level}</CardTitle>
            <CardDescription>{rank.title}</CardDescription>
          </div>
          <div className="h-16 w-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
            <span className="text-2xl font-bold text-amber-800">{rank.level}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Level {rank.level + 1}</span>
              <span>{rank.currentPoints} / {rank.nextLevelPoints} XP</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
              <span className="text-sm text-gray-500">Total Points</span>
              <span className="text-xl font-bold">{rank.currentPoints}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
              <span className="text-sm text-gray-500">Day Streak</span>
              <span className="text-xl font-bold">{userProgress.streakDays}</span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-2">Category Levels</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(rank.categoryLevels).map(([category, level]) => (
                <div key={category} className="flex items-center gap-2 text-sm">
                  <div className="rounded-full bg-gray-100 p-1">
                    {CATEGORY_ICONS[category as AchievementCategory]}
                  </div>
                  <span>Level {level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Daily Challenges Component
const DailyChallenges = ({ onViewAllChallenges }: { onViewAllChallenges?: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Daily Challenges</CardTitle>
        <CardDescription>Complete these challenges to earn bonus points</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sample challenges */}
        <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Finance Quiz</h4>
              <p className="text-xs text-gray-600">Answer 5 finance questions correctly</p>
            </div>
          </div>
          <Badge className="bg-green-600">+20 pts</Badge>
        </div>
        
        <div className="flex justify-between items-center p-3 border rounded-lg bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <Dumbbell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium">Workout Challenge</h4>
              <p className="text-xs text-gray-600">Log a fitness activity today</p>
            </div>
          </div>
          <Badge className="bg-purple-600">+15 pts</Badge>
        </div>
        
        <div className="flex justify-between items-center p-3 border rounded-lg bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2">
              <BookOpenCheck className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium">Learning Streak</h4>
              <p className="text-xs text-gray-600">Complete any learning module</p>
            </div>
          </div>
          <Badge className="bg-orange-600">+15 pts</Badge>
        </div>
        
        <Button 
          className="w-full" 
          onClick={onViewAllChallenges}
        >
          View All Challenges
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Arcade Page
export default function Arcade() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | "all">("all");
  const [, navigate] = useLocation();
  
  // Filter achievements by category
  const filteredAchievements = ACHIEVEMENTS.filter(achievement => 
    categoryFilter === "all" || achievement.category === categoryFilter
  );
  
  // Get user's unlocked achievements
  const unlockedAchievements = Object.entries(userProgress.achievements)
    .filter(([_, data]) => data.unlockedAt !== undefined)
    .map(([id, _]) => id);
  
  // Count achievements by category
  const achievementCounts = ACHIEVEMENTS.reduce((acc, achievement) => {
    acc[achievement.category] = (acc[achievement.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count unlocked achievements by category
  const unlockedCounts = Object.entries(userProgress.achievements)
    .filter(([_, data]) => data.unlockedAt !== undefined)
    .reduce((acc, [id, _]) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        acc[achievement.category] = (acc[achievement.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
  // Handler functions for buttons
  const handleViewAllChallenges = () => {
    setActiveTab("challenges");
  };
  
  const handleViewAllPathways = () => {
    navigate("/learning/pathways");
  };
  
  const handleViewAllCompletedCourses = () => {
    navigate("/learning/completed");
  };
  
  const handleContinuePath = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Arcade</h1>
          <p className="text-muted-foreground">Track your achievements and progress</p>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full">
            <Trophy className="h-5 w-5" />
            <span className="font-medium">{userProgress.rank.currentPoints} pts</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 sm:grid-cols-4 w-full max-w-lg mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rank Card */}
            <RankCard userProgress={userProgress} />
            
            {/* Daily Challenges Preview */}
            <DailyChallenges onViewAllChallenges={handleViewAllChallenges} />
          </div>
          
          <h2 className="text-xl font-bold mt-8">Recent Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id))
              .slice(0, 3)
              .map(achievement => (
                <AchievementCard 
                  key={achievement.id}
                  achievement={achievement}
                  userProgress={userProgress}
                />
              ))}
          </div>
          
          {/* Learning Analytics Dashboard Card - Direct access from landing page */}
          <h2 className="text-xl font-bold mt-8">Learning Analytics Dashboard</h2>
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Track Your Learning Progress
                  </CardTitle>
                  <CardDescription>
                    Monitor your journey across educational frameworks and life skill domains
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => navigate('/learning/analytics')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-1 text-purple-500" />
                    SEL Framework
                  </h4>
                  <Progress value={65} className="h-2 mb-1" />
                  <p className="text-xs text-gray-500">Track social-emotional learning competencies</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-teal-500" />
                    LIFE Framework
                  </h4>
                  <Progress value={42} className="h-2 mb-1" />
                  <p className="text-xs text-gray-500">Track life skill domains and progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mt-8">Learning Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <LearningModuleCard
              title="Kitchen Skills"
              description="Master essential cooking techniques"
              progress={75}
              category="learning"
              points={30}
              href="/learning/courses/cooking-basics"
            />
            <LearningModuleCard
              title="Financial Planning"
              description="Build a solid financial foundation"
              progress={40}
              category="finance"
              points={45}
              href="/finance"
            />
            <LearningModuleCard
              title="Yoga Fundamentals"
              description="Improve flexibility and balance"
              progress={60}
              category="fitness"
              points={35}
              href="/active?section=yoga"
            />
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={categoryFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter("all")}
            >
              All Categories
            </Button>
            {Object.keys(CATEGORY_LABELS).map(category => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category as AchievementCategory)}
                className="flex items-center gap-1"
              >
                {CATEGORY_ICONS[category as AchievementCategory]}
                <span>{CATEGORY_LABELS[category as AchievementCategory]}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {unlockedCounts[category] || 0}/{achievementCounts[category] || 0}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAchievements.map(achievement => (
              <AchievementCard 
                key={achievement.id}
                achievement={achievement}
                userProgress={userProgress}
              />
            ))}
          </div>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Pathways</CardTitle>
                <CardDescription>Follow structured paths to build skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Financial Literacy Path */}
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Financial Literacy</h3>
                    </div>
                    <Badge variant="outline">4 modules</Badge>
                  </div>
                  <Progress value={50} className="h-1.5 mb-2" />
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">50% complete</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-5 p-0"
                      onClick={() => handleContinuePath("/finance/education")}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
                
                {/* Cooking Skills Path */}
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium">Cooking Skills</h3>
                    </div>
                    <Badge variant="outline">6 modules</Badge>
                  </div>
                  <Progress value={75} className="h-1.5 mb-2" />
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">75% complete</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-5 p-0"
                      onClick={() => handleContinuePath("/learning/courses/cooking-basics")}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
                
                {/* More paths can be added here */}
                
                <Button 
                  className="w-full mt-2"
                  onClick={handleViewAllPathways}
                >
                  View All Pathways
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completed Courses</CardTitle>
                <CardDescription>Your learning achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <Medal className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Vehicle Maintenance Basics</h4>
                        <p className="text-xs text-gray-600">Completed on April 12, 2025</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">+35 pts</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <Medal className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Basic First Aid</h4>
                        <p className="text-xs text-gray-600">Completed on April 5, 2025</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">+40 pts</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <Medal className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Resume Building</h4>
                        <p className="text-xs text-gray-600">Completed on March 28, 2025</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">+25 pts</Badge>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  onClick={handleViewAllCompletedCourses}
                >
                  View All Completed Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Challenges</CardTitle>
                <CardDescription>Complete these challenges to earn bonus points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Expanded version of the DailyChallenges component */}
                <div className="flex justify-between items-center p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Finance Quiz</h4>
                      <p className="text-xs text-gray-600">Answer 5 finance questions correctly</p>
                    </div>
                  </div>
                  <Badge className="bg-green-600">+20 pts</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg bg-purple-50 border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Dumbbell className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Workout Challenge</h4>
                      <p className="text-xs text-gray-600">Log a fitness activity today</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-600">+15 pts</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg bg-orange-50 border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2">
                      <BookOpenCheck className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Learning Streak</h4>
                      <p className="text-xs text-gray-600">Complete any learning module</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-600">+15 pts</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg bg-rose-50 border-rose-200">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-rose-100 p-2">
                      <Flame className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Meditation Session</h4>
                      <p className="text-xs text-gray-600">Complete a guided meditation</p>
                    </div>
                  </div>
                  <Badge className="bg-rose-600">+10 pts</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Challenges</CardTitle>
                <CardDescription>Bigger challenges, bigger rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-medium">Financial Goals</h4>
                    </div>
                    <Badge variant="outline">+50 pts</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Set up 3 financial goals and create action plans</p>
                  <Progress value={33} className="h-1.5" />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">1/3 complete</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-5 p-0"
                      onClick={() => handleContinuePath("/finance/goals")}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-medium">Fitness Week</h4>
                    </div>
                    <Badge variant="outline">+75 pts</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Complete 5 different workout sessions this week</p>
                  <Progress value={40} className="h-1.5" />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">2/5 complete</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-5 p-0"
                      onClick={() => handleContinuePath("/active")}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="font-medium">Cooking Challenge</h4>
                    </div>
                    <Badge variant="outline">+60 pts</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Follow 3 recipes and document your results</p>
                  <Progress value={0} className="h-1.5" />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">0/3 complete</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-5 p-0"
                      onClick={() => handleContinuePath("/learning/courses/cooking-basics")}
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}