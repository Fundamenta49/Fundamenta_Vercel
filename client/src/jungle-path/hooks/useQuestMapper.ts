import { useMemo } from 'react';
import { mapQuestToJungle } from '../utils/questMapper';

/**
 * Hook to transform regular learning modules into jungle-themed quests
 */
export const useQuestMapper = (
  modules: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    estimatedTime: number;
  }>
) => {
  // Transform modules into jungle quests
  const jungleQuests = useMemo(() => {
    return modules.map(module => mapQuestToJungle(module));
  }, [modules]);
  
  return {
    jungleQuests
  };
};