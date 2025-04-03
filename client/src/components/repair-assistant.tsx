import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera, Upload, Wrench, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

interface RepairPart {
  name: string;
  estimatedPrice: number;
}

interface RepairAnalysis {
  itemIdentified: string;
  problemIdentified: string;
  causeLikely: string;
  partsNeeded: RepairPart[];
  toolsNeeded: string[];
  difficultyLevel: string;
  repairInstructions: string[];
}

interface StorePartAvailability {
  name: string;
  price: number;
  inStock: boolean;
  deal: string | null;
}

interface Store {
  storeName: string;
  distance: string;
  address: string;
  partsAvailability: StorePartAvailability[];
}

interface StoreData {
  stores: Store[];
}

export function RepairAssistant() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [repairAnalysis, setRepairAnalysis] = useState<RepairAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isSearchingParts, setIsSearchingParts] = useState(false);
  const { toast } = useToast();

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Reset previous analysis
      setRepairAnalysis(null);
      setStoreData(null);
      
      // Set the selected image
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Take a photo with camera
  const handleCameraCapture = () => {
    // Clear previous image and analysis
    setSelectedImage(null);
    setImageUrl(null);
    setRepairAnalysis(null);
    setStoreData(null);
    
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use the back camera if available
    
    // Add an event listener to handle the selected image
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setSelectedImage(file);
        setImageUrl(URL.createObjectURL(file));
      }
    });
    
    // Trigger the file input
    input.click();
  };

  // Analyze the image for repair information
  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select or take a photo of the broken item first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeProgress(0);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);

    try {
      // Create form data for the image
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Send the image to the API for analysis
      const response = await axios.post('/api/repair/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRepairAnalysis(response.data);
      
      // Set progress to 100% when analysis is complete
      clearInterval(progressInterval);
      setAnalyzeProgress(100);
      
      toast({
        title: "Analysis complete",
        description: `We've identified the item as: ${response.data.itemIdentified}`,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze the image. Please try again with a clearer photo.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Find parts availability at nearby stores
  const findPartsInStores = async () => {
    if (!repairAnalysis || !repairAnalysis.partsNeeded || repairAnalysis.partsNeeded.length === 0) {
      toast({
        title: "No parts to search for",
        description: "Please analyze an image first to identify needed parts.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingParts(true);

    try {
      // Send parts list to the API to find availability
      const response = await axios.post('/api/repair/find-parts', {
        parts: repairAnalysis.partsNeeded,
        location: "current", // In a real app, we'd use geolocation
      });

      setStoreData(response.data);
      
      toast({
        title: "Parts search complete",
        description: `Found parts availability in ${response.data.stores.length} nearby stores.`,
      });
    } catch (error) {
      console.error("Error finding parts:", error);
      toast({
        title: "Parts search failed",
        description: "We couldn't find parts availability information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingParts(false);
    }
  };

  // Get difficulty level badge color
  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-amber-500';
      case 'hard': return 'bg-orange-500';
      case 'pro': 
      case 'professional only': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Smart Repair Assistant
          </CardTitle>
          <CardDescription>
            Upload a photo of a broken item for repair guidance and parts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image upload section */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="image-upload">Take or upload a photo:</Label>
            <div className="flex gap-2">
              <Button 
                onClick={handleCameraCapture}
                variant="outline"
                size="sm"
                className="flex gap-2"
              >
                <Camera className="h-4 w-4" />
                <span>Take Photo</span>
              </Button>
              <div className="relative">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button 
                  onClick={() => document.getElementById('image-upload')?.click()}
                  variant="outline"
                  size="sm"
                  className="flex gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Preview of selected image */}
          {imageUrl && (
            <div className="mt-4">
              <Label>Selected Image</Label>
              <div className="mt-2 relative border rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Selected item" 
                  className="w-full max-h-60 object-contain" 
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="relative"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze for Repair"}
                </Button>
              </div>
              
              {isAnalyzing && (
                <div className="mt-2">
                  <Progress value={analyzeProgress} className="w-full h-2" />
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    {analyzeProgress < 100 ? "Analyzing image..." : "Analysis complete!"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Repair Analysis Results */}
          {repairAnalysis && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>Repair Analysis</span>
                <Badge className={getDifficultyColor(repairAnalysis.difficultyLevel)}>
                  {repairAnalysis.difficultyLevel}
                </Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Item Identified:</Label>
                    <p className="font-medium">{repairAnalysis.itemIdentified}</p>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Problem:</Label>
                    <p>{repairAnalysis.problemIdentified}</p>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Likely Cause:</Label>
                    <p>{repairAnalysis.causeLikely}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Parts Needed:</Label>
                    <ul className="list-disc pl-5 mt-1">
                      {repairAnalysis.partsNeeded.map((part, index) => (
                        <li key={index} className="text-sm">
                          {part.name} 
                          {part.estimatedPrice > 0 && (
                            <span className="text-muted-foreground"> (~${part.estimatedPrice.toFixed(2)})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Tools Needed:</Label>
                    <ul className="list-disc pl-5 mt-1">
                      {repairAnalysis.toolsNeeded.map((tool, index) => (
                        <li key={index} className="text-sm">{tool}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Repair Instructions */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="instructions">
                  <AccordionTrigger>Repair Instructions</AccordionTrigger>
                  <AccordionContent>
                    <ol className="pl-5 space-y-2 mt-2">
                      {repairAnalysis.repairInstructions.map((step, index) => (
                        <li key={index} className="list-decimal text-sm">{step}</li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Find Parts Button */}
              <div className="flex justify-end">
                <Button
                  onClick={findPartsInStores}
                  variant="outline"
                  disabled={isSearchingParts}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {isSearchingParts ? "Searching..." : "Find Parts in Nearby Stores"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Store Availability Results */}
          {storeData && storeData.stores.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Parts Availability</h3>
              
              {storeData.stores.map((store, storeIndex) => (
                <Card key={storeIndex} className="overflow-hidden">
                  <CardHeader className="pb-2 bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{store.storeName}</CardTitle>
                        <CardDescription>{store.address}</CardDescription>
                      </div>
                      <Badge variant="outline">{store.distance}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {store.partsAvailability.map((part, partIndex) => (
                        <div key={partIndex} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span>{part.name}</span>
                            {part.inStock ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">In Stock</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">Out of Stock</Badge>
                            )}
                          </div>
                          <div className="font-medium">
                            ${part.price.toFixed(2)}
                            {part.deal && (
                              <Badge className="ml-2 bg-blue-500 text-xs">{part.deal}</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2">
          <Button 
            variant="ghost"
            onClick={() => {
              setSelectedImage(null);
              setImageUrl(null);
              setRepairAnalysis(null);
              setStoreData(null);
            }}
          >
            Start Over
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RepairAssistant;