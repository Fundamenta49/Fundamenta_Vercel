import React from 'react';
import { UserRank } from '../../types/rank';
import { JUNGLE_RANKS } from '../../utils/rankCalculator';

interface RankBadgeProps {
  userRank: UserRank;
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * RankBadge displays the user's jungle rank as a visual badge
 */
const RankBadge: React.FC<RankBadgeProps> = ({
  userRank,
  showTitle = false,
  size = 'md',
  className = ''
}) => {
  const rankData = JUNGLE_RANKS.find(rank => rank.level === userRank.level);
  
  // Determine size class
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };
  
  const sizeClass = sizeClasses[size];
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className={`rounded-full flex items-center justify-center ${sizeClass}`}
        style={{ 
          backgroundColor: rankData?.color || '#94C973',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
        }}
        aria-label={`Rank: ${rankData?.title || 'Unknown'}`}
      >
        <span className="font-bold text-white">{userRank.level}</span>
      </div>
      
      {showTitle && rankData && (
        <span className="mt-1 text-sm font-medium">{rankData.title}</span>
      )}
    </div>
  );
};

export default RankBadge;