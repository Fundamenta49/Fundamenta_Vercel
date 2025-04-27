import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, HelpCircle, Sparkles } from 'lucide-react';
import { Companion, getRandomCompanionMessage } from '../../data/companions';
import { AchievementCategory } from '@/shared/arcade-schema';

interface CompanionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
  currentZone?: AchievementCategory;
}

type MessageType = 'greeting' | 'encouragement' | 'celebration' | 'tips';

/**
 * Interactive dialog for communicating with a jungle companion
 */
const CompanionDialog: React.FC<CompanionDialogProps> = ({
  isOpen,
  onClose,
  companion,
  currentZone
}) => {
  const [activeTab, setActiveTab] = useState<MessageType>('greeting');
  const [animateMessage, setAnimateMessage] = useState(false);
  
  // Get the appropriate message based on the selected tab
  const getMessage = (): string => {
    switch (activeTab) {
      case 'greeting':
        return companion.messages.greeting;
      case 'encouragement':
        return getRandomCompanionMessage(companion, 'encouragement');
      case 'celebration':
        return getRandomCompanionMessage(companion, 'celebration');
      case 'tips':
        if (currentZone && companion.messages.tips[currentZone]) {
          return companion.messages.tips[currentZone];
        }
        return companion.messages.tips.general || "I have no specific tips for this zone.";
      default:
        return companion.messages.greeting;
    }
  };
  
  // Animate message when it changes
  const handleTabChange = (value: string) => {
    setAnimateMessage(true);
    setActiveTab(value as MessageType);
    setTimeout(() => setAnimateMessage(false), 500);
  };
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Conversation with {companion.name}</span>
          </DialogTitle>
          <DialogDescription>
            Your {companion.type} companion from the {companion.specialtyZone} zone
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 py-2">
          <div className="h-16 w-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
            {/* This would normally be an actual image */}
            <div className="font-bold text-2xl text-amber-800">
              {companion.name.charAt(0)}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium">{companion.name}</h3>
            <p className="text-xs text-gray-500">
              {companion.personality.charAt(0).toUpperCase() + companion.personality.slice(1)} {companion.type}
            </p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="greeting" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="greeting">
              <MessageCircle className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Greet</span>
            </TabsTrigger>
            <TabsTrigger value="encouragement">
              <Sparkles className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Encourage</span>
            </TabsTrigger>
            <TabsTrigger value="celebration">
              <Sparkles className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Celebrate</span>
            </TabsTrigger>
            <TabsTrigger value="tips">
              <HelpCircle className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Tips</span>
            </TabsTrigger>
          </TabsList>
          
          <Card className="mt-4 border-amber-200">
            <CardContent className="pt-4">
              <div 
                className={`text-sm italic text-gray-600 p-3 rounded-lg bg-amber-50 
                  ${animateMessage ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}`}
              >
                "{getMessage()}"
              </div>
            </CardContent>
          </Card>
        </Tabs>
        
        <DialogFooter className="sm:justify-start">
          <Button 
            type="button" 
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanionDialog;