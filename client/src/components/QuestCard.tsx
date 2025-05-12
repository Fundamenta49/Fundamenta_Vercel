import React from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowRight, Clock, Award, Lock, CheckCircle2, Target, BookOpen
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * Type for quest progress tracking
 */
export interface QuestProgress {
  /** Percentage of quest completion (0-100) */
  progressPercent: number;
  
  /** Timestamp when the quest was started */
  startedAt: string | null;
  
  /** Timestamp when the quest was completed (null if not completed) */
  completedAt: string | null;
}

/**
 * Interface for quest data common between themes
 */
export interface QuestData {
  /** Unique identifier for the quest */
  id: string;
  
  /** Title of the quest */
  title: string;
  
  /** Description of the quest */
  description: string;
  
  /** Category/section the quest belongs to */
  category: string;
  
  /** Estimated time to complete in minutes */
  estimatedTime: number;
  
  /** Difficulty level (1-5) */
  difficulty?: number;
  
  /** Required rank/level to access this quest */
  requiredRank?: number;
  
  /** Icon or image URL for the quest */
  icon?: string;
  
  /** For jungle theme: original module title */
  originalTitle?: string;
  
  /** For jungle theme: original module description */
  originalDescription?: string;
  
  /** For jungle theme: jungle-themed title */
  jungleTitle?: string;
  
  /** For jungle theme: jungle-themed description */
  jungleDescription?: string;
  
  /** Associated zone identifier */
  zoneId?: string;
}

// Card size variants
type CardSize = 'sm' | 'md' | 'lg';

// Base styles for different card sizes
const cardSizeStyles: Record<CardSize, string> = {
  sm: 'w-full max-w-xs',
  md: 'w-full max-w-sm',
  lg: 'w-full max-w-md',
};

interface QuestCardProps {
  /** Quest data to display */
  quest: QuestData;
  
  /** Visual theme variant for the card */
  variant: 'jungle' | 'standard';
  
  /** Progress tracking */
  progress?: number | QuestProgress;
  
  /** Current user rank (for locked/unlocked state) */
  userRank?: number;
  
  /** Explicitly control locked state (overrides rank check) */
  isLocked?: boolean;
  
  /** Explicitly set completion state (overrides progress check) */
  isCompleted?: boolean;
  
  /** Card size variant */
  size?: CardSize;
  
  /** Whether to use a compact layout */
  compact?: boolean;
  
  /** Whether to show the original title below the jungle title */
  showOriginalTitle?: boolean;
  
  /** CSS class name for additional styling */
  className?: string;
  
  /** Click handler for when the quest card is clicked */
  onClick?: (quest: QuestData) => void;
}

/**
 * Unified QuestCard component that supports both jungle and standard theme variants
 */
const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  variant = 'standard',
  progress,
  userRank = 0,
  isLocked: isLockedProp,
  isCompleted: isCompletedProp,
  size = 'md',
  compact = false,
  showOriginalTitle = false,
  className = '',
  onClick
}) => {
  const [, navigate] = useLocation();
  const isJungleTheme = variant === 'jungle';
  
  // Normalize progress value to a standard format
  let progressValue = 0;
  let progressObj: QuestProgress | undefined;
  
  if (typeof progress === 'number') {
    progressValue = progress;
  } else if (progress) {
    progressObj = progress;
    progressValue = progressObj.progressPercent || 0;
  }
  
  // Determine if quest is locked based on rank requirements
  const isLocked = isLockedProp !== undefined 
    ? isLockedProp 
    : (typeof quest.requiredRank === 'number' && userRank < quest.requiredRank);
  
  // Determine completion status
  const isCompleted = isCompletedProp !== undefined 
    ? isCompletedProp 
    : (progressObj?.completedAt !== null && progressObj?.completedAt !== undefined);
    
  const isInProgress = !isCompleted && progressValue > 0;
  
  // Get appropriate title and description based on theme
  const title = isJungleTheme 
    ? (quest.jungleTitle || quest.title) 
    : quest.title;
  
  const description = isJungleTheme 
    ? (quest.jungleDescription || quest.description) 
    : quest.description;
  
  // Get zone color based on category (simplified color mapping)
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      finance: '#22c55e',
      career: '#3b82f6',
      wellness: '#a855f7',
      learning: '#f97316',
      emergency: '#ef4444',
      fitness: '#06b6d4',
      cooking: '#f59e0b',
    };
    
    return categoryColors[category.toLowerCase()] || '#6366f1';
  };
  
  const zoneColor = getCategoryColor(quest.category);
  
  // Handle click on the quest card
  const handleClick = () => {
    if (isLocked) return;
    
    if (onClick) {
      onClick(quest);
    } else {
      // Navigate to the quest page
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

  // Determine status label and color
  let statusLabel = '';
  let statusColor = '';
  
  if (isLocked) {
    statusLabel = 'Locked';
    statusColor = 'bg-gray-500';
  } else if (isCompleted) {
    statusLabel = isJungleTheme ? 'Quest Completed' : 'Completed';
    statusColor = isJungleTheme ? 'bg-[#94C973]' : 'bg-green-500';
  } else if (isInProgress) {
    statusLabel = isJungleTheme ? 'Expedition Underway' : 'In Progress';
    statusColor = isJungleTheme ? 'bg-amber-500' : 'bg-blue-500';
  }
  
  // JUNGLE THEME STYLES
  if (isJungleTheme) {
    return (
      <Card className={cn(
        cardSizeStyles[size],
        'border-2 overflow-hidden',
        isLocked 
          ? 'border-gray-600 bg-[#162E26]/60 opacity-75'
          : isCompleted
            ? 'border-[#94C973] bg-[#1E4A3D]'
            : `border-[${zoneColor}] bg-[#162E26]`,
        isUnlocked && !isCompleted ? 'hover:shadow-md' : '',
        'transition-all duration-300',
        className
      )}>
        <CardHeader className={cn(
          compact ? 'px-3 py-2' : 'px-4 py-3',
          isUnlocked ? 'border-b border-[#94C973]/30' : 'border-b border-gray-700'
        )}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn(
                'font-medium',
                compact ? 'text-base' : 'text-lg',
                isCompleted ? 'text-[#94C973]' : 
                  isUnlocked ? `text-[${zoneColor}]` : 'text-gray-400'
              )}>
                {title}
              </h3>
              
              {!compact && (
                <p className="text-sm text-[#94C973]/80 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            
            {/* Difficulty indicator */}
            {quest.difficulty && !compact && (
              <Badge 
                variant="outline" 
                className={cn(
                  isUnlocked 
                    ? `border-[${zoneColor}]/50 text-[${zoneColor}]` 
                    : 'border-gray-600 text-gray-400'
                )}
              >
                <Target className="h-3 w-3 mr-1" />
                {Array(quest.difficulty).fill('•').join('')}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className={compact ? 'p-3 pt-2' : 'p-4 pt-3'}>
          {/* Original title (if showing in jungle mode) */}
          {showOriginalTitle && quest.originalTitle && (
            <div className="text-xs text-gray-400 mb-2">
              Original: {quest.originalTitle}
            </div>
          )}
          
          {/* Quest metadata */}
          <div className="flex items-center justify-between text-xs text-[#94C973]/80 mb-2">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTime(quest.estimatedTime)}</span>
            </div>
            
            {quest.category && (
              <div className="flex items-center">
                <span className="mr-1">Zone:</span>
                <span 
                  className="font-medium" 
                  style={{ color: isUnlocked ? zoneColor : 'currentColor' }}
                >
                  {quest.category}
                </span>
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          {isUnlocked && (
            <div className="mt-2">
              <Progress 
                value={isCompleted ? 100 : progressValue} 
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
                  ) : progressValue > 0 ? (
                    <span className="text-[#94C973]">{progressValue}% complete</span>
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
          {isLocked && quest.requiredRank !== undefined && (
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
              disabled={isLocked}
              onClick={handleClick}
              className={cn(
                isCompleted 
                  ? 'bg-[#94C973] text-[#162E26] hover:bg-[#94C973]/90'
                  : isUnlocked 
                    ? `bg-[${zoneColor}] hover:bg-[${zoneColor}]/90 text-[#162E26]` 
                    : 'bg-gray-600 text-gray-300'
              )}
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
  }
  
  // STANDARD THEME STYLES
  return (
    <Card 
      className={cn(
        cardSizeStyles[size],
        'overflow-hidden border transition-shadow',
        isLocked 
          ? 'opacity-70 border-gray-200 bg-gray-50'
          : isCompleted 
            ? 'border-green-200 bg-green-50' 
            : 'border-gray-200 bg-white hover:shadow-md',
        className
      )}
      onClick={isLocked ? undefined : handleClick}
    >
      {/* Status badge */}
      {statusLabel && (
        <div className="px-4 pt-4 flex justify-between items-center">
          <span className={`${statusColor} text-white text-xs px-2 py-1 rounded-full`}>
            {statusLabel}
          </span>
          
          {isInProgress && (
            <span className="text-xs text-gray-500">
              {progressValue}% complete
            </span>
          )}
        </div>
      )}
      
      <CardHeader className="pt-3 pb-2">
        <h3 className="text-lg font-medium text-gray-800">
          {quest.title}
        </h3>
        
        <p className="text-gray-600 text-sm mt-1">
          {quest.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Quest metadata */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Est. time: {formatTime(quest.estimatedTime)}
          </span>
          
          {quest.difficulty && (
            <span className="flex items-center">
              <Target className="h-3 w-3 mr-1" />
              Difficulty: {
                '●'.repeat(quest.difficulty) + '○'.repeat(5 - quest.difficulty)
              }
            </span>
          )}
        </div>
        
        {/* Progress bar (if in progress) */}
        {isInProgress && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        )}
        
        {/* Locked message */}
        {isLocked && quest.requiredRank !== undefined && (
          <div className="mt-3 border-t border-gray-200 pt-2 text-xs text-gray-500 flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            Locked until rank: {quest.requiredRank}
          </div>
        )}
      </CardContent>
      
      {!compact && (
        <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button
            variant={isCompleted ? "success" : "default"}
            size="sm"
            disabled={isLocked}
            onClick={isLocked ? undefined : handleClick}
            className={isLocked ? "opacity-50" : ""}
          >
            {isCompleted ? (
              <>
                Review
                <BookOpen className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Start
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuestCard;