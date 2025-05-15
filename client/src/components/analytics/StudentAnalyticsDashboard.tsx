import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, UserActivity } from '@shared/schema.js';
import { apiRequest } from '@lib/queryClient.js';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { AnalyticsCard } from '@/components/ui/analytics-card.js';
import { MiniProgressChart } from '@/components/ui/mini-progress-chart.js';
import { Heatmap } from '@/components/ui/heatmap.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Button } from '@/components/ui/button.js';

interface StudentAnalyticsDashboardProps {
  studentId: number;
  user?: User;
}

/**
 * StudentAnalyticsDashboard component displays analytics for students
 * 
 * @param studentId - The ID of the student
 * @param user - The current user (optional)
 */
export function StudentAnalyticsDashboard({ studentId, user }: StudentAnalyticsDashboardProps) {
  // Input validation
  if (!studentId || studentId <= 0) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Invalid Student ID</AlertTitle>
        <AlertDescription>
          Unable to load analytics dashboard due to an invalid student ID.
        </AlertDescription>
      </Alert>
    );
  }

  // Fetch student analytics data
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({ 
    queryKey: ['/api/analytics/student', studentId], 
    enabled: !!studentId,
  });

  // Handle loading state
  if (isLoading) {
    return <StudentAnalyticsSkeleton />;
  }

  // Handle error state
  if (isError || !data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load analytics</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'An error occurred while fetching analytics data.'}
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Process activity data for the heatmap
  const heatmapData = React.useMemo(() => {
    if (!data.activityTimeline || !Array.isArray(data.activityTimeline)) {
      return [];
    }

    // Create a map to count activities by date
    const activityMap = new Map<string, number>();
    
    // Group activities by date
    data.activityTimeline.forEach(activity => {
      if (!activity.timestamp) return;
      
      const date = new Date(activity.timestamp);
      const dateStr = date.toISOString().split('T')[0];
      
      // Increment the count for this date
      const currentCount = activityMap.get(dateStr) || 0;
      activityMap.set(dateStr, currentCount + 1);
    });
    
    // Convert to the format expected by the Heatmap component
    return Array.from(activityMap.entries()).map(([date, value]) => ({
      date,
      value
    }));
  }, [data?.activityTimeline]);

  // Group activities by type for the activity breakdown
  const activityBreakdown = React.useMemo(() => {
    if (!data.activityTimeline || !Array.isArray(data.activityTimeline)) {
      return {};
    }

    const breakdown: Record<string, number> = {};
    
    data.activityTimeline.forEach(activity => {
      if (!activity.type) return;
      
      // Increment the count for this activity type
      breakdown[activity.type] = (breakdown[activity.type] || 0) + 1;
    });
    
    return breakdown;
  }, [data?.activityTimeline]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Progress Dashboard</h2>
        <p className="text-muted-foreground">
          Track your learning progress and achievements.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCard
              title="Assignments"
              value={data.totalAssignments}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <AnalyticsCard
              title="Completed"
              value={data.completedAssignments}
              icon={<CheckCircle className="h-4 w-4" />}
            />
            <AnalyticsCard
              title="Current Streak"
              value={`${data.currentStreak} days`}
              icon={<Award className="h-4 w-4" />}
            />
            <AnalyticsCard
              title="Total Points"
              value={data.totalPoints}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>

          {/* Completion Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Progress</CardTitle>
              <CardDescription>
                Your overall progress across all assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold">
                      {data.completedAssignments}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">In Progress</p>
                    <p className="text-2xl font-bold">
                      {data.inProgressAssignments}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Not Started</p>
                    <p className="text-2xl font-bold">
                      {data.totalAssignments - data.completedAssignments - data.inProgressAssignments}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Completion Rate</p>
                  <MiniProgressChart
                    percentage={data.completionRate}
                    size="lg"
                  />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Your Achievement Badges</p>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Your activity over the past 90 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Heatmap data={heatmapData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>
                Your assigned learning pathways
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2 pb-2 border-b">
                  <p className="text-sm font-medium">Completion Summary</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-green-50 rounded-md">
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-xl font-bold text-green-600">{data.completedAssignments}</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-md">
                      <p className="text-xs text-muted-foreground">In Progress</p>
                      <p className="text-xl font-bold text-blue-600">{data.inProgressAssignments}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-muted-foreground">Not Started</p>
                      <p className="text-xl font-bold text-gray-600">
                        {data.totalAssignments - data.completedAssignments - data.inProgressAssignments}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Detailed assignment information will be displayed here. Use the progress charts to view your completion rate for each pathway.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Your latest learning activities and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.activityTimeline && data.activityTimeline.length > 0 ? (
                  <div className="space-y-4">
                    {data.activityTimeline.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start border-b pb-4 last:border-0">
                        <div className="mr-4 mt-0.5">
                          <ActivityIcon type={activity.type} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{formatActivityType(activity.type)}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Unknown date'}
                          </p>
                          {activity.pointsEarned > 0 && (
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1 text-yellow-500" />
                              <p className="text-xs">{activity.pointsEarned} points earned</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activities found.</p>
                )}
                
                {/* Activity breakdown */}
                {Object.keys(activityBreakdown).length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Activity Breakdown</p>
                    <div className="space-y-2">
                      {Object.entries(activityBreakdown).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ActivityIcon type={type} className="h-4 w-4 mr-2" />
                            <span className="text-sm">{formatActivityType(type)}</span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Returns an appropriate icon for the given activity type
 */
function ActivityIcon({ type, className = "h-5 w-5 text-muted-foreground" }: { type: string, className?: string }) {
  switch (type?.toLowerCase()) {
    case 'check_in':
      return <Calendar className={className} />;
    case 'complete_module':
      return <CheckCircle className={className} />;
    case 'chat_interaction':
      return <BookOpen className={className} />;
    case 'exercise_completion':
      return <BookOpen className={className} />;
    case 'assessment_completion':
      return <Award className={className} />;
    default:
      return <Clock className={className} />;
  }
}

/**
 * Formats an activity type for display
 */
function formatActivityType(type?: string): string {
  if (!type) return 'Unknown Activity';
  
  const typeMap: Record<string, string> = {
    'check_in': 'Daily Check-in',
    'complete_module': 'Module Completion',
    'chat_interaction': 'Chat Interaction',
    'exercise_completion': 'Exercise Completed',
    'assessment_completion': 'Assessment Completed',
    'plan_creation': 'Plan Created'
  };
  
  return typeMap[type] || type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Skeleton loading state for the StudentAnalyticsDashboard
 */
function StudentAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[120px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
                <Skeleton className="h-4 w-[160px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-[180px]" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-[200px]" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}