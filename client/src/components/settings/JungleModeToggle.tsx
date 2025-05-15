import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Palmtree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JungleModeToggleProps {
  className?: string;
}

export default function JungleModeToggle({ className }: JungleModeToggleProps) {
  // Get jungle mode state from localStorage, default to false
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('jungleMode');
      return savedPreference === 'true';
    }
    return false;
  });
  
  const { toast } = useToast();

  // Update localStorage when toggle changes
  useEffect(() => {
    localStorage.setItem('jungleMode', enabled.toString());
  }, [enabled]);

  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    setEnabled(checked);
    
    // Show toast notification
    toast({
      title: checked ? "Jungle Mode Activated!" : "Jungle Mode Deactivated",
      description: checked 
        ? "Your learning experience is now jungle-themed. Explore your jungle expedition!" 
        : "Reverted to standard view. You can enable Jungle Mode again at any time.",
      duration: 3000,
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Jungle Mode</CardTitle>
          <Palmtree className={`h-5 w-5 ${enabled ? 'text-green-600' : 'text-muted-foreground'}`} />
        </div>
        <CardDescription>
          Transform your learning experience into a jungle-themed adventure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="jungle-mode" className="flex flex-col space-y-1">
            <span>{enabled ? 'Jungle Mode Enabled' : 'Regular Mode'}</span>
            <span className="text-xs text-muted-foreground">
              {enabled 
                ? 'Explore learning pathways as jungle expeditions' 
                : 'Switch to enable the immersive jungle theme'}
            </span>
          </Label>
          <Switch
            id="jungle-mode"
            checked={enabled}
            onCheckedChange={handleToggleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}