import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Leaf, MapPin, Compass, Palmtree, Tent, Mountain } from 'lucide-react';

interface JungleModule {
  id: string;
  title: string;
  jungleTitle: string;
  duration: number;
  href: string;
  complete?: boolean;
}

interface JunglePathway {
  id: string;
  title: string;
  jungleTitle: string;
  description: string;
  jungleDescription: string;
  category: string;
  modules: JungleModule[];
  progress?: number;
  isLocked?: boolean;
  prerequisites?: string[];
}

// Jungle theme category colors
const jungleCategoryColors = {
  financial: "bg-amber-100 text-amber-800",
  wellness: "bg-emerald-100 text-emerald-800",
  career: "bg-blue-100 text-blue-800",
  learning: "bg-indigo-100 text-indigo-800",
  social: "bg-rose-100 text-rose-800",
  general: "bg-slate-100 text-slate-800",
};

// Jungle theme icons for different pathway categories
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'financial':
      return <MapPin className="h-5 w-5" />;
    case 'wellness':
      return <Palmtree className="h-5 w-5" />;
    case 'career':
      return <Compass className="h-5 w-5" />;
    case 'learning':
      return <Mountain className="h-5 w-5" />;
    case 'social':
      return <Tent className="h-5 w-5" />;
    default:
      return <Leaf className="h-5 w-5" />;
  }
};

export default function JungleHub() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch pathways from API
  const { data: pathways, isLoading: isLoadingPathways } = useQuery({
    queryKey: ['/api/pathways'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch user learning progress from API
  const { data: progressData, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/learning/progress'],
    staleTime: 1000 * 60, // 1 minute
  });

  // Combine pathways with progress data
  const pathwaysWithProgress: JunglePathway[] = React.useMemo(() => {
    if (!pathways || !progressData) return [];
    
    return pathways.map((pathway: any) => {
      // Find progress data for this pathway
      const pathwayProgress = progressData[pathway.id] || [];
      
      // Update modules with completion status
      const updatedModules = pathway.modules.map((module: any) => {
        const moduleProgress = pathwayProgress.find((p: any) => p.moduleId === module.id);
        return {
          ...module,
          complete: moduleProgress?.completed || false
        };
      });
      
      // Calculate overall progress percentage
      const completedModules = updatedModules.filter((m: any) => m.complete).length;
      const totalModules = updatedModules.length;
      const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
      
      return {
        ...pathway,
        modules: updatedModules,
        progress: progressPercentage
      };
    });
  }, [pathways, progressData]);

  // Filter pathways based on active tab
  const filteredPathways = activeTab === 'all' 
    ? pathwaysWithProgress 
    : pathwaysWithProgress.filter(pathway => pathway.category === activeTab);

  // Toggle expanded path
  const togglePathExpand = (pathwayId: string) => {
    setExpandedPath(prevId => prevId === pathwayId ? null : pathwayId);
  };

  // Handle module start/review
  const handleModuleAction = (moduleHref: string) => {
    navigate(moduleHref);
  };

  // Loading state
  if (isLoadingPathways || isLoadingProgress) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Jungle Expedition Hub</h1>
          </div>
          <div className="h-10 bg-slate-100 animate-pulse rounded-md"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative">
      {/* Jungle decorative elements */}
      <div className="absolute -z-10 top-0 left-0 w-24 h-24 opacity-20">
        <Leaf className="w-full h-full text-green-600" />
      </div>
      <div className="absolute -z-10 top-12 right-12 w-16 h-16 opacity-20">
        <Palmtree className="w-full h-full text-green-700" />
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Jungle Expedition Hub</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              // Disable jungle mode in localStorage
              localStorage.setItem('jungleMode', 'false');
              navigate('/mypath');
            }}
            className="flex items-center gap-2"
          >
            <span>Exit Jungle Mode</span>
          </Button>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
          <p className="text-green-800">
            Welcome to your learning jungle! Navigate through various expeditions to develop essential life skills.
            Each trail reveals new knowledge and challenges to conquer.
          </p>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Expeditions</TabsTrigger>
            <TabsTrigger value="financial">Treasure Trails</TabsTrigger>
            <TabsTrigger value="wellness">Vitality Paths</TabsTrigger>
            <TabsTrigger value="career">Explorer Routes</TabsTrigger>
            <TabsTrigger value="learning">Knowledge Quest</TabsTrigger>
            <TabsTrigger value="social">Tribal Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPathways.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Compass className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No expeditions found</h3>
                  <p className="text-muted-foreground">
                    There are no expeditions available in this category yet.
                  </p>
                </div>
              ) : (
                filteredPathways.map(pathway => (
                  <Card 
                    key={pathway.id} 
                    className={`border-2 ${
                      pathway.isLocked 
                        ? 'border-gray-200 opacity-75' 
                        : 'border-green-200 hover:border-green-300'
                    } transition-all`}
                  >
                    <CardHeader className="pb-2 relative">
                      {/* Jungle decoration in corner */}
                      <div className="absolute top-0 right-0 -mt-2 -mr-2">
                        {getCategoryIcon(pathway.category)}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1.5 ${jungleCategoryColors[pathway.category as keyof typeof jungleCategoryColors] || "bg-slate-100 text-slate-700"}`}>
                            {getCategoryIcon(pathway.category)}
                          </div>
                          <CardTitle className="text-lg">
                            {pathway.jungleTitle || pathway.title}
                          </CardTitle>
                        </div>
                        <Badge variant="outline">
                          {pathway.modules.length} checkpoints
                        </Badge>
                      </div>
                      
                      <CardDescription className="mt-1">
                        {pathway.jungleDescription || pathway.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Expedition Progress</span>
                            <span className="font-medium">{pathway.progress}%</span>
                          </div>
                          <Progress value={pathway.progress} className="h-2" />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {pathway.isLocked ? (
                            <Button variant="outline" disabled className="w-full">
                              Expedition Locked
                            </Button>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                onClick={() => togglePathExpand(pathway.id)}
                                className="flex-1"
                              >
                                {expandedPath === pathway.id ? "Hide Checkpoints" : "View Checkpoints"}
                              </Button>
                              
                              <Button 
                                variant={pathway.progress === 100 ? "outline" : "default"}
                                onClick={() => {
                                  // Navigate to first incomplete module or first module
                                  const firstIncompleteModule = pathway.modules.find(m => !m.complete);
                                  const targetModule = firstIncompleteModule || pathway.modules[0];
                                  if (targetModule) {
                                    handleModuleAction(targetModule.href);
                                  }
                                }}
                                className="flex-1"
                              >
                                {pathway.progress === 100 ? "Review Expedition" : "Continue Expedition"}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded view with modules */}
                      {expandedPath === pathway.id && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-green-100">
                          <h4 className="text-sm font-medium">Expedition Checkpoints:</h4>
                          <div className="space-y-2">
                            {pathway.modules.map((module) => (
                              <div 
                                key={module.id} 
                                className="flex justify-between items-center p-2 rounded-md bg-green-50"
                              >
                                <div className="flex items-center">
                                  {module.complete ? (
                                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-green-300 mr-2"></div>
                                  )}
                                  <span className={module.complete ? "text-sm" : "text-sm text-gray-600"}>
                                    {module.jungleTitle || module.title}
                                  </span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7"
                                  onClick={() => handleModuleAction(module.href)}
                                >
                                  {module.complete ? "Revisit" : "Explore"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    {/* Prerequisites info for locked pathways */}
                    {pathway.isLocked && pathway.prerequisites && pathway.prerequisites.length > 0 && (
                      <CardFooter className="pt-2 border-t text-sm text-muted-foreground">
                        <div>
                          <p>Required before starting:</p>
                          <ul className="list-disc pl-5 mt-1">
                            {pathway.prerequisites.map(prereqId => {
                              const prereq = pathwaysWithProgress.find(p => p.id === prereqId);
                              return (
                                <li key={prereqId}>
                                  {prereq ? prereq.jungleTitle || prereq.title : prereqId}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}