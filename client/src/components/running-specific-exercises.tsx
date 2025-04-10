import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, ChevronDown, ChevronUp, Plus, ArrowRight } from "lucide-react";

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
  category?: string;
  benefits?: string[];
  tips?: string[];
}

// Define hardcoded exercise data to ensure exact exercises are shown
const RUNNING_EXERCISE_SETS = {
  warmUp: [
    {
      id: "warm1",
      name: "Dynamic Lunges",
      description: "A dynamic warm-up exercise that prepares the legs and hips for running.",
      muscleGroups: ["legs", "glutes", "hip flexors"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Take a large step forward with your right foot",
        "Lower your body until both knees are bent at 90-degree angles",
        "Push back to standing and immediately step forward with the left foot",
        "Continue alternating legs in a dynamic, controlled motion for 30-60 seconds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/03/walking-lunge.gif",
      videoUrl: "https://www.youtube.com/watch?v=3XDriUn0udo",
      category: "warmUp",
      benefits: [
        "Activates leg muscles used in running",
        "Improves hip mobility",
        "Enhances dynamic flexibility",
        "Increases blood flow to lower body"
      ],
      tips: [
        "Keep your torso upright throughout the movement",
        "Make sure your front knee stays over your ankle, not beyond your toes",
        "Start with shorter steps and gradually increase range of motion",
        "Perform at a comfortable pace that gradually increases your heart rate"
      ]
    },
    {
      id: "warm2",
      name: "High Knees",
      description: "A cardio exercise that warms up the legs and elevates the heart rate before running.",
      muscleGroups: ["quads", "hip flexors", "calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with your feet hip-width apart",
        "Lift your right knee toward your chest",
        "Quickly alternate between legs, lifting each knee as high as comfortable",
        "Pump your arms as if you're running in place",
        "Continue at a brisk pace for 30-60 seconds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/high-knees.gif",
      videoUrl: "https://www.youtube.com/watch?v=tx5rgpd5p0M",
      category: "warmUp",
      benefits: [
        "Increases heart rate gradually",
        "Warms up hip flexors and quadriceps",
        "Improves running form and knee lift",
        "Enhances coordination and rhythm"
      ],
      tips: [
        "Focus on lifting knees rather than speed initially",
        "Keep your core engaged throughout the exercise",
        "Land softly on the balls of your feet",
        "Maintain good posture with chest up and shoulders relaxed"
      ]
    },
    {
      id: "warm3",
      name: "Butt Kicks",
      description: "A dynamic exercise that activates the hamstrings and gets them ready for running.",
      muscleGroups: ["hamstrings", "calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with your feet hip-width apart",
        "Flex your right foot and kick your heel up toward your buttocks",
        "Lower and immediately repeat with the left foot",
        "Continue alternating legs at a jogging pace",
        "Pump your arms as if running for 30-60 seconds"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/butt-kicks.gif",
      videoUrl: "https://www.youtube.com/watch?v=kVdL0JSLv-o",
      category: "warmUp",
      benefits: [
        "Activates hamstrings and glutes before running",
        "Improves running form and efficiency",
        "Increases flexibility in quadriceps",
        "Enhances running cadence and rhythm"
      ],
      tips: [
        "Focus on bringing heels toward glutes rather than speed initially",
        "Keep your core engaged and posture tall",
        "Land softly on the balls of your feet",
        "Gradually increase the pace as you warm up"
      ]
    },
    {
      id: "warm4",
      name: "Leg Swings",
      description: "A dynamic stretch that improves hip mobility and prepares the legs for running motions.",
      muscleGroups: ["hip flexors", "hamstrings", "adductors"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand next to a wall or something stable for support",
        "Shift weight to your left leg and place your left hand on the support",
        "Keeping your right leg straight but not locked, swing it forward and backward",
        "Start with small swings and gradually increase the range of motion",
        "Perform 10-15 swings, then switch legs",
        "Repeat with side-to-side swings for each leg"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/leg-swings.gif",
      videoUrl: "https://www.youtube.com/watch?v=AkqakzCNkZM",
      category: "warmUp",
      benefits: [
        "Improves hip mobility and range of motion",
        "Activates hip stabilizers",
        "Prevents hip tightness during running",
        "Lubricates hip joints"
      ],
      tips: [
        "Keep your standing leg slightly bent for stability",
        "Maintain good posture throughout the exercise",
        "Increase the swing range gradually",
        "Perform controlled, deliberate movements rather than focusing on speed"
      ]
    },
    {
      id: "warm5",
      name: "Ankle Rotations",
      description: "A mobility exercise that prepares the ankles for the impact of running.",
      muscleGroups: ["ankles", "calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit on a chair or stand on one leg with support if needed",
        "Lift one foot slightly off the ground",
        "Rotate your ankle in a circular motion clockwise 10 times",
        "Reverse and rotate counter-clockwise 10 times",
        "Switch to the other foot and repeat"
      ],
      imageUrl: "https://www.verywellfit.com/thmb/bnlHCh-O0vJ0CW9bN-ZbJME2L6Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ankle-circles-5bfd3316c9e77c0051d45a60.jpg",
      videoUrl: "https://www.youtube.com/watch?v=iLw_8qaJd44",
      category: "warmUp",
      benefits: [
        "Improves ankle mobility",
        "Reduces risk of ankle injuries during running",
        "Increases blood flow to feet and ankles",
        "Prepares joints for impact"
      ],
      tips: [
        "Make the circles as large as comfortable",
        "Perform the rotations slowly and with control",
        "If standing, hold onto something for balance if needed",
        "Focus on smooth, fluid movements"
      ]
    }
  ],
  strength: [
    {
      id: "str1",
      name: "Bodyweight Squats",
      description: "A fundamental lower body exercise that builds strength in the legs and glutes.",
      muscleGroups: ["quads", "glutes", "hamstrings"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet slightly wider than hip-width apart, toes pointed slightly outward",
        "Keep your chest up and core engaged",
        "Bend your knees and push your hips back as if sitting in a chair",
        "Lower until thighs are parallel to the ground (or as low as comfortable)",
        "Push through your heels to return to standing",
        "Complete 2-3 sets of 10-15 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/12/Bodyweight-squat-scaled.jpg",
      videoUrl: "https://www.youtube.com/watch?v=aclHkVaku9U",
      category: "strength",
      benefits: [
        "Strengthens key running muscles (quads, hamstrings, glutes)",
        "Improves running stability and power",
        "Enhances knee stability",
        "Builds lower body endurance"
      ],
      tips: [
        "Keep your weight in your heels",
        "Ensure knees track in line with toes",
        "Maintain a neutral spine throughout the movement",
        "Focus on proper form before increasing repetitions"
      ]
    },
    {
      id: "str2",
      name: "Forward Lunges",
      description: "A unilateral exercise that targets the legs in a motion similar to running stride.",
      muscleGroups: ["quads", "glutes", "hamstrings", "calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Take a controlled step forward with your right foot",
        "Lower your body until both knees are bent at approximately 90 degrees",
        "Push through your right heel to return to the starting position",
        "Repeat with the left leg",
        "Complete 2-3 sets of 10-12 repetitions per leg"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/06/forward-lunge.jpg",
      videoUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
      category: "strength",
      benefits: [
        "Develops unilateral (single-leg) strength",
        "Improves running stride power",
        "Enhances balance and stability",
        "Strengthens hip stabilizers"
      ],
      tips: [
        "Keep your torso upright",
        "Ensure your front knee stays over your ankle",
        "Step far enough forward to create proper knee angles",
        "Focus on control rather than speed"
      ]
    },
    {
      id: "str3",
      name: "Calf Raises",
      description: "An exercise that strengthens the calf muscles critical for running propulsion.",
      muscleGroups: ["calves"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand with feet hip-width apart, holding onto something for balance if needed",
        "Keeping your legs straight but not locked, rise up onto the balls of your feet",
        "Lift as high as possible, contracting your calf muscles",
        "Slowly lower your heels back to the ground",
        "Complete 2-3 sets of 15-20 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/calf-raises.jpg",
      videoUrl: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
      category: "strength",
      benefits: [
        "Strengthens gastrocnemius and soleus muscles",
        "Improves push-off power during running",
        "Reduces risk of Achilles tendon injuries",
        "Enhances ankle stability"
      ],
      tips: [
        "Perform the movement through a full range of motion",
        "Rise all the way up onto the balls of your feet",
        "Lower heels slightly below the level of the step for a stretch",
        "For added difficulty, perform on one leg at a time"
      ]
    },
    {
      id: "str4",
      name: "Plank",
      description: "A core exercise that builds the abdominal and back strength needed for proper running form.",
      muscleGroups: ["core", "shoulders", "back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Start in a push-up position with hands directly under shoulders",
        "Lower onto your forearms, keeping elbows under shoulders",
        "Keep your body in a straight line from head to heels",
        "Engage your core and squeeze your glutes",
        "Hold the position for 30-60 seconds",
        "Complete 2-3 sets"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/plank-pose.jpg",
      videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
      category: "strength",
      benefits: [
        "Strengthens core muscles essential for running posture",
        "Improves running efficiency and form",
        "Reduces risk of back pain",
        "Enhances overall stability during running"
      ],
      tips: [
        "Avoid dropping your hips or arching your back",
        "Keep your neck in a neutral position, not strained",
        "Breathe consistently throughout the hold",
        "Stop if you can't maintain proper form"
      ]
    },
    {
      id: "str5",
      name: "Glute Bridges",
      description: "A fundamental exercise that activates and strengthens the glutes for better running power.",
      muscleGroups: ["glutes", "hamstrings", "lower back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Lie on your back with knees bent and feet flat on the floor, hip-width apart",
        "Place arms at your sides with palms down",
        "Push through your heels to lift your hips off the ground",
        "Squeeze your glutes at the top of the movement",
        "Lower your hips back to the ground in a controlled manner",
        "Complete 2-3 sets of 12-15 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2021/02/bridges2-scaled.jpg",
      videoUrl: "https://www.youtube.com/watch?v=wPM8icPu6H8",
      category: "strength",
      benefits: [
        "Activates and strengthens glute muscles",
        "Improves hip extension power for running",
        "Helps correct posterior chain weaknesses",
        "Reduces strain on lower back during running"
      ],
      tips: [
        "Focus on squeezing your glutes at the top of the movement",
        "Keep your core engaged throughout the exercise",
        "Ensure your knees stay aligned with your feet",
        "For added difficulty, perform with one leg at a time"
      ]
    }
  ],
  plyometric: [
    {
      id: "plyo1",
      name: "Jump Squats",
      description: "An explosive plyometric exercise that builds power in the legs for faster running.",
      muscleGroups: ["quads", "glutes", "calves"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower into a squat position, hips back and knees bent",
        "Explosively jump upward, extending through hips, knees and ankles",
        "Swing arms upward to help propel your body",
        "Land softly with knees slightly bent, immediately lowering into the next squat",
        "Complete 2-3 sets of 10-12 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/jump-squat.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Azl5tkCzDcc",
      category: "plyometric",
      benefits: [
        "Develops explosive leg power",
        "Improves running speed and acceleration",
        "Enhances muscle reactivity",
        "Increases vertical jump height"
      ],
      tips: [
        "Focus on soft, quiet landings",
        "Land with knees aligned with toes",
        "Start with fewer reps and perfect form before increasing volume",
        "If you have knee issues, start with less depth in the squat"
      ]
    },
    {
      id: "plyo2",
      name: "Burpees",
      description: "A full-body plyometric exercise that builds cardiovascular fitness and power.",
      muscleGroups: ["full body"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start standing with feet shoulder-width apart",
        "Quickly lower into a squat position with hands on the ground",
        "Kick feet back into a plank position",
        "Perform a push-up (optional)",
        "Immediately return feet to squat position",
        "Jump up explosively with arms overhead",
        "Complete 2-3 sets of 8-10 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/burpees.gif",
      videoUrl: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
      category: "plyometric",
      benefits: [
        "Provides full-body conditioning",
        "Develops running-specific power",
        "Improves cardiovascular endurance",
        "Enhances explosive power in multiple planes"
      ],
      tips: [
        "Modify by stepping back instead of jumping if needed",
        "Focus on proper form rather than speed initially",
        "Keep core engaged throughout the movement",
        "Breathe rhythmically - exhale on exertion"
      ]
    },
    {
      id: "plyo3",
      name: "Box Jumps",
      description: "A lower-body plyometric exercise that builds explosive power and confidence.",
      muscleGroups: ["quads", "glutes", "hamstrings", "calves"],
      equipment: ["box or bench"],
      difficulty: "intermediate",
      instructions: [
        "Stand facing a sturdy box or bench about 1-2 feet away",
        "Lower into a quarter squat position",
        "Swing arms back, then forward as you jump onto the box",
        "Land softly with both feet completely on the box, knees slightly bent",
        "Stand up straight at the top",
        "Step back down (don't jump down) and repeat",
        "Complete 2-3 sets of 8-10 repetitions"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/box-jump.jpg",
      videoUrl: "https://www.youtube.com/watch?v=52r_Ul5k03g",
      category: "plyometric",
      benefits: [
        "Develops explosive leg power",
        "Improves running speed and acceleration",
        "Builds confidence for obstacles",
        "Enhances muscle recruitment patterns"
      ],
      tips: [
        "Start with a lower box and progress gradually",
        "Focus on soft landings with bent knees",
        "Always step down, never jump down",
        "Drive arms forward and upward for momentum"
      ]
    },
    {
      id: "plyo4",
      name: "Lateral Bounds",
      description: "A side-to-side plyometric exercise that develops lateral stability and power.",
      muscleGroups: ["quads", "glutes", "adductors", "abductors"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Stand on your right foot with knee slightly bent",
        "Push off explosively to the left, landing softly on your left foot",
        "Stabilize on your left foot momentarily",
        "Bound back to the right, landing on your right foot",
        "Continue alternating from side to side",
        "Complete 2-3 sets of 8-10 bounds per side"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/02/lateral-bounds.jpg",
      videoUrl: "https://www.youtube.com/watch?v=zpQ2UlH8vkI",
      category: "plyometric",
      benefits: [
        "Develops lateral stability for trail running",
        "Improves strength in stabilizing muscles",
        "Enhances agility and directional changes",
        "Helps prevent common running injuries"
      ],
      tips: [
        "Start with smaller bounds and gradually increase distance",
        "Focus on landing softly with bent knee",
        "Keep your gaze forward to maintain balance",
        "Land with foot aligned under your center of gravity"
      ]
    },
    {
      id: "plyo5",
      name: "High Knees Sprint",
      description: "A high-intensity plyometric exercise that improves running form and turnover.",
      muscleGroups: ["quads", "hip flexors", "calves"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Start sprinting in place, bringing knees up toward chest",
        "Pump arms vigorously as if sprinting",
        "Stay on balls of feet, minimizing ground contact time",
        "Maintain a fast pace for 20-30 seconds",
        "Complete 2-3 sets with rest between"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/03/high-knees.jpg",
      videoUrl: "https://www.youtube.com/watch?v=ZZZoCNMU48U",
      category: "plyometric",
      benefits: [
        "Improves running form and knee lift",
        "Increases stride frequency and turnover",
        "Enhances cardiovascular fitness",
        "Develops quick feet for faster running pace"
      ],
      tips: [
        "Focus on height of knee lift rather than speed initially",
        "Keep upper body tall and core engaged",
        "Land lightly on the balls of your feet",
        "Maintain a consistent rhythm"
      ]
    }
  ],
  coolDown: [
    {
      id: "cool1",
      name: "Standing Hamstring Stretch",
      description: "A static stretch that helps lengthen the hamstrings after running.",
      muscleGroups: ["hamstrings", "lower back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Place right heel on a low surface with leg straight",
        "Keep your standing leg slightly bent",
        "Hinge at hips and lean forward slightly until you feel a stretch",
        "Keep back straight, not rounded",
        "Hold for 30-60 seconds",
        "Switch to the other leg and repeat"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/02/hamstring-stretch.jpg",
      videoUrl: "https://www.youtube.com/watch?v=9eCYB3RMlgY",
      category: "coolDown",
      benefits: [
        "Reduces post-run hamstring tightness",
        "Improves flexibility and range of motion",
        "Helps prevent hamstring strains",
        "Alleviates lower back tension"
      ],
      tips: [
        "Don't bounce or force the stretch",
        "Breathe deeply and relax into the stretch",
        "Keep a slight bend in the knee of the stretched leg",
        "For a deeper stretch, reach toward your toes"
      ]
    },
    {
      id: "cool2",
      name: "Standing Quadriceps Stretch",
      description: "A static stretch that targets the quadriceps muscles after running.",
      muscleGroups: ["quadriceps"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand on your left leg, holding onto something for balance if needed",
        "Bend your right knee and bring heel toward buttocks",
        "Grasp your right ankle with your right hand",
        "Keep knees close together and hips pushed forward slightly",
        "Hold for 30-60 seconds",
        "Switch legs and repeat"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/quad-stretch.jpg",
      videoUrl: "https://www.youtube.com/watch?v=LaJhuqV9Cjs",
      category: "coolDown",
      benefits: [
        "Relieves quadriceps tightness after running",
        "Prevents anterior knee pain",
        "Improves knee flexibility",
        "Helps restore proper muscle balance"
      ],
      tips: [
        "Keep your body upright, don't lean forward",
        "Pull your foot directly toward your buttocks, not outward",
        "If you can't reach your foot, use a strap or towel",
        "Focus on feeling the stretch in the front of your thigh"
      ]
    },
    {
      id: "cool3",
      name: "Calf Stretch",
      description: "A stretch that targets both the gastrocnemius and soleus muscles in the calf.",
      muscleGroups: ["calves"],
      equipment: ["wall or stable surface"],
      difficulty: "beginner",
      instructions: [
        "Stand facing a wall with hands at shoulder height on the wall",
        "Step back with right foot, keeping it straight and heel on the ground",
        "Bend left knee and lean forward until you feel a stretch in right calf",
        "Hold for 30 seconds",
        "Bend the back knee slightly to target the lower calf (soleus)",
        "Hold for additional 30 seconds then switch legs"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/04/calf-stretch.jpg",
      videoUrl: "https://www.youtube.com/watch?v=M84JfvjTXpE",
      category: "coolDown",
      benefits: [
        "Reduces calf tightness after running",
        "Helps prevent Achilles tendon issues",
        "Improves ankle mobility",
        "Relieves foot pain"
      ],
      tips: [
        "Keep back heel down for the gastrocnemius stretch",
        "Bend the back knee slightly for the soleus stretch",
        "Ensure feet are pointing straight forward",
        "Don't bounce; hold the stretch steadily"
      ]
    },
    {
      id: "cool4",
      name: "Hip Flexor Stretch",
      description: "A stretch that targets the hip flexors which commonly tighten during running.",
      muscleGroups: ["hip flexors", "quads"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Kneel on your right knee with left foot flat on the floor in front of you",
        "Keep your back straight and core engaged",
        "Gently push your hips forward until you feel a stretch in front of right hip",
        "For a deeper stretch, raise your right arm overhead and lean slightly to the left",
        "Hold for 30-60 seconds",
        "Switch sides and repeat"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/05/hip-flexor-stretch.jpg",
      videoUrl: "https://www.youtube.com/watch?v=YQmpO9VT2X4",
      category: "coolDown",
      benefits: [
        "Relieves hip flexor tightness from running",
        "Improves hip extension for better stride length",
        "Helps prevent lower back pain",
        "Restores proper pelvic alignment"
      ],
      tips: [
        "Keep your front knee directly over your ankle",
        "Maintain an upright posture; don't lean forward",
        "Squeeze the glute of the stretching leg",
        "Place a cushion under your knee if uncomfortable"
      ]
    },
    {
      id: "cool5",
      name: "Piriformis Stretch",
      description: "A stretch that targets the piriformis muscle which can affect running form and contribute to sciatic pain.",
      muscleGroups: ["glutes", "hips"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit on the floor with both legs extended",
        "Bend your right knee and place right foot on outside of left knee",
        "Place left elbow on outside of right knee",
        "Gently twist torso to the right, applying light pressure with elbow",
        "Hold for 30-60 seconds",
        "Switch sides and repeat"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/01/piriformis-stretch.jpg",
      videoUrl: "https://www.youtube.com/watch?v=nRfmtcRx0sE",
      category: "coolDown",
      benefits: [
        "Relieves tightness in deep hip rotators",
        "Helps prevent sciatic nerve irritation",
        "Improves hip mobility for running",
        "Reduces lower back tension"
      ],
      tips: [
        "Keep your spine tall rather than rounding forward",
        "Use gentle pressure, don't force the rotation",
        "Breathe deeply and relax into the stretch",
        "If you feel any sharp pain, ease out of the stretch"
      ]
    }
  ]
};

interface RunningSpecificExercisesProps {
  category: 'warmUp' | 'strength' | 'plyometric' | 'coolDown';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
  onShowExerciseDetail?: (exercise: Exercise) => void;
}

export default function RunningSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-blue-50",
  maxExercises = 5,
  onShowExerciseDetail
}: RunningSpecificExercisesProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const exercises = RUNNING_EXERCISE_SETS[category];
  
  // Function to get exercise data directly from our hardcoded data
  const getExerciseData = (index: number) => {
    // Simply return the exercise at the given index
    return exercises[index];
  };
  
  // Use our hardcoded exercise data directly
  const exerciseData = exercises.slice(0, maxExercises);
  
  // Create a loading state for a brief moment to simulate data fetching
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading for a more natural UX
    const timer = setTimeout(() => {
      setIsDataLoading(false);
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
                    <div className="mt-3 pt-3 border-t">
                      {exercise.imageUrl && (
                        <div className="mb-3 overflow-hidden rounded-md">
                          <img 
                            src={exercise.imageUrl} 
                            alt={exercise.name} 
                            className="w-full object-cover h-40"
                          />
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
                        
                        <div className="flex justify-end">
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