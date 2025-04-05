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
  },
  
  // Special feature routes
  "/finance/mortgage": {
    name: "Mortgage Calculator",
    description: "Calculate and compare mortgage options with detailed payment breakdowns",
    categories: ["finance"],
    keywords: ["mortgage", "loan", "home loan", "house", "payment", "interest", "principal", "down payment", "closing costs"]
  },
  
  "/active": {
    name: "Active Fitness Tracker",
    description: "Track and analyze your physical activities and exercises",
    categories: ["fitness", "wellness"],
    keywords: ["active", "fitness", "exercise", "tracking", "activity", "workout", "movement", "progress"]
  },
  
  "/yoga-test": {
    name: "Yoga Pose Assessment",
    description: "Test and improve your yoga poses with AI guidance",
    categories: ["fitness", "wellness"],
    keywords: ["yoga", "pose", "assessment", "flexibility", "strength", "balance", "form"]
  },
  
  "/yoga-pose-analysis": {
    name: "Yoga Pose Analysis",
    description: "Get detailed analysis and feedback on your yoga pose form",
    categories: ["fitness", "wellness"],
    keywords: ["yoga", "pose", "analysis", "feedback", "form", "technique", "improvement"]
  },
  
  "/yoga-progression": {
    name: "Yoga Progression Tracker",
    description: "Track your progress and development in yoga practice over time",
    categories: ["fitness", "wellness"],
    keywords: ["yoga", "progression", "improvement", "journey", "practice", "development", "tracking"]
  },
  
  "/fundi-showcase": {
    name: "Fundi Features Showcase",
    description: "Explore and test the full range of Fundi's capabilities",
    categories: ["all"],
    keywords: ["fundi", "showcase", "features", "capabilities", "assistant", "demo", "tour", "introduction"]
  },
  
  // Home buying and finance tools
  "/finance/mortgage-calculator": {
    name: "Mortgage Calculator",
    description: "Advanced mortgage calculation with amortization and payment breakdowns",
    categories: ["finance"],
    keywords: ["mortgage", "calculator", "loan", "home buying", "real estate", "amortization", "interest", "principal"]
  },
  
  "/finance/budget-planner": {
    name: "Budget Planner",
    description: "Create and manage personal or household budgets with category-based tracking",
    categories: ["finance"],
    keywords: ["budget", "planner", "spending", "expenses", "income", "financial planning", "money management"]
  },
  
  "/finance/investment-tracker": {
    name: "Investment Portfolio Tracker",
    description: "Monitor and analyze investment performance across different assets",
    categories: ["finance"],
    keywords: ["investment", "tracker", "portfolio", "stocks", "bonds", "mutual funds", "returns", "performance"]
  },
  
  "/finance/loan-comparison": {
    name: "Loan Comparison Tool",
    description: "Compare different loan options with detailed cost breakdowns",
    categories: ["finance"],
    keywords: ["loan", "comparison", "interest rates", "terms", "financing", "debt", "borrowing"]
  },
  
  "/finance/retirement-calculator": {
    name: "Retirement Calculator",
    description: "Plan for retirement by projecting savings, expenses, and income",
    categories: ["finance"],
    keywords: ["retirement", "calculator", "savings", "401k", "IRA", "pension", "future planning"]
  },
  
  "/finance/debt-payoff-planner": {
    name: "Debt Payoff Planner",
    description: "Create strategies to eliminate debt using snowball or avalanche methods",
    categories: ["finance"],
    keywords: ["debt", "payoff", "planner", "credit card", "loan", "interest", "snowball", "avalanche"]
  },
  
  // Career development tools
  "/career/resume-builder": {
    name: "Resume Builder",
    description: "Create professional resumes with customizable templates and AI assistance",
    categories: ["career"],
    keywords: ["resume", "builder", "CV", "job application", "career", "employment", "hiring"]
  },
  
  "/career/interview-prep": {
    name: "Interview Preparation",
    description: "Practice common interview questions with feedback and guidance",
    categories: ["career"],
    keywords: ["interview", "preparation", "questions", "answers", "job", "hiring", "practice"]
  },
  
  "/career/job-search": {
    name: "Job Search Strategies",
    description: "Tools and resources for effective job hunting and applications",
    categories: ["career"],
    keywords: ["job", "search", "employment", "application", "career", "hiring", "recruitment"]
  },
  
  "/career/networking": {
    name: "Professional Networking Guide",
    description: "Strategies and templates for building professional connections",
    categories: ["career"],
    keywords: ["networking", "professional", "connections", "career", "LinkedIn", "contacts", "relationships"]
  },
  
  "/career/professional-development": {
    name: "Professional Development Plan",
    description: "Create personalized plans for career advancement and skill acquisition",
    categories: ["career"],
    keywords: ["professional", "development", "career growth", "skills", "advancement", "training", "education"]
  },
  
  // Wellness enhancement tools
  "/wellness/stress-management": {
    name: "Stress Management Techniques",
    description: "Practical strategies for reducing and managing stress",
    categories: ["wellness", "mental health"],
    keywords: ["stress", "management", "anxiety", "relaxation", "techniques", "coping", "mindfulness"]
  },
  
  "/wellness/sleep-tracker": {
    name: "Sleep Improvement Tracker",
    description: "Track and optimize sleep patterns for better rest",
    categories: ["wellness", "health"],
    keywords: ["sleep", "tracker", "rest", "insomnia", "habits", "bedtime", "schedule"]
  },
  
  "/wellness/mindfulness": {
    name: "Mindfulness Practices",
    description: "Guided mindfulness exercises and meditation techniques",
    categories: ["wellness", "mental health"],
    keywords: ["mindfulness", "meditation", "awareness", "present", "focus", "calm", "centered"]
  },
  
  "/wellness/mental-health-resources": {
    name: "Mental Health Resources",
    description: "Information and support options for mental wellbeing",
    categories: ["wellness", "mental health", "resources"],
    keywords: ["mental health", "resources", "support", "therapy", "counseling", "wellbeing", "psychology"]
  },
  
  // Fitness tools
  "/fitness/workout-planner": {
    name: "Workout Planner",
    description: "Create customized workout routines based on goals and equipment",
    categories: ["fitness", "health"],
    keywords: ["workout", "planner", "exercise", "routine", "fitness", "training", "program"]
  },
  
  "/fitness/exercise-library": {
    name: "Exercise Library",
    description: "Comprehensive database of exercises with instructions and videos",
    categories: ["fitness", "reference"],
    keywords: ["exercise", "library", "database", "movements", "techniques", "instructions", "demonstrations"]
  },
  
  "/fitness/nutrition-tracker": {
    name: "Fitness Nutrition Tracker",
    description: "Track macronutrients and calories aligned with fitness goals",
    categories: ["fitness", "nutrition", "health"],
    keywords: ["nutrition", "tracker", "macros", "calories", "protein", "diet", "fitness"]
  },
  
  "/fitness/progress-tracking": {
    name: "Fitness Progress Tracking",
    description: "Monitor and visualize improvements in strength, endurance, and measurements",
    categories: ["fitness", "health"],
    keywords: ["progress", "tracking", "measurements", "improvements", "goals", "metrics", "results"]
  },
  
  // Cooking tools
  "/cooking/recipe-finder": {
    name: "Recipe Finder",
    description: "Search for recipes based on ingredients, dietary preferences, or cuisine",
    categories: ["cooking", "nutrition"],
    keywords: ["recipe", "finder", "search", "meals", "cooking", "dishes", "ingredients"]
  },
  
  "/cooking/meal-planner": {
    name: "Meal Planner",
    description: "Plan balanced meals for days or weeks with nutritional information",
    categories: ["cooking", "nutrition", "organization"],
    keywords: ["meal", "planner", "menu", "weekly", "preparation", "organization", "nutrition"]
  },
  
  "/cooking/grocery-list": {
    name: "Smart Grocery List",
    description: "Generate organized shopping lists based on planned meals",
    categories: ["cooking", "organization"],
    keywords: ["grocery", "list", "shopping", "ingredients", "food", "supermarket", "planning"]
  },
  
  "/cooking/nutrition-calculator": {
    name: "Recipe Nutrition Calculator",
    description: "Calculate nutritional information for homemade recipes and meals",
    categories: ["cooking", "nutrition", "health"],
    keywords: ["nutrition", "calculator", "recipe", "calories", "macronutrients", "homemade", "meals"]
  },
  
  "/learning/courses/repair-assistant": {
    name: "Smart Repair Diagnostic Tool",
    description: "AI-powered camera tool for diagnosing home maintenance issues with repair instructions, tools lists and parts pricing",
    categories: ["home maintenance", "learning", "tools", "technology"],
    keywords: ["home", "repair", "maintenance", "diagnosis", "diagnostic", "camera", "ai", "tools", "parts", "pricing", "fix", "broken", "house", "appliance", "instruction"]
  }
};