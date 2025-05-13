/**
 * ModuleCard Component
 * Used to display module information in a card format
 * Implements theme-aware title display based on current theme
 */

import * as React from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/LearningThemeContext";
import { PathwayModule } from "@/pages/learning/pathways-data";
import { useLocation } from "wouter";

interface ModuleCardProps {
  module: PathwayModule;
  onClick?: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  
  // Use theme-aware title selection as specified in requirements
  const displayTitle = theme === 'jungle' && module.jungleTitle 
    ? module.jungleTitle 
    : module.title;
    
  // Theme-specific styling
  const cardClasses = theme === 'jungle'
    ? 'border-amber-700 bg-[#28362E] text-white hover:bg-[#2F4038] transition-colors'
    : 'border-slate-200 hover:border-slate-300 transition-colors';
  
  const handleModuleClick = () => {
    if (onClick) {
      onClick();
    } else if (module.href) {
      navigate(module.href);
    }
  };
  
  return (
    <Card className={`cursor-pointer ${cardClasses}`} onClick={handleModuleClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{displayTitle}</CardTitle>
        {module.description && (
          <CardDescription className={theme === 'jungle' ? 'text-slate-300' : 'text-slate-500'}>
            {module.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center text-sm text-slate-500">
          <Clock className="mr-1 h-4 w-4" />
          <span className={theme === 'jungle' ? 'text-slate-300' : ''}>
            {module.duration} minutes
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-1">
        {module.completed ? (
          <Badge variant="success" className="ml-auto">
            Completed
          </Badge>
        ) : (
          <Button 
            variant={theme === 'jungle' ? 'secondary' : 'default'} 
            size="sm" 
            className="ml-auto"
          >
            Start Module
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}