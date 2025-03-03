import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Car, Wrench, Oil, Droplets, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MaintenanceGuide {
  title: string;
  steps: string[];
  tools: string[];
  difficulty: string;
  time: string;
  notes: string;
}

export default function VehicleGuide() {
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    make: "",
    model: "",
  });
  const [showGuide, setShowGuide] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>("");

  const maintenanceTasks: Record<string, MaintenanceGuide> = {
    "tire-change": {
      title: "How to Change a Tire",
      steps: [
        "Park on flat ground and engage parking brake",
        "Locate spare tire and tools in your vehicle",
        "Loosen lug nuts before lifting vehicle",
        "Place jack under designated lifting point",
        "Raise vehicle until tire is off ground",
        "Remove lug nuts and tire",
        "Mount spare tire and replace lug nuts",
        "Lower vehicle and tighten lug nuts completely",
      ],
      tools: [
        "Jack",
        "Lug wrench",
        "Spare tire",
        "Wheel wedges",
        "Flashlight",
      ],
      difficulty: "Moderate",
      time: "30-45 minutes",
      notes: "Check your owner's manual for specific jack points and tire pressure requirements",
    },
    "oil-check": {
      title: "How to Check Oil Level",
      steps: [
        "Park on level ground and wait for engine to cool",
        "Locate dipstick (usually marked in yellow/orange)",
        "Remove and wipe dipstick clean",
        "Reinsert dipstick fully",
        "Remove and check oil level",
        "Check oil color for contamination",
        "Reinsert dipstick",
      ],
      tools: [
        "Clean rag or paper towel",
      ],
      difficulty: "Easy",
      time: "5-10 minutes",
      notes: "Check oil when engine is cold for most accurate reading",
    },
    "wipers": {
      title: "How to Replace Windshield Wipers",
      steps: [
        "Measure wiper blade length or check owner's manual",
        "Lift wiper arm away from windshield",
        "Locate wiper blade attachment point",
        "Press release tab and slide old blade off",
        "Attach new blade until it clicks",
        "Repeat for other wiper",
        "Test wipers with washer fluid",
      ],
      tools: [
        "New wiper blades",
        "Owner's manual",
      ],
      difficulty: "Easy",
      time: "15-20 minutes",
      notes: "Replace wipers every 6-12 months or when streaking occurs",
    }
  };

  const handleSearch = () => {
    // In a real app, this would fetch vehicle-specific data
    setShowGuide(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500" />
            Vehicle Maintenance Guide
          </CardTitle>
          <CardDescription>
            Get customized maintenance instructions for your vehicle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Year (e.g., 2020)"
              value={vehicleInfo.year}
              onChange={(e) => setVehicleInfo(prev => ({ ...prev, year: e.target.value }))}
            />
            <Input
              placeholder="Make (e.g., Toyota)"
              value={vehicleInfo.make}
              onChange={(e) => setVehicleInfo(prev => ({ ...prev, make: e.target.value }))}
            />
            <Input
              placeholder="Model (e.g., Camry)"
              value={vehicleInfo.model}
              onChange={(e) => setVehicleInfo(prev => ({ ...prev, model: e.target.value }))}
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleSearch}
            disabled={!vehicleInfo.year || !vehicleInfo.make || !vehicleInfo.model}
          >
            Find Maintenance Guides
          </Button>

          {showGuide && (
            <div className="space-y-4">
              <Alert>
                <Car className="h-4 w-4" />
                <AlertDescription>
                  Showing maintenance guides for: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </AlertDescription>
              </Alert>

              <Select
                value={selectedTask}
                onValueChange={setSelectedTask}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tire-change">Change a Tire</SelectItem>
                  <SelectItem value="oil-check">Check Oil Level</SelectItem>
                  <SelectItem value="wipers">Replace Windshield Wipers</SelectItem>
                </SelectContent>
              </Select>

              {selectedTask && maintenanceTasks[selectedTask] && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-orange-500" />
                      {maintenanceTasks[selectedTask].title}
                    </CardTitle>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Difficulty: {maintenanceTasks[selectedTask].difficulty}</span>
                      <span>Time: {maintenanceTasks[selectedTask].time}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Required Tools:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {maintenanceTasks[selectedTask].tools.map((tool, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{tool}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Steps:</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        {maintenanceTasks[selectedTask].steps.map((step, index) => (
                          <li key={index} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </div>

                    <Alert className="mt-4 bg-orange-50 border-orange-200">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <AlertDescription className="text-orange-800">
                        Note: {maintenanceTasks[selectedTask].notes}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}