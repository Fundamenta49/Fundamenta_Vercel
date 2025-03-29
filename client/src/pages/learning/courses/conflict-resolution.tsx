import { useState } from 'react';
import { useLocation } from 'wouter';
import { BookOpenIcon, ChevronLeftIcon, UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourceLinks from '@/components/resource-links';
import { useToast } from '@/hooks/use-toast';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';

export default function ConflictResolutionCourse() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);

  // Course materials
  const MODULE_ONE = [
    { title: 'Understanding Conflict Types', length: '6 min', completed: false },
    { title: 'Active Listening Techniques', length: '8 min', completed: false },
    { title: 'De-escalation Strategies', length: '10 min', completed: false },
  ];

  const MODULE_TWO = [
    { title: 'Negotiation Fundamentals', length: '12 min', completed: false },
    { title: 'Mediating Disputes', length: '15 min', completed: false },
    { title: 'Finding Win-Win Solutions', length: '8 min', completed: false },
  ];

  // Course resources
  const RESOURCES = [
    {
      title: 'Conflict Resolution Guide',
      url: 'https://www.pon.harvard.edu/daily/conflict-resolution/conflict-resolution-strategies/',
      description: 'Harvard Program on Negotiation strategies'
    },
    {
      title: 'Active Listening Exercises',
      url: 'https://www.mindtools.com/CommSkll/ActiveListening.htm',
      description: 'Practical exercises to improve listening skills'
    },
    {
      title: 'De-escalation Techniques',
      url: 'https://www.crisisprevention.com/Blog/De-escalation-Techniques',
      description: 'Professional approaches to calm tense situations'
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
          Conflict Resolution
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UsersIcon className="mr-2 h-5 w-5 text-orange-500" />
              Course Overview
            </h2>
            <p className="text-gray-700 mb-4">
              Conflict resolution involves the methods and processes used to facilitate the peaceful ending of conflict. This course teaches essential skills for managing disagreements constructively, including active listening, negotiation techniques, and finding mutually beneficial solutions. These skills are valuable in personal relationships, workplace dynamics, and community interactions.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => {
                  toast({
                    title: "Conflict Resolution Quiz",
                    description: "Test your knowledge of conflict management strategies",
                  })
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Take Quiz
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Module 1: Understanding Conflict</h2>
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
            <h2 className="text-xl font-semibold mb-4">Module 2: Resolution Strategies</h2>
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
              Struggling with a particular conflict? Chat with our learning coach for personalized advice on resolution strategies.
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