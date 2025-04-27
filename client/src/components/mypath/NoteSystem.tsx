import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, FileText, User, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";

interface NoteSystemProps {
  assignmentId: number;
}

export function NoteSystem({ assignmentId }: NoteSystemProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newNote, setNewNote] = useState("");
  
  // Fetch assignment notes
  const { data: notes, isLoading } = useQuery({
    queryKey: [`/api/assignments/${assignmentId}/notes`],
    retry: false,
  });

  // Fetch assignment details
  const { data: assignment } = useQuery({
    queryKey: [`/api/assignments/${assignmentId}`],
    retry: false,
  });

  // Add a new note
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest(
        "POST", 
        `/api/assignments/${assignmentId}/notes`, 
        { content }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Note Added",
        description: "Your note has been added successfully.",
      });
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: [`/api/assignments/${assignmentId}/notes`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add note.",
        variant: "destructive",
      });
    },
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteMutation.mutate(newNote);
    }
  };

  return (
    <div className="space-y-6">
      {assignment && (
        <div className="mb-6">
          <h2 className="text-lg font-medium">{assignment.pathway.title}</h2>
          <p className="text-gray-500 text-sm">Student: {assignment.connection.targetUser.username}</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progress Notes</CardTitle>
          <CardDescription>
            Add notes and feedback on student progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-3">
              <Textarea 
                placeholder="Add a note or feedback for this student..." 
                className="flex-grow"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button 
                className="flex-shrink-0 self-end"
                onClick={handleAddNote}
                disabled={!newNote.trim() || addNoteMutation.isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {isLoading 
                  ? "Loading notes..." 
                  : notes?.length === 0
                  ? "No notes yet. Add the first note above."
                  : `${notes?.length} note${notes?.length !== 1 ? 's' : ''}`
                }
              </div>
              
              {isLoading ? (
                <div className="py-4 flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : !notes || notes.length === 0 ? null : (
                <ScrollArea className="max-h-[300px]">
                  <div className="space-y-4">
                    {notes.map((note: any) => (
                      <div key={note.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={note.author.profileImageUrl} alt={note.author.username} />
                          <AvatarFallback>{note.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{note.author.username}</span>
                            <span className="text-gray-500 text-xs flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-700">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Activity History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity History</CardTitle>
          <CardDescription>
            Recent activity on this pathway
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 flex items-center justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !assignment ? (
            <p className="text-gray-500 text-sm">No activity history available</p>
          ) : (
            <div className="space-y-3">
              {assignment.moduleProgress
                .filter((mp: any) => mp.lastActivity)
                .sort((a: any, b: any) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                .slice(0, 5)
                .map((mp: any) => {
                  const module = assignment.pathway.modules.find((m: any) => m.id === mp.moduleId);
                  return (
                    <div key={mp.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="bg-blue-50 text-blue-700 p-2 rounded">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{assignment.connection.targetUser.username}</span>
                          {mp.status === "COMPLETED" 
                            ? " completed " 
                            : mp.status === "IN_PROGRESS" 
                            ? " worked on " 
                            : " viewed "
                          }
                          module <span className="font-medium">{module?.title || "Unknown"}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(mp.lastActivity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
              })}
              
              {assignment.moduleProgress.filter((mp: any) => mp.lastActivity).length === 0 && (
                <p className="text-gray-500 text-sm py-2">No activity recorded yet</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}