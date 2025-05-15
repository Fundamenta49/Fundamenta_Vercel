import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import {
  Calendar,
  BookOpen,
  Award,
  BarChart2,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  RefreshCcw
} from 'lucide-react';

// Type definitions
interface PathwayModule {
  id: number;
  pathwayId: number;
  title: string;
  description: string;
  order: number;
  content: any;
  completed?: boolean;
  lastAccessed?: string | null;
}

interface Pathway {
  id: number;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  creatorId: number;
  modules: PathwayModule[];
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Assignment {
  id: number;
  pathwayId: number;
  studentId: number;
  assignedBy: number | User;
  status: 'assigned' | 'in_progress' | 'completed' | 'revoked';
  progress: number;
  dueDate: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  pathway: Pathway;
}

interface StudentAssignmentDashboardProps {
  assignedAssignments: Assignment[] | undefined;
  completedAssignments: Assignment[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

const StudentAssignmentDashboard: React.FC<StudentAssignmentDashboardProps> = ({
  assignedAssignments,
  completedAssignments,
  isLoading,
  isError
}) => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('assigned');
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState<{[key: number]: boolean}>({});

  // Toggle module expansion for an assignment
  const toggleModuleExpansion = (assignmentId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [assignmentId]: !prev[assignmentId]
    }));
  };

  // Handle starting an assignment (changing status from assigned to in_progress)
  const handleStartAssignment = async (assignmentId: number) => {
    try {
      const assignment = assignedAssignments?.find(a => a.id === assignmentId);
      if (!assignment) return;

      // Update the first module as accessed (but not completed)
      if (assignment.pathway.modules.length > 0) {
        const firstModule = assignment.pathway.modules[0];
        await apiRequest(`/api/student/assignments/${assignmentId}/modules/${firstModule.id}`, {
          method: 'PATCH',
          data: { completed: false }
        });

        // Invalidate the query to refresh assignments
        queryClient.invalidateQueries({ queryKey: ['/api/student/assignments'] });
        
        toast({
          title: 'Assignment Started',
          description: 'You have started this learning path.',
        });
      }
    } catch (error) {
      console.error('Error starting assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to start the assignment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle module completion toggle
  const handleModuleCompletion = async (assignmentId: number, moduleId: number, isCompleted: boolean) => {
    try {
      await apiRequest(`/api/student/assignments/${assignmentId}/modules/${moduleId}`, {
        method: 'PATCH',
        data: { completed: isCompleted }
      });

      // Invalidate the queries to refresh assignments
      queryClient.invalidateQueries({ queryKey: ['/api/student/assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/student/assignments/completed'] });
      
      toast({
        title: isCompleted ? 'Module Completed' : 'Module Marked as Incomplete',
        description: isCompleted 
          ? 'Great job! You have completed this module.' 
          : 'The module has been marked as incomplete.',
      });
    } catch (error) {
      console.error('Error updating module completion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update module completion. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Format date string
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case 'revoked':
        return <Badge className="bg-red-500">Revoked</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate days remaining if a deadline exists
  const getDaysRemaining = (deadlineString: string | Date | null | undefined) => {
    if (!deadlineString) return null;
    
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get assignment status message with deadline info
  const getStatusMessage = (assignment: Assignment) => {
    const daysRemaining = getDaysRemaining(assignment.dueDate);
    
    if (assignment.status === 'completed') {
      return `Completed on ${formatDate(assignment.completedAt)}`;
    } else if (assignment.status === 'in_progress') {
      return daysRemaining && daysRemaining > 0
        ? `${daysRemaining} days remaining`
        : daysRemaining === 0
        ? 'Due today'
        : 'Overdue';
    } else if (assignment.status === 'revoked') {
      return 'This assignment has been revoked';
    } else {
      return daysRemaining && daysRemaining > 0
        ? `Start by ${formatDate(assignment.dueDate)}`
        : daysRemaining === 0
        ? 'Due today'
        : 'Overdue';
    }
  };

  // Show loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Assigned Learning Paths</h2>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="mb-4">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Completed Learning Paths</h2>
            {[1, 2].map((i) => (
              <Card key={i} className="mb-4">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Assignments</CardTitle>
          <CardDescription>We encountered a problem while loading your assignments.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/student/assignments'] });
              queryClient.invalidateQueries({ queryKey: ['/api/student/assignments/completed'] });
            }}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* Assigned Pathways Tab */}
        <TabsContent value="assigned" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Learning Paths</h2>
          
          {/* Empty state for assigned */}
          {assignedAssignments && assignedAssignments.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Assignments</CardTitle>
                <CardDescription>You don't have any assigned learning paths yet.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  When your teacher or mentor assigns you a learning path, it will appear here.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Assigned assignments list */}
          {assignedAssignments && assignedAssignments.map((assignment) => (
            <Card key={assignment.id} className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{assignment.pathway.title}</CardTitle>
                    <CardDescription>
                      Assigned by: {typeof assignment.assignedBy === 'object' ? assignment.assignedBy.name : 'Unknown'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(assignment.status)}
                    <span className="text-xs text-gray-500">
                      {getStatusMessage(assignment)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm">{assignment.pathway.description}</p>
                </div>
                
                {/* Progress bar */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{assignment.progress || 0}%</span>
                </div>
                <Progress value={assignment.progress || 0} className="h-2 mb-4" />
                
                {/* Module count & info */}
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{assignment.pathway.modules?.length || 0} Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Due: {assignment.dueDate ? formatDate(assignment.dueDate) : 'No deadline'}</span>
                  </div>
                </div>

                {/* Module completion checklist - shown if expanded */}
                {expandedModules[assignment.id] && (
                  <div className="border rounded-md p-3 mb-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Modules</h4>
                    <div className="space-y-3">
                      {assignment.pathway.modules.map((module) => (
                        <div key={module.id} className="flex items-start gap-2">
                          <Checkbox 
                            id={`module-${module.id}`}
                            checked={module.completed}
                            onCheckedChange={(checked) => 
                              handleModuleCompletion(assignment.id, module.id, checked === true)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label 
                              htmlFor={`module-${module.id}`} 
                              className={`font-medium ${module.completed ? 'line-through text-gray-500' : ''}`}
                            >
                              {module.title}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">{module.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleModuleExpansion(assignment.id)}
                >
                  {expandedModules[assignment.id] ? 'Hide Modules' : 'Show Modules'}
                </Button>
                
                <Button
                  variant={assignment.status === 'assigned' ? 'default' : 'outline'}
                  className="flex items-center gap-1"
                  onClick={() => 
                    assignment.status === 'assigned' 
                      ? handleStartAssignment(assignment.id) 
                      : null
                  }
                >
                  {assignment.status === 'assigned' ? 'Start Learning' : 'Continue Learning'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Completed Pathways Tab */}
        <TabsContent value="completed" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Completed Learning Paths</h2>
          
          {/* Empty state for completed */}
          {completedAssignments && completedAssignments.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Completed Paths</CardTitle>
                <CardDescription>You haven't completed any learning paths yet.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  When you complete an assigned learning path, it will appear here with your achievements.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Completed assignments list */}
          {completedAssignments && completedAssignments.map((assignment) => (
            <Card key={assignment.id} className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{assignment.pathway.title}</CardTitle>
                    <CardDescription>
                      Completed on {formatDate(assignment.completedAt)}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm">{assignment.pathway.description}</p>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">
                    Completed all {assignment.pathway.modules.length} modules
                  </span>
                </div>
                
                {/* Module list - shown if expanded */}
                {expandedModules[assignment.id] && (
                  <div className="border rounded-md p-3 mb-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Completed Modules</h4>
                    <div className="space-y-2">
                      {assignment.pathway.modules.map((module) => (
                        <div key={module.id} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{module.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleModuleExpansion(assignment.id)}
                >
                  {expandedModules[assignment.id] ? 'Hide Modules' : 'Show Modules'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAssignmentDashboard;