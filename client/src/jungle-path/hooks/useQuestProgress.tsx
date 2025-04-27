import { useState, useEffect, useMemo } from 'react';
import { Achievement, UserArcadeProgress, AchievementCategory } from '@/shared/arcade-schema';
import { transformToJungleQuests, JungleQuest } from '../data/quests';
import { getQuestPathSequence } from '../data/quests';

/**
 * Hook for managing quest progression, filtering, and recommendations
 */
export const useQuestProgress = (
  achievements: Achievement[],
  userProgress: UserArcadeProgress,
  category?: AchievementCategory
) => {
  // Transform achievements to jungle quests
  const allJungleQuests = useMemo(() => 
    transformToJungleQuests(achievements),
    [achievements]
  );
  
  // Filter by category if specified
  const categoryQuests = useMemo(() => 
    category 
      ? allJungleQuests.filter(q => q.category === category)
      : allJungleQuests,
    [allJungleQuests, category]
  );
  
  // Get user achievement progress
  const questProgress = userProgress.achievements;
  
  // Calculate zone progress percentages
  const zoneProgress = useMemo(() => {
    const progressByZone: Record<AchievementCategory, number> = {
      finance: 0,
      career: 0,
      wellness: 0,
      fitness: 0,
      learning: 0,
      emergency: 0,
      general: 0
    };
    
    // Group quests by zone
    const questsByZone: Record<AchievementCategory, JungleQuest[]> = {};
    
    allJungleQuests.forEach(quest => {
      const category = quest.category as AchievementCategory;
      if (!questsByZone[category]) {
        questsByZone[category] = [];
      }
      questsByZone[category].push(quest);
    });
    
    // Calculate progress for each zone
    Object.entries(questsByZone).forEach(([zone, zoneQuests]) => {
      if (zoneQuests.length === 0) return;
      
      let totalProgress = 0;
      let totalQuests = zoneQuests.length;
      
      zoneQuests.forEach(quest => {
        const userAchievement = questProgress[quest.id];
        if (userAchievement) {
          totalProgress += userAchievement.progress;
        }
      });
      
      progressByZone[zone as AchievementCategory] = Math.round(totalProgress / totalQuests);
    });
    
    return progressByZone;
  }, [allJungleQuests, questProgress]);
  
  // Get next recommended quests based on user progress
  const recommendedQuests = useMemo(() => {
    // First get completed quests
    const completedQuestIds = Object.entries(questProgress)
      .filter(([_, data]) => data.unlockedAt !== null)
      .map(([id]) => id);
    
    // Find quests that aren't complete but prerequisites are met
    return allJungleQuests.filter(quest => {
      // Skip if already completed
      if (completedQuestIds.includes(quest.id)) return false;
      
      // Check if prerequisites are met
      const prerequisitesMet = quest.prerequisiteQuests.every(
        prereqId => completedQuestIds.includes(prereqId)
      );
      
      return prerequisitesMet;
    });
  }, [allJungleQuests, questProgress]);
  
  // Generate quest path (sequence) for visualization
  const questPathSequence = useMemo(() => 
    getQuestPathSequence(categoryQuests),
    [categoryQuests]
  );
  
  // Get related quests (those sharing prerequisites or depended on by current quests)
  const getRelatedQuests = (questId: string) => {
    // Find quests that depend on this quest
    const dependentQuests = allJungleQuests.filter(
      q => q.prerequisiteQuests.includes(questId)
    );
    
    // Find the quest
    const quest = allJungleQuests.find(q => q.id === questId);
    if (!quest) return [];
    
    // Find quests that share prerequisites with this quest
    const sharedPrereqQuests = allJungleQuests.filter(
      q => q.id !== questId && 
           q.prerequisiteQuests.some(prereq => quest.prerequisiteQuests.includes(prereq))
    );
    
    // Combine and deduplicate
    const relatedIds = new Set([
      ...dependentQuests.map(q => q.id),
      ...sharedPrereqQuests.map(q => q.id),
      ...quest.prerequisiteQuests
    ]);
    
    return allJungleQuests.filter(q => relatedIds.has(q.id));
  };
  
  return {
    jungleQuests: categoryQuests,
    allJungleQuests,
    questProgress,
    zoneProgress,
    recommendedQuests,
    questPathSequence,
    getRelatedQuests
  };
};

export default useQuestProgress;