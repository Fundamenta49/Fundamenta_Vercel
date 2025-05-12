import React from 'react';
import { useLocation } from 'wouter';
import { 
  Lock, MapPin, Award, ChevronRight, CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getRankTitle } from '../jungle-path/utils/rankCalculator';
import { useJungleTheme } from '../jungle-path/contexts/JungleThemeContext';

// Re-export the JungleZone type to avoid circular dependencies
interface JungleZone {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredRank: number;
  color: string;
  position: {
    x: number;
    y: number;
  };
  connectedZones: string[];
  icon?: string;
  backgroundImage?: string;
  metadata?: Record<string, any>;
}

interface ZoneCardProps {
  /** Zone data to display */
  zone: JungleZone;
  
  /** Theme variant for the card */
  variant?: 'jungle' | 'standard';
  
  /** Progress percentage (0-100) */
  progress: number;
  
  /** Whether this zone is unlocked for the user */
  isUnlocked: boolean;
  
  /** Total quests in this zone */
  questCount: number;
  
  /** Number of completed quests in this zone */
  completedQuests: number;
  
  /** CSS class name for additional styling */
  className?: string;
  
  /** Whether to use compact styling (for the jungle theme) */
  compact?: boolean;
  
  /** Click handler for when the zone card is clicked */
  onClick?: () => void;
}

/**
 * Unified ZoneCard component that supports both jungle and standard theme variants
 */
const ZoneCard: React.FC<ZoneCardProps> = ({
  zone,
  variant = 'standard',
  progress,
  isUnlocked,
  questCount,
  completedQuests,
  className = '',
  compact = false,
  onClick
}) => {
  const [, navigate] = useLocation();
  const { setLastZone, jungleProgress } = useJungleTheme?.() || { setLastZone: () => {}, jungleProgress: { rank: 0 } };
  
  // Determine if we're using the jungle theme
  const isJungleTheme = variant === 'jungle';
  
  // Check if zone is fully completed
  const isCompleted = questCount > 0 && completedQuests === questCount;
  
  // Function to handle zone selection
  const handleZoneClick = () => {
    if (isUnlocked) {
      if (isJungleTheme) {
        // Update last selected zone in context for jungle theme
        setLastZone(zone.id);
        // Navigate to zone page
        navigate(`/learning/zones/${zone.id}`);
      }
      
      // Call the provided onClick handler if it exists
      onClick?.();
    }
  };
  
  // JUNGLE THEME VARIANT
  if (isJungleTheme) {
    return (
      <Card className={cn(
        "border-2 overflow-hidden",
        isUnlocked 
          ? `border-[${zone.color}] hover:shadow-md hover:shadow-[${zone.color}]/20` 
          : 'border-gray-500 opacity-75',
        isCompleted ? 'bg-[#1E4A3D]' : 'bg-[#162E26]',
        "transition-all duration-300",
        className
      )}>
        <CardHeader className={cn(
          "pb-2",
          compact ? 'px-3 pt-3' : 'px-4 pt-4',
          isCompleted ? 'border-b border-[#94C973]/30' : 'border-b border-gray-700'
        )}>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: isUnlocked ? zone.color : '#374151' }}
              >
                {isUnlocked ? (
                  <MapPin className="h-4 w-4 text-[#1E4A3D]" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-300" />
                )}
              </div>
              
              <div>
                <h3 className={cn(
                  "font-medium",
                  compact ? 'text-base' : 'text-lg',
                  isUnlocked ? `text-[${zone.color}]` : 'text-gray-400'
                )}>
                  {zone.name}
                </h3>
                
                {!compact && (
                  <p className="text-sm text-[#94C973]/80 mt-0.5">
                    {zone.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Required rank badge */}
            {zone.requiredRank > 0 && (
              <Badge 
                variant="outline" 
                className={cn(
                  isUnlocked 
                    ? 'border-[#94C973]/50 text-[#94C973]' 
                    : 'border-gray-600 text-gray-400'
                )}
              >
                <Award className="h-3 w-3 mr-1" />
                {getRankTitle(zone.requiredRank)}
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
                "--progress-foreground": isUnlocked ? zone.color : '#4B5563'
              } as React.CSSProperties} 
            />
          </div>
          
          {/* XP requirement warning if needed */}
          {!isUnlocked && zone.requiredRank > jungleProgress.rank && (
            <div className="text-xs text-amber-300/80 mt-2 flex items-center">
              <Award className="h-3 w-3 mr-1" />
              <span>
                Requires {getRankTitle(zone.requiredRank)} Rank ({zone.requiredRank * 100} XP)
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
              disabled={!isUnlocked}
              onClick={handleZoneClick}
              className={cn(
                isUnlocked 
                  ? `bg-[${zone.color}] hover:bg-[${zone.color}]/90 text-[#1E4A3D]` 
                  : 'bg-gray-600 text-gray-300'
              )}
            >
              {isUnlocked ? (
                <>
                  Explore Zone
                  <ChevronRight className="h-4 w-4 ml-1" />
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
  
  // STANDARD THEME VARIANT
  return (
    <Card 
      className={cn(
        "overflow-hidden",
        isUnlocked ? 'hover:shadow-md cursor-pointer' : 'opacity-80',
        className
      )}
      onClick={() => isUnlocked && handleZoneClick()}
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