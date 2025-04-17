import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft, BarChart3, Calendar, CheckCircle, Clock, Rocket, TrendingUp, Badge, BookOpen, Brain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchLearningAnalytics, 
  clearLearningProgress,
  LearningAnalytics, 
  FrameworkProgress, 
  SELCompetency, 
  LIFEDomain, 
  PathwayProgressStats,
  ActivityTimelineItem
} from "@/lib/learning-progress";
import { useToast } from "@/hooks/use-toast";
import { learningPathways } from "./pathways-data";
import { formatSELCompetency, formatLIFEDomain, getSELCompetencyColor, getLIFEDomainColor } from "@/lib/framework-constants";

// Helper function to get a readable date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

// Helper function to get pathway name by id
function getPathwayName(pathwayId: string): string {
  const pathway = learningPathways.find((p: any) => p.id === pathwayId);
  return pathway?.title || pathwayId;
}

// Simple activity heatmap component
function ActivityHeatmap({ 
  activityData 
}: { 
  activityData: { date: string; count: number }[]
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

// Learning Analytics Dashboard
export default function LearningAnalyticsDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // For demo purposes, using hardcoded user ID
  const userId = 1;
  
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: [`/api/learning/analytics/${userId}`],
    queryFn: () => fetchLearningAnalytics(userId),
    // Add proper typings to prevent errors
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/arcade')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Arcade
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-purple-500" />
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
            value="frameworks" 
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
          >
            Frameworks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading your learning analytics...</p>
            </div>
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
                    <CardTitle className="text-base">Recently Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.recentCategories.length > 0 ? (
                        analytics.recentCategories.map((pathwayId: string) => (
                          <div key={pathwayId} className="flex items-center gap-2">
                            <Rocket className="h-4 w-4 text-primary" />
                            <span className="text-sm">{getPathwayName(pathwayId)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                      )}
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
          ) : analytics ? (
            <div className="space-y-4">
              {Object.entries(analytics.pathwayProgress).length > 0 ? (
                Object.entries(analytics.pathwayProgress).map(([pathwayId, stats]: [string, PathwayProgressStats]) => (
                  <Card key={pathwayId}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{getPathwayName(pathwayId)}</CardTitle>
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
                            <span>Last accessed: {formatDate(stats.lastAccessedAt.toString())}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No pathway progress data available yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No analytics data available. Start completing modules to see your progress.</p>
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
        
        <TabsContent value="frameworks" className="mt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading framework data...</p>
            </div>
          ) : analytics && analytics.frameworkProgress ? (
            <div className="space-y-6">
              {/* SEL Framework Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    Social-Emotional Learning (SEL)
                  </CardTitle>
                  <CardDescription>
                    Track your progress across SEL competencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.frameworkProgress.sel).map(([competency, progress]) => (
                      <div key={competency} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-md text-xs mr-2 ${getSELCompetencyColor(competency as SELCompetency)}`}>
                              {formatSELCompetency(competency as SELCompetency)}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Project LIFE Framework Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-teal-500" />
                    Project LIFE Framework
                  </CardTitle>
                  <CardDescription>
                    Track your progress across life skill domains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.frameworkProgress.projectLife).map(([domain, progress]) => (
                      <div key={domain} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-md text-xs mr-2 ${getLIFEDomainColor(domain as LIFEDomain)}`}>
                              {formatLIFEDomain(domain as LIFEDomain)}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Framework Insights Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                    Personalized Learning Recommendations
                  </CardTitle>
                  <CardDescription>
                    Based on your progress and framework gaps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      Our analysis suggests you might benefit from focusing on these areas to improve your skills balance:
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium">Recommended SEL Focus Areas:</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(analytics.frameworkProgress.sel)
                          .sort(([, a], [, b]) => a - b)
                          .slice(0, 2)
                          .map(([competency]) => (
                            <span key={competency} className={`px-2 py-1 rounded-md text-xs ${getSELCompetencyColor(competency as SELCompetency)}`}>
                              {formatSELCompetency(competency as SELCompetency)}
                            </span>
                          ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium">Recommended Life Skills Focus Areas:</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(analytics.frameworkProgress.projectLife)
                          .sort(([, a], [, b]) => a - b)
                          .slice(0, 2)
                          .map(([domain]) => (
                            <span key={domain} className={`px-2 py-1 rounded-md text-xs ${getLIFEDomainColor(domain as LIFEDomain)}`}>
                              {formatLIFEDomain(domain as LIFEDomain)}
                            </span>
                          ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={() => navigate('/learning/pathways')}
                        className="w-full"
                      >
                        Find Relevant Learning Pathways
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Framework progress data not available yet. Start completing modules to see your progress across educational frameworks.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Reset Progress Card */}
      <Card className="mt-8 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Reset Learning Progress</CardTitle>
          <CardDescription>
            Clear all your learning progress data if you want to start fresh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              This action will permanently delete all your learning progress data, including completed modules,
              pathways, and analytics. This cannot be undone.
            </p>
            <div className="flex justify-end">
              <Button 
                variant="destructive"
                onClick={async () => {
                  const confirmed = window.confirm(
                    "Are you sure you want to clear all your learning progress? This action cannot be undone."
                  );
                  
                  if (confirmed) {
                    try {
                      const success = await clearLearningProgress(userId);
                      
                      if (success) {
                        toast({
                          title: "Progress cleared",
                          description: "All your learning progress has been reset successfully.",
                        });
                        
                        // Invalidate queries to refresh data

                        queryClient.invalidateQueries({ queryKey: [`/api/learning/analytics/${userId}`] });
                        queryClient.invalidateQueries({ queryKey: [`/api/learning/progress/${userId}`] });
                      } else {
                        toast({
                          title: "Error",
                          description: "Failed to clear learning progress. Please try again.",
                          variant: "destructive"
                        });
                      }
                    } catch (error) {
                      console.error("Error clearing progress:", error);
                      toast({
                        title: "Error",
                        description: "Failed to clear learning progress. Please try again.",
                        variant: "destructive"
                      });
                    }
                  }
                }}
              >
                Clear All Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}