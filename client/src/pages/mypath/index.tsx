import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectionManager } from "@/components/mypath/ConnectionManager";
import { PathwayBuilder } from "@/components/mypath/PathwayBuilder";
import { MentorAssignmentDashboard } from "@/components/mypath/MentorAssignmentDashboard";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  ClipboardList, 
  BarChart3, 
  School
} from "lucide-react";

export default function MyPathPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("connections");
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MyPath</h1>
          <p className="text-muted-foreground mt-1">
            Create custom learning pathways and track student progress
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/mypath/user-analytics">
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              <User className="h-4 w-4" />
              My Analytics
            </Button>
          </Link>
          <Link href="/mypath/analytics">
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Admin Analytics
            </Button>
          </Link>
          <Link href="/mypath/student">
            <Button 
              className="hidden md:flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              View Student Portal
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">MyPath Navigation</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <div className="space-y-1">
                <Button
                  variant={activeTab === "connections" ? "default" : "ghost"}
                  className="w-full justify-start min-w-[120px] px-3"
                  onClick={() => setActiveTab("connections")}
                >
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Connections</span>
                </Button>
                <Button
                  variant={activeTab === "pathways" ? "default" : "ghost"}
                  className="w-full justify-start min-w-[120px] px-3"
                  onClick={() => setActiveTab("pathways")}
                >
                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Pathways</span>
                </Button>
                <Button
                  variant={activeTab === "assignments" ? "default" : "ghost"}
                  className="w-full justify-start min-w-[120px] px-3"
                  onClick={() => setActiveTab("assignments")}
                >
                  <ClipboardList className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Assignments</span>
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "ghost"}
                  className="w-full justify-start min-w-[120px] px-3"
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart3 className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">My Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Info</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Role:</span>
                <span className="text-sm">Educator</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Active Connections:</span>
                <span className="text-sm">{user ? 3 : 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Active Pathways:</span>
                <span className="text-sm">{user ? 5 : 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden col-span-1 space-y-4">
          <div className="flex justify-end mb-2">
            <Link href="/mypath/student">
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                <span>Student View</span>
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="connections" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="connections" className="text-xs py-1 px-0">
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden xs:inline">Connections</span>
              </TabsTrigger>
              <TabsTrigger value="pathways" className="text-xs py-1 px-0">
                <BookOpen className="h-4 w-4 md:mr-2" />
                <span className="hidden xs:inline">Pathways</span>
              </TabsTrigger>
              <TabsTrigger value="assignments" className="text-xs py-1 px-0">
                <ClipboardList className="h-4 w-4 md:mr-2" />
                <span className="hidden xs:inline">Assignments</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs py-1 px-0">
                <BarChart3 className="h-4 w-4 md:mr-2" />
                <span className="hidden xs:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-9 lg:col-span-10">
          {activeTab === "connections" && (
            <ConnectionManager />
          )}
          
          {activeTab === "pathways" && (
            <PathwayBuilder />
          )}
          
          {activeTab === "assignments" && (
            <MentorAssignmentDashboard />
          )}
          
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Learning Analytics</CardTitle>
                  <CardDescription>
                    Track your personal progress and learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Completion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-24">
                          <div className="text-4xl font-bold">54%</div>
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Overall course completion
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Learning Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-24">
                          <div className="text-4xl font-bold">26.5h</div>
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Total time spent learning
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Achievements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-24">
                          <div className="text-4xl font-bold">8</div>
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Badges earned
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Learning Path Progress</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Financial Basics</span>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                        <div className="w-full bg-secondary/20 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Cooking Fundamentals</span>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                        <div className="w-full bg-secondary/20 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Home Maintenance</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <div className="w-full bg-secondary/20 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 mb-4">
                    <Link href="/mypath/user-analytics">
                      <Button className="w-full">
                        View Detailed Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}