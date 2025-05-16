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
    return \`\${hours}h \${mins}m\`;
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
              {analytics.overallProgress.completionRate * 100}%
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
                        return \`\${date.getMonth() + 1}/\${date.getDate()}\`;
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => \`\${value}\`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [\`\${value} modules\`, 'Completed']}
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
                        formatter={(value: number) => [\`\${value} activities\`, 'Count']}
                      />
                      <Bar 
                        dataKey="count" 
                        nameKey="day"
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
                        formatter={(value: number) => [\`\${value} activities\`, 'Count']}
                      />
                      <Bar 
                        dataKey="count" 
                        nameKey="category"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Time Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center p-4">
                  <div className="text-4xl font-bold mb-1">{timeData.totalHoursSpent}h</div>
                  <div className="text-muted-foreground text-sm text-center">
                    Total time spent on learning activities
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center p-4">
                  <div className="text-4xl font-bold mb-1">{timeData.averageTimePerSession}m</div>
                  <div className="text-muted-foreground text-sm text-center">
                    Average time spent per learning session
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1 text-green-500" />
                    <span>5% increase compared to last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Time Spent by Category</CardTitle>
              <CardDescription>
                Hours spent on different learning categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeData.timeSpentByCategory.map((category, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{category.category}</span>
                      <span className="text-sm font-medium">{category.hours}h</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: \`\${(category.hours / timeData.timeSpentByCategory.reduce((acc, curr) => acc + curr.hours, 0)) * 100}%\`,
                          backgroundColor: demoColors[i % demoColors.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="h-64 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeData.timeSpentByCategory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [\`\${value} hours\`, 'Time Spent']} />
                    <Bar 
                      dataKey="hours" 
                      radius={[4, 4, 0, 0]}
                    >
                      {timeData.timeSpentByCategory.map((entry, index) => (
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
              <CardTitle>Time Spent by Day</CardTitle>
              <CardDescription>
                Minutes spent learning over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeData.timeSpentByDay}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return \`\${date.getMonth() + 1}/\${date.getDate()}\`;
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => \`\${value} min\`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [\`\${value} minutes\`, 'Time Spent']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString();
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="minutes" 
                      stroke="#14b8a6" 
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
      </Tabs>
    </div>
  );
}

// Demo data
const demoAnalyticsData = {
  overallProgress: {
    completed: 24,
    inProgress: 8,
    notStarted: 12,
    completionRate: 0.55,
    totalModules: 44
  },
  pathProgress: [
    { id: 1, name: 'Financial Basics', progress: 85, modules: { completed: 17, total: 20 } },
    { id: 2, name: 'Cooking Fundamentals', progress: 60, modules: { completed: 6, total: 10 } },
    { id: 3, name: 'Home Maintenance', progress: 25, modules: { completed: 3, total: 12 } }
  ],
  completionTrend: [
    { date: '2025-04-16', modules: 0 },
    { date: '2025-04-17', modules: 1 },
    { date: '2025-04-18', modules: 0 },
    { date: '2025-04-19', modules: 2 },
    { date: '2025-04-20', modules: 1 },
    { date: '2025-04-21', modules: 0 },
    { date: '2025-04-22', modules: 3 },
    { date: '2025-04-23', modules: 1 },
    { date: '2025-04-24', modules: 2 },
    { date: '2025-04-25', modules: 0 },
    { date: '2025-04-26', modules: 1 },
    { date: '2025-04-27', modules: 0 },
    { date: '2025-04-28', modules: 1 },
    { date: '2025-04-29', modules: 2 },
    { date: '2025-04-30', modules: 0 },
    { date: '2025-05-01', modules: 1 },
    { date: '2025-05-02', modules: 0 },
    { date: '2025-05-03', modules: 2 },
    { date: '2025-05-04', modules: 1 },
    { date: '2025-05-05', modules: 0 },
    { date: '2025-05-06', modules: 2 },
    { date: '2025-05-07', modules: 1 },
    { date: '2025-05-08', modules: 0 },
    { date: '2025-05-09', modules: 1 },
    { date: '2025-05-10', modules: 2 },
    { date: '2025-05-11', modules: 1 },
    { date: '2025-05-12', modules: 0 },
    { date: '2025-05-13', modules: 1 },
    { date: '2025-05-14', modules: 0 },
    { date: '2025-05-15', modules: 2 },
  ]
};

const demoAchievements = {
  recentAchievements: [
    { id: 1, title: 'Completed First Path', date: '2025-05-10', type: 'completion', points: 100 },
    { id: 2, title: '5-Day Streak', date: '2025-05-08', type: 'streak', points: 50 },
    { id: 3, title: 'Financial Explorer', date: '2025-05-05', type: 'skill', points: 75 }
  ]
};

const demoActivities = {
  recentActivities: [
    { id: 1, type: 'module_completion', title: 'Completed "Budgeting Basics"', date: '2025-05-15T14:30:00Z', category: 'finance' },
    { id: 2, type: 'quiz_completion', title: 'Scored 95% on "Cooking Terms"', date: '2025-05-14T10:15:00Z', category: 'cooking' },
    { id: 3, type: 'path_started', title: 'Started "Home Maintenance" path', date: '2025-05-13T16:45:00Z', category: 'home' },
    { id: 4, type: 'achievement', title: 'Earned "Financial Planner" badge', date: '2025-05-12T09:20:00Z', category: 'finance' },
    { id: 5, type: 'module_completion', title: 'Completed "Simple Repairs"', date: '2025-05-11T11:50:00Z', category: 'home' }
  ],
  activityByDay: [
    { day: 'Monday', count: 7 },
    { day: 'Tuesday', count: 5 },
    { day: 'Wednesday', count: 8 },
    { day: 'Thursday', count: 6 },
    { day: 'Friday', count: 9 },
    { day: 'Saturday', count: 4 },
    { day: 'Sunday', count: 3 }
  ],
  activityByCategory: [
    { category: 'Finance', count: 12 },
    { category: 'Cooking', count: 8 },
    { category: 'Home', count: 5 },
    { category: 'Personal Growth', count: 7 },
    { category: 'Health', count: 6 }
  ]
};

const demoTimeData = {
  totalHoursSpent: 28.5,
  averageTimePerSession: 32,
  timeSpentByCategory: [
    { category: 'Finance', hours: 10.5 },
    { category: 'Cooking', hours: 6.2 },
    { category: 'Home', hours: 4.8 },
    { category: 'Personal Growth', hours: 3.5 },
    { category: 'Health', hours: 3.5 }
  ],
  timeSpentByDay: [
    { date: '2025-05-09', minutes: 45 },
    { date: '2025-05-10', minutes: 30 },
    { date: '2025-05-11', minutes: 60 },
    { date: '2025-05-12', minutes: 25 },
    { date: '2025-05-13', minutes: 40 },
    { date: '2025-05-14', minutes: 55 },
    { date: '2025-05-15', minutes: 70 }
  ]
};