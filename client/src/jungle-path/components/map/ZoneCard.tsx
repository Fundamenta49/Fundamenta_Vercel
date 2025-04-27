import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight } from 'lucide-react';
import { ZONE_ICONS } from '../../data/zones';
import { getZoneStyle } from '../../styles/theme';
import { AchievementCategory } from '@/shared/arcade-schema';

interface ZoneCardProps {
  zone: {
    id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    requiredRank: number;
  };
  progress: number;
  isUnlocked: boolean;
  questCount: number;
  completedQuests: number;
  className?: string;
  compact?: boolean;
}

/**
 * Card component representing a zone in the jungle map
 */
const ZoneCard: React.FC<ZoneCardProps> = ({
  zone,
  progress,
  isUnlocked,
  questCount,
  completedQuests,
  className = '',
  compact = false
}) => {
  const [, navigate] = useLocation();
  const zoneStyle = getZoneStyle(zone.category);
  const ZoneIcon = ZONE_ICONS[zone.category];
  
  // If zone is locked, show locked version
  if (!isUnlocked) {
    return (
      <Card className={`border-2 border-dashed border-gray-200 bg-gray-50 ${className}`}>
        <CardContent className={`${compact ? 'p-3' : 'p-4'} flex items-center gap-3`}>
          <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-400">Locked Zone</h3>
            <p className="text-xs text-gray-400">
              Reach rank {zone.requiredRank} to unlock
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className={`border-2 ${zoneStyle.cardClass} hover:shadow-md transition-all ${className}`}
      onClick={() => !compact && navigate(`/jungle/${zone.category}`)}
    >
      <CardContent className={`${compact ? 'p-3' : 'p-4'} flex items-center gap-3`}>
        <div className={`rounded-full ${zoneStyle.iconBg} p-2 flex-shrink-0`}>
          <ZoneIcon className={`h-5 w-5 ${zoneStyle.textClass}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${zoneStyle.textClass}`}>{zone.name}</h3>
          {!compact && (
            <p className="text-xs text-gray-600 mt-1">
              {zone.description.length > 60 
                ? zone.description.substring(0, 60) + '...' 
                : zone.description}
            </p>
          )}
          <div className="mt-2 space-y-1">
            <Progress 
              value={progress} 
              className={`h-1.5 ${zoneStyle.progressClass}`} 
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{completedQuests} of {questCount} quests</span>
              <span>{progress}% complete</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {!compact && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`w-full ${zoneStyle.buttonClass}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jungle/${zone.category}`);
            }}
          >
            Explore Zone <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ZoneCard;