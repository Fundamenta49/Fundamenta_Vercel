import React, { useMemo } from 'react';
import { ChevronRight, Home, FileText, Folder, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'wouter';
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

export function PathwayBreadcrumb({
  pathwayId,
  moduleId,
  lessonId,
  showIcons = true,
  className
}: PathwayBreadcrumbProps) {
  const [location] = useLocation();
  const { isJungleTheme } = useJungleTheme();
  
  // Fetch pathway data for the breadcrumb
  const { data: pathway, isLoading } = useQuery({
    queryKey: ['/api/pathways', pathwayId],
    enabled: !!pathwayId
  });
  
  // Fetch module data if needed
  const { data: module } = useQuery({
    queryKey: ['/api/pathways/modules', pathwayId, moduleId],
    enabled: !!moduleId
  });
  
  // Only show breadcrumb if we're on a pathway page
  const showBreadcrumb = useMemo(() => {
    return location.includes('/mypath') || 
           location.includes('/learning') || 
           location.includes('/pathways');
  }, [location]);
  
  // If we're not on a relevant page, don't show the breadcrumb
  if (!showBreadcrumb) return null;
  
  // If we're loading pathway data, show a simplified breadcrumb
  if (isLoading) {
    return (
      <nav className={cn(
        "flex items-center mb-4 text-sm px-1 py-2 bg-gray-50 rounded",
        isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "", 
        className
      )}>
        <Link href="/mypath">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 flex items-center gap-1 hover:bg-gray-200"
          >
            <Home className="h-3.5 w-3.5" />
            <span>MyPath</span>
          </Button>
        </Link>
        <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
        <span className="animate-pulse bg-gray-200 rounded h-4 w-20"></span>
      </nav>
    );
  }
  
  // Construct breadcrumb items
  const breadcrumbItems = [];
  
  // Always add the MyPath home
  breadcrumbItems.push({
    label: 'MyPath',
    href: '/mypath',
    icon: <Home className={cn("h-3.5 w-3.5", showIcons ? "" : "hidden")} />
  });
  
  // Add pathway if available
  if (pathway) {
    breadcrumbItems.push({
      label: pathway.title,
      href: `/mypath/pathway/${pathwayId}`,
      icon: <Folder className={cn("h-3.5 w-3.5", showIcons ? "" : "hidden")} />
    });
  }
  
  // Add module if available
  if (module && moduleId) {
    breadcrumbItems.push({
      label: module.title,
      href: `/mypath/pathway/${pathwayId}/module/${moduleId}`,
      icon: <FileText className={cn("h-3.5 w-3.5", showIcons ? "" : "hidden")} />
    });
  }
  
  // Add lesson if available
  if (lessonId && module) {
    const lesson = module.lessons?.find(l => l.id === lessonId);
    if (lesson) {
      breadcrumbItems.push({
        label: lesson.title,
        href: `/mypath/pathway/${pathwayId}/module/${moduleId}/lesson/${lessonId}`,
        icon: <BookOpen className={cn("h-3.5 w-3.5", showIcons ? "" : "hidden")} />
      });
    }
  }
  
  return (
    <nav 
      className={cn(
        "flex items-center flex-wrap mb-4 text-sm px-1 py-2 bg-gray-50 rounded",
        isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "",
        className
      )}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight 
              className={cn(
                "h-4 w-4 mx-1", 
                isJungleTheme ? "text-[#3A5A4E]" : "text-gray-400"
              )} 
            />
          )}
          
          {index === breadcrumbItems.length - 1 ? (
            // Current item (not clickable)
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded font-medium",
              isJungleTheme ? "bg-[#1E2F28] text-white" : "bg-gray-100"
            )}>
              {item.icon}
              <span className="truncate max-w-[200px]">{item.label}</span>
            </div>
          ) : (
            // Navigate items
            <Link href={item.href}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 flex items-center gap-1",
                  isJungleTheme 
                    ? "hover:bg-[#1E2F28] text-[#94C973]" 
                    : "hover:bg-gray-200"
                )}
              >
                {item.icon}
                <span className="truncate max-w-[150px]">{item.label}</span>
              </Button>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Helper component for simplified usage with just a pathway ID
export function SimplePathwayBreadcrumb({ pathwayId }: { pathwayId: string }) {
  return <PathwayBreadcrumb pathwayId={pathwayId} showIcons={false} />;
}