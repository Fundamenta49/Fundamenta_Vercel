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
        "Keep knees slightly bent to protect lower back",
        "Experiment with different wave patterns (alternating, double, etc.)",
        "Start with shorter intervals and gradually increase duration"
      ]
    }
  ],
  emom: [
    {
      id: "emom1",
      name: "Thrusters",
      description: "A compound movement combining a front squat with an overhead press.",
      muscleGroups: ["quadriceps", "glutes", "shoulders", "triceps", "core"],
      equipment: ["dumbbells", "kettlebells", "barbell"],
      difficulty: "intermediate",
      instructions: [
        "Hold weights at shoulder height, elbows down, feet shoulder-width apart",
        "Descend into a squat, keeping chest up and knees tracking over toes",
        "Drive through heels to stand up explosively",
        "As you stand, press weights overhead until arms are fully extended",
        "Lower weights back to shoulders and repeat",
        "Perform a set number of reps each minute on the minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/07/dumbbell-thruster.jpg",
      videoUrl: "https://www.youtube.com/watch?v=L219ltL15zk",
      category: "emom",
      benefits: [
        "Develops full-body strength and power",
        "Increases cardiovascular capacity",
        "Improves coordination between upper and lower body",
        "Highly efficient for calorie burning"
      ],
      tips: [
        "Focus on proper squat form before adding the press",
        "Start with lighter weights until technique is mastered",
        "Keep core engaged throughout the entire movement",
        "Breathe out during the pressing phase"
      ]
    },
    {
      id: "emom2",
      name: "Kettlebell Clean and Press",
      description: "A functional exercise that develops strength, power and coordination.",
      muscleGroups: ["shoulders", "back", "legs", "core"],
      equipment: ["kettlebell"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart, kettlebell between feet",
        "Hinge at hips to grasp kettlebell with one hand",
        "Pull kettlebell up in a smooth arc, rotating it around forearm",
        "Catch in rack position at shoulder, absorbing momentum with knees",
        "Press kettlebell overhead to full arm extension",
        "Lower kettlebell back to shoulder, then to starting position",
        "Perform required reps every minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/kettlebell-clean-press.jpg",
      videoUrl: "https://www.youtube.com/watch?v=ZuTKcK9fwHE",
      category: "emom",
      benefits: [
        "Develops explosive hip power",
        "Builds shoulder strength and stability",
        "Improves coordination and body awareness",
        "Enhances grip strength and forearm development"
      ],
      tips: [
        "Let kettlebell roll around forearm rather than flipping it over wrist",
        "Keep elbow tight to body during clean portion",
        "Fully lock out at top of press",
        "Practice clean and press separately before combining"
      ]
    },
    {
      id: "emom3",
      name: "Box Jump Burpees",
      description: "An intense combination exercise that maximizes heart rate and power output.",
      muscleGroups: ["full body"],
      equipment: ["box", "bench", "platform"],
      difficulty: "advanced",
      instructions: [
        "Start standing in front of box",
        "Perform a burpee: squat down, kick feet back to plank, perform push-up",
        "Jump feet back to hands, then explosively jump onto box",
        "Stand fully upright on box",
        "Step down (don't jump down) and repeat",
        "Perform specified reps at start of each minute",
        "Rest for remainder of minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/08/burpee-box-jump.jpg",
      videoUrl: "https://www.youtube.com/watch?v=S8QvCBfkWpU",
      category: "emom",
      benefits: [
        "Maximizes calorie burn in minimal time",
        "Develops explosive power and athleticism",
        "Improves cardiovascular conditioning",
        "Builds mental toughness"
      ],
      tips: [
        "Focus on proper form rather than speed initially",
        "Scale by removing push-up or using lower box height",
        "Always step down from box, never jump down",
        "Start with fewer reps per minute if needed"
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
        "Stand with feet shoulder-width apart, dumbbells at sides",
        "Lower dumbbells to floor while hinging at hips",
        "Jump feet back to plank position, keeping hands on dumbbells",
        "Perform push-up with hands on dumbbells",
        "Jump feet back toward hands",
        "In one explosive movement, snatch dumbbells overhead",
        "Lower dumbbells and repeat for prescribed reps each minute"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/10/devils-press.jpg",
      videoUrl: "https://www.youtube.com/watch?v=r75ji3K4n2g",
      category: "emom",
      benefits: [
        "Develops whole-body strength and power",
        "Improves coordination and body control",
        "Enhances cardiovascular capacity",
        "Builds mental resilience"
      ],
      tips: [
        "Start with lighter dumbbells until movement pattern is mastered",
        "Keep core braced throughout entire movement",
        "Use hip drive to help get dumbbells overhead",
        "Scale by breaking movement into separate components if needed"
      ]
    }
  ],
  circuit: [
    {
      id: "circuit1",
      name: "Dumbbell Renegade Rows",
      description: "A challenging exercise that combines plank stability with rowing strength.",
      muscleGroups: ["back", "core", "shoulders", "arms"],
      equipment: ["dumbbells"],
      difficulty: "intermediate",
      instructions: [
        "Start in high plank position with hands on dumbbells, shoulder-width apart",
        "Feet can be wider than hip-width for stability",
        "Keeping hips level and core tight, row one dumbbell to hip",
        "Lower dumbbell back to floor with control",
        "Repeat on other side, alternating sides for prescribed reps",
        "Maintain plank position throughout exercise"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/renegade-row.jpg",
      videoUrl: "https://www.youtube.com/watch?v=PJpTBj4ilZw",
      category: "circuit",
      benefits: [
        "Builds anti-rotational core strength",
        "Develops upper back and lat muscles",
        "Improves shoulder stability",
        "Enhances whole-body coordination"
      ],
      tips: [
        "Keep hips as stable as possible (avoid twisting)",
        "Pull elbow close to body during row",
        "Start with lighter weights to master form",
        "Place feet wider for more stability"
      ]
    },
    {
      id: "circuit2",
      name: "Goblet Squats",
      description: "An effective squat variation that promotes proper form and depth.",
      muscleGroups: ["quadriceps", "glutes", "upper back", "core"],
      equipment: ["kettlebell", "dumbbell"],
      difficulty: "beginner",
      instructions: [
        "Hold kettlebell or dumbbell close to chest with both hands",
        "Stand with feet slightly wider than shoulder-width",
        "Keeping chest up, lower into squat by pushing hips back and bending knees",
        "Descend until thighs are at least parallel to floor",
        "Push through heels to return to standing position",
        "Maintain upright torso throughout movement"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/goblet-squat.jpg",
      videoUrl: "https://www.youtube.com/watch?v=MxsFDhcyFyE",
      category: "circuit",
      benefits: [
        "Promotes proper squat mechanics and depth",
        "Strengthens legs, hips and core",
        "Improves mobility in hips and ankles",
        "Builds upper back strength via weight positioning"
      ],
      tips: [
        "Keep weight close to chest throughout movement",
        "Drive knees outward as you squat to maintain alignment",
        "Descend until elbows touch inside of thighs if mobility allows",
        "Keep heels planted firmly on floor"
      ]
    },
    {
      id: "circuit3",
      name: "Plank Shoulder Taps",
      description: "A core exercise that builds stability and anti-rotational strength.",
      muscleGroups: ["core", "shoulders", "chest"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in high plank position with hands directly under shoulders",
        "Set feet slightly wider than hip-width for stability",
        "Keeping hips level and core engaged, lift right hand to tap left shoulder",
        "Return right hand to floor and repeat with left hand tapping right shoulder",
        "Alternate sides for prescribed repetitions",
        "Maintain stable plank position throughout"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/08/plank-shoulder-tap.jpg",
      videoUrl: "https://www.youtube.com/watch?v=gWHQpMUd7vw",
      category: "circuit",
      benefits: [
        "Develops anti-rotational core strength",
        "Improves shoulder stability",
        "Enhances body control and coordination",
        "Builds endurance in core and shoulder girdle"
      ],
      tips: [
        "Keep hips as still as possible - don't let them rotate side to side",
        "Engage core by drawing navel toward spine",
        "Modify by widening feet stance for more stability",
        "Focus on controlled movement rather than speed"
      ]
    },
    {
      id: "circuit4",
      name: "Dumbbell Romanian Deadlifts",
      description: "A hip-hinge exercise that targets the posterior chain.",
      muscleGroups: ["hamstrings", "glutes", "lower back"],
      equipment: ["dumbbells", "kettlebells"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet hip-width apart, holding weights in front of thighs",
        "Initiate movement by hinging at hips, pushing buttocks back",
        "Lower weights along front of legs, keeping back flat",
        "Descend until feeling stretch in hamstrings (typically mid-shin)",
        "Drive hips forward to return to standing position",
        "Squeeze glutes at top of movement"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/dumbbell-romanian-deadlift.jpg",
      videoUrl: "https://www.youtube.com/watch?v=1uDiW5--rAE",
      category: "circuit",
      benefits: [
        "Strengthens entire posterior chain",
        "Develops proper hip-hinge pattern",
        "Improves hamstring flexibility",
        "Enhances athletic performance and power"
      ],
      tips: [
        "Maintain slight bend in knees throughout movement",
        "Keep back flat - don't round spine",
        "Let weights glide close to legs during descent",
        "Focus on hip movement rather than knee bend"
      ]
    }
  ]
};

// Main component interface
interface HIITSpecificExercisesProps {
  category: 'tabata' | 'amrap' | 'emom' | 'circuit';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
  onShowExerciseDetail?: (exercise: Exercise) => void;
}

// Component for a single HIIT exercise card with its own closed/open state
function HIITExerciseCard({
  exercise,
  loadExerciseVideo,
  loadingVideos,
  exerciseVideos,
  onShowExerciseDetail,
  category
}: {
  exercise: Exercise;
  loadExerciseVideo: (exercise: Exercise) => void;
  loadingVideos: Record<string, boolean>;
  exerciseVideos: Record<string, YouTubeVideo[]>;
  onShowExerciseDetail?: (exercise: Exercise) => void;
  category: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("HIITExerciseCard close button clicked");
    setIsOpen(false);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={handleToggle}
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
            onClick={handleToggle}
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
        
        {isOpen && (
          <div className="mt-3 pt-3 border-t relative">
            {/* Close button in top-right corner of expanded content */}
            <Button 
              variant="destructive"
              size="sm"
              className="absolute top-3 right-0 rounded-full p-1 bg-red-500 hover:bg-red-600 text-white z-50"
              onClick={handleClose}
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
                />
              </div>
            ) : exercise.imageUrl && (
              <div className="mb-3 overflow-hidden rounded-md">
                <img 
                  src={exercise.imageUrl} 
                  alt={exercise.name} 
                  className="w-full object-cover h-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    !exerciseVideos[exercise.id] && loadExerciseVideo(exercise);
                  }}
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
}

export default function HIITSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-red-50",
  maxExercises = 4,
  onShowExerciseDetail
}: HIITSpecificExercisesProps) {
  const [exerciseVideos, setExerciseVideos] = useState<Record<string, YouTubeVideo[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  
  // Map the category prop to the actual category used in HIIT_EXERCISE_SETS
  const getCategoryMapping = (): keyof typeof HIIT_EXERCISE_SETS => {
    switch (category) {
      case 'tabata': return 'tabata';
      case 'amrap': return 'amrap';
      case 'emom': return 'emom';
      case 'circuit': return 'circuit';
      default: return 'tabata';
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
      // Construct a detailed search query based on exercise properties
      const searchQuery = `hiit ${exercise.name} workout tutorial with ${exercise.equipment.join(' ')} for ${exercise.muscleGroups.join(' ')} proper form demonstration from trainers`;
      
      // Call the function with appropriate parameters
      const videos = await searchSectionSpecificExerciseVideos(
        'hiit', 
        exercise.name,
        exercise.equipment.join(','),
        exercise.muscleGroups.join(','),
        Math.random().toString(),
        category // Pass the category for more specific results
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
    // Reset state when category changes
    setExerciseVideos({});
  }, [category]);

  return (
    <div className={`p-6 rounded-lg shadow-sm ${backgroundColor}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      {HIIT_EXERCISE_SETS[selectedCategory].length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {HIIT_EXERCISE_SETS[selectedCategory].slice(0, maxExercises).map((exercise) => (
            <HIITExerciseCard
              key={exercise.id}
              exercise={exercise}
              loadExerciseVideo={loadExerciseVideo}
              loadingVideos={loadingVideos}
              exerciseVideos={exerciseVideos}
              onShowExerciseDetail={onShowExerciseDetail}
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
}