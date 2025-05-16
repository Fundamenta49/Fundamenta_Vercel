import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReloadIcon, BarChartIcon, BookOpenIcon, TrophyIcon, BarChart2 } from "lucide-react";

const StudentProgressDashboard = () => {
  const [useOptimizedApi, setUseOptimizedApi] = useState(true);
  
  // Use the optimized or standard API based on the toggle
  const apiEndpoint = useOptimizedApi 
    ? '/api/student-v2/statistics' 
    : '/api/student/statistics';
  
  // Track request start time for performance measurement
  const startTime = React.useRef(Date.now());
  
  const { 
    data: statistics, 
    isLoading, 
    isError, 
    refetch,
    dataUpdatedAt 
  } = useQuery({
    queryKey: [apiEndpoint],
    retry: 1,
    staleTime: 60000, // 1 minute cache
    refetchOnWindowFocus: false,
    onSuccess: () => {
      // Calculate request duration when data loads
      const endTime = Date.now();
      setRequestDuration(endTime - startTime.current);
    }
  });
  
  // Store the request duration for display
  const [requestDuration, setRequestDuration] = useState<number | null>(null);
  
  // Handle manual refresh with timing
  const handleRefresh = () => {
    startTime.current = Date.now();
    refetch();
  };
  
  // Toggle between optimized and standard API
  const toggleApiVersion = () => {
    setUseOptimizedApi(!useOptimizedApi);
    startTime.current = Date.now();
  };
  
  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
          <CardDescription>There was an error loading your statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Learning Progress</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={useOptimizedApi ? "default" : "outline"}
            size="sm"
            onClick={toggleApiVersion}
          >
            {useOptimizedApi ? "Using Optimized API" : "Using Standard API"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ReloadIcon className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Performance indicator */}
      {requestDuration !== null && (
        <div className="bg-muted p-2 rounded-md text-sm text-muted-foreground">
          Last request completed in {requestDuration}ms using the {useOptimizedApi ? 'optimized' : 'standard'} API.
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Progress Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Modules and assignments completed</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Modules Completed</span>
                    <span>{statistics?.modulesCompleted || 0} / {statistics?.totalModules || 0}</span>
                  </div>
                  <Progress value={statistics?.completionRate || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Assignments Completed</span>
                    <span>{statistics?.assignmentsCompleted || 0} / {statistics?.totalAssignments || 0}</span>
                  </div>
                  <Progress 
                    value={
                      statistics?.totalAssignments 
                        ? (statistics.assignmentsCompleted / statistics.totalAssignments) * 100 
                        : 0
                    } 
                    className="h-2" 
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Current Streak */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Learning Streak</CardTitle>
            <CardDescription>Your consistency is key to mastery</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 bg-muted rounded animate-pulse"></div>
            ) : (
              <div className="flex items-center">
                <TrophyIcon className="w-12 h-12 mr-4 text-yellow-500" />
                <div>
                  <div className="text-3xl font-bold">{statistics?.streak || 0} days</div>
                  <div className="text-sm text-muted-foreground">
                    {statistics?.streak > 0 
                      ? "Keep it up!" 
                      : "Start your streak today!"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Category Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Progress across learning areas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
              </div>
            ) : statistics?.categoryProgress && Object.keys(statistics.categoryProgress).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(statistics.categoryProgress).map(([category, progress]) => (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{category}</span>
                      <span>{Math.round(progress as number)}%</span>
                    </div>
                    <Progress value={progress as number} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <BookOpenIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No category data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning interactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : statistics?.recentActivity && statistics.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {statistics.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md border">
                  <div className="p-2 rounded-full bg-primary/10">
                    {activity.activityType === 'module_completed' ? (
                      <BookOpenIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <BarChart2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.activityType === 'module_completed' 
                        ? 'Completed a module' 
                        : 'Made progress on a module'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChartIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity recorded</p>
              <p className="text-sm">Start learning to track your journey</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressDashboard;