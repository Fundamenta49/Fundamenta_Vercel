import * as React from "react";
import { Trophy, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/contexts/LearningThemeContext";

interface ProgressDisplayProps {
  currentXP: number;
  nextLevelXP: number;
  rank: number;
  rankTitle: string;
}

export function ProgressDisplay({ currentXP, nextLevelXP, rank, rankTitle }: ProgressDisplayProps) {
  const { theme } = useTheme();
  const progress = Math.round((currentXP / nextLevelXP) * 100);
  
  // Theme-specific styling
  const containerClasses = theme === 'jungle'
    ? 'bg-[#28362E] border-amber-700 text-white'
    : 'bg-white border-slate-200';
    
  const xpTextClasses = theme === 'jungle'
    ? 'text-amber-400'
    : 'text-blue-600';
    
  const rankTextClasses = theme === 'jungle'
    ? 'text-amber-500'
    : 'text-slate-800';
    
  const progressClasses = theme === 'jungle'
    ? 'bg-amber-800'
    : 'bg-slate-200';
    
  const progressValueClasses = theme === 'jungle'
    ? 'bg-amber-500'
    : 'bg-blue-600';
  
  return (
    <div className={`p-6 rounded-lg border ${containerClasses}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Your Progress</h3>
          <div className="flex items-center gap-1">
            <Star className={`h-5 w-5 ${xpTextClasses}`} />
            <span className={`font-bold ${xpTextClasses}`}>{currentXP} XP</span>
            <span className={theme === 'jungle' ? 'text-slate-300' : 'text-slate-500'}>
              / {nextLevelXP} XP to next rank
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Trophy className={`h-6 w-6 ${theme === 'jungle' ? 'text-amber-400' : 'text-amber-500'}`} />
          <div>
            <div className={`font-bold ${rankTextClasses}`}>Rank {rank}</div>
            <div className={theme === 'jungle' ? 'text-slate-300' : 'text-slate-500'}>
              {rankTitle}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress to next rank</span>
          <span>{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className={progressClasses} 
          indicatorClassName={progressValueClasses}
        />
      </div>
    </div>
  );
}