import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ListPlus, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

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
  // Batteries & Power
  { id: "battery-1", text: "AAA Batteries", completed: false },
  { id: "battery-2", text: "AA Batteries", completed: false },
  { id: "battery-3", text: "D Batteries", completed: false },
  { id: "battery-4", text: "9V Batteries", completed: false },
  
  // Lighting & Flashlights
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

interface AbsoluteFullscreenEmergencyChecklistProps {
  onClose: () => void;
}

export default function AbsoluteFullscreenEmergencyChecklist({ onClose }: AbsoluteFullscreenEmergencyChecklistProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // States for the different checklist categories
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
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<string>("supplies");
  
  // New item input states
  const [newItemText, setNewItemText] = useState<string>("");
  
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
  const suppliesCompletionCount = supplies.filter(item => item.completed).length;
  const firstAidCompletionCount = firstAid.filter(item => item.completed).length;
  const foodsCompletionCount = foods.filter(item => item.completed).length;
  
  const suppliesCompletion = Math.round((suppliesCompletionCount / supplies.length) * 100);
  const firstAidCompletion = Math.round((firstAidCompletionCount / firstAid.length) * 100);
  const foodsCompletion = Math.round((foodsCompletionCount / foods.length) * 100);
  
  const totalCompletion = Math.round(
    ((suppliesCompletionCount + firstAidCompletionCount + foodsCompletionCount) / 
    (supplies.length + firstAid.length + foods.length)) * 100
  );
  
  // Group items by category
  const groupItemsByCategory = (items: ChecklistItem[]) => {
    const grouped: Record<string, ChecklistItem[]> = {};
    
    items.forEach(item => {
      const category = item.id.split('-')[0];
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    
    return grouped;
  };
  
  // Get category name for display
  const getCategoryName = (category: string) => {
    switch(category) {
      case "battery": return "Batteries & Power";
      case "light": return "Lighting & Flashlights";
      case "elec": return "Electronics & Communication";
      case "cook": return "Cooking & Heating";
      case "water": return "Water & Storage";
      case "other": return "Other Essentials";
      case "aid": return "Bandages & Wound Care";
      case "anti": return "Antiseptics & Cleaners";
      case "med": return "Medications";
      case "tool": return "Tools & Equipment";
      case "can": return "Canned Goods";
      case "spread": return "Spreads & Condiments";
      case "dry": return "Dry Goods & Grains";
      case "snack": return "Nuts, Fruits & Snacks";
      case "drink": return "Beverages & Milk";
      default: return category;
    }
  };
  
  // Toggle item completion
  const toggleItemCompletion = (
    itemId: string, 
    list: ChecklistItem[], 
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
  ) => {
    setList(list.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };
  
  // Add new item
  const handleAddItem = (category: string) => {
    if (!newItemText.trim()) {
      toast({
        title: "Error",
        description: "Item text cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const newItem: ChecklistItem = {
      id: generateId(category),
      text: newItemText.trim(),
      completed: false
    };
    
    let listToUpdate: ChecklistItem[];
    let setListFunction: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
    
    // Determine which list to update based on active tab
    if (activeTab === "supplies") {
      listToUpdate = supplies;
      setListFunction = setSupplies;
    } else if (activeTab === "firstaid") {
      listToUpdate = firstAid;
      setListFunction = setFirstAid;
    } else {
      listToUpdate = foods;
      setListFunction = setFoods;
    }
    
    setListFunction([...listToUpdate, newItem]);
    setNewItemText("");
    
    toast({
      title: "Item Added",
      description: `${newItemText} has been added to your checklist.`,
    });
  };
  
  // Delete an item
  const deleteItem = (
    itemId: string,
    list: ChecklistItem[],
    setList: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
  ) => {
    setList(list.filter(item => item.id !== itemId));
  };
  
  // Reset lists to defaults
  const resetAllLists = () => {
    if (window.confirm("Are you sure you want to reset all checklists to defaults? This will remove any custom items you've added.")) {
      setSupplies(defaultSupplies);
      setFirstAid(defaultFirstAid);
      setFoods(defaultFoods);
      
      toast({
        title: "Reset Complete",
        description: "All checklists have been reset to default values.",
      });
    }
  };
  
  // Save all lists
  const saveAllLists = () => {
    // Lists are already being saved via useEffect hooks
    toast({
      title: "Checklists Saved",
      description: "Your emergency checklists have been saved.",
    });
  };
  
  // Render checklist for current tab
  const renderCurrentChecklist = () => {
    let items: ChecklistItem[];
    let setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
    let completion: number;
    let completionCount: number;
    
    // Set variables based on active tab
    if (activeTab === "supplies") {
      items = supplies;
      setItems = setSupplies;
      completion = suppliesCompletion;
      completionCount = suppliesCompletionCount;
    } else if (activeTab === "firstaid") {
      items = firstAid;
      setItems = setFirstAid;
      completion = firstAidCompletion;
      completionCount = firstAidCompletionCount;
    } else {
      items = foods;
      setItems = setFoods;
      completion = foodsCompletion;
      completionCount = foodsCompletionCount;
    }
    
    const groupedItems = groupItemsByCategory(items);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Progress value={completion} className="h-2 flex-1" />
          <Badge variant="outline" className="font-mono">
            {completionCount}/{items.length}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="border border-red-100 rounded-lg p-4 bg-white">
              <h3 className="font-medium text-red-700 border-b border-red-100 pb-1 mb-2">
                {getCategoryName(category)}
              </h3>
              
              <ul className="space-y-2">
                {categoryItems.map(item => (
                  <li key={item.id} className="flex items-start gap-2">
                    <Checkbox 
                      id={item.id} 
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(item.id, items, setItems)}
                      className={cn(
                        "mt-1 border-red-300",
                        item.completed && "bg-green-500 text-white border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                      )}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={item.id}
                        className={cn(
                          "text-sm font-normal cursor-pointer text-red-900",
                          item.completed && "line-through text-green-700"
                        )}
                      >
                        {item.text}
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteItem(item.id, items, setItems)}
                      className="h-6 w-6 opacity-50 hover:opacity-100 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Emergency Preparedness Checklist</h2>
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
        <div className="flex flex-col gap-2">
          <p className="text-sm text-red-600/80">
            Keep track of essential supplies and recommended food items for emergency situations.
          </p>
          
          <div className="flex items-center gap-2 mt-1">
            <Progress value={totalCompletion} className="h-2 flex-1" />
            <span className="text-sm font-medium whitespace-nowrap">{totalCompletion}%</span>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-4 flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-3 mb-4 bg-red-100/50">
            <TabsTrigger 
              value="supplies" 
              className="flex items-center gap-1 data-[state=active]:bg-red-200/70 data-[state=active]:text-red-800"
            >
              <span>Supplies</span>
              <Badge variant="outline" className="ml-1 bg-white/80">
                {suppliesCompletionCount}/{supplies.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="firstaid" 
              className="flex items-center gap-1 data-[state=active]:bg-red-200/70 data-[state=active]:text-red-800"
            >
              <span>First Aid</span>
              <Badge variant="outline" className="ml-1 bg-white/80">
                {firstAidCompletionCount}/{firstAid.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="food" 
              className="flex items-center gap-1 data-[state=active]:bg-red-200/70 data-[state=active]:text-red-800"
            >
              <span>Food</span>
              <Badge variant="outline" className="ml-1 bg-white/80">
                {foodsCompletionCount}/{foods.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto pb-4">
            <TabsContent value="supplies" className="mt-0 h-full">
              {renderCurrentChecklist()}
            </TabsContent>
            
            <TabsContent value="firstaid" className="mt-0 h-full">
              {renderCurrentChecklist()}
            </TabsContent>
            
            <TabsContent value="food" className="mt-0 h-full">
              {renderCurrentChecklist()}
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex items-center mt-4 pt-4 border-t border-red-100 justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const category = activeTab === "supplies" ? "other" : 
                                  activeTab === "firstaid" ? "aid" : "can";
                  handleAddItem(category);
                }
              }}
              className="w-64 text-sm h-8 border-red-200 focus-visible:ring-red-400"
            />
            <Button
              onClick={() => {
                const category = activeTab === "supplies" ? "other" : 
                              activeTab === "firstaid" ? "aid" : "can";
                handleAddItem(category);
              }}
              size="sm"
              className="h-8 px-2 bg-red-400 hover:bg-red-500 flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline" 
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={resetAllLists}
            >
              Reset All
            </Button>
            <Button
              size="sm"
              className="bg-red-400 hover:bg-red-500"
              onClick={saveAllLists}
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}