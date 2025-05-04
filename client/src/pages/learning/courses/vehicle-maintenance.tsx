import { useState } from 'react';
import { useLocation } from 'wouter';
import { Car, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import VehicleGuide from '@/components/vehicle-guide';
import QuizComponent from '@/components/quiz-component';
import SimpleResourceLinks, { SimpleResource } from '@/components/simple-resource-links';

export default function VehicleMaintenanceCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  
  // Function to handle navigation back to Learning page
  const handleBackNavigation = () => {
    navigate('/learning');
    window.scrollTo(0, 0);
  };
  
  // Function to handle tab changes
  const handleTabChange = (tab: 'learn' | 'practice' | 'resources') => {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  // Resources specific to vehicle maintenance
  const resources: SimpleResource[] = [
    {
      title: "Car Maintenance 101",
      url: "https://www.aaa.com/autorepair/articles/car-maintenance-basics",
      description: "AAA's guide to essential car maintenance tasks"
    },
    {
      title: "DIY Auto Repair Videos",
      url: "https://www.youtube.com/c/chrisfix",
      description: "Step-by-step visual guides for car maintenance"
    },
    {
      title: "Vehicle Owner's Manual Library",
      url: "https://www.edmunds.com/how-to/how-to-find-your-car-owners-manual-online.html",
      description: "Find manufacturer recommendations for your specific vehicle"
    },
    {
      title: "Car Talk",
      url: "https://www.cartalk.com/",
      description: "Expert advice and community Q&A for car problems"
    },
    {
      title: "RepairPal",
      url: "https://repairpal.com/",
      description: "Estimate repair costs and find reliable mechanics in your area"
    }
  ];
  
  return (
    <div className="container mx-auto px-0 sm:px-4 py-6 max-w-6xl relative">
      <div className="flex items-center mb-6 px-4 sm:px-0">
        <Button 
          variant="ghost" 
          onClick={handleBackNavigation}
          className="mr-4"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <Car className="h-6 w-6 mr-2 text-orange-500" />
          Vehicle Maintenance
        </h1>
      </div>

      {/* Banner card - Standardized with Yoga-style UI */}
      <div className="w-full sm:px-0 mb-6 px-4">
        <Card className="border-0 shadow-sm rounded-none sm:rounded-2xl overflow-hidden w-full">
          {/* Top gradient accent line */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Car className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Learn Vehicle Maintenance</h2>
                <p className="text-sm text-gray-600">Save money and extend your vehicle's life with proper maintenance</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6 px-4 sm:px-0">
        <div className="bg-gray-100 p-1 rounded-lg">
          <div className="flex items-center justify-between">
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'learn' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange('learn')}
              role="tab"
              aria-selected={activeTab === 'learn'}
              tabIndex={0}
            >
              <span className="text-sm font-medium">Learn</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'practice' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange('practice')}
              role="tab"
              aria-selected={activeTab === 'practice'}
              tabIndex={0}
            >
              <span className="text-sm font-medium">Practice</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'resources' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTabChange('resources')}
              role="tab"
              aria-selected={activeTab === 'resources'}
              tabIndex={0}
            >
              <span className="text-sm font-medium">Resources</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'learn' && (
        <div className="px-4 sm:px-0">
          <Card className="mb-6 border-0 shadow-sm rounded-2xl overflow-hidden">
            {/* Top gradient accent line */}
            <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle>Introduction to Vehicle Maintenance</CardTitle>
              <CardDescription>
                Regular vehicle maintenance saves money, extends your vehicle's life, and ensures your safety on the road.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="bg-gray-50 p-4 sm:p-6">
              <p className="mb-4">
                Understanding the basics of car maintenance is an essential life skill that can save you thousands of dollars over the lifetime of your vehicle. Even if you're not mechanically inclined, learning which issues you can handle yourself and which require professional help is valuable knowledge.
              </p>
              <p className="mb-4">
                In this module, you'll learn about routine maintenance tasks like oil changes, tire rotation, and fluid checks, as well as how to identify common problems before they become expensive repairs.
              </p>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <VehicleGuide />
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="px-4 sm:px-0">
          <Card className="mb-6 border-0 shadow-sm rounded-2xl overflow-hidden">
            {/* Top gradient accent line */}
            <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to see how much you've learned about vehicle maintenance.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="bg-gray-50 p-4 sm:p-6">
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
        <div className="px-4 sm:px-0">
          <Card className="mb-6 border-0 shadow-sm rounded-2xl overflow-hidden">
            {/* Top gradient accent line */}
            <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle>Vehicle Maintenance Resources</CardTitle>
              <CardDescription>Curated resources to help master these skills</CardDescription>
            </CardHeader>
            
            <CardContent className="bg-gray-50 p-4 sm:p-6">
              <SimpleResourceLinks 
                resources={resources}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}