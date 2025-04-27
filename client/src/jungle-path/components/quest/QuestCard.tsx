import React from 'react';
import { useLocation } from 'wouter';
import { Award, Trophy, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ZONE_ICONS } from '../../data/zones';
import { getZoneStyle } from '../../styles/theme';
import { useQuestMapper } from '../../utils/questMapper';
import { AchievementCategory } from '@/shared/arcade-schema';
import { JungleQuest } from '../../data/quests';

interface QuestCardProps {
  quest: JungleQuest;
  progress: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  className?: string;
  compact?: boolean;
}

/**
 * Displays a jungle-themed card for a learning quest/achievement
 */
const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  progress,
  isUnlocked,
  isCompleted,
  className = '',
  compact = false
}) => {
  const [, navigate] = useLocation();
  const category = quest.category as AchievementCategory;
  const zoneStyle = getZoneStyle(category);
  
  // Transform standard title/description to jungle theme
  const { title, description } = useQuestMapper(quest.title, quest.description, category);
  
  // Use either the transformed or pre-computed jungle title/description
  const displayTitle = quest.jungleTitle || title;
  const displayDescription = quest.jungleDescription || description;
  
  // Icon for this quest's category
  const CategoryIcon = ZONE_ICONS[category] || Trophy;
  
  // If quest is locked, show a simplified locked version
  if (!isUnlocked) {
    return (
      <Card className={`border-2 border-dashed border-gray-200 bg-gray-50 ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2 opacity-50">
              <div className="rounded-full bg-gray-100 p-1">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <CardTitle className="text-sm">Locked Expedition</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">???</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 italic">Complete prerequisite quests to unlock this expedition</p>
          <Progress value={0} className="h-1.5 mt-3" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`border-2 ${isCompleted ? 'border-green-300 bg-green-50' : zoneStyle.cardClass} ${className}`}>
      <CardHeader className={compact ? 'p-3' : 'pb-2'}>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-1 ${isCompleted ? 'bg-green-100' : zoneStyle.iconBg}`}>
              {isCompleted ? (
                <Award className="h-5 w-5 text-green-600" />
              ) : (
                <CategoryIcon className={`h-5 w-5 ${zoneStyle.textClass}`} />
              )}
            </div>
            <CardTitle className={compact ? 'text-xs' : 'text-sm'}>{displayTitle}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {quest.points} pts
          </Badge>
        </div>
      </CardHeader>
      
      {!compact && (
        <CardContent>
          <p className="text-xs text-gray-500 mb-3">{displayDescription}</p>
          <Progress 
            value={progress} 
            className={`h-1.5 ${isCompleted ? 'bg-green-200' : zoneStyle.progressClass}`} 
          />
          <div className="flex justify-between mt-3">
            <span className="text-xs text-gray-500">
              {isCompleted ? 'Completed' : `${progress}% complete`}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-7 text-xs ${isCompleted ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : zoneStyle.buttonClass}`}
              onClick={() => navigate(`/learning/courses/${category}/${quest.id}`)}
            >
              {isCompleted ? "Review Quest" : progress > 0 ? "Continue" : "Start Quest"}
            </Button>
          </div>
          
          {quest.estimatedTime && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span>Est. time: {quest.estimatedTime} min</span>
              {quest.difficulty && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {quest.difficulty}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      )}
      
      {compact && (
        <CardContent className="p-3 pt-0">
          <Progress 
            value={progress} 
            className={`h-1.5 ${isCompleted ? 'bg-green-200' : zoneStyle.progressClass}`} 
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">
              {progress}%
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-6 text-xs px-2 ${isCompleted ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : zoneStyle.buttonClass}`}
              onClick={() => navigate(`/learning/courses/${category}/${quest.id}`)}
            >
              {isCompleted ? "Review" : "Start"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default QuestCard;