import React from 'react';
import { FileText, MessageSquare, Building, Briefcase, Brain, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import CareerFullscreenTrigger, { CareerToolType } from '@/components/career/career-fullscreen-trigger';

interface CareerToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  toolType: CareerToolType;
}

const CareerToolCard: React.FC<CareerToolCardProps> = ({
  title,
  description,
  icon,
  toolType,
}) => {
  return (
    <div className="bg-white rounded-lg p-5 flex flex-col items-center text-center h-full">
      <div className="flex justify-center mb-4 text-blue-500">
        {icon}
      </div>
      <h3 className="text-base font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="mt-auto pt-4 w-full">
        <CareerFullscreenTrigger
          toolType={toolType}
          label="Open"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          showIcon={false}
        />
      </div>
    </div>
  );
};

export default function CareerToolsOriginal() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-[#1e3a8a] mb-8">Career Development</h1>
        <div className="pl-4 border-l-4 border-blue-500 mb-6">
          <h2 className="text-lg font-medium text-blue-700">Career Tools</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CareerToolCard
          title="Career Assessment"
          description="Discover your career interests and strengths"
          icon={<Briefcase className="h-12 w-12" />}
          toolType="assessment"
        />
        
        <CareerToolCard
          title="Resume Builder"
          description="Create and manage your professional resume"
          icon={<FileText className="h-12 w-12" />}
          toolType="resume"
        />
        
        <CareerToolCard
          title="Fundamenta Connects"
          description="Find opportunities and research salary insights"
          icon={<Building className="h-12 w-12" />}
          toolType="job-search"
        />
        
        <CareerToolCard
          title="Interview Practice"
          description="Prepare for job interviews with AI feedback"
          icon={<MessageSquare className="h-12 w-12" />}
          toolType="interview"
        />
        
        <CareerToolCard
          title="EQ & Resilience"
          description="Build emotional intelligence and career resilience"
          icon={<Brain className="h-12 w-12" />}
          toolType="resilience"
        />
        
        <CareerToolCard
          title="Employment Rights"
          description="Learn about your workplace rights and protections"
          icon={<Scale className="h-12 w-12" />}
          toolType="rights"
        />
      </div>
    </div>
  );
}