import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  ExternalLink, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Utensils, 
  Scissors, 
  CookingPot, 
  Cookie, 
  UtensilsCrossed, 
  Plug, 
  Loader2, 
  Search,
  ChefHat
} from 'lucide-react';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { searchCookingVideos, YouTubeVideo, kitchenToolVideoMap } from '@/lib/youtube-service';
import { Input } from '@/components/ui/input';

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

// Kitchen tool SVG icons
const KitchenToolIcons = {
  // Cutting category
  "Chef's Knife": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M3 21h18M17.5 3l-11 11c-.5.5-1 1.5-1 2v.5c0 1 .5 1.5 1 2s1 1 2 1h.5c.5 0 1.5-.5 2-1l7.5-9.5" />
      <path d="M17.5 3c.5-.5 1.5-.5 2 0s.5 1.5 0 2L13 11" />
    </svg>
  ),
  "Cutting Board": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <line x1="9" y1="4" x2="9" y2="20" />
      <line x1="15" y1="4" x2="15" y2="20" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
    </svg>
  ),
  
  // Tools category
  "Measuring Cups & Spoons": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M6 9v9c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V9M6 9h7M6 12h7M3 7h12v2H3zM17 5c.55 0 1 .45 1 1v1h-2V6c0-.55.45-1 1-1zM17 10c.55 0 1 .45 1 1v1h-2v-1c0-.55.45-1 1-1zM17 15c.55 0 1 .45 1 1v1h-2v-1c0-.55.45-1 1-1z" />
    </svg>
  ),
  "Mixing Bowls": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v7c0 1.66 3.13 3 7 3s7-1.34 7-3V7" />
    </svg>
  ),
  
  // Cookware category
  "Skillet (Cast Iron or Nonstick)": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <circle cx="12" cy="12" r="8" />
      <path d="M19 12h5" />
    </svg>
  ),
  "Saucepan": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z" />
      <path d="M18 8V5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3" />
      <path d="M20 10h2" />
    </svg>
  ),
  "Stockpot": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M5 10h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8z" />
      <path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
      <path d="M5 14h14" />
      <path d="M19 10h3" />
      <path d="M2 10h3" />
    </svg>
  ),
  
  // Bakeware category
  "Sheet Pan": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="16" x2="21" y2="16" />
      <line x1="12" y1="8" x2="12" y2="20" />
    </svg>
  ),
  
  // More tools 
  "Rubber Spatula": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M6 20l12-16" />
      <path d="M9 17l3 3h3a2 2 0 0 0 2-2v-3l-3-3" />
    </svg>
  ),
  "Metal Spatula": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M5 20l9-9" />
      <path d="M14 11l5-5" />
      <path d="M19 6h-4v-4" />
      <path d="M5 20v-3h3l3-3 4 4-3 3v3z" />
    </svg>
  ),
  "Tongs": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M8 4V2M16 4V2M12 18v-5M9 15l-3-3 4-4M15 15l3-3-4-4M12 13V3" />
    </svg>
  ),
  "Whisk": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M5 16a4 4 0 0 0 4 4h.5M16 10c0-3.5-4-3.5-4-7C15 3 17 3 18 6c2 6-9 11-11 10" />
      <path d="M17.68 8.32C19.5 10.5 19 13 16 14c-3 1-5.5-.5-8-3.5C8 8 10 4.5 12 3c.5 1 1 1.5 3 2" />
    </svg>
  ),
  "Colander or Strainer": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M6 8l1 10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-10" />
      <path d="M4 8h16M9 8V6c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M8 12v.01M12 12v.01M16 12v.01M8 16v.01M12 16v.01M16 16v.01" />
    </svg>
  ),
  "Peeler": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M9 12l6-6M15 6l3 3-3 3-3-3zM9 12l-6 6 3 3 6-6" />
    </svg>
  ),
  "Grater (Box or Microplane)": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <rect x="6" y="4" width="12" height="16" rx="1" />
      <line x1="8" y1="8" x2="8" y2="16" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="16" y1="8" x2="16" y2="16" />
    </svg>
  ),
  "Can Opener": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <circle cx="7" cy="12" r="5" />
      <path d="M7 7v5M15 9l3 3M18 12l3 3M15 15h6" />
    </svg>
  ),
  "Thermometer": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M14 4v10.54c-1.19.69-2 1.99-2 3.46 0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.47-.81-2.77-2-3.46V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2zM12 9H7.5a2.5 2.5 0 0 1 0-5H12" />
    </svg>
  ),
  
  // Default icon for any missing tools
  "default": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24">
      <path d="M3 10h18M3 14h18M9 4v16M15 4v16" />
    </svg>
  )
};

// Category icons (still needed for filtering UI)
const categoryIcons = {
  cutting: Scissors,
  cookware: CookingPot,
  bakeware: Cookie,
  tools: UtensilsCrossed,
  appliances: Plug,
  all: Utensils
};

// Function to render kitchen tool icon
const renderKitchenIcon = (tool: KitchenTool) => {
  // Get the appropriate icon for the specific tool
  const IconComponent = KitchenToolIcons[tool.name] || KitchenToolIcons["default"];
  
  // Use Learning Yellow theme color (#f59e0b) for all icons
  const bgColor = 'bg-amber-100';
  const iconColor = 'text-amber-600';
  
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className={`w-36 h-36 ${bgColor} rounded-full flex items-center justify-center`}>
        <IconComponent />
      </div>
    </div>
  );
};

const KitchenEssentials = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<KitchenTool | null>(null);
  const [videoDialog, setVideoDialog] = useState<{open: boolean, videoId: string, title: string}>({
    open: false,
    videoId: '',
    title: ''
  });
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Debug useEffect to log the video IDs on component mount
  useEffect(() => {
    console.log('Kitchen tool video map:', kitchenToolVideoMap);
  }, []);
  
  // Function to directly show a video using predefined IDs without searching
  const fetchVideoForTool = (tool: KitchenTool) => {
    try {
      // If the tool has a videoTitle, get the ID from our predefined map
      if (tool.videoTitle && kitchenToolVideoMap[tool.videoTitle]) {
        setVideoDialog({
          open: true,
          videoId: kitchenToolVideoMap[tool.videoTitle],
          title: tool.videoTitle
        });
        return;
      }
      
      // If there's a direct videoId on the tool, use that
      if (tool.videoId) {
        setVideoDialog({
          open: true,
          videoId: tool.videoId,
          title: tool.videoTitle || `${tool.name} Tutorial`
        });
        return;
      }
      
      // Fallback if we don't have a predefined ID
      alert(`Sorry, no video available for ${tool.name}`);
    } catch (error) {
      console.error('Error showing video for tool:', error);
    }
  };

  // Kitchen tools data
  const kitchenTools: KitchenTool[] = [
    {
      id: 'chefs-knife',
      name: "Chef's Knife",
      description: "A good-quality, sharp chef's knife is your kitchen workhorse.",
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
      videoTitle: "Basic Knife Skills | Epicurious"
    },
    {
      id: 'cutting-board',
      name: "Cutting Board",
      description: "Preferably one plastic (for meats) and one wood or bamboo (for fruits/veggies).",
      image: "https://images.unsplash.com/photo-1590401692339-8ea5c9d11204?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'cutting',
      uses: [
        "Provides a safe surface for cutting",
        "Protects countertops from damage",
        "Prevents cross-contamination (separate boards for different foods)",
        "Can be used as a serving platter for charcuterie"
      ],
      tips: [
        "Wood or bamboo boards are gentle on knife edges",
        "Plastic boards are dishwasher safe but can harbor bacteria in deep cuts",
        "Use separate boards for raw meat and vegetables to prevent cross-contamination",
        "Dampen a paper towel and place under the board to prevent slipping"
      ],
      videoTitle: "Choosing and Caring for Cutting Boards | America's Test Kitchen"
    },
    {
      id: 'measuring-tools',
      name: "Measuring Cups & Spoons",
      description: "For accurate measurements in both dry and liquid ingredients.",
      image: "https://images.unsplash.com/photo-1623428455276-c5872154d189?q=80&w=500&auto=format&fit=crop",
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
      ],
      videoTitle: "How to Measure Ingredients Correctly | Joy of Baking"
    },
    {
      id: 'mixing-bowls',
      name: "Mixing Bowls",
      description: "Various sizes are helpful for prep, mixing, and marinating.",
      image: "https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=500&auto=format&fit=crop",
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
      ],
      videoTitle: "Mixing Bowls: Types and Uses | Kitchen Conservatory"
    },
    {
      id: 'skillet',
      name: "Skillet (Cast Iron or Nonstick)",
      description: "Ideal for searing, sautéing, frying, and more.",
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
        "Cast iron retains heat well and can go from stovetop to oven",
        "Nonstick is easier to clean and requires less oil",
        "10-12 inch size is most versatile",
        "Preheat the pan before adding oil to prevent sticking"
      ],
      videoTitle: "How to Use and Season a Cast Iron Skillet | Tasty"
    },
    {
      id: 'saucepan',
      name: "Saucepan",
      description: "For cooking grains, sauces, and reheating.",
      image: "https://images.unsplash.com/photo-1584637080297-4a42c926db78?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'moderate',
      category: 'cookware',
      uses: [
        "Cooking rice and other grains",
        "Making sauces and gravies",
        "Reheating soups and leftovers",
        "Cooking small portions of pasta"
      ],
      tips: [
        "2-3 quart size is most versatile for everyday cooking",
        "Look for a heavy bottom to prevent burning",
        "A tight-fitting lid is essential",
        "Choose one with a comfortable, heat-resistant handle"
      ],
      videoTitle: "Saucepan Basics: Cooking Techniques and Tips | Pro Home Cooks"
    },
    {
      id: 'stockpot',
      name: "Stockpot",
      description: "Essential for soups, stews, and boiling pasta or large quantities.",
      image: "https://images.unsplash.com/photo-1590439375055-f48d6edd67ec?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'moderate',
      category: 'cookware',
      uses: [
        "Making large batches of soup or stew",
        "Boiling pasta",
        "Preparing stocks and broths",
        "Blanching vegetables"
      ],
      tips: [
        "8-12 quart size works for most households",
        "Stainless steel is durable and won't react with acidic foods",
        "Look for a pot with handles on both sides for easier lifting",
        "A clear glass lid lets you monitor cooking without releasing heat"
      ],
      videoTitle: "Stockpot Cooking: Tips and Techniques | Chef Billy Parisi"
    },
    {
      id: 'baking-sheet',
      name: "Sheet Pan",
      description: "Great for roasting veggies, baking, and meal prep.",
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
      videoTitle: "Sheet Pan Cooking: Tips and Recipes | Food Wishes"
    },
    {
      id: 'rubber-spatula',
      name: "Rubber Spatula",
      description: "Essential for scraping bowls and folding batters.",
      image: "https://images.unsplash.com/photo-1611072337226-1140a3846a2d?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Scraping bowls to get every last bit",
        "Folding delicate batters",
        "Spreading frosting or batter",
        "Stirring sauces without scratching pans"
      ],
      tips: [
        "Silicone spatulas are heat-resistant and won't melt",
        "One-piece designs are more hygienic",
        "Look for a sturdy, comfortable handle",
        "Different sizes and shapes are useful for different tasks"
      ],
      videoTitle: "Spatula Types and Uses | America's Test Kitchen"
    },
    {
      id: 'metal-spatula',
      name: "Metal Spatula",
      description: "Perfect for flipping and serving.",
      image: "https://images.unsplash.com/photo-1590439471293-5734d09b3a65?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Flipping pancakes, burgers, and fish",
        "Serving slices of lasagna or casserole",
        "Scraping up fond from the pan for sauces",
        "Lifting cookies from baking sheets"
      ],
      tips: [
        "Thin, flexible spatulas are best for delicate foods",
        "Offset spatulas are great for serving",
        "Don't use on nonstick surfaces",
        "Look for one with a comfortable, heat-resistant handle"
      ],
      videoTitle: "Spatula Types and Uses | America's Test Kitchen"
    },
    {
      id: 'tongs',
      name: "Tongs",
      description: "Crucial for turning meat, tossing salads, and plating.",
      image: "https://images.unsplash.com/photo-1594066923262-9c8a2f76b9a8?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Turning and flipping meat while cooking",
        "Tossing salads and pasta",
        "Serving food family-style",
        "Grabbing hot items safely"
      ],
      tips: [
        "Locking tongs save storage space",
        "Silicone-tipped tongs won't scratch nonstick cookware",
        "12-inch length keeps hands away from heat",
        "Look for comfortable, non-slip handles"
      ],
      videoTitle: "How to Use Kitchen Tongs Effectively | Serious Eats"
    },
    {
      id: 'whisk',
      name: "Whisk",
      description: "For mixing, beating, and emulsifying.",
      image: "https://images.unsplash.com/photo-1531259912961-da13ab57a714?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Beating eggs",
        "Making sauces and gravies",
        "Emulsifying salad dressings",
        "Mixing dry ingredients"
      ],
      tips: [
        "Balloon whisks are great for incorporating air",
        "Flat or roux whisks work well for sauces",
        "Silicone-coated whisks won't scratch nonstick surfaces",
        "Look for a comfortable handle and balanced weight"
      ],
      videoTitle: "Whisking Techniques: How to Use a Whisk Properly | Bon Appétit"
    },
    {
      id: 'colander',
      name: "Colander or Strainer",
      description: "Useful for draining pasta, rinsing beans or produce.",
      image: "https://images.unsplash.com/photo-1568229561162-9a1a57e4c3af?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Draining pasta",
        "Rinsing fruits and vegetables",
        "Washing rice and beans",
        "Straining stocks and broths"
      ],
      tips: [
        "Stainless steel colanders are durable and won't stain",
        "Look for stable feet so it can stand in the sink",
        "Small holes prevent pasta from slipping through",
        "Collapsible colanders save storage space"
      ],
      videoTitle: "Colander vs. Strainer: Which One to Use? | Food Network"
    },
    {
      id: 'peeler',
      name: "Peeler",
      description: "Makes quick work of peeling fruits and vegetables.",
      image: "https://images.unsplash.com/photo-1589717482639-a165cc841cf7?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Peeling fruits and vegetables",
        "Creating vegetable ribbons",
        "Shaving chocolate or cheese",
        "Removing citrus zest in strips"
      ],
      tips: [
        "Y-peelers give better control for many users",
        "Swivel peelers are traditional and versatile",
        "Ceramic blades stay sharp longer than metal",
        "Look for a comfortable, non-slip handle"
      ],
      videoTitle: "How to Use a Vegetable Peeler | Martha Stewart"
    },
    {
      id: 'grater',
      name: "Grater (Box or Microplane)",
      description: "For cheese, citrus zest, garlic, etc.",
      image: "https://images.unsplash.com/photo-1615228939096-9c99e81b55bd?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'budget',
      category: 'tools',
      uses: [
        "Grating cheese",
        "Zesting citrus fruits",
        "Grating ginger, garlic, and nutmeg",
        "Shredding vegetables for salads"
      ],
      tips: [
        "Box graters offer multiple grating sizes",
        "Microplane graters are perfect for zest and hard cheese",
        "Look for a comfortable handle and non-slip base",
        "Dishwasher-safe models make cleanup easier"
      ],
      videoTitle: "Grating Techniques: Box Grater vs. Microplane | America's Test Kitchen"
    },
    {
      id: 'meat-thermometer',
      name: "Meat Thermometer",
      description: "Ensures food safety and perfect doneness.",
      image: "https://images.unsplash.com/photo-1616118132534-381148898bb4?q=80&w=500&auto=format&fit=crop",
      essential: true,
      price: 'moderate',
      category: 'tools',
      uses: [
        "Checking meat doneness",
        "Ensuring food safety",
        "Testing bread doneness",
        "Checking oil temperature for frying"
      ],
      tips: [
        "Digital thermometers give quick, accurate readings",
        "Instant-read models are versatile for most cooking",
        "Probe thermometers with external displays are best for roasting and baking",
        "Look for one that's easy to clean and has a clear display"
      ],
      videoTitle: "How to Use a Meat Thermometer | ChefSteps"
    }
  ];

  // Filter tools based on active category and search query
  const filteredTools = kitchenTools
    .filter(tool => {
      // First filter by category
      const categoryMatch = 
        activeCategory === 'all' || 
        (activeCategory === 'essentials' && tool.essential) || 
        tool.category === activeCategory;
      
      // Then filter by search query if one exists
      const searchMatch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.uses.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Tool must match both category and search criteria
      return categoryMatch && searchMatch;
    });

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
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for kitchen tools..."
              className="pl-10 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                &times;
              </Button>
            )}
          </div>
          {searchQuery && (
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-2">
            {filteredTools.length === 0 
              ? 'No matches found.' 
              : `Found ${filteredTools.length} item${filteredTools.length === 1 ? '' : 's'}.`}
          </p>
        )}
      </div>
      
      {/* Category Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        <Button 
          onClick={() => setActiveCategory('all')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'all' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'all' ? 'bg-amber-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.all, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">All</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('essentials')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'essentials' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'essentials' ? 'bg-amber-200' : 'bg-gray-200'}`}>
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium">Essentials</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('cutting')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'cutting' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'cutting' ? 'bg-amber-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.cutting, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Cutting</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('cookware')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'cookware' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'cookware' ? 'bg-amber-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.cookware, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Cookware</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('bakeware')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'bakeware' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'bakeware' ? 'bg-amber-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.bakeware, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Bakeware</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('tools')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'tools' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'tools' ? 'bg-amber-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.tools, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Tools</span>
        </Button>
        
        <Button 
          onClick={() => setActiveCategory('appliances')}
          className={`py-2 px-3 rounded-lg flex flex-col items-center justify-center h-auto ${activeCategory === 'appliances' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          variant="ghost"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeCategory === 'appliances' ? 'bg-amber-200' : 'bg-gray-200'}`}>
            {React.createElement(categoryIcons.appliances, { className: 'h-4 w-4' })}
          </div>
          <span className="text-xs font-medium">Appliances</span>
        </Button>
      </div>
      
      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {filteredTools.map(tool => (
          <Card key={tool.id} className="overflow-hidden h-full border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden relative bg-amber-50">
              {renderKitchenIcon(tool)}
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                {tool.essential && (
                  <Badge className="bg-amber-100 text-amber-800">
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
                      <Badge className="bg-amber-100 text-amber-800">
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
              <div className="h-52 overflow-hidden rounded-md bg-amber-50">
                {renderKitchenIcon(selectedTool)}
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
              
              <div>
                <h3 className="font-medium mb-2">How-To Video</h3>
                <Button
                  className="w-full rounded-md flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => fetchVideoForTool(selectedTool)}
                  disabled={isLoadingVideo}
                >
                  {isLoadingVideo ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Finding Videos...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Watch Video Tutorial
                    </>
                  )}
                </Button>
              </div>
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