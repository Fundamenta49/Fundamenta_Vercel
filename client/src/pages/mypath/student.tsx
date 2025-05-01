import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Type definitions
interface PathwayModule {
  id: number;
  pathwayId: number;
  title: string;
  description: string;
  order: number;
  content: string;
  completed?: boolean;
  lastAccessed?: string | null;
}

interface Pathway {
  id: number;
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  creatorId: string;
  modules: PathwayModule[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Assignment {
  id: number;
  pathwayId: number;
  studentId: string;
  assignedById: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  progress: number;
  deadline: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  finalScore: number | null;
  rating: number | null;
  estimatedHours: number | null;
  pathway: Pathway;
  assignedBy: User;
  achievements?: { name: string; }[];
}

interface CategoryProgress {
  name: string;
  totalModules: number;
  completedModules: number;
}

interface Statistics {
  modulesCompleted: number;
  assignments: {
    total: number;
    completed: number;
  };
  averageScore: number | null;
  streak: number;
  categories: CategoryProgress[];
}

const StudentMyPath: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('assigned');

  // Fetch assigned pathways
  const assignedQuery = useQuery<Assignment[]>({
    queryKey: ['/api/student/assignments'],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Fetch completed pathways
  const completedQuery = useQuery<Assignment[]>({
    queryKey: ['/api/student/assignments/completed'],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Fetch statistics
  const statisticsQuery = useQuery<Statistics>({
    queryKey: ['/api/student/statistics'],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Handle errors
  React.useEffect(() => {
    if (assignedQuery.error) {
      toast({
        title: 'Error',
        description: 'Failed to load your assignments. Please try again.',
        variant: 'destructive',
      });
    }

    if (completedQuery.error) {
      toast({
        title: 'Error',
        description: 'Failed to load your completed assignments. Please try again.',
        variant: 'destructive',
      });
    }

    if (statisticsQuery.error) {
      toast({
        title: 'Error',
        description: 'Failed to load your learning statistics. Please try again.',
        variant: 'destructive',
      });
    }
  }, [assignedQuery.error, completedQuery.error, statisticsQuery.error, toast]);

  // Format date string
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'NOT_STARTED':
        return <Badge className="bg-gray-500">Not Started</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-red-500">Overdue</Badge>;
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

  // Get assignment status message
  const getStatusMessage = (assignment: Assignment) => {
    const daysRemaining = getDaysRemaining(assignment.deadline);
    
    if (assignment.status === 'COMPLETED') {
      return `Completed on ${formatDate(assignment.completedAt)}`;
    } else if (assignment.status === 'IN_PROGRESS') {
      return daysRemaining && daysRemaining > 0
        ? `${daysRemaining} days remaining`
        : daysRemaining === 0
        ? 'Due today'
        : 'Overdue';
    } else {
      return daysRemaining && daysRemaining > 0
        ? `Start by ${formatDate(assignment.deadline)}`
        : daysRemaining === 0
        ? 'Due today'
        : 'Overdue';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Learning Path</h1>
          <p className="text-gray-500 mt-2">Track your learning journey and progress</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-0">
          <Link href="/mypath">
            <Button variant="default" className="flex items-center gap-2 text-sm md:text-base">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="md:inline">Educator View</span>
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2 text-sm md:text-base">
            <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="md:inline">Calendar</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-sm md:text-base">
            <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="md:inline">Resources</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        {/* Assigned Pathways Tab */}
        <TabsContent value="assigned" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Learning Paths</h2>
          
          {assignedQuery.isLoading && (
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

          {!assignedQuery.isLoading && assignedQuery.data && assignedQuery.data.length === 0 && (
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

          {!assignedQuery.isLoading && assignedQuery.data && assignedQuery.data.map((assignment: Assignment) => (
            <Card key={assignment.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{assignment.pathway.title}</CardTitle>
                    <CardDescription>
                      Assigned by: {assignment.assignedBy?.name || 'Unknown'}
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
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{assignment.pathway.modules?.length || 0} Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {assignment.estimatedHours ? `${assignment.estimatedHours} hours` : 'Time varies'}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={assignment.status === 'NOT_STARTED' ? "default" : "outline"}
                  className="flex items-center gap-1"
                  onClick={() => setLocation(`/mypath/learn/${assignment.id}`)}
                >
                  {assignment.status === 'NOT_STARTED' ? 'Start Learning' : 'Continue Learning'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Completed Pathways Tab */}
        <TabsContent value="completed" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Completed Learning Paths</h2>
          
          {completedQuery.isLoading && (
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
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
          
          {!completedQuery.isLoading && completedQuery.data && completedQuery.data.length === 0 && (
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

          {!completedQuery.isLoading && completedQuery.data && completedQuery.data.map((assignment: Assignment) => (
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
                    <Badge className="bg-green-500">Completed</Badge>
                    {assignment.finalScore !== null && (
                      <span className="text-sm font-medium mt-1">
                        Score: {assignment.finalScore}%
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm">{assignment.pathway.description}</p>
                </div>
                
                <div className="flex gap-3 mt-4">
                  {assignment.achievements && assignment.achievements.map((achievement: { name: string }, idx: number) => (
                    <Badge key={idx} variant="outline" className="py-2 px-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      {achievement.name}
                    </Badge>
                  ))}
                  
                  {(!assignment.achievements || assignment.achievements.length === 0) && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="h-4 w-4 mr-2" />
                      Achievement badges will appear here
                    </div>
                  )}
                </div>
                
                {assignment.rating && (
                  <div className="flex items-center mt-4">
                    <span className="text-sm font-medium mr-2">Your Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`h-4 w-4 ${star <= (assignment.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
                
                {!assignment.rating && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setLocation(`/mypath/rate/${assignment.id}`)}
                  >
                    Rate this path
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Progress & Statistics Tab */}
        <TabsContent value="progress" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">My Learning Progress</h2>
          
          {statisticsQuery.isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-24 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-16 mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!statisticsQuery.isLoading && statisticsQuery.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Modules Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {statisticsQuery.data.modulesCompleted || 0}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Individual learning modules
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Assignment Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {statisticsQuery.data.assignments?.completed || 0}/{statisticsQuery.data.assignments?.total || 0}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Completed pathways
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Average Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {statisticsQuery.data.averageScore ? 
                        `${Math.round(statisticsQuery.data.averageScore)}%` : 
                        'N/A'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Across all graded assignments
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Learning Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {statisticsQuery.data.streak || 0} days
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current learning streak
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Progress by Category</h3>
              <div className="mb-8">
                {statisticsQuery.data.categories?.map((category: CategoryProgress) => (
                  <div key={category.name} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm">
                        {category.completedModules}/{category.totalModules} modules
                      </span>
                    </div>
                    <Progress 
                      value={(category.completedModules / Math.max(category.totalModules, 1)) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
                
                {(!statisticsQuery.data.categories || statisticsQuery.data.categories.length === 0) && (
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-gray-500 text-center">
                        No category data available yet
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentMyPath;