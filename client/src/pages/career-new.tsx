import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  GraduationCap, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Brain, 
  Scale, 
  Loader2 
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

// Career Section Components
import ResumeBuilder from "@/components/career/resume-builder";
import JobSearch from "@/components/career/job-search";
import InterviewPractice from "@/components/career/interview-practice";
import CareerAssessment from "@/components/career/career-assessment";
import EmotionalResilience from "@/components/career/emotional-resilience";
import EmploymentRights from "@/components/career/employment-rights";

// Types
interface CareerSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  backgroundColor: string;
  textColor: string;
}

interface SkillGuidanceResponse {
  guidance: string;
}

// Career sections definitions
const CAREER_SECTIONS: CareerSection[] = [
  {
    id: 'resume',
    title: 'Resume Builder',
    description: 'Create and manage your professional resume',
    icon: FileText,
    component: ResumeBuilder,
    backgroundColor: 'bg-blue-50',
    textColor: 'text-blue-800'
  },
  {
    id: 'job-search',
    title: 'Job Search',
    description: 'Find opportunities and research salary insights',
    icon: Briefcase,
    component: JobSearch,
    backgroundColor: 'bg-green-50',
    textColor: 'text-green-800'
  },
  {
    id: 'interview',
    title: 'Interview Practice',
    description: 'Prepare for job interviews with AI feedback',
    icon: MessageSquare,
    component: InterviewPractice,
    backgroundColor: 'bg-purple-50',
    textColor: 'text-purple-800'
  },
  {
    id: 'assessment',
    title: 'Career Assessment',
    description: 'Discover your career interests and strengths',
    icon: GraduationCap,
    component: CareerAssessment,
    backgroundColor: 'bg-amber-50',
    textColor: 'text-amber-800'
  },
  {
    id: 'resilience',
    title: 'EQ & Resilience',
    description: 'Build emotional intelligence and career resilience',
    icon: Brain,
    component: EmotionalResilience,
    backgroundColor: 'bg-rose-50',
    textColor: 'text-rose-800'
  },
  {
    id: 'rights',
    title: 'Employment Rights',
    description: 'Learn about your workplace rights and protections',
    icon: Scale,
    component: EmploymentRights,
    backgroundColor: 'bg-indigo-50',
    textColor: 'text-indigo-800'
  }
];

export default function CareerPage() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [guidanceDialogOpen, setGuidanceDialogOpen] = useState(false);
  const [guidanceContent, setGuidanceContent] = useState<string | null>(null);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);

  // Handle section selection
  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setLocation(`/career/${sectionId}`);
  };

  // Check URL for direct navigation
  useEffect(() => {
    const path = window.location.pathname;
    const sectionMatch = path.match(/\/career\/(.+)/);
    
    if (sectionMatch && sectionMatch[1]) {
      const sectionId = sectionMatch[1];
      const validSection = CAREER_SECTIONS.find(section => section.id === sectionId);
      if (validSection) {
        setActiveSection(sectionId);
      }
    }
    
    // Listen for AI open section events
    const handleOpenSectionEvent = (event: CustomEvent) => {
      const { route, section } = event.detail;
      // Only handle if this is the career page
      if (route === '/career') {
        const validSection = CAREER_SECTIONS.find(s => s.id === section);
        if (validSection) {
          handleSelectSection(section);
        }
      }
    };
    
    // Add event listener
    document.addEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    };
  }, [setLocation]);

  // Mock career guidance fetch (will be replaced with real API call)
  const fetchCareerGuidance = async (query: string) => {
    setIsLoadingGuidance(true);
    setGuidanceDialogOpen(true);
    
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "career",
          userQuery: query,
        }),
      });

      const data: SkillGuidanceResponse = await response.json();
      setGuidanceContent(data.guidance);
    } catch (error) {
      console.error("Error fetching career guidance:", error);
      setGuidanceContent("Sorry, we couldn't process your request right now. Please try again later.");
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  // Render the active section component
  const renderActiveSection = () => {
    if (!activeSection) return null;
    
    const section = CAREER_SECTIONS.find(s => s.id === activeSection);
    if (!section) return null;
    
    const SectionComponent = section.component;
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => {
            setActiveSection(null);
            setLocation('/career');
          }}
        >
          ← Back to Career Development
        </Button>
        <div className="mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <section.icon className="h-6 w-6" />
            {section.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{section.description}</p>
        </div>
        <SectionComponent />
      </div>
    );
  };

  // Main page content
  return (
    <div className="w-full min-h-screen">
      {!activeSection ? (
        <div className="w-full max-w-6xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-6">Career Development</h1>
          
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Develop Your Career Skills</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Explore our career development tools to build your professional skills, 
                create a standout resume, practice for interviews, and find job opportunities.
              </p>
              <Button 
                onClick={() => fetchCareerGuidance("What career path should I choose?")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Career Guidance
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_SECTIONS.map((section) => (
              <Card 
                key={section.id}
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectSection(section.id)}
              >
                <div className={`h-2 ${section.backgroundColor}`} />
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${section.backgroundColor} mr-4`}>
                      <section.icon className={`h-6 w-6 ${section.textColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{section.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        renderActiveSection()
      )}
      
      {/* Career Guidance Dialog */}
      <Dialog open={guidanceDialogOpen} onOpenChange={setGuidanceDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="h-6 w-6 text-primary" />
              Career Guidance
            </DialogTitle>
            <DialogDescription>
              Personalized career advice and direction
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {isLoadingGuidance ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{guidanceContent}</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}