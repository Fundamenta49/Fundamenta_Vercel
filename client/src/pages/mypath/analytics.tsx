import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { MiniProgressChart } from "@/components/ui/mini-progress-chart";
import { Heatmap } from "@/components/ui/heatmap";
import { 
  User, 
  Settings, 
  Users, 
  Activity, 
  BookOpen, 
  Award,
  BarChart,
  TrendingUp 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsDashboard() {
  // Fetch overview analytics data
  const { data: overviewData, isLoading: isLoadingOverview } = useQuery({
    queryKey: ["/api/analytics/overview"],
    retry: false,
  });

  // Fetch activity by category data for the pie chart
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["/api/analytics/category-breakdown"],
    retry: false,
  });

  // Fetch user activity data for the heatmap
  const { data: activityData, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["/api/analytics/activity-heatmap"],
    retry: false,
  });
  
  // Fetch student performance data
  const { data: studentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ["/api/analytics/student-performance"],
    retry: false,
  });

  // Sample data for demonstration - used when API data is not available
  const sampleOverviewData = {
    totalUsers: 1254,
    totalPaths: 78,
    activeSessions: 342,
    completedActivities: 15678,
    sessionTrend: 12,
    activityTrend: 8,
    averageCompletionRate: 67,
    achievementsEarned: 4321,
    insights: {
      mostActiveTime: "2-4 PM weekdays",
      popularPath: "Financial Literacy Fundamentals",
      retentionRate: 72
    }
  };
  
  const sampleCategoryData = [
    { category: "Finance", count: 342 },
    { category: "Wellness", count: 275 },
    { category: "Cooking", count: 214 },
    { category: "Career", count: 198 },
    { category: "Fitness", count: 156 }
  ];
  
  const sampleActivityData = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    const dateStr = date.toISOString().split('T')[0];
    // Generate random data with weekends having less activity
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const count = isWeekend 
      ? Math.floor(Math.random() * 15) 
      : Math.floor(Math.random() * 45) + 10;
    return { date: dateStr, count };
  });
  
  const sampleStudentData = {
    completionRates: [
      { label: "Module 1", value: 92 },
      { label: "Module 2", value: 85 },
      { label: "Module 3", value: 73 },
      { label: "Module 4", value: 61 },
      { label: "Module 5", value: 48 }
    ],
    averageTimeToCompletionByPath: [
      { path: "Finance Basics", days: 12 },
      { path: "Career Skills", days: 15 },
      { path: "Nutrition 101", days: 9 },
      { path: "Mental Health", days: 14 }
    ],
    studentRetention: {
      overall: 78,
      trend: 3
    },
    activeStudentsByPath: [
      { path: "Finance Basics", count: 245 },
      { path: "Career Skills", count: 187 },
      { path: "Nutrition 101", count: 156 },
      { path: "Mental Health", count: 134 },
      { path: "Home DIY", count: 89 }
    ]
  };

  // Use real data if available, otherwise use sample data
  const displayData = {
    overview: overviewData || sampleOverviewData,
    category: categoryData || sampleCategoryData,
    activity: activityData || sampleActivityData,
    student: studentData || sampleStudentData
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and user engagement</p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="student">
            <TrendingUp className="h-4 w-4 mr-2" />
            Student Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AnalyticsCard
              title="Total Users"
              value={displayData.overview.totalUsers}
              description="Active user accounts"
              icon={<User className="h-4 w-4" />}
              isLoading={isLoadingOverview}
            />
            <AnalyticsCard
              title="Learning Paths"
              value={displayData.overview.totalPaths}
              description="Available learning paths"
              icon={<Settings className="h-4 w-4" />}
              isLoading={isLoadingOverview}
            />
            <AnalyticsCard
              title="Active Sessions"
              value={displayData.overview.activeSessions}
              description="Sessions in the last 24 hours"
              icon={<Users className="h-4 w-4" />}
              trend={
                displayData.overview.sessionTrend
                  ? {
                      value: displayData.overview.sessionTrend,
                      isPositive: displayData.overview.sessionTrend > 0,
                    }
                  : undefined
              }
              isLoading={isLoadingOverview}
            />
            <AnalyticsCard
              title="Completed Activities"
              value={displayData.overview.completedActivities}
              description="Total completed activities"
              icon={<Activity className="h-4 w-4" />}
              trend={
                displayData.overview.activityTrend
                  ? {
                      value: displayData.overview.activityTrend,
                      isPositive: displayData.overview.activityTrend > 0,
                    }
                  : undefined
              }
              isLoading={isLoadingOverview}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MiniProgressChart
              title="Activity by Category"
              data={
                displayData.category.map((item) => ({
                  label: item.category,
                  value: item.count,
                }))
              }
              isLoading={isLoadingCategory}
            />
            
            <div className="space-y-6">
              <AnalyticsCard
                title="Average Completion Rate"
                value={`${displayData.overview.averageCompletionRate}%`}
                description="Path completion percentage"
                icon={<BookOpen className="h-4 w-4" />}
                isLoading={isLoadingOverview}
              />
              
              <AnalyticsCard
                title="Achievements Earned"
                value={displayData.overview.achievementsEarned}
                description="Total achievements earned"
                icon={<Award className="h-4 w-4" />}
                isLoading={isLoadingOverview}
              />
            </div>
            
            <Heatmap
              title="User Activity (Last 4 Weeks)"
              data={
                displayData.activity.map((item) => ({
                  date: item.date,
                  value: item.count,
                }))
              }
              isLoading={isLoadingActivity}
            />
          </div>
          
          {/* Key Insights section */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
            
            {isLoadingOverview ? (
              <p>Loading insights...</p>
            ) : (
              <div className="space-y-4">
                <p>
                  {displayData.overview.insights?.mostActiveTime
                    ? `Most active time: ${displayData.overview.insights.mostActiveTime}`
                    : "Activity data is being collected."}
                </p>
                <p>
                  {displayData.overview.insights?.popularPath
                    ? `Most popular learning path: ${displayData.overview.insights.popularPath}`
                    : "Learning path data is being analyzed."}
                </p>
                <p>
                  {displayData.overview.insights?.retentionRate
                    ? `30-day retention rate: ${displayData.overview.insights.retentionRate}%`
                    : "Retention data is being calculated."}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AnalyticsCard
              title="Student Retention"
              value={`${displayData.student.studentRetention.overall}%`}
              description="Average student retention rate"
              trend={{
                value: displayData.student.studentRetention.trend,
                isPositive: displayData.student.studentRetention.trend > 0
              }}
              isLoading={isLoadingStudent}
            />
            
            <AnalyticsCard
              title="Avg. Completion Time"
              value={`${Math.round(
                displayData.student.averageTimeToCompletionByPath.reduce(
                  (acc, path) => acc + path.days, 0
                ) / displayData.student.averageTimeToCompletionByPath.length
              )} days`}
              description="Average time to complete a path"
              isLoading={isLoadingStudent}
            />
            
            <AnalyticsCard
              title="Most Popular Path"
              value={displayData.student.activeStudentsByPath[0].path}
              description={`${displayData.student.activeStudentsByPath[0].count} active students`}
              isLoading={isLoadingStudent}
            />
            
            <AnalyticsCard
              title="Avg. Module Completion"
              value={`${Math.round(
                displayData.student.completionRates.reduce(
                  (acc, module) => acc + module.value, 0
                ) / displayData.student.completionRates.length
              )}%`}
              description="Average module completion rate"
              isLoading={isLoadingStudent}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MiniProgressChart
              title="Module Completion Rates"
              data={displayData.student.completionRates}
              isLoading={isLoadingStudent}
            />
            
            <MiniProgressChart
              title="Active Students by Path"
              data={displayData.student.activeStudentsByPath.map(item => ({
                label: item.path,
                value: item.count
              }))}
              isLoading={isLoadingStudent}
            />
          </div>
          
          {/* Additional Student Insights */}
          <div className="bg-secondary/30 rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Path Completion Time (Days)</h2>
            
            {isLoadingStudent ? (
              <p>Loading completion time data...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {displayData.student.averageTimeToCompletionByPath.map((path, index) => (
                  <div key={index} className="bg-background rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-sm mb-2">{path.path}</h3>
                    <div className="text-2xl font-bold">{path.days} days</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}