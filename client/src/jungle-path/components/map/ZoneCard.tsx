import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { JungleZone } from '../../types/zone';
import { Lock, MapPin } from 'lucide-react';

interface ZoneCardProps {
  zone: JungleZone;
  progress: number; // 0-100
  isUnlocked: boolean;
  questCount: number;
  completedQuests: number;
  onClick?: () => void;
  className?: string;
}

/**
 * ZoneCard displays a jungle zone as a card with progress information
 */
const ZoneCard: React.FC<ZoneCardProps> = ({
  zone,
  progress,
  isUnlocked,
  questCount,
  completedQuests,
  onClick,
  className = ''
}) => {
  return (
    <Card 
      className={`overflow-hidden ${className} ${isUnlocked ? 'hover:shadow-md cursor-pointer' : 'opacity-80'}`}
      onClick={() => isUnlocked && onClick && onClick()}
    >
      <div className="h-2" style={{ backgroundColor: zone.color }}></div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{zone.name}</h3>
          
          {!isUnlocked && (
            <Lock size={18} className="text-muted-foreground" />
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {zone.description}
        </p>
        
        {isUnlocked ? (
          <div className="mb-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Zone Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-1.5"
              style={{
                '--progress-foreground': zone.color
              } as React.CSSProperties} 
            />
            <div className="text-xs text-muted-foreground mt-1">
              {completedQuests} of {questCount} quests completed
            </div>
          </div>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin size={14} className="mr-1" />
            <span>Requires Rank {zone.requiredRank}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant={isUnlocked ? "default" : "outline"}
          size="sm"
          className="w-full"
          disabled={!isUnlocked}
          style={isUnlocked ? { backgroundColor: zone.color } : {}}
        >
          {isUnlocked 
            ? completedQuests === questCount && questCount > 0
              ? 'Zone Completed'
              : 'Explore Zone'
            : 'Zone Locked'
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZoneCard;