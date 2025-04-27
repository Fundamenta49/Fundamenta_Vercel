import React, { useState } from 'react';
import { JungleThemeProvider, useJungleTheme } from '../contexts/JungleThemeContext';
import QuestList from '../components/quest/QuestList';
import QuestCard from '../components/quest/QuestCard';
import { useQuestMapper } from '../hooks/useQuestMapper';
import { JungleQuest } from '../types/quest';

// Sample learning modules (these would normally come from your API)
const SAMPLE_MODULES = [
  {
    id: 'budget-basics',
    title: 'Budget Basics',
    description: 'Learn how to create and maintain a monthly budget.',
    category: 'financial',
    estimatedTime: 30,
  },
  {
    id: 'savings-strategies',
    title: 'Savings Strategies',
    description: 'Discover effective ways to save money for future goals.',
    category: 'financial',
    estimatedTime: 45,
  },
  {
    id: 'debt-reduction',
    title: 'Debt Reduction Planning',
    description: 'Create a strategy to reduce and eliminate your debt.',
    category: 'financial',
    estimatedTime: 60,
  },
  {
    id: 'mindful-eating',
    title: 'Mindful Eating Practices',
    description: 'Develop a healthier relationship with food through mindfulness.',
    category: 'wellness',
    estimatedTime: 25,
  },
  {
    id: 'stress-management',
    title: 'Stress Management Techniques',
    description: 'Learn effective ways to manage and reduce stress in your life.',
    category: 'wellness',
    estimatedTime: 35,
  },
  {
    id: 'fitness-fundamentals',
    title: 'Fitness Fundamentals',
    description: 'Understand the basics of physical fitness and exercise.',
    category: 'fitness',
    estimatedTime: 40,
  },
  {
    id: 'career-planning',
    title: 'Career Development Planning',
    description: 'Create a roadmap for your professional growth and advancement.',
    category: 'career',
    estimatedTime: 50,
  },
];

// Sample user progress data
const SAMPLE_PROGRESS = {
  'budget-basics': {
    progressPercent: 100,
    startedAt: '2025-04-10T10:30:00Z',
    completedAt: '2025-04-10T11:15:00Z',
  },
  'savings-strategies': {
    progressPercent: 75,
    startedAt: '2025-04-15T14:00:00Z',
    completedAt: null,
  },
  'mindful-eating': {
    progressPercent: 30,
    startedAt: '2025-04-20T09:00:00Z',
    completedAt: null,
  },
};

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
  const { isJungleTheme, toggleJungleTheme } = useJungleTheme();
  
  return (
    <div className="flex items-center mb-6 p-4 bg-gray-100 rounded-lg">
      <span className="mr-3 font-medium">
        {isJungleTheme ? 'Adventure Mode Enabled' : 'Standard Mode'}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isJungleTheme}
          onChange={toggleJungleTheme}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>
  );
};

// Selected Quest Detail View
const QuestDetail: React.FC<{ quest: JungleQuest; onBack: () => void }> = ({ quest, onBack }) => {
  const { isJungleTheme } = useJungleTheme();
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <button 
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Quests
      </button>
      
      <h2 className="text-2xl font-bold mb-2">
        {isJungleTheme ? quest.jungleTitle : quest.originalTitle}
      </h2>
      
      {isJungleTheme && (
        <div className="text-sm text-gray-500 mb-4">
          Original: {quest.originalTitle}
        </div>
      )}
      
      <p className="text-gray-700 mb-6">
        {isJungleTheme ? quest.jungleDescription : quest.originalDescription}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Category</div>
          <div className="font-medium">{quest.category}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-500">Estimated Time</div>
          <div className="font-medium">{quest.estimatedTime} minutes</div>
        </div>
      </div>
      
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        {isJungleTheme ? 'Begin Your Expedition' : 'Start Learning'}
      </button>
    </div>
  );
};

// Main Demo Component
const QuestSystemDemo: React.FC = () => {
  const [selectedQuest, setSelectedQuest] = useState<JungleQuest | null>(null);
  
  // Use our quest mapper hook
  const { jungleQuests, questProgress } = useQuestMapper({
    originalModules: SAMPLE_MODULES,
    progressData: SAMPLE_PROGRESS,
  });
  
  const handleQuestClick = (quest: JungleQuest) => {
    setSelectedQuest(quest);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <ThemeToggle />
      
      <h1 className="text-3xl font-bold mb-8">
        Learning Modules
      </h1>
      
      {selectedQuest ? (
        <QuestDetail 
          quest={selectedQuest} 
          onBack={() => setSelectedQuest(null)} 
        />
      ) : (
        <QuestList
          quests={jungleQuests}
          userProgress={questProgress}
          userRank={2} // Explorer rank
          displayStyle="grid"
          onQuestClick={handleQuestClick}
          showFilter={true}
          showOriginalTitles={true}
          cardSize="md"
        />
      )}
    </div>
  );
};

// Wrapper component that provides the theme context
export const QuestSystemDemoWithProvider: React.FC = () => {
  return (
    <JungleThemeProvider defaultEnabled={false}>
      <QuestSystemDemo />
    </JungleThemeProvider>
  );
};

export default QuestSystemDemoWithProvider;