import { useState } from 'react';
import { useLocation } from 'wouter';
import { Car, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import VehicleGuide from '@/components/vehicle-guide';
import QuizComponent from '@/components/quiz-component';
import ResourceLinks from '@/components/resource-links';

export default function VehicleMaintenanceCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to vehicle maintenance
  const resources = [
    {
      title: "Car Maintenance 101",
      url: "https://www.aaa.com/autorepair/articles/car-maintenance-basics",
      description: "AAA's guide to essential car maintenance tasks",
      type: "guide"
    },
    {
      title: "DIY Auto Repair Videos",
      url: "https://www.youtube.com/c/chrisfix",
      description: "Step-by-step visual guides for car maintenance",
      type: "video"
    },
    {
      title: "Vehicle Owner's Manual Library",
      url: "https://www.edmunds.com/how-to/how-to-find-your-car-owners-manual-online.html",
      description: "Find manufacturer recommendations for your specific vehicle",
      type: "reference"
    },
    {
      title: "Car Talk",
      url: "https://www.cartalk.com/",
      description: "Expert advice and community Q&A for car problems",
      type: "community"
    },
    {
      title: "RepairPal",
      url: "https://repairpal.com/",
      description: "Estimate repair costs and find reliable mechanics in your area",
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
          <Car className="h-6 w-6 mr-2 text-orange-500" />
          Vehicle Maintenance
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
              <CardTitle>Introduction to Vehicle Maintenance</CardTitle>
              <CardDescription>
                Regular vehicle maintenance saves money, extends your vehicle's life, and ensures your safety on the road.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Understanding the basics of car maintenance is an essential life skill that can save you thousands of dollars over the lifetime of your vehicle. Even if you're not mechanically inclined, learning which issues you can handle yourself and which require professional help is valuable knowledge.
              </p>
              <p className="mb-4">
                In this module, you'll learn about routine maintenance tasks like oil changes, tire rotation, and fluid checks, as well as how to identify common problems before they become expensive repairs.
              </p>
            </CardContent>
          </Card>
          
          <VehicleGuide />
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about vehicle maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Vehicle Maintenance"
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
            title="Vehicle Maintenance Resources"
            description="Helpful guides, tools, and communities for learning more about vehicle maintenance"
          />
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}