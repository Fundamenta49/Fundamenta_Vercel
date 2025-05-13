/**
 * Test page for the ZoneCard component with different theme variations
 */
import { useState } from "react";
import { learningZones, ThemeType } from "../../data/zones-config";
import { ZoneCard } from "../../components/unified/ZoneCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";

export default function ZoneTestPage() {
  // State for the theme and other settings
  const [theme, setTheme] = useState<ThemeType>("standard");
  const [userRank, setUserRank] = useState<number>(2);
  const [progress, setProgress] = useState<number>(40);
  const [compact, setCompact] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Handle zone card clicks
  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    // In a real application, this would navigate to the zone page or open a modal
    console.log(`Zone clicked: ${zoneId}`);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Zone Card Component Test Page</h1>
      
      {/* Controls section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Theme</h3>
              <RadioGroup
                defaultValue={theme}
                onValueChange={(value) => setTheme(value as ThemeType)}
                className="flex space-x-4"
              >
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

            <div>
              <h3 className="text-lg font-medium mb-2">User Rank: {userRank}</h3>
              <Slider
                min={0}
                max={5}
                step={1}
                value={[userRank]}
                onValueChange={(value) => setUserRank(value[0])}
                className="w-full max-w-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                This affects which zones are locked/unlocked
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Progress: {progress}%</h3>
              <Slider
                min={0}
                max={100}
                step={5}
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                className="w-full max-w-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="compact-mode"
                checked={compact}
                onCheckedChange={setCompact}
              />
              <Label htmlFor="compact-mode">Compact Mode</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningZones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            theme={theme}
            userRank={userRank}
            progress={progress}
            questCount={10}
            completedQuests={Math.floor((progress / 100) * 10)}
            compact={compact}
            onClick={handleZoneClick}
            className="h-full"
          />
        ))}
      </div>

      {/* Selected zone info */}
      {selectedZone && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Selected Zone: {selectedZone}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You selected the "{selectedZone}" zone. In a real application, this would navigate to that zone's page or open a detailed view.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSelectedZone(null)}
            >
              Clear Selection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}