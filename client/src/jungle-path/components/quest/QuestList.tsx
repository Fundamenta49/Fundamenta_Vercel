import React, { useState, useMemo } from 'react';
import { JungleQuest, QuestProgress } from '../../types/quest';
import { useJungleTheme } from '../../contexts/JungleThemeContext';
import QuestCard from '../../../components/QuestCard';

// Display style variants for the quest list
type DisplayStyle = 'grid' | 'list';

// Interface for the QuestList component props
interface QuestListProps {
  /** Array of quests to display */
  quests: JungleQuest[];
  
  /** Progress data for the quests (keyed by quest ID) */
  userProgress: Record<string, QuestProgress>;
  
  /** Current user rank (for locked/unlocked state) */
  userRank: number;
  
  /** Display style for the quests (grid or list) */
  displayStyle?: DisplayStyle;
  
  /** Whether to show original titles for quests */
  showOriginalTitles?: boolean;
  
  /** Quest card size */
  cardSize?: 'sm' | 'md' | 'lg';
  
  /** Whether to show filtering options */
  showFilter?: boolean;
  
  /** Handler for when a quest is clicked */
  onQuestClick?: (quest: JungleQuest) => void;
}

/**
 * Component to display a filterable list of quests
 */
const QuestList: React.FC<QuestListProps> = ({
  quests,
  userProgress,
  userRank,
  displayStyle = 'grid',
  showOriginalTitles = false,
  cardSize = 'md',
  showFilter = false,
  onQuestClick,
}) => {
  // Access the jungle theme context
  const { isJungleTheme } = useJungleTheme();
  
  // State for filtering
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get unique categories from quests
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>(quests.map(quest => quest.category));
    return Array.from(uniqueCategories);
  }, [quests]);
  
  // Filtered quests based on filters
  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      // Filter by category
      if (categoryFilter !== 'all' && quest.category !== categoryFilter) {
        return false;
      }
      
      // Filter by status
      if (statusFilter !== 'all') {
        const progress = userProgress[quest.id];
        const isLocked = typeof quest.requiredRank === 'number' && userRank < quest.requiredRank;
        
        if (statusFilter === 'locked' && !isLocked) {
          return false;
        }
        
        if (statusFilter === 'completed' && (!progress || !progress.completedAt)) {
          return false;
        }
        
        if (statusFilter === 'in-progress' && 
            (!progress || progress.progressPercent === 0 || progress.completedAt)) {
          return false;
        }
        
        if (statusFilter === 'available' && 
            (isLocked || (progress && progress.progressPercent > 0))) {
          return false;
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        const normalizedQuery = searchQuery.toLowerCase();
        return (
          quest.originalTitle.toLowerCase().includes(normalizedQuery) ||
          quest.jungleTitle.toLowerCase().includes(normalizedQuery) ||
          quest.originalDescription.toLowerCase().includes(normalizedQuery) ||
          quest.jungleDescription.toLowerCase().includes(normalizedQuery)
        );
      }
      
      return true;
    });
  }, [quests, categoryFilter, statusFilter, searchQuery, userProgress, userRank]);
  
  return (
    <div className="w-full">
      {/* Filtering controls */}
      {showFilter && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-3">
            {isJungleTheme ? 'Quest Finder' : 'Filter Modules'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isJungleTheme ? 'Search Expeditions' : 'Search'}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isJungleTheme ? "Enter quest name..." : "Search modules..."}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isJungleTheme ? 'Jungle Region' : 'Category'}
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isJungleTheme ? 'Quest Status' : 'Status'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="available">
                  {isJungleTheme ? 'Ready for Expedition' : 'Available'}
                </option>
                <option value="in-progress">
                  {isJungleTheme ? 'Expedition Underway' : 'In Progress'}
                </option>
                <option value="completed">
                  {isJungleTheme ? 'Quests Completed' : 'Completed'}
                </option>
                <option value="locked">
                  {isJungleTheme ? 'Path Not Yet Discovered' : 'Locked'}
                </option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Quest count summary */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredQuests.length} of {quests.length} 
          {isJungleTheme ? ' quests' : ' modules'}
        </div>
        
        {/* Display style toggle */}
        {showFilter && (
          <div className="flex space-x-2">
            <button
              onClick={() => {}}
              className={`p-1.5 rounded ${displayStyle === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => {}}
              className={`p-1.5 rounded ${displayStyle === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              title="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3" y2="6"></line>
                <line x1="3" y1="12" x2="3" y2="12"></line>
                <line x1="3" y1="18" x2="3" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* No results message */}
      {filteredQuests.length === 0 && (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {isJungleTheme ? 'No quests found in this region!' : 'No modules found'}
          </h3>
          <p className="text-gray-500">
            {isJungleTheme 
              ? 'Try searching in different jungle regions or adjusting your filters.'
              : 'Try changing your search criteria or filters.'}
          </p>
        </div>
      )}
      
      {/* Quest cards grid/list */}
      <div className={`
        ${displayStyle === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-4'
        }
      `}>
        {filteredQuests.map(quest => (
          <QuestCard
            key={quest.id}
            quest={quest}
            progress={userProgress[quest.id]}
            userRank={userRank}
            size={cardSize}
            showOriginalTitle={showOriginalTitles}
            onClick={onQuestClick}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestList;