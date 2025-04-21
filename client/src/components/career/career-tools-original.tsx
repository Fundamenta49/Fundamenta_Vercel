import React, { useState } from 'react';
import { FileText, MessageSquare, Building, Briefcase, Brain, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CareerToolType } from '@/components/career/career-fullscreen-trigger';

// Import the fullscreen components
import ResumeBuilderFullscreen from '@/components/resume-builder-fullscreen';
import JobSearchFullscreen from '@/components/career/job-search-fullscreen';
import InterviewPracticeFullscreen from '@/components/career/interview-practice-fullscreen';
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
      className="bg-white rounded-md p-3 flex flex-col items-center text-center h-full cursor-pointer hover:shadow hover:border-blue-300 border border-gray-100 transition-all"
      onClick={onClick}
    >
      <div className="flex justify-center mb-2 text-blue-500">
        {icon}
      </div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-tight">{description}</p>
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
        // Placeholder for future implementation
        return <div className="fixed inset-0 bg-background z-50 p-6">
          <h1>Career Assessment (Coming Soon)</h1>
          <Button onClick={handleCloseTool}>Close</Button>
        </div>;
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
    <div className="container mx-auto py-4">
      <div className="mb-3">
        <h1 className="text-xl font-bold text-center text-[#1e3a8a] mb-3">Career Development</h1>
        <div className="pl-3 border-l-4 border-blue-500 mb-3">
          <h2 className="text-base font-medium text-blue-700">Career Tools</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-4xl mx-auto">
        <CareerToolCard
          title="Career Assessment"
          description="Discover your career interests and strengths"
          icon={<Briefcase className="h-6 w-6" />}
          toolType="assessment"
          onClick={() => handleOpenTool('assessment')}
        />
        
        <CareerToolCard
          title="Resume Builder"
          description="Create and manage your professional resume"
          icon={<FileText className="h-6 w-6" />}
          toolType="resume"
          onClick={() => handleOpenTool('resume')}
        />
        
        <CareerToolCard
          title="Fundamenta Connects"
          description="Find opportunities and research salary insights"
          icon={<Building className="h-6 w-6" />}
          toolType="job-search"
          onClick={() => handleOpenTool('job-search')}
        />
        
        <CareerToolCard
          title="Interview Practice"
          description="Prepare for job interviews with AI feedback"
          icon={<MessageSquare className="h-6 w-6" />}
          toolType="interview"
          onClick={() => handleOpenTool('interview')}
        />
        
        <CareerToolCard
          title="EQ & Resilience"
          description="Build emotional intelligence and career resilience"
          icon={<Brain className="h-6 w-6" />}
          toolType="resilience"
          onClick={() => handleOpenTool('resilience')}
        />
        
        <CareerToolCard
          title="Employment Rights"
          description="Learn about your workplace rights and protections"
          icon={<Scale className="h-6 w-6" />}
          toolType="rights"
          onClick={() => handleOpenTool('rights')}
        />
      </div>

      {renderFullscreenComponent()}
    </div>
  );
}