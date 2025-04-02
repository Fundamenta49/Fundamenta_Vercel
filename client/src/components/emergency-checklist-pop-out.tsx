import { AlertCircle, CheckCircle2, ClipboardList, AlertTriangle, Zap } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ChecklistItem = {
  text: string;
  critical?: boolean;
};

type EmergencyChecklist = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  beforeItems: ChecklistItem[];
  duringItems: ChecklistItem[];
  afterItems: ChecklistItem[];
};

const CHECKLISTS: EmergencyChecklist[] = [
  {
    id: "natural-disaster",
    title: "Natural Disasters",
    icon: <Zap className="h-5 w-5 text-red-500" />,
    description: "Preparation and response for hurricanes, floods, earthquakes, and wildfires",
    beforeItems: [
      { text: "Create an emergency plan with your family", critical: true },
      { text: "Prepare an emergency kit with supplies for 3 days", critical: true },
      { text: "Store important documents in waterproof containers" },
      { text: "Know evacuation routes and meeting places", critical: true },
      { text: "Keep emergency contacts list updated" },
      { text: "Install smoke detectors and carbon monoxide alarms" },
      { text: "Secure furniture and appliances to prevent tipping" }
    ],
    duringItems: [
      { text: "Stay informed via emergency broadcasts", critical: true },
      { text: "Follow evacuation orders immediately", critical: true },
      { text: "Stay away from windows and exterior walls during storms" },
      { text: "Turn off utilities if instructed to do so", critical: true },
      { text: "Move to higher ground during floods" },
      { text: "During an earthquake, drop, cover, and hold on" }
    ],
    afterItems: [
      { text: "Check for injuries and provide first aid", critical: true },
      { text: "Inspect home for damage before re-entering" },
      { text: "Document damage for insurance claims" },
      { text: "Avoid downed power lines", critical: true },
      { text: "Clean and disinfect everything that got wet after floods" },
      { text: "Watch for hazards like broken glass and debris" }
    ]
  },
  {
    id: "medical",
    title: "Medical Emergencies",
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    description: "How to respond to serious injuries, cardiac events, and other medical crises",
    beforeItems: [
      { text: "Learn CPR and basic first aid", critical: true },
      { text: "Keep a well-stocked first aid kit at home and in your car", critical: true },
      { text: "Create a list of emergency contacts", critical: true },
      { text: "Know the location of nearby emergency rooms" },
      { text: "Keep a list of current medications and allergies" },
      { text: "Have medical insurance information readily available" }
    ],
    duringItems: [
      { text: "Call 911 or local emergency services immediately", critical: true },
      { text: "Stay calm and follow dispatcher instructions", critical: true },
      { text: "For cardiac arrest, begin CPR if trained", critical: true },
      { text: "For choking, perform the Heimlich maneuver" },
      { text: "For severe bleeding, apply direct pressure", critical: true },
      { text: "For seizures, protect from injury but don't restrain", critical: true }
    ],
    afterItems: [
      { text: "Follow up with appropriate medical care" },
      { text: "Restock used first aid supplies" },
      { text: "Update emergency contacts if needed" },
      { text: "Consider getting additional first aid training" },
      { text: "Document the incident for medical records" }
    ]
  },
  {
    id: "home",
    title: "Home Emergencies",
    icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    description: "Handling fires, gas leaks, power outages, and carbon monoxide",
    beforeItems: [
      { text: "Install smoke and carbon monoxide detectors on every level", critical: true },
      { text: "Keep fire extinguishers accessible", critical: true },
      { text: "Know where main utility shutoffs are located", critical: true },
      { text: "Practice home evacuation routes with family" },
      { text: "Store emergency lighting in accessible locations" },
      { text: "Secure water heaters and large appliances" }
    ],
    duringItems: [
      { text: "For fires: Get out, stay out, call 911", critical: true },
      { text: "For gas leaks: Don't use electrical switches, evacuate, call utility company", critical: true },
      { text: "For CO alarm: Evacuate immediately, call 911", critical: true },
      { text: "For power outages: Use flashlights instead of candles" },
      { text: "For flooding: Turn off electricity at the main breaker", critical: true },
      { text: "For intruders: Get to a safe location and call 911" }
    ],
    afterItems: [
      { text: "After a fire: Don't re-enter until authorities permit", critical: true },
      { text: "After gas leak: Have professional inspection before returning", critical: true },
      { text: "After flooding: Check for structural damage" },
      { text: "Replace batteries in smoke detectors annually" },
      { text: "Update home emergency plan as needed" }
    ]
  },
  {
    id: "vehicle",
    title: "Vehicle Emergencies",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    description: "Handling breakdowns, accidents, and getting stranded",
    beforeItems: [
      { text: "Keep an emergency kit in your vehicle", critical: true },
      { text: "Maintain regular vehicle service schedule" },
      { text: "Keep at least half a tank of gas at all times" },
      { text: "Store jumper cables, basic tools, and spare tire" },
      { text: "Have roadside assistance contact information available" },
      { text: "Keep seasonal supplies (ice scraper, sunshade)" }
    ],
    duringItems: [
      { text: "For accidents: Move to safety if possible, call 911", critical: true },
      { text: "For breakdowns: Pull completely off the road if possible", critical: true },
      { text: "Turn on hazard lights and use flares/reflectors", critical: true },
      { text: "Stay in vehicle if in unsafe area or severe weather" },
      { text: "For flooding: Abandon vehicle if water is rising", critical: true },
      { text: "Never exit vehicle on a busy highway except in emergency" }
    ],
    afterItems: [
      { text: "Exchange information with other drivers in accidents", critical: true },
      { text: "Document damage with photographs" },
      { text: "Report accidents to police and insurance" },
      { text: "Arrange for vehicle towing if needed" },
      { text: "Have vehicle inspected before driving after major repairs" }
    ]
  }
];

export default function EmergencyChecklistPopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-red-500" />
          Emergency Checklists
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Preparation steps and procedures for common emergency situations
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).
            These checklists provide general preparation guidelines and should not delay seeking professional help.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CHECKLISTS.map((checklist) => (
            <Card key={checklist.id} className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {checklist.icon}
                  {checklist.title}
                </CardTitle>
                <CardDescription>{checklist.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="before">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="before">Before</TabsTrigger>
                    <TabsTrigger value="during">During</TabsTrigger>
                    <TabsTrigger value="after">After</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="before" className="space-y-2">
                    {checklist.beforeItems.map((item, index) => (
                      <div key={index} className={cn(
                        "flex items-start gap-2 p-2 rounded-md",
                        item.critical ? "bg-red-50" : ""
                      )}>
                        <CheckCircle2 className={cn(
                          "h-5 w-5 flex-shrink-0 mt-0.5",
                          item.critical ? "text-red-500" : "text-green-500"
                        )} />
                        <div>
                          <p className="text-sm">{item.text}</p>
                          {item.critical && (
                            <Badge variant="outline" className="text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                              Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="during" className="space-y-2">
                    {checklist.duringItems.map((item, index) => (
                      <div key={index} className={cn(
                        "flex items-start gap-2 p-2 rounded-md",
                        item.critical ? "bg-red-50" : ""
                      )}>
                        <CheckCircle2 className={cn(
                          "h-5 w-5 flex-shrink-0 mt-0.5",
                          item.critical ? "text-red-500" : "text-green-500"
                        )} />
                        <div>
                          <p className="text-sm">{item.text}</p>
                          {item.critical && (
                            <Badge variant="outline" className="text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                              Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="after" className="space-y-2">
                    {checklist.afterItems.map((item, index) => (
                      <div key={index} className={cn(
                        "flex items-start gap-2 p-2 rounded-md",
                        item.critical ? "bg-red-50" : ""
                      )}>
                        <CheckCircle2 className={cn(
                          "h-5 w-5 flex-shrink-0 mt-0.5",
                          item.critical ? "text-red-500" : "text-green-500"
                        )} />
                        <div>
                          <p className="text-sm">{item.text}</p>
                          {item.critical && (
                            <Badge variant="outline" className="text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                              Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </FullScreenDialogBody>
    </div>
  );
}