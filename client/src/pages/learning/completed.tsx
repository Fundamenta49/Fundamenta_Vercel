import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Award, BookOpen, Check, CheckCircle2, Medal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Sample completed courses data
const completedCourses = [
  {
    id: "economics-basics",
    title: "Economics Basics",
    category: "finance",
    completedDate: "March 15, 2025",
    points: 30,
    modules: 4,
    icon: <Award className="h-5 w-5" />,
    path: "/learning/courses/economics"
  },
  {
    id: "cooking-basics",
    title: "Cooking Fundamentals",
    category: "learning",
    completedDate: "March 28, 2025",
    points: 25,
    modules: 6,
    icon: <BookOpen className="h-5 w-5" />,
    path: "/learning/courses/cooking-basics"
  },
  {
    id: "critical-thinking",
    title: "Critical Thinking",
    category: "learning",
    completedDate: "March 10, 2025",
    points: 35,
    modules: 5,
    icon: <Star className="h-5 w-5" />,
    path: "/learning/courses/critical-thinking"
  },
  {
    id: "conflict-resolution",
    title: "Conflict Resolution",
    category: "career",
    completedDate: "March 5, 2025",
    points: 40,
    modules: 4,
    icon: <Medal className="h-5 w-5" />,
    path: "/learning/courses/conflict-resolution"
  },
];

const categoryColors = {
  finance: "bg-blue-100 text-blue-700",
  learning: "bg-green-100 text-green-700",
  career: "bg-purple-100 text-purple-700",
  wellness: "bg-rose-100 text-rose-700",
  fitness: "bg-amber-100 text-amber-700",
};

// Completed Courses Page
export default function CompletedCoursesPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = React.useState<string>("all");

  // Filter courses by category
  const filteredCourses = activeTab === "all" 
    ? completedCourses 
    : completedCourses.filter(course => course.category === activeTab);

  // Calculate total points
  const totalPoints = completedCourses.reduce((sum, course) => sum + course.points, 0);
  const totalCourses = completedCourses.length;
  
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
          <CheckCircle2 className="h-6 w-6 mr-2 text-green-500" />
          Completed Courses
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses} courses</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Points Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{totalPoints} pts</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">100%</div>
            <p className="text-sm text-muted-foreground">All modules complete</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full max-w-3xl mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map(course => (
              <Card key={course.id} className="border-2 border-green-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full p-1.5 ${categoryColors[course.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"}`}>
                        {course.icon}
                      </div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                    </div>
                    <Badge className="bg-green-600">+{course.points} pts</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <Check className="h-3.5 w-3.5 text-green-600 mr-1" />
                      <span>Completed on {course.completedDate}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {course.modules} modules
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {course.category}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(course.path)}
                    >
                      Review Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}