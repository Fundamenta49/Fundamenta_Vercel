import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import { PathwayBreadcrumb } from '@/components/mypath/PathwayBreadcrumb';
import { ModuleTransition } from '@/components/mypath/ModuleTransition';
import { PathwayDataErrorBoundary } from '@/components/mypath/PathwayErrorBoundary';

interface ModuleParams {
  pathwayId: string;
  moduleId: string;
}

export default function ModulePage() {
  const params = useParams<ModuleParams>();
  const { pathwayId, moduleId } = params;
  const [, navigate] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch module data
  const { 
    data: module, 
    isLoading: isModuleLoading, 
    error: moduleError 
  } = useQuery({
    queryKey: ['/api/pathways/modules', pathwayId, moduleId],
    enabled: !!pathwayId && !!moduleId,
    retry: 2,
  });
  
  // Handle errors when the query fails permanently after retries
  useEffect(() => {
    if (moduleError) {
      console.error('Failed to load module:', moduleError);
      toast({
        title: 'Error loading module',
        description: 'We encountered a problem loading this module. Please try again later.',
        variant: 'destructive'
      });
    }
  }, [moduleError, toast]);

  // Back button to return to pathway page
  const handleBackToPathway = () => {
    navigate(`/mypath/pathway/${pathwayId}`);
  };
  
  // Function to refresh the data
  const handleRefresh = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['/api/pathways/modules', pathwayId, moduleId] 
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <PathwayBreadcrumb 
        pathwayId={pathwayId} 
        moduleId={moduleId}
      />
      
      {/* Page content with error boundary */}
      <PathwayDataErrorBoundary
        resetQuery={() => handleRefresh()}
      >
        <Card className={cn(
          "border shadow-sm",
          isJungleTheme ? "border-[#3A5A4E] bg-[#0D1D18] text-white" : ""
        )}>
          <CardHeader className={cn(
            "pb-0",
            isJungleTheme ? "border-b border-[#3A5A4E]" : ""
          )}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackToPathway}
                  className={cn(
                    "mr-2",
                    isJungleTheme ? "text-[#94C973] hover:bg-[#1E2F28]" : ""
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {isModuleLoading ? (
                  <Skeleton className="h-7 w-64" />
                ) : (
                  <CardTitle className={cn(
                    "text-xl",
                    isJungleTheme ? "text-[#E6B933]" : ""
                  )}>
                    {module?.title || 'Module Not Found'}
                  </CardTitle>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Module content with animated transitions */}
            <ModuleTransition pathwayId={pathwayId} currentModuleId={moduleId}>
              {isModuleLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : moduleError ? (
                <div className={cn(
                  "bg-red-50 p-6 rounded-md border border-red-100 flex items-start gap-3",
                  isJungleTheme ? "bg-[#2D1A1A] border-[#4A2C2C] text-red-300" : ""
                )}>
                  <AlertCircle className={cn(
                    "h-5 w-5 mt-0.5",
                    isJungleTheme ? "text-red-300" : "text-red-500"
                  )} />
                  <div>
                    <h3 className="font-medium mb-1">Failed to load module content</h3>
                    <p className={cn(
                      "text-sm",
                      isJungleTheme ? "text-gray-300" : "text-gray-600"
                    )}>
                      We're having trouble loading this module. Please try refreshing the page or come back later.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={handleRefresh}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={cn(
                    "text-sm pb-4 border-b",
                    isJungleTheme ? "border-[#3A5A4E] text-gray-300" : "border-gray-100 text-gray-600"
                  )}>
                    <div className="flex items-center mb-2 gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{module?.lessonCount || 0} Lessons</span>
                      <span className="mx-2">•</span>
                      <span>Estimated time: {module?.estimatedMinutes || 0} minutes</span>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "prose max-w-none",
                    isJungleTheme ? "prose-invert" : ""
                  )}>
                    <h2>Overview</h2>
                    <p>{module?.description || 'No description available'}</p>
                    
                    {/* Module lessons */}
                    {module?.lessons && module.lessons.length > 0 ? (
                      <div className="mt-8">
                        <h3>Lessons</h3>
                        <ul className={cn(
                          "space-y-2 mt-4",
                          isJungleTheme ? "text-white" : ""
                        )}>
                          {module.lessons.map((lesson: any) => (
                            <li key={lesson.id} className="flex items-center">
                              <div className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full mr-3",
                                lesson.completed 
                                  ? isJungleTheme ? "bg-[#2B4A35] text-[#94C973]" : "bg-green-100 text-green-600" 
                                  : isJungleTheme ? "bg-[#1E2F28] text-gray-400" : "bg-gray-100 text-gray-500"
                              )}>
                                {lesson.completed ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <span>{lesson.order}</span>
                                )}
                              </div>
                              <span className={lesson.completed ? 'font-medium' : ''}>
                                {lesson.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className={cn(
                        "p-4 bg-gray-50 rounded-md text-center my-6",
                        isJungleTheme ? "bg-[#1E2F28] text-gray-300" : ""
                      )}>
                        No lessons are available for this module yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ModuleTransition>
          </CardContent>
        </Card>
      </PathwayDataErrorBoundary>
    </div>
  );
}