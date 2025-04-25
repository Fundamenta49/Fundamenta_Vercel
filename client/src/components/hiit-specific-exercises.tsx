import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, ChevronDown, ChevronUp, Plus, ArrowRight, X } from "lucide-react";
import { EmbeddedYouTubePlayer } from '@/components/embedded-youtube-player';
import { searchSectionSpecificExerciseVideos, YouTubeVideo } from '@/lib/youtube-service';
import { PinkCloseButton } from "@/components/ui/pink-close-button";

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

// Define hardcoded exercise data for HIIT workouts by protocol type
export const HIIT_EXERCISE_SETS = {
  tabata: [
    {
      id: "tabata1",
      name: "Jump Squats",
      description: "An explosive lower-body exercise perfect for the Tabata protocol.",
      muscleGroups: ["quads", "glutes", "calves"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower into a squat position, keeping chest up",
        "Explosively jump upward, extending through hips, knees and ankles",
        "Land softly with knees slightly bent",
        "Immediately lower back into squat position",
        "Perform for 20 seconds, rest for 10 seconds",
        "Repeat for 8 rounds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/jump-squat.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Azl5tkCzDcc",
      animationUrl: "https://thumbs.gfycat.com/AlertAfraidAldabratortoise-max-1mb.gif",
      category: "tabata",
      benefits: [
        "Builds explosive power in the lower body",
        "Increases heart rate quickly",
        "Burns significant calories in a short time",
        "Improves anaerobic capacity"
      ],
      tips: [
        "Land softly with knees slightly bent to reduce impact",
        "Maintain proper squat form throughout",
        "Focus on maximum effort during the 20-second work periods",
        "Modify by performing bodyweight squats if needed"
      ]
    },
    {
      id: "tabata2",
      name: "Mountain Climbers",
      description: "A dynamic full-body exercise that elevates heart rate and engages multiple muscle groups.",
      muscleGroups: ["core", "shoulders", "hips", "legs"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Start in a high plank position with hands directly under shoulders",
        "Keeping core tight, rapidly bring right knee toward chest",
        "Quickly switch legs, bringing left knee forward while extending right leg back",
        "Continue alternating legs in a running motion",
        "Maintain a flat back and engaged core throughout",
        "Perform for 20 seconds, rest for 10 seconds",
        "Repeat for 8 rounds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2021/01/mountain-climbers.jpg",
      videoUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
      category: "tabata",
      benefits: [
        "Improves cardiovascular endurance",
        "Strengthens core and shoulder stabilizers",
        "Enhances coordination and agility",
        "Burns calories efficiently"
      ],
      tips: [
        "Keep hips low and in line with shoulders",
        "Move at a controlled but rapid pace",
        "Breathe rhythmically throughout the exercise",
        "Modify by slowing the pace if needed"
      ]
    },
    {
      id: "tabata3",
      name: "Burpees",
      description: "A high-intensity full-body exercise that combines strength and cardio elements.",
      muscleGroups: ["full body"],
      equipment: ["none"],
      difficulty: "advanced",
      instructions: [
        "Start standing with feet shoulder-width apart",
        "Quickly squat down and place hands on floor",
        "Jump feet back to plank position",
        "Perform a push-up (optional)",
        "Jump feet forward to hands",
        "Explosively jump up with arms overhead",
        "Perform for 20 seconds, rest for 10 seconds",
        "Repeat for 8 rounds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/burpees.gif",
      videoUrl: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
      category: "tabata",
      benefits: [
        "Provides comprehensive full-body workout",
        "Maximizes calorie burn in minimal time",
        "Improves strength, endurance, and power",
        "Enhances cardiovascular fitness"
      ],
      tips: [
        "Focus on form rather than speed initially",
        "Modify by stepping back instead of jumping if needed",
        "Remove the push-up to make the exercise more accessible",
        "Keep core engaged throughout the movement"
      ]
    },
    {
      id: "tabata4",
      name: "High Knees",
      description: "A cardio-intensive exercise that elevates heart rate and works the lower body.",
      muscleGroups: ["quads", "hip flexors", "calves", "core"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet hip-width apart",
        "Run in place, lifting knees as high as possible (ideally hip height)",
        "Land lightly on the balls of your feet",
        "Pump arms in a running motion",
        "Maintain a quick pace throughout",
        "Perform for 20 seconds, rest for 10 seconds",
        "Repeat for 8 rounds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/high-knees.gif",
      videoUrl: "https://www.youtube.com/watch?v=ZZZoCNMU48U",
      category: "tabata",
      benefits: [
        "Elevates heart rate quickly",
        "Improves cardiovascular endurance",
        "Strengthens hip flexors and core",
        "Enhances coordination and agility"
      ],
      tips: [
        "Focus on height of knees rather than speed initially",
        "Maintain upright posture with engaged core",
        "Land softly to minimize impact",
        "Modify by reducing knee height if needed"
      ]
    }
  ],
  amrap: [
    {
      id: "amrap1",
      name: "Push-ups",
      description: "A fundamental upper body strength exercise for AMRAP circuits.",
      muscleGroups: ["chest", "shoulders", "triceps", "core"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in a high plank position with hands slightly wider than shoulder-width",
        "Keep body in a straight line from head to heels",
        "Lower body until chest nearly touches the floor",
        "Push back up to starting position",
        "Maintain a tight core throughout",
        "Perform as many repetitions as possible with good form"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/01/push-up.jpg",
      videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
      animationUrl: "https://thumbs.gfycat.com/FrighteningRepulsiveAyeaye-size_restricted.gif",
      category: "amrap",
      benefits: [
        "Builds upper body pushing strength",
        "Strengthens core stability",
        "Improves posture and shoulder stability",
        "Highly effective with no equipment needed"
      ],
      tips: [
        "Keep elbows at 45-degree angle to torso, not flared wide",
        "Modify by performing from knees if needed",
        "Maintain neutral neck position (don't drop head)",
        "Focus on quality repetitions over quantity"
      ]
    },
    {
      id: "amrap2",
      name: "Kettlebell Swings",
      description: "A dynamic posterior chain exercise that builds power and endurance.",
      muscleGroups: ["hamstrings", "glutes", "lower back", "shoulders"],
      equipment: ["kettlebell", "dumbbell"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart, kettlebell on the floor between feet",
        "Hinge at hips, maintain flat back, and grasp kettlebell with both hands",
        "Pull kettlebell back between legs like a hiking motion",
        "Explosively drive hips forward, allowing momentum to swing kettlebell up to chest height",
        "Let kettlebell naturally fall, hingjng at hips to absorb momentum",
        "Immediately transition into next repetition",
        "Perform as many repetitions as possible with good form"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/07/kettlebell-swing.jpg",
      videoUrl: "https://www.youtube.com/watch?v=YSxHifyI6s8",
      category: "amrap",
      benefits: [
        "Develops hip power and posterior chain strength",
        "Burns significant calories while building strength",
        "Improves cardiovascular endurance",
        "Enhances grip strength and shoulder stability"
      ],
      tips: [
        "Drive with hips, not arms (it's not a front raise)",
        "Keep back flat throughout the movement",
        "Start with lighter weight to master form",
        "Maintain tension in core and glutes at the top of the swing"
      ]
    },
    {
      id: "amrap3",
      name: "Box Jumps",
      description: "A plyometric exercise that builds lower body power and explosiveness.",
      muscleGroups: ["quads", "glutes", "calves"],
      equipment: ["box", "bench", "sturdy platform"],
      difficulty: "intermediate",
      instructions: [
        "Stand facing a sturdy box or platform, about 1-2 feet away",
        "Lower into quarter squat position",
        "Swing arms back, then explosively up as you jump onto the box",
        "Land softly in squat position on box with both feet completely on surface",
        "Stand fully upright on box",
        "Step back down (never jump down) and immediately repeat",
        "Perform as many repetitions as possible with good form"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/box-jump.jpg",
      videoUrl: "https://www.youtube.com/watch?v=52r_Ul5k03g",
      category: "amrap",
      benefits: [
        "Builds explosive leg power",
        "Improves lower body strength and coordination",
        "Increases vertical jump performance",
        "Enhances athletic performance"
      ],
      tips: [
        "Start with a lower box height and progress gradually",
        "Always step down, never jump down (to protect knees)",
        "Land softly with knees tracking over toes",
        "Keep chest up throughout the movement"
      ]
    },
    {
      id: "amrap4",
      name: "Battle Rope Waves",
      description: "A high-intensity exercise that builds upper body endurance and power.",
      muscleGroups: ["shoulders", "arms", "core", "back"],
      equipment: ["battle ropes"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart, knees slightly bent",
        "Hold one end of rope in each hand with arms extended",
        "Maintain tight core and athletic stance",
        "Rapidly raise and lower arms to create waves in the rope",
        "Keep waves consistent and powerful",
        "Breathe rhythmically throughout",
        "Perform as many repetitions as possible with good form"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/08/battle-ropes.jpg",
      videoUrl: "https://www.youtube.com/watch?v=r2Rzaf7SaGk",
      category: "amrap",
      benefits: [
        "Builds shoulder and arm endurance",
        "Provides intense cardiovascular challenge",
        "Develops core stability and grip strength",
        "Low impact on joints while highly effective"
      ],
      tips: [
        "Maintain tension in the ropes throughout",
        "Keep slight bend in knees and engaged core",
        "Start with shorter intervals and build up",
        "Vary wave patterns (alternating, synchronous, circles) for different stimulus"
      ]
    }
  ],
  emom: [
    {
      id: "emom1",
      name: "Dumbbell Thrusters",
      description: "A compound movement combining squat and overhead press perfect for EMOM workouts.",
      muscleGroups: ["quads", "glutes", "shoulders", "triceps", "core"],
      equipment: ["dumbbells"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart, holding dumbbells at shoulder height",
        "Lower into full squat position with thighs parallel to ground",
        "Drive through heels to stand up explosively",
        "As you stand, press dumbbells overhead in one fluid motion",
        "Lower dumbbells back to shoulders as you descend into next squat",
        "Perform prescribed reps at the start of each minute",
        "Rest for remainder of minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/02/dumbbell-thruster.jpg",
      videoUrl: "https://www.youtube.com/watch?v=L8fvypPrzzs",
      category: "emom",
      benefits: [
        "Provides full-body stimulus in one efficient movement",
        "Elevates heart rate quickly",
        "Builds both strength and endurance",
        "Improves coordination between upper and lower body"
      ],
      tips: [
        "Start with lighter weights to master the movement pattern",
        "Keep core braced throughout entire exercise",
        "Drive knees outward during squat portion",
        "Time your breathing: exhale on the press up"
      ]
    },
    {
      id: "emom2",
      name: "Rowing Sprints",
      description: "A full-body cardio exercise that builds power and endurance.",
      muscleGroups: ["back", "legs", "core", "arms"],
      equipment: ["rowing machine"],
      difficulty: "intermediate",
      instructions: [
        "Sit on rower with feet secured on footplates, knees bent",
        "Grasp handle with overhand grip, arms extended",
        "Push with legs, then pull with back, finally pulling arms to lower ribs",
        "Return in reverse: extend arms, hinge forward at hips, bend knees",
        "Maintain power and rhythm throughout the sprint",
        "Perform 15-20 calories or 200-250 meters at the start of each minute",
        "Rest for remainder of minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/rowing.jpg",
      videoUrl: "https://www.youtube.com/watch?v=H0r_ZPXJLtg",
      category: "emom",
      benefits: [
        "Provides total-body conditioning",
        "Builds cardiovascular fitness with low impact",
        "Develops posterior chain strength",
        "Improves power and endurance simultaneously"
      ],
      tips: [
        "Focus on proper sequence: legs-back-arms, then arms-back-legs",
        "Drive primarily with legs, not arms",
        "Keep core engaged and back straight",
        "Adjust damper setting based on fitness level (3-5 for most people)"
      ]
    },
    {
      id: "emom3",
      name: "Toes-to-Bar",
      description: "A challenging core exercise that builds abdominal strength and coordination.",
      muscleGroups: ["abs", "hip flexors", "grip", "shoulders"],
      equipment: ["pull-up bar"],
      difficulty: "advanced",
      instructions: [
        "Hang from pull-up bar with overhand grip slightly wider than shoulders",
        "Engage shoulders and core (active hang)",
        "Keep legs straight and together as you raise them upward",
        "Touch toes to the bar between your hands",
        "Lower legs with control back to starting position",
        "Perform prescribed reps at the start of each minute",
        "Rest for remainder of minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/10/toes-to-bar.jpg",
      videoUrl: "https://www.youtube.com/watch?v=6dHvTlsMvNY",
      category: "emom",
      benefits: [
        "Builds significant core and grip strength",
        "Improves body control and coordination",
        "Develops shoulder stability",
        "Enhances kinesthetic awareness"
      ],
      tips: [
        "Initiate movement from core, not by swinging",
        "Keep shoulders active and engaged throughout",
        "For beginners, start with knee raises or leg raises",
        "Use a kipping motion when fatigued to maintain reps"
      ]
    },
    {
      id: "emom4",
      name: "Devil's Press",
      description: "A challenging full-body exercise combining burpee and dumbbell snatch movements.",
      muscleGroups: ["full body"],
      equipment: ["dumbbells"],
      difficulty: "advanced",
      instructions: [
        "Stand with feet shoulder-width apart, dumbbells on floor outside feet",
        "Keeping back flat, place hands on dumbbells and jump feet back to plank",
        "Perform a push-up with hands on dumbbells",
        "Jump feet forward outside dumbbells",
        "Hinge at hips and pull dumbbells up explosively",
        "Catch dumbbells overhead with arms fully extended",
        "Lower dumbbells and repeat",
        "Perform prescribed reps at the start of each minute",
        "Rest for remainder of minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/03/devils-press.jpg",
      videoUrl: "https://www.youtube.com/watch?v=r75yReIdNvY",
      category: "emom",
      benefits: [
        "Provides extreme full-body challenge",
        "Combines strength, power and endurance training",
        "Maximizes caloric expenditure",
        "Improves explosive strength and coordination"
      ],
      tips: [
        "Start with light weights to master the complex movement",
        "Keep core braced throughout entire exercise",
        "Maintain flat back during all phases",
        "Scale by using single dumbbell or removing push-up"
      ]
    }
  ],
  circuit: [
    {
      id: "circuit1",
      name: "Dumbbell Goblet Squats",
      description: "A lower body strength exercise that builds leg power and mobility.",
      muscleGroups: ["quads", "glutes", "core"],
      equipment: ["dumbbell", "kettlebell"],
      difficulty: "beginner",
      instructions: [
        "Hold a dumbbell or kettlebell close to chest with both hands",
        "Stand with feet slightly wider than shoulder-width, toes slightly turned out",
        "Keeping chest up and back straight, lower into squat position",
        "Descend until thighs are at least parallel to floor (or as low as comfortable)",
        "Drive through heels to return to starting position",
        "Perform 12-15 repetitions before moving to next exercise",
        "Minimal rest between exercises in circuit"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/goblet-squat.jpg",
      videoUrl: "https://www.youtube.com/watch?v=mF5tnEBrdkc",
      animationUrl: "https://thumbs.gfycat.com/HelplessBadHornedviper-size_restricted.gif",
      category: "circuit",
      benefits: [
        "Strengthens lower body while improving mobility",
        "Reinforces proper squat mechanics",
        "Builds core stability and strength",
        "More knee-friendly than back squats for many people"
      ],
      tips: [
        "Keep weight close to body for better balance",
        "Drive knees outward in line with toes",
        "Focus on depth while maintaining upright torso",
        "Breathe in on descent, out on ascent"
      ]
    },
    {
      id: "circuit2",
      name: "Renegade Rows",
      description: "A compound exercise that combines plank stability with rowing movement.",
      muscleGroups: ["back", "core", "shoulders", "arms"],
      equipment: ["dumbbells"],
      difficulty: "intermediate",
      instructions: [
        "Start in push-up position with hands on dumbbells, feet shoulder-width apart",
        "Core tight, maintaining plank position throughout",
        "Pull one dumbbell up to rib cage while stabilizing with other arm",
        "Lower dumbbell with control, then repeat with opposite arm",
        "Minimize hip rotation during the rowing motion",
        "Perform 8-10 repetitions per side before moving to next exercise",
        "Minimal rest between exercises in circuit"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/07/renegade-row.jpg",
      videoUrl: "https://www.youtube.com/watch?v=LccyTxiUrhg",
      category: "circuit",
      benefits: [
        "Builds anti-rotational core strength",
        "Develops back and arm strength",
        "Improves shoulder stability",
        "Enhances total body coordination"
      ],
      tips: [
        "Use hexagonal dumbbells for better stability",
        "Keep hips square to floor (avoid twisting)",
        "Position feet wider for more stability",
        "Scale by performing from knees if needed"
      ]
    },
    {
      id: "circuit3",
      name: "Box Step-Ups",
      description: "A unilateral lower body exercise that builds strength and stability.",
      muscleGroups: ["quads", "glutes", "hamstrings", "calves"],
      equipment: ["box", "bench", "platform", "dumbbells (optional)"],
      difficulty: "beginner",
      instructions: [
        "Stand facing a box or bench about knee height",
        "Place right foot completely on box surface",
        "Drive through right heel to lift body onto box",
        "Bring left foot up to stand on box",
        "Step down with left foot first, then right",
        "Complete all reps on one side before switching legs",
        "Add dumbbells for increased challenge",
        "Perform 10-12 repetitions per leg before moving to next exercise",
        "Minimal rest between exercises in circuit"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/box-step-up.jpg",
      videoUrl: "https://www.youtube.com/watch?v=98NP6rZrSmw",
      category: "circuit",
      benefits: [
        "Develops unilateral leg strength and balance",
        "Improves hip stability and glute activation",
        "Builds functional strength for everyday movements",
        "Scalable intensity for all fitness levels"
      ],
      tips: [
        "Drive through heel of stepping foot, not pushing off back foot",
        "Keep torso upright throughout movement",
        "Start with lower box height and progress gradually",
        "Control the descent to protect knees"
      ]
    },
    {
      id: "circuit4",
      name: "Medicine Ball Slams",
      description: "A power exercise that builds explosive strength and releases tension.",
      muscleGroups: ["shoulders", "core", "back", "arms"],
      equipment: ["medicine ball"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet shoulder-width apart, holding medicine ball",
        "Raise ball overhead, extending fully with slight back arch",
        "Forcefully contract abs and slam ball to ground with maximum effort",
        "Catch ball on bounce or pick up and repeat",
        "Use entire body in fluid motion",
        "Maintain control while generating maximum power",
        "Perform 10-15 repetitions before moving to next exercise",
        "Minimal rest between exercises in circuit"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/08/medicine-ball-slam.jpg",
      videoUrl: "https://www.youtube.com/watch?v=CdcLcGU-EzM",
      category: "circuit",
      benefits: [
        "Develops explosive power and coordination",
        "Releases physical and mental tension",
        "Strengthens core and shoulder stability",
        "Provides excellent conditioning stimulus"
      ],
      tips: [
        "Use a non-bouncing medicine ball on hard surfaces",
        "Engage core throughout entire movement",
        "Focus on power generation from entire kinetic chain",
        "Keep feet firmly planted during slams"
      ]
    }
  ]
};

interface HIITSpecificExercisesProps {
  category: 'tabata' | 'amrap' | 'emom' | 'circuit';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
  onShowExerciseDetail?: (exercise: Exercise) => void;
}

export default function HIITSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-white",
  maxExercises = 4,
  onShowExerciseDetail
}: HIITSpecificExercisesProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const exercises = HIIT_EXERCISE_SETS[category];
  
  // State for videos
  const [exerciseVideos, setExerciseVideos] = useState<Record<string, YouTubeVideo[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  
  // Use our hardcoded exercise data directly
  // Ensure all HIIT exercises have the 'hiit' category for our special dialog handling
  const exerciseData = exercises
    .slice(0, maxExercises)
    .map(exercise => ({
      ...exercise,
      category: 'hiit' // Override category to ensure consistent dialog handling
    }));
  
  // Create a loading state for a brief moment to simulate data fetching
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Function to load section-specific videos for a HIIT exercise
  const loadExerciseVideo = async (exercise: Exercise) => {
    // Skip if we're already loading videos for this exercise
    if (loadingVideos[exercise.id]) return;
    
    // Skip if we already have videos for this exercise
    if (exerciseVideos[exercise.id]?.length > 0) return;
    
    // Mark as loading
    setLoadingVideos(prev => ({ ...prev, [exercise.id]: true }));
    
    try {
      // Search for HIIT-specific videos for this exercise
      const videos = await searchSectionSpecificExerciseVideos(
        'hiit',
        exercise.name,
        exercise.equipment?.[0],
        exercise.muscleGroups,
        exercise.id // Use exercise ID as seed for consistent results
      );
      
      // Store the videos
      if (videos && videos.length > 0) {
        setExerciseVideos(prev => ({ ...prev, [exercise.id]: videos }));
      }
    } catch (error) {
      console.error(`Error loading videos for ${exercise.name}:`, error);
    } finally {
      // Mark as done loading regardless of result
      setLoadingVideos(prev => ({ ...prev, [exercise.id]: false }));
    }
  };
  
  useEffect(() => {
    // Simulate data loading for a more natural UX
    const timer = setTimeout(() => {
      setIsDataLoading(false);
      
      // Preload videos for the first few exercises
      exerciseData.slice(0, 2).forEach(exercise => {
        loadExerciseVideo(exercise);
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`border rounded-lg p-4 ${backgroundColor}`}>
      <h5 className="font-medium mb-3">{title}</h5>
      {description && <p className="text-gray-700 mb-4 text-sm">{description}</p>}
      
      {isDataLoading ? (
        <div className="space-y-4">
          {Array.from({ length: maxExercises }).map((_, i) => (
            <Card key={`skeleton-${i}`} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {exerciseData.map((exercise, index) => {
            const isExpanded = expandedExercise === exercise.name;
            
            return (
              <Card key={exercise.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedExercise(isExpanded ? null : exercise.name)}
                  >
                    <div className="flex-1">
                      <h6 className="font-medium text-base">{exercise.name}</h6>
                      <p className="text-gray-600 text-sm truncate">
                        {exercise.description.slice(0, 80)}...
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedExercise(isExpanded ? null : exercise.name);
                      }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t relative">
                      {/* Close button in top-right corner of expanded content */}
                      <Button 
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-0 rounded-full p-1 bg-pink-300 hover:bg-pink-400 text-pink-800 z-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Close button clicked, resetting expandedExercise");
                          setExpandedExercise(null);
                        }}
                        aria-label="Close"
                      >
                        <X size={16} />
                        <span className="sr-only">Close</span>
                      </Button>
                      
                      {/* Show either the embedded YouTube video if available or fallback to image */}
                      {exerciseVideos[exercise.id]?.length > 0 ? (
                        <div className="mb-3 overflow-hidden rounded-md" style={{ aspectRatio: '16/9' }}>
                          <EmbeddedYouTubePlayer
                            videoId={exerciseVideos[exercise.id][0].id}
                            title={`${exercise.name} tutorial`}
                            height="100%"
                            width="100%"
                            className="rounded-md"
                            onError={() => {
                              // If video fails, load a different one
                              const updatedVideos = [...exerciseVideos[exercise.id]];
                              updatedVideos.shift(); // Remove the failed video
                              setExerciseVideos({
                                ...exerciseVideos,
                                [exercise.id]: updatedVideos
                              });
                            }}
                          />
                        </div>
                      ) : exercise.imageUrl && (
                        <div className="mb-3 overflow-hidden rounded-md">
                          <img 
                            src={exercise.imageUrl} 
                            alt={exercise.name} 
                            className="w-full object-cover h-40"
                            onClick={() => !exerciseVideos[exercise.id] && loadExerciseVideo(exercise)}
                          />
                          {loadingVideos[exercise.id] && (
                            <div className="text-center mt-1">
                              <span className="text-xs">Loading videos...</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{exercise.description}</p>
                        
                        <div className="space-y-1">
                          <h6 className="text-sm font-medium">Instructions:</h6>
                          <ol className="text-sm text-gray-600 pl-5 list-decimal space-y-1">
                            {exercise.instructions.slice(0, 3).map((instruction: string, i: number) => (
                              <li key={i}>{instruction}</li>
                            ))}
                            {exercise.instructions.length > 3 && (
                              <li>
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 h-auto text-blue-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onShowExerciseDetail) {
                                      onShowExerciseDetail(exercise);
                                    }
                                  }}
                                >
                                  View complete instructions <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              </li>
                            )}
                          </ol>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          {!exerciseVideos[exercise.id] && !loadingVideos[exercise.id] && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                loadExerciseVideo(exercise);
                              }}
                            >
                              <AlertCircle className="h-3 w-3 mr-1" /> Load Video
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onShowExerciseDetail) {
                                onShowExerciseDetail(exercise);
                              }
                            }}
                          >
                            <Info className="h-3 w-3 mr-1" /> More Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}