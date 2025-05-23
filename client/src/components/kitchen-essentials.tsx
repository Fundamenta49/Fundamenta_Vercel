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

// Kitchen tool SVG icons - with index signature
const KitchenToolIcons: Record<string, () => JSX.Element> = {
  // Cutting category
  "Chef's Knife": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(20,5) scale(0.6)">
        <path d="M35 10c-1.5 0-3 0.5-4.2 1.5l-0.3 0.2-20 35c-1.7 3-1.7 6.5-0.1 9.5 1.6 3 4.6 4.8 7.9 4.8h0.2l25-45c-0.3-0.3-0.5-0.5-0.8-0.8-2.2-2.9-5-5.2-7.7-5.2z" />
        <rect x="30" y="5" width="12" height="25" rx="1" ry="1" />
        <text x="40" y="92" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Chef's knife</text>
      </g>
    </svg>
  ),
  "Cutting Board": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(20,20) scale(0.6)">
        <path d="M8 5c-4.4 0-8 3.6-8 8v74c0 4.4 3.6 8 8 8h84c4.4 0 8-3.6 8-8V13c0-4.4-3.6-8-8-8H8z" />
        <rect x="15" y="10" width="70" height="70" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <text x="50" y="95" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Cutting Board</text>
      </g>
    </svg>
  ),
  
  // Tools category
  "Measuring Cups & Spoons": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(5,5) scale(0.9)">
        <path d="M20 20c-2 0-3 1-3 2v30c0 2 1 3 3 3h15c2 0 3-1 3-3V22c0-1-1-2-3-2H20z" />
        <path d="M45 15c-1.5 0-2 .5-2 2v20c0 1.5.5 2 2 2h10c1.5 0 2-.5 2-2V17c0-1.5-.5-2-2-2H45z" />
        <path d="M65 25c-1 0-2 1-2 2v10c0 1 1 2 2 2h10c1 0 2-1 2-2V27c0-1-1-2-2-2H65z" />
        <ellipse cx="72" cy="20" rx="7" ry="3" />
        <text x="50" y="80" fontFamily="Arial" fontSize="10" textAnchor="middle" fill="currentColor">Measuring Cups & Spoons</text>
      </g>
    </svg>
  ),
  "Mixing Bowls": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(10,10) scale(0.8)">
        <ellipse cx="50" cy="30" rx="40" ry="15" />
        <path d="M10 30c0 20 18 40 40 40s40-20 40-40" />
        <text x="50" y="85" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Mixing Bowls</text>
      </g>
    </svg>
  ),
  
  // Cookware category
  "Skillet (Cast Iron or Nonstick)": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(10,20) scale(0.8)">
        <circle cx="40" cy="40" r="35" />
        <path d="M75 40h25" strokeWidth="5" />
        <text x="50" y="95" fontFamily="Arial" fontSize="10" textAnchor="middle" fill="currentColor">Skillet</text>
      </g>
    </svg>
  ),
  "Saucepan": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(10,20) scale(0.8)">
        <path d="M10 30h60v20c0 5-5 10-10 10H20c-5 0-10-5-10-10V30z" />
        <path d="M70 30h20" strokeWidth="5" />
        <text x="50" y="80" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Saucepan</text>
      </g>
    </svg>
  ),
  "Stockpot": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(15,10) scale(0.7)">
        <path d="M20 20h60v60c0 5-5 10-10 10H30c-5 0-10-5-10-10V20z" />
        <path d="M20 20v-5c0-3 2-5 5-5h50c3 0 5 2 5 5v5" />
        <path d="M15 20h70" />
        <path d="M15 40h70" />
        <text x="50" y="100" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Stockpot</text>
      </g>
    </svg>
  ),
  
  // Bakeware category
  "Sheet Pan": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(10,20) scale(0.8)">
        <rect x="5" y="20" width="90" height="50" rx="5" />
        <line x1="5" y1="35" x2="95" y2="35" stroke="white" strokeWidth="2" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="2" />
        <text x="50" y="85" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Sheet Pan</text>
      </g>
    </svg>
  ),
  
  // More tools 
  "Rubber Spatula": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(20,10) scale(0.6)">
        <path d="M30 20L60 80c2 3 5 5 9 5h10c3 0 5-2 5-5V70c0-3-2-6-5-9L40 20c-2-2-8-2-10 0z" />
        <rect x="25" y="5" width="10" height="20" rx="5" />
        <text x="55" y="95" fontFamily="Arial" fontSize="10" textAnchor="middle" fill="currentColor">Rubber Spatula</text>
      </g>
    </svg>
  ),
  "Metal Spatula": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(15,10) scale(0.7)">
        <path d="M20 20L80 80" strokeWidth="8" stroke="currentColor" fill="none" />
        <path d="M75 85h15c3 0 5-2 5-5V65L75 45 55 65l20 20z" />
        <text x="50" y="100" fontFamily="Arial" fontSize="10" textAnchor="middle" fill="currentColor">Metal Spatula</text>
      </g>
    </svg>
  ),
  "Tongs": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(25,5) scale(0.5)">
        <path d="M30 20c-5 0-10 5-10 10v30c0 10 5 20 15 25 5 2 15 2 20 0 10-5 15-15 15-25V30c0-5-5-10-10-10" />
        <path d="M30 20v-10c0-3 3-5 5-5h30c2 0 5 2 5 5v10" />
        <path d="M50 80V30" strokeWidth="5" stroke="white" />
        <text x="50" y="100" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Tongs</text>
      </g>
    </svg>
  ),
  "Whisk": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(20,10) scale(0.6)">
        <path d="M40 10c10 0 20 10 20 20 0 15-15 20-30 25-15 5-25 15-25 30" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M35 15c5 0 10 5 10 10 0 10-10 12-20 15-10 3-15 10-15 20" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M45 15c5 0 10 5 10 10 0 10-10 12-20 15-10 3-15 10-15 20" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="30" y="90" width="10" height="20" rx="5" />
        <text x="50" y="125" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Whisk</text>
      </g>
    </svg>
  ),
  "Colander or Strainer": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(15,10) scale(0.7)">
        <ellipse cx="50" cy="35" rx="40" ry="15" />
        <path d="M10 35c0 20 18 30 40 30s40-10 40-30" />
        <circle cx="30" cy="45" r="2" fill="white" />
        <circle cx="40" cy="50" r="2" fill="white" />
        <circle cx="50" cy="55" r="2" fill="white" />
        <circle cx="60" cy="50" r="2" fill="white" />
        <circle cx="70" cy="45" r="2" fill="white" />
        <circle cx="20" cy="40" r="2" fill="white" />
        <circle cx="80" cy="40" r="2" fill="white" />
        <text x="50" y="85" fontFamily="Arial" fontSize="10" textAnchor="middle" fill="currentColor">Colander or Strainer</text>
      </g>
    </svg>
  ),
  "Peeler": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(30,10) scale(0.4)">
        <path d="M30 20l40 40" strokeWidth="8" stroke="currentColor" fill="none" />
        <path d="M30 20c-2-2-5-2-7 0l-10 10c-2 2-2 5 0 7l10 10 17-17-10-10z" />
        <path d="M70 60c2 2 5 2 7 0l10-10c2-2 2-5 0-7l-10-10-17 17 10 10z" />
        <rect x="40" y="120" width="20" height="40" rx="5" />
        <text x="50" y="180" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Peeler</text>
      </g>
    </svg>
  ),
  "Grater (Box or Microplane)": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(30,10) scale(0.4)">
        <rect x="20" y="20" width="60" height="100" rx="5" />
        <circle cx="40" cy="40" r="3" fill="white" />
        <circle cx="40" cy="50" r="3" fill="white" />
        <circle cx="40" cy="60" r="3" fill="white" />
        <circle cx="40" cy="70" r="3" fill="white" />
        <circle cx="40" cy="80" r="3" fill="white" />
        <circle cx="60" cy="40" r="3" fill="white" />
        <circle cx="60" cy="50" r="3" fill="white" />
        <circle cx="60" cy="60" r="3" fill="white" />
        <circle cx="60" cy="70" r="3" fill="white" />
        <circle cx="60" cy="80" r="3" fill="white" />
        <rect x="30" y="90" width="40" height="5" fill="white" />
        <rect x="30" cy="100" width="40" height="5" fill="white" />
        <text x="50" y="140" fontFamily="Arial" fontSize="10" textAnchor="middle" fill="currentColor">Grater</text>
      </g>
    </svg>
  ),
  "Can Opener": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(10,10) scale(0.8)">
        <circle cx="30" cy="50" r="20" />
        <path d="M30 30v20" strokeWidth="3" stroke="white" />
        <path d="M50 40l20 20" strokeWidth="3" stroke="currentColor" fill="none" />
        <path d="M70 60l10 10" strokeWidth="3" stroke="currentColor" fill="none" />
        <path d="M50 70h30" strokeWidth="3" stroke="currentColor" fill="none" />
        <text x="50" y="100" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="currentColor">Can Opener</text>
      </g>
    </svg>
  ),
  "Thermometer": () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-24 h-24">
      <g transform="translate(35,5) scale(0.3)">
        <rect x="40" y="20" width="20" height="100" rx="10" />
        <circle cx="50" cy="140" r="20" />
        <rect x="45" y="30" width="10" height="50" fill="white" />
        <text x="50" y="180" fontFamily="Arial" fontSize="14" textAnchor="middle" fill="currentColor">Thermometer</text>
      </g>
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