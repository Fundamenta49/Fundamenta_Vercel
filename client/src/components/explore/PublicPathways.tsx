import React, { useState } from 'react';
import { useQuery, useMutation, queryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, User, CheckCircle, MoreHorizontal, Filter, PlusCircle, ChevronDown, Star, Download, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'wouter';

// Category colors for visual differentiation
const categoryColors = {
  financial: "bg-amber-100 text-amber-800",
  wellness: "bg-emerald-100 text-emerald-800",
  career: "bg-blue-100 text-blue-800",
  learning: "bg-indigo-100 text-indigo-800",
  social: "bg-rose-100 text-rose-800",
  general: "bg-slate-100 text-slate-800",
};

export default function PublicPathways() {
  const [activeTab, setActiveTab] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch public pathways
  const { data: publicPathways, isLoading: isLoadingPathways } = useQuery({
    queryKey: ['/api/pathways', { public: true }],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch user role
  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch assigned pathways
  const { data: assignments } = useQuery({
    queryKey: ['/api/assignments/student'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userData, // Only fetch if user is logged in
  });

  // Mutation for assigning pathway to a student (mentor only)
  const assignPathwayMutation = useMutation({
    mutationFn: (data: { pathwayId: number, studentId: number }) => 
      apiRequest('/api/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Pathway has been assigned to the student",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign pathway",
        variant: "destructive",
      });
    },
  });

  // Mutation for saving pathway to my paths (student only)
  const savePathwayMutation = useMutation({
    mutationFn: (pathwayId: number) => 
      apiRequest('/api/pathways/save', {
        method: 'POST',
        body: JSON.stringify({ pathwayId }),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Pathway has been saved to your MyPath",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assignments/student'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save pathway",
        variant: "destructive",
      });
    },
  });

  // Fetch students (mentor only)
  const { data: students } = useQuery({
    queryKey: ['/api/connections/students'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: userData?.role === 'mentor', // Only fetch if user is a mentor
  });

  // Check if user is a mentor
  const isMentor = userData?.role === 'mentor';

  // Filter pathways by category and difficulty
  const filteredPathways = React.useMemo(() => {
    if (!publicPathways) return [];
    
    let filtered = [...publicPathways];
    
    // Filter by category
    if (activeTab !== 'all') {
      filtered = filtered.filter(path => path.category === activeTab);
    }
    
    // Filter by difficulty
    if (difficultyFilter) {
      filtered = filtered.filter(path => path.skillLevel === difficultyFilter);
    }
    
    return filtered;
  }, [publicPathways, activeTab, difficultyFilter]);

  // Check if a pathway is already assigned to the current user
  const isPathwayAssigned = (pathwayId: number): boolean => {
    if (!assignments) return false;
    return assignments.some((assignment: any) => assignment.pathwayId === pathwayId);
  };

  // Handle assigning pathway to student
  const handleAssignPathway = (student: any) => {
    if (!selectedPathway) return;
    
    assignPathwayMutation.mutate({
      pathwayId: selectedPathway.id,
      studentId: student.id,
    });
  };

  // Handle saving pathway to my paths
  const handleSavePathway = (pathway: any) => {
    savePathwayMutation.mutate(pathway.id);
  };

  // Loading state
  if (isLoadingPathways) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Public Pathways</h1>
          <p className="text-muted-foreground">
            Discover and explore public learning pathways created by our community.
          </p>
          <div className="h-10 bg-slate-100 animate-pulse rounded-md"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Public Pathways</h1>
          <p className="text-muted-foreground">
            Discover and explore public learning pathways created by our community.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Difficulty</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDifficultyFilter(null)}>
                All Difficulties
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter('foundational')}>
                Foundational
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter('intermediate')}>
                Intermediate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter('advanced')}>
                Advanced
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredPathways.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No pathways found</h3>
              <p className="text-muted-foreground">
                There are no public pathways available with the selected filters.
              </p>
            </div>
          ) : (
            filteredPathways.map((pathway: any) => (
              <Card key={pathway.id} className="border hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`rounded-full p-1.5 ${categoryColors[pathway.category as keyof typeof categoryColors] || "bg-slate-100 text-slate-700"}`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-lg">{pathway.title}</CardTitle>
                        {isPathwayAssigned(pathway.id) && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            Assigned
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {pathway.description}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {pathway.modules?.length || 0} modules
                      </Badge>
                      
                      {isMentor ? (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedPathway(pathway);
                            setIsDialogOpen(true);
                          }}
                        >
                          Assign to Student
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleSavePathway(pathway)}
                          disabled={isPathwayAssigned(pathway.id) || savePathwayMutation.isPending}
                        >
                          {isPathwayAssigned(pathway.id) ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <PlusCircle className="h-4 w-4 mr-2" />
                          )}
                          {isPathwayAssigned(pathway.id) ? "Already Assigned" : "Save to My Path"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Difficulty</p>
                      <div className="flex items-center">
                        {pathway.skillLevel === 'foundational' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Foundational
                          </Badge>
                        )}
                        {pathway.skillLevel === 'intermediate' && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Intermediate
                          </Badge>
                        )}
                        {pathway.skillLevel === 'advanced' && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Advanced
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Creator</p>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{pathway.creatorName || "Community Member"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Estimated Duration</p>
                      <div className="flex items-center">
                        <span className="text-sm">
                          {pathway.modules?.reduce((acc: number, module: any) => acc + (module.estimatedDuration || 0), 0) || 'N/A'} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/mypath/pathway/${pathway.id}`)}
                  >
                    Preview Pathway
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </div>
      
      {/* Dialog for assigning pathway to student (mentor only) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Pathway to Student</DialogTitle>
            <DialogDescription>
              Choose which student you want to assign this pathway to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="font-medium mb-2">{selectedPathway?.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{selectedPathway?.description}</p>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h4 className="font-medium">Select Student:</h4>
              {!students || students.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    You don't have any connected students. Connect with students first.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {students.map((student: any) => (
                    <div 
                      key={student.id} 
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{student.name}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAssignPathway(student)}
                        disabled={assignPathwayMutation.isPending}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}