import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Gamepad2, Map, Users, Sparkles, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function MyPathPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // Check if there's a URL hash to set the active tab
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'connections', 'pathways', 'assignments'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);
  
  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-teal-700">
            <Map className="h-8 w-8" />
            MyPath
          </h1>
          <p className="text-gray-600 mt-1 text-lg">Create, manage, and assign learning pathways</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              toast({
                title: "Integration with Arcade",
                description: "Arcade content is now available when creating custom pathways!",
              });
            }}
          >
            <Gamepad2 className="h-4 w-4" />
            Arcade Integration
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="pathways">Learning Pathways</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Connections
                </CardTitle>
                <CardDescription>Create connections with students</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Establish mentor-student connections to track progress and assign learning pathways.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/mypath#connections">Manage Connections</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Pathways
                </CardTitle>
                <CardDescription>Create custom learning journeys</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Design personalized learning pathways with modules from Fundamenta's content or create your own.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/mypath#pathways">Create Pathways</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  Assignments
                </CardTitle>
                <CardDescription>Assign pathways and track progress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Assign learning pathways to your connected students and monitor their progress in real-time.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/mypath#assignments">Manage Assignments</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-teal-50 p-6 rounded-lg border border-teal-200 mt-8">
            <h3 className="text-xl font-semibold text-teal-800 mb-2">Welcome to MyPath</h3>
            <p className="text-teal-700">
              MyPath allows you to create personalized learning experiences. Connect with students, design custom learning pathways, and track their progress—all in one place.
            </p>
            <div className="mt-4 flex gap-4">
              <Button className="bg-teal-700 hover:bg-teal-800">Get Started</Button>
              <Button variant="outline" className="border-teal-300 text-teal-700">
                Learn More
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Connections</CardTitle>
              <CardDescription>View and manage your connections with students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                This area will contain the interface for managing connections, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Creating connection codes for students to use</li>
                <li>Accepting or rejecting incoming connection requests</li>
                <li>Viewing your active connections</li>
                <li>Managing connection permissions and roles</li>
              </ul>
              <div className="mt-8 p-4 bg-blue-50 rounded-md text-blue-700 text-sm">
                The connections system is being implemented. Check back soon for the complete interface.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pathways" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Pathways</CardTitle>
              <CardDescription>Create and manage custom learning pathways</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                This area will contain the pathway builder interface, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Creating new pathways with customizable metadata</li>
                <li>Adding content modules from the Fundamenta library</li>
                <li>Creating custom content modules</li>
                <li>Arranging modules into a coherent learning sequence</li>
                <li>Setting completion criteria and achievements</li>
              </ul>
              <div className="mt-8 p-4 bg-green-50 rounded-md text-green-700 text-sm">
                The pathway builder is being implemented. Check back soon for the complete interface.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pathway Assignments</CardTitle>
              <CardDescription>Assign pathways and track student progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                This area will contain the assignment management interface, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Assigning pathways to connected students</li>
                <li>Setting deadlines and expectations</li>
                <li>Viewing detailed progress reports</li>
                <li>Adding notes and feedback on student progress</li>
                <li>Generating achievement certificates</li>
              </ul>
              <div className="mt-8 p-4 bg-amber-50 rounded-md text-amber-700 text-sm">
                The assignment system is being implemented. Check back soon for the complete interface.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}