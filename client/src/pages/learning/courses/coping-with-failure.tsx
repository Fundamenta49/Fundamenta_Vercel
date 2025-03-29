import { useState } from 'react';
import { useLocation } from 'wouter';
import { BookOpenIcon, ChevronLeftIcon, LightbulbIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourceLinks from '@/components/resource-links';
import { useToast } from '@/hooks/use-toast';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';

export default function CopingWithFailureCourse() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);

  // Course materials
  const MODULE_ONE = [
    { title: 'Understanding Failure & Setbacks', length: '8 min', completed: false },
    { title: 'Emotional Resilience', length: '10 min', completed: false },
    { title: 'Growth Mindset Development', length: '12 min', completed: false },
  ];

  const MODULE_TWO = [
    { title: 'Learning From Mistakes', length: '9 min', completed: false },
    { title: 'Rebuilding After Setbacks', length: '11 min', completed: false },
    { title: 'From Failure to Opportunity', length: '8 min', completed: false },
  ];

  // Course resources
  const RESOURCES = [
    {
      title: 'Resilience Building Techniques',
      url: 'https://www.apa.org/topics/resilience',
      description: 'American Psychological Association guide to building resilience'
    },
    {
      title: 'Growth Mindset Exercises',
      url: 'https://mindsetscholarsnetwork.org/learning-mindsets/growth-mindset/',
      description: 'Activities to develop a growth-oriented perspective'
    },
    {
      title: 'Famous Failures',
      url: 'https://www.inc.com/bill-murphy-jr/29-famous-people-who-failed-before-succeeding.html',
      description: 'Inspirational stories of successful people who overcame failure'
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/learning')}
          className="mr-2"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Coping With Failure
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <LightbulbIcon className="mr-2 h-5 w-5 text-orange-500" />
              Course Overview
            </h2>
            <p className="text-gray-700 mb-4">
              Failure and setbacks are inevitable parts of life, but how we respond to them shapes our future success. This course explores the psychology of resilience and provides practical strategies for bouncing back from disappointments. You'll learn how to reframe failures as learning opportunities, develop emotional resilience, and transform setbacks into stepping stones for personal growth.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => {
                  toast({
                    title: "Resilience Quiz",
                    description: "Test your knowledge of coping strategies and resilience building",
                  })
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Take Quiz
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Module 1: Building Resilience</h2>
            <div className="space-y-3">
              {MODULE_ONE.map((lesson, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
                  onClick={() => {
                    toast({
                      title: `Starting: ${lesson.title}`,
                      description: `This lesson is approximately ${lesson.length} long`,
                    })
                  }}
                >
                  <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className="flex-1">
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-500">{lesson.length}</p>
                  </div>
                  <ChevronLeftIcon className="h-4 w-4 rotate-180 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Module 2: From Setback to Comeback</h2>
            <div className="space-y-3">
              {MODULE_TWO.map((lesson, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer border border-gray-100"
                  onClick={() => {
                    toast({
                      title: `Starting: ${lesson.title}`,
                      description: `This lesson is approximately ${lesson.length} long`,
                    })
                  }}
                >
                  <div className={`h-4 w-4 rounded-full mr-3 ${lesson.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className="flex-1">
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-500">{lesson.length}</p>
                  </div>
                  <ChevronLeftIcon className="h-4 w-4 rotate-180 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Resources</h2>
            <ResourceLinks resources={RESOURCES} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Learning Coach</h2>
            <p className="text-sm text-gray-600 mb-4">
              Struggling to overcome a recent setback? Chat with our learning coach for personalized support and resilience-building strategies.
            </p>
            <Button 
              onClick={() => setShowChat(true)}
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="sm"
            >
              <BookOpenIcon className="mr-2 h-4 w-4" />
              Chat with Learning Coach
            </Button>
          </div>
        </div>
      </div>

      {/* Always show either the pop-out chat or the floating chat */}
      {showChat ? (
        <LearningCoachPopOut onClose={() => setShowChat(false)} />
      ) : (
        <FloatingChat category={LEARNING_CATEGORY} />
      )}
    </div>
  );
}