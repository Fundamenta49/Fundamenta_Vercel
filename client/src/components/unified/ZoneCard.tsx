import React from 'react';
import { LearningZone, ThemeType } from '@/data/zones-config';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, MapPin, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ZoneCardProps {
  /** Zone data to display */
  zone: LearningZone;
  
  /** Theme variant for the card */
  theme: ThemeType;
  
  /** User's current rank */
  userRank?: number;
  
  /** Progress percentage (0-100) */
  progress?: number;
  
  /** Total quests in this zone */
  questCount?: number;
  
  /** Number of completed quests in this zone */
  completedQuests?: number;
  
  /** CSS class name for additional styling */
  className?: string;
  
  /** Whether to use compact styling */
  compact?: boolean;
  
  /** Click handler for when the zone card is clicked */
  onClick: (zoneId: string) => void;
}

/**
 * Unified ZoneCard component that works with both standard and jungle themes
 */
const ZoneCard: React.FC<ZoneCardProps> = ({
  zone,
  theme,
  userRank = 0,
  progress = 0,
  questCount = 0,
  completedQuests = 0,
  className = '',
  compact = false,
  onClick
}) => {
  // Determine if the zone is locked based on user rank
  const isLocked = userRank < zone.unlockRank;
  
  // Check if zone is fully completed
  const isCompleted = questCount > 0 && completedQuests === questCount;
  
  // Get the appropriate title and description based on theme
  const title = zone.title[theme];
  const description = zone.description[theme];
  
  // Function to handle zone selection
  const handleZoneClick = () => {
    if (!isLocked) {
      onClick(zone.id);
    }
  };
  
  // Get rank title for display
  const getRankTitle = (rank: number): string => {
    const titles = ['Novice', 'Explorer', 'Pathfinder', 'Guardian', 'Master'];
    return titles[rank] || `Rank ${rank}`;
  };
  
  // JUNGLE THEME VARIANT
  if (theme === 'jungle') {
    return (
      <Card className={cn(
        "border-2 overflow-hidden transition-all duration-300",
        isLocked 
          ? 'border-gray-500 opacity-75' 
          : 'hover:shadow-md',
        isCompleted ? 'bg-[#1E4A3D]' : 'bg-[#162E26]',
        className
      )}
      onClick={handleZoneClick}
      style={{ 
        borderColor: isLocked ? undefined : zone.themeColor,
        cursor: isLocked ? 'default' : 'pointer' 
      }}>
        <CardHeader className={cn(
          "pb-2",
          compact ? 'px-3 pt-3' : 'px-4 pt-4',
          isCompleted ? 'border-b border-[#94C973]/30' : 'border-b border-gray-700'
        )}>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: isLocked ? '#374151' : zone.themeColor }}
              >
                {isLocked ? (
                  <Lock className="h-4 w-4 text-gray-300" />
                ) : (
                  <div className="h-4 w-4 text-[#1E4A3D]">
                    {zone.icon}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className={cn(
                  "font-medium",
                  compact ? 'text-base' : 'text-lg',
                  isLocked ? 'text-gray-400' : 'text-[#EBCE67]'
                )}>
                  {title}
                </h3>
                
                {!compact && (
                  <p className="text-sm text-[#94C973]/80 mt-0.5">
                    {description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Required rank badge */}
            {zone.unlockRank > 0 && (
              <Badge 
                variant="outline" 
                className={cn(
                  isLocked 
                    ? 'border-gray-600 text-gray-400' 
                    : 'border-[#94C973]/50 text-[#94C973]'
                )}
              >
                <Award className="h-3 w-3 mr-1" />
                {getRankTitle(zone.unlockRank)}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className={compact ? 'p-3 pt-2' : 'p-4 pt-3'}>
          {/* Zone progress */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94C973]">Zone Progress</span>
              <span className="text-[#94C973]">
                {completedQuests}/{questCount} quests
              </span>
            </div>
            
            <Progress 
              value={progress} 
              className="h-2 bg-[#0F1C18]"
              style={{
                "--progress-foreground": isLocked ? '#4B5563' : zone.themeColor
              } as React.CSSProperties} 
            />
          </div>
          
          {/* XP requirement warning if needed */}
          {isLocked && zone.unlockRank > userRank && (
            <div className="text-xs text-amber-300/80 mt-2 flex items-center">
              <Award className="h-3 w-3 mr-1" />
              <span>
                Requires {getRankTitle(zone.unlockRank)} Rank ({zone.unlockRank * 100} XP)
              </span>
            </div>
          )}
          
          {/* Completion indicator */}
          {isCompleted && (
            <div className="text-xs text-[#94C973] flex items-center mt-1">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Zone Complete</span>
            </div>
          )}
        </CardContent>
        
        {!compact && (
          <CardFooter className="px-4 py-3 bg-[#0F1C18]/30 flex justify-end">
            <Button 
              size="sm"
              disabled={isLocked}
              onClick={(e) => {
                e.stopPropagation();
                handleZoneClick();
              }}
              className={cn(
                isLocked 
                  ? 'bg-gray-600 text-gray-300' 
                  : 'text-[#1E4A3D]'
              )}
              style={isLocked ? {} : { backgroundColor: zone.themeColor }}
            >
              {isLocked ? (
                <>
                  Locked
                  <Lock className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Explore Zone
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
  
  // STANDARD THEME VARIANT
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all",
        isLocked ? 'opacity-80' : 'hover:shadow-md cursor-pointer',
        className
      )}
      onClick={() => !isLocked && handleZoneClick()}
    >
      <div className="h-2" style={{ backgroundColor: isLocked ? '#CBD5E1' : zone.themeColor }}></div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{title}</h3>
          
          {isLocked && (
            <Lock size={18} className="text-muted-foreground" />
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {description}
        </p>
        
        {isLocked ? (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin size={14} className="mr-1" />
            <span>Requires {getRankTitle(zone.unlockRank)}</span>
          </div>
        ) : (
          <div className="mb-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Zone Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-1.5"
              style={{
                '--progress-foreground': zone.themeColor
              } as React.CSSProperties} 
            />
            <div className="text-xs text-muted-foreground mt-1">
              {completedQuests} of {questCount} quests completed
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant={isLocked ? "outline" : "default"}
          size="sm"
          className="w-full"
          disabled={isLocked}
          style={!isLocked ? { backgroundColor: zone.themeColor } : {}}
        >
          {isLocked 
            ? 'Zone Locked'
            : isCompleted
              ? 'Zone Completed'
              : 'Explore Zone'
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZoneCard;