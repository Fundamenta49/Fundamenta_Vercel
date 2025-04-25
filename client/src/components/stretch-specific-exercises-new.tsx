import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, ChevronDown, ChevronUp, Plus, ArrowRight, X } from "lucide-react";
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
        "Start in a lunge position with right foot forward",
        "Place both hands inside right foot, framing it",
        "Drop left knee to ground and sink into hip flexor stretch",
        "Rotate torso right, reaching right arm toward ceiling",
        "Return hand to ground, straighten right leg for hamstring stretch",
        "Return to start position and repeat sequence on left side"
      ],
      imageUrl: "https://www.mensjournal.com/wp-content/uploads/2018/07/worldsgreateststretchtrio.jpg",
      videoUrl: "https://www.youtube.com/watch?v=JWuHBtMhDdc",
      animationUrl: "https://thumbs.gfycat.com/RemoteWeightyIberianbarbel-max-1mb.gif",
      category: "fullBody",
      benefits: [
        "Targets multiple muscle groups in one sequence",
        "Improves thoracic spine mobility",
        "Enhances hip flexibility",
        "Opens chest and shoulders",
        "Excellent pre-workout warm-up stretch"
      ],
      tips: [
        "Keep front knee aligned over ankle in lunge position",
        "Focus on deep breathing during each position",
        "Move through sequence slowly for maximum benefit",
        "Make stretch more dynamic by adding movement, or static by holding positions"
      ]
    },
    {
      id: "stretch9",
      name: "Standing Forward Fold",
      description: "A calming forward bend that stretches the entire posterior chain and relaxes the nervous system.",
      muscleGroups: ["hamstrings", "calves", "back", "neck"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet hip-width apart",
        "Exhale and hinge at hips to fold forward",
        "Let head and neck hang relaxed",
        "Keep slight bend in knees to avoid strain",
        "Allow arms to hang toward floor or hold opposite elbows",
        "Hold for 30-60 seconds, breathing deeply"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/standing-forward-bend-exercise-illustration.jpg",
      videoUrl: "https://www.youtube.com/watch?v=g7Uhp5tphAs",
      animationUrl: "https://thumbs.gfycat.com/DefenselessTastyAmericanshorthair-max-1mb.gif",
      category: "fullBody",
      benefits: [
        "Lengthens entire posterior chain",
        "Reduces tension in neck and shoulders",
        "Calms the mind and nervous system",
        "Improves circulation to brain",
        "Helps relieve mild anxiety and fatigue"
      ],
      tips: [
        "Always keep slight bend in knees to protect lower back",
        "Focus on lengthening spine rather than touching floor",
        "Shake head gently to release neck tension",
        "For tight hamstrings, place hands on blocks or shins"
      ]
    }
  ]
};

// Component for a single stretch exercise card with its own closed/open state
function StretchExerciseCard({
  exercise,
  loadExerciseVideo,
  loadingVideos,
  exerciseVideos
}: {
  exercise: Exercise;
  loadExerciseVideo: (exercise: Exercise) => void;
  loadingVideos: Record<string, boolean>;
  exerciseVideos: Record<string, YouTubeVideo[]>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("StretchExerciseCard close button clicked");
    setIsOpen(false);
  };
  
  return (
    <Card key={exercise.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
          onClick={handleToggle}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">{exercise.name}</h3>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">{exercise.description}</p>
        </div>
        
        {isOpen && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 relative">
            {/* Close button in top-right corner */}
            <Button 
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4 rounded-full p-1 bg-red-500 hover:bg-red-600 text-white z-50"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={16} />
              <span className="sr-only">Close</span>
            </Button>
            
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
  );
}

// Main component interface
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
  backgroundColor = "bg-green-50",
  maxExercises = 4,
}: StretchSpecificExercisesProps) {
  const [exerciseVideos, setExerciseVideos] = useState<Record<string, YouTubeVideo[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  
  // Map the category prop to the actual category used in STRETCH_EXERCISE_SETS
  const getCategoryMapping = (): keyof typeof STRETCH_EXERCISE_SETS => {
    switch (category) {
      case 'dynamic': return 'upperBody';
      case 'static': return 'lowerBody';
      case 'recovery': return 'fullBody';
      default: return 'upperBody';
    }
  }
  
  const selectedCategory = getCategoryMapping();
  
  const loadExerciseVideo = async (exercise: Exercise) => {
    if (loadingVideos[exercise.id]) return;
    
    setLoadingVideos(prev => ({
      ...prev,
      [exercise.id]: true
    }));
    
    try {
      // Call the function with appropriate parameters
      const videos = await searchSectionSpecificExerciseVideos(
        'stretch', 
        exercise.name,
        exercise.equipment.join(','),
        exercise.muscleGroups.join(','),
        Math.random().toString(),
        category
      );
      
      setExerciseVideos(prev => ({
        ...prev,
        [exercise.id]: videos
      }));
    } catch (error) {
      console.error('Error loading exercise video:', error);
    } finally {
      setLoadingVideos(prev => ({
        ...prev,
        [exercise.id]: false
      }));
    }
  };
  
  useEffect(() => {
    // Reset expanded exercise when category changes
    setExerciseVideos({});
  }, [category]);

  return (
    <div className={`p-6 rounded-lg ${backgroundColor}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && <p className="text-zinc-600">{description}</p>}
      </div>
      
      <div className="space-y-4">
        {STRETCH_EXERCISE_SETS[selectedCategory].slice(0, maxExercises).map((exercise) => (
          <StretchExerciseCard
            key={exercise.id}
            exercise={exercise}
            loadExerciseVideo={loadExerciseVideo}
            loadingVideos={loadingVideos}
            exerciseVideos={exerciseVideos}
          />
        ))}
      </div>
    </div>
  );
}