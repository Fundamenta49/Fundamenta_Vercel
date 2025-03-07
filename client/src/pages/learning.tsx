import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import VehicleGuide from "@/components/vehicle-guide";
import HandymanGuide from "@/components/handyman-guide";
import CareerInterestAssessment from "@/components/career-interest-assessment";
import { GraduationCap, Book, Target, Brain, Lightbulb, Car, Wrench } from "lucide-react";

export default function Learning() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learning & Development</h1>

      <Tabs defaultValue="assessment">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="assessment">Career Assessment</TabsTrigger>
            <TabsTrigger value="chat">AI Learning Coach</TabsTrigger>
            <TabsTrigger value="skills">Skill Building</TabsTrigger>
            <TabsTrigger value="courses">Learning Paths</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle Maintenance</TabsTrigger>
            <TabsTrigger value="handyman">Home Repairs</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assessment" className="mt-6">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Holland Code (RIASEC) Career Assessment</CardTitle>
              <CardDescription>
                Discover your career interests and learning preferences through this standardized assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <CareerInterestAssessment />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Learning AI Coach</CardTitle>
              <CardDescription>
                Get personalized guidance for your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ChatInterface category="learning" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-blue-500" />
                Skill Building Resources
              </CardTitle>
              <CardDescription>
                Discover and develop new skills with structured learning paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technical Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>Programming & Development</li>
                      <li>Data Analysis</li>
                      <li>Digital Marketing</li>
                      <li>Design & Creative Tools</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Soft Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>Communication</li>
                      <li>Leadership</li>
                      <li>Problem Solving</li>
                      <li>Time Management</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <VehicleGuide />
        </TabsContent>

        <TabsContent value="handyman">
          <HandymanGuide />
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Learning Paths
              </CardTitle>
              <CardDescription>
                Structured courses and learning materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Paths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>Web Development Fundamentals</li>
                      <li>Digital Marketing Essentials</li>
                      <li>Business Analytics</li>
                      <li>Project Management</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}