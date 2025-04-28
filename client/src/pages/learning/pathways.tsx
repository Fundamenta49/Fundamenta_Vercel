import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft, BarChart3, Lock, Rocket, Unlock, Palmtree, Leaf } from "lucide-react";
import { useJungleTheme } from "../../jungle-path/contexts/JungleThemeContext";
import { getAllZones } from "../../jungle-path/utils/zoneUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchUserProgress, 
  trackModuleProgress, 
  enrichPathwaysWithProgress
} from "@/lib/learning-progress";
import { useToast } from "@/hooks/use-toast";
import { learningPathways, LearningPathway, PathwayModule } from "./pathways-data";
import { adaptPathways } from "@/lib/type-adapters";

// Category colors for styling
const categoryColors = {
  finance: "bg-blue-100 text-blue-700",
  learning: "bg-green-100 text-green-700",
  career: "bg-purple-100 text-purple-700",
  wellness: "bg-rose-100 text-rose-700",
  fitness: "bg-amber-100 text-amber-700",
  emergency: "bg-red-100 text-red-700",
};

// Learning Pathways Page
export default function LearningPathwaysPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [expandedPath, setExpandedPath] = React.useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isJungleTheme, toggleJungleTheme } = useJungleTheme();
  
  // For demo purposes, we'll use a hardcoded user ID
  // In a real app, this would come from authentication context
  const userId = 1;
  
  // Fetch the user's learning progress
  const { data: progressData, isLoading: isLoadingProgress } = useQuery({
    queryKey: [`/api/learning/progress/${userId}`],
    // Updated to use onSuccess/onError through proper callbacks
    gcTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 30 * 1000, // 30 seconds
  });
  
  // Track module completion mutation
  const trackProgressMutation = useMutation({
    mutationFn: ({ pathwayId, moduleId, completed }: { 
      pathwayId: string, 
      moduleId: string, 
      completed: boolean 
    }) => trackModuleProgress(userId, pathwayId, moduleId, completed),
    onSuccess: () => {
      // Invalidate the progress query to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/learning/progress/${userId}`] });
      toast({
        title: "Progress updated",
        description: "Your learning progress has been saved."
      });
    },
    onError: () => {
      toast({
        title: "Error updating progress",
        description: "There was a problem saving your progress.",
        variant: "destructive"
      });
    }
  });
  
  // Navigate to the module - completion will be triggered by backend after quiz success
  const handleModuleView = (pathwayId: string, moduleId: string) => {
    // Only navigate to the module, don't mark as complete
    const module = learningPathways
      .find(p => p.id === pathwayId)
      ?.modules.find(m => m.id === moduleId);
      
    if (module && module.href) {
      navigate(module.href);
    } else {
      // If no href is available, go to the jungle-themed page
      navigate('/learning/jungle-pathways');
      toast({
        title: "Module Navigation",
        description: "This module is available in adventure mode. Enabling jungle theme.",
      });
      if (!isJungleTheme) {
        toggleJungleTheme();
      }
    }
  };
  
  // Enrich the static pathways data with actual progress from the API
  const pathwaysWithProgress = React.useMemo(() => {
    // If no progress data, initialize with empty object that matches GroupedProgress type
    const progress = progressData || {} as { [pathwayId: string]: { moduleId: string, completed: boolean }[] };
    // Convert the pathways to the format expected by enrichPathwaysWithProgress
    const adaptedPathways = adaptPathways(learningPathways);
    return enrichPathwaysWithProgress(adaptedPathways, progress as any);
  }, [progressData]);
  
  // Filter pathways by category
  const filteredPathways = activeTab === "all" 
    ? pathwaysWithProgress 
    : pathwaysWithProgress.filter(pathway => pathway.category === activeTab);

  const togglePathDetails = (pathId: string) => {
    if (expandedPath === pathId) {
      setExpandedPath(null);
    } else {
      setExpandedPath(pathId);
    }
  };
  
  return (
    <div className={`container mx-auto px-4 py-6 max-w-6xl ${
      isJungleTheme ? 'bg-[#1E4A3D]/10 rounded-lg shadow-inner' : ''
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/arcade')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Arcade
          </Button>
          
          <h1 className="text-2xl font-bold flex items-center">
            <Rocket className="h-6 w-6 mr-2 text-purple-500" />
            Learning Pathways
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant={isJungleTheme ? "default" : "outline"}
            onClick={toggleJungleTheme}
            className="flex items-center transition-all transform hover:scale-105"
          >
            <Palmtree className="h-4 w-4 mr-2" />
            {isJungleTheme ? "Adventure Mode: ON" : "Adventure Mode"}
          </Button>

          <Button 
            variant="outline"
            onClick={() => navigate('/learning/analytics')}
            className="flex items-center"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Follow structured learning paths to build comprehensive skills and knowledge in different areas.
          Each pathway consists of multiple modules that build on each other.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Filter by Category</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-white shadow-sm border p-1 text-gray-600 w-full max-w-4xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="finance" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
            >
              Finance
            </TabsTrigger>
            <TabsTrigger 
              value="learning" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="career" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
            >
              Career
            </TabsTrigger>
            <TabsTrigger 
              value="wellness" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
            >
              Wellness
            </TabsTrigger>
            <TabsTrigger 
              value="fitness" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
            >
              Fitness
            </TabsTrigger>
            <TabsTrigger 
              value="emergency" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium hover:text-primary transition-colors"
            >
              Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoadingProgress ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Loading your learning progress...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredPathways.map(pathway => {
                  // Find prerequisite pathway titles for locked pathways
                  const getPrerequisiteInfo = (pathway: any) => {
                    // Check for prerequisites property using type-safe approach
                    const prerequisites = (pathway as any).prerequisites;
                    if (!prerequisites || !Array.isArray(prerequisites) || prerequisites.length === 0) {
                      return null;
                    }
                    
                    // Map prerequisites to titles
                    const prerequisiteTitles = prerequisites.map((prereqId: string) => {
                      const prereqPathway = pathwaysWithProgress.find(p => p.id === prereqId);
                      return prereqPathway ? prereqPathway.title : prereqId;
                    });
                    
                    // Render prerequisite info
                    return (
                      <div className={`mt-2 text-sm ${
                        isJungleTheme 
                          ? 'text-[#E6B933] bg-[#1E4A3D]/50 border border-[#94C973]/30' 
                          : 'text-amber-700 bg-amber-50'
                      } p-2 rounded-md flex items-start gap-2`}>
                        <Lock className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          isJungleTheme ? 'text-[#E6B933]' : 'text-amber-600'
                        }`} />
                        <div>
                          <p className="font-medium">
                            {isJungleTheme ? 'Expedition Requirements:' : 'Prerequisites Required:'}
                          </p>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5">
                            {prerequisiteTitles.map((title: string, i: number) => (
                              <li key={i}>{title}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  };
                  
                  return (
                    <Card 
                      key={pathway.id} 
                      className={`border ${pathway.isLocked ? 'opacity-80' : ''} ${
                        isJungleTheme 
                          ? 'border-2 border-[#94C973] bg-[#1E4A3D]/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]' 
                          : ''
                      }`}
                    >
                      <CardHeader className={`pb-2 ${isJungleTheme ? 'border-b border-[#94C973]/30 text-white' : ''}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full p-1.5 ${
                              isJungleTheme 
                                ? "bg-[#94C973] text-[#1E4A3D]" 
                                : categoryColors[pathway.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"
                            }`}>
                              {React.createElement(pathway.icon)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CardTitle className={`text-lg ${isJungleTheme ? 'text-[#E6B933]' : ''}`}>
                                {isJungleTheme && (pathway as any).jungleTitle ? (pathway as any).jungleTitle : pathway.title}
                              </CardTitle>
                              {pathway.isLocked && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Lock className="h-4 w-4 text-amber-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-sm">Complete prerequisites to unlock</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {pathway.modules.length} modules
                          </Badge>
                        </div>
                        <CardDescription className={`mt-1 ${isJungleTheme ? 'text-[#94C973]' : ''}`}>
                          {isJungleTheme && (pathway as any).jungleDescription ? (pathway as any).jungleDescription : pathway.description}
                        </CardDescription>
                        
                        {pathway.isLocked && getPrerequisiteInfo(pathway)}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{pathway.progress}%</span>
                            </div>
                            <Progress value={pathway.progress} className="h-2" />
                          </div>
                          
                          <div>
                            <Button 
                              variant={isJungleTheme ? "default" : "link"}
                              className={`${isJungleTheme 
                                ? 'bg-[#E6B933] text-[#1E4A3D] hover:bg-[#E67E22] transition-colors duration-300 text-sm font-medium' 
                                : 'p-0 h-auto text-sm font-medium'}`}
                              onClick={() => togglePathDetails(pathway.id)}
                              disabled={pathway.isLocked}
                            >
                              {pathway.isLocked 
                                ? "Locked" 
                                : expandedPath === pathway.id 
                                  ? isJungleTheme ? "Hide Quests" : "Hide Modules" 
                                  : isJungleTheme ? "View Quests" : "View Modules"
                              }
                            </Button>
                            
                            {!pathway.isLocked && expandedPath === pathway.id && (
                              <div className="mt-3 space-y-3">
                                <Separator className={isJungleTheme ? 'bg-[#94C973]/30' : ''} />
                                
                                {pathway.modules.map((module, index) => (
                                  <div key={module.id} className={`flex items-center justify-between ${
                                    isJungleTheme ? 'bg-[#162E26] rounded-md px-3 py-2 border border-[#94C973]/30' : ''
                                  }`}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                        isJungleTheme
                                          ? module.complete 
                                            ? "bg-[#E6B933] text-[#1E4A3D]" 
                                            : "bg-[#94C973]/20 text-[#94C973]"
                                          : module.complete 
                                            ? "bg-green-100 text-green-700" 
                                            : "bg-gray-100 text-gray-700"
                                      }`}>
                                        {index + 1}
                                      </div>
                                      <span className={`${
                                        isJungleTheme
                                          ? module.complete 
                                            ? "text-[#E6B933] font-medium" 
                                            : "text-white"
                                          : module.complete 
                                            ? "text-green-700 font-medium" 
                                            : "text-gray-700"
                                      }`}>
                                        {isJungleTheme && (module as any).jungleTitle ? (module as any).jungleTitle : module.title}
                                      </span>
                                    </div>
                                    
                                    <Button 
                                      variant={isJungleTheme ? "default" : "outline"}
                                      size="sm"
                                      className={isJungleTheme 
                                        ? "h-7 text-xs bg-[#94C973] text-[#1E4A3D] hover:bg-[#E6B933] border-none transition-all duration-300" 
                                        : "h-7 text-xs"
                                      }
                                      onClick={() => handleModuleView(pathway.id, module.id)}
                                    >
                                      {module.complete 
                                        ? isJungleTheme ? "Continue Quest" : "Revisit" 
                                        : isJungleTheme ? "Begin Quest" : "Start"
                                      }
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}