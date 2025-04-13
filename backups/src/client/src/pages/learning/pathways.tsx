import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Award, BookOpen, Clock, Dumbbell, Flame, Rocket, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Sample learning pathways data
const learningPathways = [
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    description: "Develop essential financial skills and knowledge",
    category: "finance",
    progress: 50,
    icon: <Award className="h-5 w-5" />,
    modules: [
      { id: "econ-basics", title: "Economics Basics", path: "/learning/courses/economics", complete: true },
      { id: "budget", title: "Budgeting Essentials", path: "/finance/budget", complete: true },
      { id: "utilities", title: "Understanding Utilities", path: "/learning/courses/utilities-guide", complete: false },
      { id: "shopping", title: "Smart Shopping", path: "/learning/courses/shopping-buddy", complete: false },
    ]
  },
  {
    id: "cooking-skills",
    title: "Cooking Skills",
    description: "Learn culinary techniques and meal preparation",
    category: "learning",
    progress: 75,
    icon: <BookOpen className="h-5 w-5" />,
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
    icon: <Target className="h-5 w-5" />,
    modules: [
      { id: "home-basics", title: "Home Maintenance Basics", path: "/learning/courses/home-maintenance", complete: true },
      { id: "repair-assistant", title: "Repair Assistant", path: "/learning/courses/repair-assistant", complete: false },
      { id: "home-safety", title: "Home Safety", path: "/emergency/home-safety", complete: false },
    ]
  },
  {
    id: "professional-skills",
    title: "Professional Skills",
    description: "Develop workplace and career advancement skills",
    category: "career",
    progress: 40,
    icon: <Target className="h-5 w-5" />,
    modules: [
      { id: "conflict-resolution", title: "Conflict Resolution", path: "/learning/courses/conflict-resolution", complete: true },
      { id: "time-management", title: "Time Management", path: "/learning/courses/time-management", complete: true },
      { id: "conversation", title: "Conversation Skills", path: "/learning/courses/conversation-skills", complete: false },
      { id: "decision-making", title: "Decision Making", path: "/learning/courses/decision-making", complete: false },
      { id: "coping-failure", title: "Coping with Failure", path: "/learning/courses/coping-with-failure", complete: false },
    ]
  },
  {
    id: "wellness-routine",
    title: "Wellness Routine",
    description: "Build habits for physical and mental wellbeing",
    category: "wellness",
    progress: 20,
    icon: <Flame className="h-5 w-5" />,
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
    icon: <Dumbbell className="h-5 w-5" />,
    modules: [
      { id: "fitness-basics", title: "Fitness Fundamentals", path: "/active/basics", complete: true },
      { id: "cardio", title: "Cardio Training", path: "/active/cardio", complete: false },
      { id: "strength", title: "Strength Building", path: "/active/strength", complete: false },
      { id: "yoga", title: "Yoga Practice", path: "/active/yoga", complete: false },
      { id: "fitness-tracking", title: "Progress Tracking", path: "/active/tracking", complete: false },
      { id: "recovery", title: "Rest & Recovery", path: "/active/recovery", complete: false },
    ]
  },
  {
    id: "emergency-prep",
    title: "Emergency Preparedness",
    description: "Essential skills for emergency situations",
    category: "emergency",
    progress: 0,
    icon: <Shield className="h-5 w-5" />,
    modules: [
      { id: "first-aid", title: "First Aid Basics", path: "/emergency/first-aid", complete: false },
      { id: "household-safety", title: "Household Safety", path: "/emergency/household", complete: false },
      { id: "emergency-plan", title: "Emergency Plan", path: "/emergency/planning", complete: false },
    ]
  },
];

const categoryColors = {
  finance: "bg-blue-100 text-blue-700",
  learning: "bg-green-100 text-green-700",
  career: "bg-purple-100 text-purple-700",
  wellness: "bg-rose-100 text-rose-700",
  fitness: "bg-amber-100 text-amber-700",
  emergency: "bg-red-100 text-red-700",
};

// Learning Pathways Page
export default function LearningPathwaysPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [expandedPath, setExpandedPath] = React.useState<string | null>(null);

  // Filter pathways by category
  const filteredPathways = activeTab === "all" 
    ? learningPathways 
    : learningPathways.filter(pathway => pathway.category === activeTab);

  const togglePathDetails = (pathId: string) => {
    if (expandedPath === pathId) {
      setExpandedPath(null);
    } else {
      setExpandedPath(pathId);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/arcade')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Arcade
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Rocket className="h-6 w-6 mr-2 text-purple-500" />
          Learning Pathways
        </h1>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Follow structured learning paths to build comprehensive skills and knowledge in different areas.
          Each pathway consists of multiple modules that build on each other.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Filter by Category</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full max-w-4xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="finance" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Finance
            </TabsTrigger>
            <TabsTrigger 
              value="learning" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="career" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Career
            </TabsTrigger>
            <TabsTrigger 
              value="wellness" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Wellness
            </TabsTrigger>
            <TabsTrigger 
              value="fitness" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Fitness
            </TabsTrigger>
            <TabsTrigger 
              value="emergency" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {filteredPathways.map(pathway => (
                <Card key={pathway.id} className="border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full p-1.5 ${categoryColors[pathway.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"}`}>
                          {pathway.icon}
                        </div>
                        <CardTitle className="text-lg">{pathway.title}</CardTitle>
                      </div>
                      <Badge variant="outline">
                        {pathway.modules.length} modules
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {pathway.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{pathway.progress}%</span>
                        </div>
                        <Progress value={pathway.progress} className="h-2" />
                      </div>
                      
                      {expandedPath === pathway.id && (
                        <div className="mt-4 space-y-3 pt-3 border-t">
                          <h4 className="text-sm font-medium">Modules:</h4>
                          <div className="space-y-2">
                            {pathway.modules.map((module) => (
                              <div key={module.id} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                                <div className="flex items-center">
                                  {module.complete ? (
                                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                                  )}
                                  <span className={module.complete ? "text-sm" : "text-sm text-gray-600"}>
                                    {module.title}
                                  </span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7"
                                  onClick={() => navigate(module.path)}
                                >
                                  {module.complete ? "Review" : "Start"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePathDetails(pathway.id)}
                        >
                          {expandedPath === pathway.id ? "Hide Details" : "Show Details"}
                        </Button>
                        
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => navigate(pathway.modules.find(m => !m.complete)?.path || pathway.modules[0].path)}
                        >
                          {pathway.progress > 0 ? "Continue" : "Start"} Pathway
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}