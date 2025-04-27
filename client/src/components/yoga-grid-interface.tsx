import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FilterIcon, Info, Award } from "lucide-react";
import { useYogaProgression, PoseDifficulty, PoseAchievement } from '../contexts/yoga-progression-context';
import { yogaPoses, yogaChallenges } from '../data/yoga-poses-progression';
import YogaPosePopout from './yoga-pose-popout';
import updatedPoses from '../data/updated_poses.json';
import posesWithPaths from '../data/poses_with_paths.json';
import { getYogaPoseWithDefaults } from '../lib/yoga-poses-data';

// Create an adapter interface to handle type discrepancies
interface YogaPoseAchievementAdapter {
  masteryLevel: number;
  bestScore: number;
  lastPracticedDate?: string;
}

// Helper function to convert PoseAchievement to our adapter format
const adaptAchievement = (achievement: PoseAchievement): YogaPoseAchievementAdapter => {
  return {
    masteryLevel: achievement.masteryLevel || 0,
    bestScore: achievement.bestScore || 0,
    lastPracticedDate: achievement.completionDate  // Map completionDate to lastPracticedDate
  };
};

export default function YogaGridInterface() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPoses, setFilteredPoses] = useState(yogaPoses);
  
  // Get user progression context
  const { currentLevel, isPoseUnlocked, userProgress } = useYogaProgression();

  // Process the poses data with accurate image paths from poses_with_paths.json - simplified approach
  const processedYogaPoses = yogaPoses.map(pose => {
    // Find matching pose in posesWithPaths for the correct image path
    const poseWithPath = posesWithPaths.find(p => p.id === pose.id);
    
    // Get the pose level from our mapping function
    const getPoseLevel = (poseId: string): number => {
      // Level 1 poses (beginner basics)
      if (['mountain', 'child', 'corpse'].includes(poseId)) return 1;
      
      // Level 2 poses (beginner progression)
      if (['downward_dog', 'cat_cow', 'forward_fold'].includes(poseId)) return 2;
      
      // Level 3 poses (intermediate)
      if (['tree', 'warrior_1', 'warrior_2'].includes(poseId)) return 3;
      
      // Level 4 poses (intermediate progression)
      if (['triangle', 'chair', 'bridge'].includes(poseId)) return 4;
      
      // Level 5 poses (advanced)
      if (['half_moon', 'eagle', 'pigeon'].includes(poseId)) return 5;
      
      // Level 6 poses (expert)
      if (['crow', 'side_plank', 'boat'].includes(poseId)) return 6;
      
      // Default to level 1 if unknown
      return 1;
    };
    
    // Determine pose level based on ID
    const poseLevel = getPoseLevel(pose.id);

    // If we found this pose in posesWithPaths, use that exact image path
    if (poseWithPath && poseWithPath.filename) {
      // Construct the complete pose object with the correct image path
      return {
        ...pose,
        // Use the exact path from poses_with_paths.json
        imageUrl: poseWithPath.filename,
        
        // Include the level in the pose data
        level: poseLevel,
        
        // Use the name from poses_with_paths if available
        ...(poseWithPath.name && {
          name: poseWithPath.name.split('(')[0].trim(),
          sanskritName: poseWithPath.name.includes('(') 
            ? poseWithPath.name.match(/\((.*)\)/)?.[1] || pose.sanskritName 
            : pose.sanskritName
        })
      };
    }
    
    // If pose not found in posesWithPaths (shouldn't happen), use a default path
    console.warn(`Pose ${pose.id} not found in poses_with_paths.json`);
    
    return {
      ...pose,
      // Set a default image URL based on the pose ID
      imageUrl: `/images/yoga-poses/${pose.id}.png`,
      // Include the level in the pose data
      level: poseLevel
    };
  });
  
  // Filter poses whenever filters change
  useEffect(() => {
    let result = processedYogaPoses;
    
    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter(pose => pose.difficulty === difficultyFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(pose => 
        pose.name.toLowerCase().includes(term) || 
        (pose.sanskritName ? pose.sanskritName.toLowerCase().includes(term) : false) ||
        pose.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredPoses(result);
  }, [difficultyFilter, searchTerm, processedYogaPoses]);

  // Group poses by level
  const posesByLevel = filteredPoses.reduce((acc, pose) => {
    const level = pose.levelRequired;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(pose);
    return acc;
  }, {} as Record<number, typeof yogaPoses>);

  // Convert currentLevel from string to number for comparison
  const currentLevelNum = currentLevel === 'beginner' ? 1 : 
                         currentLevel === 'intermediate' ? 2 : 
                         currentLevel === 'advanced' ? 3 : 1;
  
  // Get current active challenges
  const availableChallenges = yogaChallenges.filter(challenge => 
    challenge.levelRequired <= currentLevelNum
  ).slice(0, 3);

  return (
    <div className="space-y-4">
      <Card className="border md:shadow-sm rounded-lg">
        <CardHeader className="p-3 sm:p-5 border-b border-gray-100">
          <CardTitle className="flex items-center justify-between text-lg font-medium text-gray-800">
            <span>Yoga Practice</span>
            <Badge className="ml-2 flex items-center bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">
              <Award className="h-3 w-3 mr-1" />
              Level {currentLevelNum}
            </Badge>
          </CardTitle>
          <CardDescription className="hidden sm:block text-sm text-gray-500">
            Explore poses suited to your level and track your progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-5">
          {/* Filters - iOS style */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search poses..."
                className="pl-9 border border-gray-200 rounded-full h-9 text-sm focus:ring-gray-300 focus:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="sm:w-auto">
              <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <TabsList className="h-9 bg-gray-100 p-1 rounded-full">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="beginner" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    Beginner
                  </TabsTrigger>
                  <TabsTrigger 
                    value="intermediate" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    Medium
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                  >
                    Advanced
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Active challenges section - iOS-style cards */}
          {availableChallenges.length > 0 && (
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2 text-gray-800">Active Challenges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-x-auto pb-1">
                {availableChallenges.map(challenge => (
                  <div key={challenge.id} className="min-w-[240px]">
                    <div className="bg-white border border-gray-200 rounded-xl p-3 h-full hover:border-gray-300 transition-colors">
                      <div className="flex flex-col h-full">
                        <h4 className="font-medium text-sm mb-1">{challenge.name}</h4>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2 flex-grow">
                          {challenge.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">
                            {challenge.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-400">{challenge.durationDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Render poses by level - iOS style */}
          {Object.keys(posesByLevel).length > 0 ? (
            Object.entries(posesByLevel)
              .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
              .map(([level, poses]) => (
                <div key={level} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-800">Level {level} Poses</h3>
                    <Badge className="text-xs bg-transparent border border-gray-200 text-gray-600">
                      <Info className="h-3 w-3 mr-1" />
                      {poses.length} poses
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {poses.map(pose => {
                      // Check if pose is unlocked
                      const isUnlocked = isPoseUnlocked ? isPoseUnlocked(pose.id) : true;
                      
                      // Get user achievement for this pose if any
                      const achievement = userProgress?.poseAchievements?.[pose.id];
                      
                      return (
                        <YogaPosePopout 
                          key={pose.id}
                          pose={pose}
                          unlocked={isUnlocked}
                          achievement={achievement ? {
                            masteryLevel: achievement.masteryLevel || 0,
                            bestScore: achievement.bestScore || 0,
                            lastPracticedDate: achievement.completionDate
                          } : undefined}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 px-3">
              <p className="text-gray-500">
                {searchTerm ? "No poses match your search. Try different keywords." : "No poses available at your level yet."}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-3 text-sm h-8"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}