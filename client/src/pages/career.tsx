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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChatInterface, { ChatInterfaceComponent } from "@/components/chat-interface";
import InterviewPractice from "@/components/interview-practice";
import JobSearch from "@/components/job-search";
import SalaryInsights from "@/components/salary-insights";
import EmploymentRights from "@/components/employment-rights";
import RiasecTest from "@/components/riasec-test";
import EmotionalResilienceTracker from "@/components/emotional-resilience-tracker";
import ResumeBuilder from "@/components/resume-builder";
import React, { useState, useRef } from "react";
import { GraduationCap, Search, Book, Brain, FileText, Briefcase, DollarSign, MessageSquare, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

interface SkillGuidanceResponse {
  guidance: string;
}

// Define career as a const to ensure proper type inference
const CAREER_CATEGORY = "career" as const;

// Define sections with their icons and components
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
};
const SECTIONS: SectionType[] = [
  {
    id: 'chat',
    title: 'Career AI Coach',
    description: 'Get professional guidance for your career journey',
    icon: Brain,
    component: ChatInterface as ChatInterfaceComponent,
    props: { category: CAREER_CATEGORY }
  },
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
  const carouselRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Career Development
      </h1>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl border-rose-50 bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="h-6 w-6 text-primary" />
              Learning Path
            </DialogTitle>
            <DialogDescription>
              Career guidance based on your search query
            </DialogDescription>
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

      {/* Book-style card carousel */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            const isExpanded = expandedSection === section.id;
            
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  isExpanded={isExpanded}
                  onToggle={handleCardClick}
                  color="text-blue-500" // Career section color from the home page
                >
                  {(() => {
                    if (section.id === 'chat') {
                      // Use the component's required "category" prop
                      return <ChatInterface category={CAREER_CATEGORY} />;
                    } else if (section.props) {
                      // For components with props, properly cast and pass their props
                      return <section.component {...section.props as any} />;
                    } else {
                      // For components without props
                      return <section.component />;
                    }
                  })()}
                </BookCard>
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}