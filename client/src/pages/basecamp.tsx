import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { learningPathways } from "@/pages/learning/pathways-data";
import { BasecampLayout } from "@/components/layouts/BasecampLayout";
import { SummaryCard } from "@/components/learning/SummaryCard";
import { ProgressDisplay } from "@/components/learning/ProgressDisplay";
import { getZoneById, LearningZone, learningZones } from "@/data/zones-config";
import { useTheme } from "@/contexts/LearningThemeContext";

// We'll use mock data for now, but this would come from user's profile
const userProgress = {
  currentXP: 850,
  nextLevelXP: 1000,
  rank: 3,
  rankTitle: "Explorer",
  lastActiveModule: "financial-planning"
};

interface CompletedModulesGrouped {
  [zoneId: string]: {
    zone: LearningZone;
    modules: Array<{
      id: string;
      title: string;
      jungleTitle?: string;
      completedDate: Date;
      duration: number;
      href: string;
    }>;
  };
}

export default function BasecampPage() {
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  const [completedModules, setCompletedModules] = useState<CompletedModulesGrouped>({});
  
  useEffect(() => {
    // Find all completed modules and group them by zone
    const grouped: CompletedModulesGrouped = {};
    
    learningPathways.forEach(pathway => {
      pathway.modules.forEach(module => {
        if (module.completed) {
          // Find which zone this module belongs to
          const zoneForModule = learningZones.find(zone => zone.category === pathway.category);
          
          if (zoneForModule) {
            if (!grouped[zoneForModule.id]) {
              grouped[zoneForModule.id] = {
                zone: zoneForModule,
                modules: []
              };
            }
            
            grouped[zoneForModule.id].modules.push({
              id: module.id,
              title: module.title,
              jungleTitle: module.jungleTitle,
              // Mock completion date - in a real app this would come from the database
              completedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
              duration: module.duration,
              href: module.href || `/learning/modules/${module.id}`
            });
          }
        }
      });
    });
    
    // Sort modules by completion date (newest first)
    Object.keys(grouped).forEach(zoneId => {
      grouped[zoneId].modules.sort((a, b) => 
        b.completedDate.getTime() - a.completedDate.getTime()
      );
    });
    
    setCompletedModules(grouped);
  }, []);
  
  // Get last active module to offer "Resume Learning" option
  const lastActiveModule = learningPathways.flatMap(p => p.modules)
    .find(m => m.id === userProgress.lastActiveModule);
  
  // Theme-specific title
  const title = theme === 'jungle' ? "Expedition Basecamp" : "Learning Progress";
  const description = theme === 'jungle' 
    ? "Track your jungle expedition progress and review completed challenges"
    : "Track your learning progress and review completed modules";
    
  return (
    <BasecampLayout title={title} description={description}>
      {/* Progress Display */}
      <ProgressDisplay 
        currentXP={userProgress.currentXP}
        nextLevelXP={userProgress.nextLevelXP}
        rank={userProgress.rank}
        rankTitle={userProgress.rankTitle}
      />
      
      {/* Resume Learning Section */}
      {lastActiveModule && (
        <div className={`p-6 rounded-lg border mb-8 ${
          theme === 'jungle' 
            ? 'bg-[#28362E] border-amber-700 text-white' 
            : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Resume Learning</h3>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-medium">
                {theme === 'jungle' && lastActiveModule.jungleTitle 
                  ? lastActiveModule.jungleTitle 
                  : lastActiveModule.title}
              </h4>
              <p className={theme === 'jungle' ? 'text-slate-300' : 'text-slate-500'}>
                Continue where you left off
              </p>
            </div>
            <Button 
              onClick={() => navigate(lastActiveModule.href || `/learning/modules/${lastActiveModule.id}`)}
              className={theme === 'jungle' ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              Continue Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Completed Modules Section */}
      <div>
        <h3 className={`text-xl font-semibold mb-6 ${
          theme === 'jungle' ? 'text-amber-300' : ''
        }`}>
          Completed Modules
        </h3>
        
        {Object.keys(completedModules).length > 0 ? (
          <Tabs defaultValue={Object.keys(completedModules)[0]} className="space-y-6">
            <TabsList className={`w-full justify-start overflow-x-auto ${
              theme === 'jungle' ? 'bg-[#28362E]' : ''
            }`}>
              {Object.entries(completedModules).map(([zoneId, data]) => (
                <TabsTrigger 
                  key={zoneId} 
                  value={zoneId}
                  className={theme === 'jungle' ? 'data-[state=active]:bg-amber-700' : ''}
                >
                  {theme === 'jungle' ? data.zone.title.jungle : data.zone.title.standard}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(completedModules).map(([zoneId, data]) => (
              <TabsContent key={zoneId} value={zoneId} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.modules.map(module => (
                    <SummaryCard 
                      key={module.id}
                      id={module.id}
                      title={module.title}
                      jungleTitle={module.jungleTitle}
                      completedDate={module.completedDate}
                      duration={module.duration}
                      href={module.href}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className={`p-8 text-center rounded-lg border ${
            theme === 'jungle' ? 'border-amber-700 bg-[#28362E] text-white' : 'border-slate-200'
          }`}>
            <p className="text-lg mb-4">You haven't completed any modules yet.</p>
            <Button 
              onClick={() => navigate('/learning-hub')}
              className={theme === 'jungle' ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Back to Hub Button */}
      <div className="mt-12">
        <Button 
          variant="outline" 
          asChild
          className={theme === 'jungle' ? 'border-amber-700 text-amber-200 hover:bg-[#28362E]' : ''}
        >
          <Link href={theme === 'jungle' ? '/jungle-hub' : '/learning-hub'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {theme === 'jungle' ? 'Expedition Hub' : 'Learning Hub'}
          </Link>
        </Button>
      </div>
    </BasecampLayout>
  );
}