import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FilterIcon, Info, Award, Play, Youtube } from "lucide-react";
import { useYogaProgression } from '../contexts/yoga-progression-context';
import { yogaPoses, yogaChallenges } from '../data/yoga-poses-progression';
// Using the regular pose popout component instead of the mobile version for now
import { ArrowRight } from "lucide-react";
import updatedPoses from '../data/updated_poses.json';
import posesWithPaths from '../data/poses_with_paths.json';
import yogaYoutubeIds from '../data/yoga_youtube_ids.json';
import { getYogaPoseWithDefaults } from '../lib/yoga-poses-data';
import YogaPosePopout from './yoga-pose-popout';
import { getYogaPoseVideoInfo } from '../lib/yoga-pose-thumbnails';

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
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string | null>(null);
  
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
  
  // Process the poses data with YouTube thumbnails - memoized to prevent infinite re-renders
  const processedYogaPoses = React.useMemo(() => {
    return yogaPoses.map(pose => {
      // Find matching pose in posesWithPaths for the name
      const poseWithPath = posesWithPaths.find(p => p.id === pose.id);
      
      // Get YouTube video ID for this pose
      const youtubeId = yogaYoutubeIds[pose.id as keyof typeof yogaYoutubeIds];
      
      // Determine pose level based on ID
      const poseLevel = getPoseLevel(pose.id);

      // Create YouTube thumbnail URL - using reliable thumbnail format
      const youtubeThumbUrl = youtubeId 
        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` 
        : `/images/yoga-poses/original_yoga_image.jpg`;
  
      // Construct the complete pose object
      return {
        ...pose,
        // Use YouTube thumbnail as imageUrl
        imageUrl: youtubeThumbUrl,
        // Store YouTube ID for video playback
        youtubeId: youtubeId || null,
        // Include the level in the pose data
        level: poseLevel,
        
        // Use the name from poses_with_paths if available
        ...(poseWithPath?.name && {
          name: poseWithPath.name.split('(')[0].trim(),
          sanskritName: poseWithPath.name.includes('(') 
            ? poseWithPath.name.match(/\((.*)\)/)?.[1] || pose.sanskritName 
            : pose.sanskritName
        })
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

  // Group poses by level with proper type handling
  const posesByLevel = filteredPoses.reduce<Record<number, any[]>>((acc, pose) => {
    const level = pose.levelRequired;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(pose);
    return acc;
  }, {});

  // Convert currentLevel from string to number for comparison
  const currentLevelNum = currentLevel === 'beginner' ? 1 : 
                         currentLevel === 'intermediate' ? 2 : 
                         currentLevel === 'advanced' ? 3 : 1;
  
  // Get current active challenges
  const availableChallenges = yogaChallenges.filter(challenge => 
    challenge.levelRequired <= currentLevelNum
  ).slice(0, 3);

  return (
    <div className="pb-16 max-w-4xl mx-auto">
      {/* iOS-style container with ultra-minimal design */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
        {/* iOS-style subtle gradient header */}
        <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        
        {/* Header Section with Apple-inspired ultra-minimal styling */}
        <div className="p-5 sm:p-6 border-b border-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-medium text-gray-800 tracking-tight">Yoga Practice</h2>
            <Badge className="bg-gray-50/80 backdrop-blur-sm text-gray-800 hover:bg-gray-100 border-0 shadow-sm px-3 py-1 rounded-full">
              <Award className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              Level {currentLevelNum}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 hidden sm:block">
            Explore poses suited to your level and track your progress.
          </p>
        </div>
        
        {/* Filters - iOS 17 style with SF Pro-inspired design */}
        <div className="sticky top-0 z-10 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search poses..."
                className="pl-9 rounded-full border-gray-100 bg-gray-50/60 h-10 text-sm focus:ring-1 focus:ring-blue-100 focus:border-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="sm:w-auto">
              <Tabs value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <TabsList className="bg-gray-50/60 backdrop-blur-sm p-1 rounded-full">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="beginner" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Beginner
                  </TabsTrigger>
                  <TabsTrigger 
                    value="intermediate" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Medium
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                  >
                    Advanced
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Challenges - iOS 17 style cards with minimal design */}
        {availableChallenges.length > 0 && (
          <div className="px-5 sm:px-6 py-5">
            <h3 className="text-base font-medium mb-4 text-gray-800 flex items-center">
              Active Challenges
              <Badge variant="outline" className="ml-2 bg-gray-50/60 text-xs px-2.5 py-0.5 rounded-full border-0">
                {availableChallenges.length}
              </Badge>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pb-1">
              {availableChallenges.map(challenge => (
                <div key={challenge.id} className="min-w-[240px] group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden h-full border border-gray-50 transition-all duration-200 hover:shadow-md hover:border-blue-100">
                    {/* iOS 17 style thin gradient accent */}
                    <div className="h-0.5 bg-gradient-to-r from-blue-300 to-indigo-400"></div>
                    <div className="p-4">
                      <div className="flex flex-col h-full">
                        <h4 className="font-medium text-sm mb-1 text-gray-800">{challenge.name}</h4>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow leading-relaxed">
                          {challenge.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-gray-50/60 backdrop-blur-sm text-xs px-2.5 py-0.5 rounded-full border-0">
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
            .map(([level, poses]: [string, any[]]) => (
              <div key={level} className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-gray-800">Level {level} Poses</h3>
                  <Badge variant="outline" className="text-xs bg-gray-50 rounded-full">
                    {poses.length} poses
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {poses.map((pose: any) => {
                    // Check if pose is unlocked
                    const isUnlocked = isPoseUnlocked ? isPoseUnlocked(pose.id) : true;
                    
                    // Get user achievement for this pose if any
                    const achievement = userProgress?.poseAchievements?.[pose.id];
                    
                    return (
                      <div key={pose.id} className="group">
                        <YogaPosePopout 
                          pose={{
                            ...pose,
                            id: pose.id,
                            name: pose.name,
                            sanskritName: pose.sanskritName,
                            difficulty: pose.difficulty,
                            description: pose.description,
                            levelRequired: pose.levelRequired,
                            imageUrl: pose.imageUrl
                          }}
                          unlocked={isUnlocked}
                          achievement={achievement ? {
                            masteryLevel: achievement.masteryLevel || 0,
                            bestScore: achievement.bestScore || 0
                          } : undefined}
                        />
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