import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat-interface";
import VehicleGuide from "@/components/vehicle-guide";
import HandymanGuide from "@/components/handyman-guide";
import { 
  Book, 
  Target, 
  Brain, 
  Lightbulb,
  Car,
  Wrench,
  Search,
  Home
} from "lucide-react";
import LearningCalendar from "@/components/learning-calendar";
import { useState } from "react";

const LIFE_SKILLS_PROMPTS = [
  {
    title: "How to Properly Clean a Kitchen",
    description: "Washing dishes, sanitizing countertops, handling grease",
  },
  {
    title: "How to Clean a Bathroom",
    description: "Disinfecting toilets, tubs, and sinks",
  },
  {
    title: "Dusting & Vacuuming Techniques",
    description: "Avoiding allergies and keeping furniture clean",
  },
  {
    title: "How to Clean Windows, Mirrors & Floors",
    description: "Streak-free techniques",
  },
  {
    title: "Decluttering & Minimalist Living Tips",
    description: "Staying organized in small spaces",
  },
  {
    title: "Cleaning Schedule Generator",
    description: "Personalized schedule based on apartment/home size",
  }
];

export default function Learning() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Handle search functionality
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Learning & Development</h1>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Learning Coach</TabsTrigger>
            <TabsTrigger value="skills">Life Skills</TabsTrigger>
            <TabsTrigger value="calendar">Schedule</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle Maintenance</TabsTrigger>
            <TabsTrigger value="handyman">Home Repairs</TabsTrigger>
            <TabsTrigger value="goals">Goal Setting</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat">
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
                <Home className="h-5 w-5 text-primary" />
                Essential Life Skills
              </CardTitle>
              <CardDescription>
                Learn practical skills for everyday life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for life skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Skills Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  {LIFE_SKILLS_PROMPTS.map((prompt, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <CardDescription>{prompt.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
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

        <TabsContent value="calendar">
          <LearningCalendar />
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
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