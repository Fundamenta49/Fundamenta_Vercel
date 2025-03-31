import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ExternalLink, Info, AlertCircle, CheckCircle, Play, Utensils, Scissors, CookingPot, Cookie, UtensilsCrossed, Plug } from 'lucide-react';
import { VideoPlayerDialog } from '@/components/video-player-dialog';

interface KitchenTool {
  id: string;
  name: string;
  description: string;
  image: string;
  essential: boolean;
  price: 'budget' | 'moderate' | 'premium';
  category: 'cutting' | 'cookware' | 'bakeware' | 'tools' | 'appliances';
  uses: string[];
  tips: string[];
  videoId?: string;
  videoTitle?: string;
}

interface KitchenToolProps {
  tool: KitchenTool;
}

// Define category icons
const categoryIcons = {
  cutting: Scissors,
  cookware: CookingPot,
  bakeware: Cookie,
  tools: UtensilsCrossed,
  appliances: Plug,
  all: Utensils
};

const KitchenEssentials = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<KitchenTool | null>(null);
  const [videoDialog, setVideoDialog] = useState<{open: boolean, videoId: string, title: string}>({
    open: false,
    videoId: '',
    title: ''
  });

  // Kitchen tools data
  const kitchenTools: KitchenTool[] = [
    {
      id: 'chefs-knife',
      name: "Chef's Knife",
      description: "The workhorse of the kitchen, useful for chopping, slicing, dicing, and mincing.",
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'moderate',
      category: 'cutting',
      uses: [
        "Chopping vegetables",
        "Slicing meats",
        "General cutting tasks",
        "Dicing onions and herbs"
      ],
      tips: [
        "Look for a blade that's 8-10 inches long",
        "Full tang construction (the metal extends through the handle) is best for durability",
        "Keep it sharp - a dull knife is more dangerous than a sharp one",
        "Hand wash and dry immediately to maintain edge and prevent rust"
      ],
      videoId: "1AxLzn3fGxk", // YouTube ID for knife skills tutorial
      videoTitle: "Essential Knife Skills - Chef's Knife Tutorial"
    },
    {
      id: 'cutting-board',
      name: "Cutting Board",
      description: "Essential surface for food preparation and cutting.",
      image: "https://images.unsplash.com/photo-1590401692339-8ea5c9d11204?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'cutting',
      uses: [
        "Provides a safe surface for cutting",
        "Protects countertops from damage",
        "Can be used as a serving platter for charcuterie"
      ],
      tips: [
        "Wood or bamboo boards are gentle on knife edges",
        "Plastic boards are dishwasher safe but can harbor bacteria in deep cuts",
        "Use separate boards for raw meat and vegetables to prevent cross-contamination",
        "Dampen a paper towel and place under the board to prevent slipping"
      ]
    },
    {
      id: 'stainless-skillet',
      name: "Stainless Steel Skillet",
      description: "Versatile pan for searing, sautéing, and making pan sauces.",
      image: "https://images.unsplash.com/photo-1575318634028-6a0cfcb60c1f?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'moderate',
      category: 'cookware',
      uses: [
        "Searing meats",
        "Sautéing vegetables",
        "Making pan sauces",
        "Cooking eggs and pancakes"
      ],
      tips: [
        "Look for tri-ply or fully-clad construction for even heating",
        "10-12 inch size is most versatile",
        "Preheat the pan before adding oil to prevent sticking",
        "Allow food to develop a crust before attempting to flip it"
      ],
      videoId: "X1XoCQm5JSQ", // YouTube ID for how to use a skillet
      videoTitle: "How to Cook with a Stainless Steel Skillet - Tips & Techniques"
    },
    {
      id: 'nonstick-pan',
      name: "Non-Stick Pan",
      description: "Perfect for eggs, pancakes, and delicate foods that might stick.",
      image: "https://images.unsplash.com/photo-1621766565084-441673a0ec80?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'cookware',
      uses: [
        "Cooking eggs",
        "Making pancakes and crepes",
        "Cooking delicate fish fillets",
        "Low-fat cooking with minimal oil"
      ],
      tips: [
        "Use only with wooden or silicone utensils to avoid scratching",
        "Avoid high heat which can release toxic fumes",
        "Don't use metal utensils which can scratch the coating",
        "Replace every few years as the coating wears down"
      ]
    },
    {
      id: 'dutch-oven',
      name: "Dutch Oven",
      description: "Heavy pot for soups, stews, braising, and even baking bread.",
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=500&auto=format&fit=crop",
      essential: false,
      price: 'premium',
      category: 'cookware',
      uses: [
        "Making soups and stews",
        "Braising tough cuts of meat",
        "Baking artisan bread",
        "Deep frying"
      ],
      tips: [
        "Enameled cast iron is easiest to maintain",
        "5-7 quart size is most versatile for most households",
        "Can go from stovetop to oven",
        "Heavy lids trap moisture for perfect braising"
      ],
      videoId: "QF7yTC4yq80", // YouTube ID for dutch oven cooking
      videoTitle: "Dutch Oven Cooking Techniques - Soups, Stews & Bread"
    },
    {
      id: 'mixing-bowls',
      name: "Mixing Bowls",
      description: "Set of bowls in various sizes for mixing, preparation, and serving.",
      image: "https://images.unsplash.com/photo-1590528987431-4dfd359055e9?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Mixing ingredients",
        "Marinating foods",
        "Serving salads or popcorn",
        "Whisking dressings or batters"
      ],
      tips: [
        "Stainless steel bowls are lightweight and durable",
        "Nested sets save storage space",
        "Bowls with silicone bottoms won't slip",
        "Look for bowls with measurements marked inside"
      ]
    },
    {
      id: 'measuring-tools',
      name: "Measuring Cups & Spoons",
      description: "Essential for following recipes accurately.",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Measuring dry ingredients",
        "Measuring liquid ingredients",
        "Portioning spices",
        "Ensuring recipe success"
      ],
      tips: [
        "Get two sets: one for dry and one for liquid ingredients",
        "Stainless steel is durable and won't retain odors",
        "Level off dry ingredients with a straight edge",
        "Liquid measuring cups should be read at eye level"
      ]
    },
    {
      id: 'baking-sheet',
      name: "Baking Sheet",
      description: "Flat pan essential for baking cookies, roasting vegetables, and more.",
      image: "https://images.unsplash.com/photo-1621066946272-25517388cb26?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'bakeware',
      uses: [
        "Baking cookies",
        "Roasting vegetables",
        "Sheet pan dinners",
        "Heating frozen foods"
      ],
      tips: [
        "Look for heavy-gauge aluminum that won't warp",
        "Rimmed sheets prevent spills and are more versatile",
        "Line with parchment or silicone mats for easy cleanup",
        "Light-colored sheets prevent over-browning"
      ],
      videoId: "XbFwpupIK0A", // YouTube ID for sheet pan cooking
      videoTitle: "Sheet Pan Cooking Guide - Perfect Roasting Techniques"
    },
    {
      id: 'food-processor',
      name: "Food Processor",
      description: "Electric appliance for chopping, slicing, shredding, and puréeing.",
      image: "https://images.unsplash.com/photo-1585239244834-fb3ebfdde0c0?q=80&w=500&auto=format&fit=crop",
      essential: false,
      price: 'premium',
      category: 'appliances',
      uses: [
        "Chopping vegetables quickly",
        "Making pesto and sauces",
        "Shredding cheese",
        "Making dough for pastry or pizza"
      ],
      tips: [
        "7-9 cup capacity works for most households",
        "Look for models with multiple blade attachments",
        "Pulse function gives more control than continuous running",
        "Make sure parts are dishwasher safe for easy cleaning"
      ]
    },
    {
      id: 'instant-pot',
      name: "Pressure Cooker/Instant Pot",
      description: "Multi-functional appliance for quick cooking of beans, grains, and tough cuts of meat.",
      image: "https://images.unsplash.com/photo-1622223959017-1d398747a0e7?q=80&w=500&auto=format&fit=crop",
      essential: false,
      price: 'moderate',
      category: 'appliances',
      uses: [
        "Cooking dried beans without soaking",
        "Making tender stews in less time",
        "Preparing rice and other grains",
        "Steaming vegetables"
      ],
      tips: [
        "6-quart size is sufficient for most families",
        "Look for models with sauté function for one-pot meals",
        "Natural pressure release is best for meats and beans",
        "Quick release works better for vegetables to prevent overcooking"
      ],
      videoId: "QTT0Z3ksW8s", // YouTube ID for Instant Pot basics
      videoTitle: "Instant Pot Beginners Guide - How to Use a Pressure Cooker"
    }
  ];

  // Filter tools based on active category
  const filteredTools = activeCategory === 'all' 
    ? kitchenTools 
    : activeCategory === 'essentials' 
      ? kitchenTools.filter(tool => tool.essential) 
      : kitchenTools.filter(tool => tool.category === activeCategory);

  // Get price indicator based on price category
  const getPriceIndicator = (price: 'budget' | 'moderate' | 'premium') => {
    switch(price) {
      case 'budget':
        return '$';
      case 'moderate':
        return '$$';
      case 'premium':
        return '$$$';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
        <div className="flex gap-2">
          <Info className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-800">Kitchen Essentials Guide</h3>
            <p className="text-sm text-orange-700 mt-1">
              Equipping your kitchen with the right tools makes cooking easier and more enjoyable. 
              This guide covers the essential items every home cook should have, along with tips on 
              selecting and using them effectively.
            </p>
          </div>
        </div>
      </div>
      
      {/* Category Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        <Button 
          onClick={() => setActiveCategory('all')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'all' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'all' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.all, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">All</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('essentials')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'essentials' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'essentials' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium">Essentials</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('cutting')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'cutting' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'cutting' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.cutting, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Cutting</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('cookware')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'cookware' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'cookware' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.cookware, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Cookware</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('bakeware')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'bakeware' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'bakeware' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.bakeware, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Bakeware</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('tools')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'tools' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'tools' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.tools, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Tools</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('appliances')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'appliances' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'appliances' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.appliances, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Appliances</span>
        </Button>
      </div>
      
      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {filteredTools.map(tool => (
          <Card key={tool.id} className="overflow-hidden h-full border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden">
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                {tool.essential && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Essential
                  </Badge>
                )}
              </div>
              <CardDescription className="flex items-center gap-1">
                <span>Price: {getPriceIndicator(tool.price)}</span>
                <span>•</span>
                <span className="capitalize">{tool.category}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedTool(tool)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredTools.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No tools found</h3>
          <p className="text-gray-500 mt-1">Try selecting a different category</p>
        </div>
      )}
      
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {selectedTool.name}
                    {selectedTool.essential && (
                      <Badge className="bg-orange-100 text-orange-800">
                        Essential
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <span>Price: {getPriceIndicator(selectedTool.price)}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedTool.category}</span>
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedTool(null)}
                  className="h-8 w-8 p-0"
                >
                  &times;
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-52 overflow-hidden rounded-md">
                <img
                  src={selectedTool.image}
                  alt={selectedTool.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-gray-700">{selectedTool.description}</p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="uses">
                  <AccordionTrigger>Common Uses</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedTool.uses.map((use, index) => (
                        <li key={index} className="text-gray-700">
                          {use}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="tips">
                  <AccordionTrigger>Selection & Usage Tips</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      {selectedTool.tips.map((tip, index) => (
                        <li key={index} className="flex gap-2 text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {selectedTool.videoId && (
                <div>
                  <h3 className="font-medium mb-2">How-To Video</h3>
                  <Button
                    className="w-full rounded-md flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setVideoDialog({
                      open: true,
                      videoId: selectedTool.videoId as string,
                      title: selectedTool.videoTitle || `${selectedTool.name} Tutorial`
                    })}
                  >
                    <Play className="h-4 w-4" />
                    Watch Video Tutorial
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedTool(null)}>
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Video Player Dialog */}
      <VideoPlayerDialog
        open={videoDialog.open}
        onOpenChange={(open) => setVideoDialog({ ...videoDialog, open })}
        videoId={videoDialog.videoId}
        title={videoDialog.title}
      />
    </div>
  );
};

export default KitchenEssentials;