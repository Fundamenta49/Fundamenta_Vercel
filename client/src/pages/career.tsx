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
import CareerCoachPopOut from "@/components/career-coach-pop-out";
import CareerAssessmentPopOut from "@/components/career-assessment-pop-out";
import ResumeBuilderPopOut from "@/components/resume-builder-pop-out";
import JobSearchPopOut from "@/components/job-search-pop-out";
import SalaryInsightsPopOut from "@/components/salary-insights-pop-out";
import InterviewPracticePopOut from "@/components/interview-practice-pop-out";
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
    id: 'chat',
    title: 'Career AI Coach',
    description: 'Get professional guidance for your career journey',
    icon: Brain,
    component: CareerCoachPopOut
  },
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
    title: 'Job Search',
    description: 'Find your next career opportunity',
    icon: Briefcase,
    component: JobSearchPopOut
  },
  {
    id: 'salary',
    title: 'Salary Insights',
    description: 'Research and compare salary information',
    icon: DollarSign,
    component: SalaryInsightsPopOut
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
                  onToggle={(sectionId) => {
                    if (isExpanded) {
                      setExpandedSection(null);
                    } else {
                      setExpandedSection(sectionId);
                    }
                  }}
                  color="text-blue-500" // Career section color from the home page
                >
                  {isExpanded && (
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                      <Button 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDialog(section.id);
                        }}
                      >
                        Open {section.title}
                      </Button>
                    </div>
                  )}
                </BookCard>
                
                {/* Mobile quick-access button */}
                {isMobile && !isExpanded && (
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDialog(section.id);
                      }}
                    >
                      Open {section.title}
                    </Button>
                  </div>
                )}
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}