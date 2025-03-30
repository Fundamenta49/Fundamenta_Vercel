import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AvatarImage, Avatar } from './ui/avatar';
import { cn } from '@/lib/utils';

interface FundiModule {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  icon?: string;
}

const SimpleFundi: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState('minimal');

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const switchModule = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-300",
      isExpanded ? "w-96" : "w-16"
    )}>
      <div className="relative">
        {/* Avatar Button */}
        <Button
          onClick={toggleExpansion}
          className={cn(
            "rounded-full p-0 w-16 h-16 bg-white shadow-lg hover:shadow-xl transition-all",
            isExpanded ? "opacity-100" : "opacity-90 hover:opacity-100"
          )}
        >
          <div className="relative w-full h-full rounded-full bg-white overflow-hidden">
            {/* Robot Face */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Eyes Container */}
              <div className="flex gap-2">
                {/* Left Eye */}
                <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" 
                     style={{boxShadow: '0 0 10px #60A5FA'}}/>
                {/* Right Eye */}
                <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"
                     style={{boxShadow: '0 0 10px #60A5FA'}}/>
              </div>
            </div>
            {/* Smile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-2 rounded-t-full bg-slate-300"/>
          </div>
        </Button>

        {/* Expanded Interface */}
        {isExpanded && (
          <Card className="absolute bottom-20 right-0 w-96 p-4 shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How can I help you?</h3>
              <div className="grid grid-cols-2 gap-2">
                {/* Module Selection Buttons */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => switchModule('financial')}
                >
                  Financial
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => switchModule('career')}
                >
                  Career
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => switchModule('wellness')}
                >
                  Wellness
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => switchModule('emergency')}
                >
                  Emergency
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SimpleFundi;