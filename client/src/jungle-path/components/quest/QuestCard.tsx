import React from 'react';
import { JungleQuest, QuestProgress } from '../../types/quest';
import { useJungleTheme } from '../../contexts/JungleThemeContext';

// Card size variants
type CardSize = 'sm' | 'md' | 'lg';

// Base styles for different card sizes
const cardSizeStyles: Record<CardSize, string> = {
  sm: 'w-full max-w-xs',
  md: 'w-full max-w-sm',
  lg: 'w-full max-w-md',
};

// Interface for the QuestCard component props
interface QuestCardProps {
  /** The quest data to display */
  quest: JungleQuest;
  
  /** Quest progress data (optional) */
  progress?: QuestProgress;
  
  /** Current user rank (for locked/unlocked state) */
  userRank: number;
  
  /** Card size variant */
  size?: CardSize;
  
  /** Whether to show the original title below the jungle title */
  showOriginalTitle?: boolean;
  
  /** Click handler for when the quest card is clicked */
  onClick?: (quest: JungleQuest) => void;
}

/**
 * Component to display a quest as a card
 */
const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  progress,
  userRank,
  size = 'md',
  showOriginalTitle = false,
  onClick,
}) => {
  // Access the jungle theme context
  const { isJungleTheme } = useJungleTheme();
  
  // Calculate if the quest is locked based on user rank
  const isLocked = typeof quest.requiredRank === 'number' && userRank < quest.requiredRank;
  
  // Calculate completion status
  const isCompleted = progress?.completedAt !== null && progress?.completedAt !== undefined;
  const isInProgress = !isCompleted && (progress?.progressPercent ?? 0) > 0;
  
  // Determine status label
  let statusLabel = '';
  let statusColor = '';
  
  if (isLocked) {
    statusLabel = 'Locked';
    statusColor = 'bg-gray-500';
  } else if (isCompleted) {
    statusLabel = isJungleTheme ? 'Quest Completed' : 'Completed';
    statusColor = 'bg-green-500';
  } else if (isInProgress) {
    statusLabel = isJungleTheme ? 'Expedition Underway' : 'In Progress';
    statusColor = 'bg-blue-500';
  }
  
  // Get card background based on completion and jungle theme status
  const getCardBackground = () => {
    if (isLocked) {
      return 'bg-gray-100 border-gray-300';
    }
    
    if (isJungleTheme) {
      if (isCompleted) {
        return 'bg-emerald-50 border-emerald-300';
      }
      return 'bg-amber-50 border-amber-300';
    }
    
    if (isCompleted) {
      return 'bg-green-50 border-green-200';
    }
    
    return 'bg-white border-gray-200';
  };
  
  // Handle card click
  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick(quest);
    }
  };
  
  return (
    <div 
      className={`
        ${cardSizeStyles[size]} 
        ${getCardBackground()}
        rounded-lg border p-4 shadow-sm transition-all duration-200
        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}
      `}
      onClick={handleClick}
    >
      {/* Status badge */}
      {statusLabel && (
        <div className="mb-3 flex justify-between items-center">
          <span className={`${statusColor} text-white text-xs px-2 py-1 rounded-full`}>
            {statusLabel}
          </span>
          
          {isInProgress && (
            <span className="text-xs text-gray-500">
              {progress?.progressPercent}% complete
            </span>
          )}
        </div>
      )}
      
      {/* Quest title */}
      <h3 className="text-lg font-medium mb-1">
        {isJungleTheme ? quest.jungleTitle : quest.originalTitle}
      </h3>
      
      {/* Original title (if showing in jungle mode) */}
      {isJungleTheme && showOriginalTitle && (
        <div className="text-xs text-gray-500 mb-2">
          Original: {quest.originalTitle}
        </div>
      )}
      
      {/* Quest description */}
      <p className="text-gray-600 text-sm mb-4">
        {isJungleTheme ? quest.jungleDescription : quest.originalDescription}
      </p>
      
      {/* Quest metadata */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          {isJungleTheme ? 'Expedition time:' : 'Est. time:'} {quest.estimatedTime} min
        </span>
        
        {quest.difficulty && (
          <span>
            {isJungleTheme ? 'Challenge:' : 'Difficulty:'} {
              '●'.repeat(quest.difficulty) + '○'.repeat(5 - quest.difficulty)
            }
          </span>
        )}
      </div>
      
      {/* Progress bar (if in progress) */}
      {isInProgress && progress && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${progress.progressPercent ?? 0}%` }}
          ></div>
        </div>
      )}
      
      {/* Locked message */}
      {isLocked && (
        <div className="mt-3 border-t border-gray-200 pt-2 text-xs text-gray-500">
          {isJungleTheme 
            ? `Requires Jungle Rank: ${(quest.requiredRank ?? 0) + 1}` 
            : `Locked until rank: ${(quest.requiredRank ?? 0) + 1}`
          }
        </div>
      )}
    </div>
  );
};

export default QuestCard;