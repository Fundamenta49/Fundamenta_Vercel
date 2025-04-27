import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FilterIcon, Info, Award } from "lucide-react";
import { useYogaProgression } from '../contexts/yoga-progression-context';
import { yogaPoses, yogaChallenges } from '../data/yoga-poses-progression';
// Using the regular pose popout component instead of the mobile version for now
import { ArrowRight } from "lucide-react";
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
const adaptAchievement = (achievement: any): YogaPoseAchievementAdapter => {
  return {
    masteryLevel: achievement.masteryLevel || 0,
    bestScore: achievement.bestScore || 0,
    lastPracticedDate: achievement.completionDate  // Map completionDate to lastPracticedDate
  };
};

export default function YogaGridMobile() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPoses, setFilteredPoses] = useState<any[]>([]);
  
  // Get user progression context
  const { currentLevel, isPoseUnlocked, userProgress } = useYogaProgression();

  // Get pose level from ID - helper function
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
  
  // Process the poses data with accurate image paths - memoized to prevent infinite re-renders
  const processedYogaPoses = React.useMemo(() => {
    return yogaPoses.map(pose => {
      // Find matching pose in posesWithPaths for the correct image path
      const poseWithPath = posesWithPaths.find(p => p.id === pose.id);
      
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
      
      // If pose not found in posesWithPaths, use a default path
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
    <div className="pb-16">
      {/* iOS-style container with subtle shadow */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
        {/* Elegant iOS-style gradient header */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        {/* Header Section with Apple-inspired minimal styling */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-medium text-gray-800">Yoga Practice</h2>
            <Badge className="bg-gray-50 text-gray-800 hover:bg-gray-100 border-0 shadow-sm px-3 py-1 rounded-full">
              <Award className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              Level {currentLevelNum}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 hidden sm:block">
            Explore poses suited to your level and track your progress.
          </p>
        </div>
        
        {/* Filters - iOS style with translucent effect */}
        <div className="sticky top-0 z-10 px-4 sm:px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search poses..."
                className="pl-9 rounded-xl border-gray-200 bg-gray-50/80 h-10 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="sm:w-auto">
              <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <TabsList className="bg-gray-100/80 p-1 rounded-xl">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="beginner" 
                    className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Beginner
                  </TabsTrigger>
                  <TabsTrigger 
                    value="intermediate" 
                    className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Medium
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Advanced
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Challenges - iOS-style cards with subtle gradient border */}
        {availableChallenges.length > 0 && (
          <div className="px-4 sm:px-6 py-4">
            <h3 className="text-base font-medium mb-3 text-gray-800 flex items-center">
              Active Challenges
              <Badge variant="outline" className="ml-2 bg-gray-50 text-xs px-2 py-0.5 rounded-full">
                {availableChallenges.length}
              </Badge>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-1">
              {availableChallenges.map(challenge => (
                <div key={challenge.id} className="min-w-[240px] group">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-blue-200">
                    {/* Small gradient accent at top of each card */}
                    <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    <div className="p-4">
                      <div className="flex flex-col h-full">
                        <h4 className="font-medium text-sm mb-1">{challenge.name}</h4>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow">
                          {challenge.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-gray-50 text-xs px-2.5 py-0.5 rounded-full">
                            {challenge.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-400">{challenge.durationDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Poses by level - Clean modern iOS-style cards */}
        {Object.keys(posesByLevel).length > 0 ? (
          Object.entries(posesByLevel)
            .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
            .map(([level, poses]) => (
              <div key={level} className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-gray-800">Level {level} Poses</h3>
                  <Badge variant="outline" className="text-xs bg-gray-50 rounded-full">
                    {poses.length} poses
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {poses.map(pose => {
                    // Check if pose is unlocked
                    const isUnlocked = isPoseUnlocked ? isPoseUnlocked(pose.id) : true;
                    
                    // Get user achievement for this pose if any
                    const achievement = userProgress?.poseAchievements?.[pose.id];
                    
                    return (
                      <div key={pose.id} className="group">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
                          <div className="aspect-square relative overflow-hidden">
                            {pose.imageUrl && (
                              <img 
                                src={pose.imageUrl} 
                                alt={pose.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                            
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-white text-center p-2">
                                  <Info className="h-8 w-8 mx-auto mb-1" />
                                  <p className="text-sm font-medium">Complete level {pose.levelRequired - 1} first</p>
                                </div>
                              </div>
                            )}
                            
                            {achievement && achievement.masteryLevel > 0 && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-0 shadow-sm">
                                  <Award className="h-3 w-3 mr-1 text-amber-500" />
                                  {achievement.masteryLevel}/5
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-3">
                            <div className="font-medium text-sm text-gray-900">{pose.name}</div>
                            {pose.sanskritName && (
                              <div className="text-xs text-gray-500 italic mb-1.5">{pose.sanskritName}</div>
                            )}
                            <div className="flex items-center justify-between mt-1.5">
                              <Badge variant="outline" className="bg-gray-50 text-xs capitalize rounded-full px-2.5">
                                {pose.difficulty}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2.5 text-xs rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                                disabled={!isUnlocked}
                              >
                                Practice <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Info className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No poses found</h3>
              <p className="text-gray-500 max-w-md">
                {searchTerm ? "No poses match your search. Try different keywords." : "No poses available at your level yet."}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}