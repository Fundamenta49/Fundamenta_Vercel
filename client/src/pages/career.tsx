import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import ResumeBuilder from "@/components/resume-builder";
import React, { useState } from "react";
import { GraduationCap, Search, Book, Brain, FileText, Briefcase, DollarSign, MessageSquare, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillGuidanceResponse {
  guidance: string;
}

// Define sections with their icons and components
const SECTIONS = [
  {
    id: 'assessment',
    title: 'Career Assessment',
    description: 'Discover your career interests and strengths',
    icon: GraduationCap,
    component: RiasecTest
  },
  {
    id: 'resume',
    title: 'Resume Builder',
    description: 'Create and manage your professional resume',
    icon: FileText,
    component: ResumeBuilder
  },
  {
    id: 'chat',
    title: 'Career AI Coach',
    description: 'Get professional guidance for your career journey',
    icon: Brain,
    component: ChatInterface,
    props: { category: "career" as "career" }
  },
  {
    id: 'search',
    title: 'Job Search',
    description: 'Find your next career opportunity',
    icon: Briefcase,
    component: JobSearch
  },
  {
    id: 'salary',
    title: 'Salary Insights',
    description: 'Research and compare salary information',
    icon: DollarSign,
    component: SalaryInsights
  },
  {
    id: 'interview',
    title: 'Interview Practice',
    description: 'Prepare for job interviews with AI feedback',
    icon: MessageSquare,
    component: InterviewPractice
  },
  {
    id: 'resilience',
    title: 'EQ & Resilience',
    description: 'Build emotional intelligence and career resilience',
    icon: Brain,
    component: EmotionalResilienceTracker
  },
  {
    id: 'rights',
    title: 'Employment Rights',
    description: 'Learn about your workplace rights and protections',
    icon: Scale,
    component: EmploymentRights
  }
];

export default function Career() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
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

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Career Development</h1>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl border-rose-50 bg-white">
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

      <div className="grid gap-4 sm:gap-6">
        {SECTIONS.map((section) => (
          <Card 
            key={section.id}
            className={cn(
              "transition-all duration-300 ease-in-out cursor-pointer overflow-hidden",
              "hover:shadow-md bg-white w-full max-w-full",
              expandedSection === section.id ? "shadow-lg" : "shadow-sm"
            )}
            onClick={() => handleCardClick(section.id)}
          >
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <CardTitle className="text-xl sm:text-2xl">{section.title}</CardTitle>
              </div>
              <CardDescription className="text-base sm:text-lg">
                {section.description}
              </CardDescription>
            </CardHeader>
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                "overflow-hidden w-full",
                expandedSection === section.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <CardContent className="p-3 sm:p-6 w-full">
                {expandedSection === section.id && (
                  <div className="w-full">
                    {(() => {
                      if (section.id === 'chat') {
                        // Use the component's required "category" prop
                        return <ChatInterface category="career" />;
                      } else if (section.props) {
                        // For components with props, properly cast and pass their props
                        return <section.component {...section.props as any} />;
                      } else {
                        // For components without props
                        return <section.component />;
                      }
                    })()}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}