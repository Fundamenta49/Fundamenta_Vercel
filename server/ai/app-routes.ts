/**
 * Map of application routes with associated metadata.
 * Used by the AI orchestrator to understand navigation context and recommend appropriate sections.
 */

export interface RouteInfo {
  name: string;
  description: string;
  categories: string[];
  keywords: string[];
}

export const applicationRoutes: Record<string, RouteInfo> = {
  "/": {
    name: "Home",
    description: "Main dashboard with overview of all sections",
    categories: ["all"],
    keywords: ["home", "dashboard", "main", "overview", "start"]
  },
  
  "/finance": {
    name: "Finance Coach",
    description: "Financial planning, budgeting, investment guidance, and financial literacy",
    categories: ["finance"],
    keywords: ["money", "budget", "invest", "financial", "savings", "debt", "loan", "mortgage", "financial literacy", "financial education", "learn finance", "financial learning"]
  },
  
  "/finance/budget": {
    name: "Budget Planner",
    description: "Tools for creating and managing personal budgets",
    categories: ["finance"],
    keywords: ["budget", "expenses", "income", "spending", "tracking", "plan"]
  },
  
  "/finance/investments": {
    name: "Investment Guide",
    description: "Education on investment options and strategies",
    categories: ["finance"],
    keywords: ["invest", "stocks", "bonds", "portfolio", "retirement", "401k", "ira"]
  },
  
  "/finance/calculator": {
    name: "Financial Calculator",
    description: "Tools for calculating loans, mortgages, and other financial scenarios",
    categories: ["finance"],
    keywords: ["calculate", "loan", "mortgage", "interest", "payment", "debt", "refinance"]
  },
  
  "/career": {
    name: "Career Coach",
    description: "Career advancement, job search, and professional development",
    categories: ["career"],
    keywords: ["job", "career", "professional", "interview", "resume", "cv", "work", "employment"]
  },
  
  "/career/resume": {
    name: "Resume Builder",
    description: "Tools for creating and improving professional resumes",
    categories: ["career"],
    keywords: ["resume", "cv", "job", "application", "skills", "experience", "education"]
  },
  
  "/career/interview": {
    name: "Interview Prep",
    description: "Practice and tips for job interviews",
    categories: ["career"],
    keywords: ["interview", "questions", "practice", "preparation", "answers", "behavioral"]
  },
  
  "/career/skills": {
    name: "Skills Assessment",
    description: "Tools to identify and improve professional skills",
    categories: ["career"],
    keywords: ["skills", "assessment", "development", "learning", "improvement", "professional"]
  },
  
  "/wellness": {
    name: "Wellness Coach",
    description: "Mental health, meditation, and emotional wellbeing",
    categories: ["wellness"],
    keywords: ["mental", "health", "meditation", "stress", "anxiety", "relaxation", "mindfulness", "therapy"]
  },
  
  "/wellness/meditation": {
    name: "Meditation Guide",
    description: "Guided meditation sessions and mindfulness practices",
    categories: ["wellness"],
    keywords: ["meditation", "mindfulness", "breathing", "calm", "relax", "focus", "practice"]
  },
  
  "/wellness/journal": {
    name: "Wellness Journal",
    description: "Tools for tracking mood, gratitude, and personal growth",
    categories: ["wellness"],
    keywords: ["journal", "diary", "mood", "tracking", "gratitude", "reflection", "emotions"]
  },
  
  "/wellness/assessment": {
    name: "Wellness Assessment",
    description: "Evaluate current mental and emotional wellbeing",
    categories: ["wellness"],
    keywords: ["assessment", "evaluation", "check", "mental", "health", "wellbeing", "status"]
  },
  
  "/learning": {
    name: "Learning Coach",
    description: "Education resources, study techniques, and knowledge acquisition",
    categories: ["learning"],
    keywords: ["learn", "study", "education", "knowledge", "skills", "academic", "courses"]
  },
  
  "/learning/courses": {
    name: "Course Library",
    description: "Browse available learning courses and materials",
    categories: ["learning"],
    keywords: ["courses", "classes", "lessons", "tutorials", "education", "learning", "library"]
  },
  
  "/learning/study": {
    name: "Study Techniques",
    description: "Effective methods for learning and retention",
    categories: ["learning"],
    keywords: ["study", "techniques", "methods", "memory", "retention", "focus", "concentration"]
  },
  
  "/learning/progress": {
    name: "Learning Progress",
    description: "Track educational achievements and set goals",
    categories: ["learning"],
    keywords: ["progress", "tracking", "goals", "achievements", "milestones", "education", "learning"]
  },
  
  "/emergency": {
    name: "Emergency Guide",
    description: "Critical information and resources for emergency situations",
    categories: ["emergency"],
    keywords: ["emergency", "urgent", "crisis", "help", "accident", "medical", "immediate"]
  },
  
  "/emergency/first-aid": {
    name: "First Aid Guide",
    description: "Basic first aid instructions for common emergencies",
    categories: ["emergency"],
    keywords: ["first", "aid", "medical", "injury", "treatment", "emergency", "wound", "CPR"]
  },
  
  "/emergency/contacts": {
    name: "Emergency Contacts",
    description: "Important contacts and resources for emergency situations",
    categories: ["emergency"],
    keywords: ["contacts", "numbers", "emergency", "police", "fire", "ambulance", "hospital", "poison"]
  },
  
  "/cooking": {
    name: "Cooking Assistant",
    description: "Recipes, meal planning, and culinary techniques",
    categories: ["cooking"],
    keywords: ["cook", "recipe", "food", "meal", "kitchen", "culinary", "baking", "ingredients"]
  },
  
  "/cooking/recipes": {
    name: "Recipe Library",
    description: "Browse and search for cooking recipes",
    categories: ["cooking"],
    keywords: ["recipes", "dishes", "meals", "cooking", "instructions", "ingredients", "cuisine"]
  },
  
  "/cooking/meal-plan": {
    name: "Meal Planner",
    description: "Tools for planning meals and creating shopping lists",
    categories: ["cooking"],
    keywords: ["meal", "plan", "planning", "schedule", "grocery", "shopping", "list", "diet"]
  },
  
  "/cooking/techniques": {
    name: "Cooking Techniques",
    description: "Learn fundamental cooking methods and skills",
    categories: ["cooking"],
    keywords: ["techniques", "methods", "skills", "cooking", "kitchen", "basics", "fundamentals"]
  },
  
  "/fitness": {
    name: "Fitness Coach",
    description: "Exercise routines, nutrition advice, and physical wellness",
    categories: ["fitness"],
    keywords: ["fitness", "exercise", "workout", "gym", "training", "health", "physical", "strength"]
  },
  
  "/fitness/workouts": {
    name: "Workout Library",
    description: "Browse exercise routines and workout plans",
    categories: ["fitness"],
    keywords: ["workouts", "exercises", "routines", "training", "sets", "reps", "fitness", "program"]
  },
  
  "/fitness/nutrition": {
    name: "Nutrition Guide",
    description: "Healthy eating advice and nutritional information",
    categories: ["fitness"],
    keywords: ["nutrition", "diet", "food", "eating", "healthy", "calories", "macros", "meals"]
  },
  
  "/fitness/progress": {
    name: "Fitness Tracker",
    description: "Track workout progress and physical measurements",
    categories: ["fitness"],
    keywords: ["tracker", "progress", "measurements", "goals", "weight", "fitness", "stats", "log"]
  },
  
  "/settings": {
    name: "Settings",
    description: "Application preferences and account settings",
    categories: ["all"],
    keywords: ["settings", "preferences", "account", "profile", "options", "configuration"]
  },
  
  "/help": {
    name: "Help Center",
    description: "Support resources and application guidance",
    categories: ["all"],
    keywords: ["help", "support", "guide", "tutorial", "assistance", "documentation", "faq"]
  }
};