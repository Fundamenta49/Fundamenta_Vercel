import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, ClipboardList, AlertTriangle, Zap, Plus, X, Save, Trash2 } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type ChecklistItem = {
  id: string;
  text: string;
  critical?: boolean;
  completed: boolean;
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

// Generate unique IDs for checklist items
const generateId = (prefix: string, index: number) => `${prefix}-${index}`;

const createBaseChecklists = (): EmergencyChecklist[] => [
  {
    id: "natural-disaster",
    title: "Natural Disasters",
    icon: <Zap className="h-5 w-5 text-red-500" />,
    description: "Preparation and response for hurricanes, floods, earthquakes, and wildfires",
    beforeItems: [
      { id: generateId("natural-before", 0), text: "Create an emergency plan with your family", critical: true, completed: false },
      { id: generateId("natural-before", 1), text: "Prepare an emergency kit with supplies for 3 days", critical: true, completed: false },
      { id: generateId("natural-before", 2), text: "Store important documents in waterproof containers", completed: false },
      { id: generateId("natural-before", 3), text: "Know evacuation routes and meeting places", critical: true, completed: false },
      { id: generateId("natural-before", 4), text: "Keep emergency contacts list updated", completed: false },
      { id: generateId("natural-before", 5), text: "Install smoke detectors and carbon monoxide alarms", completed: false },
      { id: generateId("natural-before", 6), text: "Secure furniture and appliances to prevent tipping", completed: false }
    ],
    duringItems: [
      { id: generateId("natural-during", 0), text: "Stay informed via emergency broadcasts", critical: true, completed: false },
      { id: generateId("natural-during", 1), text: "Follow evacuation orders immediately", critical: true, completed: false },
      { id: generateId("natural-during", 2), text: "Stay away from windows and exterior walls during storms", completed: false },
      { id: generateId("natural-during", 3), text: "Turn off utilities if instructed to do so", critical: true, completed: false },
      { id: generateId("natural-during", 4), text: "Move to higher ground during floods", completed: false },
      { id: generateId("natural-during", 5), text: "During an earthquake, drop, cover, and hold on", completed: false }
    ],
    afterItems: [
      { id: generateId("natural-after", 0), text: "Check for injuries and provide first aid", critical: true, completed: false },
      { id: generateId("natural-after", 1), text: "Inspect home for damage before re-entering", completed: false },
      { id: generateId("natural-after", 2), text: "Document damage for insurance claims", completed: false },
      { id: generateId("natural-after", 3), text: "Avoid downed power lines", critical: true, completed: false },
      { id: generateId("natural-after", 4), text: "Clean and disinfect everything that got wet after floods", completed: false },
      { id: generateId("natural-after", 5), text: "Watch for hazards like broken glass and debris", completed: false }
    ]
  },
  {
    id: "medical",
    title: "Medical Emergencies",
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    description: "How to respond to serious injuries, cardiac events, and other medical crises",
    beforeItems: [
      { id: generateId("medical-before", 0), text: "Learn CPR and basic first aid", critical: true, completed: false },
      { id: generateId("medical-before", 1), text: "Keep a well-stocked first aid kit at home and in your car", critical: true, completed: false },
      { id: generateId("medical-before", 2), text: "Create a list of emergency contacts", critical: true, completed: false },
      { id: generateId("medical-before", 3), text: "Know the location of nearby emergency rooms", completed: false },
      { id: generateId("medical-before", 4), text: "Keep a list of current medications and allergies", completed: false },
      { id: generateId("medical-before", 5), text: "Have medical insurance information readily available", completed: false }
    ],
    duringItems: [
      { id: generateId("medical-during", 0), text: "Call 911 or local emergency services immediately", critical: true, completed: false },
      { id: generateId("medical-during", 1), text: "Stay calm and follow dispatcher instructions", critical: true, completed: false },
      { id: generateId("medical-during", 2), text: "For cardiac arrest, begin CPR if trained", critical: true, completed: false },
      { id: generateId("medical-during", 3), text: "For choking, perform the Heimlich maneuver", completed: false },
      { id: generateId("medical-during", 4), text: "For severe bleeding, apply direct pressure", critical: true, completed: false },
      { id: generateId("medical-during", 5), text: "For seizures, protect from injury but don't restrain", critical: true, completed: false }
    ],
    afterItems: [
      { id: generateId("medical-after", 0), text: "Follow up with appropriate medical care", completed: false },
      { id: generateId("medical-after", 1), text: "Restock used first aid supplies", completed: false },
      { id: generateId("medical-after", 2), text: "Update emergency contacts if needed", completed: false },
      { id: generateId("medical-after", 3), text: "Consider getting additional first aid training", completed: false },
      { id: generateId("medical-after", 4), text: "Document the incident for medical records", completed: false }
    ]
  },
  {
    id: "home",
    title: "Home Emergencies",
    icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    description: "Handling fires, gas leaks, power outages, and carbon monoxide",
    beforeItems: [
      { id: generateId("home-before", 0), text: "Install smoke and carbon monoxide detectors on every level", critical: true, completed: false },
      { id: generateId("home-before", 1), text: "Keep fire extinguishers accessible", critical: true, completed: false },
      { id: generateId("home-before", 2), text: "Know where main utility shutoffs are located", critical: true, completed: false },
      { id: generateId("home-before", 3), text: "Practice home evacuation routes with family", completed: false },
      { id: generateId("home-before", 4), text: "Store emergency lighting in accessible locations", completed: false },
      { id: generateId("home-before", 5), text: "Secure water heaters and large appliances", completed: false }
    ],
    duringItems: [
      { id: generateId("home-during", 0), text: "For fires: Get out, stay out, call 911", critical: true, completed: false },
      { id: generateId("home-during", 1), text: "For gas leaks: Don't use electrical switches, evacuate, call utility company", critical: true, completed: false },
      { id: generateId("home-during", 2), text: "For CO alarm: Evacuate immediately, call 911", critical: true, completed: false },
      { id: generateId("home-during", 3), text: "For power outages: Use flashlights instead of candles", completed: false },
      { id: generateId("home-during", 4), text: "For flooding: Turn off electricity at the main breaker", critical: true, completed: false },
      { id: generateId("home-during", 5), text: "For intruders: Get to a safe location and call 911", completed: false }
    ],
    afterItems: [
      { id: generateId("home-after", 0), text: "After a fire: Don't re-enter until authorities permit", critical: true, completed: false },
      { id: generateId("home-after", 1), text: "After gas leak: Have professional inspection before returning", critical: true, completed: false },
      { id: generateId("home-after", 2), text: "After flooding: Check for structural damage", completed: false },
      { id: generateId("home-after", 3), text: "Replace batteries in smoke detectors annually", completed: false },
      { id: generateId("home-after", 4), text: "Update home emergency plan as needed", completed: false }
    ]
  },
  {
    id: "vehicle",
    title: "Vehicle Emergencies",
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    description: "Handling breakdowns, accidents, and getting stranded",
    beforeItems: [
      { id: generateId("vehicle-before", 0), text: "Keep an emergency kit in your vehicle", critical: true, completed: false },
      { id: generateId("vehicle-before", 1), text: "Maintain regular vehicle service schedule", completed: false },
      { id: generateId("vehicle-before", 2), text: "Keep at least half a tank of gas at all times", completed: false },
      { id: generateId("vehicle-before", 3), text: "Store jumper cables, basic tools, and spare tire", completed: false },
      { id: generateId("vehicle-before", 4), text: "Have roadside assistance contact information available", completed: false },
      { id: generateId("vehicle-before", 5), text: "Keep seasonal supplies (ice scraper, sunshade)", completed: false }
    ],
    duringItems: [
      { id: generateId("vehicle-during", 0), text: "For accidents: Move to safety if possible, call 911", critical: true, completed: false },
      { id: generateId("vehicle-during", 1), text: "For breakdowns: Pull completely off the road if possible", critical: true, completed: false },
      { id: generateId("vehicle-during", 2), text: "Turn on hazard lights and use flares/reflectors", critical: true, completed: false },
      { id: generateId("vehicle-during", 3), text: "Stay in vehicle if in unsafe area or severe weather", completed: false },
      { id: generateId("vehicle-during", 4), text: "For flooding: Abandon vehicle if water is rising", critical: true, completed: false },
      { id: generateId("vehicle-during", 5), text: "Never exit vehicle on a busy highway except in emergency", completed: false }
    ],
    afterItems: [
      { id: generateId("vehicle-after", 0), text: "Exchange information with other drivers in accidents", critical: true, completed: false },
      { id: generateId("vehicle-after", 1), text: "Document damage with photographs", completed: false },
      { id: generateId("vehicle-after", 2), text: "Report accidents to police and insurance", completed: false },
      { id: generateId("vehicle-after", 3), text: "Arrange for vehicle towing if needed", completed: false },
      { id: generateId("vehicle-after", 4), text: "Have vehicle inspected before driving after major repairs", completed: false }
    ]
  }
];

// Initialize checklists
const CHECKLISTS: EmergencyChecklist[] = createBaseChecklists();

export default function EmergencyChecklistPopOut() {
  // State for user-editable checklists
  const [checklists, setChecklists] = useState<EmergencyChecklist[]>(() => {
    const savedChecklists = localStorage.getItem('emergency_checklists');
    return savedChecklists ? JSON.parse(savedChecklists) : createBaseChecklists();
  });

  // State for adding new checklist item
  const [newItemText, setNewItemText] = useState("");
  const [newItemCritical, setNewItemCritical] = useState(false);
  const [activeDialog, setActiveDialog] = useState<{
    checklistId: string;
    phase: "before" | "during" | "after";
  } | null>(null);
  
  // Progress tracking
  const [progress, setProgress] = useState<Record<string, Record<string, number>>>({});

  // Calculate progress for each checklist and phase
  useEffect(() => {
    const newProgress: Record<string, Record<string, number>> = {};
    
    checklists.forEach(checklist => {
      newProgress[checklist.id] = {
        before: calculatePhaseProgress(checklist.beforeItems),
        during: calculatePhaseProgress(checklist.duringItems),
        after: calculatePhaseProgress(checklist.afterItems),
        total: calculateTotalProgress(checklist)
      };
    });
    
    setProgress(newProgress);
    
    // Save to local storage
    localStorage.setItem('emergency_checklists', JSON.stringify(checklists));
  }, [checklists]);

  // Helper to calculate progress percentage
  const calculatePhaseProgress = (items: ChecklistItem[]): number => {
    if (items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed).length;
    return Math.round((completedItems / items.length) * 100);
  };

  // Calculate total progress across all phases
  const calculateTotalProgress = (checklist: EmergencyChecklist): number => {
    const allItems = [...checklist.beforeItems, ...checklist.duringItems, ...checklist.afterItems];
    return calculatePhaseProgress(allItems);
  };

  // Toggle the completion status of a checklist item
  const toggleItemCompletion = (
    checklistId: string, 
    phase: "beforeItems" | "duringItems" | "afterItems", 
    itemId: string
  ) => {
    setChecklists(prevChecklists => 
      prevChecklists.map(checklist => 
        checklist.id === checklistId 
          ? {
              ...checklist,
              [phase]: checklist[phase].map(item => 
                item.id === itemId 
                  ? { ...item, completed: !item.completed } 
                  : item
              )
            }
          : checklist
      )
    );
  };

  // Add a new item to a checklist
  const addNewItem = () => {
    if (!activeDialog || !newItemText.trim()) return;
    
    const { checklistId, phase } = activeDialog;
    const phaseKey = `${phase}Items` as "beforeItems" | "duringItems" | "afterItems";
    
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      critical: newItemCritical,
      completed: false
    };
    
    setChecklists(prevChecklists => 
      prevChecklists.map(checklist => 
        checklist.id === checklistId 
          ? {
              ...checklist,
              [phaseKey]: [...checklist[phaseKey], newItem]
            }
          : checklist
      )
    );
    
    // Clear the form
    setNewItemText("");
    setNewItemCritical(false);
    setActiveDialog(null);
  };

  // Delete a checklist item
  const deleteItem = (
    checklistId: string, 
    phase: "beforeItems" | "duringItems" | "afterItems", 
    itemId: string
  ) => {
    setChecklists(prevChecklists => 
      prevChecklists.map(checklist => 
        checklist.id === checklistId 
          ? {
              ...checklist,
              [phase]: checklist[phase].filter(item => item.id !== itemId)
            }
          : checklist
      )
    );
  };

  // Reset all checklists to defaults
  const resetAllChecklists = () => {
    if (confirm("Are you sure you want to reset all checklists to their default state? This will remove all custom items and completion status.")) {
      setChecklists(createBaseChecklists());
    }
  };

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
        
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetAllChecklists}
            className="text-xs"
          >
            Reset All Checklists
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {checklists.map((checklist) => (
            <Card key={checklist.id} className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {checklist.icon}
                    {checklist.title}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {progress[checklist.id]?.total || 0}% Complete
                  </Badge>
                </CardTitle>
                <CardDescription>{checklist.description}</CardDescription>
                <Progress 
                  value={progress[checklist.id]?.total || 0} 
                  className="h-2 mt-2"
                />
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="before">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="before">
                      Before <Badge variant="outline" className="ml-1">{progress[checklist.id]?.before || 0}%</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="during">
                      During <Badge variant="outline" className="ml-1">{progress[checklist.id]?.during || 0}%</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="after">
                      After <Badge variant="outline" className="ml-1">{progress[checklist.id]?.after || 0}%</Badge>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="before" className="space-y-2">
                    {checklist.beforeItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-start gap-2 p-2 rounded-md",
                          item.completed ? "bg-green-50" : (item.critical ? "bg-red-50" : "hover:bg-accent")
                        )}
                      >
                        <Checkbox 
                          id={item.id}
                          checked={item.completed}
                          onCheckedChange={() => toggleItemCompletion(checklist.id, "beforeItems", item.id)}
                          className="mt-1"
                        />
                        <div className="flex-grow">
                          <label 
                            htmlFor={item.id} 
                            className={cn(
                              "text-sm cursor-pointer", 
                              item.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {item.text}
                          </label>
                          {item.critical && (
                            <Badge variant="outline" className="text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                              Critical
                            </Badge>
                          )}
                        </div>
                        {item.id.startsWith('custom-') && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => deleteItem(checklist.id, "beforeItems", item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => setActiveDialog({ checklistId: checklist.id, phase: "before" })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="during" className="space-y-2">
                    {checklist.duringItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-start gap-2 p-2 rounded-md",
                          item.completed ? "bg-green-50" : (item.critical ? "bg-red-50" : "hover:bg-accent")
                        )}
                      >
                        <Checkbox 
                          id={item.id}
                          checked={item.completed}
                          onCheckedChange={() => toggleItemCompletion(checklist.id, "duringItems", item.id)}
                          className="mt-1"
                        />
                        <div className="flex-grow">
                          <label 
                            htmlFor={item.id} 
                            className={cn(
                              "text-sm cursor-pointer", 
                              item.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {item.text}
                          </label>
                          {item.critical && (
                            <Badge variant="outline" className="text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                              Critical
                            </Badge>
                          )}
                        </div>
                        {item.id.startsWith('custom-') && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => deleteItem(checklist.id, "duringItems", item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => setActiveDialog({ checklistId: checklist.id, phase: "during" })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="after" className="space-y-2">
                    {checklist.afterItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-start gap-2 p-2 rounded-md",
                          item.completed ? "bg-green-50" : (item.critical ? "bg-red-50" : "hover:bg-accent")
                        )}
                      >
                        <Checkbox 
                          id={item.id}
                          checked={item.completed}
                          onCheckedChange={() => toggleItemCompletion(checklist.id, "afterItems", item.id)}
                          className="mt-1"
                        />
                        <div className="flex-grow">
                          <label 
                            htmlFor={item.id} 
                            className={cn(
                              "text-sm cursor-pointer", 
                              item.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {item.text}
                          </label>
                          {item.critical && (
                            <Badge variant="outline" className="text-xs mt-1 bg-red-50 text-red-700 border-red-200">
                              Critical
                            </Badge>
                          )}
                        </div>
                        {item.id.startsWith('custom-') && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => deleteItem(checklist.id, "afterItems", item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => setActiveDialog({ checklistId: checklist.id, phase: "after" })}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Add New Item Dialog */}
        <Dialog open={!!activeDialog} onOpenChange={(open) => !open && setActiveDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Checklist Item</DialogTitle>
              <DialogDescription>
                Add a custom item to your emergency checklist.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-text">Description</Label>
                <Input
                  id="item-text"
                  placeholder="Enter checklist item text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="critical"
                  checked={newItemCritical}
                  onCheckedChange={setNewItemCritical}
                />
                <Label htmlFor="critical">Mark as Critical</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActiveDialog(null)}>
                Cancel
              </Button>
              <Button onClick={addNewItem}>
                Add to Checklist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </FullScreenDialogBody>
    </div>
  );
}