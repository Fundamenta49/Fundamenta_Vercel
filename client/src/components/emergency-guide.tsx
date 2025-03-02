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
import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Navigation, Cloud, Shield, BriefcaseMedical, Home, DollarSign, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

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

// Mock data for different cities
const cityEmergencyData: Record<string, { shelters: Shelter[], alerts: WeatherAlert[] }> = {
  "cincinnati": {
    shelters: [
      {
        name: "Duke Energy Convention Center",
        address: "525 Elm St, Cincinnati, OH 45202",
        type: "Emergency Shelter",
        capacity: 500,
        currentStatus: "open"
      },
      {
        name: "University of Cincinnati Fifth Third Arena",
        address: "2700 O'Varsity Way, Cincinnati, OH 45221",
        type: "Emergency Shelter",
        capacity: 400,
        currentStatus: "open"
      },
      {
        name: "Hamilton County Emergency Operations Center",
        address: "2000 Radcliff Dr, Cincinnati, OH 45204",
        type: "Operations Center",
        capacity: 200,
        currentStatus: "open"
      }
    ],
    alerts: [
      {
        type: "River Flood Watch",
        severity: "medium",
        description: "Ohio River water levels rising due to recent rainfall",
        instructions: "Monitor local news and be prepared for possible evacuation in low-lying areas."
      },
      {
        type: "Severe Weather Alert",
        severity: "high",
        description: "Potential for severe thunderstorms with high winds",
        instructions: "Stay indoors and away from windows. Keep emergency supplies ready."
      }
    ]
  },
  "miami": {
    shelters: [
      {
        name: "Miami-Dade County Fair & Exposition",
        address: "10901 SW 24th St, Miami, FL 33165",
        type: "Hurricane Shelter",
        capacity: 800,
        currentStatus: "open"
      },
      {
        name: "Florida International University Arena",
        address: "11200 SW 8th St, Miami, FL 33199",
        type: "Emergency Shelter",
        capacity: 600,
        currentStatus: "open"
      }
    ],
    alerts: [
      {
        type: "Hurricane Watch",
        severity: "high",
        description: "Tropical storm system approaching Southeast Florida",
        instructions: "Review evacuation plans and prepare emergency supplies. Monitor local news for updates."
      }
    ]
  },
  "los angeles": {
    shelters: [
      {
        name: "LA Convention Center",
        address: "1201 S Figueroa St, Los Angeles, CA 90015",
        type: "Emergency Shelter",
        capacity: 1000,
        currentStatus: "open"
      }
    ],
    alerts: [
      {
        type: "Heat Advisory",
        severity: "medium",
        description: "Excessive heat warning for LA County",
        instructions: "Stay hydrated and avoid outdoor activities during peak hours."
      },
      {
        type: "Air Quality Alert",
        severity: "medium",
        description: "Unhealthy air quality levels in parts of Los Angeles",
        instructions: "Sensitive groups should limit outdoor exposure."
      }
    ]
  }
};

// State emergency management links
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

  const updateEmergencyData = (city: string) => {
    const normalizedCity = city.trim().toLowerCase(); // Normalize to lowercase for case-insensitive matching
    const cityData = cityEmergencyData[normalizedCity];
    if (cityData) {
      setWeatherAlerts(cityData.alerts);
      setNearbyShelters(cityData.shelters);
    } else {
      setWeatherAlerts([{
        type: "Location Notice",
        severity: "low",
        description: `We don't have specific emergency data for ${city} yet`,
        instructions: "Please check your local emergency management website for the most up-to-date information."
      }]);
      setNearbyShelters([]);
    }
  };

  useEffect(() => {
    if (location.city) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
        updateEmergencyData(location.city);
      } catch (error) {
        console.error("Error saving location to local storage:", error);
        // Consider adding a user-friendly alert here to inform the user about the storage failure.
      }
    }
  }, [location]);

  const handleLocationSubmit = () => {
    setIsEditing(false);
    updateEmergencyData(location.city);
  };

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
              {(!cityEmergencyData[location.city.toLowerCase()]) && (
                <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    We're currently expanding our emergency database for {location.city}.
                    Please refer to your state's emergency management website for the most up-to-date information.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Weather & Disaster Alerts */}
      {location.city && weatherAlerts.length > 0 && (
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

      {/* Nearby Shelters */}
      {location.city && nearbyShelters.length > 0 && (
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
                        shelter.currentStatus === 'open' ? 'default' :
                          shelter.currentStatus === 'full' ? 'secondary' : 'destructive'
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

      {/* National Emergency Resources */}
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