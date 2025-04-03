import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Lightbulb, WifiIcon, Smartphone, Activity, Droplets, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import QuizComponent from '@/components/quiz-component';
import { cn } from "@/lib/utils";
import {
  FullScreenDialog,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogClose,
} from "@/components/ui/full-screen-dialog";

export default function UtilitiesGuideCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'resources'>('learn');
  const [showChat, setShowChat] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Course modules as cards
  const COURSE_MODULES = [
    {
      id: 'internet',
      title: 'Internet & WiFi',
      description: 'How to research, select, and set up reliable internet service',
      icon: WifiIcon,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            In today's connected world, setting up reliable internet is essential. This module helps you understand different internet options, compare providers, and set up your home network for optimal performance.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Understanding Internet Types (Fiber, Cable, DSL)', length: '8 min', completed: false },
              { title: 'Comparing Local Providers and Plans', length: '10 min', completed: false },
              { title: 'Setting Up Your Home WiFi Network', length: '7 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'mobile',
      title: 'Mobile Service',
      description: 'Find the right mobile phone plan for your needs and budget',
      icon: Smartphone,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Mobile phone service is essential for staying connected on the go. This module helps you navigate the often confusing world of mobile carriers, plans, and features to find the best value for your specific needs.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Comparing Major Carriers vs. MVNOs', length: '9 min', completed: false },
              { title: 'Understanding Data Plans and Features', length: '7 min', completed: false },
              { title: 'Family Plans vs. Individual Plans', length: '8 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'power',
      title: 'Electricity & Gas',
      description: 'Setting up utilities and managing energy costs efficiently',
      icon: Activity,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Setting up electricity and gas service is a critical step when moving into a new home. This module explains how to choose providers, understand billing options, and implement energy-saving strategies to reduce your bills.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Choosing Electricity Providers', length: '12 min', completed: false },
              { title: 'Understanding Billing Options', length: '8 min', completed: false },
              { title: 'Energy Saving Strategies', length: '10 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'water',
      title: 'Water & Sewer',
      description: 'Setting up water service and understanding your usage',
      icon: Droplets,
      content: (
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Water and sewer service is typically managed by your local municipality. This module explains the process for establishing service, understanding your bill, and implementing water conservation practices to save money and resources.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-3">Key Lessons:</h3>
          <div className="space-y-3">
            {[
              { title: 'Establishing Water & Sewer Service', length: '8 min', completed: false },
              { title: 'Understanding Your Water Bill', length: '7 min', completed: false },
              { title: 'Water Conservation Practices', length: '9 min', completed: false },
            ].map((lesson, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
              >
                <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-500">{lesson.length}</p>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  // Quiz questions
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: "Which type of internet service typically offers the fastest speeds?",
      options: [
        "DSL", 
        "Fiber optic", 
        "Satellite", 
        "Dial-up"
      ],
      correctAnswer: 1,
      explanation: "Fiber optic internet uses light signals transmitted through glass or plastic cables, offering the fastest and most reliable internet speeds currently available to residential customers."
    },
    {
      id: 2,
      question: "What is an MVNO in mobile phone service?",
      options: [
        "Mobile Virtual Network Operator - a company that offers service using another carrier's network", 
        "Mobile Verified Network Option - a premium tier of service", 
        "Mobile Voice & Network Operator - a standard cellular carrier", 
        "Mobile Voice Navigation Option - a GPS feature"
      ],
      correctAnswer: 0,
      explanation: "Mobile Virtual Network Operators (MVNOs) are companies that don't own the wireless infrastructure they use to provide service to customers. Instead, they purchase network access at wholesale rates from major carriers and can often offer lower prices."
    },
    {
      id: 3,
      question: "When is the best time to set up utilities for a new home?",
      options: [
        "The day you move in", 
        "1-2 weeks before your move-in date", 
        "After you've lived there for a week to assess needs", 
        "Only after receiving the first bill from the previous tenant"
      ],
      correctAnswer: 1,
      explanation: "It's best to contact utility companies 1-2 weeks before your move-in date. This gives them enough time to process your request and ensures services are active when you arrive."
    },
    {
      id: 4,
      question: "What factor impacts your water bill the most?",
      options: [
        "The number of people in your household", 
        "The age of your home", 
        "Your ZIP code", 
        "The time of year you establish service"
      ],
      correctAnswer: 0,
      explanation: "The number of people in your household is typically the biggest factor affecting water usage and your resulting bill. Each person uses water for bathing, cooking, cleaning, and other daily activities."
    },
    {
      id: 5,
      question: "Which of these is NOT typically considered when comparing internet service providers?",
      options: [
        "Download and upload speeds", 
        "Monthly data caps", 
        "Contract length", 
        "Your education level"
      ],
      correctAnswer: 3,
      explanation: "Internet service providers typically consider factors like desired speeds, data usage, contract terms, and available promotions when setting up service - not personal factors like education level."
    }
  ];

  // Course resources
  const RESOURCES = [
    {
      title: 'FCC Broadband Speed Guide',
      url: 'https://www.fcc.gov/consumers/guides/broadband-speed-guide',
      description: 'Official guide to understanding internet speeds'
    },
    {
      title: 'Energy Star Home Energy Yardstick',
      url: 'https://www.energystar.gov/index.cfm?fuseaction=HOME_ENERGY_YARDSTICK.showGetStarted',
      description: "Compare your home's energy use to similar homes"
    },
    {
      title: 'EPA WaterSense Program',
      url: 'https://www.epa.gov/watersense',
      description: 'Resources for water conservation'
    },
    {
      title: 'Consumer Cellular Coverage Map',
      url: 'https://www.consumercellular.com/coverage',
      description: 'Example of a mobile coverage comparison tool'
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
          <Lightbulb className="h-6 w-6 mr-2 text-orange-500" />
          Utilities Setup Guide
        </h1>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <div className="flex items-center justify-between">
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'learn' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('learn')}
            >
              <span className="text-sm font-medium">Learn</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'practice' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('practice')}
            >
              <span className="text-sm font-medium">Practice</span>
            </div>
            <div 
              className={`flex-1 text-center py-2 px-4 rounded-md cursor-pointer transition-all ${
                activeTab === 'resources' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('resources')}
            >
              <span className="text-sm font-medium">Resources</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'learn' && (
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Setting Up Essential Home Utilities</CardTitle>
              <CardDescription>
                Learn how to efficiently set up and manage essential services for your home.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Setting up utilities is an important part of moving into a new home or apartment. This guide helps you navigate the process of researching, selecting, and establishing essential services like internet, mobile phone, electricity, and water.
              </p>
              <p className="mb-4">
                You'll learn how to compare providers, understand billing options, and implement strategies to save money while ensuring reliable service for all your household needs.
              </p>
            </CardContent>
          </Card>
          
          {/* Course modules as cards with dialogs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <FullScreenDialog key={module.id}>
                  <FullScreenDialogTrigger asChild>
                    <Card className="border-2 border-orange-100 shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                            <Icon className="h-10 w-10 text-orange-500" />
                          </div>
                          <CardTitle className="mb-2">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </FullScreenDialogTrigger>
                  <FullScreenDialogContent themeColor="#f97316">
                    <FullScreenDialogHeader>
                      <div className="flex items-center mb-2">
                        <Icon className="w-6 h-6 mr-2 text-orange-500" />
                        <FullScreenDialogTitle>
                          {module.title}
                        </FullScreenDialogTitle>
                      </div>
                      <FullScreenDialogDescription>
                        {module.description}
                      </FullScreenDialogDescription>
                    </FullScreenDialogHeader>
                    <FullScreenDialogBody>
                      {module.content}
                    </FullScreenDialogBody>
                    <FullScreenDialogFooter>
                      <FullScreenDialogClose asChild>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <X className="w-4 h-4" />
                          Close
                        </Button>
                      </FullScreenDialogClose>
                    </FullScreenDialogFooter>
                  </FullScreenDialogContent>
                </FullScreenDialog>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your Knowledge</CardTitle>
              <CardDescription>
                Answer these questions to check your understanding of home utilities setup and management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizComponent 
                subject="Home Utilities"
                difficulty="beginner"
                questions={QUIZ_QUESTIONS}
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
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
              <CardDescription>
                Additional tools and guides to help you set up and manage your home utilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleResourceLinks resources={RESOURCES} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Always show either the pop-out chat or the floating chat */}
      {showChat ? (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      ) : (
        <FloatingChat category={LEARNING_CATEGORY} />
      )}
    </div>
  );
}