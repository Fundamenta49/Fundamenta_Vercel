import React from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Brain, Dumbbell, Bird as YogaIcon, Timer, User, Flame, X } from "lucide-react";
import { StretchingIcon } from "@/components/active-you";
import ActiveYou from "@/components/active-you";
import FitnessProfile from "@/components/fitness-profile";
import * as Dialog from "@radix-ui/react-dialog";

export default function ActivePage() {
  // Extract section from URL if present
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const sectionParam = params.get('section');

  const sections = [
    {
      id: 'activeyou',
      title: 'ActiveYou Profile',
      description: 'Manage your fitness profile and track your progress',
      icon: User,
      defaultTab: 'meditation'
    },
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Find peace and balance with guided meditation sessions',
      icon: Brain,
      defaultTab: 'meditation'
    },
    {
      id: 'weightlifting',
      title: 'Weight Lifting',
      description: 'Build strength with personalized workout plans',
      icon: Dumbbell,
      defaultTab: 'weightlifting'
    },
    {
      id: 'yoga',
      title: 'Yoga',
      description: 'Improve flexibility and mindfulness through yoga',
      icon: YogaIcon,
      defaultTab: 'yoga'
    },
    {
      id: 'running',
      title: 'Running',
      description: 'Track your runs and improve your endurance',
      icon: Timer,
      defaultTab: 'running'
    },
    {
      id: 'hiit',
      title: 'HIIT',
      description: 'High-Intensity Interval Training for maximum results',
      icon: Flame,
      defaultTab: 'hiit'
    },
    {
      id: 'stretch',
      title: 'Stretch Zone',
      description: 'Improve flexibility and recovery with guided stretching',
      icon: StretchingIcon,
      defaultTab: 'stretch',
      spanCol: true
    }
  ];

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
        Active You
      </h1>

      {/* Fitness Tools Section */}
      <div className="px-2">
        <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-pink-50 text-pink-800 rounded-md border-l-4 border-pink-500">
          Fitness Tools
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-4 max-w-6xl mx-auto">
          {sections.map((section) => (
            <Dialog.Root key={section.id}>
              <Dialog.Trigger asChild>
                <div className={`flex flex-col h-full ${section.spanCol ? 'col-span-2' : ''}`}>
                  <button
                    className={`relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-pink-500 min-h-[130px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] w-full h-full ${section.spanCol ? 'sm:flex-row sm:items-start sm:text-left sm:justify-start' : ''}`}
                    aria-label={`Open ${section.title}`}
                  >
                    <div className={`flex items-center justify-center h-12 sm:h-14 md:h-16 ${section.spanCol ? 'sm:mr-6' : 'w-full'} mb-2 md:mb-3`}>
                      <section.icon className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-500" />
                    </div>
                    
                    <div className={`flex flex-col ${section.spanCol ? 'sm:items-start items-center' : 'items-center'} w-full`}>
                      <span className={`text-sm sm:text-base md:text-lg font-medium ${section.spanCol ? 'sm:text-left text-center' : 'text-center'} line-clamp-2 w-full`}>{section.title}</span>
                      
                      <p className={`text-xs sm:text-sm text-gray-500 mt-1 md:mt-2 line-clamp-3 ${section.spanCol ? 'sm:text-left text-center' : 'text-center'} block`}>
                        {section.description.length > (section.spanCol ? 100 : 80) 
                          ? `${section.description.substring(0, section.spanCol ? 100 : 80)}...` 
                          : section.description}
                      </p>
                    </div>
                  </button>
                </div>
              </Dialog.Trigger>
              
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed inset-0 z-50 w-full h-screen overflow-auto bg-white shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full">
                  <div className="min-h-full">
                    {/* Swipe indicator for mobile */}
                    <div className="absolute top-2 left-0 right-0 flex justify-center items-center pointer-events-none sm:hidden">
                      <div className="h-1 w-16 bg-pink-300 rounded-full opacity-70"></div>
                    </div>
                    
                    <div className="sticky top-0 z-10 px-6 py-5 sm:pt-4 flex items-center justify-between border-b bg-white shadow-sm">
                      <Dialog.Title className="text-2xl font-semibold leading-none tracking-tight text-pink-800">
                        {section.title}
                      </Dialog.Title>
                      <Dialog.Close className="rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none bg-pink-100">
                        <X className="h-6 w-6 text-pink-500" />
                        <span className="sr-only">Close</span>
                      </Dialog.Close>
                    </div>
                    
                    <div className="px-6 py-4 pb-16">
                      {section.id === 'activeyou' ? 
                        <FitnessProfile onComplete={() => {}} /> : 
                        <ActiveYou defaultTab={section.defaultTab as any} />
                      }
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          ))}
        </div>
      </div>
    </div>
  );
}