import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/lib/onboarding-context';
import { toast } from '@/hooks/use-toast';
import { HelpCircle } from 'lucide-react';

export function TourSettings() {
  const [open, setOpen] = React.useState(false);
  const { 
    onboardingState, 
    availableTours,
    resetAllTours,
    disableAllTours,
    enableAllTours
  } = useOnboarding();
  
  const handleResetAllTours = () => {
    resetAllTours();
    toast({
      title: "Tours Reset",
      description: "All interactive tours have been reset and can be viewed again.",
    });
    setOpen(false);
  };
  
  const handleToggleAllTours = (enabled: boolean) => {
    if (enabled) {
      enableAllTours();
      toast({
        title: "Tours Enabled",
        description: "Interactive tours are now enabled and will appear as you navigate.",
      });
    } else {
      disableAllTours();
      toast({
        title: "Tours Disabled",
        description: "All interactive tours have been disabled.",
      });
    }
  };
  
  // Check if we're in a minimized state by checking if parent elements have certain classes
  const isMinimized = () => {
    // Try to find if we're in a minimized sidebar by looking for specific parent class
    return document.body.classList.contains('sidebar-minimized');
  };
  
  return (
    <>
      {isMinimized() ? (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setOpen(true)}
          className="bg-white border-rose-300 text-gray-700 hover:bg-rose-50 mx-auto"
          title="Tour Settings"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Tour Settings
        </Button>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interactive Tour Settings</DialogTitle>
            <DialogDescription>
              Manage how interactive tours appear throughout the application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-tours" className="text-base">Enable Tours</Label>
                <p className="text-sm text-muted-foreground">
                  Show interactive guided tours for different sections of the app
                </p>
              </div>
              <Switch 
                id="enable-tours" 
                checked={!onboardingState.disableAllTours}
                onCheckedChange={handleToggleAllTours}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Available Tours</h3>
              <ul className="text-sm space-y-1">
                {availableTours.map(tour => (
                  <li key={tour.id} className="text-muted-foreground">
                    {tour.title}
                  </li>
                ))}
              </ul>
            </div>
            
            <Button
              variant="secondary"
              onClick={handleResetAllTours}
              className="w-full"
              disabled={onboardingState.disableAllTours}
            >
              Reset All Tours
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}