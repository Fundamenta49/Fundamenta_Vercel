import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical as DragHandle, Gamepad2, Plus, SortAsc, Trash2 } from "lucide-react";

interface ModuleEditorProps {
  pathwayId: number;
  onComplete: () => void;
}

const moduleSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters long" }),
  type: z.string().min(1, { message: "Type is required" }),
  order: z.number().default(0),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

export function ModuleEditor({ pathwayId, onComplete }: ModuleEditorProps) {
  const { toast } = useToast();
  const [showArcadeContent, setShowArcadeContent] = useState(false);
  
  // Fetch existing modules for this pathway
  const { data: modules, isLoading } = useQuery({
    queryKey: [`/api/pathways/${pathwayId}/modules`],
    retry: false,
  });

  // Fetch arcade content that can be added as modules
  const { data: arcadeContent, isLoading: isLoadingArcade } = useQuery({
    queryKey: ["/api/arcade/content"],
    retry: false,
    enabled: showArcadeContent,
  });

  // Form for creating a new module
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      type: "text",
      order: modules?.length || 0,
    },
  });

  // Create a new module
  const createModuleMutation = useMutation({
    mutationFn: async (values: ModuleFormValues) => {
      const response = await apiRequest("POST", `/api/pathways/${pathwayId}/modules`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Module Created",
        description: "The module has been added to your pathway.",
      });
      form.reset({
        title: "",
        description: "",
        content: "",
        type: "text",
        order: modules?.length + 1 || 0,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/pathways/${pathwayId}/modules`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create module.",
        variant: "destructive",
      });
    },
  });

  // Add arcade content as a module
  const addArcadeModuleMutation = useMutation({
    mutationFn: async (arcadeItemId: string) => {
      const response = await apiRequest("POST", `/api/pathways/${pathwayId}/modules/arcade`, { arcadeItemId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Arcade Content Added",
        description: "The arcade content has been added to your pathway as a module.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/pathways/${pathwayId}/modules`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add arcade content.",
        variant: "destructive",
      });
    },
  });

  // Delete a module
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      const response = await apiRequest("DELETE", `/api/pathways/${pathwayId}/modules/${moduleId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Module Deleted",
        description: "The module has been removed from your pathway.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/pathways/${pathwayId}/modules`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete module.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ModuleFormValues) => {
    createModuleMutation.mutate(values);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="create" className="flex-grow flex flex-col">
        <TabsList className="w-full mb-4 grid grid-cols-3">
          <TabsTrigger value="modules">Current Modules</TabsTrigger>
          <TabsTrigger value="create">Create New Module</TabsTrigger>
          <TabsTrigger value="arcade" onClick={() => setShowArcadeContent(true)}>
            <Gamepad2 className="h-4 w-4 mr-2" />
            Arcade Content
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-grow overflow-hidden">
          <TabsContent value="modules" className="h-full">
            <ScrollArea className="h-[calc(70vh-120px)] pr-4">
              {isLoading ? (
                <div className="py-20 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
                </div>
              ) : !modules || modules.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700">No modules yet</h3>
                  <p className="text-gray-500 mt-2">Start by creating modules for your pathway.</p>
                  <Button className="mt-4" variant="outline" onClick={() => document.querySelector('button[data-value="create"]')?.click()}>
                    Create First Module
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Pathway Modules</h3>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4" />
                      Reorder
                    </Button>
                  </div>
                  
                  {modules.map((module: any, index: number) => (
                    <Card key={module.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                              {index + 1}
                            </div>
                            <CardTitle className="text-base">{module.title}</CardTitle>
                          </div>
                          <Badge>{module.type}</Badge>
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 text-sm text-gray-600">
                        <div className="line-clamp-2">
                          {module.content.substring(0, 150)}{module.content.length > 150 ? '...' : ''}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteModuleMutation.mutate(module.id)}
                          disabled={deleteModuleMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </CardFooter>
                      <div className="absolute top-1/2 -left-4 -translate-y-1/2 cursor-move opacity-50 hover:opacity-100">
                        <DragHandle className="h-5 w-5 text-gray-500" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="create" className="h-full">
            <ScrollArea className="h-[calc(70vh-120px)] pr-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Module</CardTitle>
                  <CardDescription>
                    Add a new learning module to your pathway
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Module Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a title for this module" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of this module" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Module Type</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="text">Text Content</option>
                                <option value="video">Video Content</option>
                                <option value="quiz">Quiz/Assessment</option>
                                <option value="exercise">Exercise/Activity</option>
                                <option value="discussion">Discussion Topic</option>
                              </select>
                            </FormControl>
                            <FormDescription>
                              Select the type of content in this module
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Module Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter the content for this module" 
                                className="min-h-[200px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              The main content of this module. For rich content types, you can use Markdown formatting.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createModuleMutation.isPending}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Module to Pathway
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="arcade" className="h-full">
            <ScrollArea className="h-[calc(70vh-120px)] pr-4">
              {isLoadingArcade ? (
                <div className="py-20 flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
                </div>
              ) : !arcadeContent || arcadeContent.length === 0 ? (
                <div className="text-center py-12 bg-amber-50 rounded-lg">
                  <Gamepad2 className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                  <h3 className="text-lg font-medium text-amber-700">No Arcade Content Available</h3>
                  <p className="text-amber-600 mt-2">Visit the Arcade to unlock content that can be added to pathways.</p>
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-700" asChild>
                    <a href="/arcade">Visit Arcade</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
                    <h3 className="text-lg font-medium text-amber-800 flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5" />
                      Arcade Integration
                    </h3>
                    <p className="text-amber-700 mt-1">
                      Add interactive content from the Fundamenta Arcade directly to your learning pathway.
                      Students will be able to access these activities within the pathway.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {arcadeContent.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {item.category}
                            </Badge>
                          </div>
                          <CardDescription>{item.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            onClick={() => addArcadeModuleMutation.mutate(item.id)}
                            disabled={addArcadeModuleMutation.isPending}
                          >
                            Add to Pathway
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onComplete}>
          Done
        </Button>
      </div>
    </div>
  );
}