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

// Initialize checklists
const CHECKLISTS: EmergencyChecklist[] = createBaseChecklists();

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

// Define section types
type SectionType = "menu" | "checklist";

export default function EmergencyChecklistPopOut() {
  // Access toast system
  const { toast } = useToast();
  
  // State for section navigation
  const [currentSection, setCurrentSection] = useState<SectionType>("menu");
  
  // State for user-editable checklists
  const [checklists, setChecklists] = useState<EmergencyChecklist[]>(() => {
    const savedChecklists = localStorage.getItem('emergency_checklists');
    
    if (savedChecklists) {
      try {
        // Parse the saved checklists
        const parsedChecklists = JSON.parse(savedChecklists);
        
        // Reconstruct React components from iconType
        return parsedChecklists.map((checklist: any) => ({
          ...checklist,
          icon: getIconFromType(checklist.iconType, 
            checklist.id === "vehicle" ? "h-5 w-5 text-yellow-500" : 
            checklist.id === "home" ? "h-5 w-5 text-orange-500" : 
            "h-5 w-5 text-red-500")
        }));
      } catch (error) {
        console.error("Error parsing saved checklists:", error);
        return createBaseChecklists();
      }
    }
    
    return createBaseChecklists();
  });

  // State for currently selected checklist
  const [currentChecklist, setCurrentChecklist] = useState<EmergencyChecklist | null>(null);

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
    
    // Create a serializable version of the checklists (without React elements)
    const serializableChecklists = checklists.map(checklist => ({
      ...checklist,
      // Remove the icon property as it's a React element
      icon: undefined
    }));
    
    // Save to local storage
    localStorage.setItem('emergency_checklists', JSON.stringify(serializableChecklists));
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
  const addNewItem = (checklistId: string, phase: "before" | "during" | "after") => {
    if (!newItemText.trim()) return;
    
    const phaseKey = `${phase}Items` as "beforeItems" | "duringItems" | "afterItems";
    const newItemId = generateId(`${checklistId}-${phase}`, Math.random() * 10000);
    
    const newItem: ChecklistItem = {
      id: newItemId,
      text: newItemText,
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
    
    // Reset form
    setNewItemText("");
    setNewItemCritical(false);
    setActiveDialog(null);
    
    // Show success toast
    toast({
      title: "Item Added",
      description: `Added "${newItemText}" to the ${phase} phase checklist.`,
      duration: 3000,
    });
  };
  
  // Delete an item from a checklist
  const deleteItem = (checklistId: string, phase: "beforeItems" | "duringItems" | "afterItems", itemId: string) => {
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
    
    // Show confirmation toast
    toast({
      title: "Item Deleted",
      description: "Checklist item has been removed.",
      duration: 3000,
    });
  };
  
  // Handle selecting a checklist
  const handleSelectChecklist = (checklist: EmergencyChecklist) => {
    setCurrentChecklist(checklist);
    setCurrentSection("checklist");
    
    // Show toast with instructions
    toast({
      title: `${checklist.title} Checklist`,
      description: "Check off items as you complete them. Your progress is saved automatically.",
      duration: 3000,
    });
  };
  
  // Back to menu button
  const BackToMenuButton = () => (
    <Button 
      variant="ghost" 
      size="sm" 
      className="mb-4 text-primary hover:text-primary/80 hover:bg-gray-50" 
      onClick={() => {
        setCurrentSection("menu");
        setCurrentChecklist(null);
      }}
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
      Back to menu
    </Button>
  );
  
  // Render menu section
  const renderMenu = () => (
    <div className="w-full space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
        Emergency Checklists
      </h2>
      
      <Alert className="bg-gray-50 border-gray-200 mb-4">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-gray-700 text-sm">
          Save these checklists to prepare for and respond to different types of emergencies. Your progress is saved automatically.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {checklists.map(checklist => (
          <div 
            key={checklist.id}
            className={cn(
              "relative p-4 rounded-lg border bg-white shadow-sm cursor-pointer transition-all duration-200",
              progress[checklist.id]?.total > 0 
                ? "border-primary/30 hover:border-primary hover:shadow"
                : "border-gray-200 hover:border-gray-400 hover:shadow"
            )}
            onClick={() => handleSelectChecklist(checklist)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gray-50 flex-shrink-0">
                {checklist.icon}
              </div>
              
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-900">{checklist.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{checklist.description}</p>
                
                {progress[checklist.id] && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-gray-600">
                        Progress
                      </span>
                      <span className="font-bold text-primary">
                        {progress[checklist.id].total}%
                      </span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded overflow-hidden">
                      <div 
                        className="h-full rounded bg-primary transition-all"
                        style={{ width: `${progress[checklist.id].total}%` }}
                      >
                        {progress[checklist.id].total > 15 && (
                          <div className="flex h-full items-center justify-center text-xs font-bold text-white">
                            {progress[checklist.id].total}% Complete
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="absolute top-2 right-2">
                <ArrowRight className="h-5 w-5 text-primary/70" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Render checklist detail section
  const renderChecklist = () => {
    if (!currentChecklist) return null;
    
    const currentProgress = progress[currentChecklist.id];
    
    return (
      <div className="space-y-4">
        <BackToMenuButton />
        
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-full bg-gray-50 flex-shrink-0">
            {currentChecklist.icon}
          </div>
          
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {currentChecklist.title} Checklist
            </h2>
            <p className="text-sm text-gray-500">{currentChecklist.description}</p>
          </div>
        </div>
        
        {/* Progress summary */}
        <Card className="mb-4 border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Progress Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-md border border-gray-100">
                <div className="text-sm font-medium mb-1">Before</div>
                <Progress value={currentProgress?.before || 0} className="h-2 mb-2" />
                <div className="text-lg font-bold">{currentProgress?.before || 0}%</div>
              </div>
              <div className="p-2 rounded-md border border-gray-100">
                <div className="text-sm font-medium mb-1">During</div>
                <Progress value={currentProgress?.during || 0} className="h-2 mb-2" />
                <div className="text-lg font-bold">{currentProgress?.during || 0}%</div>
              </div>
              <div className="p-2 rounded-md border border-gray-100">
                <div className="text-sm font-medium mb-1">After</div>
                <Progress value={currentProgress?.after || 0} className="h-2 mb-2" />
                <div className="text-lg font-bold">{currentProgress?.after || 0}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for before, during, after phases */}
        <Tabs defaultValue="before" className="w-full">
          <TabsList className="w-full bg-gray-50 border-gray-200">
            <TabsTrigger value="before" className="flex-1 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary">Before</TabsTrigger>
            <TabsTrigger value="during" className="flex-1 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary">During</TabsTrigger>
            <TabsTrigger value="after" className="flex-1 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary">After</TabsTrigger>
          </TabsList>
          
          {/* Before Items */}
          <TabsContent value="before" className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Before {currentChecklist.title.toLowerCase()} occurs:</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Preparation Item</DialogTitle>
                      <DialogDescription>
                        Add a new item to your "Before" checklist for {currentChecklist.title.toLowerCase()}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-item-text">Item description</Label>
                        <Input 
                          id="new-item-text" 
                          value={newItemText} 
                          onChange={(e) => setNewItemText(e.target.value)}
                          placeholder="Enter checklist item text"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="critical-item" 
                          checked={newItemCritical}
                          onCheckedChange={(checked) => setNewItemCritical(checked === true)}
                        />
                        <label 
                          htmlFor="critical-item" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mark as critical item
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => addNewItem(currentChecklist.id, "before")}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Add Item
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {currentChecklist.beforeItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No preparation items yet. Add some items to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentChecklist.beforeItems.map(item => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-start gap-2 p-2 rounded-md border border-gray-200 cursor-pointer",
                        item.completed ? "bg-gray-50" : "hover:bg-slate-50"
                      )}
                      onClick={() => toggleItemCompletion(currentChecklist.id, "beforeItems", item.id)}
                    >
                      <Checkbox 
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => toggleItemCompletion(currentChecklist.id, "beforeItems", item.id)}
                        className="mt-1"
                      />
                      <div className="flex-grow">
                        <label 
                          htmlFor={item.id} 
                          className={cn(
                            "text-sm cursor-pointer transition-all", 
                            item.completed 
                              ? "line-through text-muted-foreground" 
                              : "font-medium"
                          )}
                        >
                          {item.text}
                          {item.critical && (
                            <span className="ml-2 inline-flex items-center px-1.5 text-xs font-medium">
                              (Critical)
                            </span>
                          )}
                        </label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-50 hover:opacity-100" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(currentChecklist.id, "beforeItems", item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* During Items */}
          <TabsContent value="during" className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">During {currentChecklist.title.toLowerCase()}:</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Response Item</DialogTitle>
                      <DialogDescription>
                        Add a new item to your "During" checklist for {currentChecklist.title.toLowerCase()}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-item-text">Item description</Label>
                        <Input 
                          id="new-item-text" 
                          value={newItemText} 
                          onChange={(e) => setNewItemText(e.target.value)}
                          placeholder="Enter checklist item text"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="critical-item" 
                          checked={newItemCritical}
                          onCheckedChange={(checked) => setNewItemCritical(checked === true)}
                        />
                        <label 
                          htmlFor="critical-item" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mark as critical item
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => addNewItem(currentChecklist.id, "during")}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Add Item
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {currentChecklist.duringItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No response items yet. Add some items to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentChecklist.duringItems.map(item => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-start gap-2 p-2 rounded-md border border-gray-200 cursor-pointer",
                        item.completed ? "bg-gray-50" : "hover:bg-slate-50"
                      )}
                      onClick={() => toggleItemCompletion(currentChecklist.id, "duringItems", item.id)}
                    >
                      <Checkbox 
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => toggleItemCompletion(currentChecklist.id, "duringItems", item.id)}
                        className="mt-1"
                      />
                      <div className="flex-grow">
                        <label 
                          htmlFor={item.id} 
                          className={cn(
                            "text-sm cursor-pointer transition-all", 
                            item.completed 
                              ? "line-through text-muted-foreground" 
                              : "font-medium"
                          )}
                        >
                          {item.text}
                          {item.critical && (
                            <span className="ml-2 inline-flex items-center px-1.5 text-xs font-medium">
                              (Critical)
                            </span>
                          )}
                        </label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-50 hover:opacity-100" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(currentChecklist.id, "duringItems", item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* After Items */}
          <TabsContent value="after" className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">After {currentChecklist.title.toLowerCase()}:</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Recovery Item</DialogTitle>
                      <DialogDescription>
                        Add a new item to your "After" checklist for {currentChecklist.title.toLowerCase()}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-item-text">Item description</Label>
                        <Input 
                          id="new-item-text" 
                          value={newItemText} 
                          onChange={(e) => setNewItemText(e.target.value)}
                          placeholder="Enter checklist item text"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="critical-item" 
                          checked={newItemCritical}
                          onCheckedChange={(checked) => setNewItemCritical(checked === true)}
                        />
                        <label 
                          htmlFor="critical-item" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mark as critical item
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => addNewItem(currentChecklist.id, "after")}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Add Item
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {currentChecklist.afterItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No recovery items yet. Add some items to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentChecklist.afterItems.map(item => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-start gap-2 p-2 rounded-md border border-gray-200 cursor-pointer",
                        item.completed ? "bg-gray-50" : "hover:bg-slate-50"
                      )}
                      onClick={() => toggleItemCompletion(currentChecklist.id, "afterItems", item.id)}
                    >
                      <Checkbox 
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => toggleItemCompletion(currentChecklist.id, "afterItems", item.id)}
                        className="mt-1"
                      />
                      <div className="flex-grow">
                        <label 
                          htmlFor={item.id} 
                          className={cn(
                            "text-sm cursor-pointer transition-all", 
                            item.completed 
                              ? "line-through text-muted-foreground" 
                              : "font-medium"
                          )}
                        >
                          {item.text}
                          {item.critical && (
                            <span className="ml-2 inline-flex items-center px-1.5 text-xs font-medium">
                              (Critical)
                            </span>
                          )}
                        </label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-50 hover:opacity-100" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(currentChecklist.id, "afterItems", item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <>
      <FullScreenDialogHeader>
        <FullScreenDialogTitle>Emergency Checklists</FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Prepare, respond, and recover from emergencies by using these interactive checklists
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        {currentSection === "menu" ? renderMenu() : renderChecklist()}
      </FullScreenDialogBody>
    </>
  );
}