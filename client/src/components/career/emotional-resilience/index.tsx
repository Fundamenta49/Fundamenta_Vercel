import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Info, 
  Rocket, 
  Heart, 
  Gauge, 
  ArrowUp, 
  Users, 
  Zap, 
  Lightbulb, 
  LucideShield, 
  BarChart, 
  Clock 
} from 'lucide-react';

const EmotionalResilience: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-auto bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">EQ & Resilience</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Build emotional intelligence and career resilience
        </p>
      </div>

      {/* Info Alert */}
      <div className="px-6 py-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <p className="text-blue-700 dark:text-blue-300">
              Track your emotional intelligence development and build career resilience skills. These capabilities are critical for navigating workplace challenges and advancement.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Card className="border rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Rocket className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Emotional Intelligence & Career Resilience</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Track and improve your emotional intelligence and career resilience
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emotional Intelligence Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Emotional Intelligence</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Self-Awareness</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Self-Regulation</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Motivation</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Empathy</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Social Skills</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </div>
              
              {/* Career Resilience Column */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Career Resilience</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <LucideShield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Adaptability</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Problem-Solving</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Stress Management</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Growth Mindset</span>
                      </div>
                      <span className="text-xs font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button className="w-64">
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionalResilience;