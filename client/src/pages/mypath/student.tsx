import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Clock, 
  Trophy,
  GraduationCap, 
  PenTool,
  FileText,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Star,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "wouter";

export default function StudentMyPathPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("assigned");
  const navigate = useNavigate();
  
  // Fetch assigned pathways for this student
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ["/api/student/assignments"],
    retry: false,
  });
  
  // Fetch completed pathways
  const { data: completedPathways, isLoading: isLoadingCompleted } = useQuery({
    queryKey: ["/api/student/assignments/completed"],
    retry: false,
  });
  
  // Fetch student's learning stats
  const { data: learningStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/student/statistics"],
    retry: false,
  });
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning Path</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and complete learning assignments
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:flex items-center gap-2" onClick={() => navigate("/learning")}>
            <BookOpen className="h-4 w-4" />
            Learning Hub
          </Button>
          <Button className="hidden md:flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Ask for Help
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <div className="space-y-1">
                <Button
                  variant={activeTab === "assigned" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("assigned")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Assigned
                </Button>
                <Button
                  variant={activeTab === "completed" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("completed")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completed
                </Button>
                <Button
                  variant={activeTab === "progress" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("progress")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Progress
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {isLoadingStats ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <>
                  <p className="mb-2 flex justify-between">
                    <span>Modules Completed:</span>
                    <span className="font-medium">{learningStats?.modulesCompleted || 0}</span>
                  </p>
                  <p className="mb-2 flex justify-between">
                    <span>Avg. Score:</span>
                    <span className="font-medium">{learningStats?.averageScore || "N/A"}%</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Learning Streak:</span>
                    <span className="font-medium">{learningStats?.streak || 0} days</span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden col-span-1">
          <Tabs defaultValue="assigned" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="assigned" className="text-xs py-1 px-0">
                <BookOpen className="h-4 w-4 md:mr-2" />
                <span className="hidden xs:inline">Assigned</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs py-1 px-0">
                <CheckCircle2 className="h-4 w-4 md:mr-2" />
                <span className="hidden xs:inline">Completed</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-xs py-1 px-0">
                <BarChart3 className="h-4 w-4 md:mr-2" />
                <span className="hidden xs:inline">Progress</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-9 lg:col-span-10">
          {activeTab === "assigned" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Assigned Learning Pathways</h3>
              </div>
              
              {isLoadingAssignments ? (
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-1/4 mt-1" />
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-8" />
                          </div>
                          <Skeleton className="h-2 w-full rounded-full" />
                          <div className="flex justify-between mt-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t py-2 px-6">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : !assignments || assignments.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <BookOpen className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-700">No learning pathways</h3>
                    <p className="text-gray-500 mt-2">
                      You don't have any assigned learning pathways yet. Check back later or
                      connect with an educator to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                              {assignment.assignedBy.name}
                            </CardDescription>
                          </div>
                          <Badge variant={
                            assignment.status === "NOT_STARTED" ? "secondary" : 
                            assignment.status === "IN_PROGRESS" ? "outline" : "default"
                          }>
                            {assignment.status === "NOT_STARTED" ? "Not Started" :
                             assignment.status === "IN_PROGRESS" ? "In Progress" : "Completed"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Progress</span>
                            <span>{assignment.progress}%</span>
                          </div>
                          <Progress value={assignment.progress} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              {assignment.dueDate ? 
                                new Date(assignment.dueDate).toLocaleDateString() : 
                                "No deadline"
                              }
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              {assignment.pathway.modules?.length || 0} Modules
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t py-2 px-6">
                        <Button
                          variant="ghost"
                          className="ml-auto text-sm flex items-center p-0 h-auto"
                          onClick={() => navigate(`/mypath/learning/${assignment.id}`)}
                        >
                          {assignment.status === "NOT_STARTED" ? "Start Learning" : "Continue"}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === "completed" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Completed Learning Pathways</h3>
              </div>
              
              {isLoadingCompleted ? (
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-1/4 mt-1" />
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-8" />
                          </div>
                          <Skeleton className="h-2 w-full rounded-full" />
                          <div className="flex justify-between mt-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t py-2 px-6">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : !completedPathways || completedPathways.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Trophy className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-700">No completed pathways yet</h3>
                    <p className="text-gray-500 mt-2">
                      Complete your assigned learning pathways to see them here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {completedPathways.map((assignment) => (
                    <Card key={assignment.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                              {assignment.assignedBy.name}
                            </CardDescription>
                          </div>
                          <Badge>Completed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Grade</span>
                            <span className="font-medium">
                              {assignment.finalScore !== null ? `${assignment.finalScore}%` : 'No Grade'}
                            </span>
                          </div>
                          
                          <div className="flex items-center mt-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (assignment.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">Your rating</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
                              Completed: {new Date(assignment.completedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              {assignment.pathway.modules?.length || 0} Modules
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t py-2 px-6">
                        <Button
                          variant="ghost"
                          className="ml-auto text-sm flex items-center p-0 h-auto"
                          onClick={() => navigate(`/mypath/learning/${assignment.id}`)}
                        >
                          Review
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === "progress" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>
                    Track your learning achievements and progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Learning Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                            <h3 className="text-xl font-semibold text-blue-700">{isLoadingStats ? '...' : learningStats?.modulesCompleted || 0}</h3>
                            <p className="text-blue-600">Modules Completed</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <PenTool className="h-8 w-8 text-green-500 mb-2" />
                            <h3 className="text-xl font-semibold text-green-700">{isLoadingStats ? '...' : learningStats?.assignments?.total || 0}</h3>
                            <p className="text-green-600">Total Assignments</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <Trophy className="h-8 w-8 text-amber-500 mb-2" />
                            <h3 className="text-xl font-semibold text-amber-700">{isLoadingStats ? '...' : learningStats?.averageScore || 'N/A'}%</h3>
                            <p className="text-amber-600">Average Score</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Progress by Category */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Progress by Category</h3>
                      <div className="space-y-4">
                        {isLoadingStats ? (
                          <>
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </>
                        ) : (
                          (learningStats?.categories || []).map((category) => (
                            <div key={category.name} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{category.name}</span>
                                <span className="text-sm text-gray-500">{category.completedModules} / {category.totalModules} modules</span>
                              </div>
                              <Progress value={(category.completedModules / Math.max(category.totalModules, 1)) * 100} className="h-2" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Learning Streak */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold text-indigo-800 mb-1">Learning Streak</h3>
                          <p className="text-indigo-600">Keep up your momentum and learn every day!</p>
                        </div>
                        <div className="flex items-center">
                          <div className="h-16 w-16 rounded-full bg-white border-2 border-indigo-300 flex items-center justify-center shadow-sm">
                            <span className="text-2xl font-bold text-indigo-700">{isLoadingStats ? '...' : learningStats?.streak || 0}</span>
                          </div>
                          <div className="ml-4">
                            <span className="block text-indigo-800 font-medium">days</span>
                            <span className="text-sm text-indigo-600">current streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}