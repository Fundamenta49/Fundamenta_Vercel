import React from 'react';
import { Shield, Award, Medal, Crown, Star } from 'lucide-react';
import { getRankStyle } from '../../styles/theme';
import { JUNGLE_RANKS } from '../../utils/rankCalculator';

interface RankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  className?: string;
}

/**
 * Displays a jungle-themed badge for the user's current rank
 */
const RankBadge: React.FC<RankBadgeProps> = ({ 
  rank, 
  size = 'md', 
  showTitle = false,
  className = '' 
}) => {
  // Find the rank data
  const rankData = JUNGLE_RANKS.find(r => r.level === rank) || JUNGLE_RANKS[0];
  const rankStyle = getRankStyle(rankData.title);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg'
  };
  
  // Different icons for different ranks
  const RankIcon = () => {
    switch (rankData.title.toLowerCase()) {
      case 'newcomer':
        return <Shield className="h-1/2 w-1/2" />;
      case 'explorer':
        return <Award className="h-1/2 w-1/2" />;
      case 'pathfinder':
        return <Medal className="h-1/2 w-1/2" />;
      case 'trailblazer':
        return <Crown className="h-1/2 w-1/2" />;
      case 'jungle guardian':
      case 'jungle master':
      case 'ancient guide':
      case 'temple keeper':
      case 'spirit walker':
      case 'jungle legend':
        return <Star className="h-1/2 w-1/2" />;
      default:
        return <Shield className="h-1/2 w-1/2" />;
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className={`${rankStyle.badge} rounded-full flex items-center justify-center ${sizeClasses[size]} shadow-sm`}
        title={`${rankData.title} - Level ${rankData.level}`}
      >
        <div className="flex flex-col items-center justify-center">
          <RankIcon />
          <span className="font-bold text-center">{rank}</span>
        </div>
      </div>
      
      {showTitle && (
        <span className="mt-1 text-xs font-medium text-center">{rankData.title}</span>
      )}
    </div>
  );
};

export default RankBadge;