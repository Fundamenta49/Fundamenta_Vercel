import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar, Check, ChevronRight, ClipboardList, FileText, Filter, Gauge, PlusCircle, RefreshCw, Search, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgressTracker } from "./ProgressTracker";
import { NoteSystem } from "./NoteSystem";

const assignmentSchema = z.object({
  pathwayId: z.string().min(1, { message: "You must select a pathway" }),
  connectionId: z.string().min(1, { message: "You must select a connection" }),
  deadline: z.string().optional(),
  messageToStudent: z.string().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export function AssignmentDashboard() {
  const { toast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [viewType, setViewType] = useState<"progress" | "notes">("progress");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  // Fetch assignments
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ["/api/assignments"],
    retry: false,
  });

  // Fetch user's pathways
  const { data: pathways, isLoading: isLoadingPathways } = useQuery({
    queryKey: ["/api/pathways"],
    retry: false,
  });

  // Fetch user's connections
  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["/api/connections"],
    retry: false,
  });

  // Form for creating a new assignment
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      pathwayId: "",
      connectionId: "",
      deadline: "",
      messageToStudent: "",
    },
  });

  // Create a new assignment
  const createAssignmentMutation = useMutation({
    mutationFn: async (values: AssignmentFormValues) => {
      const response = await apiRequest("POST", "/api/assignments", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assignment Created",
        description: "The pathway has been assigned successfully.",
      });
      form.reset();
      setShowAssignDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: AssignmentFormValues) => {
    createAssignmentMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h3 className="text-lg font-medium">Pathway Assignments</h3>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs sm:text-sm" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/assignments"] })}
          >
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            className="flex items-center gap-1 text-xs sm:text-sm"
            onClick={() => setShowAssignDialog(true)}
          >
            <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            New Assignment
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search assignments..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" title="Filter Assignments">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="w-full mb-6 grid grid-cols-3">
          <TabsTrigger value="active" className="px-2 md:px-4 py-1.5 text-xs sm:text-sm whitespace-normal h-auto">
            <span className="md:hidden">Active</span>
            <span className="hidden md:inline">Active Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-2 md:px-4 py-1.5 text-xs sm:text-sm whitespace-normal h-auto">
            <span className="md:hidden">Completed</span>
            <span className="hidden md:inline">Completed</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="px-2 md:px-4 py-1.5 text-xs sm:text-sm whitespace-normal h-auto">
            <span className="md:hidden">All</span>
            <span className="hidden md:inline">All Assignments</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {isLoadingAssignments ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !assignments || assignments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <ClipboardList className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No active assignments</h3>
                <p className="text-gray-500 mt-2">Assign pathways to your connections to get started.</p>
                <Button className="mt-4" onClick={() => setShowAssignDialog(true)}>
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments
                .filter((assignment: any) => assignment.status !== "COMPLETED")
                .map((assignment: any) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {assignment.connection.targetUser.username}
                          </CardDescription>
                        </div>
                        <Badge variant={
                          assignment.status === "COMPLETED" ? "default" :
                          assignment.status === "IN_PROGRESS" ? "outline" : "secondary"
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
                            {assignment.deadline ? 
                              new Date(assignment.deadline).toLocaleDateString() : 
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
                        onClick={() => {
                          setSelectedAssignment(assignment.id);
                          setViewType("progress");
                        }}
                      >
                        Track Progress
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {isLoadingAssignments ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !assignments || assignments.filter((a: any) => a.status === "COMPLETED").length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Check className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No completed assignments</h3>
                <p className="text-gray-500 mt-2">
                  Completed assignments will appear here when students finish their assigned pathways.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments
                .filter((assignment: any) => assignment.status === "COMPLETED")
                .map((assignment: any) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {assignment.connection.targetUser.username}
                          </CardDescription>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Progress</span>
                          <span>100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
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
                        onClick={() => {
                          setSelectedAssignment(assignment.id);
                          setViewType("notes");
                        }}
                      >
                        View Notes
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          {isLoadingAssignments ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !assignments || assignments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <ClipboardList className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No assignments</h3>
                <p className="text-gray-500 mt-2">Assign pathways to your connections to get started.</p>
                <Button className="mt-4" onClick={() => setShowAssignDialog(true)}>
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments.map((assignment: any) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <User className="h-3.5 w-3.5 mr-1" />
                          {assignment.connection.targetUser.username}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        assignment.status === "COMPLETED" ? "default" :
                        assignment.status === "IN_PROGRESS" ? "outline" : "secondary"
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
                          {assignment.deadline ? 
                            new Date(assignment.deadline).toLocaleDateString() : 
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
                      onClick={() => {
                        setSelectedAssignment(assignment.id);
                        setViewType(assignment.status === "COMPLETED" ? "notes" : "progress");
                      }}
                    >
                      {assignment.status === "COMPLETED" ? "View Notes" : "Track Progress"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating new assignment */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Pathway</DialogTitle>
            <DialogDescription>
              Assign a learning pathway to one of your connections.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pathwayId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pathway</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pathway" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingPathways ? (
                          <div className="py-2 px-4 text-center">Loading pathways...</div>
                        ) : !pathways || pathways.length === 0 ? (
                          <div className="py-2 px-4 text-center">No pathways available</div>
                        ) : (
                          pathways.map((pathway: any) => (
                            <SelectItem key={pathway.id} value={pathway.id.toString()}>
                              {pathway.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="connectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingConnections ? (
                          <div className="py-2 px-4 text-center">Loading connections...</div>
                        ) : !connections || connections.length === 0 ? (
                          <div className="py-2 px-4 text-center">No connections available</div>
                        ) : (
                          connections.map((connection: any) => (
                            <SelectItem key={connection.id} value={connection.id.toString()}>
                              {connection.targetUser?.username}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Set a target date for pathway completion
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="messageToStudent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Add a message to the student" {...field} />
                    </FormControl>
                    <FormDescription>
                      A personal note or instructions for the student
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAssignDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAssignmentMutation.isPending}>
                  Assign Pathway
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for tracking progress or viewing notes */}
      <Dialog open={!!selectedAssignment} onOpenChange={(open) => !open && setSelectedAssignment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {viewType === "progress" ? "Progress Tracking" : "Student Notes"}
            </DialogTitle>
            <DialogDescription>
              {viewType === "progress" 
                ? "Track student progress through the pathway modules" 
                : "View and add notes on student performance"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as "progress" | "notes")} className="mt-2">
            <TabsList className="mb-4 grid grid-cols-2">
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[50vh]">
              <TabsContent value="progress" className="mt-0">
                {selectedAssignment && <ProgressTracker assignmentId={selectedAssignment} />}
              </TabsContent>
              
              <TabsContent value="notes" className="mt-0">
                {selectedAssignment && <NoteSystem assignmentId={selectedAssignment} />}
              </TabsContent>
            </ScrollArea>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}