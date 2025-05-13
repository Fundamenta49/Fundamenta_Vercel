import React, { useEffect } from "react";
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
import { PATHWAYS_DATA } from "../../pages/learning/pathways-data";
import { trackModuleProgress } from "@/lib/learning-progress";
import { useJungleTheme } from "../contexts/JungleThemeContext";
import { useJungleFundi } from "../contexts/JungleFundiContext";
import { getAllZones } from "../utils/zoneUtils";
import ExpeditionCard from "@/components/ExpeditionCard";

// Jungle Path styling
const jungleStyles = {
  // Main container background
  dashboard: "bg-[#1E4A3D] text-white min-h-screen",
  
  // Card styles - matching the expedition card format
  card: "border-2 border-[#E6B933] bg-[#1E4A3D] rounded-md shadow-md backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-solid",
  cardHeader: "border-b border-[#94C973]/30 pt-4 pb-2 px-4",
  cardContent: "p-4",
  cardTitle: "text-[#E6B933] font-semibold text-xl",
  
  // Tab styles
  tabs: "bg-[#1E4A3D] border-[#E6B933]/50",
  tabsList: "bg-[#162E26] border border-[#E6B933]/50 rounded-md overflow-hidden",
  tabsTrigger: "data-[state=active]:bg-[#162E26] data-[state=active]:text-[#E6B933] data-[state=active]:border-b-2 data-[state=active]:border-[#E6B933] text-[#94C973] relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#E6B933]",
  
  // Button styles - matching the gold buttons from the screenshot
  button: "bg-[#E6B933] text-[#1E4A3D] hover:bg-[#DCAA14] font-medium transition-colors duration-300 rounded-md",
  buttonOutline: "border-[#E6B933] text-[#E6B933] hover:bg-[#E6B933]/20 rounded-md",
  viewQuestButton: "bg-white text-[#1E4A3D] hover:bg-gray-100 font-medium transition-colors duration-300 rounded-md",
  
  // Progress bar
  progress: "bg-[#162E26] rounded-full h-2.5 overflow-hidden",
  progressFill: "bg-[#94C973]",
  
  // Quest card
  questCard: "border border-[#E6B933]/70 bg-[#162E26] rounded-md p-4 mb-2 hover:shadow-[0_0_15px_rgba(230,185,51,0.3)] transition-all duration-300",
  questCardCompleted: "border-[#E6B933] bg-[#1E4A3D]",
  
  // Companion bubble
  companionBubble: "bg-[#162E26] border-2 border-[#94C973] rounded-2xl p-4 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-[20px] after:w-[20px] after:h-[20px] after:bg-[#162E26] after:border-b-2 after:border-r-2 after:border-[#94C973] after:rotate-45",
  
  // Rank badge
  rankBadge: "bg-[#E6B933] text-[#1E4A3D] border border-[#94C973] p-1 px-3 rounded-full flex items-center gap-1 text-sm font-medium",
  
  // Quest metadata
  questCount: "bg-[#162E26] text-[#E6B933] px-2 py-0.5 rounded-md border border-[#E6B933]/50 text-sm font-medium",
  questProgress: "text-[#94C973] font-medium text-sm mt-2",
  
  // Module styling
  module: "bg-[#162E26] border border-[#94C973]/30 rounded-md px-3 py-2 mb-2",
  moduleTitle: "text-[#E6B933] font-medium",
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
  const { showZoneGuidance, sendJungleMessage } = useJungleFundi();
  
  // Update Fundi with tab-specific guidance
  useEffect(() => {
    if (isJungleTheme && activeTab !== 'all') {
      // Map category to zone type for Fundi guidance
      const zoneMapping: Record<string, any> = {
        'financial': 'ancient-ruins',
        'wellness': 'riverlands',
        'career': 'canopy',
        'life-skills': 'cave-system'
      };
      
      const zoneType = zoneMapping[activeTab] || 'riverlands';
      showZoneGuidance(zoneType as any);
    } else if (isJungleTheme && activeTab === 'all') {
      sendJungleMessage("Welcome to the jungle expedition routes! I'll help you navigate through these different regions of knowledge. Which area would you like to explore first?");
    }
  }, [activeTab, isJungleTheme, showZoneGuidance, sendJungleMessage]);
  
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
    <div className={isJungleTheme ? `${jungleStyles.dashboard} jungle-theme` : "container mx-auto py-8"}>
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
              style={isJungleTheme && activeTab === "all" ? {
                color: "#E6B933",
                borderBottom: "2px solid #E6B933"
              } : {}}
            >
              All Routes
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
              style={isJungleTheme && activeTab === "financial" ? {
                color: "#E6B933",
                borderBottom: "2px solid #E6B933"
              } : {}}
            >
              Finance
            </TabsTrigger>
            <TabsTrigger 
              value="wellness" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
              style={isJungleTheme && activeTab === "wellness" ? {
                color: "#E6B933",
                borderBottom: "2px solid #E6B933"
              } : {}}
            >
              Wellness
            </TabsTrigger>
            <TabsTrigger 
              value="career" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
              style={isJungleTheme && activeTab === "career" ? {
                color: "#E6B933",
                borderBottom: "2px solid #E6B933"
              } : {}}
            >
              Career
            </TabsTrigger>
            <TabsTrigger 
              value="life-skills" 
              className={isJungleTheme ? jungleStyles.tabsTrigger : ""}
              style={isJungleTheme && activeTab === "life-skills" ? {
                color: "#E6B933",
                borderBottom: "2px solid #E6B933"
              } : {}}
            >
              Life Skills
            </TabsTrigger>
          </TabsList>
          
          {/* All tabs content uses the same component with filtering */}
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPathways.map(pathway => (
                <div 
                  key={pathway.id}
                  onMouseEnter={() => {
                    if (isJungleTheme) {
                      // Show pathway-specific Fundi message on hover
                      const pathwayName = pathway.jungleTitle || pathway.title;
                      sendJungleMessage(`The ${pathwayName} path will take you through some fascinating territory! It contains ${pathway.modules.length} quests to complete. You've made ${getPathwayProgress(pathway.id)}% progress so far.`);
                    }
                  }}
                >
                  {isJungleTheme ? (
                    <ExpeditionCard
                      title={pathway.title}
                      description={pathway.description}
                      completedAt={new Date().toLocaleDateString()}
                      xpEarned={getCompletedModulesCount(pathway.id) * 15}
                      category={pathway.category}
                      variant="jungle"
                      achievements={pathway.modules.slice(0, 3).map(m => m.title)}
                      onClick={() => setExpandedPath(expandedPath === pathway.id ? null : pathway.id)}
                    />
                  ) : (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg flex items-center">
                            <pathway.icon className="h-5 w-5 mr-2 text-primary" />
                            {pathway.title}
                          </CardTitle>
                          <Badge variant="secondary">
                            {pathway.modules.length} modules
                          </Badge>
                        </div>
                        <CardDescription>
                          {pathway.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-4">
                        {/* Progress bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{getPathwayProgress(pathway.id)}%</span>
                          </div>
                          <Progress value={getPathwayProgress(pathway.id)} />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-muted-foreground">
                              {getCompletedModulesCount(pathway.id)} modules completed
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
                            <h3 className="text-sm font-medium pt-2">Module List</h3>
                            
                            {pathway.modules.map((module, index) => (
                              <div key={module.id} className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    isModuleCompleted(pathway.id, module.id)
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <span className={`ml-2 ${
                                    isModuleCompleted(pathway.id, module.id)
                                      ? "text-green-700"
                                      : "text-gray-700"
                                  }`}>
                                    {module.title}
                                  </span>
                                </div>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => {
                                    if (module.href) {
                                      navigate(module.href);
                                    } else {
                                      toggleModuleCompletion(
                                        pathway.id, 
                                        module.id, 
                                        isModuleCompleted(pathway.id, module.id)
                                      );
                                    }
                                  }}
                                >
                                  {isModuleCompleted(pathway.id, module.id) ? "Revisit" : "Start"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedPath(expandedPath === pathway.id ? null : pathway.id)}
                          >
                            {expandedPath === pathway.id ? "Hide Details" : "View Details"}
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => navigate(pathway.href || `/learning/courses/${pathway.id}`)}
                          >
                            {getPathwayProgress(pathway.id) > 0 ? "Continue Learning" : "Start Learning"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
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