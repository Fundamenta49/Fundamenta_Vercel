import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Calendar, 
  BookOpen, 
  BarChart2, 
  FileText,
  Zap
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import StudentAssignmentDashboard from '../../components/mypath/StudentAssignmentDashboard';
import StudentProgressDashboard from '../../components/mypath/StudentProgressDashboard';

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
          <Link href="/mypath/analytics">
            <Button variant="outline" className="flex items-center gap-2 text-sm md:text-base">
              <BarChart2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="md:inline">Analytics</span>
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="w-full mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            My Assignments
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Enhanced Progress
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments">
          {/* Original Student Assignment Dashboard */}
          <StudentAssignmentDashboard
            assignedAssignments={assignedQuery.data}
            completedAssignments={completedQuery.data}
            isLoading={assignedQuery.isLoading || completedQuery.isLoading}
            isError={!!assignedQuery.error || !!completedQuery.error}
          />
          
          {/* Learning Statistics Cards */}
          {statisticsQuery.data && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">My Learning Statistics</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Learning Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-4xl font-bold text-blue-500 mb-2">{statisticsQuery.data.modulesCompleted}</div>
                      <div className="text-sm text-gray-500">Modules Completed</div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-4xl font-bold text-green-500 mb-2">{statisticsQuery.data.assignments.completed}</div>
                      <div className="text-sm text-gray-500">Pathways Completed</div>
                      <div className="text-xs text-gray-400 mt-1">of {statisticsQuery.data.assignments.total} assigned</div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-4xl font-bold text-amber-500 mb-2">{statisticsQuery.data.streak}</div>
                      <div className="text-sm text-gray-500">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="progress">
          {/* Bundle 5B Performance Optimized Progress Dashboard */}
          <Card className="border-blue-200 mb-4 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                New Optimized Analytics Dashboard
              </CardTitle>
              <CardDescription>
                This dashboard uses our new performance-optimized backend (Bundle 5B)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Compare performance between standard and optimized APIs by toggling the switch.
                The optimized version uses caching and efficient database queries to load data faster.
              </p>
            </CardContent>
          </Card>
          
          <StudentProgressDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StudentMyPath;