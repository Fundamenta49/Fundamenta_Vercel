import { useState } from 'react';
import { useLocation } from 'wouter';
import { BookOpenIcon, ChevronLeftIcon, MicIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleResourceLinks from '@/components/simple-resource-links';
import { useToast } from '@/hooks/use-toast';
import LearningCoachPopOut from '@/components/learning-coach-pop-out';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import FloatingChat from '@/components/floating-chat';

export default function PublicSpeakingCourse() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(false);

  // Course materials
  const MODULE_ONE = [
    { title: 'Overcoming Speaking Anxiety', length: '8 min', completed: false },
    { title: 'Vocal Techniques', length: '10 min', completed: false },
    { title: 'Body Language Essentials', length: '7 min', completed: false },
  ];

  const MODULE_TWO = [
    { title: 'Organizing Your Speech', length: '9 min', completed: false },
    { title: 'Engaging Your Audience', length: '12 min', completed: false },
    { title: 'Visual Aids and Technology', length: '8 min', completed: false },
  ];

  // Course resources
  const RESOURCES = [
    {
      title: 'TED Talk Guide',
      url: 'https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker',
      description: 'Tips from the experts at TED'
    },
    {
      title: 'Toastmasters Resources',
      url: 'https://www.toastmasters.org/resources',
      description: 'Free public speaking resources and guides'
    },
    {
      title: 'Speech Structure Template',
      url: 'https://sixminutes.dlugan.com/speech-preparation-3-outline-examples/',
      description: 'Templates for organizing effective speeches'
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
          Public Speaking
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MicIcon className="mr-2 h-5 w-5 text-orange-500" />
              Course Overview
            </h2>
            <p className="text-gray-700 mb-4">
              Public speaking is one of the most valuable skills you can develop for both personal and professional success. This course helps you build confidence, craft compelling messages, and deliver presentations that engage and inspire audiences. Whether you're preparing for a work presentation, a school speech, or simply want to express yourself more effectively, these techniques will help you communicate with impact.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => {
                  toast({
                    title: "Public Speaking Quiz",
                    description: "Test your knowledge of presentation techniques",
                  })
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Take Quiz
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Module 1: Speaking Foundations</h2>
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
            <h2 className="text-xl font-semibold mb-4">Module 2: Advanced Presentation Skills</h2>
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
              Preparing for an important speech? Chat with our learning coach for personalized feedback on your presentation.
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