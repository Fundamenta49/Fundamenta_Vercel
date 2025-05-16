import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { MiniProgressChart } from "@/components/ui/mini-progress-chart";
import { Heatmap } from "@/components/ui/heatmap";
import { User, Settings, Users, Activity, BookOpen, Award } from "lucide-react";

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={isLoadingOverview ? "..." : overviewData?.totalUsers || 0}
          description="Active user accounts"
          icon={<User className="h-4 w-4" />}
          isLoading={isLoadingOverview}
        />
        <AnalyticsCard
          title="Learning Paths"
          value={isLoadingOverview ? "..." : overviewData?.totalPaths || 0}
          description="Available learning paths"
          icon={<Settings className="h-4 w-4" />}
          isLoading={isLoadingOverview}
        />
        <AnalyticsCard
          title="Active Sessions"
          value={isLoadingOverview ? "..." : overviewData?.activeSessions || 0}
          description="Sessions in the last 24 hours"
          icon={<Users className="h-4 w-4" />}
          trend={
            overviewData?.sessionTrend
              ? {
                  value: overviewData.sessionTrend,
                  isPositive: overviewData.sessionTrend > 0,
                }
              : undefined
          }
          isLoading={isLoadingOverview}
        />
        <AnalyticsCard
          title="Completed Activities"
          value={isLoadingOverview ? "..." : overviewData?.completedActivities || 0}
          description="Total completed activities"
          icon={<Activity className="h-4 w-4" />}
          trend={
            overviewData?.activityTrend
              ? {
                  value: overviewData.activityTrend,
                  isPositive: overviewData.activityTrend > 0,
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
            isLoadingCategory
              ? []
              : categoryData?.map((item) => ({
                  label: item.category,
                  value: item.count,
                })) || []
          }
          isLoading={isLoadingCategory}
        />
        
        <div className="space-y-6">
          <AnalyticsCard
            title="Average Completion Rate"
            value={
              isLoadingOverview
                ? "..."
                : `${overviewData?.averageCompletionRate || 0}%`
            }
            description="Path completion percentage"
            icon={<BookOpen className="h-4 w-4" />}
            isLoading={isLoadingOverview}
          />
          
          <AnalyticsCard
            title="Achievements Earned"
            value={isLoadingOverview ? "..." : overviewData?.achievementsEarned || 0}
            description="Total achievements earned"
            icon={<Award className="h-4 w-4" />}
            isLoading={isLoadingOverview}
          />
        </div>
        
        <Heatmap
          title="User Activity (Last 4 Weeks)"
          data={
            isLoadingActivity
              ? []
              : activityData?.map((item) => ({
                  date: item.date,
                  value: item.count,
                })) || []
          }
          isLoading={isLoadingActivity}
        />
      </div>
      
      {/* Additional insights section */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        
        {isLoadingOverview ? (
          <p>Loading insights...</p>
        ) : (
          <div className="space-y-4">
            <p>
              {overviewData?.insights?.mostActiveTime
                ? `Most active time: ${overviewData.insights.mostActiveTime}`
                : "Activity data is being collected."}
            </p>
            <p>
              {overviewData?.insights?.popularPath
                ? `Most popular learning path: ${overviewData.insights.popularPath}`
                : "Learning path data is being analyzed."}
            </p>
            <p>
              {overviewData?.insights?.retentionRate
                ? `30-day retention rate: ${overviewData.insights.retentionRate}%`
                : "Retention data is being calculated."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}