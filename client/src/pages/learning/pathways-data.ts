import React from "react";
import { Award, BookOpen, Clock, Dumbbell, Flame, Rocket, Shield, Target } from "lucide-react";
import { LearningPathway } from "@/lib/learning-progress";

// Sample learning pathways data
export const learningPathways: LearningPathway[] = [
  // Foundation Pathways (No prerequisites)
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    description: "Develop essential financial skills and knowledge",
    category: "finance",
    progress: 50,
    icon: React.createElement(Award, { className: "h-5 w-5" }),
    modules: [
      { id: "econ-basics", title: "Economics Basics", path: "/learning/courses/economics", complete: true },
      { id: "budget", title: "Budgeting Essentials", path: "/finance/budget", complete: true },
      { id: "utilities", title: "Understanding Utilities", path: "/learning/courses/utilities-guide", complete: false },
      { id: "shopping", title: "Smart Shopping", path: "/learning/courses/shopping-buddy", complete: false },
    ]
  },
  {
    id: "cognitive-skills",
    title: "Cognitive Skills",
    description: "Develop analytical thinking and decision-making abilities",
    category: "learning",
    progress: 40,
    icon: React.createElement(Target, { className: "h-5 w-5" }),
    modules: [
      { id: "critical-thinking", title: "Critical Thinking", path: "/learning/courses/critical-thinking", complete: true },
      { id: "decision-making", title: "Decision Making", path: "/learning/courses/decision-making", complete: true },
      { id: "time-management", title: "Time Management", path: "/learning/courses/time-management", complete: false },
      { id: "conflict-resolution", title: "Conflict Resolution", path: "/learning/courses/conflict-resolution", complete: false },
      { id: "coping-failure", title: "Coping With Failure", path: "/learning/courses/coping-with-failure", complete: false },
      { id: "positive-habits", title: "Forming Positive Habits", path: "/learning/courses/forming-positive-habits", complete: false },
    ]
  },
  {
    id: "communication-skills",
    title: "Communication Skills",
    description: "Improve your ability to communicate effectively",
    category: "learning",
    progress: 25,
    icon: React.createElement(BookOpen, { className: "h-5 w-5" }),
    modules: [
      { id: "conversation-basics", title: "Conversation Skills", path: "/learning/courses/conversation-skills", complete: true },
      { id: "active-listening", title: "Active Listening", path: "/learning/courses/active-listening", complete: false },
      { id: "public-speaking", title: "Public Speaking", path: "/learning/courses/public-speaking", complete: false },
      { id: "written-communication", title: "Written Communication", path: "/learning/courses/written-communication", complete: false },
    ]
  },
  
  // Intermediate Pathways (Single prerequisite)
  {
    id: "cooking-skills",
    title: "Cooking Skills",
    description: "Learn culinary techniques and meal preparation",
    category: "learning",
    progress: 75,
    icon: React.createElement(BookOpen, { className: "h-5 w-5" }),
    prerequisites: ["financial-literacy"], // Managing food budgets requires financial literacy
    modules: [
      { id: "cooking-basics", title: "Cooking Basics", path: "/learning/courses/cooking-basics", complete: true },
      { id: "meal-planning", title: "Meal Planning", path: "/wellness/meal-planning", complete: true },
      { id: "nutrition", title: "Nutrition Essentials", path: "/wellness/nutrition", complete: true },
      { id: "advanced-cooking", title: "Advanced Techniques", path: "/learning/courses/cooking-advanced", complete: false },
      { id: "special-diets", title: "Special Diets", path: "/wellness/special-diets", complete: false },
      { id: "food-safety", title: "Food Safety", path: "/wellness/food-safety", complete: false },
    ]
  },
  {
    id: "home-maintenance",
    title: "Home Maintenance",
    description: "Essential skills for maintaining your living space",
    category: "learning",
    progress: 33,
    icon: React.createElement(Target, { className: "h-5 w-5" }),
    prerequisites: ["financial-literacy"], // Home maintenance involves budgeting for repairs
    modules: [
      { id: "home-basics", title: "Home Maintenance Basics", path: "/learning/courses/home-maintenance", complete: true },
      { id: "repair-assistant", title: "Repair Assistant", path: "/learning/courses/repair-assistant", complete: false },
      { id: "home-safety", title: "Home Safety", path: "/emergency/home-safety", complete: false },
    ]
  },
  {
    id: "wellness-routine",
    title: "Wellness Routine",
    description: "Build habits for physical and mental wellbeing",
    category: "wellness",
    progress: 20,
    icon: React.createElement(Flame, { className: "h-5 w-5" }),
    prerequisites: ["cognitive-skills"], // Mental wellness builds on cognitive skills
    modules: [
      { id: "health-wellness", title: "Health & Wellness", path: "/learning/courses/health-wellness", complete: true },
      { id: "meditation", title: "Meditation Basics", path: "/wellness/meditation", complete: false },
      { id: "sleep-hygiene", title: "Sleep Hygiene", path: "/wellness/sleep", complete: false },
      { id: "stress-management", title: "Stress Management", path: "/wellness/stress", complete: false },
      { id: "positive-habits", title: "Forming Positive Habits", path: "/learning/courses/forming-positive-habits", complete: false },
    ]
  },
  {
    id: "fitness-journey",
    title: "Fitness Journey",
    description: "Personalized approach to physical fitness",
    category: "fitness",
    progress: 15,
    icon: React.createElement(Dumbbell, { className: "h-5 w-5" }),
    prerequisites: ["wellness-routine"], // Fitness follows general wellness
    modules: [
      { id: "fitness-basics", title: "Fitness Fundamentals", path: "/active/basics", complete: true },
      { id: "cardio", title: "Cardio Training", path: "/active/cardio", complete: false },
      { id: "strength", title: "Strength Building", path: "/active/strength", complete: false },
      { id: "yoga", title: "Yoga Practice", path: "/active/yoga", complete: false },
      { id: "fitness-tracking", title: "Progress Tracking", path: "/active/tracking", complete: false },
      { id: "recovery", title: "Rest & Recovery", path: "/active/recovery", complete: false },
    ]
  },
  
  // Advanced Pathways (Multiple prerequisites)
  {
    id: "professional-skills",
    title: "Professional Skills",
    description: "Develop workplace and career advancement skills",
    category: "career",
    progress: 40,
    icon: React.createElement(Target, { className: "h-5 w-5" }),
    prerequisites: ["cognitive-skills", "communication-skills"], // Professional skills require both thinking and communication
    modules: [
      { id: "conflict-resolution", title: "Conflict Resolution", path: "/learning/courses/conflict-resolution", complete: true },
      { id: "time-management", title: "Time Management", path: "/learning/courses/time-management", complete: true },
      { id: "conversation", title: "Conversation Skills", path: "/learning/courses/conversation-skills", complete: false },
      { id: "decision-making", title: "Decision Making", path: "/learning/courses/decision-making", complete: false },
      { id: "coping-failure", title: "Coping with Failure", path: "/learning/courses/coping-with-failure", complete: false },
    ]
  },
  {
    id: "emergency-prep",
    title: "Emergency Preparedness",
    description: "Essential skills for emergency situations",
    category: "emergency",
    progress: 0,
    icon: React.createElement(Shield, { className: "h-5 w-5" }),
    prerequisites: ["home-maintenance", "cognitive-skills"], // Emergency prep builds on home safety and quick thinking
    modules: [
      { id: "first-aid", title: "First Aid Basics", path: "/emergency/first-aid", complete: false },
      { id: "household-safety", title: "Household Safety", path: "/emergency/household", complete: false },
      { id: "emergency-plan", title: "Emergency Plan", path: "/emergency/planning", complete: false },
    ]
  },
];