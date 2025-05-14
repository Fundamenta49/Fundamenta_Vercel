import React from 'react';
import { Link } from 'wouter';
import { Briefcase, FileText, GraduationCap, Target, ArrowRight, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Section, Container, H1, H2, Paragraph } from '@/components/ui/content';

export default function CareerLanding() {
  const features = [
    {
      title: "Resume Builder",
      description: "Create professional resumes with AI-powered suggestions and formatting that highlight your skills and experience.",
      icon: <FileText className="h-12 w-12 text-blue-500" />,
      link: "/career/resume",
      color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      buttonText: "Build Resume"
    },
    {
      title: "Career Exploration",
      description: "Discover career paths based on your skills, interests, and experience. Get insights on job requirements and growth opportunities.",
      icon: <Target className="h-12 w-12 text-purple-500" />,
      link: "/career/explore",
      color: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      buttonText: "Explore Careers"
    },
    {
      title: "Skills Development",
      description: "Identify key skills needed for your target career and find resources to help you develop those competencies.",
      icon: <GraduationCap className="h-12 w-12 text-green-500" />,
      link: "/career/skills",
      color: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      buttonText: "Develop Skills"
    }
  ];

  return (
    <Container>
      <Section className="space-y-6">
        <div className="flex items-center gap-3">
          <Briefcase className="h-10 w-10 text-blue-500" />
          <H1>Career Development</H1>
        </div>
        
        <Paragraph className="text-lg text-muted-foreground">
          Plan your career journey, build professional resumes, and develop essential skills for your target profession with our comprehensive career tools.
        </Paragraph>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="overflow-hidden border-2 hover:border-blue-300 transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${feature.color} p-6 flex justify-center`}>
                {feature.icon}
              </div>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                  <Link to={feature.link}>
                    {feature.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Section>
          <H2 className="mb-4">Career Development Process</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Self Assessment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identify your skills, interests, values, and personality traits to understand what career paths align with your strengths and preferences.
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Explore Options</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Research and discover career paths that match your profile. Learn about requirements, opportunities, and what daily work involves.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Take Action</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Develop necessary skills, create professional documents, build your network, and apply for opportunities that align with your goals.
              </p>
            </div>
          </div>
        </Section>
      </Section>
    </Container>
  );
}