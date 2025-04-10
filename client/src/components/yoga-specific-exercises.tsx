import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, ChevronDown, ChevronUp, Plus, ArrowRight } from "lucide-react";
import { EmbeddedYouTubePlayer } from '@/components/embedded-youtube-player';
import { searchSectionSpecificExerciseVideos, YouTubeVideo } from '@/lib/youtube-service';

// Define Exercise interface with added fields to match ExerciseDetails in active-you-enhanced
interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
  animationUrl?: string; // Adding support for instructional animations
  category?: string;
  benefits?: string[];
  tips?: string[];
}

// Define hardcoded exercise data for Yoga poses by category
const YOGA_EXERCISE_SETS = {
  beginnerPoses: [
    {
      id: "yoga1",
      name: "Downward Dog (Adho Mukha Svanasana)",
      description: "A fundamental yoga pose that stretches and strengthens the entire body.",
      muscleGroups: ["shoulders", "hamstrings", "calves", "back"],
      equipment: ["yoga mat"],
      difficulty: "beginner",
      instructions: [
        "Start on hands and knees with wrists under shoulders and knees under hips",
        "Lift knees off the floor and push hips up and back",
        "Straighten legs as much as comfortable, press heels toward the floor",
        "Create an inverted V-shape with your body",
        "Keep arms straight and shoulders away from ears",
        "Hold for 5-10 breaths"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Downward-Facing-Dog_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=YqOqM79McYY",
      animationUrl: "https://thumbs.gfycat.com/FrayedQuestionableGallowaycow-size_restricted.gif",
      category: "beginnerPoses",
      benefits: [
        "Stretches hamstrings, calves, and shoulders",
        "Strengthens arms, shoulders, and legs",
        "Relieves back pain and improves posture",
        "Increases blood flow to the brain",
        "Calms the nervous system"
      ],
      tips: [
        "Bend knees if hamstrings are tight",
        "Spread fingers wide and press palms firmly into mat",
        "Rotate upper arms outward to broaden shoulders",
        "Keep neck relaxed by gazing toward navel"
      ]
    },
    {
      id: "yoga2",
      name: "Child's Pose (Balasana)",
      description: "A restful pose that gently stretches the back, hips, and thighs.",
      muscleGroups: ["back", "hips", "thighs"],
      equipment: ["yoga mat"],
      difficulty: "beginner",
      instructions: [
        "Kneel on the floor with big toes touching and knees wide apart",
        "Sit back on your heels",
        "Fold forward, extending arms in front or alongside body",
        "Rest forehead on the mat",
        "Relax shoulders toward the floor",
        "Hold for 1-3 minutes, breathing deeply"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/childs-pose.jpg",
      videoUrl: "https://www.youtube.com/watch?v=eqVMAPM00DM",
      animationUrl: "https://thumbs.gfycat.com/GrimyDisfiguredChimpanzee-size_restricted.gif",
      category: "beginnerPoses",
      benefits: [
        "Relieves tension in back, shoulders, and chest",
        "Calms the mind and reduces stress and fatigue",
        "Gently stretches hips, thighs, and ankles",
        "Promotes relaxation and steady breathing",
        "Can help relieve back and neck pain"
      ],
      tips: [
        "Place a cushion under your buttocks if sitting on heels is uncomfortable",
        "Rest on a pillow or bolster for additional support",
        "Keep arms alongside body if shoulders are tight",
        "Gently rock side to side to massage forehead"
      ]
    },
    {
      id: "yoga3",
      name: "Mountain Pose (Tadasana)",
      description: "The foundation for all standing poses that improves posture and body awareness.",
      muscleGroups: ["legs", "core", "shoulders"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet together or hip-width apart",
        "Distribute weight evenly across both feet",
        "Engage leg muscles and lift kneecaps",
        "Lengthen spine and roll shoulders back and down",
        "Arms at sides with palms facing forward",
        "Hold for 30-60 seconds with steady breathing"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/Mountain-Pose-Tadasana_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=2HTvZp5rPrg",
      animationUrl: "https://thumbs.gfycat.com/BaggyLateAustralianfreshwatercrocodile-size_restricted.gif",
      category: "beginnerPoses",
      benefits: [
        "Improves posture and alignment",
        "Strengthens thighs, knees, and ankles",
        "Firms abdomen and buttocks",
        "Develops balance and body awareness",
        "Creates a foundation for other standing poses"
      ],
      tips: [
        "Ensure weight is distributed evenly across all four corners of feet",
        "Imagine a string pulling upward from the crown of your head",
        "Keep shoulders relaxed away from ears",
        "Engage core lightly without holding breath"
      ]
    }
  ],
  standingPoses: [
    {
      id: "yoga4",
      name: "Warrior II (Virabhadrasana II)",
      description: "A powerful standing pose that builds strength and stability.",
      muscleGroups: ["legs", "hips", "shoulders"],
      equipment: ["yoga mat"],
      difficulty: "intermediate",
      instructions: [
        "Step feet 3-4 feet apart, parallel to each other",
        "Turn right foot out 90 degrees and left foot in slightly",
        "Extend arms parallel to floor, reaching actively through fingertips",
        "Bend right knee over right ankle, keeping shin perpendicular to floor",
        "Turn head to gaze over right fingertips",
        "Hold for 5-10 breaths, then repeat on opposite side"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/warrior-1_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=k2xC2F2qzXs",
      animationUrl: "https://thumbs.gfycat.com/ImperturbableAlarmingHydatidtapeworm-size_restricted.gif",
      category: "standingPoses",
      benefits: [
        "Strengthens legs, ankles, and feet",
        "Opens hips and chest",
        "Builds stamina and concentration",
        "Stimulates abdominal organs",
        "Relieves backaches"
      ],
      tips: [
        "Keep front knee aligned with ankle to protect the joint",
        "Draw shoulders down away from ears",
        "Sink hips down rather than forward to protect knees",
        "Keep torso directly over hips, not leaning forward"
      ]
    },
    {
      id: "yoga5",
      name: "Triangle Pose (Trikonasana)",
      description: "A standing pose that stretches and strengthens the whole body.",
      muscleGroups: ["legs", "hips", "spine", "chest"],
      equipment: ["yoga mat"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet wide apart, right foot pointing to the side",
        "Left foot turns in slightly",
        "Extend arms parallel to the floor",
        "Reach right arm forward, then down toward ankle or block",
        "Extend left arm toward ceiling",
        "Hold for 30-60 seconds, then switch sides"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/Triangle-Pose_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=upFYlxZHif0",
      animationUrl: "https://thumbs.gfycat.com/PresentAptHyracotherium-size_restricted.gif",
      category: "standingPoses",
      benefits: [
        "Stretches hamstrings, groins, and hips",
        "Strengthens thighs, knees, and ankles",
        "Opens chest and shoulders",
        "Improves digestion",
        "Relieves stress"
      ],
      tips: [
        "Use a block under hand if needed",
        "Keep both legs active and strong",
        "Rotate chest up toward ceiling",
        "Gaze up, straight ahead, or down based on neck comfort"
      ]
    }
  ],
  balancePoses: [
    {
      id: "yoga6",
      name: "Tree Pose (Vrksasana)",
      description: "A balancing pose that builds focus and stability.",
      muscleGroups: ["legs", "core", "ankles"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Begin standing with feet together",
        "Shift weight onto left foot",
        "Place right foot on left inner thigh or calf (not on knee)",
        "Bring palms together at heart center or extend arms overhead",
        "Fix gaze on a steady point",
        "Hold for 30-60 seconds, then switch sides"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/Tree-Pose_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=wdln9qWYloU",
      animationUrl: "https://thumbs.gfycat.com/GrimyReflectingGerbil-size_restricted.gif",
      category: "balancePoses",
      benefits: [
        "Improves balance and stability",
        "Strengthens ankles, calves, and thighs",
        "Builds focus and concentration",
        "Opens hips and groins",
        "Relieves flat feet and sciatica"
      ],
      tips: [
        "Start with foot lower on leg if balance is challenging",
        "Press standing foot firmly into floor",
        "Engage core muscles for better balance",
        "If balance is difficult, try practicing near a wall"
      ]
    },
    {
      id: "yoga7",
      name: "Eagle Pose (Garudasana)",
      description: "A challenging balance pose that improves concentration and body awareness.",
      muscleGroups: ["shoulders", "legs", "hips"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in Mountain Pose",
        "Bend knees slightly, lift right foot and cross right thigh over left",
        "Hook right foot behind left calf if possible",
        "Cross left arm over right at elbows",
        "Wrap forearms around each other, pressing palms together",
        "Hold for 5-8 breaths, then switch sides"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/Eagle-Pose_Andrew-Clark.jpg",
      videoUrl: "https://www.youtube.com/watch?v=YXC8SAE2RUc",
      animationUrl: "https://thumbs.gfycat.com/JointSecondaryGarpike-size_restricted.gif",
      category: "balancePoses",
      benefits: [
        "Strengthens and stretches ankles and calves",
        "Stretches thighs, hips, shoulders, and upper back",
        "Improves concentration and balance",
        "Expands back and shoulders",
        "Creates space in joints"
      ],
      tips: [
        "Focus on a fixed point for better balance",
        "Keep standing foot firmly grounded",
        "Lift elbows to shoulder height",
        "If balance is challenging, unwrap legs but keep thighs crossed"
      ]
    }
  ]
};

// Main component for Yoga-specific exercises
interface YogaSpecificExercisesProps {
  category: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
}

export default function YogaSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-blue-50",
  maxExercises = 4,
}: YogaSpecificExercisesProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof YOGA_EXERCISE_SETS>('beginnerPoses');
  const [exerciseVideos, setExerciseVideos] = useState<Record<string, YouTubeVideo[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});

  // Function to toggle exercise expansion
  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
    
    // Load videos when expanding an exercise if not already loaded
    if (expandedExercise !== exerciseId && !exerciseVideos[exerciseId]) {
      loadVideosForExercise(exerciseId);
    }
  };

  // Function to load videos for a specific exercise
  const loadVideosForExercise = async (exerciseId: string) => {
    const exercise = YOGA_EXERCISE_SETS[selectedCategory].find(ex => ex.id === exerciseId);
    
    if (!exercise) return;
    
    setLoadingVideos(prev => ({ ...prev, [exerciseId]: true }));
    
    try {
      // Use the specialized function for yoga exercise videos
      const videos = await searchSectionSpecificExerciseVideos(
        'yoga',
        exercise.name,
        exercise.equipment?.join(', '),
        exercise.muscleGroups,
        exerciseId // Use exercise ID as seed for consistent results
      );
      
      setExerciseVideos(prev => ({
        ...prev,
        [exerciseId]: videos
      }));
    } catch (error) {
      console.error('Error loading videos for yoga exercise:', error);
    } finally {
      setLoadingVideos(prev => ({ ...prev, [exerciseId]: false }));
    }
  };

  // Render
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Yoga Poses</h2>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCategory('beginnerPoses')}
              className={selectedCategory === 'beginnerPoses' ? 'bg-zinc-200 dark:bg-zinc-800' : ''}
            >
              Beginner
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCategory('standingPoses')}
              className={selectedCategory === 'standingPoses' ? 'bg-zinc-200 dark:bg-zinc-800' : ''}
            >
              Standing
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCategory('balancePoses')}
              className={selectedCategory === 'balancePoses' ? 'bg-zinc-200 dark:bg-zinc-800' : ''}
            >
              Balance
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {YOGA_EXERCISE_SETS[selectedCategory].map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  onClick={() => toggleExercise(exercise.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">{exercise.name}</h3>
                    {expandedExercise === exercise.id ? (
                      <ChevronUp className="h-5 w-5 text-zinc-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-zinc-500" />
                    )}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-1">{exercise.description}</p>
                </div>
                
                {expandedExercise === exercise.id && (
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    {/* Exercise instructions */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-1 text-blue-500" />
                        Instructions
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        {exercise.instructions.map((instruction, idx) => (
                          <li key={idx} className="text-sm text-zinc-700 dark:text-zinc-300">
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    {/* Benefits section */}
                    {exercise.benefits && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Plus className="h-4 w-4 mr-1 text-green-500" />
                          Benefits
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {exercise.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-zinc-700 dark:text-zinc-300">
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Tips section */}
                    {exercise.tips && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                          Tips
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {exercise.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-zinc-700 dark:text-zinc-300">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Instructional video section */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Instructional Video</h4>
                      
                      {loadingVideos[exercise.id] ? (
                        <Skeleton className="w-full h-48 rounded-md" />
                      ) : exerciseVideos[exercise.id] && exerciseVideos[exercise.id].length > 0 ? (
                        <div className="rounded-md overflow-hidden">
                          <EmbeddedYouTubePlayer 
                            videoId={exerciseVideos[exercise.id][0].id}
                            title={exerciseVideos[exercise.id][0].title}
                          />
                          <p className="text-xs text-zinc-500 mt-1 italic">
                            {exerciseVideos[exercise.id][0].title}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            No video available at the moment. Try again later.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}