import { Clock, CalendarDays, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

/**
 * Placeholder component for the learning calendar that has been removed.
 * This preserves the navigation functionality from the sidebar while 
 * informing users that they should use the education/courses pages instead.
 */
export default function LearningCalendarPlaceholder() {
  const [, navigate] = useLocation();

  return (
    <div className="container max-w-5xl py-8">
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle>Learning Schedule</CardTitle>
            </div>
          </div>
          <CardDescription>
            This feature has been integrated into the main education platform
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            <div className="flex items-start">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium">Calendar Update</h3>
                <p className="mt-1">
                  The separate calendar view has been removed. All learning resources 
                  are now available directly through the Learning section.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Explore Skills</CardTitle>
                <CardDescription>Browse available courses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover courses in financial literacy, career development, 
                  home maintenance, and more.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/learning")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Learning Resources
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Progress</CardTitle>
                <CardDescription>Track your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Follow your progress through various courses and skills development.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/learning/pathways")}
                  variant="outline"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  View Learning Pathways
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}