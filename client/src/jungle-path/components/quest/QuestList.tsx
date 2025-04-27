import React, { useState, useMemo } from 'react';
import { JungleQuest } from '../../types/quest';
import QuestCard from './QuestCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getZoneByCategory, getAllZones } from '../../utils/zoneUtils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type UserAchievements = Record<string, { 
  unlockedAt: string | null;
  progress: number;
}>;

interface QuestListProps {
  quests: JungleQuest[];
  userAchievements: UserAchievements;
  userRank: number;
  onQuestClick?: (questId: string) => void;
  showFilters?: boolean;
  className?: string;
}

/**
 * QuestList displays a filterable grid of quest cards
 */
const QuestList: React.FC<QuestListProps> = ({
  quests,
  userAchievements,
  userRank,
  onQuestClick,
  showFilters = true,
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get all available zone categories
  const availableCategories = useMemo(() => {
    const categories = new Set(quests.map(quest => quest.category));
    return ['all', ...Array.from(categories)];
  }, [quests]);
  
  // Filter quests based on active category and search query
  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      // Filter by category
      if (activeCategory !== 'all' && quest.category !== activeCategory) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim() !== '') {
        const searchLower = searchQuery.toLowerCase();
        return (
          quest.jungleTitle.toLowerCase().includes(searchLower) ||
          quest.jungleDescription.toLowerCase().includes(searchLower) ||
          quest.originalTitle.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [quests, activeCategory, searchQuery]);
  
  // Handle quest card click
  const handleQuestClick = (questId: string) => {
    if (onQuestClick) {
      onQuestClick(questId);
    }
  };
  
  return (
    <div className={className}>
      {showFilters && (
        <div className="mb-4 space-y-3">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category filter */}
          <Tabs 
            value={activeCategory} 
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start">
              {availableCategories.map(category => {
                const zone = category !== 'all' 
                  ? getZoneByCategory(category) 
                  : null;
                
                return (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="flex-shrink-0"
                    style={
                      category === activeCategory && zone
                        ? { borderColor: zone.color }
                        : {}
                    }
                  >
                    {category === 'all' 
                      ? 'All Quests' 
                      : zone?.name || category.charAt(0).toUpperCase() + category.slice(1)
                    }
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      )}
      
      {filteredQuests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No quests found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map(quest => {
            const userAchievement = userAchievements[quest.id] || { unlockedAt: null, progress: 0 };
            const progress = userAchievement.progress || 0;
            const isUnlocked = userRank >= quest.requiredRank;
            const isCompleted = userAchievement.unlockedAt !== null && progress >= 100;
            
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={progress}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                onClick={() => handleQuestClick(quest.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestList;