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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Yoga Practice</span>
            <Badge variant="outline" className="ml-2 flex items-center">
              <Award className="h-3.5 w-3.5 mr-1" />
              Level {currentLevelNum}
            </Badge>
          </CardTitle>
          <CardDescription>
            Explore different yoga poses and practice with AI form feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search poses..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter} className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="intermediate">Medium</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Active challenges section */}
          {availableChallenges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Active Challenges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableChallenges.map(challenge => (
                  <Card key={challenge.id} className="hover:border-primary cursor-pointer transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <h4 className="font-medium text-base mb-1">{challenge.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3 flex-grow">
                          {challenge.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{challenge.difficulty}</Badge>
                          <span className="text-xs text-muted-foreground">{challenge.durationDays} days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Render poses by level */}
          {Object.keys(posesByLevel).length > 0 ? (
            Object.entries(posesByLevel)
              .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
              .map(([level, poses]) => (
                <div key={level} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Level {level} Poses</h3>
                    <Badge variant="outline" className="text-xs flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      {poses.length} poses
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {searchTerm ? "No poses match your search. Try different keywords." : "No poses available at your level yet."}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
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