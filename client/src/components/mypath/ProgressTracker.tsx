import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, FileText } from "lucide-react";

interface ProgressTrackerProps {
  assignmentId: number;
}

export function ProgressTracker({ assignmentId }: ProgressTrackerProps) {
  const { toast } = useToast();
  
  // Fetch assignment details with modules and progress
  const { data: assignment, isLoading } = useQuery({
    queryKey: [`/api/assignments/${assignmentId}`],
    retry: false,
  });

  // Mark a module as reviewed
  const reviewModuleMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      const response = await apiRequest(
        "POST", 
        `/api/assignments/${assignmentId}/modules/${moduleId}/review`, 
        {}
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Module Reviewed",
        description: "The module has been marked as reviewed.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/assignments/${assignmentId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to review module.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">Failed to load assignment details.</p>
      </div>
    );
  }

  // Calculate overall progress
  const totalModules = assignment.pathway.modules.length;
  const completedModules = assignment.moduleProgress.filter((mp: any) => mp.status === "COMPLETED").length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">{assignment.pathway.title}</h2>
            <p className="text-gray-500 text-sm">Student: {assignment.connection.targetUser.username}</p>
          </div>
          <Badge variant={
            assignment.status === "COMPLETED" ? "default" :
            assignment.status === "IN_PROGRESS" ? "outline" : "secondary"
          }>
            {assignment.status === "NOT_STARTED" ? "Not Started" :
             assignment.status === "IN_PROGRESS" ? "In Progress" : "Completed"}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Overall Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-gray-500">Modules Completed</span>
            <p className="text-lg font-medium">{completedModules} of {totalModules}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="text-gray-500">Deadline</span>
            <p className="text-lg font-medium">
              {assignment.deadline ? 
                new Date(assignment.deadline).toLocaleDateString() : 
                "No deadline"
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Module Progress</h3>
        
        {assignment.pathway.modules.map((module: any, index: number) => {
          const moduleProgress = assignment.moduleProgress.find(
            (mp: any) => mp.moduleId === module.id
          ) || { status: "NOT_STARTED", lastActivity: null };
          
          return (
            <Card key={module.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                  </div>
                  <Badge variant={
                    moduleProgress.status === "COMPLETED" ? "default" :
                    moduleProgress.status === "IN_PROGRESS" ? "outline" : "secondary"
                  }>
                    {moduleProgress.status === "NOT_STARTED" ? "Not Started" :
                     moduleProgress.status === "IN_PROGRESS" ? "In Progress" : "Completed"}
                  </Badge>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {moduleProgress.status === "NOT_STARTED" ? (
                    <Circle className="h-4 w-4 text-gray-400" />
                  ) : moduleProgress.status === "IN_PROGRESS" ? (
                    <Clock className="h-4 w-4 text-blue-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  
                  {moduleProgress.status === "NOT_STARTED" 
                    ? "Student hasn't started this module yet" 
                    : moduleProgress.status === "IN_PROGRESS"
                    ? `Last activity: ${new Date(moduleProgress.lastActivity).toLocaleString()}`
                    : `Completed on: ${new Date(moduleProgress.completedAt).toLocaleString()}`
                  }
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={moduleProgress.status !== "COMPLETED" || moduleProgress.reviewed}
                  onClick={() => reviewModuleMutation.mutate(module.id)}
                >
                  <FileText className="h-4 w-4" />
                  {moduleProgress.reviewed ? "Reviewed" : "Mark as Reviewed"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}