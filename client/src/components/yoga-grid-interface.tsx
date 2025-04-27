import React, { useState, useEffect, useMemo } from 'react';
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

  // Process the poses data with accurate image paths from poses_with_paths.json - using useMemo
  const processedYogaPoses = useMemo(() => {
    return yogaPoses.map(pose => {
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
  }, []);
  
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
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
        {/* iOS-style gradient header bar - made more vibrant */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <CardHeader className="p-4 sm:p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Yoga Practice
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">
                Explore poses suited to your level and advance your journey.
              </CardDescription>
            </div>
            <Badge className="px-3 py-1 text-sm flex items-center bg-blue-50 text-blue-700 rounded-full border-0 shadow-sm">
              <Award className="h-4 w-4 mr-1.5" strokeWidth={2} />
              Level {currentLevelNum}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 bg-gray-50">
          {/* iOS-style search and filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              {/* Stylish search field with subtle shadow */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search yoga poses..."
                  className="pl-10 border border-gray-200 rounded-full h-10 text-sm focus:ring-blue-200 focus:border-blue-300 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* iOS-style pill filters */}
              <div className="w-full overflow-x-auto hide-scrollbar">
                <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <TabsList className="h-10 bg-gray-100 p-1 rounded-full w-full inline-flex">
                    <TabsTrigger 
                      value="all" 
                      className="rounded-full text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm flex-1 min-w-[70px]"
                    >
                      All Poses
                    </TabsTrigger>
                    <TabsTrigger 
                      value="beginner" 
                      className="rounded-full text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm flex-1 min-w-[80px]"
                    >
                      Beginner
                    </TabsTrigger>
                    <TabsTrigger 
                      value="intermediate" 
                      className="rounded-full text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm flex-1 min-w-[80px]"
                    >
                      Medium
                    </TabsTrigger>
                    <TabsTrigger 
                      value="advanced" 
                      className="rounded-full text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm flex-1 min-w-[80px]"
                    >
                      Advanced
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Active challenges section - iOS-inspired design */}
          {availableChallenges.length > 0 && (
            <div className="mb-6">
              {/* iOS-style section header with styled title */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-medium text-gray-800 flex items-center">
                  <span>Active Challenges</span>
                  <Badge className="ml-2 text-xs bg-blue-100 text-blue-700 border-0 rounded-full px-2">
                    {availableChallenges.length}
                  </Badge>
                </h3>
              </div>
              
              {/* Apple-style scrollable cards on mobile, grid on larger screens */}
              <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto pb-3 -mx-3 sm:mx-0 px-3 sm:px-0 hide-scrollbar">
                {availableChallenges.map(challenge => (
                  <div key={challenge.id} className="min-w-[240px] sm:min-w-0 flex-shrink-0 sm:flex-shrink-initial">
                    <div className="bg-white rounded-2xl shadow-sm h-full hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] overflow-hidden border-0">
                      {/* Card with visual header bar showing difficulty */}
                      <div className={`h-1.5 ${
                        challenge.difficulty === 'beginner' ? 'bg-green-400' : 
                        challenge.difficulty === 'intermediate' ? 'bg-blue-400' : 
                        'bg-purple-400'
                      }`} />
                      
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{challenge.name}</h4>
                          <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 border-0 rounded-full">
                            {challenge.durationDays}d
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-grow">
                          {challenge.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs px-2 py-1 rounded-full ${
                            challenge.difficulty === 'beginner' ? 'bg-green-50 text-green-700' : 
                            challenge.difficulty === 'intermediate' ? 'bg-blue-50 text-blue-700' : 
                            'bg-purple-50 text-purple-700'
                          } border-0`}>
                            {challenge.difficulty}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                            Start
                          </Button>
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
                <div key={level} className="mb-6 sm:mb-8">
                  {/* iOS-style section header with pill badge */}
                  <div className="flex flex-wrap items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 flex items-center">
                      <span>Level {level} Poses</span>
                      <Badge className="ml-2 text-xs bg-gray-100 text-gray-700 border-0 rounded-full px-2">
                        {poses.length}
                      </Badge>
                    </h3>
                  </div>
                  
                  {/* Apple-inspired grid with larger thumbnails */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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