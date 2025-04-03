import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Trophy, Star, Lock, AlertCircle, Award, CheckCircle, 
  Dumbbell, Info, BarChart, BookOpen, Calendar 
} from "lucide-react";
import { yogaPoses, yogaChallenges, getPosesByLevel, getChallengesByLevel } from '../data/yoga-poses-progression';
import { 
  UserYogaProgression, 
  YogaPoseProgression, 
  YogaChallenge,
  PROGRESSION_LEVELS
} from '../../../shared/yoga-progression';

// Create a mock user progression for now - this will be replaced with actual user data from storage later
const mockUserProgression: UserYogaProgression = {
  userId: "user1",
  currentLevel: 3,
  totalXp: 250,
  streakDays: 5,
  lastPracticeDate: new Date(),
  poseAchievements: {
    "mountain": { poseId: "mountain", masteryLevel: 5, attemptsCount: 12, bestScore: 95, unlocked: true },
    "child": { poseId: "child", masteryLevel: 4, attemptsCount: 8, bestScore: 89, unlocked: true },
    "corpse": { poseId: "corpse", masteryLevel: 5, attemptsCount: 10, bestScore: 98, unlocked: true },
    "downward_dog": { poseId: "downward_dog", masteryLevel: 3, attemptsCount: 7, bestScore: 75, unlocked: true },
    "cat_cow": { poseId: "cat_cow", masteryLevel: 3, attemptsCount: 6, bestScore: 82, unlocked: true },
    "forward_fold": { poseId: "forward_fold", masteryLevel: 2, attemptsCount: 4, bestScore: 68, unlocked: true },
    "tree": { poseId: "tree", masteryLevel: 1, attemptsCount: 3, bestScore: 55, unlocked: true },
    "warrior_1": { poseId: "warrior_1", masteryLevel: 0, attemptsCount: 1, bestScore: 42, unlocked: true },
  },
  completedChallenges: ["beginner_foundations"]
};

// Function to get the next level's XP requirement
const getNextLevelXpRequirement = (currentLevel: number) => {
  const nextLevel = PROGRESSION_LEVELS.find(level => level.level === currentLevel + 1);
  return nextLevel ? nextLevel.xpRequired : PROGRESSION_LEVELS[PROGRESSION_LEVELS.length - 1].xpRequired;
};

// Function to get progress percentage to next level
const getProgressToNextLevel = (userXp: number, currentLevel: number) => {
  const currentLevelXp = PROGRESSION_LEVELS.find(level => level.level === currentLevel)?.xpRequired || 0;
  const nextLevelXp = getNextLevelXpRequirement(currentLevel);
  const xpNeeded = nextLevelXp - currentLevelXp;
  const xpProgress = userXp - currentLevelXp;
  return Math.floor((xpProgress / xpNeeded) * 100);
};

// Helper to render mastery stars
const MasteryStars = ({ level }: { level: number }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star 
          key={index} 
          size={14} 
          className={index < level ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
};

// Main component
export default function YogaProgression() {
  const [userProgress, setUserProgress] = useState<UserYogaProgression>(mockUserProgression);
  const [activeTab, setActiveTab] = useState("progress");
  
  // Calculate which poses are available based on user level
  const availablePoses = getPosesByLevel(userProgress.currentLevel);
  const availableChallenges = getChallengesByLevel(userProgress.currentLevel);
  
  // Get the user's current level details
  const currentLevelDetails = PROGRESSION_LEVELS.find(level => level.level === userProgress.currentLevel);
  const nextLevelDetails = PROGRESSION_LEVELS.find(level => level.level === userProgress.currentLevel + 1);
  const progressToNextLevel = getProgressToNextLevel(userProgress.totalXp, userProgress.currentLevel);
  
  // Group poses by difficulty
  const posesByDifficulty = {
    beginner: availablePoses.filter(pose => pose.difficulty === "beginner"),
    intermediate: availablePoses.filter(pose => pose.difficulty === "intermediate"),
    advanced: availablePoses.filter(pose => pose.difficulty === "advanced"),
    expert: availablePoses.filter(pose => pose.difficulty === "expert")
  };
  
  // Function to simulate earning XP (for demo purposes)
  const handleEarnXp = (amount: number) => {
    setUserProgress(prev => {
      const newTotalXp = prev.totalXp + amount;
      
      // Check if user should level up
      let newLevel = prev.currentLevel;
      while (newLevel < PROGRESSION_LEVELS.length && 
             newTotalXp >= getNextLevelXpRequirement(newLevel)) {
        newLevel++;
      }
      
      return {
        ...prev,
        totalXp: newTotalXp,
        currentLevel: newLevel
      };
    });
  };
  
  // Function to handle pose practice
  const handlePractice = (poseId: string) => {
    // In a real implementation, this would navigate to the YogaVision component
    // with the selected pose pre-selected for analysis
    alert(`Navigating to YogaVision practice for ${poseId}`);
  };
  
  return (
    <div className="yoga-progression space-y-6">
      {/* User Progress Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Your Yoga Journey</CardTitle>
              <CardDescription>Track your progress and growth</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">
              <Trophy size={14} className="mr-1" />
              Level {userProgress.currentLevel}: {currentLevelDetails?.title}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress to Level {userProgress.currentLevel + 1}</span>
                <span>{userProgress.totalXp} / {nextLevelDetails?.xpRequired} XP</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Streak</div>
                <div className="text-xl font-semibold flex items-center">
                  <Calendar size={18} className="mr-2 text-orange-500" />
                  {userProgress.streakDays} days
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Poses Mastered</div>
                <div className="text-xl font-semibold flex items-center">
                  <CheckCircle size={18} className="mr-2 text-green-500" />
                  {Object.values(userProgress.poseAchievements).filter(a => a.masteryLevel >= 4).length}
                </div>
              </div>
            </div>
            
            {/* Next Level Preview */}
            {nextLevelDetails && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="flex items-start">
                  <AlertCircle size={18} className="mr-2 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Next Level: {nextLevelDetails.title}</p>
                    <p className="text-sm text-blue-700">Unlocks: {nextLevelDetails.unlocks.map(id => 
                      yogaPoses.find(p => p.id === id)?.name).join(", ")}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {/* For demo purposes only */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEarnXp(10)}>
              <Dumbbell size={14} className="mr-1" /> Practice (+10 XP)
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEarnXp(50)}>
              <Award size={14} className="mr-1" /> Complete Challenge (+50 XP)
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Poses & Challenges */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="progress">Your Progress</TabsTrigger>
          <TabsTrigger value="poses">Poses</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <h3 className="text-lg font-medium">Recently Practiced Poses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(userProgress.poseAchievements)
              .sort((a, b) => {
                const poseA = yogaPoses.find(p => p.id === a[0]);
                const poseB = yogaPoses.find(p => p.id === b[0]);
                return (poseA?.name || '').localeCompare(poseB?.name || '');
              })
              .map(([poseId, achievement]) => {
                const pose = yogaPoses.find(p => p.id === poseId);
                if (!pose) return null;
                
                return (
                  <div key={poseId} className="border rounded-lg p-3 flex gap-3 items-center">
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-lg font-medium text-gray-500">
                      {pose.name.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{pose.name}</div>
                      <div className="flex items-center justify-between">
                        <MasteryStars level={achievement.masteryLevel} />
                        <div className="text-xs text-gray-500">{achievement.attemptsCount} practices</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          
          <h3 className="text-lg font-medium mt-6">Completed Challenges</h3>
          {userProgress.completedChallenges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userProgress.completedChallenges.map(challengeId => {
                const challenge = yogaChallenges.find(c => c.id === challengeId);
                if (!challenge) return null;
                
                return (
                  <div key={challengeId} className="border rounded-lg p-3">
                    <div className="font-medium">{challenge.name}</div>
                    <div className="text-sm text-gray-600">{challenge.description}</div>
                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle size={12} className="mr-1" /> Completed
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award size={36} className="mx-auto mb-2 opacity-20" />
              <p>You haven't completed any challenges yet.</p>
              <p className="text-sm">Check the Challenges tab to find one!</p>
            </div>
          )}
        </TabsContent>
        
        {/* Poses Tab */}
        <TabsContent value="poses" className="space-y-6">
          {/* Beginner Poses */}
          {posesByDifficulty.beginner.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">Beginner</Badge>
                Foundation Poses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posesByDifficulty.beginner.map(pose => {
                  const achievement = userProgress.poseAchievements[pose.id];
                  const isUnlocked = achievement?.unlocked || false;
                  
                  return (
                    <div 
                      key={pose.id} 
                      className={`border rounded-md p-4 ${isUnlocked ? 'hover:bg-gray-50' : 'opacity-75 bg-gray-50'} transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-lg mb-1">{pose.name}</div>
                        {pose.sanskritName && (
                          <div className="text-xs text-gray-500 italic">{pose.sanskritName}</div>
                        )}
                      </div>
                      <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">
                        {pose.category}
                      </div>
                      
                      {achievement && (
                        <div className="mb-2">
                          <MasteryStars level={achievement.masteryLevel} />
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mb-2">{pose.description}</p>
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handlePractice(pose.id)}
                          disabled={!isUnlocked}
                        >
                          {isUnlocked ? (
                            <>
                              <Dumbbell size={14} className="mr-1" />
                              <span>Practice with YogaVision</span>
                            </>
                          ) : (
                            <>
                              <Lock size={14} className="mr-1" />
                              <span>Locked</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Intermediate Poses */}
          {posesByDifficulty.intermediate.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Badge className="mr-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Intermediate</Badge>
                Progression Poses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posesByDifficulty.intermediate.map(pose => {
                  const achievement = userProgress.poseAchievements[pose.id];
                  const isUnlocked = achievement?.unlocked || false;
                  
                  return (
                    <div 
                      key={pose.id} 
                      className={`border rounded-md p-4 ${isUnlocked ? 'hover:bg-gray-50' : 'opacity-75 bg-gray-50'} transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-lg mb-1">{pose.name}</div>
                        {pose.sanskritName && (
                          <div className="text-xs text-gray-500 italic">{pose.sanskritName}</div>
                        )}
                      </div>
                      <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">
                        {pose.category}
                      </div>
                      
                      {achievement && (
                        <div className="mb-2">
                          <MasteryStars level={achievement.masteryLevel} />
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mb-2">{pose.description}</p>
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handlePractice(pose.id)}
                          disabled={!isUnlocked}
                        >
                          {isUnlocked ? (
                            <>
                              <Dumbbell size={14} className="mr-1" />
                              <span>Practice with YogaVision</span>
                            </>
                          ) : (
                            <>
                              <Lock size={14} className="mr-1" />
                              <span>Locked</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Advanced Poses */}
          {posesByDifficulty.advanced.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Badge className="mr-2 bg-orange-100 text-orange-800 hover:bg-orange-100">Advanced</Badge>
                Master Poses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posesByDifficulty.advanced.map(pose => {
                  const achievement = userProgress.poseAchievements[pose.id];
                  const isUnlocked = achievement?.unlocked || false;
                  
                  return (
                    <div 
                      key={pose.id} 
                      className={`border rounded-md p-4 ${isUnlocked ? 'hover:bg-gray-50' : 'opacity-75 bg-gray-50'} transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-lg mb-1">{pose.name}</div>
                        {pose.sanskritName && (
                          <div className="text-xs text-gray-500 italic">{pose.sanskritName}</div>
                        )}
                      </div>
                      <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">
                        {pose.category}
                      </div>
                      
                      {achievement && (
                        <div className="mb-2">
                          <MasteryStars level={achievement.masteryLevel} />
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mb-2">{pose.description}</p>
                      
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handlePractice(pose.id)}
                          disabled={!isUnlocked}
                        >
                          {isUnlocked ? (
                            <>
                              <Dumbbell size={14} className="mr-1" />
                              <span>Practice with YogaVision</span>
                            </>
                          ) : (
                            <>
                              <Lock size={14} className="mr-1" />
                              <span>Locked</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Expert Poses */}
          {posesByDifficulty.expert.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Badge className="mr-2 bg-red-100 text-red-800 hover:bg-red-100">Expert</Badge>
                Elite Poses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Similar structure to other difficulty levels */}
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <Alert className="bg-purple-50 border-purple-200 mb-4">
            <AlertDescription className="text-purple-800 flex items-center">
              <Info size={18} className="mr-2" />
              Complete challenges to earn XP and special badges for your profile
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableChallenges.map(challenge => {
              const isCompleted = userProgress.completedChallenges.includes(challenge.id);
              
              return (
                <Card key={challenge.id} className={isCompleted ? "border-green-200" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{challenge.name}</CardTitle>
                      <Badge className={
                        challenge.difficulty === "beginner" ? "bg-green-100 text-green-800" :
                        challenge.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800" :
                        challenge.difficulty === "advanced" ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Required Poses:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {challenge.poses.map(poseId => {
                          const pose = yogaPoses.find(p => p.id === poseId);
                          if (!pose) return null;
                          
                          const achievement = userProgress.poseAchievements[poseId];
                          const hasMastered = achievement && achievement.masteryLevel >= 3;
                          
                          return (
                            <div 
                              key={poseId} 
                              className={`text-sm p-2 rounded flex items-center
                                ${hasMastered ? 'bg-green-50 text-green-800' : 'bg-gray-50'}`}
                            >
                              {hasMastered ? (
                                <CheckCircle size={14} className="mr-1 text-green-600" />
                              ) : (
                                <AlertCircle size={14} className="mr-1 text-gray-400" />
                              )}
                              {pose.name}
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm mt-4">
                        <div className="flex items-center">
                          <BarChart size={16} className="mr-1 text-purple-500" />
                          <span>{challenge.xpReward} XP Reward</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1 text-blue-500" />
                          <span>{challenge.durationDays} day challenge</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={isCompleted ? "outline" : "default"}
                      disabled={isCompleted}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <BookOpen size={16} className="mr-2" />
                          Start Challenge
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}