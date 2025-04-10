import { useState, useEffect } from "react";
import { 
  Plus, 
  Save, 
  Trash2,
  ListChecks,
  ShoppingBag,
  Heart
} from "lucide-react";
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Define the basic checklist item type
type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

// Helper function to generate an ID
const generateId = (): string => {
  return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Default emergency supplies checklist
const defaultSupplies: ChecklistItem[] = [
  { id: "s1", text: "AAA Batteries", completed: false },
  { id: "s2", text: "AA Batteries", completed: false },
  { id: "s3", text: "D Batteries", completed: false },
  { id: "s4", text: "Flashlights", completed: false },
  { id: "s5", text: "Battery-powered AM/FM Radio", completed: false },
  { id: "s6", text: "Battery-powered Fan", completed: false },
  { id: "s7", text: "Propane Stove", completed: false },
  { id: "s8", text: "Matches/Lighters", completed: false },
  { id: "s9", text: "Candles", completed: false },
  { id: "s10", text: "Manual Can Opener", completed: false },
  { id: "s11", text: "Water (1 gallon per person per day)", completed: false },
  { id: "s12", text: "Water Purification Tablets", completed: false },
  { id: "s13", text: "Emergency Contact List", completed: false },
  { id: "s14", text: "Portable Phone Charger", completed: false },
  { id: "s15", text: "Cash in Small Bills", completed: false },
  { id: "s16", text: "Blankets", completed: false },
  { id: "s17", text: "Rain Ponchos", completed: false },
  { id: "s18", text: "Whistle", completed: false }
];

// First Aid Kit items
const defaultFirstAid: ChecklistItem[] = [
  { id: "f1", text: "Bandages (various sizes)", completed: false },
  { id: "f2", text: "Gauze Pads", completed: false },
  { id: "f3", text: "Adhesive Tape", completed: false },
  { id: "f4", text: "Elastic Bandages", completed: false },
  { id: "f5", text: "Alcohol Wipes", completed: false },
  { id: "f6", text: "Antiseptic Ointment", completed: false },
  { id: "f7", text: "Hydrogen Peroxide", completed: false },
  { id: "f8", text: "Hand Sanitizer", completed: false },
  { id: "f9", text: "Pain Relievers", completed: false },
  { id: "f10", text: "Anti-diarrhea Medication", completed: false },
  { id: "f11", text: "Antihistamines", completed: false },
  { id: "f12", text: "Personal Medications (2-week supply)", completed: false },
  { id: "f13", text: "Scissors", completed: false },
  { id: "f14", text: "Tweezers", completed: false },
  { id: "f15", text: "Thermometer", completed: false },
  { id: "f16", text: "Disposable Gloves", completed: false }
];

// Food recommendations
const defaultFoods: ChecklistItem[] = [
  { id: "fd1", text: "Canned Vegetables", completed: false },
  { id: "fd2", text: "Canned Fruits", completed: false },
  { id: "fd3", text: "Canned Meat (Tuna, Chicken)", completed: false },
  { id: "fd4", text: "Canned Beans", completed: false },
  { id: "fd5", text: "Canned Soup/Stew", completed: false },
  { id: "fd6", text: "Peanut Butter", completed: false },
  { id: "fd7", text: "Jelly/Jam", completed: false },
  { id: "fd8", text: "Honey", completed: false },
  { id: "fd9", text: "Crackers", completed: false },
  { id: "fd10", text: "Rice", completed: false },
  { id: "fd11", text: "Pasta", completed: false },
  { id: "fd12", text: "Oatmeal", completed: false },
  { id: "fd13", text: "Cereal", completed: false },
  { id: "fd14", text: "Granola Bars", completed: false },
  { id: "fd15", text: "Dried Fruits", completed: false },
  { id: "fd16", text: "Nuts and Seeds", completed: false },
  { id: "fd17", text: "Powdered Milk", completed: false },
  { id: "fd18", text: "Bottled Water", completed: false }
];

export default function EmergencyChecklist() {
  const { toast } = useToast();
  
  // State for each checklist
  const [supplies, setSupplies] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('emergency_supplies');
    return saved ? JSON.parse(saved) : defaultSupplies;
  });
  
  const [firstAid, setFirstAid] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('emergency_firstaid');
    return saved ? JSON.parse(saved) : defaultFirstAid;
  });
  
  const [foods, setFoods] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('emergency_foods');
    return saved ? JSON.parse(saved) : defaultFoods;
  });
  
  // State for new items
  const [newSupplyText, setNewSupplyText] = useState("");
  const [newFirstAidText, setNewFirstAidText] = useState("");
  const [newFoodText, setNewFoodText] = useState("");
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('emergency_supplies', JSON.stringify(supplies));
  }, [supplies]);
  
  useEffect(() => {
    localStorage.setItem('emergency_firstaid', JSON.stringify(firstAid));
  }, [firstAid]);
  
  useEffect(() => {
    localStorage.setItem('emergency_foods', JSON.stringify(foods));
  }, [foods]);
  
  // Calculate completion percentages
  const suppliesCompleted = supplies.filter(item => item.completed).length;
  const firstAidCompleted = firstAid.filter(item => item.completed).length;
  const foodsCompleted = foods.filter(item => item.completed).length;
  
  // Toggle item completion
  const toggleItem = (id: string, list: ChecklistItem[], setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>) => {
    setList(list.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  // Add a new item
  const addItem = (
    text: string,
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    setNewText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Item text cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const newItem: ChecklistItem = {
      id: generateId(),
      text: text.trim(),
      completed: false
    };
    
    setList([...list, newItem]);
    setNewText("");
    
    toast({
      title: "Item Added",
      description: `${text} has been added to your checklist.`,
    });
  };
  
  // Remove an item
  const removeItem = (id: string, list: ChecklistItem[], setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>) => {
    setList(list.filter(item => item.id !== id));
  };
  
  // Reset all lists to defaults
  const resetAll = () => {
    if (window.confirm("Reset all checklists to defaults? This will remove any custom items you've added.")) {
      setSupplies(defaultSupplies);
      setFirstAid(defaultFirstAid);
      setFoods(defaultFoods);
      toast({
        title: "Reset Complete",
        description: "All checklists have been reset to defaults.",
      });
    }
  };
  
  // Render a checklist
  const renderChecklist = (
    items: ChecklistItem[],
    setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    newItemText: string,
    setNewItemText: React.Dispatch<React.SetStateAction<string>>,
    completed: number
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              completed === items.length && items.length > 0 ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: items.length ? `${(completed / items.length) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-sm font-medium">
          {completed}/{items.length}
        </span>
      </div>
      
      <ul className="space-y-2 border rounded-lg p-4 bg-card">
        {items.map(item => (
          <li key={item.id} className="flex items-start gap-2">
            <Checkbox 
              id={item.id} 
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id, items, setItems)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label 
                htmlFor={item.id}
                className={cn(
                  "text-sm font-normal cursor-pointer",
                  item.completed && "line-through text-muted-foreground"
                )}
              >
                {item.text}
              </Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id, items, setItems)}
              className="h-6 w-6 opacity-50 hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
      
      <div className="flex gap-2">
        <Input
          placeholder="Add new item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addItem(newItemText, items, setItems, setNewItemText);
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={() => addItem(newItemText, items, setItems, setNewItemText)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
  
  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Emergency Preparedness Checklist
        </CardTitle>
        <CardDescription>
          Track essential supplies for emergency situations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="supplies" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="supplies" className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" />
              <span>Supplies</span>
              <Badge variant="outline" className="ml-auto">
                {suppliesCompleted}/{supplies.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="firstaid" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>First Aid</span>
              <Badge variant="outline" className="ml-auto">
                {firstAidCompleted}/{firstAid.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              <span>Food</span>
              <Badge variant="outline" className="ml-auto">
                {foodsCompleted}/{foods.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="supplies" className="mt-0">
            {renderChecklist(
              supplies,
              setSupplies,
              newSupplyText,
              setNewSupplyText,
              suppliesCompleted
            )}
          </TabsContent>
          
          <TabsContent value="firstaid" className="mt-0">
            {renderChecklist(
              firstAid,
              setFirstAid,
              newFirstAidText,
              setNewFirstAidText,
              firstAidCompleted
            )}
          </TabsContent>
          
          <TabsContent value="food" className="mt-0">
            {renderChecklist(
              foods,
              setFoods,
              newFoodText,
              setNewFoodText,
              foodsCompleted
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {supplies.length > 0 && firstAid.length > 0 && foods.length > 0 && 
           suppliesCompleted === supplies.length && 
           firstAidCompleted === firstAid.length && 
           foodsCompleted === foods.length
            ? "Great job! You're fully prepared."
            : "Check off items as you acquire them."}
        </div>
        <div>
          <Button
            variant="outline" 
            size="sm"
            onClick={resetAll}
          >
            Reset All
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}