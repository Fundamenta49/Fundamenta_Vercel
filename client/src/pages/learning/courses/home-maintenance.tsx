import { useState } from 'react';
import { useLocation } from 'wouter';
import { Wrench, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HandymanGuide from '@/components/handyman-guide';
import QuizComponent from '@/components/quiz-component';
import ResourceLinks from '@/components/resource-links';

export default function HomeMaintenanceCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to home maintenance
  const resources = [
    {
      title: "Home Repair Basics",
      url: "https://www.familyhandyman.com/list/100-home-repairs-you-can-do-yourself/",
      description: "Common home repairs you can tackle without calling a pro",
      type: "guide"
    },
    {
      title: "DIY Home Improvement Videos",
      url: "https://www.youtube.com/c/thisoldhouse",
      description: "Step-by-step visual guides for home repairs and maintenance",
      type: "video"
    },
    {
      title: "Home Maintenance Schedule",
      url: "https://www.thespruce.com/home-maintenance-schedule-4156922",
      description: "Seasonal checklist for home maintenance tasks",
      type: "reference"
    },
    {
      title: "DIY Network",
      url: "https://www.diynetwork.com/how-to",
      description: "Expert guides and project instructions for home improvement",
      type: "community"
    },
    {
      title: "HomeAdvisor",
      url: "https://www.homeadvisor.com/",
      description: "Find professionals for jobs you can't handle yourself",
      type: "tool"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Wrench className="h-6 w-6 mr-2 text-orange-500" />
          Home Maintenance
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant={activeTab === 'learn' ? 'default' : 'outline'}
          className={activeTab === 'learn' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('learn')}
        >
          Learn
        </Button>
        <Button
          variant={activeTab === 'practice' ? 'default' : 'outline'}
          className={activeTab === 'practice' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('practice')}
        >
          Test Your Knowledge
        </Button>
        <Button
          variant={activeTab === 'resources' ? 'default' : 'outline'}
          className={activeTab === 'resources' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </Button>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Introduction to Home Maintenance</CardTitle>
              <CardDescription>
                Basic home maintenance can save you money and prevent small problems from becoming major disasters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Knowing how to handle common household repairs and maintenance is a fundamental life skill that can save you hundreds or even thousands of dollars over time. From unclogging drains to fixing leaky faucets, these skills help you maintain your living space and respond quickly to problems.
              </p>
              <p className="mb-4">
                In this module, you'll learn about essential home maintenance tasks, basic plumbing repairs, wall patching, and when it's appropriate to call in a professional. You'll also discover how to use common tools safely and effectively.
              </p>
            </CardContent>
          </Card>
          
          <HandymanGuide />
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about home maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Home Maintenance"
                difficulty="beginner"
                numberOfQuestions={5}
                onComplete={(results) => {
                  console.log('Quiz results:', results);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6">
          <ResourceLinks 
            resources={resources}
            title="Home Maintenance Resources"
            description="Helpful guides, tools, and communities for learning more about home repairs and maintenance"
          />
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}