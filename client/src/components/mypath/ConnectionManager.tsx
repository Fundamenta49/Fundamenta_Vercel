import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, UserConnection } from "@shared/schema";
import { RefreshCw, Check, X, Copy, UserPlus, Users, AlertCircle } from "lucide-react";

export function ConnectionManager() {
  const { toast } = useToast();
  const [pairingCode, setPairingCode] = useState<string>("");
  const [connectionCode, setConnectionCode] = useState<string>("");

  // Fetch user's connections
  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["/api/connections"],
    retry: false,
  });

  // Fetch pending connection requests
  const { data: pendingRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["/api/connections/pending"],
    retry: false,
  });

  // Generate a pairing code
  const generatePairingCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/connections/generate-code");
      return await response.json();
    },
    onSuccess: (data) => {
      setConnectionCode(data.code);
      toast({
        title: "Pairing Code Generated",
        description: "Share this code with your student to establish a connection.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate pairing code.",
        variant: "destructive",
      });
    },
  });

  // Connect using a pairing code
  const connectWithCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/connections/connect", { code });
      return await response.json();
    },
    onSuccess: () => {
      setPairingCode("");
      toast({
        title: "Connection Request Sent",
        description: "Your request has been sent and is pending approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections/pending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to connect with this code.",
        variant: "destructive",
      });
    },
  });

  // Accept a connection request
  const acceptConnectionMutation = useMutation({
    mutationFn: async (connectionId: number) => {
      const response = await apiRequest("POST", `/api/connections/${connectionId}/accept`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection Accepted",
        description: "You are now connected with this user.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/connections/pending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to accept connection.",
        variant: "destructive",
      });
    },
  });

  // Reject a connection request
  const rejectConnectionMutation = useMutation({
    mutationFn: async (connectionId: number) => {
      const response = await apiRequest("POST", `/api/connections/${connectionId}/reject`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection Rejected",
        description: "The connection request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections/pending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject connection.",
        variant: "destructive",
      });
    },
  });

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(connectionCode);
    toast({
      title: "Copied to Clipboard",
      description: "The connection code has been copied to your clipboard.",
    });
  };

  return (
    <Tabs defaultValue="active">
      <TabsList className="w-full mb-6 grid grid-cols-3">
        <TabsTrigger value="active" className="px-2 md:px-4 py-1.5 text-xs sm:text-sm whitespace-normal h-auto">
          <span className="md:hidden">Active</span>
          <span className="hidden md:inline">Active Connections</span>
        </TabsTrigger>
        <TabsTrigger value="pending" className="px-2 md:px-4 py-1.5 text-xs sm:text-sm whitespace-normal h-auto">
          <span className="md:hidden">Pending</span>
          <span className="hidden md:inline">Pending Requests</span>
        </TabsTrigger>
        <TabsTrigger value="new" className="px-2 md:px-4 py-1.5 text-xs sm:text-sm whitespace-normal h-auto">
          <span className="md:hidden">Create</span>
          <span className="hidden md:inline">Create Connection</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Active Connections</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/connections"] })}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          {isLoadingConnections ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !connections || connections.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Users className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No active connections</h3>
                <p className="text-gray-500 mt-2">Create a connection to get started.</p>
                <Button className="mt-4" variant="outline" onClick={() => document.querySelector('button[data-value="new"]')?.click()}>
                  Create Connection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection: UserConnection) => (
                <Card key={connection.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{connection.targetUser?.username}</CardTitle>
                      <Badge>{connection.role === 'MENTOR' ? 'Student' : 'Mentor'}</Badge>
                    </div>
                    <CardDescription>{connection.targetUser?.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <p><strong>Connected since:</strong> {new Date(connection.createdAt).toLocaleDateString()}</p>
                      <p className="mt-1"><strong>Status:</strong> {connection.status}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/mypath/connections/${connection.id}`}>Manage</a>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="pending">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Pending Connection Requests</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/connections/pending"] })}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          {isLoadingRequests ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !pendingRequests || pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <AlertCircle className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No pending requests</h3>
                <p className="text-gray-500 mt-2">All connection requests have been handled.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request: UserConnection) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{request.sourceUser?.username}</CardTitle>
                      <Badge variant="outline">{request.role === 'MENTOR' ? 'Wants to mentor you' : 'Wants to be mentored'}</Badge>
                    </div>
                    <CardDescription>{request.sourceUser?.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                      <p className="mt-2 text-gray-600">
                        This user wants to connect with you as {request.role === 'MENTOR' ? 'your mentor' : 'your student'}.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => rejectConnectionMutation.mutate(request.id)}
                      disabled={rejectConnectionMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => acceptConnectionMutation.mutate(request.id)}
                      disabled={acceptConnectionMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="new">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Connection Code</CardTitle>
              <CardDescription>
                Generate a code to share with someone who wants to connect with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="connection-code">Your Connection Code</Label>
                  <div className="flex mt-1">
                    <Input 
                      id="connection-code" 
                      value={connectionCode} 
                      readOnly 
                      placeholder="Generate a code to share"
                      className="rounded-r-none font-mono"
                    />
                    <Button 
                      className="rounded-l-none px-3" 
                      onClick={copyCodeToClipboard}
                      disabled={!connectionCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    This code will expire in 24 hours.
                  </p>
                </div>
                
                <Button 
                  onClick={() => generatePairingCodeMutation.mutate()}
                  disabled={generatePairingCodeMutation.isPending}
                  className="w-full"
                >
                  {connectionCode ? "Generate New Code" : "Generate Code"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connect with Code</CardTitle>
              <CardDescription>
                Enter a connection code received from someone else
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pairing-code">Enter Connection Code</Label>
                  <Input 
                    id="pairing-code" 
                    value={pairingCode} 
                    onChange={(e) => setPairingCode(e.target.value)} 
                    placeholder="Enter the code you received"
                    className="font-mono"
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    You'll need to wait for the other person to accept your connection request.
                  </p>
                </div>
                
                <Button 
                  onClick={() => connectWithCodeMutation.mutate(pairingCode)}
                  disabled={connectWithCodeMutation.isPending || !pairingCode}
                  className="w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}