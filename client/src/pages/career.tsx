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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ChatInterface from "@/components/chat-interface";
import InterviewPractice from "@/components/interview-practice";
import JobSearch from "@/components/job-search";
import SalaryInsights from "@/components/salary-insights";
import EmploymentRights from "@/components/employment-rights";
import RiasecTest from "@/components/riasec-test";
import EmotionalResilienceTracker from "@/components/emotional-resilience-tracker";
import { useState } from "react";
import { GraduationCap, Search, ExternalLink } from "lucide-react";

// List of curated learning platforms with their URLs
const LEARNING_RESOURCES = [
  {
    name: "Interactive Learning Platforms",
    links: [
      { title: "Codecademy", url: "https://www.codecademy.com" },
      { title: "freeCodeCamp", url: "https://www.freecodecamp.org" },
      { title: "Coursera", url: "https://www.coursera.org" }
    ]
  },
  {
    name: "Video Tutorials",
    links: [
      { title: "Khan Academy", url: "https://www.khanacademy.org" },
      { title: "LinkedIn Learning", url: "https://www.linkedin.com/learning" },
      { title: "Udemy", url: "https://www.udemy.com" }
    ]
  },
  {
    name: "Practice Exercises",
    links: [
      { title: "LeetCode", url: "https://leetcode.com" },
      { title: "HackerRank", url: "https://www.hackerrank.com" },
      { title: "Exercism", url: "https://exercism.org" }
    ]
  },
  {
    name: "Community Forums",
    links: [
      { title: "Stack Overflow", url: "https://stackoverflow.com" },
      { title: "GitHub Discussions", url: "https://github.com/discussions" },
      { title: "Dev.to", url: "https://dev.to" }
    ]
  }
];

export default function Career() {
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setDialogOpen(true);
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "search",
          userQuery: searchQuery,
        }),
      });

      const data: SkillGuidanceResponse = await response.json();
      setGuidance(data.guidance);
    } catch (error) {
      console.error("Error searching skills:", error);
      setGuidance("Sorry, we couldn't process your search right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Career Development</h1>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="h-6 w-6 text-primary" />
              Learning Path
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{guidance}</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="assessment">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="assessment">Career Assessment</TabsTrigger>
            <TabsTrigger value="coach">Career & Resume AI Coach</TabsTrigger>
            <TabsTrigger value="learning">Learning Paths</TabsTrigger>
            <TabsTrigger value="resilience">EQ & Resilience</TabsTrigger>
            <TabsTrigger value="search">Job Search</TabsTrigger>
            <TabsTrigger value="salary">Salary Insights</TabsTrigger>
            <TabsTrigger value="interview">Interview Practice</TabsTrigger>
            <TabsTrigger value="rights">Employment Rights</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="assessment">
          <RiasecTest />
        </TabsContent>

        <TabsContent value="coach">
          <Card>
            <CardHeader>
              <CardTitle>Career & Resume AI Coach</CardTitle>
              <CardDescription>
                Get professional guidance for your career journey and resume optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface category="career-resume" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Learning Paths</CardTitle>
              <CardDescription>
                Search for skills you want to learn and get personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for any skill you want to learn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {LEARNING_RESOURCES.map((resource, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {resource.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Button
                              variant="link"
                              className="p-0 h-auto font-normal text-primary hover:text-primary/80"
                              onClick={() => window.open(link.url, '_blank')}
                            >
                              <span className="flex items-center gap-1">
                                {link.title}
                                <ExternalLink className="h-3 w-3" />
                              </span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resilience">
          <EmotionalResilienceTracker />
        </TabsContent>

        <TabsContent value="search">
          <JobSearch />
        </TabsContent>

        <TabsContent value="salary">
          <SalaryInsights />
        </TabsContent>

        <TabsContent value="interview">
          <InterviewPractice />
        </TabsContent>

        <TabsContent value="rights">
          <EmploymentRights />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SkillGuidanceResponse {
  guidance: string;
}