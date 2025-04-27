import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Companion } from '../../types/companion';

interface CompanionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
}

/**
 * CompanionDialog displays a dialog with companion interactions and tips
 */
const CompanionDialog: React.FC<CompanionDialogProps> = ({
  isOpen,
  onClose,
  companion
}) => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center space-x-4 pb-2 border-b">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center bg-muted"
            style={{ border: `2px solid ${companion.color}` }}
          >
            {/* Placeholder for companion avatar */}
            <span className="text-2xl">{companion.species.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">{companion.name}</h2>
            <p className="text-sm text-muted-foreground">{companion.species} Companion</p>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="tips">Tips & Hints</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="pt-4">
            <div 
              className="rounded-lg p-4 mb-4"
              style={{ backgroundColor: `${companion.color}20` }}
            >
              <p className="text-sm">{companion.introMessage}</p>
            </div>
            
            <div className="rounded-lg border p-4 mb-4 min-h-[100px] max-h-[150px] overflow-y-auto">
              <p className="text-sm text-muted-foreground italic">
                Your conversation with {companion.name} will be shown here.
                This feature will keep track of your interactions and provide context-aware guidance.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-grow"
                disabled
              >
                Ask for help
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex-grow"
                disabled
              >
                Request tip
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="pt-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Helpful Tips</h3>
                <ul className="space-y-3">
                  {companion.tips.map(tip => (
                    <li key={tip.id} className="text-sm flex">
                      <span className="text-[#94C973] mr-2">•</span>
                      <span>{tip.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-2">Specialty Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {companion.specialtyZones.map(zone => (
                    <span
                      key={zone}
                      className="px-2 py-1 text-xs rounded-full bg-muted"
                    >
                      {zone.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button
            onClick={onClose}
            style={{ backgroundColor: companion.color }}
          >
            Continue Journey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanionDialog;