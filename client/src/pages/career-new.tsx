import React, { useState, Suspense } from 'react';
import { 
  MegaDialog,
  MegaDialogContent,
  MegaDialogHeader,
  MegaDialogTitle,
  MegaDialogBody,
} from "@/components/ui/mega-dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, BookOpen, School, FileText, MessageSquare, Brain, Scale, Network, ArrowRight, X } from 'lucide-react';

// Use lazy loading for all components
const ResumeBuilder = React.lazy(() => import('@/components/career/resume-builder'));
const JobSearch = React.lazy(() => import('@/components/career/job-search-fullscreen'));
const InterviewPractice = React.lazy(() => import('@/components/career/interview-practice'));
const CareerAssessment = React.lazy(() => import('@/components/career/career-assessment/index'));
const EmotionalResilience = React.lazy(() => import('@/components/career/emotional-resilience/index'));
const EmploymentRights = React.lazy(() => import('@/components/career/employment-rights/index'));

// Skills for the skills section
const CAREER_SKILLS = [
  { name: 'Resume Building', icon: <FileText className="h-4 w-4" />, level: 'Foundational' },
  { name: 'Job Search Strategies', icon: <Briefcase className="h-4 w-4" />, level: 'Foundational' },
  { name: 'Interview Skills', icon: <MessageSquare className="h-4 w-4" />, level: 'Intermediate' },
  { name: 'Career Planning', icon: <BookOpen className="h-4 w-4" />, level: 'Advanced' },
  { name: 'Emotional Intelligence', icon: <Brain className="h-4 w-4" />, level: 'Advanced' },
  { name: 'Workplace Rights', icon: <Scale className="h-4 w-4" />, level: 'Intermediate' },
];

// Career tools data
const CAREER_TOOLS = [
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Create a professional resume with our step-by-step builder',
    icon: <FileText className="h-8 w-8" />,
    component: ResumeBuilder,
    color: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    id: 'job-search',
    title: 'Job Search',
    description: 'Find and apply to jobs that match your skills and interests',
    icon: <Briefcase className="h-8 w-8" />,
    component: JobSearch,
    color: 'bg-green-50 dark:bg-green-950'
  },
  {
    id: 'fundamenta-connects',
    title: 'Fundamenta Connects',
    description: 'Connect with professionals, mentors, and networking opportunities',
    icon: <Network className="h-8 w-8" />,
    component: React.lazy(() => import('@/components/career/fundamenta-connects')),
    color: 'bg-purple-50 dark:bg-purple-950'
  },
  {
    id: 'interview-practice',
    title: 'Interview Practice',
    description: 'Prepare for interviews with practice questions and feedback',
    icon: <MessageSquare className="h-8 w-8" />,
    component: InterviewPractice,
    color: 'bg-amber-50 dark:bg-amber-950'
  },
  {
    id: 'career-assessment',
    title: 'Career Assessment',
    description: 'Discover your strengths, interests, and career options',
    icon: <School className="h-8 w-8" />,
    component: CareerAssessment,
    color: 'bg-rose-50 dark:bg-rose-950'
  },
  {
    id: 'emotional-resilience',
    title: 'EQ & Resilience',
    description: 'Build emotional intelligence and resilience in the workplace',
    icon: <Brain className="h-8 w-8" />,
    component: EmotionalResilience,
    color: 'bg-indigo-50 dark:bg-indigo-950'
  },
  {
    id: 'employment-rights',
    title: 'Employment Rights',
    description: 'Learn about your rights and protections in the workplace',
    icon: <Scale className="h-8 w-8" />,
    component: EmploymentRights,
    color: 'bg-cyan-50 dark:bg-cyan-950'
  }
];

export default function CareerNew() {
  const [openTool, setOpenTool] = useState<string | null>(null);
  
  // Get the component for the current tool
  const getCurrentComponent = () => {
    const tool = CAREER_TOOLS.find(tool => tool.id === openTool);
    return tool ? tool.component : null;
  };

  // Get the title for the current tool
  const getCurrentTitle = () => {
    const tool = CAREER_TOOLS.find(tool => tool.id === openTool);
    return tool ? tool.title : '';
  };
  
  // Component to render inside the dialog
  const ToolComponent = getCurrentComponent();

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Career Development Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Career Development</h1>
            <p className="text-muted-foreground">
              Build your career skills, prepare for job hunting, and plan your professional growth
            </p>
          </div>
        </div>
        
        {/* Skills Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Career Skills
            </CardTitle>
            <CardDescription>
              Skills you'll develop in this section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {CAREER_SKILLS.map((skill, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {skill.icon}
                  <span>{skill.name}</span>
                  <span className="ml-1 text-xs opacity-60">{skill.level}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Career Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAREER_TOOLS.map((tool) => (
          <Card key={tool.id} className={`overflow-hidden transition-all hover:shadow-md ${tool.color}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-md bg-white/20 backdrop-blur-sm dark:bg-black/20">
                  {tool.icon}
                </div>
              </div>
              <CardTitle className="mt-2">{tool.title}</CardTitle>
              <CardDescription>
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={() => setOpenTool(tool.id)}>
                Open
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* MegaDialog for selected tool */}
      <MegaDialog open={!!openTool} onOpenChange={(open) => !open && setOpenTool(null)}>
        <MegaDialogContent>
          <MegaDialogHeader>
            <MegaDialogTitle>{getCurrentTitle()}</MegaDialogTitle>
          </MegaDialogHeader>
          <MegaDialogBody>
            {ToolComponent && (
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading {getCurrentTitle()}...</p>
                </div>
              }>
                <ToolComponent />
              </Suspense>
            )}
          </MegaDialogBody>
        </MegaDialogContent>
      </MegaDialog>
    </div>
  );
}