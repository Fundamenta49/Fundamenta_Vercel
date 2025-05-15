import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import { useToast } from '../../hooks/use-toast';
import { queryClient } from '../../lib/queryClient';
import { apiRequest } from '../../lib/queryClient';
import { 
  ArrowRight, 
  Clock, 
  FileText, 
  Award
} from 'lucide-react';
import { format } from 'date-fns';

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
  
  // Format date helper function
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Get status badge for assignment
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'revoked':
        return <Badge className="bg-red-500">Revoked</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  // Get status message for assignment
  const getStatusMessage = (assignment: Assignment) => {
    if (assignment.status === 'assigned') {
      return `Assigned on ${formatDate(assignment.createdAt)}`;
    } else if (assignment.status === 'in_progress') {
      return `Started on ${formatDate(assignment.startedAt)}`;
    } else if (assignment.status === 'completed') {
      return `Completed on ${formatDate(assignment.completedAt)}`;
    } else if (assignment.status === 'revoked') {
      return 'This assignment has been revoked';
    }
    return '';
  };

  // Handle module completion checkbox
  const handleModuleCompleted = async (assignmentId: number, moduleId: number, completed: boolean) => {
    try {
      await apiRequest(`/api/student/assignments/${assignmentId}/modules/${moduleId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/student/assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/student/assignments/completed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/student/statistics'] });
      
      toast({
        title: completed ? 'Module completed' : 'Module marked as incomplete',
        description: 'Your progress has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update module status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isError) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle>Error Loading Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            There was a problem loading your assignments. Please refresh the page or try again later.
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="assigned">Assigned</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      {/* Assigned Pathways Tab */}
      <TabsContent value="assigned" className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Assigned Learning Paths</h2>
        
        {isLoading && (
          <>
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
          </>
        )}
        
        {!isLoading && assignedAssignments && assignedAssignments.length === 0 && (
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

        {!isLoading && assignedAssignments && assignedAssignments.map((assignment) => (
          <Card key={assignment.id} className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{assignment.pathway.title}</CardTitle>
                  <CardDescription>
                    Assigned by: {typeof assignment.assignedBy === 'object' ? assignment.assignedBy?.name || 'Unknown' : 'Unknown'}
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
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{assignment.progress || 0}%</span>
              </div>
              <Progress value={assignment.progress || 0} className="h-2" />
              
              {/* Module list with checkboxes */}
              {assignment.pathway.modules && assignment.pathway.modules.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium mb-2">Modules</h3>
                  <Separator />
                  
                  {assignment.pathway.modules.map((module) => (
                    <div key={module.id} className="py-2">
                      <div className="flex items-start gap-2">
                        <Checkbox 
                          id={`module-${module.id}`}
                          checked={module.completed || false}
                          onCheckedChange={(checked) => handleModuleCompleted(assignment.id, module.id, !!checked)}
                          className="mt-1"
                        />
                        <div>
                          <label 
                            htmlFor={`module-${module.id}`}
                            className={`text-sm font-medium ${module.completed ? 'line-through text-gray-500' : ''}`}
                          >
                            {module.title}
                          </label>
                          <p className="text-xs text-gray-500">{module.description}</p>
                        </div>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{assignment.pathway.modules?.length || 0} Modules</span>
                </div>
                {assignment.dueDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={assignment.status === 'assigned' ? "default" : "outline"}
                className="flex items-center gap-1"
                onClick={() => setLocation(`/mypath/learn/${assignment.id}`)}
              >
                {assignment.status === 'assigned' ? 'Start Learning' : 'Continue Learning'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>

      {/* Completed Pathways Tab */}
      <TabsContent value="completed" className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Completed Learning Paths</h2>
        
        {isLoading && (
          <>
            {[1, 2].map((i) => (
              <Card key={i} className="mb-4">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
        
        {!isLoading && completedAssignments && completedAssignments.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No Completed Paths</CardTitle>
              <CardDescription>You haven't completed any learning paths yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                When you complete an assigned learning path, it will appear here.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && completedAssignments && completedAssignments.map((assignment) => (
          <Card key={assignment.id} className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{assignment.pathway.title}</CardTitle>
                  <CardDescription>
                    Completed on {formatDate(assignment.completedAt)}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge(assignment.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm">{assignment.pathway.description}</p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Module Completion</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">All modules completed</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Badge variant="outline" className="py-2 px-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  Pathway Completed
                </Badge>
                
                {assignment.completedAt && (
                  <Badge variant="outline" className="py-2 px-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Completed {formatDate(assignment.completedAt)}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setLocation(`/mypath/review/${assignment.id}`)}
              >
                Review Material
              </Button>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default StudentAssignmentDashboard;