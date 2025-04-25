import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, ChevronDown, ChevronUp, Plus, ArrowRight } from "lucide-react";
import { EmbeddedYouTubePlayer } from '@/components/embedded-youtube-player';
import { searchSectionSpecificExerciseVideos, YouTubeVideo } from '@/lib/youtube-service';
import { getFallbackVideosForCategory } from '@/lib/section-fallbacks';

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

// Define hardcoded exercise data for stretching routines by body area
const STRETCH_EXERCISE_SETS = {
  upperBody: [
    {
      id: "stretch1",
      name: "Doorway Chest Stretch",
      description: "An accessible stretch that opens the chest and counteracts the effects of poor posture.",
      muscleGroups: ["chest", "shoulders"],
      equipment: ["doorway"],
      difficulty: "beginner",
      instructions: [
        "Stand in an open doorway",
        "Raise each arm to the side at a 90-degree angle (like cactus arms)",
        "Place forearms and palms on door frames",
        "Step forward with one foot through the doorway",
        "Lean body weight gently forward until you feel stretch across chest",
        "Hold for 20-30 seconds",
        "Adjust arm height to target different parts of chest"
      ],
      imageUrl: "https://acewebcontent.azureedge.net/exercise-library/large/81-1.jpg",
      videoUrl: "https://www.youtube.com/watch?v=aVj3iuWGvNA",
      animationUrl: "https://thumbs.gfycat.com/ScratchyAlertEuropeanpolecat-size_restricted.gif",
      category: "upperBody",
      benefits: [
        "Opens chest and stretches pectoral muscles",
        "Counteracts rounded shoulder posture",
        "Improves breathing capacity",
        "Reduces tension in chest and shoulders",
        "Helps correct posture issues from desk work"
      ],
      tips: [
        "Keep core engaged to prevent arching lower back",
        "Vary arm positions (higher/lower) to target different muscle fibers",
        "Start with gentle stretch and progressively increase",
        "Maintain neutral neck position, avoiding forward head posture"
      ]
    },
    {
      id: "stretch2",
      name: "Shoulder Rolls",
      description: "A gentle dynamic stretch that releases tension in the shoulders and upper back.",
      muscleGroups: ["shoulders", "upper back", "neck"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit or stand with good posture",
        "Inhale and lift your shoulders toward your ears",
        "Roll shoulders backward and down",
        "Exhale as you complete the circular motion",
        "Repeat 8-10 times backward",
        "Then repeat 8-10 times rolling forward"
      ],
      imageUrl: "https://thumbs.dreamstime.com/b/shoulder-rolls-exercise-woman-doing-shoulders-roll-workout-fitness-sport-training-concept-vector-illustration-isolated-white-219962161.jpg",
      videoUrl: "https://www.youtube.com/watch?v=wFUCYQgDzgQ",
      animationUrl: "https://thumbs.gfycat.com/CookedLinedArchaeocete-max-1mb.gif",
      category: "upperBody",
      benefits: [
        "Relieves tension in neck, shoulders, and upper back",
        "Improves circulation in shoulder area",
        "Increases range of motion in shoulder joint",
        "Helps correct forward head posture",
        "Can be done anytime, even at desk"
      ],
      tips: [
        "Make circles as large as possible",
        "Move slowly and deliberately",
        "Keep breathing throughout the movement",
        "Focus on squeezing shoulder blades together on backward rolls"
      ]
    },
    {
      id: "stretch3",
      name: "Neck Stretch",
      description: "A gentle stretch to relieve tension in the neck and upper trap muscles.",
      muscleGroups: ["neck", "trapezius"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit or stand with good posture",
        "Tilt right ear toward right shoulder",
        "For deeper stretch, gently place right hand on left side of head",
        "Hold for 20-30 seconds",
        "Return to center and repeat on opposite side",
        "Perform 2-3 times per side"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/neck-stretch-exercise-illustration.jpg",
      videoUrl: "https://www.youtube.com/watch?v=XcGaK4P9lUw",
      animationUrl: "https://thumbs.gfycat.com/BareFlickeringHousefly-max-1mb.gif",
      category: "upperBody",
      benefits: [
        "Relieves tension in neck and upper trapezius muscles",
        "Helps alleviate tension headaches",
        "Improves neck mobility and range of motion",
        "Counteracts effects of looking at screens",
        "Reduces stress-related tension"
      ],
      tips: [
        "Never pull on your head - apply gentle pressure only",
        "Keep shoulders down and relaxed throughout stretch",
        "Breathe deeply while holding stretch",
        "Stop if you feel any pain (gentle discomfort is normal)"
      ]
    }
  ],
  lowerBody: [
    {
      id: "stretch4",
      name: "Standing Hamstring Stretch",
      description: "A fundamental stretch that targets the back of the thighs and helps reduce lower back tension.",
      muscleGroups: ["hamstrings", "lower back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Extend right leg forward, placing heel on ground with toes pointing up",
        "Keep left leg slightly bent for stability",
        "Hinge at hips and fold forward while maintaining a flat back",
        "Place hands on left thigh or bring torso toward extended leg",
        "Hold for 20-30 seconds",
        "Repeat on opposite side"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/standing-hamstring-stretch-exercise-illustration.jpg",
      videoUrl: "https://www.youtube.com/watch?v=wPzT58VHxA4",
      animationUrl: "https://thumbs.gfycat.com/ScrawnyElatedArrowworm-small.gif",
      category: "lowerBody",
      benefits: [
        "Lengthens hamstring muscles",
        "Reduces lower back tightness and pain",
        "Improves range of motion in hips and knees",
        "Helps prevent hamstring injuries",
        "Enhances athletic performance"
      ],
      tips: [
        "Keep extended leg slightly bent to avoid hyperextension",
        "Focus on hinging at hips rather than rounding back",
        "For deeper stretch, use a strap around foot of extended leg",
        "Maintain regular breathing throughout the stretch"
      ]
    },
    {
      id: "stretch5",
      name: "Figure Four Stretch",
      description: "An effective hip stretch that targets the glutes and piriformis muscles.",
      muscleGroups: ["glutes", "hips", "piriformis"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Lie on your back with knees bent, feet flat on floor",
        "Cross right ankle over left knee, creating a figure-4 shape",
        "Thread right arm through the triangle formed by legs",
        "Clasp hands behind left thigh",
        "Gently pull left thigh toward chest",
        "Hold for 30-60 seconds",
        "Switch legs and repeat"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/supine-figure-4-stretch-exercise-illustration.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Mvo2snJGhtM",
      animationUrl: "https://thumbs.gfycat.com/ShinyPepperyAquaticleech-max-1mb.gif",
      category: "lowerBody",
      benefits: [
        "Relieves tightness in gluteal muscles",
        "Stretches piriformis muscle to alleviate sciatic nerve compression",
        "Improves hip mobility",
        "Helps relieve lower back pain",
        "Beneficial for runners and those sitting for long periods"
      ],
      tips: [
        "Flex foot of crossed leg to protect knee",
        "Keep lower back pressed into floor",
        "For less intensity, perform stretch with both feet on floor",
        "For more intensity, perform in seated position"
      ]
    },
    {
      id: "stretch6",
      name: "Hip Flexor Stretch",
      description: "A key stretch for counteracting the effects of prolonged sitting and improving posture.",
      muscleGroups: ["hip flexors", "quads", "psoas"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Kneel on right knee with left foot planted in front",
        "Left knee should be directly over left ankle",
        "Keep torso upright and core engaged",
        "Gently push hips forward until you feel stretch in front of right hip",
        "For deeper stretch, raise right arm overhead and bend slightly to left",
        "Hold for 30 seconds",
        "Switch sides and repeat"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/low-lunge-exercise-illustration.jpg",
      videoUrl: "https://www.youtube.com/watch?v=YQmpO9VT2X4",
      animationUrl: "https://thumbs.gfycat.com/HonorableRadiantAmurstarfish-small.gif",
      category: "lowerBody",
      benefits: [
        "Relieves tightness in hip flexors from sitting",
        "Improves hip extension for better walking and running",
        "Helps correct anterior pelvic tilt",
        "Reduces lower back pain",
        "Improves posture"
      ],
      tips: [
        "Use cushion under knee for comfort",
        "Keep front knee tracking over ankle, not forward",
        "Engage core to prevent arching lower back",
        "For deeper stretch, tuck pelvis under slightly"
      ]
    }
  ],
  fullBody: [
    {
      id: "stretch7",
      name: "Cat-Cow Stretch",
      description: "A gentle flowing stretch that improves spinal mobility and coordination.",
      muscleGroups: ["spine", "back", "neck", "core"],
      equipment: ["yoga mat"],
      difficulty: "beginner",
      instructions: [
        "Start on hands and knees with wrists under shoulders and knees under hips",
        "For Cat: Exhale, round spine toward ceiling, tuck chin to chest",
        "For Cow: Inhale, arch back, lift chest and tailbone, look up slightly",
        "Flow between positions slowly, coordinating with breath",
        "Perform 8-10 complete cycles"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/cat-cow-pose-exercise-illustration.jpg",
      videoUrl: "https://www.youtube.com/watch?v=kqnua4rHVVA",
      animationUrl: "https://thumbs.gfycat.com/DismalHighlevelAssassinbug-size_restricted.gif",
      category: "fullBody",
      benefits: [
        "Increases spinal flexibility and mobility",
        "Stretches back, neck, and torso",
        "Strengthens core and spine",
        "Improves posture and balance",
        "Relieves back pain and tension"
      ],
      tips: [
        "Engage core to support spine",
        "Move slowly and deliberately with breath",
        "Keep wrists directly under shoulders to prevent strain",
        "For sensitive wrists, make fists or use yoga blocks"
      ]
    },
    {
      id: "stretch8",
      name: "World's Greatest Stretch",
      description: "A dynamic full-body stretch that targets multiple muscle groups and improves mobility.",
      muscleGroups: ["hips", "shoulders", "hamstrings", "back", "chest"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in a low lunge position with right foot forward",
        "Place both hands inside right foot on the ground",
        "Rotate torso to right, raising right arm toward ceiling",
        "Return hand to floor, then drop right elbow toward instep",
        "Lift hand back up and perform a hamstring stretch by straightening front leg",
        "Return to starting position and repeat on other side",
        "Complete 5-6 repetitions per side"
      ],
      imageUrl: "https://www.mensjournal.com/wp-content/uploads/2018/07/worldsgreateststretchtrio.jpg",
      videoUrl: "https://www.youtube.com/watch?v=JWuHBtMhDdc",
      animationUrl: "https://thumbs.gfycat.com/DelayedHarmfulAfricanwilddog-size_restricted.gif",
      category: "fullBody",
      benefits: [
        "Improves overall mobility and flexibility",
        "Opens hips, shoulders, and thoracic spine",
        "Stretches hamstrings and hip flexors",
        "Prepares body for exercise or athletic activity",
        "Relieves tension throughout body"
      ],
      tips: [
        "Move slowly through each position",
        "Focus on proper alignment of front knee over ankle",
        "Breathe deeply throughout movement sequence",
        "For deeper stretch, extend further in each position"
      ]
    },
    {
      id: "stretch9",
      name: "Standing Forward Fold",
      description: "A calming stretch that releases tension in the spine, hamstrings, and calves.",
      muscleGroups: ["hamstrings", "calves", "back", "spine"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet hip-width apart",
        "Hinge at hips and fold forward",
        "Let arms and head hang heavy",
        "Bend knees slightly for comfort",
        "Hold position for 30-60 seconds",
        "To exit, bend knees and roll up slowly"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2015/02/forward-fold-exercise-illustration.jpg",
      videoUrl: "https://www.youtube.com/watch?v=g7Uhp5tphAs",
      animationUrl: "https://thumbs.gfycat.com/DecentOffensiveHen-size_restricted.gif",
      category: "fullBody",
      benefits: [
        "Stretches entire posterior chain (back, hamstrings, calves)",
        "Relieves tension in spine and neck",
        "Calms nervous system and reduces stress",
        "Improves circulation to upper body",
        "Helps relieve headaches and fatigue"
      ],
      tips: [
        "Bend knees generously if hamstrings are tight",
        "Focus on lengthening spine rather than touching floor",
        "Let head and neck completely relax",
        "For more intensity, hold opposite elbows with hands"
      ]
    }
  ]
};

// Main component for Stretch-specific exercises
interface StretchSpecificExercisesProps {
  category: 'dynamic' | 'static' | 'recovery';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
}

export default function StretchSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-blue-50",
  maxExercises = 4,
}: StretchSpecificExercisesProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  // Map the category prop to the actual category used in STRETCH_EXERCISE_SETS
  const getCategoryMapping = (): keyof typeof STRETCH_EXERCISE_SETS => {
    switch (category) {
      case 'dynamic':
        return 'upperBody';
      case 'static':
        return 'lowerBody';
      case 'recovery':
        return 'fullBody';
      default:
        return 'upperBody';
    }
  };
  
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof STRETCH_EXERCISE_SETS>(getCategoryMapping());
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
    const exercise = STRETCH_EXERCISE_SETS[selectedCategory].find(ex => ex.id === exerciseId);
    
    if (!exercise) return;
    
    setLoadingVideos(prev => ({ ...prev, [exerciseId]: true }));
    
    try {
      // First check if we need to use fallbacks due to YouTube API quota limits
      // This simplifies the process by avoiding API calls when we know they might fail
      let videos: YouTubeVideo[] = [];
      
      // Try to use the API first
      try {
        videos = await searchSectionSpecificExerciseVideos(
          'stretch',
          exercise.name,
          exercise.equipment?.join(', '),
          exercise.muscleGroups,
          exerciseId // Use exercise ID as seed for consistent results
        );
      } catch (apiError) {
        console.log('YouTube API error, using fallbacks:', apiError);
        // API failed, use our category-specific fallbacks
        videos = getFallbackVideosForCategory('stretch', category);
      }
      
      // If we still don't have videos (API returned empty or failed), use fallbacks
      if (!videos || videos.length === 0) {
        console.log('No videos found, using fallbacks for category:', category);
        videos = getFallbackVideosForCategory('stretch', category);
      }
      
      setExerciseVideos(prev => ({
        ...prev,
        [exerciseId]: videos
      }));
    } catch (error) {
      console.error('Error loading videos for stretch exercise:', error);
      // Final fallback - if all else fails, use our category-specific fallbacks
      const fallbackVideos = getFallbackVideosForCategory('stretch', category);
      setExerciseVideos(prev => ({
        ...prev,
        [exerciseId]: fallbackVideos
      }));
    } finally {
      setLoadingVideos(prev => ({ ...prev, [exerciseId]: false }));
    }
  };

  // Use the category and other props in the component
  useEffect(() => {
    // Update selected category when category prop changes
    setSelectedCategory(getCategoryMapping());
  }, [category]);

  // Render
  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-md ${backgroundColor}`}>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCategory('upperBody')}
              className={selectedCategory === 'upperBody' ? 'bg-zinc-200 dark:bg-zinc-800' : ''}
            >
              Upper Body
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCategory('lowerBody')}
              className={selectedCategory === 'lowerBody' ? 'bg-zinc-200 dark:bg-zinc-800' : ''}
            >
              Lower Body
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCategory('fullBody')}
              className={selectedCategory === 'fullBody' ? 'bg-zinc-200 dark:bg-zinc-800' : ''}
            >
              Full Body
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STRETCH_EXERCISE_SETS[selectedCategory].map((exercise) => (
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
                  <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 relative">
                    {/* Close button in top-right corner */}
                    <button 
                      className="absolute top-4 right-4 rounded-full p-1 bg-pink-100 hover:bg-pink-200 text-pink-700 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedExercise(null);
                      }}
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                    
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