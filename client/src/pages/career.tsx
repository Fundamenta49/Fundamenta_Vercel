import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  FullScreenDialog, 
  FullScreenDialogContent, 
  FullScreenDialogHeader, 
  FullScreenDialogTitle, 
  FullScreenDialogDescription, 
  FullScreenDialogBody 
} from "@/components/ui/full-screen-dialog";

import CareerAssessmentPopOut from "@/components/career-assessment-pop-out";
import ResumeBuilderPopOut from "@/components/career/resume-builder-pop-out";
import JobSearchPopOut from "@/components/career/job-search-pop-out";
// SalaryInsights is now part of JobSearchPopOut
import InterviewPracticePopOut from "@/components/career/interview-practice-pop-out";
import EmotionalResiliencePopOut from "@/components/emotional-resilience-pop-out";
import EmploymentRightsPopOut from "@/components/employment-rights-pop-out";
import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { GraduationCap, Search, Book, Brain, FileText, Briefcase, DollarSign, MessageSquare, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

interface SkillGuidanceResponse {
  guidance: string;
}

// Define sections with their icons and components
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
};

const SECTIONS: SectionType[] = [
  {
    id: 'assessment',
    title: 'Career Assessment',
    description: 'Discover your career interests and strengths',
    icon: GraduationCap,
    component: CareerAssessmentPopOut
  },
  {
    id: 'resume',
    title: 'Resume Builder',
    description: 'Create and manage your professional resume',
    icon: FileText,
    component: ResumeBuilderPopOut
  },
  {
    id: 'search',
    title: 'Fundamenta Connects',
    description: 'Find opportunities and research salary insights',
    icon: Briefcase,
    component: JobSearchPopOut
  },
  {
    id: 'interview',
    title: 'Interview Practice',
    description: 'Prepare for job interviews with AI feedback',
    icon: MessageSquare,
    component: InterviewPracticePopOut
  },
  {
    id: 'resilience',
    title: 'EQ & Resilience',
    description: 'Build emotional intelligence and career resilience',
    icon: Brain,
    component: EmotionalResiliencePopOut
  },
  {
    id: 'rights',
    title: 'Employment Rights',
    description: 'Learn about your workplace rights and protections',
    icon: Scale,
    component: EmploymentRightsPopOut
  }
];

export default function Career() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
    setActiveDialog(sectionId);
  };
  
  // Check sessionStorage for sections to open on mount
  useEffect(() => {
    const openSection = sessionStorage.getItem('openSection');
    if (openSection) {
      handleCardClick(openSection);
      // Clear after using
      sessionStorage.removeItem('openSection');
    }
    
    // Listen for AI open section events
    const handleOpenSectionEvent = (event: CustomEvent) => {
      const { route, section } = event.detail;
      // Only handle if this is the current page
      if (route === '/career') {
        handleCardClick(section);
      }
    };
    
    // Add event listener
    document.addEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    };
  }, []);

  return (
    <div className="w-full h-full mx-auto p-0 md:p-2 lg:p-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-2 md:mb-4">
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

      {/* Full-screen dialogs for each section */}
      {SECTIONS.map((section) => (
        <FullScreenDialog
          key={section.id}
          open={activeDialog === section.id}
          onOpenChange={(open) => {
            if (!open) setActiveDialog(null);
          }}
        >
          <FullScreenDialogContent>
            <FullScreenDialogHeader>
              <FullScreenDialogTitle>
                <div className="flex items-center gap-2">
                  <section.icon className="h-6 w-6 text-primary" />
                  {section.title}
                </div>
              </FullScreenDialogTitle>
              <FullScreenDialogDescription>
                {section.description}
              </FullScreenDialogDescription>
            </FullScreenDialogHeader>
            <FullScreenDialogBody>
              <section.component />
            </FullScreenDialogBody>
          </FullScreenDialogContent>
        </FullScreenDialog>
      ))}

      {/* Grid-style cards layout (similar to Learning section) */}
      <div className="px-2">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-blue-50 text-blue-800 rounded-md border-l-4 border-blue-500">
            Career Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-4 max-w-6xl mx-auto">
            {SECTIONS.map((section) => (
              <div key={section.id} className="flex flex-col h-full">
                <button
                  onClick={() => setActiveDialog(section.id)}
                  className="relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-500 min-h-[130px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] w-full h-full"
                  aria-label={`Open ${section.title}`}
                >
                  <div className="flex items-center justify-center h-12 sm:h-14 md:h-16 lg:h-20 w-full mb-2 md:mb-4">
                    <section.icon className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-blue-500" />
                  </div>
                  
                  <span className="text-sm sm:text-base md:text-lg font-medium text-center line-clamp-2 w-full">{section.title}</span>
                  
                  <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 lg:mt-3 line-clamp-2 md:line-clamp-3 text-center hidden sm:block">
                    {section.description.length > 80 && window.innerWidth > 768
                      ? `${section.description.substring(0, 80)}...` 
                      : section.description.length > 60
                        ? `${section.description.substring(0, 60)}...`
                        : section.description}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}