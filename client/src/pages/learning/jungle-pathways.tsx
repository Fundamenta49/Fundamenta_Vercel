import React from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, Award, BookOpen, Clock, Dumbbell, 
  Flame, Rocket, Shield, Target, MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { PATHWAYS_DATA } from "./pathways-data.ts";
import { trackModuleProgress } from "@/lib/learning-progress";
import { useJungleTheme } from "../../jungle-path/contexts/JungleThemeContext";
import { getAllZones } from "../../jungle-path/utils/zoneUtils";

// Jungle Path styling
const jungleStyles = {
  // Main container background
  dashboard: "bg-[#1E4A3D] text-white min-h-screen",
  
  // Card styles
  card: "border-2 border-[#94C973] bg-[#1E4A3D]/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
  cardHeader: "border-b border-[#94C973]/30",
  
  // Tab styles
  tabs: "bg-[#1E4A3D] border-[#94C973]/50",
  tabsList: "bg-[#162E26] border border-[#94C973]/30",
  tabsTrigger: "data-[state=active]:bg-[#94C973] data-[state=active]:text-[#1E4A3D] text-[#94C973]",
  
  // Button styles
  button: "bg-[#1E4A3D] text-white hover:bg-[#E67E22] transition-colors duration-300",
  buttonOutline: "border-[#94C973] text-[#94C973] hover:bg-[#94C973]/20",
  
  // Progress bar
  progress: "bg-[#162E26]",
  progressFill: "bg-[#94C973]",
  
  // Quest card
  questCard: "border border-[#94C973]/50 bg-[#162E26] hover:shadow-[0_0_15px_rgba(148,201,115,0.3)] transition-all duration-300",
  questCardCompleted: "border-[#E6B933] bg-[#1E4A3D]",
  
  // Companion bubble
  companionBubble: "bg-[#162E26] border-2 border-[#94C973] rounded-2xl p-4 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-[20px] after:w-[20px] after:h-[20px] after:bg-[#162E26] after:border-b-2 after:border-r-2 after:border-[#94C973] after:rotate-45",
  
  // Rank badge
  rankBadge: "bg-[#E6B933] text-[#1E4A3D] border-2 border-[#94C973] p-1 px-3 rounded-full flex items-center gap-1 text-sm font-medium",
};

// Zone-specific colors for the different pathway types
const zoneColors = {
  financial: "#E6B933", // Temple Gold
  wellness: "#94C973",  // Canopy Light
  fitness: "#3B82C4",   // River Blue
  career: "#724E91",    // Shadow Purple
  leadership: "#C24D4D", // Clay Red
  adventure: "#1E4A3D",  // Jungle Green
  general: "#718355",    // Moss Green
};

// Map category to zone
const categoryToZone = {
  "financial": "financial",
  "wellness": "wellness", 
  "fitness": "fitness",
  "career": "career",
  "personal-development": "leadership",
  "life-skills": "adventure",
  "all": "general"
};

// Jungle-themed Learning Pathways Page
export default function JunglePathwaysPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [expandedPath, setExpandedPath] = React.useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isJungleTheme } = useJungleTheme();
  
  // For demo purposes, we'll use a hardcoded user ID
  const userId = 1;
  
  // Define the progress data type
  interface Module {
    id: string;
    completed: boolean;
  }
  
  interface Pathway {
    id: string;
    modules: Module[];
  }
  
  interface ProgressData {
    pathways: Pathway[];
  }
  
  // Fetch the user's learning progress
  const { data: progressData, isLoading: isLoadingProgress } = useQuery<ProgressData>({
    queryKey: [`/api/learning/progress/${userId}`],
    gcTime: 5 * 60 * 1000, 
    staleTime: 30 * 1000,
  });
  
  // Track module completion mutation
  const trackProgressMutation = useMutation({
    mutationFn: ({ pathwayId, moduleId, completed }: { 
      pathwayId: string, 
      moduleId: string, 
      completed: boolean 
    }) => trackModuleProgress(userId, pathwayId, moduleId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/learning/progress/${userId}`] });
      toast({
        title: isJungleTheme ? "Quest Updated!" : "Progress updated",
        description: isJungleTheme 
          ? "Your expedition progress has been recorded in the jungle log." 
          : "Your learning progress has been saved."
      });
    },
    onError: () => {
      toast({
        title: isJungleTheme ? "Jungle Communication Error" : "Error updating progress",
        description: isJungleTheme 
          ? "The jungle drums failed to transmit your progress." 
          : "There was a problem saving your progress.",
        variant: "destructive"
      });
    }
  });
  
  // Compute user progress for each pathway
  const getPathwayProgress = (pathwayId: string) => {
    if (!progressData?.pathways) return 0;
    
    const pathway = progressData.pathways.find((p: Pathway) => p.id === pathwayId);
    if (!pathway) return 0;
    
    const totalModules = pathway.modules.length;
    if (totalModules === 0) return 0;
    
    const completedModules = pathway.modules.filter((m: Module) => m.completed).length;
    return Math.round((completedModules / totalModules) * 100);
  };
  
  // Get completed modules count for a pathway
  const getCompletedModulesCount = (pathwayId: string) => {
    if (!progressData?.pathways) return "0";
    
    const pathway = progressData.pathways.find((p: Pathway) => p.id === pathwayId);
    if (!pathway) return "0";
    
    const completedModules = pathway.modules.filter((m: Module) => m.completed).length;
    const totalModules = pathway.modules.length;
    
    return `${completedModules}/${totalModules}`;
  };
  
  // Check if a module is completed
  const isModuleCompleted = (pathwayId: string, moduleId: string) => {
    if (!progressData?.pathways) return false;
    
    const pathway = progressData.pathways.find((p: Pathway) => p.id === pathwayId);
    if (!pathway) return false;
    
    return pathway.modules.some((m: Module) => m.id === moduleId && m.completed);
  };
  
  // Toggle module completion state
  const toggleModuleCompletion = (pathwayId: string, moduleId: string, currentState: boolean) => {
    trackProgressMutation.mutate({
      pathwayId,
      moduleId,
      completed: !currentState
    });
  };
  
  // Get zone color for a category
  const getZoneColor = (category: string) => {
    const zoneCategory = categoryToZone[category as keyof typeof categoryToZone] || "general";
    return zoneColors[zoneCategory as keyof typeof zoneColors] || zoneColors.general;
  };
  
  // Filter pathways based on active tab
  const filteredPathways = PATHWAYS_DATA.filter((pathway) => {
    if (activeTab === "all") return true;
    return pathway.category === activeTab;
  });
  
  // CompanionBubble component with jungle styling
  const CompanionBubble = ({ children }: { children: React.ReactNode }) => (
    <div className={jungleStyles.companionBubble}>
      {children}
    </div>
  );
  
  // RankBadge component with jungle styling
  const RankBadge = ({ rank, level }: { rank: string, level: number }) => (
    <div className={jungleStyles.rankBadge}>
      <Award className="h-4 w-4" />
      <span>{rank} (Level {level})</span>
    </div>
  );
  
  return (
    <div className={isJungleTheme ? jungleStyles.dashboard : "container mx-auto py-8"}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button 
            variant={isJungleTheme ? "outline" : "ghost"}
            onClick={() => navigate('/learning')}
            className={isJungleTheme ? jungleStyles.buttonOutline : ""}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isJungleTheme ? "Return to Base Camp" : "Back to Learning"}
          </Button>
          
          <h1 className="text-2xl font-bold ml-4 flex items-center">
            <MapPin className={`h-6 w-6 mr-2 ${isJungleTheme ? "text-[#E6B933]" : "text-blue-500"}`} />
            {isJungleTheme ? "Jungle Expedition Routes" : "Learning Pathways"}
          </h1>
          
          {isJungleTheme && (
            <div className="ml-auto">
              <RankBadge rank="Explorer" level={2} />
            </div>
          )}
        </div>
        
        {isJungleTheme && (
          <div className="mb-6">
            <CompanionBubble>
              <p className="text-[#94C973]">
                <span className="font-bold">Professor Hoot says:</span> Welcome to the expedition routes! Each path will lead you through different regions of knowledge in the jungle. Complete quests to unlock new areas and abilities.
              </p>
            </CompanionBubble>
          </div>
        )}
        
        {/* Category tabs */}
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className={isJungleTheme ? jungleStyles.tabs : ""}
        >
          <TabsList className={isJungleTheme ? jungleStyles.tabsList : ""}>
            <TabsTrigger 
              value="all" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
            >
              All Routes
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
            >
              Finance
            </TabsTrigger>
            <TabsTrigger 
              value="wellness" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
            >
              Wellness
            </TabsTrigger>
            <TabsTrigger 
              value="career" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
            >
              Career
            </TabsTrigger>
            <TabsTrigger 
              value="life-skills" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
            >
              Life Skills
            </TabsTrigger>
          </TabsList>
          
          {/* All tabs content uses the same component with filtering */}
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPathways.map(pathway => (
                <Card 
                  key={pathway.id}
                  className={isJungleTheme ? jungleStyles.card : ""}
                  style={isJungleTheme ? {
                    borderColor: getZoneColor(pathway.category),
                    boxShadow: `0 4px 12px ${getZoneColor(pathway.category)}33`
                  } : {}}
                >
                  <CardHeader className={isJungleTheme ? jungleStyles.cardHeader : ""}>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center">
                        <pathway.icon className={`h-5 w-5 mr-2 ${isJungleTheme ? `text-[${getZoneColor(pathway.category)}]` : "text-primary"}`} />
                        {isJungleTheme ? pathway.jungleTitle || pathway.title : pathway.title}
                      </CardTitle>
                      <Badge 
                        variant={isJungleTheme ? "outline" : "secondary"}
                        style={isJungleTheme ? { borderColor: getZoneColor(pathway.category), color: getZoneColor(pathway.category) } : {}}
                      >
                        {pathway.modules.length} {isJungleTheme ? "quests" : "modules"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {isJungleTheme ? pathway.jungleDescription || pathway.description : pathway.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>
                          {isJungleTheme ? "Expedition Progress" : "Progress"}
                        </span>
                        <span>
                          {getPathwayProgress(pathway.id)}%
                        </span>
                      </div>
                      <Progress 
                        value={getPathwayProgress(pathway.id)} 
                        className={isJungleTheme ? jungleStyles.progress : ""}
                        style={isJungleTheme ? {
                          "--progress-foreground": getZoneColor(pathway.category)
                        } as React.CSSProperties : {}}
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-muted-foreground">
                          {getCompletedModulesCount(pathway.id)} {isJungleTheme ? "quests" : "modules"} completed
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs font-normal"
                          onClick={() => setExpandedPath(expandedPath === pathway.id ? null : pathway.id)}
                        >
                          {expandedPath === pathway.id ? "Collapse" : "View Details"}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded view with module list */}
                    {expandedPath === pathway.id && (
                      <div className="mt-4 space-y-3">
                        <Separator />
                        <h3 className="text-sm font-medium pt-2">
                          {isJungleTheme ? "Quest Checkpoints" : "Module List"}
                        </h3>
                        
                        <div className="space-y-3">
                          {pathway.modules.map((module, index) => {
                            const completed = isModuleCompleted(pathway.id, module.id);
                            
                            return (
                              <div 
                                key={module.id}
                                className={`p-3 rounded-lg ${
                                  isJungleTheme 
                                    ? completed 
                                      ? jungleStyles.questCardCompleted 
                                      : jungleStyles.questCard
                                    : completed 
                                      ? "bg-green-50 border border-green-200" 
                                      : "bg-gray-50 border border-gray-200"
                                }`}
                                style={isJungleTheme ? {
                                  borderColor: completed ? "#E6B933" : getZoneColor(pathway.category)
                                } : {}}
                              >
                                <div className="flex justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {completed ? (
                                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                          isJungleTheme ? "bg-[#E6B933] text-[#1E4A3D]" : "bg-green-500 text-white"
                                        }`}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                          </svg>
                                        </div>
                                      ) : (
                                        <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                                          isJungleTheme 
                                            ? `border-[${getZoneColor(pathway.category)}] text-[${getZoneColor(pathway.category)}]` 
                                            : "border-gray-400 text-gray-400"
                                        }`}>
                                          {index + 1}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <h4 className={`text-sm font-medium ${
                                        completed && isJungleTheme ? "text-[#E6B933]" : ""
                                      }`}>
                                        {isJungleTheme ? module.jungleTitle || module.title : module.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {module.duration} {isJungleTheme ? "expedition time" : "minutes"}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant={isJungleTheme ? "default" : completed ? "outline" : "default"}
                                      className={`text-xs ${isJungleTheme ? jungleStyles.button : ""}`}
                                      onClick={() => module.href ? navigate(module.href) : undefined}
                                      style={isJungleTheme ? {
                                        backgroundColor: getZoneColor(pathway.category),
                                        color: "#fff"
                                      } : {}}
                                    >
                                      {completed 
                                        ? (isJungleTheme ? "Revisit Quest" : "Review") 
                                        : (isJungleTheme ? "Begin Quest" : "Start")}
                                    </Button>
                                    
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                      onClick={() => toggleModuleCompletion(pathway.id, module.id, completed)}
                                    >
                                      {completed ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                          <path d="M9 12l2 2 4-4"></path>
                                        </svg>
                                      ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        </svg>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant={isJungleTheme ? "outline" : "outline"}
                        size="sm"
                        className={isJungleTheme ? jungleStyles.buttonOutline : ""}
                        onClick={() => setExpandedPath(expandedPath === pathway.id ? null : pathway.id)}
                      >
                        {expandedPath === pathway.id 
                          ? (isJungleTheme ? "Hide Quest Map" : "Hide Details") 
                          : (isJungleTheme ? "View Quest Map" : "View Details")}
                      </Button>
                      
                      <Button
                        size="sm"
                        className={isJungleTheme ? jungleStyles.button : ""}
                        style={isJungleTheme ? {
                          backgroundColor: getZoneColor(pathway.category)
                        } : {}}
                        onClick={() => navigate(pathway.href || `/learning/courses/${pathway.id}`)}
                      >
                        {getPathwayProgress(pathway.id) > 0 
                          ? (isJungleTheme ? "Continue Expedition" : "Continue Learning") 
                          : (isJungleTheme ? "Start Expedition" : "Start Learning")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredPathways.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {isJungleTheme 
                    ? "No expedition routes found in this region of the jungle." 
                    : "No learning pathways found in this category."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}