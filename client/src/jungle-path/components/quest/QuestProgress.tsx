import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flag, Award, MapPin } from 'lucide-react';
import { JungleQuest } from '../../data/quests';
import { getZoneStyle } from '../../styles/theme';
import { AchievementCategory, Achievement } from '@/shared/arcade-schema';

interface QuestProgressProps {
  quest: JungleQuest;
  userProgress: number;
  nextQuests: JungleQuest[];
  className?: string;
}

/**
 * Shows progress for a specific quest with next recommended quests
 */
const QuestProgress: React.FC<QuestProgressProps> = ({
  quest,
  userProgress,
  nextQuests,
  className = ''
}) => {
  const [, navigate] = useLocation();
  const zoneStyle = getZoneStyle(quest.category as AchievementCategory);
  const isCompleted = userProgress >= 100;
  
  return (
    <Card className={`${isCompleted ? 'border-green-300' : zoneStyle.cardClass} ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-1.5 ${isCompleted ? 'bg-green-100' : zoneStyle.iconBg}`}>
            {isCompleted ? (
              <Flag className="h-5 w-5 text-green-600" />
            ) : (
              <MapPin className={`h-5 w-5 ${zoneStyle.textClass}`} />
            )}
          </div>
          <div>
            <CardTitle className="text-base">{quest.jungleTitle}</CardTitle>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-xs">
                {quest.points} points
              </Badge>
              <Badge variant="outline" className="text-xs">
                {quest.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                ~{quest.estimatedTime} min
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Quest Progress</span>
            <span className={isCompleted ? 'text-green-600 font-medium' : ''}>
              {isCompleted ? 'Completed' : `${userProgress}%`}
            </span>
          </div>
          <Progress 
            value={userProgress} 
            className={`h-2 ${isCompleted ? 'bg-green-100' : zoneStyle.progressClass}`} 
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isCompleted ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : zoneStyle.buttonClass}`}
            onClick={() => navigate(`/learning/courses/${quest.category}/${quest.id}`)}
          >
            {isCompleted ? "Review Quest" : "Continue Quest"}
          </Button>
          
          {isCompleted && quest.rewards.companions && (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300">
              <Award className="h-3 w-3 mr-1" /> 
              Companion Unlocked
            </Badge>
          )}
        </div>
        
        {nextQuests.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Next Recommended Quests</h4>
            <div className="space-y-2">
              {nextQuests.slice(0, 2).map((nextQuest) => {
                const nextQuestZoneStyle = getZoneStyle(nextQuest.category as AchievementCategory);
                return (
                  <div 
                    key={nextQuest.id}
                    className={`p-3 border rounded-lg flex justify-between items-center ${nextQuestZoneStyle.cardClass}`}
                  >
                    <div>
                      <div className="text-sm font-medium">{nextQuest.jungleTitle}</div>
                      <div className="text-xs text-gray-500">{nextQuest.points} points</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/learning/courses/${nextQuest.category}/${nextQuest.id}`)}
                      className={nextQuestZoneStyle.buttonClass}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestProgress;