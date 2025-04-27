import { useState, useEffect } from 'react';
import { mapModulesToQuests } from '../utils/questMapper';
import { JungleQuest, QuestProgress } from '../types/quest';

interface UseQuestMapperProps {
  originalModules: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    estimatedTime: number;
  }>;
  progressData?: Record<string, {
    progressPercent: number;
    startedAt: string | null;
    completedAt: string | null;
  }>;
}

interface UseQuestMapperResult {
  jungleQuests: JungleQuest[];
  questProgress: Record<string, QuestProgress>;
  refreshQuests: () => void;
}

/**
 * Custom hook to map regular learning modules to jungle-themed quests
 */
export const useQuestMapper = ({ 
  originalModules, 
  progressData = {} 
}: UseQuestMapperProps): UseQuestMapperResult => {
  // State for the jungle quests and quest progress
  const [jungleQuests, setJungleQuests] = useState<JungleQuest[]>([]);
  const [questProgress, setQuestProgress] = useState<Record<string, QuestProgress>>({});
  
  // Function to refresh/regenerate the quests (useful if you want to get different random theming)
  const refreshQuests = () => {
    const { jungleQuests: newQuests, questProgress: newProgress } = mapModulesToQuests(
      originalModules, 
      progressData
    );
    
    setJungleQuests(newQuests);
    setQuestProgress(newProgress);
  };
  
  // Generate the quests on first render
  useEffect(() => {
    refreshQuests();
  }, [originalModules, JSON.stringify(progressData)]);
  
  return {
    jungleQuests,
    questProgress,
    refreshQuests
  };
};