import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Navigation } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Location {
  city: string;
  state: string;
  country: string;
}

const STORAGE_KEY = 'emergency_location_data';

const emergencyGuides = [
  {
    title: "CPR Guide",
    description: "Step-by-step instructions for performing CPR",
    steps: [
      "Check the scene for safety",
      "Check the person for responsiveness",
      "Call 911 or ask someone else to",
      "Check for breathing",
      "Begin chest compressions",
      "Give rescue breaths",
      "Continue CPR until help arrives"
    ]
  },
  {
    title: "First Aid for Cuts and Burns",
    description: "Basic first aid for common injuries",
    steps: [
      "Clean the wound with soap and water",
      "Apply antibiotic ointment",
      "Cover with sterile bandage",
      "Change dressing daily",
      "Watch for signs of infection"
    ]
  },
  {
    title: "Natural Disaster Preparedness",
    description: "How to prepare for natural disasters",
    steps: [
      "Create an emergency kit",
      "Develop an evacuation plan",
      "Store important documents safely",
      "Keep emergency contacts handy",
      "Know your local emergency procedures"
    ]
  }
];

export default function EmergencyGuide() {
  const [location, setLocation] = useState<Location>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      city: "",
      state: "",
      country: "",
    };
  });

  const [isEditing, setIsEditing] = useState(!location.city);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  }, [location]);

  const handleLocationSubmit = () => {
    setIsEditing(false);
  };

  const getLocalEmergencyInfo = () => {
    if (!location.city) return null;

    return {
      policeNumber: "911",
      fireNumber: "911",
      ambulanceNumber: "911",
      evacuationRoutes: [
        "Primary: Follow main highways away from city center",
        "Secondary: Use local roads following emergency signage",
        "Meeting points: Local schools and community centers"
      ],
      emergencyAlerts: [
        "Sign up for local emergency alerts at your city's website",
        "Follow local emergency services on social media",
        "Keep a battery-powered radio for emergency broadcasts"
      ]
    };
  };

  const localInfo = getLocalEmergencyInfo();

  return (
    <div className="space-y-6">
      {/* Location Information */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Your Location
          </CardTitle>
          <CardDescription>
            Keep your location updated for relevant emergency information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={location.state}
                    onChange={(e) => setLocation({ ...location, state: e.target.value })}
                    placeholder="Enter your state"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={location.country}
                  onChange={(e) => setLocation({ ...location, country: e.target.value })}
                  placeholder="Enter your country"
                />
              </div>
              <Button onClick={handleLocationSubmit} className="w-full">
                Save Location
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-lg">
                  {location.city}, {location.state}, {location.country}
                </p>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Update Location
                </Button>
              </div>
              {localInfo && (
                <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Keep this information handy for emergencies in your area
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Numbers */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Emergency Numbers</CardTitle>
          <CardDescription>Keep these numbers handy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Emergency Services</span>
            <Button variant="destructive">911</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Poison Control</span>
            <Button variant="destructive">1-800-222-1222</Button>
          </div>
        </CardContent>
      </Card>

      {/* Local Emergency Information */}
      {localInfo && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-green-600" />
              Local Emergency Information
            </CardTitle>
            <CardDescription>
              Emergency resources for {location.city}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="evacuation">
                <AccordionTrigger>Evacuation Routes</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2">
                    {localInfo.evacuationRoutes.map((route, index) => (
                      <li key={index} className="text-sm">{route}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="alerts">
                <AccordionTrigger>Emergency Alerts</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2">
                    {localInfo.emergencyAlerts.map((alert, index) => (
                      <li key={index} className="text-sm">{alert}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Emergency Guides */}
      <Accordion type="single" collapsible className="space-y-4">
        {emergencyGuides.map((guide, index) => (
          <AccordionItem key={index} value={`guide-${index}`}>
            <AccordionTrigger className="text-lg font-semibold">
              {guide.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-4">{guide.description}</p>
              <ol className="list-decimal list-inside space-y-2">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-sm">{step}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}