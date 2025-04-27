import { Award, BookOpen, Brain, Briefcase, CreditCard, Heart, Lightbulb, MessageSquare, Scale, ShieldCheck } from "lucide-react";

// Types for learning pathways
export interface PathwayModule {
  id: string;
  title: string;
  jungleTitle?: string;
  description?: string;
  duration: number; // in minutes
  href?: string;
  completed?: boolean;
  selCompetencies?: string[];
  lifeDomains?: string[];
}

export interface LearningPathway {
  id: string;
  title: string;
  jungleTitle?: string;
  description: string;
  jungleDescription?: string;
  category: string;
  icon: any; // Lucide icon component
  modules: PathwayModule[];
  href?: string;
}

// Define the data
const pathwaysData: LearningPathway[] = [
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    jungleTitle: "Treasure Tracking Expedition",
    description: "Learn to manage your finances effectively and build wealth",
    jungleDescription: "Navigate the treacherous terrain of financial knowledge and discover hidden treasures",
    category: "financial",
    icon: CreditCard,
    href: "/learning/courses/economics",
    modules: [
      {
        id: "fin-1",
        title: "Budgeting Basics",
        jungleTitle: "Resource Mapping",
        duration: 30,
        href: "/learning/courses/economics?module=budgeting",
      },
      {
        id: "fin-2",
        title: "Understanding Credit Scores",
        jungleTitle: "Treasure Rating System",
        duration: 25,
        href: "/learning/courses/economics?module=credit",
      },
      {
        id: "fin-3",
        title: "Saving Strategies",
        jungleTitle: "Resource Stockpiling",
        duration: 20,
        href: "/learning/courses/economics?module=saving",
      },
      {
        id: "fin-4",
        title: "Investment Fundamentals",
        jungleTitle: "Treasure Multiplication Ritual",
        duration: 35,
        href: "/learning/courses/economics?module=investment",
      }
    ]
  },
  {
    id: "wellness-essentials",
    title: "Wellness Essentials",
    jungleTitle: "Vitality Oasis Journey",
    description: "Develop habits for physical and mental well-being",
    jungleDescription: "Discover the sacred healing arts of the jungle for mind and body balance",
    category: "wellness",
    icon: Heart,
    href: "/learning/courses/health-wellness",
    modules: [
      {
        id: "well-1",
        title: "Sleep Optimization",
        jungleTitle: "Rejuvenation Ritual",
        duration: 15,
        href: "/learning/courses/health-wellness?module=sleep",
      },
      {
        id: "well-2",
        title: "Stress Management",
        jungleTitle: "Mind Mist Clearing",
        duration: 20,
        href: "/learning/courses/health-wellness?module=stress",
      },
      {
        id: "well-3",
        title: "Nutrition Fundamentals",
        jungleTitle: "Jungle Sustenance Wisdom",
        duration: 25,
        href: "/learning/courses/health-wellness?module=nutrition",
      },
      {
        id: "well-4",
        title: "Building Exercise Habits",
        jungleTitle: "Strength Ritual Training",
        duration: 20,
        href: "/learning/courses/health-wellness?module=exercise",
      }
    ]
  },
  {
    id: "critical-thinking",
    title: "Critical Thinking",
    jungleTitle: "Path of Ancestral Wisdom",
    description: "Develop reasoning and analytical skills for better decision making",
    jungleDescription: "Master the ancient art of jungle logic to see through illusions and unveil truth",
    category: "career",
    icon: Brain,
    href: "/learning/courses/critical-thinking",
    modules: [
      {
        id: "ct-1",
        title: "Identifying Logical Fallacies",
        jungleTitle: "False Trail Detection",
        duration: 30,
        href: "/learning/courses/critical-thinking?module=fallacies",
      },
      {
        id: "ct-2",
        title: "Evidence Evaluation",
        jungleTitle: "Truth Stone Testing",
        duration: 25,
        href: "/learning/courses/critical-thinking?module=evidence",
      },
      {
        id: "ct-3",
        title: "Problem-Solving Framework",
        jungleTitle: "Path-Finding Ritual",
        duration: 35,
        href: "/learning/courses/critical-thinking?module=problem-solving",
      },
      {
        id: "ct-4",
        title: "Structured Reasoning",
        jungleTitle: "Logic Vine Weaving",
        duration: 30,
        href: "/learning/courses/critical-thinking?module=reasoning",
      }
    ]
  },
  {
    id: "communication-skills",
    title: "Communication Skills",
    jungleTitle: "Tribal Tongue Mastery",
    description: "Improve your verbal and written communication abilities",
    jungleDescription: "Learn the ancient arts of tribal communication to influence and connect",
    category: "career",
    icon: MessageSquare,
    href: "/learning/courses/conversation-skills",
    modules: [
      {
        id: "comm-1",
        title: "Active Listening",
        jungleTitle: "Whisper Catching",
        duration: 20,
        href: "/learning/courses/conversation-skills?module=listening",
      },
      {
        id: "comm-2",
        title: "Clear Expression",
        jungleTitle: "Jungle Call Projection",
        duration: 25,
        href: "/learning/courses/conversation-skills?module=expression",
      },
      {
        id: "comm-3",
        title: "Conflict Resolution",
        jungleTitle: "Peace Smoke Ritual",
        duration: 30,
        href: "/learning/courses/conflict-resolution",
      },
      {
        id: "comm-4",
        title: "Public Speaking",
        jungleTitle: "Tribal Gathering Address",
        duration: 35,
        href: "/learning/courses/conversation-skills?module=public-speaking",
      }
    ]
  },
  {
    id: "time-management",
    title: "Time Management",
    jungleTitle: "Sun Cycle Mastery",
    description: "Learn to prioritize tasks and use your time efficiently",
    jungleDescription: "Master the rhythm of the jungle to accomplish more within each sun cycle",
    category: "life-skills",
    icon: Award,
    href: "/learning/courses/time-management",
    modules: [
      {
        id: "time-1",
        title: "Prioritization Techniques",
        jungleTitle: "Quest Value Assessment",
        duration: 15,
        href: "/learning/courses/time-management?module=prioritization",
      },
      {
        id: "time-2",
        title: "Productivity Systems",
        jungleTitle: "Efficient Hunting Methods",
        duration: 25,
        href: "/learning/courses/time-management?module=productivity",
      },
      {
        id: "time-3",
        title: "Managing Distractions",
        jungleTitle: "Focus Trance Technique",
        duration: 20,
        href: "/learning/courses/time-management?module=distractions",
      },
      {
        id: "time-4",
        title: "Long-term Planning",
        jungleTitle: "Season Cycle Strategy",
        duration: 30,
        href: "/learning/courses/time-management?module=planning",
      }
    ]
  },
  {
    id: "home-maintenance",
    title: "Home Maintenance",
    jungleTitle: "Shelter Wisdom Path",
    description: "Learn essential skills for maintaining your living space",
    jungleDescription: "Master the arts of creating and maintaining shelters that withstand jungle trials",
    category: "life-skills",
    icon: ShieldCheck,
    href: "/learning/courses/home-maintenance",
    modules: [
      {
        id: "home-1",
        title: "Basic Plumbing Repairs",
        jungleTitle: "Water Channel Mastery",
        duration: 30,
        href: "/learning/courses/home-maintenance?module=plumbing",
      },
      {
        id: "home-2",
        title: "Electrical Safety",
        jungleTitle: "Lightning Power Control",
        duration: 25,
        href: "/learning/courses/home-maintenance?module=electrical",
      },
      {
        id: "home-3",
        title: "Seasonal Maintenance",
        jungleTitle: "Weather Defense Preparation",
        duration: 20,
        href: "/learning/courses/home-maintenance?module=seasonal",
      },
      {
        id: "home-4",
        title: "Furniture Repair",
        jungleTitle: "Comfort Crafting Skills",
        duration: 35,
        href: "/learning/courses/home-maintenance?module=furniture",
      }
    ]
  },
  {
    id: "decision-making",
    title: "Decision Making",
    jungleTitle: "Crossroads Wisdom",
    description: "Learn frameworks for making better decisions in all areas of life",
    jungleDescription: "Master the ancient wisdom of choosing the right path when facing jungle crossroads",
    category: "leadership",
    icon: Scale,
    href: "/learning/courses/decision-making",
    modules: [
      {
        id: "dec-1",
        title: "Evaluating Options",
        jungleTitle: "Path Assessment Ritual",
        duration: 20,
        href: "/learning/courses/decision-making?module=options",
      },
      {
        id: "dec-2",
        title: "Risk Assessment",
        jungleTitle: "Danger Sensing Technique",
        duration: 25,
        href: "/learning/courses/decision-making?module=risk",
      },
      {
        id: "dec-3",
        title: "Avoiding Cognitive Biases",
        jungleTitle: "Mind Trap Avoidance",
        duration: 30,
        href: "/learning/courses/decision-making?module=biases",
      },
      {
        id: "dec-4",
        title: "Intuition vs. Analysis",
        jungleTitle: "Spirit Whisper and Logic Balance",
        duration: 25,
        href: "/learning/courses/decision-making?module=intuition",
      }
    ]
  },
  {
    id: "interviewing",
    title: "Interview Skills",
    jungleTitle: "Tribal Council Trial",
    description: "Master techniques for successful job interviews",
    jungleDescription: "Learn the ancient rituals of proving your worth to tribal leaders",
    category: "career",
    icon: Briefcase,
    href: "/learning/life-skills?section=interview",
    modules: [
      {
        id: "int-1",
        title: "Interview Preparation",
        jungleTitle: "Trial Preparation Ritual",
        duration: 25,
        href: "/learning/life-skills?section=interview&module=preparation",
      },
      {
        id: "int-2",
        title: "Common Questions",
        jungleTitle: "Ancient Challenge Responses",
        duration: 30,
        href: "/learning/life-skills?section=interview&module=questions",
      },
      {
        id: "int-3",
        title: "Body Language",
        jungleTitle: "Confidence Posture Mastery",
        duration: 15,
        href: "/learning/life-skills?section=interview&module=body-language",
      },
      {
        id: "int-4",
        title: "Follow-up Techniques",
        jungleTitle: "Alliance Reinforcement Ritual",
        duration: 20,
        href: "/learning/life-skills?section=interview&module=follow-up",
      }
    ]
  },
  {
    id: "creativity",
    title: "Creative Thinking",
    jungleTitle: "Vision Quest Journey",
    description: "Develop your ability to think innovatively and generate ideas",
    jungleDescription: "Unlock the ancient arts of seeing beyond the visible to discover new paths",
    category: "life-skills",
    icon: Lightbulb,
    href: "/learning/life-skills?section=creativity",
    modules: [
      {
        id: "cre-1",
        title: "Breaking Mental Blocks",
        jungleTitle: "Mind Vine Cutting",
        duration: 20,
        href: "/learning/life-skills?section=creativity&module=mental-blocks",
      },
      {
        id: "cre-2",
        title: "Idea Generation Methods",
        jungleTitle: "Dream Seed Planting",
        duration: 25,
        href: "/learning/life-skills?section=creativity&module=idea-generation",
      },
      {
        id: "cre-3",
        title: "Combining Concepts",
        jungleTitle: "Element Fusion Ritual",
        duration: 15,
        href: "/learning/life-skills?section=creativity&module=combining",
      },
      {
        id: "cre-4",
        title: "Design Thinking",
        jungleTitle: "Creation Pattern Discovery",
        duration: 30,
        href: "/learning/life-skills?section=creativity&module=design-thinking",
      }
    ]
  },
  {
    id: "learning-techniques",
    title: "Learning Techniques",
    jungleTitle: "Knowledge Absorption Mastery",
    description: "Discover more effective ways to learn and retain information",
    jungleDescription: "Ancient wisdom on capturing and preserving knowledge from jungle discoveries",
    category: "life-skills",
    icon: BookOpen,
    href: "/learning/life-skills?section=learning",
    modules: [
      {
        id: "learn-1",
        title: "Memory Techniques",
        jungleTitle: "Mind Palace Construction",
        duration: 25,
        href: "/learning/life-skills?section=learning&module=memory",
      },
      {
        id: "learn-2",
        title: "Note-Taking Methods",
        jungleTitle: "Knowledge Etching Ritual",
        duration: 20,
        href: "/learning/life-skills?section=learning&module=notes",
      },
      {
        id: "learn-3",
        title: "Active Recall",
        jungleTitle: "Vision Quest Recollection",
        duration: 15,
        href: "/learning/life-skills?section=learning&module=recall",
      },
      {
        id: "learn-4",
        title: "Teaching to Learn",
        jungleTitle: "Wisdom Transfer Ceremony",
        duration: 30,
        href: "/learning/life-skills?section=learning&module=teaching",
      }
    ]
  }
];

// Export the data with two names
export const PATHWAYS_DATA = pathwaysData;
export const learningPathways = pathwaysData;