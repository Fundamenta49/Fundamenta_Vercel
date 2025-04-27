import React from 'react';
import { UserRank } from '../../types/rank';
import RankBadge from './RankBadge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJungleTheme } from '../../contexts/JungleThemeContext';

interface RankProgressProps {
  userRank: UserRank;
  compact?: boolean;
  className?: string;
}

/**
 * RankProgress displays the user's current rank and progress toward the next rank
 */
const RankProgress: React.FC<RankProgressProps> = ({
  userRank, 
  compact = false,
  className = ''
}) => {
  const { isJungleTheme } = useJungleTheme();
  const progressPercent = Math.round(userRank.progress * 100);
  const isMaxRank = userRank.points >= userRank.nextRankPoints;
  
  // Determine how many points are needed for the next rank
  const pointsNeeded = userRank.nextRankPoints - userRank.points;
  
  // Convert progress color based on jungle theme status
  const progressColor = isJungleTheme 
    ? userRank.color
    : "hsl(var(--primary))";
  
  if (compact) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <RankBadge userRank={userRank} size="sm" />
        <div className="flex-1">
          <div className="flex justify-between mb-1 text-sm">
            <span className="font-medium">{userRank.title}</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-2"
            style={{ 
              '--progress-foreground': progressColor 
            } as React.CSSProperties}
          />
        </div>
      </div>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Jungle Rank</span>
          <RankBadge userRank={userRank} size="md" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <h3 className="text-lg font-bold">
            {userRank.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isMaxRank 
              ? "You've reached the highest rank!" 
              : `${pointsNeeded} more points to next rank`
            }
          </p>
        </div>
        
        <Progress 
          value={progressPercent} 
          className="h-2 mb-3"
          style={{ 
            '--progress-foreground': progressColor 
          } as React.CSSProperties}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current: {userRank.points} pts</span>
          {!isMaxRank && (
            <span>Next: {userRank.nextRankPoints} pts</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankProgress;