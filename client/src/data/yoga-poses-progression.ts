import { YogaPoseProgression, YogaChallenge } from '../../../shared/yoga-progression';

// Define the yoga poses database with progression details
export const yogaPoses: YogaPoseProgression[] = [
  // LEVEL 1 - BEGINNER POSES
  {
    id: "mountain",
    name: "Mountain Pose",
    sanskritName: "Tadasana",
    description: "A foundational standing pose that establishes proper posture and balance.",
    benefits: [
      "Improves posture",
      "Strengthens thighs, knees, and ankles",
      "Increases body awareness",
      "Calms the mind"
    ],
    difficulty: "beginner",
    category: "standing",
    xpValue: 10,
    levelRequired: 1,
    imageUrl: "/images/yoga/mountain.jpg"
  },
  {
    id: "child",
    name: "Child's Pose",
    sanskritName: "Balasana",
    description: "A restful pose that gently stretches the back and promotes relaxation.",
    benefits: [
      "Releases tension in back, shoulders, and chest",
      "Calms the mind and reduces stress",
      "Gently stretches hips, thighs, and ankles",
      "Relieves back and neck pain"
    ],
    difficulty: "beginner",
    category: "resting",
    xpValue: 10,
    levelRequired: 1,
    imageUrl: "/images/yoga/child.jpg"
  },
  {
    id: "corpse",
    name: "Corpse Pose",
    sanskritName: "Savasana",
    description: "A relaxation pose typically practiced at the end of a yoga session.",
    benefits: [
      "Deeply relaxes the entire body",
      "Reduces blood pressure and stress",
      "Calms the nervous system",
      "Promotes mindfulness"
    ],
    difficulty: "beginner",
    category: "resting",
    xpValue: 5,
    levelRequired: 1,
    imageUrl: "/images/yoga/corpse.jpg"
  },
  
  // LEVEL 2 POSES
  {
    id: "downward_dog",
    name: "Downward-Facing Dog",
    sanskritName: "Adho Mukha Svanasana",
    description: "A foundational pose that stretches and strengthens the entire body.",
    benefits: [
      "Strengthens arms, shoulders, and legs",
      "Stretches hamstrings, calves, and shoulders",
      "Energizes the body",
      "Improves circulation"
    ],
    difficulty: "beginner",
    category: "foundation",
    xpValue: 20,
    prerequisites: ["mountain"],
    levelRequired: 2,
    imageUrl: "/images/yoga/downward_dog.jpg"
  },
  {
    id: "cat_cow",
    name: "Cat-Cow Stretch",
    sanskritName: "Marjaryasana-Bitilasana",
    description: "A gentle flow between two poses that warms up the spine.",
    benefits: [
      "Improves spinal flexibility",
      "Stretches the torso and neck",
      "Massages internal organs",
      "Calms the mind"
    ],
    difficulty: "beginner",
    category: "flow",
    xpValue: 15,
    levelRequired: 2,
    imageUrl: "/images/yoga/cat_cow.jpg"
  },
  {
    id: "forward_fold",
    name: "Standing Forward Fold",
    sanskritName: "Uttanasana",
    description: "A standing pose that stretches the entire back of the body.",
    benefits: [
      "Stretches hamstrings, calves, and hips",
      "Relieves tension in spine and neck",
      "Calms the mind and reduces stress",
      "Stimulates liver and kidneys"
    ],
    difficulty: "beginner",
    category: "forward_bend",
    xpValue: 15,
    prerequisites: ["mountain"],
    levelRequired: 2,
    imageUrl: "/images/yoga/forward_fold.jpg"
  },
  
  // LEVEL 3 POSES
  {
    id: "tree",
    name: "Tree Pose",
    sanskritName: "Vrksasana",
    description: "A balancing pose that improves focus and stability.",
    benefits: [
      "Improves balance and focus",
      "Strengthens ankles, calves, thighs, and spine",
      "Opens the hips",
      "Builds concentration"
    ],
    difficulty: "beginner",
    category: "balance",
    xpValue: 25,
    prerequisites: ["mountain"],
    levelRequired: 3,
    imageUrl: "/images/yoga/tree.jpg"
  },
  {
    id: "warrior_1",
    name: "Warrior I",
    sanskritName: "Virabhadrasana I",
    description: "A powerful standing pose that builds strength and stability.",
    benefits: [
      "Strengthens shoulders, arms, and back muscles",
      "Tones abdomen, ankles, and thighs",
      "Improves focus and stability",
      "Opens chest and lungs"
    ],
    difficulty: "beginner",
    category: "standing",
    xpValue: 30,
    prerequisites: ["mountain", "forward_fold"],
    levelRequired: 3,
    imageUrl: "/images/yoga/warrior_1.jpg"
  },
  {
    id: "warrior_2",
    name: "Warrior II",
    sanskritName: "Virabhadrasana II",
    description: "A powerful standing pose that builds strength and stamina.",
    benefits: [
      "Strengthens legs, ankles, and feet",
      "Opens hips and chest",
      "Improves endurance and concentration",
      "Stimulates abdominal organs"
    ],
    difficulty: "beginner",
    category: "standing",
    xpValue: 30,
    prerequisites: ["warrior_1"],
    levelRequired: 3,
    imageUrl: "/images/yoga/warrior_2.jpg"
  },
  
  // LEVEL 4 POSES
  {
    id: "triangle",
    name: "Triangle Pose",
    sanskritName: "Trikonasana",
    description: "A standing pose that stretches and strengthens the whole body.",
    benefits: [
      "Stretches legs, spine, and chest",
      "Strengthens thighs, knees, and ankles",
      "Reduces stress and anxiety",
      "Stimulates internal organs"
    ],
    difficulty: "intermediate",
    category: "standing",
    xpValue: 40,
    prerequisites: ["warrior_2"],
    levelRequired: 4,
    imageUrl: "/images/yoga/triangle.jpg"
  },
  {
    id: "chair",
    name: "Chair Pose",
    sanskritName: "Utkatasana",
    description: "A powerful standing pose that strengthens the entire body.",
    benefits: [
      "Strengthens thighs, ankles, and spine",
      "Tones shoulders and arms",
      "Stimulates heart and diaphragm",
      "Builds heat and endurance"
    ],
    difficulty: "intermediate",
    category: "standing",
    xpValue: 35,
    prerequisites: ["mountain"],
    levelRequired: 4,
    imageUrl: "/images/yoga/chair.jpg"
  },
  {
    id: "bridge",
    name: "Bridge Pose",
    sanskritName: "Setu Bandha Sarvangasana",
    description: "A gentle backbend that opens the chest and strengthens the back.",
    benefits: [
      "Strengthens back, glutes, and hamstrings",
      "Opens chest and shoulders",
      "Calms the mind",
      "Stimulates thyroid and improves digestion"
    ],
    difficulty: "intermediate",
    category: "backbend",
    xpValue: 35,
    levelRequired: 4,
    imageUrl: "/images/yoga/bridge.jpg"
  },
  
  // LEVEL 5 POSES
  {
    id: "half_moon",
    name: "Half Moon Pose",
    sanskritName: "Ardha Chandrasana",
    description: "A challenging balance pose that builds focus and strength.",
    benefits: [
      "Strengthens ankles, legs, and spine",
      "Improves coordination and balance",
      "Opens hips and chest",
      "Relieves stress"
    ],
    difficulty: "intermediate",
    category: "balance",
    xpValue: 50,
    prerequisites: ["triangle", "warrior_2"],
    levelRequired: 5,
    imageUrl: "/images/yoga/half_moon.jpg"
  },
  {
    id: "eagle",
    name: "Eagle Pose",
    sanskritName: "Garudasana",
    description: "A complex balancing pose that improves focus and body awareness.",
    benefits: [
      "Improves balance and concentration",
      "Strengthens legs, ankles, and calves",
      "Opens shoulders and upper back",
      "Improves digestion"
    ],
    difficulty: "intermediate",
    category: "balance",
    xpValue: 55,
    prerequisites: ["tree"],
    levelRequired: 5,
    imageUrl: "/images/yoga/eagle.jpg"
  },
  {
    id: "pigeon",
    name: "Pigeon Pose",
    sanskritName: "Eka Pada Rajakapotasana",
    description: "A deep hip opener that releases stored tension.",
    benefits: [
      "Opens hip flexors and rotators",
      "Stretches thighs and groin",
      "Relieves sciatic pain",
      "Stimulates internal organs"
    ],
    difficulty: "intermediate",
    category: "hip_opener",
    xpValue: 50,
    prerequisites: ["downward_dog"],
    levelRequired: 5,
    imageUrl: "/images/yoga/pigeon.jpg"
  },
  
  // LEVEL 6 POSES
  {
    id: "crow",
    name: "Crow Pose",
    sanskritName: "Bakasana",
    description: "An arm balance that builds core strength and concentration.",
    benefits: [
      "Strengthens wrists, arms, and shoulders",
      "Tones abdominal muscles",
      "Improves balance and focus",
      "Builds confidence"
    ],
    difficulty: "advanced",
    category: "arm_balance",
    xpValue: 70,
    prerequisites: ["chair"],
    levelRequired: 6,
    imageUrl: "/images/yoga/crow.jpg"
  },
  {
    id: "side_plank",
    name: "Side Plank",
    sanskritName: "Vasisthasana",
    description: "A challenging pose that builds arm and core strength.",
    benefits: [
      "Strengthens arms, legs, and core",
      "Improves balance and focus",
      "Tones entire side body",
      "Improves willpower"
    ],
    difficulty: "advanced",
    category: "balance",
    xpValue: 65,
    prerequisites: ["downward_dog"],
    levelRequired: 6,
    imageUrl: "/images/yoga/side_plank.jpg"
  },
  {
    id: "boat",
    name: "Boat Pose",
    sanskritName: "Navasana",
    description: "A core-strengthening pose that builds concentration.",
    benefits: [
      "Strengthens core, spine, and hip flexors",
      "Improves digestion",
      "Stimulates thyroid and kidneys",
      "Reduces stress"
    ],
    difficulty: "advanced",
    category: "core",
    xpValue: 60,
    levelRequired: 6,
    imageUrl: "/images/yoga/boat.jpg"
  },
  
  // Add more poses for higher levels as needed...
];

// Define yoga challenges that combine poses into progressive sequences
export const yogaChallenges: YogaChallenge[] = [
  {
    id: "beginner_foundations",
    name: "Beginner's Foundation Challenge",
    description: "Master the fundamental poses that form the basis of a yoga practice.",
    poses: ["mountain", "child", "corpse", "downward_dog", "cat_cow"],
    difficulty: "beginner",
    xpReward: 100,
    levelRequired: 1,
    durationDays: 7,
    badgeImageUrl: "/images/badges/beginner_foundations.png"
  },
  {
    id: "standing_strong",
    name: "Standing Strong Challenge",
    description: "Build strength and stability through standing poses.",
    poses: ["mountain", "warrior_1", "warrior_2", "triangle", "chair"],
    difficulty: "beginner",
    xpReward: 150,
    levelRequired: 3,
    durationDays: 10,
    badgeImageUrl: "/images/badges/standing_strong.png"
  },
  {
    id: "balance_master",
    name: "Balance Master Challenge",
    description: "Improve focus and stability through balancing poses.",
    poses: ["tree", "eagle", "half_moon", "warrior_3"],
    difficulty: "intermediate",
    xpReward: 200,
    levelRequired: 5,
    durationDays: 14,
    badgeImageUrl: "/images/badges/balance_master.png"
  },
  {
    id: "core_power",
    name: "Core Power Challenge",
    description: "Strengthen your core and find your center.",
    poses: ["boat", "crow", "side_plank"],
    difficulty: "advanced",
    xpReward: 250,
    levelRequired: 6,
    durationDays: 14,
    badgeImageUrl: "/images/badges/core_power.png"
  }
];

// Helper function to get a pose by ID
export function getPoseById(id: string): YogaPoseProgression | undefined {
  return yogaPoses.find(pose => pose.id === id);
}

// Helper function to get poses by level
export function getPosesByLevel(level: number): YogaPoseProgression[] {
  return yogaPoses.filter(pose => pose.levelRequired <= level);
}

// Helper function to get available challenges by level
export function getChallengesByLevel(level: number): YogaChallenge[] {
  return yogaChallenges.filter(challenge => challenge.levelRequired <= level);
}

// Helper function to check if a pose is unlocked based on prerequisites and level
export function isPoseUnlocked(pose: YogaPoseProgression, userProgression: any): boolean {
  // Check if user has required level
  if (userProgression.currentLevel < pose.levelRequired) {
    return false;
  }
  
  // Check if user has completed prerequisites
  if (pose.prerequisites && pose.prerequisites.length > 0) {
    for (const prereqId of pose.prerequisites) {
      const prereqAchievement = userProgression.poseAchievements[prereqId];
      if (!prereqAchievement || prereqAchievement.masteryLevel < 3) {
        return false;
      }
    }
  }
  
  return true;
}