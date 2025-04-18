import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  ClipboardList, 
  AlertTriangle, 
  Zap, 
  Plus, 
  X, 
  Save, 
  Trash2, 
  ChevronLeft,
  FileText,
  ArrowRight
} from "lucide-react";
import {
  FullScreenDialog,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
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
import { useToast } from "@/hooks/use-toast";

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
  iconType: "zap" | "alertCircle" | "alertTriangle"; // Store icon type instead of React element
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
    iconType: "zap",
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
    iconType: "alertCircle",
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
    iconType: "alertTriangle",
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
    iconType: "alertTriangle",
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

// A helper function to recreate icon components from saved iconType
const getIconFromType = (iconType: string, className: string = "h-5 w-5 text-red-500") => {
  switch(iconType) {
    case "zap":
      return <Zap className={className} />;
    case "alertCircle":
      return <AlertCircle className={className} />;
    case "alertTriangle":
      return <AlertTriangle className={className} />;
    default:
      return <AlertCircle className={className} />;
  }
};

export default function EmergencyChecklistPopOut() {
  const { toast } = useToast();
  
  // State for user-editable checklists
  const [checklists, setChecklists] = useState<EmergencyChecklist[]>(() => {
    const savedChecklists = localStorage.getItem('emergency_checklists');
    
    if (savedChecklists) {
      try {
        // Parse the saved checklists
        const parsedChecklists = JSON.parse(savedChecklists);
        
        // Recreate React icon elements from saved iconType strings
        return parsedChecklists.map((checklist: any) => ({
          ...checklist,
          icon: getIconFromType(checklist.iconType)
        }));
      } catch (error) {
        console.error("Error loading checklists:", error);
        return createBaseChecklists();
      }
    }
    
    return createBaseChecklists();
  });
  
  // Sync checklists to localStorage when they change
  useEffect(() => {
    // Create a simplified version without circular references
    const simplifiedChecklists = checklists.map(checklist => ({
      ...checklist,
      icon: null, // Don't store the React elements
      iconType: checklist.iconType
    }));
    localStorage.setItem('emergency_checklists', JSON.stringify(simplifiedChecklists));
  }, [checklists]);
  
  // State for the new checklist being created
  const [newChecklist, setNewChecklist] = useState<Partial<EmergencyChecklist>>({
    title: "",
    iconType: "alertCircle",
    description: "",
    beforeItems: [],
    duringItems: [],
    afterItems: []
  });
  
  // State for new checklist item being added
  const [newItemText, setNewItemText] = useState("");
  const [newItemType, setNewItemType] = useState<"before" | "during" | "after">("before");
  const [newItemCritical, setNewItemCritical] = useState(false);
  
  // Add a new custom item to a checklist
  const addCustomItem = (checklistId: string) => {
    if (!newItemText.trim()) return;
    
    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        // Generate a unique ID
        const itemId = `custom-${newItemType}-${Date.now()}`;
        
        // Add to the appropriate array based on type
        const newItem = {
          id: itemId,
          text: newItemText,
          critical: newItemCritical,
          completed: false
        };
        
        return {
          ...checklist,
          beforeItems: newItemType === "before" ? [...checklist.beforeItems, newItem] : checklist.beforeItems,
          duringItems: newItemType === "during" ? [...checklist.duringItems, newItem] : checklist.duringItems,
          afterItems: newItemType === "after" ? [...checklist.afterItems, newItem] : checklist.afterItems
        };
      }
      return checklist;
    }));
    
    // Reset form
    setNewItemText("");
    setNewItemCritical(false);
    
    // Show success toast
    toast({
      title: "Item added",
      description: "Your custom item has been added to the checklist.",
      duration: 2000,
    });
  };
  
  // Toggle completion status of an item
  const toggleItemCompletion = (checklistId: string, itemId: string, phase: "before" | "during" | "after") => {
    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        // Update the appropriate phase's items
        if (phase === "before") {
          return {
            ...checklist,
            beforeItems: checklist.beforeItems.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          };
        } else if (phase === "during") {
          return {
            ...checklist,
            duringItems: checklist.duringItems.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          };
        } else {
          return {
            ...checklist,
            afterItems: checklist.afterItems.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          };
        }
      }
      return checklist;
    }));
  };
  
  // Calculate progress percentage for a checklist
  const calculateProgress = (checklist: EmergencyChecklist) => {
    const allItems = [
      ...checklist.beforeItems,
      ...checklist.duringItems,
      ...checklist.afterItems
    ];
    
    if (allItems.length === 0) return 0;
    
    const completedItems = allItems.filter(item => item.completed).length;
    return Math.round((completedItems / allItems.length) * 100);
  };
  
  // Calculate critical items completion
  const calculateCriticalProgress = (checklist: EmergencyChecklist) => {
    const criticalItems = [
      ...checklist.beforeItems.filter(item => item.critical),
      ...checklist.duringItems.filter(item => item.critical),
      ...checklist.afterItems.filter(item => item.critical)
    ];
    
    if (criticalItems.length === 0) return 100; // No critical items
    
    const completedCriticalItems = criticalItems.filter(item => item.completed).length;
    return Math.round((completedCriticalItems / criticalItems.length) * 100);
  };
  
  // Reset all checklists to default state
  const resetAllChecklists = () => {
    const baseChecklists = createBaseChecklists();
    setChecklists(baseChecklists);
    
    toast({
      title: "Checklists reset",
      description: "All checklists have been reset to their default state.",
      duration: 3000,
    });
  };
  
  // Delete a custom item
  const deleteItem = (checklistId: string, itemId: string, phase: "before" | "during" | "after") => {
    setChecklists(checklists.map(checklist => {
      if (checklist.id === checklistId) {
        if (phase === "before") {
          return {
            ...checklist,
            beforeItems: checklist.beforeItems.filter(item => item.id !== itemId)
          };
        } else if (phase === "during") {
          return {
            ...checklist,
            duringItems: checklist.duringItems.filter(item => item.id !== itemId)
          };
        } else {
          return {
            ...checklist,
            afterItems: checklist.afterItems.filter(item => item.id !== itemId)
          };
        }
      }
      return checklist;
    }));
    
    toast({
      title: "Item deleted",
      description: "The item has been removed from the checklist.",
      duration: 2000,
    });
  };
  
  // Render a single checklist item
  const renderChecklistItem = (item: ChecklistItem, checklistId: string, phase: "before" | "during" | "after") => {
    // Check if this is a custom item by checking if the id starts with "custom-"
    const isCustomItem = item.id.startsWith("custom-");
    
    return (
      <div key={item.id} className={cn(
        "flex items-start py-2 px-1 border-b last:border-0",
        item.completed ? "bg-green-50 dark:bg-green-950/20" : "",
        item.critical ? "border-l-2 border-l-red-500 pl-2" : ""
      )}>
        <Checkbox
          checked={item.completed}
          onCheckedChange={() => toggleItemCompletion(checklistId, item.id, phase)}
          className="mt-0.5"
        />
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <div className={cn(
              "text-sm",
              item.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-black dark:text-white",
              item.critical ? "font-medium" : ""
            )}>
              {item.text}
              {item.critical && (
                <Badge variant="destructive" className="ml-2 text-[10px] py-0 h-4">
                  Critical
                </Badge>
              )}
            </div>
            
            {isCustomItem && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={() => deleteItem(checklistId, item.id, phase)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render menu screen with all checklists
  const renderChecklistCatalog = () => (
    <div className="space-y-6">
      <Alert variant="destructive" className="border-2 border-red-500">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          In case of a life-threatening emergency, immediately call your local emergency services (911 in the US).
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 gap-4">
        {checklists.map((checklist) => (
          <FullScreenDialog key={checklist.id}>
            <FullScreenDialogTrigger asChild>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {checklist.icon}
                      <CardTitle className="ml-2 text-lg">{checklist.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="text-xs">{calculateProgress(checklist)}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all"
                          style={{ width: `${calculateProgress(checklist)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <CardDescription>{checklist.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        {checklist.beforeItems.filter(i => i.completed).length}/{checklist.beforeItems.length} Before
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {checklist.duringItems.filter(i => i.completed).length}/{checklist.duringItems.length} During
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {checklist.afterItems.filter(i => i.completed).length}/{checklist.afterItems.length} After
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs">Critical items:</span>
                      <div className={cn(
                          "h-2 flex-1 rounded-full overflow-hidden",
                          calculateCriticalProgress(checklist) < 50 ? "bg-red-200" : "bg-orange-200",
                          calculateCriticalProgress(checklist) === 100 ? "bg-green-200" : ""
                        )}>
                        <div 
                          className={cn(
                            "h-full transition-all",
                            calculateCriticalProgress(checklist) < 50 ? "bg-red-500" : 
                            calculateCriticalProgress(checklist) < 100 ? "bg-orange-500" : 
                            "bg-green-500"
                          )}
                          style={{ width: `${calculateCriticalProgress(checklist)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{calculateCriticalProgress(checklist)}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" variant="outline">
                    View Checklist <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </FullScreenDialogTrigger>
            <FullScreenDialogContent themeColor="#ef4444">
              <FullScreenDialogHeader>
                <FullScreenDialogTitle className="flex items-center space-x-2">
                  {checklist.icon}
                  <span>{checklist.title} Checklist</span>
                </FullScreenDialogTitle>
                <FullScreenDialogDescription>
                  {checklist.description}
                </FullScreenDialogDescription>
              </FullScreenDialogHeader>
              <FullScreenDialogBody>
                {/* Progress indicators */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-3 rounded-full overflow-hidden bg-gray-200">
                          <div 
                            className="bg-primary h-full transition-all"
                            style={{ width: `${calculateProgress(checklist)}%` }}
                          />
                        </div>
                        <span className="font-bold">{calculateProgress(checklist)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <span>Critical Items</span>
                        <Badge variant="destructive" className="ml-2">Important</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-3 rounded-full overflow-hidden bg-gray-200">
                          <div 
                            className={
                              calculateCriticalProgress(checklist) < 50 ? "bg-red-500 h-full transition-all" : 
                              calculateCriticalProgress(checklist) < 100 ? "bg-orange-500 h-full transition-all" : 
                              "bg-green-500 h-full transition-all"
                            }
                            style={{ width: `${calculateCriticalProgress(checklist)}%` }}
                          />
                        </div>
                        <span className="font-bold">{calculateCriticalProgress(checklist)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Checklist tabs */}
                <Tabs defaultValue="before" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="before">Before</TabsTrigger>
                    <TabsTrigger value="during">During</TabsTrigger>
                    <TabsTrigger value="after">After</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="before" className="mt-4">
                    <div className="rounded-lg border bg-card">
                      <div className="p-3 font-medium bg-muted rounded-t-lg">
                        Preparation Steps ({checklist.beforeItems.filter(i => i.completed).length}/{checklist.beforeItems.length})
                      </div>
                      <div className="p-2">
                        {checklist.beforeItems.map(item => renderChecklistItem(item, checklist.id, "before"))}
                        
                        {checklist.beforeItems.length === 0 && (
                          <div className="py-4 text-center text-sm text-gray-500">
                            No preparation steps available. Add your own below.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Add custom item form */}
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Add Custom Preparation Step</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid gap-2">
                            <Label htmlFor="new-before-item">Description</Label>
                            <Input
                              id="new-before-item"
                              placeholder="Enter a new preparation step"
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="item-critical"
                              checked={newItemCritical}
                              onCheckedChange={(checked) => setNewItemCritical(!!checked)}
                            />
                            <label 
                              htmlFor="item-critical"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Mark as critical
                            </label>
                          </div>
                          
                          <Button 
                            onClick={() => { 
                              setNewItemType("before");
                              addCustomItem(checklist.id);
                            }}
                            disabled={!newItemText.trim()}
                            className="w-full"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="during" className="mt-4">
                    <div className="rounded-lg border bg-card">
                      <div className="p-3 font-medium bg-muted rounded-t-lg">
                        Response Steps ({checklist.duringItems.filter(i => i.completed).length}/{checklist.duringItems.length})
                      </div>
                      <div className="p-2">
                        {checklist.duringItems.map(item => renderChecklistItem(item, checklist.id, "during"))}
                        
                        {checklist.duringItems.length === 0 && (
                          <div className="py-4 text-center text-sm text-gray-500">
                            No response steps available. Add your own below.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Add custom item form */}
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Add Custom Response Step</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid gap-2">
                            <Label htmlFor="new-during-item">Description</Label>
                            <Input
                              id="new-during-item"
                              placeholder="Enter a new response step"
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="item-critical"
                              checked={newItemCritical}
                              onCheckedChange={(checked) => setNewItemCritical(!!checked)}
                            />
                            <label 
                              htmlFor="item-critical"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Mark as critical
                            </label>
                          </div>
                          
                          <Button 
                            onClick={() => { 
                              setNewItemType("during");
                              addCustomItem(checklist.id);
                            }}
                            disabled={!newItemText.trim()}
                            className="w-full"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="after" className="mt-4">
                    <div className="rounded-lg border bg-card">
                      <div className="p-3 font-medium bg-muted rounded-t-lg">
                        Recovery Steps ({checklist.afterItems.filter(i => i.completed).length}/{checklist.afterItems.length})
                      </div>
                      <div className="p-2">
                        {checklist.afterItems.map(item => renderChecklistItem(item, checklist.id, "after"))}
                        
                        {checklist.afterItems.length === 0 && (
                          <div className="py-4 text-center text-sm text-gray-500">
                            No recovery steps available. Add your own below.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Add custom item form */}
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Add Custom Recovery Step</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid gap-2">
                            <Label htmlFor="new-after-item">Description</Label>
                            <Input
                              id="new-after-item"
                              placeholder="Enter a new recovery step"
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="item-critical"
                              checked={newItemCritical}
                              onCheckedChange={(checked) => setNewItemCritical(!!checked)}
                            />
                            <label 
                              htmlFor="item-critical"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Mark as critical
                            </label>
                          </div>
                          
                          <Button 
                            onClick={() => { 
                              setNewItemType("after");
                              addCustomItem(checklist.id);
                            }}
                            disabled={!newItemText.trim()}
                            className="w-full"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </FullScreenDialogBody>
              <FullScreenDialogFooter>
                <Button variant="outline">
                  Close
                </Button>
              </FullScreenDialogFooter>
            </FullScreenDialogContent>
          </FullScreenDialog>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <div className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Reset All Checklists
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset All Checklists</DialogTitle>
              <DialogDescription>
                This will reset all checklists to their default state and remove all custom items you've added. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" type="button">Cancel</Button>
              <Button 
                variant="destructive" 
                type="button"
                onClick={resetAllChecklists}
              >
                Reset All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  // Main component render
  return (
    <div className="space-y-4">
      {renderChecklistCatalog()}
    </div>
  );
}