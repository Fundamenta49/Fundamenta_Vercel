import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModuleContext } from '../context/module-context';
import { 
  Dumbbell, 
  Bird as YogaIcon, 
  Timer, 
  Brain, 
  Flame, 
  Activity, 
  User,
  ArrowRight,
  Calendar,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  BarChart3,
  Heart,
  Trophy
} from 'lucide-react';

// Module card component for dashboard
interface ModuleCardProps {
  title: string;
  description: string;
  icon: any;
  moduleId: string;
  highlight?: boolean;
  recommended?: boolean;
}

function ModuleCard({ 
  title, 
  description, 
  icon: Icon, 
  moduleId, 
  highlight = false,
  recommended = false
}: ModuleCardProps) {
  const { setActiveModule } = useModuleContext();

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] overflow-hidden relative ${
        highlight ? 'border-primary border-2' : ''
      }`}
      onClick={() => setActiveModule(moduleId as any)}
    >
      {recommended && (
        <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs rounded-bl-md">
          Recommended
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-lg text-primary">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4 line-clamp-2">
          {description}
        </CardDescription>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">Open module</span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

// Recent activity component
function RecentActivity() {
  const [expanded, setExpanded] = useState(false);
  
  const activities = [
    { 
      id: 1, 
      type: 'yoga', 
      icon: YogaIcon, 
      title: 'Yoga Session', 
      description: 'Completed 30 minutes of beginner yoga flow', 
      date: '2 days ago' 
    },
    { 
      id: 2, 
      type: 'running', 
      icon: Timer, 
      title: 'Morning Run', 
      description: 'Ran 5km in 30 minutes', 
      date: 'Yesterday' 
    },
    { 
      id: 3, 
      type: 'meditation', 
      icon: Brain, 
      title: 'Meditation', 
      description: 'Completed 15 minutes of guided meditation', 
      date: 'Today' 
    }
  ];
  
  const displayActivities = expanded ? activities : activities.slice(0, 2);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
            <div className="bg-primary/10 p-2 rounded-full">
              <activity.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">{activity.title}</h4>
                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
            </div>
          </div>
        ))}
        
        {activities.length > 2 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Weekly goals component
function WeeklyGoals() {
  const goals = [
    { id: 1, title: 'Complete 3 yoga sessions', progress: 66, completed: false },
    { id: 2, title: 'Run 10km this week', progress: 75, completed: false },
    { id: 3, title: 'Meditate for 60 minutes', progress: 100, completed: true },
    { id: 4, title: 'Complete 2 HIIT workouts', progress: 50, completed: false }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
          Weekly Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {goal.completed ? (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 mr-2" />
                )}
                <span className={`text-sm ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                  {goal.title}
                </span>
              </div>
              <span className="text-xs text-gray-500">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-1.5" />
          </div>
        ))}
        
        <Button variant="outline" size="sm" className="w-full mt-2">
          View All Goals
        </Button>
      </CardContent>
    </Card>
  );
}

// Fitness stats summary
function FitnessStatsSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary" />
          Fitness Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Distance</p>
            <p className="text-2xl font-bold">24.5<span className="text-sm font-normal ml-1">km</span></p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active Days</p>
            <p className="text-2xl font-bold">12<span className="text-sm font-normal ml-1">days</span></p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Yoga Sessions</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active Minutes</p>
            <p className="text-2xl font-bold">385</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Achievements component
function Achievements() {
  const achievements = [
    { id: 1, title: 'First 5K', icon: Trophy, completed: true },
    { id: 2, title: 'Yoga Novice', icon: YogaIcon, completed: true },
    { id: 3, title: 'Meditation Master', icon: Brain, completed: false },
    { id: 4, title: 'Weekly Warrior', icon: Dumbbell, completed: true }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-primary" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`flex items-center p-3 rounded-lg border ${
                achievement.completed 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
              }`}
            >
              <div className={`rounded-full p-2 mr-3 ${
                achievement.completed 
                  ? 'bg-green-100 dark:bg-green-800' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <achievement.icon className={`h-4 w-4 ${
                  achievement.completed 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  achievement.completed 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-500">
                  {achievement.completed ? 'Completed' : 'In progress'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main dashboard component
export default function Dashboard() {
  // List of modules to display on the dashboard
  const modules = [
    {
      id: 'yoga',
      title: 'Yoga Practice',
      description: 'Improve flexibility and mindfulness through yoga poses and flows',
      icon: YogaIcon,
      highlight: true,
      recommended: true
    },
    {
      id: 'running',
      title: 'Running Tracker',
      description: 'Track your runs and improve your endurance with guided sessions',
      icon: Timer,
      highlight: true
    },
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Find peace and balance with guided meditation sessions',
      icon: Brain
    },
    {
      id: 'weightlifting',
      title: 'Weight Training',
      description: 'Build strength with personalized workout plans',
      icon: Dumbbell
    },
    {
      id: 'hiit',
      title: 'HIIT Workouts',
      description: 'High-Intensity Interval Training for maximum results',
      icon: Flame
    },
    {
      id: 'stretch',
      title: 'Stretching',
      description: 'Improve flexibility and recovery with guided stretching',
      icon: Activity
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">Welcome to Active You</h1>
          <p className="text-muted-foreground">
            Your personalized fitness and wellness center. Choose a module below to get started.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content - 2/3 width */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold">Fitness Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((module) => (
                <ModuleCard 
                  key={module.id}
                  moduleId={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  highlight={module.highlight}
                  recommended={module.recommended}
                />
              ))}
            </div>
          </div>
          
          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            <RecentActivity />
            <WeeklyGoals />
            <FitnessStatsSummary />
            <Achievements />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}