import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInterface from "@/components/chat-interface";
import VehicleGuide from "@/components/vehicle-guide";
import HandymanGuide from "@/components/handyman-guide";
import { useState } from "react";
import { GraduationCap, Book, Target, Brain, Lightbulb, Car, Wrench } from "lucide-react";

// Skill categories with their learning paths
const TECHNICAL_SKILLS = [
  {
    name: "Programming & Development",
    areas: ["Web Development", "Mobile Apps", "Data Science", "Cloud Computing"]
  },
  {
    name: "Data Analysis",
    areas: ["SQL", "Python", "Data Visualization", "Statistical Analysis"]
  },
  {
    name: "Digital Marketing",
    areas: ["SEO", "Social Media", "Content Marketing", "Analytics"]
  },
  {
    name: "Design & Creative Tools",
    areas: ["UI/UX Design", "Graphic Design", "Video Editing", "3D Modeling"]
  }
];

const SOFT_SKILLS = [
  {
    name: "Communication",
    areas: ["Public Speaking", "Writing", "Active Listening", "Presentation"]
  },
  {
    name: "Leadership",
    areas: ["Team Management", "Decision Making", "Strategic Planning", "Delegation"]
  },
  {
    name: "Problem Solving",
    areas: ["Critical Thinking", "Innovation", "Research", "Analysis"]
  },
  {
    name: "Time Management",
    areas: ["Priority Setting", "Goal Planning", "Productivity", "Organization"]
  }
];

interface SkillGuidanceResponse {
  guidance: string;
}

export default function Learning() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSkillGuidance = async (skillType: "technical" | "soft", area: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: skillType,
          userQuery: `I want to learn ${area}. Please provide a detailed learning path and resources.`
        })
      });

      const data: SkillGuidanceResponse = await response.json();
      setGuidance(data.guidance);
    } catch (error) {
      console.error("Error getting skill guidance:", error);
      setGuidance("Sorry, we couldn't load the guidance right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learning & Development</h1>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Learning Coach</TabsTrigger>
            <TabsTrigger value="skills">Skill Building</TabsTrigger>
            <TabsTrigger value="courses">Learning Paths</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle Maintenance</TabsTrigger>
            <TabsTrigger value="handyman">Home Repairs</TabsTrigger>
            <TabsTrigger value="goals">Goal Setting</TabsTrigger>
          </TabsList>
        </div>

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
                {/* Technical Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technical Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {TECHNICAL_SKILLS.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <Button
                            variant={selectedSkill === skill.name ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedSkill(skill.name);
                              setSelectedArea(null);
                              setGuidance(null);
                            }}
                          >
                            {skill.name}
                          </Button>

                          {selectedSkill === skill.name && (
                            <div className="pl-4 space-y-2">
                              {skill.areas.map((area) => (
                                <Button
                                  key={area}
                                  variant={selectedArea === area ? "default" : "outline"}
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    setSelectedArea(area);
                                    getSkillGuidance("technical", area);
                                  }}
                                >
                                  {area}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Soft Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Soft Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {SOFT_SKILLS.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <Button
                            variant={selectedSkill === skill.name ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedSkill(skill.name);
                              setSelectedArea(null);
                              setGuidance(null);
                            }}
                          >
                            {skill.name}
                          </Button>

                          {selectedSkill === skill.name && (
                            <div className="pl-4 space-y-2">
                              {skill.areas.map((area) => (
                                <Button
                                  key={area}
                                  variant={selectedArea === area ? "default" : "outline"}
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    setSelectedArea(area);
                                    getSkillGuidance("soft", area);
                                  }}
                                >
                                  {area}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Guidance Display */}
              {(isLoading || guidance) && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedArea} - Learning Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center text-muted-foreground">
                        Loading personalized guidance...
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        {guidance?.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
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

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Goal Setting & Progress Tracking
              </CardTitle>
              <CardDescription>
                Set and track your learning objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Learning Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Set up your learning goals and track your progress over time.
                      Coming soon!
                    </p>
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