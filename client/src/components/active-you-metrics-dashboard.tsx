import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Dumbbell,
  Flame, 
  Medal, 
  BarChart3, 
  Brain, 
  Rocket,
  Mountain,
  Footprints,
  Wind,
  Trophy,
  Activity
} from 'lucide-react';

import { getFitnessActivityStats } from '@/lib/active-you-integration';
import { ExerciseType } from '@/modules/active-you/context/module-context';

// Using ExerciseType as ActivityType for consistency with existing code
type ActivityType = ExerciseType;

// Map activity types to their icons
const activityIcons: Partial<Record<ActivityType, React.ReactNode>> = {
  yoga: <Mountain className="h-5 w-5" />,
  running: <Footprints className="h-5 w-5" />,
  weightlifting: <Dumbbell className="h-5 w-5" />,
  hiit: <Flame className="h-5 w-5" />,
  stretch: <Wind className="h-5 w-5" />,
  meditation: <Brain className="h-5 w-5" />,
  // The "activeyou" is the main tab, not an actual activity type
  activeyou: <Activity className="h-5 w-5" />
};

/**
 * Dashboard component showing metrics and integrations for ActiveYou
 */
export default function ActiveYouMetricsDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    totalMinutes: 0,
    favoriteActivity: null as ActivityType | null,
    lastActivity: null as Date | null
  });

  // Load stats on component mount
  useEffect(() => {
    const activityStats = getFitnessActivityStats();
    setStats(activityStats);
  }, []);

  // Format functions
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatActivityName = (type: ActivityType | null) => {
    if (!type) return 'None';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="border-pink-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-pink-600" />
          ActiveYou Metrics &amp; Connections
        </CardTitle>
        <CardDescription>
          Track your fitness journey, achievements, and connections with other Fundamenta areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4">
            {/* Workout Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-pink-50 rounded-lg flex flex-col items-center justify-center">
                <Dumbbell className="h-5 w-5 text-pink-600 mb-1" />
                <div className="text-xl font-semibold">{stats.totalWorkouts}</div>
                <div className="text-xs text-gray-600">Total Workouts</div>
              </div>
              
              <div className="p-3 bg-pink-50 rounded-lg flex flex-col items-center justify-center">
                <Calendar className="h-5 w-5 text-pink-600 mb-1" />
                <div className="text-xl font-semibold">{stats.thisWeekWorkouts}</div>
                <div className="text-xs text-gray-600">This Week</div>
              </div>
              
              <div className="p-3 bg-pink-50 rounded-lg flex flex-col items-center justify-center">
                <Clock className="h-5 w-5 text-pink-600 mb-1" />
                <div className="text-xl font-semibold">{stats.totalMinutes}</div>
                <div className="text-xs text-gray-600">Total Minutes</div>
              </div>
              
              <div className="p-3 bg-pink-50 rounded-lg flex flex-col items-center justify-center">
                {stats.favoriteActivity && activityIcons[stats.favoriteActivity]}
                <div className="text-xl font-semibold">{formatActivityName(stats.favoriteActivity)}</div>
                <div className="text-xs text-gray-600">Favorite Activity</div>
              </div>
            </div>
            
            {/* Weekly Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Goal Progress</span>
                <span className="font-medium">{stats.thisWeekWorkouts}/5 workouts</span>
              </div>
              <Progress value={(stats.thisWeekWorkouts / 5) * 100} className="h-2" />
            </div>
            
            {/* Last Activity */}
            <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
              <div>
                <div className="text-sm font-medium">Last Activity</div>
                <div className="text-xs text-gray-600">{formatDate(stats.lastActivity)}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-pink-600 hover:text-pink-700"
              >
                Details
              </Button>
            </div>
          </TabsContent>
          
          {/* ACHIEVEMENTS TAB */}
          <TabsContent value="achievements" className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                Recent Achievements
              </h3>
              
              <div className="space-y-2 mt-2">
                {stats.totalWorkouts > 0 ? (
                  <>
                    <div className="flex justify-between items-center p-3 border rounded-lg bg-gradient-to-r from-amber-50 to-white">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-amber-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium">First Workout</div>
                          <div className="text-xs text-gray-600">Complete your first tracked workout</div>
                        </div>
                      </div>
                      <Badge className="bg-amber-500">10 pts</Badge>
                    </div>
                    
                    {stats.thisWeekWorkouts >= 3 && (
                      <div className="flex justify-between items-center p-3 border rounded-lg bg-gradient-to-r from-amber-50 to-white">
                        <div className="flex items-center">
                          <Medal className="h-5 w-5 text-amber-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Consistency is Key</div>
                            <div className="text-xs text-gray-600">Work out 3 times in one week</div>
                          </div>
                        </div>
                        <Badge className="bg-amber-500">25 pts</Badge>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 border rounded-lg bg-gray-50 text-center">
                    <p className="text-sm text-gray-600">
                      Complete your first workout to earn achievements!
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/arcade')}
              >
                View All Achievements
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </TabsContent>
          
          {/* CONNECTIONS TAB */}
          <TabsContent value="connections" className="space-y-3">
            {/* Learning Paths Connection */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Rocket className="h-4 w-4 mr-1 text-purple-600" />
                Learning Path Progress
              </h3>
              
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fitness Wellness Path</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      {Math.min(stats.totalWorkouts * 5, 100)}% Complete
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(stats.totalWorkouts * 5, 100)} 
                    className="h-1.5 mt-2" 
                  />
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mind-Body Connection</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      {Math.min(stats.totalWorkouts * 3, 100)}% Complete
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(stats.totalWorkouts * 3, 100)} 
                    className="h-1.5 mt-2" 
                  />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-1"
                onClick={() => navigate('/learning/pathways')}
              >
                Explore Learning Paths
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Calendar Connection */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                Calendar Events
              </h3>
              
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  Your workout activities are automatically tracked in your Smart Calendar.
                </p>
                
                <div className="text-xs text-gray-600">
                  {stats.totalWorkouts > 0 
                    ? `${stats.totalWorkouts} workout events synchronized` 
                    : "No workout events yet"}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/calendar')}
              >
                View Calendar
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}