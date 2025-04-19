import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, BookOpen, School, FileText, MessageSquare, Brain, Scale } from 'lucide-react';

// Import components for Career tools
import ResumeBuilder from '@/components/career/resume-builder';
import JobSearch from '@/components/career/job-search';
import InterviewPractice from '@/components/career/interview-practice';
import CareerAssessment from '@/components/career/career-assessment';
import EmotionalResilience from '@/components/career/emotional-resilience';
import EmploymentRights from '@/components/career/employment-rights';

// Skills for the skills section
const CAREER_SKILLS = [
  { name: 'Resume Building', icon: <FileText className="h-4 w-4" />, level: 'Foundational' },
  { name: 'Job Search Strategies', icon: <Briefcase className="h-4 w-4" />, level: 'Foundational' },
  { name: 'Interview Skills', icon: <MessageSquare className="h-4 w-4" />, level: 'Intermediate' },
  { name: 'Career Planning', icon: <BookOpen className="h-4 w-4" />, level: 'Advanced' },
  { name: 'Emotional Intelligence', icon: <Brain className="h-4 w-4" />, level: 'Advanced' },
  { name: 'Workplace Rights', icon: <Scale className="h-4 w-4" />, level: 'Intermediate' },
];

export default function CareerNew() {
  const [activeTab, setActiveTab] = useState('resume-builder');

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
      
      {/* Career Tools Tabs */}
      <Tabs defaultValue="resume-builder" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <div className="flex items-center justify-between py-2">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger 
                value="resume-builder"
                className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <FileText className="h-4 w-4 mr-2" />
                Resume Builder
              </TabsTrigger>
              <TabsTrigger 
                value="job-search"
                className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Job Search
              </TabsTrigger>
              <TabsTrigger 
                value="interview-practice"
                className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Interview Practice
              </TabsTrigger>
              <TabsTrigger 
                value="career-assessment"
                className="hidden sm:flex relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <School className="h-4 w-4 mr-2" />
                Career Assessment
              </TabsTrigger>
              <TabsTrigger 
                value="emotional-resilience"
                className="hidden md:flex relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Brain className="h-4 w-4 mr-2" />
                EQ & Resilience
              </TabsTrigger>
              <TabsTrigger 
                value="employment-rights"
                className="hidden lg:flex relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Scale className="h-4 w-4 mr-2" />
                Employment Rights
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="py-4">
          <TabsContent value="resume-builder" className="m-0">
            <ResumeBuilder />
          </TabsContent>
          <TabsContent value="job-search" className="m-0">
            <JobSearch />
          </TabsContent>
          <TabsContent value="interview-practice" className="m-0">
            <InterviewPractice />
          </TabsContent>
          <TabsContent value="career-assessment" className="m-0">
            <CareerAssessment />
          </TabsContent>
          <TabsContent value="emotional-resilience" className="m-0">
            <EmotionalResilience />
          </TabsContent>
          <TabsContent value="employment-rights" className="m-0">
            <EmploymentRights />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}