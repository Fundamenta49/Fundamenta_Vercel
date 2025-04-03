import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clipboard, FileUp, Plus, ShoppingBag, Trash2, UtensilsCrossed, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GroceryItem {
  name: string;
  quantity: string;
  estimatedCost: number;
  category?: string;
}

interface CustomGroceryListProps {
  onGroceryListGenerated?: (items: GroceryItem[]) => void;
}

export default function CustomGroceryList({ onGroceryListGenerated }: CustomGroceryListProps) {
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [newItem, setNewItem] = useState<string>("");
  const [newQty, setNewQty] = useState<string>("");
  const [newCost, setNewCost] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [recipeText, setRecipeText] = useState<string>("");
  const [servings, setServings] = useState<number>(1);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [recipeTitle, setRecipeTitle] = useState<string>("");
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add a new item manually
  const addItem = () => {
    if (!newItem.trim()) {
      setError("Item name is required");
      return;
    }

    const cost = parseFloat(newCost || "0");
    if (isNaN(cost) || cost < 0) {
      setError("Cost must be a valid number");
      return;
    }

    const newGroceryItem: GroceryItem = {
      name: newItem.trim(),
      quantity: newQty.trim() || "1",
      estimatedCost: cost,
      category: newCategory.trim() || "Other"
    };

    setGroceryItems(prev => [...prev, newGroceryItem]);
    setNewItem("");
    setNewQty("");
    setNewCost("");
    setNewCategory("");
    setError("");
  };

  // Remove an item from the list
  const removeItem = (index: number) => {
    setGroceryItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate the total cost of all items
  const totalCost = groceryItems.reduce((sum, item) => sum + item.estimatedCost, 0);

  // Parse recipe from text or file
  const parseRecipe = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!recipeText.trim() && !fileInputRef.current?.files?.length) {
      setError("Please enter a recipe or upload a recipe file");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('servings', servings.toString());
      
      if (recipeText.trim()) {
        formData.append('recipeText', recipeText);
      } else if (fileInputRef.current?.files?.length) {
        formData.append('recipeFile', fileInputRef.current.files[0]);
      }

      const response = await fetch('/api/shopping/parse-recipe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse recipe');
      }

      const data = await response.json();
      setGroceryItems(data.items || []);
      setRecipeTitle(data.recipeTitle || "");
      setMessage(`Successfully parsed recipe: ${data.recipeTitle}`);
    } catch (error) {
      console.error('Error parsing recipe:', error);
      setError("Failed to parse recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save the grocery list to the server
  const saveGroceryList = async () => {
    if (groceryItems.length === 0) {
      setError("Your grocery list is empty");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shopping/custom-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: groceryItems }),
      });

      if (!response.ok) {
        throw new Error('Failed to save grocery list');
      }

      const data = await response.json();
      setMessage("Grocery list saved successfully!");
      
      // Notify parent component if callback provided
      if (onGroceryListGenerated) {
        onGroceryListGenerated(groceryItems);
      }
    } catch (error) {
      console.error('Error saving grocery list:', error);
      setError("Failed to save grocery list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy the grocery list to clipboard
  const copyToClipboard = () => {
    if (groceryItems.length === 0) {
      setError("Your grocery list is empty");
      return;
    }

    try {
      const title = recipeTitle ? `# ${recipeTitle} (${servings} servings)\n\n` : "# My Grocery List\n\n";
      
      // Group items by category
      const categorizedItems: { [key: string]: GroceryItem[] } = {};
      groceryItems.forEach(item => {
        const category = item.category || "Other";
        if (!categorizedItems[category]) {
          categorizedItems[category] = [];
        }
        categorizedItems[category].push(item);
      });

      // Format the text
      let text = title;
      Object.entries(categorizedItems).forEach(([category, items]) => {
        text += `## ${category}\n`;
        items.forEach(item => {
          text += `- ${item.quantity} ${item.name} ($${item.estimatedCost.toFixed(2)})\n`;
        });
        text += "\n";
      });

      text += `## Total: $${totalCost.toFixed(2)}`;

      // Copy to clipboard
      navigator.clipboard.writeText(text);
      setCopiedToClipboard(true);
      setMessage("Copied to clipboard!");

      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setCopiedToClipboard(false);
      }, 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setError("Failed to copy to clipboard. Please try again.");
    }
  };

  // Clear all items from the list
  const clearList = () => {
    if (window.confirm("Are you sure you want to clear your grocery list?")) {
      setGroceryItems([]);
      setRecipeTitle("");
      setMessage("Grocery list cleared");
    }
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear any existing recipe text if a file is uploaded
      setRecipeText("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Custom Grocery List Builder
        </CardTitle>
        <CardDescription>
          Create your own grocery list by adding items or uploading a recipe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Add Items Manually</TabsTrigger>
            <TabsTrigger value="recipe">Parse from Recipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g., Organic Tomatoes"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="item-quantity">Quantity</Label>
                  <Input
                    id="item-quantity"
                    placeholder="e.g., 2 lbs"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <Label htmlFor="item-cost">Estimated Cost ($)</Label>
                  <Input
                    id="item-cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 3.99"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="item-category">Category</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger id="item-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Produce">Produce</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Meat">Meat</SelectItem>
                      <SelectItem value="Seafood">Seafood</SelectItem>
                      <SelectItem value="Grains">Grains & Bread</SelectItem>
                      <SelectItem value="Pantry">Pantry</SelectItem>
                      <SelectItem value="Spices">Spices & Seasonings</SelectItem>
                      <SelectItem value="Frozen">Frozen</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Baking">Baking</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full mt-2" 
                onClick={addItem} 
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recipe" className="space-y-4">
            <form onSubmit={parseRecipe} className="space-y-4">
              <div>
                <Label htmlFor="recipe-text">Paste Your Recipe</Label>
                <Textarea
                  id="recipe-text"
                  placeholder="Paste your recipe here, including ingredients and instructions..."
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="recipe-file">Or Upload a Recipe File</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="recipe-file"
                    type="file"
                    accept=".txt,.md,.rtf,.doc,.docx"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <FileUp className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="servings">Number of Servings</Label>
                <div className="flex space-x-2">
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                  />
                  <Button type="submit" disabled={loading} className="flex-shrink-0">
                    {loading ? "Parsing..." : "Parse Recipe"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {message && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}
        
        {recipeTitle && (
          <div className="mt-4">
            <h3 className="font-medium text-lg">{recipeTitle} ({servings} servings)</h3>
          </div>
        )}
        
        {groceryItems.length > 0 && (
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Your Grocery List</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={loading}>
                  <Clipboard className={`h-4 w-4 mr-2 ${copiedToClipboard ? 'text-green-500' : ''}`} />
                  {copiedToClipboard ? "Copied!" : "Copy List"}
                </Button>
                <Button variant="outline" size="sm" onClick={clearList} disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
            
            {/* Group items by category */}
            {Object.entries(
              groceryItems.reduce((acc, item) => {
                const category = item.category || "Other";
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(item);
                return acc;
              }, {} as { [key: string]: GroceryItem[] })
            ).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                {items.map((item, index) => {
                  const itemIndex = groceryItems.findIndex(i => i === item);
                  return (
                    <div key={`${category}-${index}`} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.quantity}</Badge>
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${item.estimatedCost.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(itemIndex)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          className="w-full sm:w-auto" 
          onClick={saveGroceryList}
          disabled={loading || groceryItems.length === 0}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Save Grocery List
        </Button>
        
        {groceryItems.length > 0 && (
          <Button 
            className="w-full sm:w-auto" 
            variant="outline"
            onClick={() => {
              if (onGroceryListGenerated) {
                onGroceryListGenerated(groceryItems);
              }
              setMessage("List sent to recipe finder!");
            }}
          >
            <UtensilsCrossed className="h-4 w-4 mr-2" />
            Find Recipes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}