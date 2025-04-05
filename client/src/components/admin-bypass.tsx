import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function AdminBypass() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Check current state on component mount
    const adminBypass = localStorage.getItem('admin_bypass');
    setIsEnabled(adminBypass === 'enabled');
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (checked) {
      localStorage.setItem('admin_bypass', 'enabled');
      toast({
        title: 'Admin Bypass Enabled',
        description: 'You will be automatically signed in as admin on page refresh.',
        variant: 'default'
      });
    } else {
      localStorage.removeItem('admin_bypass');
      toast({
        title: 'Admin Bypass Disabled',
        description: 'Standard login will be required on next visit.',
        variant: 'default'
      });
    }
  };

  const handleRefresh = () => {
    // Force a page refresh to apply the admin bypass
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Admin Access</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Admin Access Settings</DialogTitle>
          <DialogDescription>
            Configure automatic admin login bypass for development.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="admin-bypass">Auto Admin Bypass</Label>
              <p className="text-xs text-muted-foreground">
                Skip login screen and automatically sign in as admin.
              </p>
            </div>
            <Switch 
              id="admin-bypass"
              checked={isEnabled}
              onCheckedChange={handleToggle}
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setLocation('/login')}>
              Go to Login
            </Button>
            <Button onClick={handleRefresh}>
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}