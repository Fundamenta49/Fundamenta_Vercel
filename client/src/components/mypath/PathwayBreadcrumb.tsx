import React from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, Home, BookOpen, FileText, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';

interface PathwayBreadcrumbProps {
  pathwayId: string;
  moduleId?: string;
  lessonId?: string;
  showIcons?: boolean;
  className?: string;
}

/**
 * PathwayBreadcrumb provides hierarchical navigation for the learning pathways.
 * It displays the current location within the learning path hierarchy and allows
 * users to navigate back to previous levels.
 */
export function PathwayBreadcrumb({
  pathwayId,
  moduleId,
  lessonId,
  showIcons = true,
  className,
}: PathwayBreadcrumbProps) {
  const [, navigate] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  
  // Fetch pathway data
  const { data: pathway, isLoading: isPathwayLoading } = useQuery({
    queryKey: ['/api/pathways', pathwayId],
    enabled: !!pathwayId,
  });
  
  // Fetch module data if moduleId is provided
  const { data: module, isLoading: isModuleLoading } = useQuery({
    queryKey: ['/api/pathways/modules', pathwayId, moduleId],
    enabled: !!pathwayId && !!moduleId,
  });
  
  // Fetch lesson data if lessonId is provided
  const { data: lesson, isLoading: isLessonLoading } = useQuery({
    queryKey: ['/api/pathways/lessons', pathwayId, moduleId, lessonId],
    enabled: !!pathwayId && !!moduleId && !!lessonId,
  });
  
  // Navigation handlers
  const handlePathwayClick = () => {
    navigate(`/mypath/pathway/${pathwayId}`);
  };
  
  const handleModuleClick = () => {
    if (moduleId) {
      navigate(`/mypath/pathway/${pathwayId}/module/${moduleId}`);
    }
  };
  
  const handleDashboardClick = () => {
    navigate('/mypath');
  };
  
  // Style classes
  const breadcrumbClass = cn(
    "flex items-center text-sm overflow-x-auto scrollbar-hide py-2",
    isJungleTheme ? "text-green-200" : "text-slate-600",
    className
  );
  
  const chevronClass = cn(
    "mx-1 h-3 w-3 flex-shrink-0",
    isJungleTheme ? "text-green-700" : "text-slate-400"
  );
  
  const linkClass = cn(
    "hover:underline cursor-pointer flex-shrink-0 flex items-center",
    isJungleTheme ? "hover:text-green-100" : "hover:text-slate-900"
  );
  
  const currentItemClass = cn(
    "font-semibold truncate max-w-[200px] sm:max-w-xs",
    isJungleTheme ? "text-white" : "text-slate-900"
  );
  
  const iconClass = cn(
    "mr-1 h-3.5 w-3.5",
    isJungleTheme ? "text-green-500" : "text-slate-500"
  );
  
  return (
    <nav aria-label="Breadcrumb" className={breadcrumbClass}>
      {/* Dashboard link */}
      <span className={linkClass} onClick={handleDashboardClick}>
        {showIcons && <Home className={iconClass} />}
        Pathways
      </span>
      
      <ChevronRight className={chevronClass} />
      
      {/* Pathway link/current */}
      {moduleId ? (
        <span className={linkClass} onClick={handlePathwayClick}>
          {showIcons && <BookOpen className={iconClass} />}
          {isPathwayLoading ? "Loading..." : pathway?.title || "Pathway"}
        </span>
      ) : (
        <span className={currentItemClass}>
          {showIcons && <BookOpen className={iconClass} />}
          {isPathwayLoading ? "Loading..." : pathway?.title || "Pathway"}
        </span>
      )}
      
      {/* Module link/current (if applicable) */}
      {moduleId && (
        <>
          <ChevronRight className={chevronClass} />
          {lessonId ? (
            <span className={linkClass} onClick={handleModuleClick}>
              {showIcons && <Hash className={iconClass} />}
              {isModuleLoading ? "Loading..." : module?.title || "Module"}
            </span>
          ) : (
            <span className={currentItemClass}>
              {showIcons && <Hash className={iconClass} />}
              {isModuleLoading ? "Loading..." : module?.title || "Module"}
            </span>
          )}
        </>
      )}
      
      {/* Lesson current (if applicable) */}
      {lessonId && (
        <>
          <ChevronRight className={chevronClass} />
          <span className={currentItemClass}>
            {showIcons && <FileText className={iconClass} />}
            {isLessonLoading ? "Loading..." : lesson?.title || "Lesson"}
          </span>
        </>
      )}
    </nav>
  );
}

/**
 * SimplePathwayBreadcrumb is a minimalistic version of the breadcrumb
 * showing only the pathway name with a back button.
 */
export function SimplePathwayBreadcrumb({ pathwayId }: { pathwayId: string }) {
  const [, navigate] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  
  // Fetch pathway data
  const { data: pathway } = useQuery({
    queryKey: ['/api/pathways', pathwayId],
    enabled: !!pathwayId,
  });
  
  return (
    <div className={cn(
      "flex items-center mb-4",
      isJungleTheme ? "text-green-200" : "text-slate-700"
    )}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/mypath')}
        className={cn(
          "mr-2 px-2",
          isJungleTheme ? "text-green-400 hover:text-green-300 hover:bg-green-900/30" : ""
        )}
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        <span className="ml-1">Back</span>
      </Button>
      
      <h2 className={cn(
        "text-lg font-medium truncate",
        isJungleTheme ? "text-white" : ""
      )}>
        {pathway?.title || "Learning Pathway"}
      </h2>
    </div>
  );
}