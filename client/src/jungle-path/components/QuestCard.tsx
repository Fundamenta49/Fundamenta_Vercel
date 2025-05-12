import React from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowRight, Clock, Award, Lock, CheckCircle2, Target
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { JungleQuest } from '../types/quest';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import { getZoneByCategory } from '../utils/zoneUtils';

interface QuestCardProps {
  /** Quest data to display */
  quest: JungleQuest;
  
  /** Progress percentage (0-100) */
  progress?: number;
  
  /** Whether this quest is unlocked */
  isUnlocked: boolean;
  
  /** Whether this quest is completed */
  isCompleted?: boolean;
  
  /** CSS class name for additional styling */
  className?: string;
  
  /** Whether to use a compact layout */
  compact?: boolean;
  
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Card component for displaying a jungle-themed quest
 */
const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  progress = 0,
  isUnlocked,
  isCompleted = false,
  className = '',
  compact = false,
  onClick
}) => {
  const [, navigate] = useLocation();
  const { jungleProgress } = useJungleTheme();
  
  // Get zone information for the quest's category
  const zone = getZoneByCategory(quest.category);
  const zoneColor = zone?.color || '#E6B933'; // Default gold color if zone not found
  
  // Handle click on the quest card
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (isUnlocked) {
      // Navigate to the quest page (fallback to original module if no specific path)
      navigate(`/learning/quests/${quest.id}`);
    }
  };
  
  // Format estimated time as a friendly string
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };
  
  return (
    <Card className={`
      border-2 overflow-hidden
      ${isUnlocked 
        ? isCompleted
          ? 'border-[#94C973] bg-[#1E4A3D]'
          : `border-[${zoneColor}] bg-[#162E26]`
        : 'border-gray-600 bg-[#162E26]/60 opacity-75'
      }
      ${isUnlocked && !isCompleted ? 'hover:shadow-md' : ''} 
      transition-all duration-300
      ${className}
    `}>
      <CardHeader className={`
        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
        ${isUnlocked ? 'border-b border-[#94C973]/30' : 'border-b border-gray-700'}
      `}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`
              font-medium ${compact ? 'text-base' : 'text-lg'}
              ${isCompleted ? 'text-[#94C973]' : 
                isUnlocked ? `text-[${zoneColor}]` : 'text-gray-400'
              }
            `}>
              {quest.jungleTitle}
            </h3>
            
            {!compact && (
              <p className="text-sm text-[#94C973]/80 mt-1 line-clamp-2">
                {quest.jungleDescription}
              </p>
            )}
          </div>
          
          {/* Difficulty indicator */}
          {quest.difficulty && !compact && (
            <Badge 
              variant="outline" 
              className={`
                ${isUnlocked 
                  ? `border-[${zoneColor}]/50 text-[${zoneColor}]` 
                  : 'border-gray-600 text-gray-400'
                }
              `}
            >
              <Target className="h-3 w-3 mr-1" />
              {Array(quest.difficulty).fill('•').join('')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={compact ? 'p-3 pt-2' : 'p-4 pt-3'}>
        {/* Quest metadata */}
        <div className="flex items-center justify-between text-xs text-[#94C973]/80 mb-2">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatTime(quest.estimatedTime)}</span>
          </div>
          
          {zone && (
            <div className="flex items-center">
              <span className="mr-1">Zone:</span>
              <span 
                className="font-medium" 
                style={{ color: isUnlocked ? zoneColor : 'currentColor' }}
              >
                {zone.name}
              </span>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {isUnlocked && (
          <div className="mt-2">
            <Progress 
              value={isCompleted ? 100 : progress} 
              className="h-2 bg-[#0F1C18]"
              style={{
                "--progress-foreground": isCompleted ? '#94C973' : zoneColor
              } as React.CSSProperties} 
            />
            
            {/* Status text */}
            <div className="flex justify-between mt-1">
              <span className="text-xs">
                {isCompleted ? (
                  <span className="text-[#94C973] flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                ) : progress > 0 ? (
                  <span className="text-[#94C973]">{progress}% complete</span>
                ) : (
                  <span className="text-[#94C973]/60">Not started</span>
                )}
              </span>
              
              {quest.requiredRank !== undefined && quest.requiredRank > 0 && (
                <span className="text-xs text-[#94C973]/80 flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Rank {quest.requiredRank}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Locked message */}
        {!isUnlocked && quest.requiredRank !== undefined && quest.requiredRank > jungleProgress.rank && (
          <div className="text-xs text-amber-300/80 mt-2 flex items-center">
            <Award className="h-3 w-3 mr-1" />
            <span>
              Requires Rank {quest.requiredRank} ({quest.requiredRank * 100} XP)
            </span>
          </div>
        )}
      </CardContent>
      
      {!compact && (
        <CardFooter className="px-4 py-3 bg-[#0F1C18]/30 flex justify-end">
          <Button 
            size="sm"
            disabled={!isUnlocked}
            onClick={handleClick}
            className={`
              ${isCompleted 
                ? 'bg-[#94C973] text-[#162E26] hover:bg-[#94C973]/90'
                : isUnlocked 
                  ? `bg-[${zoneColor}] hover:bg-[${zoneColor}]/90 text-[#162E26]` 
                  : 'bg-gray-600 text-gray-300'
              }
            `}
          >
            {isCompleted ? (
              <>
                Revisit Quest
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : isUnlocked ? (
              <>
                Begin Quest
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Locked
                <Lock className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuestCard;