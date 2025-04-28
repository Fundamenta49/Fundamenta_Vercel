import React from "react";
import { useLocation } from "wouter";
import { Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { trackModuleProgress } from "@/lib/learning-progress";

// Expedition card styles
const expeditionStyles = {
  // Card styles
  card: "border-2 border-[#E6B933] bg-[#1E4A3D] rounded-md shadow-md backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01]",
  cardHeader: "border-b border-[#94C973]/30 pt-4 pb-2 px-4",
  cardContent: "p-4",
  cardTitle: "text-[#E6B933] font-semibold text-xl",
  
  // Button styles - matching the gold buttons from the screenshot
  button: "bg-[#E6B933] text-[#1E4A3D] hover:bg-[#DCAA14] font-medium transition-colors duration-300 rounded-md",
  buttonOutline: "border-[#E6B933] text-[#E6B933] hover:bg-[#E6B933]/20 rounded-md",
  viewQuestButton: "bg-white text-[#1E4A3D] hover:bg-gray-100 font-medium transition-colors duration-300 rounded-md",
  
  // Progress bar
  progress: "bg-[#162E26] rounded-full h-2.5 overflow-hidden",
  progressFill: "bg-[#94C973]",
  
  // Quest metadata
  questCount: "bg-[#162E26] text-[#E6B933] px-2 py-0.5 rounded-md border border-[#E6B933]/50 text-sm font-medium",
  questProgress: "text-[#94C973] font-medium text-sm mt-2",
  
  // Module styling
  module: "bg-[#162E26] border border-[#94C973]/30 rounded-md px-3 py-2 mb-2",
  moduleTitle: "text-[#E6B933] font-medium",
};

interface Module {
  id: string;
  title: string;
  jungleTitle?: string;
  href?: string;
}

interface Pathway {
  id: string;
  title: string;
  jungleTitle?: string;
  description: string;
  jungleDescription?: string;
  category: string;
  icon: React.ComponentType<any>;
  modules: Module[];
  href?: string;
}

interface ExpeditionCardProps {
  pathway: Pathway;
  progress: number;
  zoneColor: string;
  completedModulesCount: string;
  isModuleCompleted: (moduleId: string) => boolean;
  toggleModuleCompletion: (moduleId: string, currentState: boolean) => void;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const ExpeditionCard: React.FC<ExpeditionCardProps> = ({
  pathway,
  progress,
  zoneColor,
  completedModulesCount,
  isModuleCompleted,
  toggleModuleCompletion,
  isExpanded,
  toggleExpanded
}) => {
  const [, navigate] = useLocation();
  
  return (
    <Card 
      className={expeditionStyles.card}
      style={{
        borderColor: zoneColor || "#E6B933",
        borderWidth: "2px",
        borderStyle: "solid",
        boxShadow: `0 4px 12px ${zoneColor || "#E6B933"}33`
      }}
    >
      <CardHeader className={expeditionStyles.cardHeader}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <pathway.icon className="h-5 w-5 mt-1 text-[#E6B933]" />
            <div>
              <CardTitle className={expeditionStyles.cardTitle}>
                {pathway.jungleTitle || pathway.title}
              </CardTitle>
              <CardDescription className="text-[#94C973] mt-1">
                {pathway.jungleDescription || pathway.description}
              </CardDescription>
            </div>
          </div>
          <div className={expeditionStyles.questCount}>
            {pathway.modules.length} quests
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={expeditionStyles.cardContent}>
        <div>
          <p className="text-sm mb-1">Expedition Progress</p>
          <Progress 
            value={progress} 
            className={expeditionStyles.progress}
            style={{
              "--progress-foreground": zoneColor
            } as React.CSSProperties}
          />
          <p className={expeditionStyles.questProgress}>
            {completedModulesCount} quests completed
          </p>
        </div>
        
        {/* Next quest section */}
        {pathway.modules.length > 0 && (
          <div className={`${expeditionStyles.module} mt-3`}>
            <div className="flex justify-between items-center">
              <div>
                <p className={expeditionStyles.moduleTitle}>
                  {pathway.modules[0].jungleTitle || pathway.modules[0].title}
                </p>
                <p className="text-sm text-[#94C973]">
                  {progress > 0 ? '15 expedition time' : 'First quest'}
                </p>
              </div>
              <Button
                className={expeditionStyles.button}
                size="sm"
                onClick={() => navigate(pathway.href || `/learning/courses/${pathway.id}`)}
              >
                {isModuleCompleted(pathway.modules[0].id) ? "Continue Quest" : "Begin Quest"}
              </Button>
            </div>
          </div>
        )}
        
        {/* Explorer level */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#E6B933]" />
            <span className="text-[#E6B933] text-sm">Explorer (Level 2)</span>
          </div>
          <Button
            className={expeditionStyles.button}
            size="sm"
            onClick={() => navigate(pathway.href || `/learning/courses/${pathway.id}`)}
          >
            {progress > 0 ? "Continue Expedition" : "Start Expedition"}
          </Button>
        </div>
        
        {/* Expanded view toggle */}
        {isExpanded && (
          <div className="mt-4 space-y-2">
            <Separator className="bg-[#94C973]/30" />
            <h3 className="text-sm font-medium pt-2 text-[#E6B933]">
              All Expedition Quests
            </h3>
            
            {pathway.modules.map((module, index) => (
              <div key={module.id} className={expeditionStyles.module}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isModuleCompleted(module.id) 
                        ? "bg-[#E6B933] text-[#1E4A3D]"
                        : "bg-[#94C973]/20 text-[#94C973]"
                    }`}>
                      {isModuleCompleted(module.id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <p className={`${
                        isModuleCompleted(module.id) 
                          ? "text-[#E6B933]" 
                          : "text-white"
                      }`}>
                        {module.jungleTitle || module.title}
                      </p>
                      <p className="text-xs text-[#94C973]">
                        {isModuleCompleted(module.id) ? "Completed" : "15 min expedition time"}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    className={expeditionStyles.button}
                    onClick={() => {
                      if (module.href) {
                        navigate(module.href);
                      } else {
                        toggleModuleCompletion(
                          module.id, 
                          isModuleCompleted(module.id)
                        );
                      }
                    }}
                  >
                    {isModuleCompleted(module.id)
                      ? "Revisit Quest" 
                      : "Start Quest"}
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              size="sm"
              variant="outline"
              className={expeditionStyles.buttonOutline}
              onClick={toggleExpanded}
            >
              Hide Quests
            </Button>
          </div>
        )}
        
        {!isExpanded && (
          <Button
            size="sm"
            variant="outline"
            className={`${expeditionStyles.viewQuestButton} mt-3 w-full`}
            onClick={toggleExpanded}
          >
            View Quest Map
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpeditionCard;