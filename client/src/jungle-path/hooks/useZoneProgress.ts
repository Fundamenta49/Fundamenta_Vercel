import { useMemo } from 'react';
import { JungleQuest } from '../types/quest';
import { getAllZones } from '../utils/zoneUtils';

type UserAchievements = Record<string, { 
  unlockedAt: string | null;
  progress: number;
}>;

/**
 * Hook to calculate progress for each zone based on quest completions
 */
export const useZoneProgress = (
  quests: JungleQuest[],
  userAchievements: UserAchievements
) => {
  // Calculate zone progress
  const zoneProgress = useMemo(() => {
    const progress: Record<string, number> = {};
    const zoneQuests: Record<string, JungleQuest[]> = {};
    const zones = getAllZones();
    
    // Initialize zone arrays
    zones.forEach(zone => {
      zoneQuests[zone.category] = [];
      progress[zone.category] = 0;
    });
    
    // Group quests by zone
    quests.forEach(quest => {
      if (zoneQuests[quest.category]) {
        zoneQuests[quest.category].push(quest);
      }
    });
    
    // Calculate progress for each zone
    Object.keys(zoneQuests).forEach(category => {
      const questsInZone = zoneQuests[category];
      if (questsInZone.length === 0) return;
      
      let totalProgress = 0;
      questsInZone.forEach(quest => {
        const achievement = userAchievements[quest.id];
        if (achievement) {
          totalProgress += achievement.progress || 0;
        }
      });
      
      // Average progress across all quests in the zone
      progress[category] = Math.round(totalProgress / questsInZone.length);
    });
    
    return progress;
  }, [quests, userAchievements]);
  
  // Get completed quest counts per zone
  const zoneCompletedQuests = useMemo(() => {
    const completedQuests: Record<string, number> = {};
    const zones = getAllZones();
    
    // Initialize zone counts
    zones.forEach(zone => {
      completedQuests[zone.category] = 0;
    });
    
    // Count completed quests
    quests.forEach(quest => {
      const achievement = userAchievements[quest.id];
      if (achievement && achievement.progress >= 100) {
        completedQuests[quest.category] = (completedQuests[quest.category] || 0) + 1;
      }
    });
    
    return completedQuests;
  }, [quests, userAchievements]);
  
  // Get total quest counts per zone
  const zoneTotalQuests = useMemo(() => {
    const totalQuests: Record<string, number> = {};
    
    quests.forEach(quest => {
      totalQuests[quest.category] = (totalQuests[quest.category] || 0) + 1;
    });
    
    return totalQuests;
  }, [quests]);
  
  return {
    zoneProgress,
    zoneCompletedQuests,
    zoneTotalQuests
  };
};