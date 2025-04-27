import React from 'react';
import { UserRank } from '@/shared/arcade-schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import RankBadge from './RankBadge';
import { getRankDisplay } from '../../utils/rankCalculator';
import { ZONE_ICONS } from '../../data/zones';

interface RankProgressProps {
  userRank: UserRank;
  className?: string;
  compact?: boolean;
}

/**
 * Displays the user's current rank, progress to the next rank,
 * and category-specific levels in the jungle theme
 */
const RankProgress: React.FC<RankProgressProps> = ({ 
  userRank,
  className = '',
  compact = false
}) => {
  const rankDisplay = getRankDisplay(userRank);
  
  return (
    <Card className={`${rankDisplay.style.card} ${className}`}>
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className={compact ? 'text-lg' : 'text-xl'}>
              {rankDisplay.rank.title}
            </CardTitle>
            <CardDescription>
              Level {userRank.level}
            </CardDescription>
          </div>
          <RankBadge 
            rank={userRank.level} 
            size={compact ? 'sm' : 'md'} 
          />
        </div>
      </CardHeader>
      <CardContent className={compact ? 'space-y-2' : 'space-y-4'}>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to {rankDisplay.nextRank.title}</span>
            <span>{rankDisplay.progress.current} / {rankDisplay.progress.required} XP</span>
          </div>
          <Progress value={rankDisplay.progress.percentage} className="h-2" />
        </div>
        
        {!compact && (
          <>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
                <span className="text-sm text-gray-500">Total Points</span>
                <span className="text-xl font-bold">{userRank.currentPoints}</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg border">
                <span className="text-sm text-gray-500">Next Level</span>
                <span className="text-xl font-bold">{rankDisplay.nextRank.pointsNeeded - userRank.currentPoints} XP</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Zone Mastery</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(userRank.categoryLevels).map(([category, level]) => {
                  const IconComponent = ZONE_ICONS[category as keyof typeof ZONE_ICONS];
                  return (
                    <div key={category} className="flex items-center gap-2 text-sm">
                      <div className="rounded-full bg-gray-100 p-1">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span>Level {level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RankProgress;