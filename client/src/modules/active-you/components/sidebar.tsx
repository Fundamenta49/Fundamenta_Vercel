import React from 'react';
import { useActiveYouContext } from '../context/module-context';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Dumbbell, 
  Bird as YogaIcon, 
  Timer, 
  Flame, 
  Activity, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StretchingIcon } from '@/components/active-you';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useActiveYouContext();

  const tabs = [
    { id: 'activeyou', label: 'Profile', icon: User },
    { id: 'meditation', label: 'Meditation', icon: Brain },
    { id: 'weightlifting', label: 'Weight Lifting', icon: Dumbbell },
    { id: 'yoga', label: 'Yoga', icon: YogaIcon },
    { id: 'running', label: 'Running', icon: Timer },
    { id: 'hiit', label: 'HIIT', icon: Flame },
    { id: 'stretch', label: 'Stretch Zone', icon: StretchingIcon },
  ];

  return (
    <div className="w-64 bg-white border-r h-full p-4 hidden md:block">
      <div className="space-y-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start',
              activeTab === tab.id ? 'bg-pink-100 text-pink-800 hover:bg-pink-200' : 'hover:bg-pink-50'
            )}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <tab.icon className="mr-2 h-5 w-5" />
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
}