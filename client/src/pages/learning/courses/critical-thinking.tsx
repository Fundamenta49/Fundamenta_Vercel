import { useState } from 'react';
import { useLocation } from 'wouter';
import { BookOpenIcon, ChevronLeftIcon, BrainIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { useToast } from '@/hooks/use-toast';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';

export default function CriticalThinkingCourse() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);

  // Course materials
  const MODULE_ONE = [
    { title: 'Introduction to Critical Thinking', length: '5 min', completed: false },
    { title: 'Identifying Logical Fallacies', length: '12 min', completed: false },
    { title: 'Evidence Evaluation Techniques', length: '15 min', completed: false },
  ];

  const MODULE_TWO = [
    { title: 'Analyzing Arguments', length: '10 min', completed: false },
    { title: 'Solving Complex Problems', length: '15 min', completed: false },
    { title: 'Applying Critical Thinking in Daily Life', length: '8 min', completed: false },
  ];

  // Course resources
  const RESOURCES = [
    {
      title: 'Logical Fallacies Guide',
      url: 'https://yourlogicalfallacyis.com/',
      description: 'Interactive guide to common logical fallacies'
    },
    {
      title: 'Critical Thinking Framework',
      url: 'https://www.criticalthinking.org/pages/defining-critical-thinking/766',
      description: 'Comprehensive framework for developing critical thinking skills'
    },
    {
      title: 'Decision-Making Matrix',
      url: 'https://www.mindtools.com/pages/article/newTED_03.htm',
      description: 'Tool for making decisions using critical thinking principles'
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
          Critical Thinking
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BrainIcon className="mr-2 h-5 w-5 text-orange-500" />
              Course Overview
            </h2>
            <p className="text-gray-700 mb-4">
              Critical thinking is the analysis of available facts, evidence, observations, and arguments to form a judgment. This course teaches you how to evaluate information objectively and make reasoned judgments. You'll learn to identify common logical fallacies, analyze arguments, and apply critical thinking skills to real-world problems.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => {
                  toast({
                    title: "Critical Thinking Quiz",
                    description: "Test your logical reasoning and fallacy identification skills",
                  })
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Take Quiz
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Module 1: Fundamentals of Critical Thinking</h2>
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
            <h2 className="text-xl font-semibold mb-4">Module 2: Advanced Critical Thinking Applications</h2>
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
            <SimpleResourceLinks resources={RESOURCES} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Learning Coach</h2>
            <p className="text-sm text-gray-600 mb-4">
              Need help with critical thinking concepts? Chat with our learning coach for personalized guidance.
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