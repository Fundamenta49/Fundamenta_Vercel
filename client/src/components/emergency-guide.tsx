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
import { AlertTriangle, MapPin, Navigation, Cloud, Shield, BriefcaseMedical, Home, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Location {
  city: string;
  state: string;
  country: string;
}

interface WeatherAlert {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  instructions: string;
}

interface Shelter {
  name: string;
  address: string;
  type: string;
  capacity: number;
  currentStatus: "open" | "full" | "closed";
}

const STORAGE_KEY = 'emergency_location_data';

const evacuationChecklist = [
  {
    category: "Essential Documents",
    items: [
      "Driver's license and ID cards",
      "Insurance policies",
      "Birth certificates and passports",
      "Social Security cards",
      "Medical records and prescriptions",
      "Bank account information",
    ]
  },
  {
    category: "Emergency Supplies",
    items: [
      "3-day supply of non-perishable food",
      "Water (1 gallon per person per day)",
      "First aid kit",
      "Flashlights and batteries",
      "Battery-powered or hand-crank radio",
      "Emergency blankets",
      "Basic tools",
    ]
  },
  {
    category: "Personal Items",
    items: [
      "Change of clothes",
      "Personal hygiene items",
      "Prescription medications",
      "Phone charger",
      "Cash and change",
      "Emergency contact list",
    ]
  }
];

const femaAssistance = [
  {
    title: "Individual Assistance",
    description: "Financial help for individuals and households affected by disasters",
    steps: [
      "Visit DisasterAssistance.gov",
      "Call 1-800-621-3362",
      "Document all damage with photos",
      "Keep receipts for disaster-related expenses",
      "Register within 60 days of disaster declaration"
    ],
    links: [
      { text: "FEMA Application", url: "https://www.disasterassistance.gov/" },
      { text: "Recovery Resources", url: "https://www.fema.gov/assistance/individual/disaster-survivors" }
    ]
  },
  {
    title: "Housing Assistance",
    description: "Temporary housing and home repair assistance",
    steps: [
      "Apply for FEMA assistance",
      "Schedule home inspection",
      "Provide proof of occupancy/ownership",
      "Keep all documentation of damage",
      "Follow up on application status"
    ]
  },
  {
    title: "Financial Resources",
    description: "Grants and loans for disaster recovery",
    steps: [
      "Apply for Small Business Administration (SBA) disaster loans",
      "Contact your insurance provider",
      "Document all losses",
      "Keep receipts for reimbursement",
      "Consider tax deductions for losses"
    ],
    links: [
      { text: "SBA Disaster Loans", url: "https://www.sba.gov/funding-programs/disaster-assistance" }
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
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [nearbyShelters, setNearbyShelters] = useState<Shelter[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));

    // Mock weather alerts based on location
    if (location.city) {
      // In a real app, this would be an API call to a weather service
      setWeatherAlerts([
        {
          type: "Severe Weather",
          severity: "high",
          description: "Potential severe thunderstorms in your area",
          instructions: "Stay indoors and away from windows. Monitor local news for updates."
        },
        {
          type: "Flash Flood Watch",
          severity: "medium",
          description: "Heavy rainfall may cause flash flooding",
          instructions: "Avoid low-lying areas and be prepared to move to higher ground."
        }
      ]);

      // Mock shelter data based on location
      setNearbyShelters([
        {
          name: "Community Center Shelter",
          address: "123 Main St",
          type: "General",
          capacity: 200,
          currentStatus: "open"
        },
        {
          name: "High School Gymnasium",
          address: "456 School Ave",
          type: "General",
          capacity: 300,
          currentStatus: "open"
        }
      ]);
    }
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

      {/* Weather & Disaster Alerts */}
      {location.city && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-orange-600" />
              Weather & Disaster Alerts
            </CardTitle>
            <CardDescription>
              Current alerts for {location.city}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  className={`
                    ${alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                      alert.severity === 'medium' ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'}
                  `}
                >
                  <AlertTriangle className={`
                    h-4 w-4
                    ${alert.severity === 'high' ? 'text-red-600' :
                      alert.severity === 'medium' ? 'text-orange-600' :
                        'text-yellow-600'}
                  `} />
                  <div className="ml-2">
                    <h4 className="font-semibold">{alert.type}</h4>
                    <p className="text-sm mt-1">{alert.description}</p>
                    <p className="text-sm mt-2 font-medium">Instructions:</p>
                    <p className="text-sm">{alert.instructions}</p>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Numbers */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BriefcaseMedical className="h-5 w-5 text-red-600" />
            Emergency Numbers
          </CardTitle>
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

      {/* Evacuation Checklist */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Evacuation Checklist
          </CardTitle>
          <CardDescription>
            Essential items to prepare for evacuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {evacuationChecklist.map((category, index) => (
              <AccordionItem key={index} value={`category-${index}`}>
                <AccordionTrigger>{category.category}</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Nearby Shelters */}
      {location.city && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-green-600" />
              Emergency Shelters Near {location.city}
            </CardTitle>
            <CardDescription>
              Available emergency shelters in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nearbyShelters.map((shelter, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{shelter.name}</h3>
                    <Badge
                      variant={
                        shelter.currentStatus === 'open' ? 'success' :
                          shelter.currentStatus === 'full' ? 'warning' : 'destructive'
                      }
                    >
                      {shelter.currentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{shelter.address}</p>
                  <p className="text-sm">Type: {shelter.type}</p>
                  <p className="text-sm">Capacity: {shelter.capacity} people</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FEMA & Financial Assistance */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Disaster Financial Assistance
          </CardTitle>
          <CardDescription>
            FEMA and other financial resources for disaster recovery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {femaAssistance.map((assistance, index) => (
              <AccordionItem key={index} value={`assistance-${index}`}>
                <AccordionTrigger>{assistance.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {assistance.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Steps:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {assistance.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm">{step}</li>
                        ))}
                      </ul>
                    </div>
                    {assistance.links && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Resources:</h4>
                        <div className="space-y-2">
                          {assistance.links.map((link, linkIndex) => (
                            <Button
                              key={linkIndex}
                              variant="outline"
                              className="w-full justify-between"
                              onClick={() => window.open(link.url, "_blank")}
                            >
                              {link.text}
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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

const emergencyGuides = [
  {
    title: "Interactive CPR Training",
    description: "Learn life-saving CPR skills with our interactive guide",
    steps: [
      "Follow the step-by-step instructions",
      "Complete knowledge checks",
      "Track your progress",
      "Earn achievements",
      "Remember: This is for learning only - call 911 in real emergencies"
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

//Missing Component - Placeholder
const Badge = ({ variant, children }) => <span className={`border px-2 py-1 rounded text-sm ${variant === 'success' ? 'bg-green-100 text-green-800 border-green-300' : variant === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-red-100 text-red-800 border-red-300'}`}>{children}</span>;
const ExternalLink = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.44.99-.44 1.43 0l.001.001M2.25 12l8.954 8.955c.44.44.99.44 1.43 0l.001-.001M14.75 6.001a1.5 1.5 0 012.121 0l2.121 2.122a1.5 1.5 0 01-2.12 2.121L12 10.5l-2.62 2.621a1.5 1.5 0 01-2.121-2.12l2.121-2.121z" />
</svg>