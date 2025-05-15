import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema.js';
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
  CircleUser, 
  BookOpen, 
  Clock, 
  BarChart3, 
  Users, 
  Award
} from 'lucide-react';
import { AnalyticsCard } from '@/components/ui/analytics-card.js';
import { MiniProgressChart } from '@/components/ui/mini-progress-chart.js';
import { Heatmap } from '@/components/ui/heatmap.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Button } from '@/components/ui/button.js';

interface MentorAnalyticsDashboardProps {
  mentorId: number;
  user?: User;
}

/**
 * MentorAnalyticsDashboard component displays analytics for mentors
 * 
 * @param mentorId - The ID of the mentor
 * @param user - The current user (optional)
 */
export function MentorAnalyticsDashboard({ mentorId, user }: MentorAnalyticsDashboardProps) {
  // Input validation
  if (!mentorId || mentorId <= 0) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Invalid Mentor ID</AlertTitle>
        <AlertDescription>
          Unable to load analytics dashboard due to an invalid mentor ID.
        </AlertDescription>
      </Alert>
    );
  }

  // Fetch mentor analytics data
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({ 
    queryKey: ['/api/analytics/mentor', mentorId], 
    enabled: !!mentorId,
  });

  // Handle loading state
  if (isLoading) {
    return <MentorAnalyticsSkeleton />;
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

  // Generate heatmap data from student activity
  const heatmapData = React.useMemo(() => {
    // In a real implementation, this would be fetched from the API
    // This is just a placeholder until we have actual data
    const today = new Date();
    const data = [];
    
    // Create 90 days of sample data
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // For actual implementation, use real activity data
      // Set a random value for now (0-5 range)
      const dateStr = date.toISOString().split('T')[0];
      const value = Math.floor(Math.random() * 6);
      
      data.push({ date: dateStr, value });
    }
    
    return data;
  }, []);

  // Create student engagement data for the chart
  const studentEngagement = {
    activeStudents: data.studentEngagementStats.activeStudents,
    inactiveStudents: data.studentEngagementStats.inactiveStudents,
    totalStudents: data.totalStudents
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor student progress and pathway performance.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="pathways">Pathways</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnalyticsCard
              title="Total Students"
              value={data.totalStudents}
              icon={<Users className="h-4 w-4" />}
            />
            <AnalyticsCard
              title="Total Pathways"
              value={data.totalPathways}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <AnalyticsCard
              title="Pathway Completion Rate"
              value={`${Math.round(data.pathwayCompletionRate)}%`}
              icon={<Award className="h-4 w-4" />}
              description="Percentage of assigned pathways completed"
            />
          </div>

          {/* Student Engagement */}
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement</CardTitle>
              <CardDescription>
                Active vs. inactive students in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Active Students</p>
                    <p className="text-2xl font-bold">
                      {data.studentEngagementStats.activeStudents}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Inactive Students</p>
                    <p className="text-2xl font-bold">
                      {data.studentEngagementStats.inactiveStudents}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Active vs. Inactive</p>
                  <MiniProgressChart
                    percentage={(studentEngagement.activeStudents / Math.max(studentEngagement.totalStudents, 1)) * 100}
                    label={`${studentEngagement.activeStudents} of ${studentEngagement.totalStudents}`}
                    size="lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Average Student Streak</p>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-orange-500" />
                    <span className="text-xl font-bold">
                      {data.studentEngagementStats.averageStudentStreak.toFixed(1)} days
                    </span>
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
                Student activity over the past 90 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Heatmap data={heatmapData} />
            </CardContent>
          </Card>

          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>
                Your 5 most recently assigned pathways
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-start border-b pb-4 last:border-0">
                    <div className="mr-4 mt-0.5">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Pathway #{assignment.pathwayId}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned to Student #{assignment.studentId} on{' '}
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                        <p className="text-xs">Status: {assignment.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {data.recentAssignments.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent assignments found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Analytics</CardTitle>
              <CardDescription>
                Detailed analytics for all your students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon! You'll be able to view detailed performance metrics for each student.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pathways Tab */}
        <TabsContent value="pathways" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pathway Analytics</CardTitle>
              <CardDescription>
                Performance metrics for your learning pathways.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon! You'll be able to view completion rates and student progress for each pathway.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Skeleton loading state for the MentorAnalyticsDashboard
 */
function MentorAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
            <div className="grid gap-4 grid-cols-2">
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