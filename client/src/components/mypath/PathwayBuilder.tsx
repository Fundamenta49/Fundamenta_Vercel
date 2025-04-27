import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Gamepad2, LucideLayoutDashboard, Plus, PlusCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModuleEditor } from "./ModuleEditor";

const pathwaySchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  category: z.string().min(1, { message: "Category is required" }),
  isPublic: z.boolean().default(false),
});

type PathwayFormValues = z.infer<typeof pathwaySchema>;

export function PathwayBuilder() {
  const { toast } = useToast();
  const [selectedPathwayId, setSelectedPathwayId] = useState<number | null>(null);
  const [showModuleEditor, setShowModuleEditor] = useState(false);
  
  // Fetch user's pathways
  const { data: pathways, isLoading } = useQuery({
    queryKey: ["/api/pathways"],
    retry: false,
  });

  // Form for creating a new pathway
  const form = useForm<PathwayFormValues>({
    resolver: zodResolver(pathwaySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      isPublic: false,
    },
  });

  // Create a new pathway
  const createPathwayMutation = useMutation({
    mutationFn: async (values: PathwayFormValues) => {
      const response = await apiRequest("POST", "/api/pathways", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Pathway Created",
        description: "Your new learning pathway has been created successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/pathways"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create pathway.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: PathwayFormValues) => {
    createPathwayMutation.mutate(values);
  };

  return (
    <Tabs defaultValue="my-pathways">
      <TabsList className="w-full mb-6 grid grid-cols-2">
        <TabsTrigger value="my-pathways">My Pathways</TabsTrigger>
        <TabsTrigger value="create">Create New Pathway</TabsTrigger>
      </TabsList>
      
      <TabsContent value="my-pathways">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">My Learning Pathways</h3>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/pathways"] })}
            >
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !pathways || pathways.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <LucideLayoutDashboard className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No pathways yet</h3>
                <p className="text-gray-500 mt-2">Create your first learning pathway to get started.</p>
                <Button className="mt-4" variant="outline" onClick={() => document.querySelector('button[data-value="create"]')?.click()}>
                  Create Pathway
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pathways.map((pathway: any) => (
                <Card key={pathway.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{pathway.title}</CardTitle>
                      <Badge variant={pathway.isPublic ? "default" : "outline"}>
                        {pathway.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <CardDescription>{pathway.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 line-clamp-3">{pathway.description}</p>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{pathway.modules?.length || 0} Modules</span>
                      <span className="mx-2">•</span>
                      <span>Created: {new Date(pathway.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/mypath/pathways/${pathway.id}`}>Edit</a>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Pathway</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this pathway? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive">Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New Learning Pathway</CardTitle>
            <CardDescription>
              Design a custom learning journey with your own content or Fundamenta resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pathway Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear title that describes the learning pathway
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what students will learn in this pathway" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about the goals and content of this pathway
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="general">General Knowledge</option>
                          <option value="life-skills">Life Skills</option>
                          <option value="financial">Financial Literacy</option>
                          <option value="career">Career Development</option>
                          <option value="wellness">Wellness & Nutrition</option>
                          <option value="fitness">Fitness & Activity</option>
                          <option value="emergency">Emergency Preparedness</option>
                          <option value="custom">Custom</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Select a category that best fits this pathway
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Public Pathway</FormLabel>
                        <FormDescription>
                          Make this pathway visible to other educators in the Fundamenta community
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createPathwayMutation.isPending}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Pathway
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-start gap-4">
            <Gamepad2 className="h-10 w-10 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-green-800">Arcade Integration</h3>
              <p className="text-green-700 mt-1">
                You can now integrate content from the Fundamenta Arcade into your custom learning pathways!
                Arcade modules include interactive elements that make learning more engaging.
              </p>
              <Button 
                className="mt-4 bg-green-700 hover:bg-green-800"
                onClick={() => {
                  toast({
                    title: "Arcade Integration",
                    description: "This feature will be available when you begin adding modules to your pathway.",
                  });
                }}
              >
                Explore Arcade Content
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      
      {/* Module Editor Dialog */}
      <Dialog open={showModuleEditor} onOpenChange={setShowModuleEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Module to Pathway</DialogTitle>
            <DialogDescription>
              Create or select content modules to add to your learning pathway
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-hidden">
            {selectedPathwayId && <ModuleEditor pathwayId={selectedPathwayId} onComplete={() => setShowModuleEditor(false)} />}
          </div>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}