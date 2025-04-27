import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { JungleQuest } from '../../types/quest';
import { getZoneColor } from '../../utils/zoneStyler';
import { ArrowRight, Clock, Award } from 'lucide-react';

interface QuestProgressProps {
  quest: JungleQuest;
  userProgress: number; // 0-100
  nextQuests?: JungleQuest[];
  onClick?: () => void;
  onNextQuestClick?: (questId: string) => void;
  className?: string;
}

/**
 * QuestProgress shows a prominent card with the user's progress on a particular quest
 */
const QuestProgress: React.FC<QuestProgressProps> = ({
  quest,
  userProgress,
  nextQuests = [],
  onClick,
  onNextQuestClick,
  className = ''
}) => {
  const zoneColor = getZoneColor(quest.category);
  const isCompleted = userProgress >= 100;
  
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
  
  return (
    <Card className={`border-2 ${className}`} style={{ borderColor: zoneColor }}>
      <CardHeader className="pb-2" style={{ borderBottom: `1px solid ${zoneColor}20` }}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            {quest.jungleTitle}
          </CardTitle>
          
          {isCompleted && (
            <Award size={22} className="text-[#94C973]" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-4">
        <p className="text-muted-foreground mb-4">{quest.jungleDescription}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={16} className="mr-1" />
            <span>{formatTime(quest.estimatedTime)}</span>
          </div>
          
          <span className="text-sm font-medium">{userProgress}% Complete</span>
        </div>
        
        <Progress 
          value={userProgress} 
          className="h-2"
          style={{
            '--progress-foreground': isCompleted ? '#94C973' : zoneColor
          } as React.CSSProperties} 
        />
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        <Button 
          className="w-full"
          onClick={onClick}
          style={{ backgroundColor: zoneColor }}
        >
          {isCompleted 
            ? 'Review Quest' 
            : userProgress > 0 
              ? 'Continue Quest' 
              : 'Start Quest'
          }
        </Button>
        
        {isCompleted && nextQuests && nextQuests.length > 0 && (
          <div className="w-full space-y-2">
            <div className="text-sm font-medium">Continue Your Journey:</div>
            {nextQuests.map(nextQuest => (
              <Button
                key={nextQuest.id}
                variant="outline"
                size="sm"
                className="w-full flex justify-between items-center"
                onClick={() => onNextQuestClick && onNextQuestClick(nextQuest.id)}
              >
                <span className="truncate">{nextQuest.jungleTitle}</span>
                <ArrowRight size={14} />
              </Button>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuestProgress;