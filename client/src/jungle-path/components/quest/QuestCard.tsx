import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { JungleQuest } from '../../types/quest';
import { getZoneColor } from '../../utils/zoneStyler';
import { Lock, Award, MapPin, Clock } from 'lucide-react';
import { useJungleTheme } from '../../contexts/JungleThemeContext';

interface QuestCardProps {
  quest: JungleQuest;
  progress: number; // 0-100
  isUnlocked: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * QuestCard displays a learning module as a jungle-themed quest
 */
const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  progress,
  isUnlocked,
  isCompleted = false,
  onClick,
  className = ''
}) => {
  const { isJungleTheme } = useJungleTheme();
  
  // Determine the zone color for this quest
  const zoneColor = getZoneColor(quest.category);
  
  // Format estimated time
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
  
  // Determine the card title based on jungle theme
  const title = isJungleTheme ? quest.jungleTitle : quest.originalTitle;
  const description = isJungleTheme ? quest.jungleDescription : quest.originalDescription;
  
  // Card border style based on completion and unlock status
  const getBorderStyle = () => {
    if (isCompleted) return { borderColor: '#94C973' }; // Canopy Light (success)
    if (!isUnlocked) return { borderColor: '#8B8682' }; // Stone Gray (locked)
    return { borderColor: zoneColor };
  };
  
  return (
    <Card 
      className={`border-2 transition-all ${isUnlocked ? 'hover:shadow-md' : 'opacity-80'} ${className}`}
      style={getBorderStyle()}
    >
      <CardHeader 
        className="pb-2"
        style={isUnlocked ? { borderBottom: `1px solid ${zoneColor}20` } : {}}
      >
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-bold leading-tight">
            {title}
          </CardTitle>
          
          {!isUnlocked && (
            <Lock size={18} className="text-muted-foreground flex-shrink-0" />
          )}
          
          {isCompleted && (
            <Award 
              size={18} 
              className="text-[#94C973] flex-shrink-0" // Canopy Light (success)
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-3">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <MapPin size={14} />
          <span>{quest.zone.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
          
          <Clock size={14} className="ml-2" />
          <span>{formatTime(quest.estimatedTime)}</span>
        </div>
        
        {isUnlocked && (
          <Progress 
            value={progress} 
            className="h-1"
            style={{
              '--progress-foreground': isCompleted ? '#94C973' : zoneColor
            } as React.CSSProperties} 
          />
        )}
      </CardContent>
      
      <CardFooter className={isUnlocked ? 'pt-0' : 'pt-2'}>
        <Button 
          variant={isUnlocked ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={onClick}
          disabled={!isUnlocked}
          style={isUnlocked ? { backgroundColor: zoneColor } : {}}
        >
          {isCompleted
            ? 'Review Quest' 
            : isUnlocked 
              ? progress > 0 
                ? 'Continue Quest' 
                : 'Start Quest'
              : `Requires Rank ${quest.requiredRank}`
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestCard;