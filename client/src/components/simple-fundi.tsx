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
            "rounded-full p-0 w-16 h-16 bg-primary hover:bg-primary/90",
            isExpanded ? "opacity-100" : "opacity-90 hover:opacity-100"
          )}
        >
          <Avatar className="w-16 h-16">
            <AvatarImage src="/avatar.png" alt="AI Assistant" />
          </Avatar>
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