import React, { useState } from 'react';
import { FileText, MessageSquare, Building, Briefcase, Brain, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CareerToolType } from '@/components/career/career-fullscreen-trigger';

// Import the fullscreen components
import ResumeBuilderFullscreen from '@/components/resume-builder-fullscreen';
import JobSearchFullscreen from '@/components/career/job-search-fullscreen';
import InterviewPracticeFullscreen from '@/components/career/interview-practice-fullscreen';
import CareerAssessmentPopOut from '@/components/career-assessment-pop-out';
import SwipeToClose from '@/components/ui/swipe-to-close';
import { Button } from '@/components/ui/button';

interface CareerToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  toolType: CareerToolType;
  onClick: () => void;
}

const CareerToolCard: React.FC<CareerToolCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <div 
      className="bg-white rounded-lg p-4 flex flex-col items-center text-center h-full cursor-pointer hover:shadow-lg hover:border-blue-300 border border-gray-100 transition-all"
      onClick={onClick}
    >
      <div className="flex justify-center mb-3 text-blue-500">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-normal">{description}</p>
    </div>
  );
};

export default function CareerToolsOriginal() {
  const [openTool, setOpenTool] = useState<CareerToolType | null>(null);

  const handleOpenTool = (toolType: CareerToolType) => {
    setOpenTool(toolType);
  };

  const handleCloseTool = () => {
    setOpenTool(null);
  };

  // Render the appropriate fullscreen component based on the tool type
  const renderFullscreenComponent = () => {
    if (!openTool) return null;

    switch (openTool) {
      case 'resume':
        return <ResumeBuilderFullscreen onClose={handleCloseTool} />;
      case 'job-search':
        return <JobSearchFullscreen onClose={handleCloseTool} />;
      case 'interview':
        return <InterviewPracticeFullscreen onClose={handleCloseTool} />;
      case 'assessment':
        return (
          <div className="fixed inset-0 bg-white z-50">
            <div className="flex justify-between items-center px-4 py-3 border-b shadow-sm">
              <h1 className="text-xl font-semibold">Career Assessment</h1>
              <Button variant="ghost" size="sm" onClick={handleCloseTool}>Close</Button>
            </div>
            <SwipeToClose onClose={handleCloseTool} threshold={120}>
              <div className="overflow-auto h-[calc(100vh-56px)]">
                <CareerAssessmentPopOut />
              </div>
            </SwipeToClose>
          </div>
        );
      case 'resilience':
        // Placeholder for future implementation
        return <div className="fixed inset-0 bg-background z-50 p-6">
          <h1>EQ & Resilience (Coming Soon)</h1>
          <Button onClick={handleCloseTool}>Close</Button>
        </div>;
      case 'rights':
        // Placeholder for future implementation
        return <div className="fixed inset-0 bg-background z-50 p-6">
          <h1>Employment Rights (Coming Soon)</h1>
          <Button onClick={handleCloseTool}>Close</Button>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-[#1e3a8a] mb-6">Career Development</h1>
        <div className="pl-4 border-l-4 border-blue-500 mb-6">
          <h2 className="text-lg font-medium text-blue-700">Career Tools</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="w-full">
          <CareerToolCard
            title="Career Assessment"
            description="Discover your career interests and strengths"
            icon={<Briefcase className="h-14 w-14" />}
            toolType="assessment"
            onClick={() => handleOpenTool('assessment')}
          />
        </div>
        
        <div className="w-full">
          <CareerToolCard
            title="Resume Builder"
            description="Create and manage your professional resume"
            icon={<FileText className="h-14 w-14" />}
            toolType="resume"
            onClick={() => handleOpenTool('resume')}
          />
        </div>
        
        <div className="w-full">
          <CareerToolCard
            title="Fundamenta Connects"
            description="Find opportunities and research salary insights"
            icon={<Building className="h-14 w-14" />}
            toolType="job-search"
            onClick={() => handleOpenTool('job-search')}
          />
        </div>
        
        <div className="w-full">
          <CareerToolCard
            title="Interview Practice"
            description="Prepare for job interviews with AI feedback"
            icon={<MessageSquare className="h-14 w-14" />}
            toolType="interview"
            onClick={() => handleOpenTool('interview')}
          />
        </div>
        
        <div className="w-full">
          <CareerToolCard
            title="EQ & Resilience"
            description="Build emotional intelligence and career resilience"
            icon={<Brain className="h-14 w-14" />}
            toolType="resilience"
            onClick={() => handleOpenTool('resilience')}
          />
        </div>
        
        <div className="w-full">
          <CareerToolCard
            title="Employment Rights"
            description="Learn about your workplace rights and protections"
            icon={<Scale className="h-14 w-14" />}
            toolType="rights"
            onClick={() => handleOpenTool('rights')}
          />
        </div>
      </div>

      {renderFullscreenComponent()}
    </div>
  );
}