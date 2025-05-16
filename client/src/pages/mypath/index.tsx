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
          <Link href="/mypath/analytics">
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics Dashboard
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
                  <span className="truncate">Analytics</span>
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
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Track progress and engagement metrics for your students
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                  <School className="h-16 w-16 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    We're working on detailed analytics to help you track student progress, 
                    engagement, and learning outcomes.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}