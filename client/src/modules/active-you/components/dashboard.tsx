import React from 'react';
import { useActiveYouContext } from '../context/module-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Dumbbell, Bird as YogaIcon, Timer, Flame } from 'lucide-react';
import { StretchingIcon } from '@/components/active-you';
import ActiveYou from '@/components/active-you';
import FitnessProfile from '@/components/fitness-profile';

export default function Dashboard() {
  const { activeTab, setActiveTab } = useActiveYouContext();

  const sections = [
    {
      id: 'activeyou',
      title: 'ActiveYou Profile',
      description: 'Manage your fitness profile and track your progress',
      icon: React.createElement('div', { className: 'text-pink-500' }, React.createElement(User, { className: 'w-8 h-8' }))
    },
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Find peace and balance with guided meditation sessions',
      icon: React.createElement('div', { className: 'text-pink-500' }, React.createElement(Brain, { className: 'w-8 h-8' }))
    },
    {
      id: 'weightlifting',
      title: 'Weight Lifting',
      description: 'Build strength with personalized workout plans',
      icon: React.createElement('div', { className: 'text-pink-500' }, React.createElement(Dumbbell, { className: 'w-8 h-8' }))
    },
    {
      id: 'yoga',
      title: 'Yoga',
      description: 'Improve flexibility and mindfulness through yoga',
      icon: React.createElement('div', { className: 'text-pink-500' }, React.createElement(YogaIcon, { className: 'w-8 h-8' }))
    },
    {
      id: 'running',
      title: 'Running',
      description: 'Track your runs and improve your endurance',
      icon: React.createElement('div', { className: 'text-pink-500' }, React.createElement(Timer, { className: 'w-8 h-8' }))
    },
    {
      id: 'hiit',
      title: 'HIIT',
      description: 'High-Intensity Interval Training for maximum results',
      icon: React.createElement('div', { className: 'text-pink-500' }, React.createElement(Flame, { className: 'w-8 h-8' }))
    },
    {
      id: 'stretch',
      title: 'Stretch Zone',
      description: 'Improve flexibility and recovery with guided stretching',
      icon: React.createElement('div', { className: 'text-pink-500' }, React.createElement(StretchingIcon, { className: 'w-8 h-8' }))
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'activeyou':
        return <FitnessProfile onComplete={() => setActiveTab('meditation')} />;
      default:
        return <ActiveYou defaultTab={activeTab} />;
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-center">Active You</h1>
      
      {/* Mobile navigation (visible only on small screens) */}
      <div className="md:hidden">
        <div className="px-2">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-pink-50 text-pink-800 rounded-md border-l-4 border-pink-500">
            Fitness Tools
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center text-center"
                onClick={() => setActiveTab(section.id as any)}
              >
                {section.icon}
                <span className="mt-2 font-medium">{section.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
}

// Import at the top
import { User } from 'lucide-react';