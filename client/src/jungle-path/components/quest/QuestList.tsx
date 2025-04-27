import React, { useState } from 'react';
import { AchievementCategory } from '@/shared/arcade-schema';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  FilterX, 
  Search, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Check, 
  Clock3 
} from 'lucide-react';
import QuestCard from './QuestCard';
import { JungleQuest } from '../../data/quests';
import { ZONE_NAMES } from '../../utils/zoneUtils';

interface QuestListProps {
  quests: JungleQuest[];
  userAchievements: Record<string, { unlockedAt: Date | null, progress: number }>;
  userRank: number;
  maxColumns?: 1 | 2 | 3 | 4;
  showFilters?: boolean;
  className?: string;
}

type SortOption = 'newest' | 'difficulty' | 'points' | 'time';
type FilterOption = 'all' | 'inProgress' | 'completed' | 'locked' | 'unlocked';

/**
 * Displays a filterable, sortable grid of jungle quests
 */
const QuestList: React.FC<QuestListProps> = ({
  quests,
  userAchievements,
  userRank,
  maxColumns = 3,
  showFilters = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeZone, setActiveZone] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  
  // Extract all unique zones from quests
  const zones = ['all', ...new Set(quests.map(q => q.category))];
  
  // Filter quests by search, zone, and status
  const filteredQuests = quests.filter(quest => {
    // Check search term
    const matchesSearch = searchTerm === '' || 
      quest.jungleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.jungleDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check zone
    const matchesZone = activeZone === 'all' || quest.category === activeZone;
    
    // Check status filter
    const userAchievement = userAchievements[quest.id];
    const isCompleted = userAchievement?.unlockedAt !== null;
    const isInProgress = !isCompleted && (userAchievement?.progress || 0) > 0;
    const isUnlocked = quest.prerequisiteQuests.every(prereqId => 
      userAchievements[prereqId]?.unlockedAt !== null
    );
    
    let matchesFilter = true;
    switch (filterBy) {
      case 'inProgress':
        matchesFilter = isInProgress;
        break;
      case 'completed':
        matchesFilter = isCompleted;
        break;
      case 'locked':
        matchesFilter = !isUnlocked;
        break;
      case 'unlocked':
        matchesFilter = isUnlocked && !isCompleted;
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesZone && matchesFilter;
  });
  
  // Sort filtered quests
  const sortedQuests = [...filteredQuests].sort((a, b) => {
    switch (sortBy) {
      case 'difficulty':
        const difficultyOrder = {
          'beginner': 1,
          'explorer': 2,
          'pathfinder': 3,
          'master': 4,
          'legendary': 5
        };
        return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
      case 'points':
        return b.points - a.points;
      case 'time':
        return a.estimatedTime - b.estimatedTime;
      case 'newest':
      default:
        // Newest is default, no specific sorting
        return 0;
    }
  });
  
  // Column class based on maxColumns
  const columnClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[maxColumns];
  
  return (
    <div className={`space-y-4 ${className}`}>
      {showFilters && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search quests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tabs 
              value={sortBy} 
              onValueChange={(value) => setSortBy(value as SortOption)}
              className="hidden sm:block"
            >
              <TabsList className="h-10">
                <TabsTrigger value="newest" className="text-xs px-2">
                  <Clock3 className="h-3 w-3 mr-1" />
                  Newest
                </TabsTrigger>
                <TabsTrigger value="difficulty" className="text-xs px-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Difficulty
                </TabsTrigger>
                <TabsTrigger value="points" className="text-xs px-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Points
                </TabsTrigger>
                <TabsTrigger value="time" className="text-xs px-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Time
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Tabs 
              value={activeZone} 
              onValueChange={setActiveZone}
            >
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-2">
                  All Zones
                </TabsTrigger>
                {zones.filter(z => z !== 'all').map(zone => (
                  <TabsTrigger key={zone} value={zone} className="text-xs px-2">
                    {ZONE_NAMES[zone as AchievementCategory]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2 ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-8 ${filterBy === 'inProgress' ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => setFilterBy(filterBy === 'inProgress' ? 'all' : 'inProgress')}
              >
                <Clock className="h-3 w-3 mr-1" />
                In Progress
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-8 ${filterBy === 'completed' ? 'bg-green-50 border-green-200' : ''}`}
                onClick={() => setFilterBy(filterBy === 'completed' ? 'all' : 'completed')}
              >
                <Check className="h-3 w-3 mr-1" />
                Completed
              </Button>
              {searchTerm || filterBy !== 'all' || activeZone !== 'all' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                    setActiveZone('all');
                  }}
                >
                  <FilterX className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}
      
      {sortedQuests.length > 0 ? (
        <div className={`grid ${columnClass} gap-4`}>
          {sortedQuests.map(quest => {
            const userAchievement = userAchievements[quest.id] || { unlockedAt: null, progress: 0 };
            const isCompleted = userAchievement.unlockedAt !== null;
            const progress = userAchievement.progress || 0;
            
            // Check if quest is unlocked (prerequisites met)
            const isUnlocked = quest.prerequisiteQuests.every(prereqId => 
              userAchievements[prereqId]?.unlockedAt !== null
            );
            
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={progress}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center border rounded-lg bg-gray-50">
          <p className="text-gray-500">No quests match your search or filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm('');
              setFilterBy('all');
              setActiveZone('all');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestList;