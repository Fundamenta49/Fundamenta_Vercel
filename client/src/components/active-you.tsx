import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MeditationGuide from "./meditation-guide";
import FitnessProgress from "./fitness-progress";
import FitnessExercises from "./fitness-exercises";
import RunningTracker from "./running-tracker";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Dumbbell,
  Bird as YogaIcon,
  Timer,
  Wind,
  Flame,
  Activity,
  Waypoints,
  Info,
  X,
} from "lucide-react";

// Custom Stretch icon component
export function StretchingIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 4a2 2 0 1 1-2.5 2 2 2 0 0 0-2.5 2c0 .5.17 1 .5 1.5a3 3 0 0 1 0 4 3 3 0 0 0 0 4c.33.5.5 1 .5 1.5a2 2 0 0 0 2.5 2 2 2 0 1 1 2.5 2" />
      <path d="M4 18a2 2 0 1 1 2.5-2 2 2 0 0 0 2.5-2c0-.5-.17-1-.5-1.5a3 3 0 0 1 0-4 3 3 0 0 0 0-4C8.17 4 8 3.5 8 3a2 2 0 0 0-2.5-2A2 2 0 1 1 3 3" />
    </svg>
  );
}

// Define interfaces for exercise details
interface ExerciseDetails {
  name: string;
  category: string;
  description: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
}

type TabType = "meditation" | "weightlifting" | "yoga" | "running" | "hiit" | "stretch";

// Wellness green from design system
const WELLNESS_COLOR = "#10b981";

interface ActiveYouProps {
  defaultTab: TabType;
}

export default function ActiveYou({ defaultTab }: ActiveYouProps) {
  // State for managing the exercise detail dialog
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sample exercise details for yoga poses
  const yogaExercises: Record<string, ExerciseDetails> = {
    "downwardDog": {
      name: "Downward Dog (Adho Mukha Svanasana)",
      category: "yoga",
      description: "A foundational yoga pose that stretches and strengthens the entire body.",
      instructions: [
        "Start on hands and knees with wrists under shoulders and knees under hips",
        "Lift knees off the floor and push hips up and back",
        "Straighten legs as much as comfortable, press heels toward the floor",
        "Create an inverted V-shape with your body",
        "Keep arms straight and shoulders away from ears",
        "Hold for 5-10 breaths"
      ],
      benefits: [
        "Stretches hamstrings, calves, and shoulders",
        "Strengthens arms, shoulders, and legs",
        "Relieves back pain and improves posture",
        "Increases blood flow to the brain",
        "Calms the nervous system"
      ],
      tips: [
        "Bend knees slightly if hamstrings are tight",
        "Press firmly through hands to protect wrists",
        "Keep hips high and back straight",
        "Distribute weight evenly between hands and feet"
      ]
    },
    "warriorII": {
      name: "Warrior II (Virabhadrasana II)",
      category: "yoga",
      description: "A powerful standing pose that builds strength and improves focus.",
      instructions: [
        "Stand with feet wide apart (3-4 feet)",
        "Turn right foot out 90 degrees and left foot in slightly",
        "Extend arms parallel to floor, palms down",
        "Bend right knee to 90 degrees over ankle",
        "Look over right fingertips",
        "Keep shoulders relaxed and torso centered",
        "Hold for 5-8 breaths, then switch sides"
      ],
      benefits: [
        "Strengthens legs, ankles, and feet",
        "Opens hips and chest",
        "Improves focus and concentration",
        "Builds stamina and endurance",
        "Stimulates abdominal organs"
      ],
      tips: [
        "Keep front knee aligned with ankle, not pushing beyond",
        "Sink hips low for a deeper stretch",
        "Keep torso upright, not leaning forward",
        "Gaze softly over front hand to maintain balance"
      ]
    },
    "treePose": {
      name: "Tree Pose (Vrikshasana)",
      category: "yoga",
      description: "A balancing pose that improves focus, stability, and concentration.",
      instructions: [
        "Begin standing with feet hip-width apart",
        "Shift weight to left foot and lift right foot",
        "Place right foot on inner left thigh or calf (not on knee)",
        "Press foot and leg against each other",
        "Bring hands to heart center or extend overhead",
        "Fix gaze on a non-moving point",
        "Hold for 30-60 seconds, then switch sides"
      ],
      benefits: [
        "Improves balance and focus",
        "Strengthens ankles, calves, and thighs",
        "Stretches inner thighs, chest, and shoulders",
        "Develops concentration and mental clarity",
        "Enhances posture and alignment"
      ],
      tips: [
        "Start with foot lower on leg if balance is challenging",
        "Use a wall for support if needed",
        "Engage core muscles to maintain stability",
        "Keep breathing steady and smooth"
      ]
    },
    "bridgePose": {
      name: "Bridge Pose (Setu Bandhasana)",
      category: "yoga",
      description: "A gentle backbend that opens the chest and strengthens the back.",
      instructions: [
        "Lie on back with knees bent, feet flat on floor hip-width apart",
        "Place arms alongside body, palms down",
        "Press feet into floor and lift hips up",
        "Roll shoulders under and clasp hands below pelvis",
        "Keep thighs and feet parallel",
        "Hold for 30-60 seconds",
        "Release by slowly rolling spine back to floor"
      ],
      benefits: [
        "Stretches chest, neck, and spine",
        "Strengthens back, glutes, and hamstrings",
        "Calms the mind and reduces anxiety",
        "Stimulates abdominal organs and thyroid",
        "Relieves back pain"
      ],
      tips: [
        "Keep knees hip-width apart throughout the pose",
        "Press shoulders down to open chest more",
        "Engage glutes to support the lower back",
        "Place a block under sacrum for supported version"
      ]
    }
  };

  // Sample exercise details for stretching
  const stretchExercises: Record<string, ExerciseDetails> = {
    "hamstringStretch": {
      name: "Standing Hamstring Stretch",
      category: "stretching",
      description: "An effective stretch for the back of the legs that improves flexibility and prevents injury.",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Place right heel on ground in front with toes pointing up",
        "Keep left leg slightly bent for stability",
        "Hinge forward at the hips while maintaining a straight back",
        "Reach hands toward right foot or rest on right leg",
        "Hold for 20-30 seconds, then switch sides"
      ],
      benefits: [
        "Lengthens and releases tight hamstrings",
        "Reduces lower back tension",
        "Improves range of motion in hips",
        "Enhances athletic performance",
        "Prevents hamstring injuries"
      ],
      tips: [
        "Focus on hinging at hips rather than rounding back",
        "Keep the stretching leg straight but not locked",
        "For deeper stretch, place foot on elevated surface",
        "Maintain steady breathing throughout"
      ]
    },
    "figureFourStretch": {
      name: "Figure Four Stretch",
      category: "stretching",
      description: "A deep hip stretch that targets the piriformis and glutes to relieve tension.",
      instructions: [
        "Lie on back with knees bent, feet flat on floor",
        "Cross right ankle over left thigh near knee",
        "Reach hands through the gap and pull left thigh toward chest",
        "Keep right foot flexed to protect knee",
        "Hold for 30-60 seconds, then switch sides"
      ],
      benefits: [
        "Opens hip rotators and relieves glute tension",
        "Alleviates sciatic nerve pressure",
        "Improves hip mobility and flexibility",
        "Reduces lower back pain",
        "Enhances posture and alignment"
      ],
      tips: [
        "Keep both feet flexed throughout the stretch",
        "Pull thigh closer for deeper stretch",
        "Keep lower back pressed into floor",
        "Can also be done seated in a chair"
      ]
    },
    "chestStretch": {
      name: "Doorway Chest Stretch",
      category: "stretching",
      description: "An effective stretch that opens the chest and counteracts rounded shoulders from sitting.",
      instructions: [
        "Stand in a doorway with feet staggered for balance",
        "Raise arms to sides at 90-degree angles, forearms on doorframe",
        "Step forward with one foot until you feel a stretch across chest",
        "Keep posture tall, avoid arching lower back",
        "Hold for 20-30 seconds, repeat 2-3 times"
      ],
      benefits: [
        "Opens chest and stretches pectoral muscles",
        "Counteracts rounded shoulders from desk work",
        "Improves posture and spinal alignment",
        "Enhances breathing capacity",
        "Reduces upper back and shoulder tension"
      ],
      tips: [
        "Adjust arm height to target different parts of chest",
        "Keep core engaged to protect lower back",
        "Start with less pressure and gradually increase",
        "Take slow, deep breaths to enhance stretch"
      ]
    },
    "catCowStretch": {
      name: "Cat-Cow Stretch",
      category: "stretching",
      description: "A gentle flowing movement that improves spinal mobility and relieves back tension.",
      instructions: [
        "Start on hands and knees with wrists under shoulders and knees under hips",
        "For cow pose: Inhale, drop belly toward floor, lift chest and tailbone up",
        "For cat pose: Exhale, round spine toward ceiling, tuck chin and tailbone",
        "Move smoothly between positions with breath",
        "Repeat for 10-15 cycles"
      ],
      benefits: [
        "Improves spinal flexibility and mobility",
        "Relieves back and neck tension",
        "Coordinates breath with movement",
        "Massages and stimulates organs in abdomen",
        "Calms the mind and reduces stress"
      ],
      tips: [
        "Focus on initiating movement from tailbone",
        "Keep wrists directly under shoulders to protect joints",
        "Move slowly and mindfully with each breath",
        "For sensitive wrists, make fists or use yoga wedges"
      ]
    }
  };

  // Function to handle opening the detail dialog
  const handleShowDetails = (exerciseType: string, exerciseKey: string) => {
    if (exerciseType === 'yoga') {
      setSelectedExercise(yogaExercises[exerciseKey]);
    } else if (exerciseType === 'stretch') {
      setSelectedExercise(stretchExercises[exerciseKey]);
    }
    setDialogOpen(true);
  };

  switch (defaultTab) {
    case "meditation":
      return <MeditationGuide />;
      
    case "weightlifting":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Dumbbell className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                AI Weight Lifting Guide
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Get personalized workout plans and form guidance
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Weight Training</CardTitle>
              <CardDescription>
                Build strength, muscle, and power with these weightlifting routines
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Find exercises that match your equipment and experience level
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Sample Routine</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Full Body Strength</div>
                    <p className="text-sm text-muted-foreground mb-2">Target all major muscle groups with compound movements</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Barbell Squat: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">2.</span> Deadlift: 3 sets of 6-8 reps</div>
                      <div><span className="font-medium">3.</span> Bench Press: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">4.</span> Bent-over Rows: 3 sets of 10-12 reps</div>
                      <div><span className="font-medium">5.</span> Overhead Press: 3 sets of 8-10 reps</div>
                      <div><span className="font-medium">6.</span> Bicep Curls: 3 sets of 12-15 reps</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <FitnessExercises 
                muscleFilter="strength" 
                equipmentFilter="barbell" 
                difficultyFilter="intermediate"
                categoryFilter="weightlifting" 
                keywordFilter="press"
                showFilters={false}
                compactView={true}
                maxExercises={4}
              />
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      
    case "yoga":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <YogaIcon className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Yoga Sessions
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Follow guided yoga sessions with AI assistance
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Yoga Practices</CardTitle>
              <CardDescription>
                Improve flexibility, balance, and mindfulness with these yoga poses
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Practice these authentic yoga poses to improve flexibility and mindfulness
                </AlertDescription>
              </Alert>
              
              {/* Beginner Yoga Flow */}
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Beginner Yoga Flow</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Morning Energizing Flow</div>
                    <p className="text-sm text-muted-foreground mb-2">Hold each pose for 30-60 seconds, focusing on breath and form</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Downward Dog: Opens shoulders and stretches hamstrings</div>
                      <div><span className="font-medium">2.</span> Child's Pose: Relaxes the spine and shoulders</div>
                      <div><span className="font-medium">3.</span> Cobra Pose: Strengthens the spine and opens the chest</div>
                      <div><span className="font-medium">4.</span> Seated Forward Bend: Stretches lower back and hamstrings</div>
                      <div><span className="font-medium">5.</span> Cat-Cow Stretch: Improves spinal flexibility</div>
                      <div><span className="font-medium">6.</span> Lying Spinal Twist: Releases tension in the back</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Custom Yoga Poses Cards */}
              <div>
                <h3 className="font-medium text-lg my-3">Essential Yoga Poses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Yoga Pose 1 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Downward Dog (Adho Mukha Svanasana)</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">beginner</div>
                    <p className="text-sm text-muted-foreground mb-2">A foundational pose that stretches and strengthens the entire body</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">Benefits:</span> Stretches the hamstrings, calves, and shoulders while strengthening the arms and legs</div>
                      <div><span className="font-medium">Focus on:</span> Creating an inverted V-shape with your body, pressing heels down</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('yoga', 'downwardDog')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                  
                  {/* Yoga Pose 2 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Warrior II (Virabhadrasana II)</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">beginner</div>
                    <p className="text-sm text-muted-foreground mb-2">A standing pose that builds strength and stamina</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">Benefits:</span> Strengthens legs, opens hips and chest, improves concentration</div>
                      <div><span className="font-medium">Focus on:</span> Keeping the front knee aligned with ankle, extending arms fully</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('yoga', 'warriorII')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                  
                  {/* Yoga Pose 3 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Tree Pose (Vrikshasana)</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">beginner</div>
                    <p className="text-sm text-muted-foreground mb-2">A balancing pose that improves focus and stability</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">Benefits:</span> Improves balance, strengthens legs and core, enhances concentration</div>
                      <div><span className="font-medium">Focus on:</span> Keeping your standing leg strong and hips level</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('yoga', 'treePose')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                  
                  {/* Yoga Pose 4 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Bridge Pose (Setu Bandhasana)</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">beginner</div>
                    <p className="text-sm text-muted-foreground mb-2">A gentle backbend that opens the chest and strengthens the back</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">Benefits:</span> Stretches chest, strengthens back and glutes, relieves stress</div>
                      <div><span className="font-medium">Focus on:</span> Keeping knees hip-width apart, engaging glutes and core</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('yoga', 'bridgePose')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Additional Flows */}
              <div className="mt-6">
                <h3 className="font-medium text-lg my-3">Other Yoga Sequences</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Evening Relaxation Flow</div>
                    <p className="text-sm text-muted-foreground mb-2">A gentle sequence to release tension and prepare for sleep</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Reclining Bound Angle Pose (Supta Baddha Konasana)</div>
                      <div><span className="font-medium">2.</span> Happy Baby Pose (Ananda Balasana)</div>
                      <div><span className="font-medium">3.</span> Legs-Up-The-Wall Pose (Viparita Karani)</div>
                      <div><span className="font-medium">4.</span> Supine Spinal Twist (Jathara Parivartanasana)</div>
                      <div><span className="font-medium">5.</span> Corpse Pose (Savasana)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      
    case "running":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Timer className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Running Tracker
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Track your runs, set goals, and improve your performance
            </p>
          </div>
          <RunningTracker />
          <Card className="overflow-hidden mt-4">
            <CardHeader className="pb-0">
              <CardTitle>Running Support Exercises</CardTitle>
              <CardDescription>
                Strengthen key muscle groups to improve running performance and prevent injuries
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Exercises to enhance running performance and prevent common injuries
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">Runner's Strength Routine</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Lower Body Support</div>
                    <p className="text-sm text-muted-foreground mb-2">Perform 2-3 times per week to support running performance</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Lunges: Strengthens quadriceps and glutes</div>
                      <div><span className="font-medium">2.</span> Calf Raises: Targets calf muscles for push-off power</div>
                      <div><span className="font-medium">3.</span> Hamstring Curls: Focuses on hamstrings for injury prevention</div>
                      <div><span className="font-medium">4.</span> Planks: Strengthens core for better running posture</div>
                      <div><span className="font-medium">5.</span> Leg Swings: Enhances hip flexibility for stride length</div>
                      <div><span className="font-medium">6.</span> Ankle Circles: Improves ankle mobility for varied terrain</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <FitnessExercises 
                muscleFilter="legs" 
                equipmentFilter="body weight"
                difficultyFilter="beginner"
                keywordFilter="lunge"
                showFilters={false}
                compactView={true}
                maxExercises={4}
              />
            </CardContent>
          </Card>
        </div>
      );
      
    case "hiit":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <Flame className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                HIIT Workouts
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              High-Intensity Interval Training for maximum results
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>High-Intensity Interval Training</CardTitle>
              <CardDescription>
                Burn calories and build endurance with these intense workouts
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 flex flex-col space-y-2">
                  <p className="font-medium">What is HIIT?</p>
                  <p>HIIT alternates between short, intense bursts of exercise and less-intense recovery periods, keeping your heart rate up to burn more fat in less time.</p>
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg my-3">HIIT Protocols</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Tabata Protocol</div>
                    <p className="text-sm text-muted-foreground mb-2">20 seconds work, 10 seconds rest for 8 rounds (4 minutes total)</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">Exercise 1:</span> Jump Squats (engages lower body, elevates heart rate)</div>
                      <div><span className="font-medium">Exercise 2:</span> Burpees (full-body exercise for cardiovascular fitness)</div>
                      <div><span className="font-medium">Exercise 3:</span> Mountain Climbers (targets core and legs)</div>
                      <div><span className="font-medium">Exercise 4:</span> Push-ups (strengthens chest and triceps)</div>
                      <div><span className="font-medium">Exercise 5:</span> High Knees (improves cardiovascular endurance)</div>
                      <div><span className="font-medium">Exercise 6:</span> Plank to Shoulder Tap (engages core and shoulders)</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">30-30 Intervals</div>
                    <p className="text-sm text-muted-foreground mb-2">30 seconds work, 30 seconds rest for 10-20 minutes</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">Exercise 1:</span> Kettlebell Swings (builds posterior chain power)</div>
                      <div><span className="font-medium">Exercise 2:</span> Box Jumps (develops explosive leg strength)</div>
                      <div><span className="font-medium">Exercise 3:</span> Battle Ropes (challenges upper body endurance)</div>
                      <div><span className="font-medium">Exercise 4:</span> Sprints (maximizes calorie burn)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">HIIT Exercises</h3>
                <FitnessExercises 
                  muscleFilter="full body" 
                  equipmentFilter="body weight"
                  difficultyFilter="intermediate"
                  categoryFilter="hiit"
                  keywordFilter="jump" 
                  showFilters={false} 
                  compactView={true}
                  maxExercises={4}
                />
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
    
    // Plyometrics section has been removed
      
    case "stretch":
      return (
        <div className="space-y-4">
          <div className="pb-4 mb-4 border-b" style={{ borderColor: WELLNESS_COLOR }}>
            <div className="flex items-center">
              <StretchingIcon className="h-6 w-6 mr-2" style={{ color: WELLNESS_COLOR }} />
              <h2 className="text-xl font-bold" style={{ color: WELLNESS_COLOR }}>
                Stretch Zone
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Improve flexibility and recovery with guided stretching routines
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle>Stretching Routines</CardTitle>
              <CardDescription>
                Enhance your flexibility, mobility, and recovery with targeted stretching
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="text-blue-800">
                  Find stretches to improve mobility and aid recovery
                </AlertDescription>
              </Alert>
              
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Recommended Routines</h3>
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Full Body Flexibility Routine</div>
                    <p className="text-sm text-muted-foreground mb-2">Hold each stretch for 30 seconds, 2-3 rounds</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Standing Hamstring Stretch: Targets back of legs</div>
                      <div><span className="font-medium">2.</span> Quadriceps Stretch: Focuses on front of thighs</div>
                      <div><span className="font-medium">3.</span> Chest Opener Stretch: Opens chest and shoulders</div>
                      <div><span className="font-medium">4.</span> Seated Spinal Twist: Enhances spinal flexibility</div>
                      <div><span className="font-medium">5.</span> Butterfly Stretch: Targets inner thighs and hips</div>
                      <div><span className="font-medium">6.</span> Triceps Stretch: Stretches back of upper arms</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="font-medium text-lg mb-1">Dynamic Warm-Up Routine</div>
                    <p className="text-sm text-muted-foreground mb-2">Perform before workouts to prepare muscles and joints</p>
                    <div className="text-sm space-y-2">
                      <div><span className="font-medium">1.</span> Arm Circles: Gradually increases shoulder mobility</div>
                      <div><span className="font-medium">2.</span> Leg Swings: Activates hip flexors and hamstrings</div>
                      <div><span className="font-medium">3.</span> Bodyweight Squats: Warms up quads and knees</div>
                      <div><span className="font-medium">4.</span> Walking Lunges: Engages multiple leg muscles</div>
                      <div><span className="font-medium">5.</span> Torso Twists: Prepares core for rotation</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Custom Stretch Cards */}
              <div>
                <h3 className="font-medium text-lg mb-3">Essential Stretches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stretch 1 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Standing Hamstring Stretch</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">lower body</div>
                    <p className="text-sm text-muted-foreground mb-2">Lengthens hamstrings and reduces lower back tension</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">How to:</span> Stand tall, place one foot in front with heel on ground, toe up. Hinge forward at the hips while maintaining straight back.</div>
                      <div><span className="font-medium">Feel it:</span> Along the back of the extended leg and possibly the lower back</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('stretch', 'hamstringStretch')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                  
                  {/* Stretch 2 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Figure Four Stretch</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">hips</div>
                    <p className="text-sm text-muted-foreground mb-2">Opens hip rotators and relieves glute tension</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">How to:</span> Lie on back, cross right ankle over left thigh, reach through legs and pull left thigh toward chest.</div>
                      <div><span className="font-medium">Feel it:</span> In the outer hip and glute of the crossed leg</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('stretch', 'figureFourStretch')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                  
                  {/* Stretch 3 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Doorway Chest Stretch</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">upper body</div>
                    <p className="text-sm text-muted-foreground mb-2">Opens chest and counteracts rounded shoulders</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">How to:</span> Stand in doorway, place forearms on door frame at 90° angles, lean forward gently.</div>
                      <div><span className="font-medium">Feel it:</span> Across chest and front of shoulders</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('stretch', 'chestStretch')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                  
                  {/* Stretch 4 */}
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <div className="font-medium text-lg mb-1">Cat-Cow Stretch</div>
                    <div className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5 inline-block mb-2">spine</div>
                    <p className="text-sm text-muted-foreground mb-2">Improves spinal mobility and relieves back tension</p>
                    <div className="text-sm space-y-1 mb-2">
                      <div><span className="font-medium">How to:</span> Start on hands and knees, alternate between arching (cow) and rounding (cat) your back.</div>
                      <div><span className="font-medium">Feel it:</span> Throughout the entire spine and core</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={() => handleShowDetails('stretch', 'catCowStretch')}
                    >
                      <Info size={14} />
                      <span>Show Details</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">Exercise Library</h3>
                <FitnessExercises 
                  muscleFilter="flexibility" 
                  equipmentFilter="body weight"
                  categoryFilter="stretching"
                  keywordFilter="stretch"
                  difficultyFilter="beginner"
                  showFilters={false} 
                  compactView={true}
                  maxExercises={4}
                />
              </div>
            </CardContent>
          </Card>
          <FitnessProgress />
        </div>
      );
      
    // Calisthenics section has been removed
      
    default:
      return null;
  }
  
  // Exercise detail dialog component
  return (
    <>
      {/* The component returned above based on the tab */}
      
      {/* Exercise Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedExercise && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold">{selectedExercise.name}</DialogTitle>
                  <button 
                    className="rounded-full p-1 hover:bg-gray-100" 
                    onClick={() => setDialogOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <DialogDescription>
                  {selectedExercise.category === 'yoga' ? 'Yoga Pose' : 'Stretching Exercise'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{selectedExercise.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">How to Perform</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700">{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedExercise.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Tips for Best Results</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="text-gray-700">{tip}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedExercise.imageUrl && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visual Guide</h3>
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={selectedExercise.imageUrl} 
                        alt={`${selectedExercise.name} demonstration`} 
                        className="w-full object-cover" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}