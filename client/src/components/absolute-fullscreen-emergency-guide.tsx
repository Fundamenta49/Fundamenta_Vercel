import { useState, useEffect } from "react";
import { PhoneCall, AlertCircle, X, AlertTriangle, LucideIcon, Info, Ambulance, Heart, Bomb, Cloud, RadioTower, Wind, Thermometer, Waves, MapPin, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AbsoluteFullscreenEmergencyGuideProps {
  onClose: () => void;
}

interface EmergencyGuideSection {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  content: React.ReactNode;
}

interface Location {
  city: string;
  state: string;
  country: string;
}

type StateEmergencyLinks = {
  [key: string]: string;
};

const stateEmergencyLinks: StateEmergencyLinks = {
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
  "South Carolina": "https://emd.sc.gov/",
  "South Dakota": "https://dps.sd.gov/emergency-services",
  "Tennessee": "https://www.tn.gov/tema.html",
  "Texas": "https://tdem.texas.gov/",
  "Utah": "https://dem.utah.gov/",
  "Vermont": "https://vem.vermont.gov/",
  "Virginia": "https://www.vaemergency.gov/",
  "Washington": "https://mil.wa.gov/emergency-management-division",
  "West Virginia": "https://emd.wv.gov/",
  "Wisconsin": "https://wem.wi.gov/",
  "Wyoming": "https://hls.wyo.gov/",
  "District of Columbia": "https://hsema.dc.gov/",
  "Puerto Rico": "https://manejodeemergencias.pr.gov/",
  "U.S. Virgin Islands": "https://vitema.vi.gov/",
  "American Samoa": "https://asdhs.gov/",
  "Guam": "https://ghs.guam.gov/",
  "Northern Mariana Islands": "https://cnmihsem.gov.mp/",
}

export default function AbsoluteFullscreenEmergencyGuide({ onClose }: AbsoluteFullscreenEmergencyGuideProps) {
  const isMobile = useIsMobile();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [location, setLocation] = useState<Location>(() => {
    const stored = localStorage.getItem("emergency_location");
    return stored ? JSON.parse(stored) : { city: "", state: "", country: "USA" };
  });
  
  // Save location to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("emergency_location", JSON.stringify(location));
  }, [location]);
  
  const handleLocationChange = (field: keyof Location, value: string) => {
    setLocation(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStateResourceClick = (state: string) => {
    const url = stateEmergencyLinks[state];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
  
  // Add state-specific emergency resources guide
  const guides: EmergencyGuideSection[] = [
    {
      id: "location",
      title: "State Resources",
      icon: MapPin,
      color: "text-purple-500",
      content: (
        <div className="space-y-4">
          <Alert className="mb-4 border-purple-300 bg-purple-50 text-purple-800">
            <MapPin className="h-4 w-4 text-purple-500" />
            <AlertDescription>
              Access emergency resources specific to your state.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={location.city}
                onChange={(e) => handleLocationChange("city", e.target.value)}
                placeholder="Enter your city"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={location.state}
                onValueChange={(value) => handleLocationChange("state", value)}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {Object.keys(stateEmergencyLinks).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {location.state && (
            <Card className="border-purple-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 text-purple-500 mr-2" />
                  {location.state} Emergency Resources
                </CardTitle>
                <CardDescription>
                  Official emergency management resources for {location.state}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full mb-2 justify-between border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                  onClick={() => handleStateResourceClick(location.state)}
                >
                  <span>Visit {location.state} Emergency Management</span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                
                <div className="pt-4 text-sm text-muted-foreground">
                  <p>This site provides official:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Evacuation routes &amp; shelters</li>
                    <li>Local emergency alerts</li>
                    <li>Disaster recovery assistance</li>
                    <li>Emergency preparedness guides</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!location.state && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p>Select your state to view emergency management resources</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: "medical",
      title: "Medical Emergencies",
      icon: Ambulance,
      color: "text-red-500",
      content: (
        <div className="space-y-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              For any life-threatening medical emergency, call 911 (or your local emergency number) immediately!
            </AlertDescription>
          </Alert>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="heart-attack">
              <AccordionTrigger className="hover:bg-red-50">
                <div className="flex items-center text-red-700">
                  <Heart className="h-4 w-4 mr-2" />
                  Heart Attack
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-red-50/50">
                <h4 className="font-medium mb-2">Signs & Symptoms:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Chest pain or discomfort that may feel like pressure, squeezing, fullness, or pain</li>
                  <li>Pain or discomfort in one or both arms, back, neck, jaw, or stomach</li>
                  <li>Shortness of breath</li>
                  <li>Cold sweat, nausea, or lightheadedness</li>
                </ul>
                
                <h4 className="font-medium mb-2">What to Do:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Call 911 immediately</li>
                  <li>Have the person sit or lie down in a comfortable position</li>
                  <li>Loosen any tight clothing</li>
                  <li>If the person is not allergic to aspirin, have them chew and swallow a baby aspirin (if available)</li>
                  <li>Stay with the person until emergency medical help arrives</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="stroke">
              <AccordionTrigger className="hover:bg-red-50">
                <div className="flex items-center text-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Stroke
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-red-50/50">
                <h4 className="font-medium mb-2">Remember "FAST" to identify a stroke:</h4>
                <ul className="space-y-2 mb-3">
                  <li className="flex items-start">
                    <span className="font-bold text-red-600 mr-2">F:</span>
                    <div>
                      <span className="font-medium">Face Drooping</span>
                      <p className="text-sm">Does one side of the face droop or is it numb?</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-red-600 mr-2">A:</span>
                    <div>
                      <span className="font-medium">Arm Weakness</span>
                      <p className="text-sm">Is one arm weak or numb? Does one arm drift downward when both arms are raised?</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-red-600 mr-2">S:</span>
                    <div>
                      <span className="font-medium">Speech Difficulty</span>
                      <p className="text-sm">Is speech slurred? Is the person unable to speak or hard to understand?</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-red-600 mr-2">T:</span>
                    <div>
                      <span className="font-medium">Time to call 911</span>
                      <p className="text-sm">If someone shows any of these symptoms, call 911 immediately.</p>
                    </div>
                  </li>
                </ul>
                
                <h4 className="font-medium mb-2">What to Do:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Call 911 right away</li>
                  <li>Note the time when symptoms first appeared</li>
                  <li>Do not give the person anything to eat or drink</li>
                  <li>Have the person lie down with their head slightly elevated</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="choking">
              <AccordionTrigger className="hover:bg-red-50">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Choking
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-red-50/50">
                <h4 className="font-medium mb-2">Signs of Choking:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Inability to talk, cough, or breathe</li>
                  <li>Making high-pitched noises or no sound</li>
                  <li>Face turning blue</li>
                  <li>Grabbing at throat</li>
                </ul>
                
                <h4 className="font-medium mb-2">How to Help - Heimlich Maneuver:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Stand behind the person and wrap your arms around their waist</li>
                  <li>Make a fist with one hand and place it just above the person's navel (belly button)</li>
                  <li>Grab your fist with your other hand</li>
                  <li>Press into the abdomen with quick, upward thrusts</li>
                  <li>Repeat until the object is expelled or the person becomes unconscious</li>
                  <li>If the person becomes unconscious, lower them to the ground and call 911</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="severe-bleeding">
              <AccordionTrigger className="hover:bg-red-50">
                <div className="flex items-center text-red-700">
                  <Info className="h-4 w-4 mr-2" />
                  Severe Bleeding
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-red-50/50">
                <h4 className="font-medium mb-2">What to Do:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Call 911 for severe bleeding</li>
                  <li>Apply direct pressure to the wound using a clean cloth, bandage, or your hand if nothing else is available</li>
                  <li>Maintain pressure until help arrives</li>
                  <li>If blood soaks through, add more material on top (do not remove the first layer)</li>
                  <li>If possible, elevate the injured area above the heart</li>
                  <li>Do not apply a tourniquet unless you have proper training</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )
    },
    {
      id: "natural",
      title: "Natural Disasters",
      icon: Wind,
      color: "text-blue-500",
      content: (
        <div className="space-y-4">
          <Alert className="mb-4 border-blue-300 bg-blue-50 text-blue-800">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Monitor local weather alerts and follow evacuation orders from authorities.
            </AlertDescription>
          </Alert>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="tornado">
              <AccordionTrigger className="hover:bg-blue-50">
                <div className="flex items-center text-blue-700">
                  <Cloud className="h-4 w-4 mr-2" />
                  Tornado
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-blue-50/50">
                <h4 className="font-medium mb-2">Warning Signs:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Dark, often greenish sky</li>
                  <li>Large hail</li>
                  <li>Low-lying, rotating cloud</li>
                  <li>Loud roar (similar to a freight train)</li>
                </ul>
                
                <h4 className="font-medium mb-2">What to Do:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>If indoors:</strong> Go to a basement, storm cellar, or interior room without windows (bathroom, closet, hallway)</li>
                  <li>Get under a sturdy piece of furniture and protect your head</li>
                  <li><strong>If in a vehicle:</strong> Do not try to outrun a tornado. Get out and find shelter in a nearby building, or lie flat in a ditch away from vehicles</li>
                  <li><strong>If outside:</strong> Lie flat in a ditch or depression and cover your head</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="hurricane">
              <AccordionTrigger className="hover:bg-blue-50">
                <div className="flex items-center text-blue-700">
                  <Wind className="h-4 w-4 mr-2" />
                  Hurricane
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-blue-50/50">
                <h4 className="font-medium mb-2">Before a Hurricane:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Create an emergency plan and evacuation route</li>
                  <li>Secure your home (board up windows, secure outdoor items)</li>
                  <li>Prepare an emergency kit with water, non-perishable food, medications, etc.</li>
                  <li>Charge all devices and have a battery-powered radio</li>
                </ul>
                
                <h4 className="font-medium mb-2">During a Hurricane:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Follow evacuation orders if given</li>
                  <li>If not evacuating, stay indoors and away from windows</li>
                  <li>Turn refrigerator to coldest setting in case of power loss</li>
                  <li>Fill bathtubs and containers with water</li>
                  <li>Prepare for power outages and flooding</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="flood">
              <AccordionTrigger className="hover:bg-blue-50">
                <div className="flex items-center text-blue-700">
                  <Waves className="h-4 w-4 mr-2" />
                  Flood
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-blue-50/50">
                <h4 className="font-medium mb-2">During a Flood:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Move to higher ground immediately</li>
                  <li>Do not walk, swim, or drive through flood waters</li>
                  <li>Stay off bridges over fast-moving water</li>
                  <li>Evacuate if told to do so</li>
                </ul>
                
                <div className="bg-red-50 p-3 rounded-md border border-red-200 my-2">
                  <p className="text-sm font-medium text-red-800 mb-1">Remember:</p>
                  <p className="text-sm text-red-700">Just 6 inches of moving water can knock you down, and 1 foot of water can sweep your vehicle away.</p>
                </div>
                
                <h4 className="font-medium mb-2">After a Flood:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Return home only when authorities say it's safe</li>
                  <li>Avoid driving except in emergencies</li>
                  <li>Be aware of areas where floodwaters have receded and watch for debris</li>
                  <li>Do not touch electrical equipment if wet or standing in water</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="earthquake">
              <AccordionTrigger className="hover:bg-blue-50">
                <div className="flex items-center text-blue-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Earthquake
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-blue-50/50">
                <h4 className="font-medium mb-2">During an Earthquake:</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                  <p className="font-medium text-amber-800">Drop, Cover, and Hold On:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700 mt-1">
                    <li><strong>DROP</strong> to the ground</li>
                    <li><strong>COVER</strong> by getting under a sturdy desk or table</li>
                    <li><strong>HOLD ON</strong> until the shaking stops</li>
                  </ul>
                </div>
                
                <h4 className="font-medium mb-2">If Indoors:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Stay away from windows, outside doors, and walls</li>
                  <li>Do NOT run outside</li>
                  <li>If in bed, stay there and protect your head with a pillow</li>
                </ul>
                
                <h4 className="font-medium mb-2">If Outdoors:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Stay in the open until the shaking stops</li>
                  <li>Move away from buildings, streetlights, and utility wires</li>
                  <li>If in a vehicle, stop in a clear area away from buildings, trees, and overpasses</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )
    },
    {
      id: "other",
      title: "Other Emergencies",
      icon: AlertTriangle,
      color: "text-amber-500",
      content: (
        <div className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="power-outage">
              <AccordionTrigger className="hover:bg-amber-50">
                <div className="flex items-center text-amber-700">
                  <RadioTower className="h-4 w-4 mr-2" />
                  Power Outage
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-amber-50/50">
                <h4 className="font-medium mb-2">What to Do:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Keep refrigerators and freezers closed to maintain cold temperatures</li>
                  <li>Use flashlights, not candles, to avoid fire hazards</li>
                  <li>Turn off or disconnect appliances to avoid damage from power surges</li>
                  <li>Have backup charging methods for phones and keep them charged</li>
                  <li>Check on elderly neighbors or those with medical needs</li>
                </ul>
                
                <h4 className="font-medium mb-2">Food Safety During Outages:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Keep refrigerator doors closed (food stays safe for about 4 hours)</li>
                  <li>A full freezer will hold temperature for about 48 hours if unopened</li>
                  <li>Use a food thermometer to check temperatures - discard food above 40°F</li>
                  <li>Never taste food to determine safety</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="gas-leak">
              <AccordionTrigger className="hover:bg-amber-50">
                <div className="flex items-center text-amber-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Gas Leak
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-amber-50/50">
                <h4 className="font-medium mb-2">Signs of a Gas Leak:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Smell of rotten eggs or sulfur</li>
                  <li>Hissing sound near gas lines</li>
                  <li>Dead or dying vegetation near gas lines</li>
                  <li>Feeling dizzy, nauseous, or fatigued for no apparent reason</li>
                </ul>
                
                <div className="bg-red-50 p-3 rounded-md border border-red-200 my-2">
                  <p className="text-sm font-medium text-red-800">If you suspect a gas leak:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-red-700 mt-1">
                    <li>Leave the area immediately - don't use phones or light switches inside</li>
                    <li>Don't smoke, light matches, or create any flames</li>
                    <li>Don't turn appliances or light switches on or off</li>
                    <li>Call the gas company from a safe location</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="carbon-monoxide">
              <AccordionTrigger className="hover:bg-amber-50">
                <div className="flex items-center text-amber-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Carbon Monoxide Poisoning
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-amber-50/50">
                <h4 className="font-medium mb-2">Symptoms:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Headache</li>
                  <li>Dizziness</li>
                  <li>Weakness</li>
                  <li>Nausea or vomiting</li>
                  <li>Chest pain</li>
                  <li>Confusion</li>
                </ul>
                
                <h4 className="font-medium mb-2">What to Do:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Get fresh air immediately</li>
                  <li>Turn off potential sources (furnace, gas stove, etc.)</li>
                  <li>Leave the building and call 911</li>
                  <li>Do not re-enter until emergency responders say it's safe</li>
                  <li>Get medical attention immediately - CO poisoning can be fatal</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="extreme-heat">
              <AccordionTrigger className="hover:bg-amber-50">
                <div className="flex items-center text-amber-700">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Extreme Heat
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-amber-50/50">
                <h4 className="font-medium mb-2">Prevention:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Stay in air-conditioned places when possible</li>
                  <li>Drink plenty of fluids, even if not thirsty</li>
                  <li>Wear lightweight, light-colored, loose-fitting clothing</li>
                  <li>Take cool showers or baths</li>
                  <li>Avoid outdoor activities during the hottest parts of the day</li>
                </ul>
                
                <h4 className="font-medium mb-2">Heat-Related Illnesses:</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-amber-800">Heat Exhaustion Symptoms:</p>
                    <ul className="list-disc pl-5 space-y-0.5">
                      <li>Heavy sweating</li>
                      <li>Cold, pale, clammy skin</li>
                      <li>Fast, weak pulse</li>
                      <li>Nausea or vomiting</li>
                      <li>Muscle cramps</li>
                      <li>Weakness or fatigue</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-red-800">Heat Stroke Symptoms (medical emergency):</p>
                    <ul className="list-disc pl-5 space-y-0.5">
                      <li>High body temperature (103°F or higher)</li>
                      <li>Hot, red, dry skin</li>
                      <li>Fast, strong pulse</li>
                      <li>Headache</li>
                      <li>Dizziness</li>
                      <li>Confusion or unconsciousness</li>
                    </ul>
                    <p className="mt-1 text-red-700 font-medium">Call 911 immediately for suspected heat stroke!</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )
    },
  ];
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Emergency Guides</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Main content area with padding and scroll */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            In any emergency situation, if you need immediate help, call 911 (or your local emergency number).
          </AlertDescription>
        </Alert>
        
        {selectedGuide ? (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 text-red-700 mr-4"
                onClick={() => setSelectedGuide(null)}
              >
                ← Back to All Guides
              </Button>
              <h3 className="text-lg font-semibold">
                {guides.find(g => g.id === selectedGuide)?.title}
              </h3>
            </div>
            
            {guides.find(g => g.id === selectedGuide)?.content}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <Card 
                key={guide.id} 
                className="border-gray-200 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedGuide(guide.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <guide.icon className={`h-5 w-5 mr-2 ${guide.color}`} />
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base min-h-[80px]">
                    {guide.id === "medical" && "Learn how to respond to common medical emergencies like heart attacks, strokes, and severe bleeding."}
                    {guide.id === "natural" && "Be prepared for earthquakes, floods, hurricanes, and other natural disasters with these step-by-step guides."}
                    {guide.id === "other" && "Find information on handling power outages, gas leaks, carbon monoxide poisoning, and extreme weather."}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full border-red-200 text-red-700 hover:bg-red-50"
                  >
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}