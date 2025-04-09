import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Plus, 
  X,
  Save, 
  Trash2,
  ListChecks,
  ShoppingBag
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
import { Separator } from "@/components/ui/separator";
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
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Default emergency supplies checklist
const defaultSupplies: ChecklistItem[] = [
  // Basic Supplies
  { id: "supply-1", text: "Batteries (AAA)", completed: false },
  { id: "supply-2", text: "Batteries (AA)", completed: false },
  { id: "supply-3", text: "Batteries (D)", completed: false },
  { id: "supply-4", text: "Flashlights", completed: false },
  { id: "supply-5", text: "AM/FM Radio (battery-powered)", completed: false },
  { id: "supply-6", text: "Battery-powered fan", completed: false },
  { id: "supply-7", text: "Propane stove", completed: false },
  { id: "supply-8", text: "Matches/lighters", completed: false },
  { id: "supply-9", text: "Candles", completed: false },
  { id: "supply-10", text: "Water (1 gallon per person per day)", completed: false },
  
  // First Aid Kit
  { id: "firstaid-1", text: "First Aid Kit - Bandages", completed: false },
  { id: "firstaid-2", text: "First Aid Kit - Gauze", completed: false },
  { id: "firstaid-3", text: "First Aid Kit - Adhesive tape", completed: false },
  { id: "firstaid-4", text: "First Aid Kit - Alcohol wipes", completed: false },
  { id: "firstaid-5", text: "First Aid Kit - Antiseptic ointment", completed: false },
  { id: "firstaid-6", text: "First Aid Kit - Pain relievers", completed: false },
  { id: "firstaid-7", text: "First Aid Kit - Scissors", completed: false },
  { id: "firstaid-8", text: "First Aid Kit - Tweezers", completed: false },
  
  // Medications
  { id: "meds-1", text: "Personal medications (2-week supply)", completed: false },
  { id: "meds-2", text: "Prescription info (doctor, pharmacy)", completed: false },
  
  // Communication
  { id: "comm-1", text: "Cell phone charger (portable)", completed: false },
  { id: "comm-2", text: "Whistle", completed: false },
  { id: "comm-3", text: "Emergency contact list", completed: false },
  
  // Other Essential Items
  { id: "other-1", text: "Manual can opener", completed: false },
  { id: "other-2", text: "Cash in small denominations", completed: false },
  { id: "other-3", text: "Personal documents (copies)", completed: false },
  { id: "other-4", text: "Extra clothes", completed: false },
  { id: "other-5", text: "Blankets", completed: false }
];

// Default emergency food recommendations
const defaultFoods: ChecklistItem[] = [
  // Non-perishable foods
  { id: "food-1", text: "Canned vegetables", completed: false },
  { id: "food-2", text: "Canned fruits", completed: false },
  { id: "food-3", text: "Canned meat (tuna, chicken)", completed: false },
  { id: "food-4", text: "Canned beans", completed: false },
  { id: "food-5", text: "Canned soup", completed: false },
  { id: "food-6", text: "Peanut butter", completed: false },
  { id: "food-7", text: "Jelly/jam", completed: false },
  { id: "food-8", text: "Crackers", completed: false },
  { id: "food-9", text: "Granola bars", completed: false },
  { id: "food-10", text: "Cereal", completed: false },
  { id: "food-11", text: "Dried fruits", completed: false },
  { id: "food-12", text: "Nuts and seeds", completed: false },
  { id: "food-13", text: "Rice", completed: false },
  { id: "food-14", text: "Pasta", completed: false },
  { id: "food-15", text: "Instant oatmeal", completed: false },
  { id: "food-16", text: "Powdered milk", completed: false },
  { id: "food-17", text: "Coffee/tea", completed: false },
  { id: "food-18", text: "Sugar, salt, pepper", completed: false },
  { id: "food-19", text: "Bottled water", completed: false },
  { id: "food-20", text: "Sports drinks", completed: false }
];

export default function SimpleEmergencyChecklist() {
  const { toast } = useToast();
  
  // States for the supply checklist and food checklist
  const [supplies, setSupplies] = useState<ChecklistItem[]>(() => {
    const savedSupplies = localStorage.getItem('emergency_supplies');
    return savedSupplies ? JSON.parse(savedSupplies) : defaultSupplies;
  });
  
  const [foods, setFoods] = useState<ChecklistItem[]>(() => {
    const savedFoods = localStorage.getItem('emergency_foods');
    return savedFoods ? JSON.parse(savedFoods) : defaultFoods;
  });
  
  // State for adding new items
  const [newSupplyText, setNewSupplyText] = useState("");
  const [newFoodText, setNewFoodText] = useState("");
  
  // Save to localStorage whenever checklists change
  useEffect(() => {
    localStorage.setItem('emergency_supplies', JSON.stringify(supplies));
  }, [supplies]);
  
  useEffect(() => {
    localStorage.setItem('emergency_foods', JSON.stringify(foods));
  }, [foods]);
  
  // Calculate completion percentages
  const suppliesCompletion = Math.round(
    (supplies.filter(item => item.completed).length / supplies.length) * 100
  );
  
  const foodsCompletion = Math.round(
    (foods.filter(item => item.completed).length / foods.length) * 100
  );
  
  // Toggle completion status of an item
  const toggleItemCompletion = (
    itemId: string, 
    list: ChecklistItem[], 
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
  ) => {
    setList(list.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };
  
  // Add a new item to a list
  const addNewItem = (
    text: string,
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    setNewText: React.Dispatch<React.SetStateAction<string>>,
    prefix: string
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
      id: generateId(prefix),
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
  
  // Delete an item from a list
  const deleteItem = (
    itemId: string,
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
  ) => {
    setList(list.filter(item => item.id !== itemId));
  };
  
  // Reset a list to defaults
  const resetList = (
    defaultList: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    listName: string
  ) => {
    if (window.confirm(`Are you sure you want to reset your ${listName} checklist to defaults? This will remove any custom items you've added.`)) {
      setList(defaultList);
      toast({
        title: "Reset Complete",
        description: `Your ${listName} checklist has been reset to the default items.`,
      });
    }
  };
  
  // Render a checklist section
  const renderChecklist = (
    items: ChecklistItem[],
    setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    newItemText: string,
    setNewItemText: React.Dispatch<React.SetStateAction<string>>,
    prefix: string,
    completion: number
  ) => {
    // Group the items by their category (prefix before the first dash)
    const groupedItems: Record<string, ChecklistItem[]> = {};
    
    items.forEach(item => {
      const category = item.id.split('-')[0];
      if (!groupedItems[category]) {
        groupedItems[category] = [];
      }
      groupedItems[category].push(item);
    });
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  completion === 100 ? "bg-green-500" : "bg-primary"
                )}
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-sm font-medium">{completion}%</span>
          </div>
        </div>
        
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="border rounded-lg p-4 bg-card">
            <h3 className="font-medium mb-2">
              {category === "supply" ? "Basic Supplies" :
               category === "firstaid" ? "First Aid Kit" :
               category === "meds" ? "Medications" :
               category === "comm" ? "Communication" :
               category === "other" ? "Other Essentials" :
               category === "food" ? "Non-perishable Foods" : 
               category}
            </h3>
            <ul className="space-y-2">
              {categoryItems.map(item => (
                <li key={item.id} className="flex items-start gap-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.completed}
                    onCheckedChange={() => toggleItemCompletion(item.id, items, setItems)}
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
                    onClick={() => deleteItem(item.id, items, setItems)}
                    className="h-6 w-6 opacity-50 hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add new item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addNewItem(newItemText, items, setItems, setNewItemText, prefix);
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={() => addNewItem(newItemText, items, setItems, setNewItemText, prefix)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Emergency Preparedness Checklist
        </CardTitle>
        <CardDescription>
          Keep track of essential supplies and recommended food items for emergency situations.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="supplies" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="supplies" className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" />
              <span>Supplies</span>
              <Badge variant="outline" className="ml-1">
                {supplies.filter(i => i.completed).length}/{supplies.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              <span>Food</span>
              <Badge variant="outline" className="ml-1">
                {foods.filter(i => i.completed).length}/{foods.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="supplies" className="mt-0">
            {renderChecklist(
              supplies,
              setSupplies,
              newSupplyText,
              setNewSupplyText,
              "supply",
              suppliesCompletion
            )}
          </TabsContent>
          
          <TabsContent value="food" className="mt-0">
            {renderChecklist(
              foods,
              setFoods,
              newFoodText,
              setNewFoodText,
              "food",
              foodsCompletion
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {suppliesCompletion === 100 && foodsCompletion === 100 
            ? "Great job! You're fully prepared." 
            : "Check off items as you acquire them."}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all checklists to defaults?")) {
                setSupplies(defaultSupplies);
                setFoods(defaultFoods);
                toast({
                  title: "Reset Complete",
                  description: "All checklists have been reset to default values.",
                });
              }
            }}
          >
            Reset All
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast({
                title: "Checklist Saved",
                description: "Your emergency checklists have been saved.",
              });
            }}
          >
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}