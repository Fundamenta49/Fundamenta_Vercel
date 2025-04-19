import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ResumeOptimizerProps, OptimizationSuggestion } from './types';

// Mock optimization suggestions - would be replaced with AI-generated content in production
const MOCK_SUGGESTIONS: OptimizationSuggestion[] = [
  {
    section: 'summary',
    suggestion: 'Consider highlighting your specific achievements with quantifiable metrics to make your summary more impactful.',
    reason: 'Numbers and specific results help employers quickly understand your value.'
  },
  {
    section: 'experience',
    suggestion: 'Try using more action verbs at the beginning of each achievement bullet point, such as "Implemented," "Developed," or "Managed."',
    reason: 'Action verbs make your accomplishments more dynamic and engaging.'
  },
  {
    section: 'skills',
    suggestion: 'Organize your skills by relevance to the target position to draw attention to your most applicable qualifications.',
    reason: 'Recruiters often scan for specific skills related to the job requirements.'
  },
  {
    section: 'overall',
    suggestion: 'Ensure your resume is concise and limited to 1-2 pages maximum to maintain the recruiter\'s attention.',
    reason: 'Studies show that recruiters spend only 6-7 seconds initially reviewing a resume.'
  }
];

export default function ResumeOptimizer({ 
  optimizationTarget, 
  setOptimizationTarget, 
  onOptimize, 
  isOptimizing 
}: ResumeOptimizerProps) {
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [hasOptimized, setHasOptimized] = useState<boolean>(false);

  // Handle optimization
  const handleOptimize = () => {
    onOptimize();
    // In a real implementation, suggestions would come from the API
    // This is just for demo purposes
    setOptimizationSuggestions(MOCK_SUGGESTIONS);
    setHasOptimized(true);
  };

  // Get badge color based on section
  const getSectionBadgeColor = (section: string): string => {
    switch (section) {
      case 'summary':
        return 'bg-blue-100 text-blue-800';
      case 'experience':
        return 'bg-green-100 text-green-800';
      case 'skills':
        return 'bg-purple-100 text-purple-800';
      case 'education':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Resume Optimizer
        </CardTitle>
        <CardDescription>
          Get personalized suggestions to improve your resume
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Job Title</label>
          <Input 
            placeholder="e.g. Software Engineer, Marketing Manager" 
            value={optimizationTarget}
            onChange={(e) => setOptimizationTarget(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the specific job title you're targeting for tailored optimization
          </p>
        </div>
        
        <Button 
          className="w-full"
          onClick={handleOptimize}
          disabled={isOptimizing || !optimizationTarget.trim()}
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Optimize Resume
            </>
          )}
        </Button>
        
        {optimizationSuggestions.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Optimization Suggestions</h3>
              {hasOptimized && (
                <span className="flex items-center text-xs text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" /> 
                  Optimized for {optimizationTarget}
                </span>
              )}
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-md hover:bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        variant="outline" 
                        className={`mb-1 uppercase text-xs font-semibold ${getSectionBadgeColor(suggestion.section)}`}
                      >
                        {suggestion.section}
                      </Badge>
                    </div>
                    <p className="text-sm">{suggestion.suggestion}</p>
                    {suggestion.reason && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Why: </span>
                        {suggestion.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}