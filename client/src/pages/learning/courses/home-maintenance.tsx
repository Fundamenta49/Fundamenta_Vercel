import { useState } from 'react';
import { useLocation } from 'wouter';
import { Wrench, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HandymanGuide from '@/components/handyman-guide';
import QuizComponent, { QuizQuestion } from '@/components/quiz-component';
import ResourceLinks, { Resource } from '@/components/resource-links';

export default function HomeMaintenanceCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to home maintenance
  const resources: Resource[] = [
    {
      id: "1",
      title: "Home Repair Basics",
      url: "https://www.familyhandyman.com/list/100-home-repairs-you-can-do-yourself/",
      description: "Common home repairs you can tackle without calling a pro",
      type: "article",
      level: "beginner",
      free: true
    },
    {
      id: "2",
      title: "DIY Home Improvement Videos",
      url: "https://www.youtube.com/c/thisoldhouse",
      description: "Step-by-step visual guides for home repairs and maintenance",
      type: "video",
      level: "beginner",
      free: true
    },
    {
      id: "3",
      title: "Home Maintenance Schedule",
      url: "https://www.thespruce.com/home-maintenance-schedule-4156922",
      description: "Seasonal checklist for home maintenance tasks",
      type: "book",
      level: "beginner",
      free: true
    },
    {
      id: "4",
      title: "DIY Network",
      url: "https://www.diynetwork.com/how-to",
      description: "Expert guides and project instructions for home improvement",
      type: "practice",
      level: "intermediate",
      free: true
    },
    {
      id: "5",
      title: "HomeAdvisor",
      url: "https://www.homeadvisor.com/",
      description: "Find professionals for jobs you can't handle yourself",
      type: "tool",
      level: "beginner",
      free: true
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
                questions={[
                  {
                    id: 1,
                    question: "What is the main purpose of regularly checking and replacing HVAC filters?",
                    options: [
                      "To keep your warranty valid",
                      "To improve system efficiency and air quality",
                      "To prevent electrical fires",
                      "It's only necessary in older homes"
                    ],
                    correctAnswer: 1,
                    explanation: "Regular replacement of HVAC filters improves system efficiency (saving energy costs), extends the life of your HVAC system, and improves indoor air quality by removing dust, allergens, and other particles."
                  },
                  {
                    id: 2,
                    question: "How often should you test smoke and carbon monoxide detectors?",
                    options: [
                      "Once a year during daylight savings",
                      "Only when the batteries need replacement",
                      "Monthly",
                      "Only after a power outage"
                    ],
                    correctAnswer: 2,
                    explanation: "Smoke and carbon monoxide detectors should be tested monthly to ensure they're working properly. Batteries should be replaced at least once a year, and the entire units should be replaced according to the manufacturer's recommendations (usually every 10 years for smoke detectors and 5-7 years for carbon monoxide detectors)."
                  },
                  {
                    id: 3,
                    question: "What's the most common cause of clogged drains in the kitchen?",
                    options: [
                      "Hair",
                      "Grease and food particles",
                      "Soap scum",
                      "Foreign objects"
                    ],
                    correctAnswer: 1,
                    explanation: "Grease, oils, and food particles are the most common causes of kitchen drain clogs. They can build up over time, especially if hot grease is poured down the drain where it solidifies as it cools."
                  },
                  {
                    id: 4,
                    question: "How often should gutters be cleaned in a typical home?",
                    options: [
                      "Monthly",
                      "Twice a year (spring and fall)",
                      "Only when they overflow",
                      "Once every few years"
                    ],
                    correctAnswer: 1,
                    explanation: "Gutters should typically be cleaned twice a year - in late spring and early fall. However, if you have many trees near your home, you might need to clean them more frequently. Clogged gutters can lead to water damage to your roof, siding, and foundation."
                  },
                  {
                    id: 5,
                    question: "What should you do first if you have a water leak under a sink?",
                    options: [
                      "Call a plumber immediately",
                      "Turn off the water supply to the sink",
                      "Place a bucket under the leak",
                      "Apply plumber's tape to the leak"
                    ],
                    correctAnswer: 1,
                    explanation: "The first step when dealing with any plumbing leak is to stop the water flow by turning off the water supply to that fixture. This prevents further water damage while you assess the situation and either fix it yourself or call a professional."
                  }
                ]}
                onComplete={(score, total) => {
                  console.log(`Quiz results: ${score}/${total}`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="mb-6">
          <ResourceLinks 
            subject="Home Maintenance"
            resources={resources}
          />
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}