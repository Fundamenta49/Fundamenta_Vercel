import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palmtree } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJungleTheme } from "@/jungle-path/contexts/JungleThemeContext";
import { cn } from "@/lib/utils";

interface JungleModeToggleProps {
  className?: string;
}

export default function JungleModeToggle({ className }: JungleModeToggleProps) {
  const { isJungleTheme, toggleJungleTheme } = useJungleTheme();
  const { toast } = useToast();

  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    toggleJungleTheme();
    
    toast({
      title: checked ? "Jungle Mode Activated! 🌴" : "Jungle Mode Deactivated",
      description: checked 
        ? "Get ready for an immersive jungle learning adventure!" 
        : "Returning to standard learning experience.",
      variant: checked ? "default" : "destructive",
    });
    
    // Save preference to localStorage
    localStorage.setItem('jungle_mode_enabled', String(checked));
  };

  // Load saved preference on initial render
  useEffect(() => {
    const savedPreference = localStorage.getItem('jungle_mode_enabled') === 'true';
    if (savedPreference !== isJungleTheme) {
      toggleJungleTheme();
    }
  }, []);

  return (
    <Card className={cn("border", className)}>
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Palmtree className={cn(
              "h-5 w-5",
              isJungleTheme ? "text-[#94C973]" : "text-gray-500"
            )} />
            <div className="space-y-1">
              <Label 
                htmlFor="jungle-mode-toggle"
                className={isJungleTheme ? "text-[#E6B933]" : ""}
              >
                Jungle Mode
              </Label>
              <p className={cn(
                "text-xs text-muted-foreground",
                isJungleTheme && "text-[#94C973]"
              )}>
                Transform your learning experience into a jungle adventure
              </p>
            </div>
          </div>
          <Switch
            id="jungle-mode-toggle"
            checked={isJungleTheme}
            onCheckedChange={handleToggleChange}
            className={isJungleTheme ? "data-[state=checked]:bg-[#94C973]" : ""}
          />
        </div>
      </CardContent>
    </Card>
  );
}