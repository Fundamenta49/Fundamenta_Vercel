import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar, Check, ChevronRight, ClipboardList, FileText, Filter, PlusCircle, RefreshCw, Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAssignments, Assignment } from "@/hooks/useAssignments";

// Define schema for the form
const assignmentSchema = z.object({
  pathwayId: z.string().min(1, { message: "You must select a pathway" }),
  connectionId: z.string().min(1, { message: "You must select a connection" }),
  deadline: z.string().optional(),
  messageToStudent: z.string().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export function MentorAssignmentDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Use our custom hook to fetch assignments
  const { 
    data: assignments, 
    isLoading: isLoadingAssignments, 
    isError: isAssignmentsError 
  } = useAssignments();

  // Fetch pathways for the assignment form
  const { 
    data: pathways, 
    isLoading: isLoadingPathways 
  } = useQuery({
    queryKey: ["/api/pathways"],
  });

  // Fetch connections for the assignment form
  const { 
    data: connections, 
    isLoading: isLoadingConnections 
  } = useQuery({
    queryKey: ["/api/mentorship/connections"],
  });

  // Setup form for creating new assignments
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      pathwayId: "",
      connectionId: "",
      deadline: "",
      messageToStudent: "",
    },
  });

  // Mutation for creating a new assignment
  const createAssignmentMutation = useMutation({
    mutationFn: async (values: AssignmentFormValues) => {
      return await apiRequest({
        url: "/api/assignments",
        method: "POST",
        data: values,
      });
    },
    onSuccess: () => {
      toast({
        title: "Assignment Created",
        description: "Pathway has been successfully assigned to the student.",
      });
      form.reset();
      setShowCreateDialog(false);
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

  // Mutation for updating assignment status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return await apiRequest({
        url: `/api/assignments/${id}`,
        method: "PATCH",
        data: { status },
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Assignment status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: AssignmentFormValues) => {
    createAssignmentMutation.mutate(values);
  };

  // Helper function to filter assignments by search term
  const filterAssignments = (assignment: Assignment) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      assignment.pathway.title.toLowerCase().includes(searchLower) ||
      assignment.student.name.toLowerCase().includes(searchLower)
    );
  };

  // Helper function to render the status badge
  const renderStatusBadge = (status: string) => {
    let variant = "secondary";
    
    if (status === "completed") variant = "default";
    else if (status === "in_progress") variant = "outline";
    else if (status === "revoked") variant = "destructive";
    
    return (
      <Badge variant={variant}>
        {status === "assigned" ? "Assigned" :
         status === "in_progress" ? "In Progress" :
         status === "completed" ? "Completed" :
         status === "revoked" ? "Revoked" : status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
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
            onClick={() => setShowCreateDialog(true)}
          >
            <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            New Assignment
          </Button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search assignments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" title="Filter Assignments">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Assignment tabs */}
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
        
        {/* Active assignments tab */}
        <TabsContent value="active">
          {isLoadingAssignments ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
          ) : isAssignmentsError ? (
            <Card>
              <CardContent className="py-10 text-center">
                <h3 className="text-lg font-medium text-red-600">Error loading assignments</h3>
                <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/assignments"] })}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : !assignments || assignments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <ClipboardList className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No active assignments</h3>
                <p className="text-gray-500 mt-2">Assign pathways to your connections to get started.</p>
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments
                .filter(a => a.status !== "completed" && a.status !== "revoked")
                .filter(filterAssignments)
                .map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {assignment.student.name}
                          </CardDescription>
                        </div>
                        {renderStatusBadge(assignment.status)}
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
                    <CardFooter className="bg-gray-50 border-t py-2 px-6 flex justify-between">
                      <Select
                        defaultValue={assignment.status}
                        onValueChange={(value) => {
                          updateStatusMutation.mutate({ 
                            id: assignment.id, 
                            status: value 
                          });
                        }}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="revoked">Revoke</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="ghost" 
                        className="text-sm flex items-center p-0 h-auto"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        
        {/* Completed assignments tab */}
        <TabsContent value="completed">
          {isLoadingAssignments ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
          ) : isAssignmentsError ? (
            <Card>
              <CardContent className="py-10 text-center">
                <h3 className="text-lg font-medium text-red-600">Error loading assignments</h3>
                <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/assignments"] })}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : !assignments || assignments.filter(a => a.status === "completed").length === 0 ? (
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
                .filter(a => a.status === "completed")
                .filter(filterAssignments)
                .map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {assignment.student.name}
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
                            Completed: {assignment.completedAt ? 
                              new Date(assignment.completedAt).toLocaleDateString() : 
                              "Unknown"
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
        
        {/* All assignments tab */}
        <TabsContent value="all">
          {isLoadingAssignments ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
          ) : isAssignmentsError ? (
            <Card>
              <CardContent className="py-10 text-center">
                <h3 className="text-lg font-medium text-red-600">Error loading assignments</h3>
                <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/assignments"] })}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : !assignments || assignments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <ClipboardList className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No assignments</h3>
                <p className="text-gray-500 mt-2">Assign pathways to your connections to get started.</p>
                <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                  Create Assignment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments
                .filter(filterAssignments)
                .map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{assignment.pathway.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            {assignment.student.name}
                          </CardDescription>
                        </div>
                        {renderStatusBadge(assignment.status)}
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
                    <CardFooter className="bg-gray-50 border-t py-2 px-6 flex justify-between">
                      <Select
                        defaultValue={assignment.status}
                        onValueChange={(value) => {
                          updateStatusMutation.mutate({ 
                            id: assignment.id, 
                            status: value 
                          });
                        }}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="revoked">Revoke</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="ghost" 
                        className="text-sm flex items-center p-0 h-auto"
                      >
                        {assignment.status === "completed" ? "View Notes" : "View Details"}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create assignment dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Assign a learning pathway to one of your connections.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="connectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Connection</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a connection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {connections && connections.asMentor?.length > 0 ? (
                          connections.asMentor.map((connection: any) => (
                            <SelectItem 
                              key={connection.id} 
                              value={connection.id.toString()}
                            >
                              {connection.targetUser?.name || "Unknown"} 
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">
                            No connections found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pathwayId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pathway</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pathway" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pathways && pathways.length > 0 ? (
                          pathways.map((pathway: any) => (
                            <SelectItem 
                              key={pathway.id} 
                              value={pathway.id.toString()}
                            >
                              {pathway.title}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">
                            No pathways found
                          </div>
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
                      <Input 
                        type="date" 
                        placeholder="Select a deadline" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="messageToStudent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message to Student (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a note or instructions for the student..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createAssignmentMutation.isPending || !form.formState.isValid}
                >
                  {createAssignmentMutation.isPending ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Creating...
                    </>
                  ) : "Assign Pathway"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}