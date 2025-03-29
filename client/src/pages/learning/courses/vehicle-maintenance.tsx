import { useState } from 'react';
import { useLocation } from 'wouter';
import { Car, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import VehicleGuide from '@/components/vehicle-guide';
import QuizComponent, { QuizQuestion } from '@/components/quiz-component';
import ResourceLinks, { Resource } from '@/components/resource-links';

export default function VehicleMaintenanceCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');

  // Resources specific to vehicle maintenance
  const resources: Resource[] = [
    {
      id: "1",
      title: "Car Maintenance 101",
      url: "https://www.aaa.com/autorepair/articles/car-maintenance-basics",
      description: "AAA's guide to essential car maintenance tasks",
      type: "article",
      level: "beginner",
      free: true
    },
    {
      id: "2",
      title: "DIY Auto Repair Videos",
      url: "https://www.youtube.com/c/chrisfix",
      description: "Step-by-step visual guides for car maintenance",
      type: "video",
      level: "beginner",
      free: true
    },
    {
      id: "3",
      title: "Vehicle Owner's Manual Library",
      url: "https://www.edmunds.com/how-to/how-to-find-your-car-owners-manual-online.html",
      description: "Find manufacturer recommendations for your specific vehicle",
      type: "book",
      level: "beginner",
      free: true
    },
    {
      id: "4",
      title: "Car Talk",
      url: "https://www.cartalk.com/",
      description: "Expert advice and community Q&A for car problems",
      type: "practice",
      level: "intermediate",
      free: true
    },
    {
      id: "5",
      title: "RepairPal",
      url: "https://repairpal.com/",
      description: "Estimate repair costs and find reliable mechanics in your area",
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
                questions={[
                  {
                    id: 1,
                    question: "How often should you typically change your engine oil?",
                    options: [
                      "Every 1,000 miles", 
                      "Every 3,000-5,000 miles or as recommended by manufacturer", 
                      "Once a year regardless of miles driven", 
                      "Only when the oil light comes on"
                    ],
                    correctAnswer: 1,
                    explanation: "Most modern vehicles need oil changes every 3,000-5,000 miles, though many newer models with synthetic oil can go 7,500-10,000 miles. Always check your owner's manual for the manufacturer's recommendation."
                  },
                  {
                    id: 2,
                    question: "What is the correct tire pressure for most passenger vehicles?",
                    options: [
                      "As high as possible for better fuel economy", 
                      "Whatever feels right when you press on the tire", 
                      "The PSI listed on the tire sidewall", 
                      "The PSI listed on the sticker inside the driver's door or in the owner's manual"
                    ],
                    correctAnswer: 3,
                    explanation: "The correct tire pressure is found on a sticker inside the driver's door jamb or in your owner's manual. The PSI on the tire sidewall is the maximum pressure, not the recommended pressure."
                  },
                  {
                    id: 3,
                    question: "When should you rotate your tires?",
                    options: [
                      "Every 6,000-8,000 miles", 
                      "Only when they show uneven wear", 
                      "When changing from winter to summer tires", 
                      "Once per year regardless of mileage"
                    ],
                    correctAnswer: 0,
                    explanation: "Tires should be rotated approximately every 6,000-8,000 miles to ensure even wear. This helps extend tire life and maintains optimal handling and traction."
                  },
                  {
                    id: 4,
                    question: "What does the check engine light typically indicate?",
                    options: [
                      "You need to immediately pull over and turn off the engine", 
                      "Your vehicle needs an oil change", 
                      "A sensor has detected an issue that needs attention", 
                      "You're low on windshield washer fluid"
                    ],
                    correctAnswer: 2,
                    explanation: "The check engine light indicates that the onboard diagnostic system has detected an issue. While not always an emergency, it should be checked soon with a diagnostic scanner to determine the specific problem."
                  },
                  {
                    id: 5,
                    question: "Which of these fluids should NOT be topped off if low?",
                    options: [
                      "Windshield washer fluid", 
                      "Engine coolant", 
                      "Transmission fluid", 
                      "Power steering fluid"
                    ],
                    correctAnswer: 2,
                    explanation: "Low transmission fluid is often a sign of a leak, as it operates in a closed system and shouldn't be consumed. Adding fluid without fixing the leak is a temporary solution at best and could mask a serious problem."
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
            subject="Vehicle Maintenance"
            resources={resources}
          />
        </div>
      )}

      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}