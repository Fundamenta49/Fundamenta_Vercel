import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  MapPin,
  TrendingDown,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface StoreComparison {
  storeName: string;
  distance: string;
  prices: {
    item: string;
    price: number;
    deal?: string;
  }[];
}

const mealPrepTips = [
  {
    title: "Prep Basics",
    tips: [
      "Choose 2-3 proteins to cook",
      "Roast multiple vegetables at once",
      "Cook grains in bulk",
      "Use similar ingredients across meals",
      "Store properly in airtight containers"
    ]
  },
  {
    title: "Time-Saving Tricks",
    tips: [
      "Chop vegetables in advance",
      "Use sheet pan meals",
      "Cook proteins in slow cooker",
      "Prepare overnight oats",
      "Use mason jar salads"
    ]
  }
];

export default function ShoppingBuddy() {
  const [location, setLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [storeComparisons, setStoreComparisons] = useState<StoreComparison[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [storeError, setStoreError] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [groceryPreferences, setGroceryPreferences] = useState({
    diet: "",
    budget: "",
    meals: 0,
    restrictions: ""
  });

  const [generatedList, setGeneratedList] = useState<{
    items: Array<{ name: string; estimatedCost: number }>;
    totalCost: number;
    suggestions: string[];
  }>({
    items: [],
    totalCost: 0,
    suggestions: []
  });

  const commonProducts = [
    "Milk", "Bread", "Eggs", "Chicken", "Rice",
    "Pasta", "Apples", "Bananas", "Tomatoes", "Potatoes",
    "Onions", "Cheese", "Yogurt", "Coffee", "Cereal"
  ];

  const searchNearbyStores = async (latitude: number, longitude: number) => {
    setIsLoadingStores(true);
    setStoreError("");

    try {
      // Call our API endpoint to get nearby stores with product prices
      const response = await fetch('/api/shopping/nearby-stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          products: selectedProducts.length > 0 ? selectedProducts : commonProducts
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch store data');
      }

      const data = await response.json();
      
      // If the response has a stores property, use it; otherwise assume the whole response is the stores array
      const stores = data.stores || data;
      
      if (!Array.isArray(stores)) {
        throw new Error('Invalid store data format');
      }
      
      setStoreComparisons(stores);
    } catch (error) {
      console.error('Error fetching store data:', error);
      setStoreError("Failed to fetch nearby stores. Please try again.");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleLocationSearch = (manualLocation: string) => {
    setLocation(manualLocation);
    // In a real app, we would geocode the address here
    // For now, just simulate some coordinates
    searchNearbyStores(37.7749, -122.4194);
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        searchNearbyStores(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location. Please enter it manually.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const generateGroceryList = async () => {
    try {
      // Show loading state
      setGeneratedList({
        items: [],
        totalCost: 0,
        suggestions: ['Generating your personalized grocery list...']
      });
      
      // Call our new API endpoint
      const response = await fetch('/api/shopping/generate-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groceryPreferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate grocery list');
      }
      
      const data = await response.json();
      
      // Calculate total cost if not provided
      const totalCost = data.totalCost || 
        data.items.reduce((sum: number, item: { estimatedCost: number }) => 
          sum + item.estimatedCost, 0);
      
      // Update state with the AI-generated list
      setGeneratedList({
        items: data.items,
        totalCost,
        suggestions: data.suggestions
      });
    } catch (error) {
      console.error('Error generating grocery list:', error);
      
      // Fallback to static data if API fails
      setGeneratedList({
        items: [
          { name: "Error occurred", estimatedCost: 0 }
        ],
        totalCost: 0,
        suggestions: [
          "We couldn't generate your list at this time. Please try again later.",
          "Check your internet connection and try again."
        ]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Meal Prep Guide */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-purple-500" />
            Meal Prep Guide for Beginners
          </CardTitle>
          <CardDescription>
            Quick and easy batch cooking tips for healthy eating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mealPrepTips.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium text-lg">{section.title}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Grocery List Generator */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-500" />
            Smart Grocery List Generator
          </CardTitle>
          <CardDescription>
            Get a personalized shopping list based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={groceryPreferences.diet}
            onValueChange={(value) => setGroceryPreferences(prev => ({ ...prev, diet: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={groceryPreferences.budget}
            onValueChange={(value) => setGroceryPreferences(prev => ({ ...prev, budget: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Weekly budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-low">Under $30</SelectItem>
              <SelectItem value="low">$30-50</SelectItem>
              <SelectItem value="medium">$50-100</SelectItem>
              <SelectItem value="high">$100-150</SelectItem>
              <SelectItem value="very-high">$150+</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Any dietary restrictions or allergies?"
            value={groceryPreferences.restrictions}
            onChange={(e) => setGroceryPreferences(prev => ({ ...prev, restrictions: e.target.value }))}
          />

          <Button
            className="w-full"
            onClick={generateGroceryList}
            disabled={!groceryPreferences.diet || !groceryPreferences.budget}
          >
            Generate Shopping List
          </Button>

          {generatedList.items.length > 0 && (
            <div className="space-y-4 mt-4 p-4 border rounded-md">
              <h3 className="font-medium">Your Personalized Shopping List:</h3>
              <div className="space-y-2">
                {generatedList.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">${item.estimatedCost.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Estimated Total:</span>
                    <span>${generatedList.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Shopping Tips:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {generatedList.suggestions.map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Selection */}
      <Card className="border-teal-200 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-teal-500" />
            Select Products to Compare
          </CardTitle>
          <CardDescription>
            Choose items you want to compare prices for across stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonProducts.map((product) => (
              <Badge
                key={product}
                variant={selectedProducts.includes(product) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedProducts(prev =>
                    prev.includes(product)
                      ? prev.filter(p => p !== product)
                      : [...prev, product]
                  );
                }}
              >
                {product}
              </Badge>
            ))}
          </div>
          {selectedProducts.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected {selectedProducts.length} items to compare
            </p>
          )}
        </CardContent>
      </Card>

      {/* Store Price Comparison */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-teal-500" />
            Smart Price Comparison
          </CardTitle>
          <CardDescription>
            Find the best deals on groceries at stores near you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  const inputElement = e.currentTarget;
                  handleLocationSearch(inputElement.value);
                }
              }}
              className="flex-1"
            />
            <Button
              variant="outline"
              className="shrink-0"
              onClick={getCurrentLocation}
              disabled={isLocating}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isLocating ? "Locating..." : "Use Current Location"}
            </Button>
          </div>

          {locationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {storeError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{storeError}</AlertDescription>
            </Alert>
          )}

          {location && (
            <Alert className="bg-teal-50 border-teal-200">
              <MapPin className="h-4 w-4 text-teal-600" />
              <AlertDescription className="text-teal-800">
                {isLoadingStores ? (
                  "Finding stores near your location..."
                ) : (
                  `Showing stores near: ${location}`
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {isLoadingStores ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading nearby stores...</p>
              </div>
            ) : (
              storeComparisons.map((store, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{store.storeName}</span>
                      <span className="text-sm text-muted-foreground">{store.distance}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {store.prices
                        .filter(item => selectedProducts.length === 0 || selectedProducts.includes(item.item))
                        .map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between">
                            <span>{item.item}</span>
                            <div className="text-right">
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                              {item.deal && (
                                <Badge variant="secondary" className="ml-2">
                                  {item.deal}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Money-Saving Tips:</h3>
            <ul className="space-y-1">
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Best time to shop: Early mornings for fresh markdowns
              </li>
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Compare unit prices instead of package prices
              </li>
              <li className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Check store flyers for weekly specials
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}