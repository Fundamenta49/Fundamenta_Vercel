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
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Default emergency supplies checklist
const defaultSupplies: ChecklistItem[] = [
  // Batteries & Lighting
  { id: "battery-1", text: "AAA Batteries", completed: false },
  { id: "battery-2", text: "AA Batteries", completed: false },
  { id: "battery-3", text: "D Batteries", completed: false },
  { id: "battery-4", text: "9V Batteries", completed: false },
  { id: "light-1", text: "Flashlights", completed: false },
  { id: "light-2", text: "Candles", completed: false },
  { id: "light-3", text: "Matches/Lighters", completed: false },
  { id: "light-4", text: "Battery Lanterns", completed: false },
  
  // Electronics & Communication
  { id: "elec-1", text: "AM/FM Radio (battery-powered)", completed: false },
  { id: "elec-2", text: "Portable Phone Charger", completed: false },
  { id: "elec-3", text: "Battery-powered Fan", completed: false },
  { id: "elec-4", text: "Whistle", completed: false },
  
  // Cooking & Heating
  { id: "cook-1", text: "Propane Stove", completed: false },
  { id: "cook-2", text: "Propane Fuel", completed: false },
  { id: "cook-3", text: "Manual Can Opener", completed: false },
  { id: "cook-4", text: "Disposable Plates/Utensils", completed: false },
  
  // Water & Storage
  { id: "water-1", text: "Bottled Water (1 gallon per person per day)", completed: false },
  { id: "water-2", text: "Water Purification Tablets", completed: false },
  { id: "water-3", text: "Water Storage Containers", completed: false },
  
  // Other Essential Items
  { id: "other-1", text: "Emergency Contact List", completed: false },
  { id: "other-2", text: "Cash in Small Denominations", completed: false },
  { id: "other-3", text: "Copies of Important Documents", completed: false },
  { id: "other-4", text: "Blankets", completed: false },
  { id: "other-5", text: "Extra Clothes", completed: false },
  { id: "other-6", text: "Rain Ponchos", completed: false }
];

// First Aid Kit items
const defaultFirstAid: ChecklistItem[] = [
  // Bandages & Wound Care
  { id: "aid-1", text: "Adhesive Bandages (various sizes)", completed: false },
  { id: "aid-2", text: "Gauze Pads (various sizes)", completed: false },
  { id: "aid-3", text: "Adhesive Tape", completed: false },
  { id: "aid-4", text: "Elastic Bandages", completed: false },
  { id: "aid-5", text: "Triangular Bandages", completed: false },
  { id: "aid-6", text: "Cotton Balls & Swabs", completed: false },
  
  // Antiseptics & Cleaners
  { id: "anti-1", text: "Alcohol Wipes", completed: false },
  { id: "anti-2", text: "Hydrogen Peroxide", completed: false },
  { id: "anti-3", text: "Antiseptic Ointment", completed: false },
  { id: "anti-4", text: "Hand Sanitizer", completed: false },
  { id: "anti-5", text: "Antibacterial Soap", completed: false },
  
  // Medications
  { id: "med-1", text: "Pain Relievers (Acetaminophen/Ibuprofen)", completed: false },
  { id: "med-2", text: "Anti-diarrhea Medication", completed: false },
  { id: "med-3", text: "Antihistamines", completed: false },
  { id: "med-4", text: "Hydrocortisone Cream", completed: false },
  { id: "med-5", text: "Personal Medications (2-week supply)", completed: false },
  { id: "med-6", text: "Prescription Information", completed: false },
  
  // Tools & Equipment
  { id: "tool-1", text: "Scissors", completed: false },
  { id: "tool-2", text: "Tweezers", completed: false },
  { id: "tool-3", text: "Thermometer", completed: false },
  { id: "tool-4", text: "Disposable Gloves", completed: false },
  { id: "tool-5", text: "Safety Pins", completed: false }
];

// Default emergency food recommendations
const defaultFoods: ChecklistItem[] = [
  // Canned Goods
  { id: "can-1", text: "Canned Vegetables", completed: false },
  { id: "can-2", text: "Canned Fruits", completed: false },
  { id: "can-3", text: "Canned Meat (Tuna, Chicken)", completed: false },
  { id: "can-4", text: "Canned Beans", completed: false },
  { id: "can-5", text: "Canned Soup", completed: false },
  { id: "can-6", text: "Canned Stew", completed: false },
  { id: "can-7", text: "Canned Pasta", completed: false },
  
  // Spreads & Condiments
  { id: "spread-1", text: "Peanut Butter", completed: false },
  { id: "spread-2", text: "Jelly/Jam", completed: false },
  { id: "spread-3", text: "Honey", completed: false },
  
  // Dry Goods & Grains
  { id: "dry-1", text: "Rice", completed: false },
  { id: "dry-2", text: "Pasta", completed: false },
  { id: "dry-3", text: "Oatmeal", completed: false },
  { id: "dry-4", text: "Cereal", completed: false },
  { id: "dry-5", text: "Crackers", completed: false },
  { id: "dry-6", text: "Granola Bars", completed: false },
  { id: "dry-7", text: "Dried Beans", completed: false },
  { id: "dry-8", text: "Flour", completed: false },
  { id: "dry-9", text: "Sugar", completed: false },
  { id: "dry-10", text: "Salt & Pepper", completed: false },
  
  // Nuts, Fruits & Snacks
  { id: "snack-1", text: "Dried Fruits", completed: false },
  { id: "snack-2", text: "Nuts and Seeds", completed: false },
  { id: "snack-3", text: "Trail Mix", completed: false },
  { id: "snack-4", text: "Jerky", completed: false },
  
  // Beverages & Milk
  { id: "drink-1", text: "Bottled Water", completed: false },
  { id: "drink-2", text: "Powdered Milk", completed: false },
  { id: "drink-3", text: "Coffee/Tea", completed: false },
  { id: "drink-4", text: "Powdered Juice/Drink Mixes", completed: false },
  { id: "drink-5", text: "Sports Drinks", completed: false }
];

export default function SimpleEmergencyChecklist() {
  const { toast } = useToast();
  
  // States for the supply checklist, first aid kit, and food checklist
  const [supplies, setSupplies] = useState<ChecklistItem[]>(() => {
    const savedSupplies = localStorage.getItem('emergency_supplies');
    return savedSupplies ? JSON.parse(savedSupplies) : defaultSupplies;
  });
  
  const [firstAid, setFirstAid] = useState<ChecklistItem[]>(() => {
    const savedFirstAid = localStorage.getItem('emergency_firstaid');
    return savedFirstAid ? JSON.parse(savedFirstAid) : defaultFirstAid;
  });
  
  const [foods, setFoods] = useState<ChecklistItem[]>(() => {
    const savedFoods = localStorage.getItem('emergency_foods');
    return savedFoods ? JSON.parse(savedFoods) : defaultFoods;
  });
  
  // State for adding new items
  const [newSupplyText, setNewSupplyText] = useState("");
  const [newFirstAidText, setNewFirstAidText] = useState("");
  const [newFoodText, setNewFoodText] = useState("");
  
  // Save to localStorage whenever checklists change
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
  const suppliesCompletion = Math.round(
    (supplies.filter(item => item.completed).length / supplies.length) * 100
  );
  
  const firstAidCompletion = Math.round(
    (firstAid.filter(item => item.completed).length / firstAid.length) * 100
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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="supplies" className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" />
              <span>Supplies</span>
              <Badge variant="outline" className="ml-1">
                {supplies.filter(i => i.completed).length}/{supplies.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="firstaid" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>First Aid</span>
              <Badge variant="outline" className="ml-1">
                {firstAid.filter(i => i.completed).length}/{firstAid.length}
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
          
          <TabsContent value="firstaid" className="mt-0">
            {renderChecklist(
              firstAid,
              setFirstAid,
              newFirstAidText,
              setNewFirstAidText,
              "firstaid",
              firstAidCompletion
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
          {suppliesCompletion === 100 && firstAidCompletion === 100 && foodsCompletion === 100 
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
                setFirstAid(defaultFirstAid);
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