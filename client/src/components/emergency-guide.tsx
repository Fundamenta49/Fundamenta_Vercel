import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  MapPin,
  Shield,
  BriefcaseMedical,
  Home,
  Cloud,
  Wind,
  Waves,
  Zap,
  Thermometer,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Location {
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface EmergencyType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  immediateSteps: string[];
  preparationSteps: string[];
}

const EMERGENCY_TYPES: EmergencyType[] = [
  {
    id: "severe_storm",
    name: "Severe Storm",
    icon: <Cloud className="h-5 w-5 text-blue-600" />,
    description: "Thunderstorms, heavy rain, and dangerous lightning",
    immediateSteps: [
      "Stay indoors and away from windows",
      "Unplug electronic devices",
      "Listen to weather updates",
      "Have emergency supplies ready"
    ],
    preparationSteps: [
      "Create an emergency kit",
      "Clear yard of loose objects",
      "Check drainage systems",
      "Have battery-powered devices ready"
    ]
  },
  {
    id: "hurricane",
    name: "Hurricane",
    icon: <Wind className="h-5 w-5 text-blue-600" />,
    description: "Strong winds, heavy rain, and potential flooding",
    immediateSteps: [
      "Follow evacuation orders",
      "Stay tuned to local news",
      "Move to higher ground if needed",
      "Keep emergency supplies accessible"
    ],
    preparationSteps: [
      "Board up windows",
      "Stock up on supplies",
      "Fill vehicles with gas",
      "Prepare evacuation plan"
    ]
  },
  {
    id: "tornado",
    name: "Tornado",
    icon: <Waves className="h-5 w-5 text-red-600" />,
    description: "Violent rotating columns of air",
    immediateSteps: [
      "Move to basement or interior room",
      "Stay away from windows",
      "Cover yourself with blankets",
      "Listen for updates"
    ],
    preparationSteps: [
      "Identify safe room",
      "Practice tornado drills",
      "Prepare emergency kit",
      "Know warning signs"
    ]
  },
  {
    id: "earthquake",
    name: "Earthquake",
    icon: <Zap className="h-5 w-5 text-yellow-600" />,
    description: "Sudden ground shaking and potential structural damage",
    immediateSteps: [
      "Drop, cover, and hold on",
      "Stay away from glass and windows",
      "Do not use elevators",
      "Be prepared for aftershocks"
    ],
    preparationSteps: [
      "Secure heavy furniture",
      "Know safe spots in each room",
      "Keep emergency supplies ready",
      "Learn gas/water shutoff"
    ]
  }
];

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  completed: boolean;
  required: boolean;
}

// State emergency management links (retained from original)
const stateEmergencyLinks = {
  "Alabama": "https://ema.alabama.gov/",
  "Alaska": "https://ready.alaska.gov/",
  "Arizona": "https://dem.az.gov/",
  "Arkansas": "https://www.adem.arkansas.gov/",
  "California": "https://www.caloes.ca.gov/",
  "Colorado": "https://dhsem.colorado.gov/",
  "Connecticut": "https://portal.ct.gov/DEMHS",
  "Delaware": "https://dema.delaware.gov/",
  "Florida": "https://www.floridadisaster.org/",
  "Georgia": "https://gema.georgia.gov/",
  "Hawaii": "https://dod.hawaii.gov/hiema/",
  "Idaho": "https://ioem.idaho.gov/",
  "Illinois": "https://www2.illinois.gov/iema/",
  "Indiana": "https://www.in.gov/dhs/",
  "Iowa": "https://homelandsecurity.iowa.gov/",
  "Kansas": "https://www.kansastag.gov/KDEM.asp",
  "Kentucky": "https://kyem.ky.gov/",
  "Louisiana": "https://gohsep.la.gov/",
  "Maine": "https://www.maine.gov/mema/",
  "Maryland": "https://mema.maryland.gov/",
  "Massachusetts": "https://www.mass.gov/orgs/massachusetts-emergency-management-agency",
  "Michigan": "https://www.michigan.gov/msp/divisions/emhsd",
  "Minnesota": "https://hsem.dps.mn.gov/",
  "Mississippi": "https://www.msema.org/",
  "Missouri": "https://sema.dps.mo.gov/",
  "Montana": "https://des.mt.gov/",
  "Nebraska": "https://nema.nebraska.gov/",
  "Nevada": "https://dem.nv.gov/",
  "New Hampshire": "https://www.nh.gov/safety/divisions/hsem/",
  "New Jersey": "https://www.ready.nj.gov/",
  "New Mexico": "https://www.nmdhsem.org/",
  "New York": "https://www.dhses.ny.gov/",
  "North Carolina": "https://www.ncdps.gov/ncem",
  "North Dakota": "https://www.des.nd.gov/",
  "Ohio": "https://ema.ohio.gov/",
  "Oklahoma": "https://oklahoma.gov/oem.html",
  "Oregon": "https://www.oregon.gov/oem/",
  "Pennsylvania": "https://www.pema.pa.gov/",
  "Rhode Island": "https://riema.ri.gov/",
  "South Carolina": "https://www.scemd.org/",
  "South Dakota": "https://dps.sd.gov/emergency-services",
  "Tennessee": "https://www.tn.gov/tema.html",
  "Texas": "https://tdem.texas.gov/",
  "Utah": "https://dem.utah.gov/",
  "Vermont": "https://vem.vermont.gov/",
  "Virginia": "https://www.vaemergency.gov/",
  "Washington": "https://mil.wa.gov/emergency-management-division",
  "West Virginia": "https://emd.wv.gov/",
  "Wisconsin": "https://wem.wi.gov/",
  "Wyoming": "https://hls.wyo.gov/"
};

export default function EmergencyGuide() {
  const [location, setLocation] = useState<Location>(() => {
    const stored = localStorage.getItem('emergency_location_data');
    return stored ? JSON.parse(stored) : { city: "", state: "", country: "" };
  });

  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string>("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    if (location.city && selectedEmergencyType) {
      generateChecklist(location, selectedEmergencyType);
    }
  }, [location, selectedEmergencyType]);

  const generateChecklist = (location: Location, emergencyType: string) => {
    const selectedEmergency = EMERGENCY_TYPES.find(e => e.id === emergencyType);
    if (!selectedEmergency) return;

    const baseChecklist: ChecklistItem[] = [
      ...selectedEmergency.immediateSteps.map((step, index) => ({
        id: `immediate-${index}`,
        text: step,
        category: "Immediate Actions",
        completed: false,
        required: true
      })),
      ...selectedEmergency.preparationSteps.map((step, index) => ({
        id: `prep-${index}`,
        text: step,
        category: "Preparation",
        completed: false,
        required: true
      }))
    ];

    setChecklist(baseChecklist);
    updateProgress(baseChecklist);
  };

  const updateProgress = (items: ChecklistItem[]) => {
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    setChecklistProgress(Math.round((completed / total) * 100));
  };

  const toggleChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    updateProgress(updatedChecklist);
  };

  const handleLocationSubmit = () => {
    if (location.city && location.state) {
      localStorage.setItem('emergency_location_data', JSON.stringify(location));
      // Here we would typically fetch real weather alerts and emergency data
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Emergency Preparedness Guide
          </CardTitle>
          <CardDescription>
            Select the type of emergency to get specific guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMERGENCY_TYPES.map((type) => (
              <Button
                key={type.id}
                variant={selectedEmergencyType === type.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setSelectedEmergencyType(type.id)}
              >
                {type.icon}
                <span className="font-semibold">{type.name}</span>
                <span className="text-sm text-muted-foreground text-center">
                  {type.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Your Location
          </CardTitle>
          <CardDescription>
            Keep your location updated for relevant emergency information
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  placeholder="Enter your state"
                />
              </div>
            </div>
            <Button 
              onClick={handleLocationSubmit}
              className="w-full"
              disabled={!location.city || !location.state}
            >
              Update Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Checklist */}
      {selectedEmergencyType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BriefcaseMedical className="h-5 w-5 text-primary" />
                Emergency Checklist
              </div>
              <Badge variant="outline">{checklistProgress}% Complete</Badge>
            </CardTitle>
            <CardDescription>
              Track your emergency preparedness progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={checklistProgress} className="w-full" />
              <Accordion type="single" collapsible className="w-full">
                {Array.from(new Set(checklist.map(item => item.category))).map((category) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger>{category}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {checklist
                          .filter(item => item.category === category)
                          .map(item => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 p-2 rounded hover:bg-accent"
                              onClick={() => toggleChecklistItem(item.id)}
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleChecklistItem(item.id)}
                                className="h-4 w-4"
                              />
                              <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                                {item.text}
                              </span>
                              {item.required && (
                                <Badge variant="outline" className="ml-auto">
                                  Required
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}

      {/* State Emergency Resources */}
      {location.state && stateEmergencyLinks[location.state] && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              State Emergency Resources
            </CardTitle>
            <CardDescription>
              Official emergency management resources for {location.state}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Access official emergency information and resources specific to your state
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(stateEmergencyLinks[location.state], "_blank")}
              >
                Visit {location.state} Emergency Management Agency
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


      {/* National Emergency Resources - Retained from original */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            National Emergency Resources
          </CardTitle>
          <CardDescription>
            Federal emergency management resources and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open("https://www.ready.gov/", "_blank")}
            >
              Ready.gov - National Preparedness
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open("https://www.fema.gov/", "_blank")}
            >
              FEMA - Federal Emergency Management Agency
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.open("https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html", "_blank")}
            >
              Red Cross Emergency Preparedness
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}