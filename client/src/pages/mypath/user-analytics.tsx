import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
// Using a simple loading state instead of BarLoader
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, BookOpenIcon, ClockIcon, BarChartIcon, UserIcon, ArrowUpIcon } from 'lucide-react';

// Demo analytics data
const demoAnalyticsData = {
  overallProgress: {
    completionRate: 0.68,
    completed: 24,
    inProgress: 8,
    notStarted: 12
  },
  pathProgress: [
    {
      name: "Financial Basics",
      progress: 85,
      modules: { completed: 17, total: 20 }
    },
    {
      name: "Cooking Skills",
      progress: 60,
      modules: { completed: 9, total: 15 }
    },
    {
      name: "Home Maintenance",
      progress: 33,
      modules: { completed: 4, total: 12 }
    }
  ],
  completionTrend: [
    { date: "2025-04-01", modules: 3 },
    { date: "2025-04-08", modules: 5 },
    { date: "2025-04-15", modules: 7 },
    { date: "2025-04-22", modules: 4 },
    { date: "2025-04-29", modules: 9 }
  ]
};

// Demo achievements data
const demoAchievements = {
  recentAchievements: [
    { title: "Budget Master", date: "2025-04-28", points: 100 },
    { title: "Cooking Apprentice", date: "2025-04-25", points: 75 },
    { title: "Home DIY Explorer", date: "2025-04-20", points: 50 }
  ],
  totalAchievements: 12,
  totalPoints: 850
};

// Demo activities data
const demoActivities = {
  recentActivities: [
    { 
      title: "Completed Budget Planning Module", 
      date: "2025-04-29T14:30:00", 
      category: "finance",
      pathName: "Financial Basics"
    },
    { 
      title: "Watched Knife Skills Video", 
      date: "2025-04-28T10:15:00", 
      category: "cooking",
      pathName: "Cooking Skills"
    },
    { 
      title: "Completed Home Plumbing Quiz", 
      date: "2025-04-27T16:45:00", 
      category: "home",
      pathName: "Home Maintenance"
    },
    { 
      title: "Started Investment Module", 
      date: "2025-04-26T09:20:00", 
      category: "finance",
      pathName: "Financial Basics"
    }
  ],
  activityByDay: [
    { day: "Monday", count: 8 },
    { day: "Tuesday", count: 5 },
    { day: "Wednesday", count: 10 },
    { day: "Thursday", count: 6 },
    { day: "Friday", count: 12 },
    { day: "Saturday", count: 4 },
    { day: "Sunday", count: 2 }
  ],
  activityByCategory: [
    { category: "Finance", count: 15 },
    { category: "Cooking", count: 12 },
    { category: "Home", count: 8 },
    { category: "General", count: 5 }
  ]
};

// Demo time data
const demoTimeData = {
  totalHoursSpent: 48,
  averageTimePerSession: 32,
  timeByCategory: [
    { category: "Finance", hours: 18 },
    { category: "Cooking", hours: 15 },
    { category: "Home", hours: 10 },
    { category: "General", hours: 5 }
  ],
  timeByDay: [
    { day: "Monday", minutes: 75 },
    { day: "Tuesday", minutes: 60 },
    { day: "Wednesday", minutes: 120 },
    { day: "Thursday", minutes: 45 },
    { day: "Friday", minutes: 150 },
    { day: "Saturday", minutes: 30 },
    { day: "Sunday", minutes: 15 }
  ],
  timeByTime: [
    { time: "Morning", percent: 35 },
    { time: "Afternoon", percent: 40 },
    { time: "Evening", percent: 25 }
  ]
};

export default function UserAnalytics() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('progress');
  
  // Fetch user analytics data - would usually come from the API
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/me'],
    queryFn: async () => {
      // Placeholder - in production this would fetch from API
      // This is for demonstration purposes only
      return demoAnalyticsData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch user achievements
  const { data: achievements } = useQuery({
    queryKey: ['/api/analytics/me/achievements'],
    queryFn: async () => {
      // Placeholder - in production this would fetch from API
      // This is for demonstration purposes only
      return demoAchievements;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch user activities
  const { data: activities } = useQuery({
    queryKey: ['/api/analytics/me/activities'],
    queryFn: async () => {
      // Placeholder - in production this would fetch from API
      // This is for demonstration purposes only
      return demoActivities;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch user time data
  const { data: timeData } = useQuery({
    queryKey: ['/api/analytics/me/time'],
    queryFn: async () => {
      // Placeholder - in production this would fetch from API
      // This is for demonstration purposes only
      return demoTimeData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const demoColors = [
    '#3b82f6', // blue
    '#f97316', // orange
    '#14b8a6', // teal
    '#f43f5e', // pink
    '#8b5cf6', // purple
  ];
  
  // Helper to format time (minutes to hours & minutes)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container py-10 space-y-8">
        <h1 className="text-3xl font-bold">Your Learning Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-12 w-full mt-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-96 border rounded-lg p-6">
          <div className="space-y-4 h-full flex flex-col justify-center items-center">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!analytics || !activities || !achievements || !timeData) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold">Your Learning Analytics</h1>
        <p className="text-red-500 mt-4">
          Unable to load analytics data. Please try again later.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Your Learning Analytics</h1>
        <div className="flex gap-2">
          <button 
            className="text-sm bg-muted px-3 py-1 rounded-md hover:bg-muted/80"
            onClick={() => {
              toast({
                title: "Analytics Exported",
                description: "Your analytics data has been exported to PDF"
              });
            }}
          >
            Export Data
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              <CardTitle className="text-base">Overall Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {Math.round(analytics.overallProgress.completionRate * 100)}%
            </div>
            <Progress 
              value={analytics.overallProgress.completionRate * 100} 
              max={100} 
              className="h-2" 
            />
            <div className="grid grid-cols-3 gap-2 text-center text-sm mt-4">
              <div>
                <div className="font-medium">{analytics.overallProgress.completed}</div>
                <div className="text-muted-foreground text-xs">Completed</div>
              </div>
              <div>
                <div className="font-medium">{analytics.overallProgress.inProgress}</div>
                <div className="text-muted-foreground text-xs">In Progress</div>
              </div>
              <div>
                <div className="font-medium">{analytics.overallProgress.notStarted}</div>
                <div className="text-muted-foreground text-xs">Not Started</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              <CardTitle className="text-base">Learning Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {timeData.totalHoursSpent}h
            </div>
            <div className="text-muted-foreground text-sm mb-2">
              Total learning time
            </div>
            <div className="text-sm flex justify-between mt-4">
              <div>
                <div className="font-medium">{timeData.averageTimePerSession}m</div>
                <div className="text-muted-foreground text-xs">Avg. session</div>
              </div>
              <div>
                <div className="font-medium">4.2h</div>
                <div className="text-muted-foreground text-xs">Last 7 days</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-2" />
              <CardTitle className="text-base">Achievements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {achievements.recentAchievements.length}
            </div>
            <div className="text-muted-foreground text-sm">
              Recent achievements
            </div>
            <div className="text-sm mt-4">
              {achievements.recentAchievements.slice(0, 2).map((achievement, i) => (
                <div key={i} className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <div className="text-xs truncate">{achievement.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="time">Time Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Progress</CardTitle>
              <CardDescription>
                Track your progress through different learning paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analytics.pathProgress.map((path, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{path.name}</span>
                      <span className="text-sm font-medium">{path.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Progress value={path.progress} max={100} className="h-2" />
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {path.modules.completed}/{path.modules.total} modules
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Completion Trend</CardTitle>
              <CardDescription>
                Modules completed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.completionTrend}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} modules`, 'Completed']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString();
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="modules" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Your most recent learning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="mt-0.5">
                      <div className={
                        "w-8 h-8 rounded-full flex items-center justify-center text-white " + 
                        (activity.category === 'finance' ? 'bg-blue-500' : 
                         activity.category === 'cooking' ? 'bg-orange-500' : 
                         activity.category === 'home' ? 'bg-teal-500' : 'bg-violet-500')
                      }>
                        {activity.category === 'finance' ? 
                          <div className="text-xs">$</div> : 
                         activity.category === 'cooking' ? 
                          <div className="text-xs">🍳</div> : 
                         activity.category === 'home' ? 
                          <div className="text-xs">🏠</div> : 
                          <div className="text-xs">📚</div>}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity by Day</CardTitle>
                <CardDescription>
                  Your most active days of the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activities.activityByDay}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="day" 
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} activities`, 'Count']}
                      />
                      <Bar 
                        dataKey="count" 
                        barSize={20}
                        radius={[0, 4, 4, 0]}
                      >
                        {activities.activityByDay.map((entry, index) => (
                          <Cell key={index} fill={demoColors[index % demoColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity by Category</CardTitle>
                <CardDescription>
                  Distribution of your learning activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activities.activityByCategory}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="category" 
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} activities`, 'Count']}
                      />
                      <Bar 
                        dataKey="count" 
                        barSize={20}
                        radius={[0, 4, 4, 0]}
                      >
                        {activities.activityByCategory.map((entry, index) => (
                          <Cell key={index} fill={demoColors[index % demoColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Spent by Category</CardTitle>
                <CardDescription>
                  How your learning time is distributed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeData.timeByCategory}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        dataKey="category" 
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} hours`, 'Time Spent']}
                      />
                      <Bar 
                        dataKey="hours" 
                        barSize={20}
                        radius={[0, 4, 4, 0]}
                      >
                        {timeData.timeByCategory.map((entry, index) => (
                          <Cell key={index} fill={demoColors[index % demoColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning Time by Day</CardTitle>
                <CardDescription>
                  Minutes spent learning each day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeData.timeByDay}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} minutes`, 'Time Spent']}
                      />
                      <Bar 
                        dataKey="minutes" 
                        fill="#3b82f6"
                        barSize={20}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Time Distribution</CardTitle>
              <CardDescription>
                What time of day you learn best
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeData.timeByTime}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Of Total Time']}
                    />
                    <Bar 
                      dataKey="percent" 
                      fill="#3b82f6"
                      barSize={60}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}