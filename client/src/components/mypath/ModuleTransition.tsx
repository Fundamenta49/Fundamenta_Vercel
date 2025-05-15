import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';
import { useToast } from '@/hooks/use-toast';

interface ModuleTransitionProps {
  pathwayId: string;
  currentModuleId: string;
  children: React.ReactNode;
}

export function ModuleTransition({ 
  pathwayId, 
  currentModuleId, 
  children 
}: ModuleTransitionProps) {
  const [, navigate] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get pathway data
  const { data: pathway } = useQuery({
    queryKey: ['/api/pathways', pathwayId],
    enabled: !!pathwayId
  });
  
  // Get user progress data
  const { data: progressData } = useQuery({
    queryKey: ['/api/pathways/progress', pathwayId],
    enabled: !!pathwayId
  });
  
  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: { pathwayId: string; moduleId: string; completed: boolean }) => {
      return apiRequest('/api/pathways/progress', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pathways/progress'] });
      toast({
        title: "Progress saved",
        description: "Your learning progress has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error saving progress",
        description: "There was a problem updating your progress. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Find current module index
  const currentModuleIndex = React.useMemo(() => {
    if (!pathway?.modules) return -1;
    return pathway.modules.findIndex(m => m.id === currentModuleId);
  }, [pathway, currentModuleId]);
  
  // Determine if current module is completed
  const isCurrentModuleCompleted = React.useMemo(() => {
    if (!progressData) return false;
    return progressData.some(p => p.moduleId === currentModuleId && p.completed);
  }, [progressData, currentModuleId]);
  
  // Get previous and next modules
  const previousModule = React.useMemo(() => {
    if (currentModuleIndex <= 0 || !pathway?.modules) return null;
    return pathway.modules[currentModuleIndex - 1];
  }, [pathway, currentModuleIndex]);
  
  const nextModule = React.useMemo(() => {
    if (currentModuleIndex === -1 || !pathway?.modules || currentModuleIndex >= pathway.modules.length - 1) {
      return null;
    }
    return pathway.modules[currentModuleIndex + 1];
  }, [pathway, currentModuleIndex]);
  
  // Handle marking the module as complete
  const handleCompleteModule = () => {
    updateProgressMutation.mutate({
      pathwayId,
      moduleId: currentModuleId,
      completed: true
    });
  };
  
  // Navigate to next or previous module
  const navigateToModule = (moduleId: string) => {
    navigate(`/mypath/pathway/${pathwayId}/module/${moduleId}`);
  };
  
  return (
    <div className="relative">
      {/* Main content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentModuleId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation footer */}
      <div className={cn(
        "mt-8 py-4 border-t flex justify-between items-center",
        isJungleTheme ? "border-[#3A5A4E]" : "border-gray-200"
      )}>
        {/* Previous button */}
        <div>
          {previousModule && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                isJungleTheme ? "border-[#3A5A4E] text-[#94C973]" : ""
              )}
              onClick={() => navigateToModule(previousModule.id)}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Module
            </Button>
          )}
        </div>
        
        {/* Center - Complete button */}
        <div>
          {!isCurrentModuleCompleted ? (
            <Button
              variant="default"
              className={cn(
                "flex items-center gap-2",
                updateProgressMutation.isPending ? "opacity-70 cursor-not-allowed" : "",
                isJungleTheme ? "bg-[#5BAD5B] text-white hover:bg-[#4A9C4A]" : ""
              )}
              onClick={handleCompleteModule}
              disabled={updateProgressMutation.isPending}
            >
              <CheckCircle className="h-4 w-4" />
              {updateProgressMutation.isPending ? "Saving..." : "Mark Complete"}
            </Button>
          ) : (
            <div className={cn(
              "flex items-center px-3 py-1.5 rounded-md text-sm",
              isJungleTheme ? "bg-[#1E3A29] text-[#94C973]" : "bg-green-50 text-green-700"
            )}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </div>
          )}
        </div>
        
        {/* Next button */}
        <div>
          {nextModule && (
            <Button
              variant={isCurrentModuleCompleted ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex items-center gap-2",
                !isCurrentModuleCompleted && isJungleTheme ? "border-[#3A5A4E] text-[#94C973]" : ""
              )}
              onClick={() => navigateToModule(nextModule.id)}
            >
              Next Module
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Simplified version for when we just need transitions without the navigation controls
export function SimpleModuleTransition({ 
  children, 
  transitionKey 
}: { 
  children: React.ReactNode; 
  transitionKey: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}