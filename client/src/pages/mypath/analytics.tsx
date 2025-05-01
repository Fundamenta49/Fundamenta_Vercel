import React from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Clock, 
  UserCircle,
  BookOpen, 
  Award, 
  TrendingUp, 
  Users,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Types for analytics data
interface AnalyticsSummary {
  totalModules: number;
  completedModules: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

interface PathwayProgress {
  totalModules: number;
  completedModules: number;
  completionRate: number;
  lastAccessedAt: string | null;
}

interface ActivityItem {
  date: string;
  count: number;
}

interface AssignmentStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  pathwayProgress: Record<string, PathwayProgress>;
  activityTimeline: ActivityItem[];
  recentCategories: string[];
  assignments: AssignmentStats;
}

// Helper function to get a readable date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

// Simple activity heatmap component
function ActivityHeatmap({ 
  activityData 
}: { 
  activityData: ActivityItem[]
}) {
  // Get the last 30 days for the heatmap
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  // Create a map of activity counts by date
  const activityByDate: Record<string, number> = {};
  activityData.forEach(item => {
    activityByDate[item.date] = item.count;
  });
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Activity (Last 30 Days)</h3>
      <div className="flex flex-wrap gap-1">
        {last30Days.map(date => {
          const count = activityByDate[date] || 0;
          let bgColor = "bg-gray-100";
          
          if (count > 0) {
            if (count >= 5) bgColor = "bg-green-500";
            else if (count >= 3) bgColor = "bg-green-400";
            else if (count >= 1) bgColor = "bg-green-300";
          }
          
          return (
            <div 
              key={date} 
              className={`w-4 h-4 rounded-sm ${bgColor} cursor-pointer transition-colors`}
              title={`${formatDate(date)}: ${count} activities`}
            />
          );
        })}
      </div>
    </div>
  );
}

// Analytics Dashboard
export default function AnalyticsDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("overview");
  const { toast } = useToast();
  
  // For demo purposes, using hardcoded user ID
  const userId = 1;
  
  // Fetch analytics data
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: [`/api/analytics/user/${userId}`],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/analytics/user/${userId}`);
      const data = await response.json();
      return data as AnalyticsData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/mypath/student')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to MyPath
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-primary" />
          Learning Analytics
        </h1>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Track your learning progress, identify strengths and areas for improvement,
          and gain insights into your learning patterns.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-white shadow-sm border p-1 text-gray-600 w-full max-w-4xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="progress" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
          >
            Pathway Progress
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger 
            value="assignments" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
          >
            Assignments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading your learning analytics...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load analytics data. Please try again later.
              </AlertDescription>
            </Alert>
          ) : analytics ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Summary cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-4xl font-bold text-primary">
                        {analytics.summary.completionRate}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {analytics.summary.completedModules} of {analytics.summary.totalModules} modules completed
                      </p>
                      <Progress 
                        value={analytics.summary.completionRate} 
                        className="h-2 mt-3 w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-4xl font-bold text-amber-500">
                        {analytics.summary.currentStreak}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        days in a row
                      </p>
                      <div className="mt-3 text-sm">
                        <span className="font-medium">Best streak:</span> {analytics.summary.longestStreak} days
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Assignment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending</span>
                        <span className="text-sm font-medium">{analytics.assignments.pending}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">In Progress</span>
                        <span className="text-sm font-medium">{analytics.assignments.inProgress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed</span>
                        <span className="text-sm font-medium">{analytics.assignments.completed}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-sm font-medium">{analytics.assignments.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Activity Overview</h2>
                <Card>
                  <CardContent className="pt-6">
                    <ActivityHeatmap activityData={analytics.activityTimeline} />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No analytics data available. Start completing modules to see your progress.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading pathway progress...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load pathway progress data. Please try again later.
              </AlertDescription>
            </Alert>
          ) : analytics && Object.keys(analytics.pathwayProgress).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(analytics.pathwayProgress).map(([pathwayId, stats]) => (
                <Card key={pathwayId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pathway #{pathwayId}</CardTitle>
                    <CardDescription>
                      {stats.completedModules} of {stats.totalModules} modules completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{Math.round(stats.completionRate)}%</span>
                      </div>
                      <Progress value={stats.completionRate} className="h-2" />
                      {stats.lastAccessedAt && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Last accessed: {formatDate(stats.lastAccessedAt)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No pathway progress data available yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading activity data...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load activity data. Please try again later.
              </AlertDescription>
            </Alert>
          ) : analytics && analytics.activityTimeline.length > 0 ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Timeline</CardTitle>
                  <CardDescription>
                    Your learning activity over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap activityData={analytics.activityTimeline} />
                  <Separator className="my-6" />
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {analytics.activityTimeline
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(activity => (
                        <div key={activity.date} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Completed {activity.count} {activity.count === 1 ? 'module' : 'modules'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No activity data available yet. Start completing modules to see your activity.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading assignment data...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load assignment data. Please try again later.
              </AlertDescription>
            </Alert>
          ) : analytics ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assignment Overview</CardTitle>
                  <CardDescription>
                    Summary of your assigned learning pathways
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {analytics.assignments.total}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Assignments</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-yellow-500 mb-1">
                          {analytics.assignments.pending}
                        </div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-500 mb-1">
                          {analytics.assignments.inProgress}
                        </div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-500 mb-1">
                          {analytics.assignments.completed}
                        </div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-3">Completion Rate</h3>
                    <div className="flex items-center gap-4">
                      <Progress 
                        value={analytics.assignments.total > 0 
                          ? (analytics.assignments.completed / analytics.assignments.total) * 100 
                          : 0
                        } 
                        className="h-2 flex-1" 
                      />
                      <span className="text-sm font-medium">
                        {analytics.assignments.total > 0 
                          ? Math.round((analytics.assignments.completed / analytics.assignments.total) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/mypath/student')}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View All Assignments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No assignment data available yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}