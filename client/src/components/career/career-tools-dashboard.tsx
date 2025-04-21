import React from 'react';
import { FileText, Search, Users, UserCheck, Brain, Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CareerFullscreenTrigger, { CareerToolType } from '@/components/career/career-fullscreen-trigger';

interface CareerToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  toolType: CareerToolType;
  comingSoon?: boolean;
}

const CareerToolCard: React.FC<CareerToolCardProps> = ({
  title,
  description,
  icon,
  toolType,
  comingSoon = false,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {comingSoon && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 text-sm text-yellow-800">
            Coming soon! This feature is currently in development.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <CareerFullscreenTrigger
          toolType={toolType}
          className="w-full"
          variant={comingSoon ? "outline" : "default"}
          disabled={comingSoon}
        />
      </CardFooter>
    </Card>
  );
};

export default function CareerToolsDashboard() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Career Development Tools</h1>
        <p className="text-muted-foreground">
          Enhance your career journey with our comprehensive suite of professional development tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CareerToolCard
          title="Resume Builder"
          description="Create and customize a professional resume with AI assistance. Upload existing resumes or start from scratch."
          icon={<FileText className="h-5 w-5 text-blue-500" />}
          toolType="resume"
        />
        
        <CareerToolCard
          title="Job Search"
          description="Find and save job listings matching your skills and experience. Filter by location, company, and more."
          icon={<Search className="h-5 w-5 text-green-500" />}
          toolType="job-search"
        />
        
        <CareerToolCard
          title="Interview Practice"
          description="Prepare for interviews with AI-powered mock interviews. Get instant feedback on your responses."
          icon={<UserCheck className="h-5 w-5 text-purple-500" />}
          toolType="interview"
        />
        
        <CareerToolCard
          title="Career Assessment"
          description="Identify your strengths, skills gaps, and potential career paths based on your experience and interests."
          icon={<Users className="h-5 w-5 text-orange-500" />}
          toolType="assessment"
          comingSoon={true}
        />
        
        <CareerToolCard
          title="EQ & Resilience"
          description="Develop emotional intelligence and resilience skills crucial for workplace success and leadership."
          icon={<Brain className="h-5 w-5 text-pink-500" />}
          toolType="resilience"
          comingSoon={true}
        />
        
        <CareerToolCard
          title="Employment Rights"
          description="Understand your rights in the workplace with guides on employment laws, contracts, and dispute resolution."
          icon={<Scale className="h-5 w-5 text-indigo-500" />}
          toolType="rights"
          comingSoon={true}
        />
      </div>
    </div>
  );
}