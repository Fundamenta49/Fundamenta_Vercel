import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { HelpCircle } from 'lucide-react';

export function TourSettings() {
  const [open, setOpen] = React.useState(false);
  
  // Check if we're in a minimized state
  const isMinimized = () => {
    return document.body.classList.contains('sidebar-minimized');
  };
  
  const handleOpenHelp = () => {
    setOpen(true);
  };
  
  return (
    <>
      {isMinimized() ? (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleOpenHelp}
          className="bg-white border-rose-300 text-gray-700 hover:bg-rose-50 mx-auto"
          title="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={handleOpenHelp}>
          Help
        </Button>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>
              Get assistance with using Fundamenta's features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="text-sm space-y-3">
                <li className="text-muted-foreground">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      toast({
                        title: "User Guide",
                        description: "The user guide will be available soon.",
                      });
                    }}
                  >
                    User Guide
                  </Button>
                </li>
                <li className="text-muted-foreground">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      toast({
                        title: "FAQ",
                        description: "The FAQ section will be available soon.",
                      });
                    }}
                  >
                    Frequently Asked Questions
                  </Button>
                </li>
                <li className="text-muted-foreground">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      toast({
                        title: "Contact Support",
                        description: "Support contact information will be available soon.",
                      });
                    }}
                  >
                    Contact Support
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}