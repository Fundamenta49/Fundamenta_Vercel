import React, { useState } from 'react';
import { learningZones } from '@/data/zones-config';
import ZoneCard from '@/components/unified/ZoneCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

/**
 * Test page for the ZoneCard component with different theme variations
 */
export default function ZoneTestPage() {
  // State for theme selection
  const [theme, setTheme] = useState<'standard' | 'jungle'>('standard');
  
  // State for user rank
  const [userRank, setUserRank] = useState<number>(1);
  
  // State for displaying compact cards
  const [compact, setCompact] = useState<boolean>(false);
  
  // Mock zone progress data
  const zoneProgress = {
    finance: { progress: 75, questCount: 12, completedQuests: 9 },
    wellness: { progress: 40, questCount: 10, completedQuests: 4 },
    fitness: { progress: 10, questCount: 8, completedQuests: 1 },
    career: { progress: 0, questCount: 15, completedQuests: 0 },
    emergency: { progress: 0, questCount: 6, completedQuests: 0 }
  };
  
  // Handle zone click
  const handleZoneClick = (zoneId: string) => {
    console.log(`Zone clicked: ${zoneId}`);
    alert(`Navigating to zone: ${zoneId}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Zone Card Testing</h1>
      
      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Theme Selection */}
            <div>
              <h3 className="text-lg font-medium mb-2">Theme</h3>
              <RadioGroup value={theme} onValueChange={(value: 'standard' | 'jungle') => setTheme(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jungle" id="jungle" />
                  <Label htmlFor="jungle">Jungle</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* User Rank */}
            <div>
              <h3 className="text-lg font-medium mb-2">User Rank: {userRank}</h3>
              <Slider
                value={[userRank]}
                min={0}
                max={5}
                step={1}
                onValueChange={(value) => setUserRank(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>Novice (0)</span>
                <span>Master (5)</span>
              </div>
            </div>
            
            {/* Compact Mode */}
            <div>
              <h3 className="text-lg font-medium mb-2">Card Style</h3>
              <div className="flex items-center space-x-2">
                <Switch id="compact-mode" checked={compact} onCheckedChange={setCompact} />
                <Label htmlFor="compact-mode">Compact Mode</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Zone Cards */}
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {learningZones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            theme={theme}
            userRank={userRank}
            progress={zoneProgress[zone.id as keyof typeof zoneProgress]?.progress || 0}
            questCount={zoneProgress[zone.id as keyof typeof zoneProgress]?.questCount || 0}
            completedQuests={zoneProgress[zone.id as keyof typeof zoneProgress]?.completedQuests || 0}
            compact={compact}
            onClick={handleZoneClick}
          />
        ))}
      </div>
      
      {/* Information */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Information</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Finance Zone: Available at Rank 0</li>
          <li>Wellness Zone: Available at Rank 1</li>
          <li>Fitness Zone: Available at Rank 2</li>
          <li>Career Zone: Available at Rank 2</li>
          <li>Emergency Zone: Available at Rank 3</li>
        </ul>
      </div>
    </div>
  );
}