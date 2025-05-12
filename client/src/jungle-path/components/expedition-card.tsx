import React from 'react';
import { useLocation } from 'wouter';
import { 
  Calendar, GraduationCap, Award, BookOpen, Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JungleQuest } from '../types/quest';
import { useJungleTheme } from '../contexts/JungleThemeContext';
import { getZoneByCategory } from '../utils/zoneUtils';

interface ExpeditionCardProps {
  /** List of completed quests to display */
  completedQuests: JungleQuest[];
  
  /** Optional title for the expedition */
  expeditionTitle?: string;
  
  /** CSS class name for additional styling */
  className?: string;
  
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Card component to summarize completed quests as expeditions
 */
const ExpeditionCard: React.FC<ExpeditionCardProps> = ({
  completedQuests,
  expeditionTitle = 'Recent Expedition',
  className = '',
  onClick
}) => {
  const [, navigate] = useLocation();
  const { jungleProgress, addXP } = useJungleTheme();
  
  // Get total XP earned from quests
  const totalXpEarned = completedQuests.reduce((acc, quest) => {
    // Simple XP calculation: harder quests give more XP
    const baseXp = quest.difficulty ? quest.difficulty * 5 : 10;
    return acc + baseXp;
  }, 0);
  
  // Get categories represented in the quests
  const categories = [...new Set(completedQuests.map(quest => quest.category))];
  
  // Get completion date (use the most recent quest's completion date)
  const mostRecentDate = new Date().toLocaleDateString();
  
  // Handle view details click
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to expedition details (placeholder)
      navigate('/learning/expeditions/latest');
    }
  };
  
  return (
    <Card className={`
      border-2 border-[#94C973] bg-gradient-to-br from-[#1E4A3D] to-[#162E26]
      hover:shadow-md hover:shadow-[#94C973]/20
      ${className}
    `}>
      <CardHeader className="pb-2 border-b border-[#94C973]/30">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#94C973] flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-[#1E4A3D]" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-[#94C973]">
                {expeditionTitle}
              </h3>
              
              <div className="flex items-center mt-1 text-sm text-[#94C973]/70">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>Completed: {mostRecentDate}</span>
              </div>
            </div>
          </div>
          
          <Badge 
            className="bg-[#162E26] text-[#94C973] border border-[#94C973]"
          >
            <Award className="h-3.5 w-3.5 mr-1.5" />
            {totalXpEarned} XP Earned
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Quest categories */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-[#94C973] mb-2">Explored Zones</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const zone = getZoneByCategory(category);
              return (
                <Badge 
                  key={category}
                  className="bg-[#162E26] text-white border-none"
                  style={{ color: zone?.color || '#94C973' }}
                >
                  {zone?.name || category}
                </Badge>
              );
            })}
          </div>
        </div>
        
        {/* Quest list */}
        <div>
          <h4 className="text-sm font-medium text-[#94C973] mb-2">Achievements</h4>
          <ul className="space-y-2">
            {completedQuests.slice(0, 3).map(quest => (
              <li key={quest.id} className="flex items-start">
                <Sparkles className="h-4 w-4 text-[#E6B933] mr-2 mt-0.5" />
                <span className="text-sm text-white">
                  {quest.jungleTitle}
                </span>
              </li>
            ))}
            
            {completedQuests.length > 3 && (
              <li className="text-sm text-[#94C973]/70 ml-6">
                + {completedQuests.length - 3} more achievements
              </li>
            )}
          </ul>
        </div>
        
        {/* View details button */}
        <Button
          className="w-full mt-4 bg-[#94C973] hover:bg-[#94C973]/90 text-[#1E4A3D]"
          onClick={handleClick}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Expedition Journal
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExpeditionCard;