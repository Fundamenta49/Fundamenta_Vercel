import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlayCircle, 
  BookOpen, 
  ChefHat, 
  Utensils, 
  AlertTriangle, 
  Info, 
  Clock,
  Check,
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface CookingTutorial {
  id: string;
  name: string;
  description: string;
  category: 'technique' | 'kitchen-safety' | 'basic-recipe' | 'breakfast' | 'lunch' | 'dinner';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoId: string;
  tips: string[];
  commonUses?: string[];
  ingredients?: string[];
  thumbnailUrl?: string;
  duration?: number; // in minutes
  steps?: string[];
}

export interface CookingTutorialsSectionProps {
  onPlayVideo: (videoId: string, title: string, description?: string) => void;
}

// Tutorials organized by category
const cookingTutorials: CookingTutorial[] = [
  // COOKING TECHNIQUES
  {
    id: 'knife-skills-technique',
    name: 'Basic Knife Skills',
    description: 'Learn safe and proper cutting techniques that every home cook should know.',
    category: 'technique',
    difficulty: 'beginner',
    videoId: 'YrHpeEwk_-U',
    thumbnailUrl: 'https://img.youtube.com/vi/YrHpeEwk_-U/hqdefault.jpg',
    duration: 12,
    steps: [
      'Hold the knife properly with a pinch grip',
      'Position your guiding hand in a claw position',
      'Practice basic cuts: slice, dice, julienne, mince',
      'Keep your board stable with a damp towel underneath',
      'Clean and store knives properly after use'
    ],
    tips: [
      'Keep your fingers curled under when holding food',
      'Let the knife do the work - don\'t force it',
      'Keep your knife sharp - dull knives are dangerous',
      'Use a claw grip to protect your fingertips'
    ]
  },
  {
    id: 'measuring-tools-technique',
    name: 'Measuring Tools for Beginners',
    description: 'Learn how to use various measuring tools accurately for consistent cooking and baking results.',
    category: 'technique',
    difficulty: 'beginner',
    videoId: '044Tazwn7yQ',
    thumbnailUrl: 'https://img.youtube.com/vi/044Tazwn7yQ/hqdefault.jpg',
    duration: 7,
    steps: [
      'Understand the difference between liquid and dry measuring cups',
      'Learn proper technique for measuring dry ingredients',
      'Master the correct way to measure liquids at eye level',
      'Get familiar with measuring spoons for small amounts',
      'Practice using kitchen scales for the most accurate measurements'
    ],
    tips: [
      'Level off dry ingredients with a straight edge',
      'Use clear measuring cups for liquids and check at eye level',
      'Don\'t pack ingredients unless the recipe specifically calls for it',
      'Consider investing in a digital kitchen scale for precision'
    ]
  },
  {
    id: 'saute-technique',
    name: 'How to Sauté Properly',
    description: 'Master the quick cooking technique for vegetables, meats, and more.',
    category: 'technique',
    difficulty: 'beginner',
    videoId: 'liPGv6M--9M',
    thumbnailUrl: 'https://img.youtube.com/vi/liPGv6M--9M/hqdefault.jpg',
    duration: 10,
    steps: [
      'Heat your pan over medium-high heat',
      'Add a small amount of oil or butter',
      'Add food to be sautéed when pan is hot',
      'Keep food moving in the pan with a spatula or by shaking',
      'Cook until food is golden brown and properly cooked through'
    ],
    tips: [
      'Use a wide, shallow pan with sloped sides',
      'Heat the pan before adding oil or butter',
      'Don\'t overcrowd the pan - cook in batches if needed',
      'Keep food moving with a quick flipping motion'
    ]
  },
  {
    id: 'baking-technique',
    name: 'Baking Fundamentals',
    description: 'Learn the science and technique behind successful baking.',
    category: 'technique',
    difficulty: 'beginner',
    videoId: 'vpS0chcD_Dk',
    thumbnailUrl: 'https://img.youtube.com/vi/vpS0chcD_Dk/hqdefault.jpg',
    duration: 12,
    steps: [
      'Preheat your oven to the required temperature',
      'Measure all ingredients accurately',
      'Mix ingredients in the order specified in the recipe',
      'Use the appropriate baking vessel (pan, sheet, etc.)',
      'Check for doneness using toothpick test or other appropriate method'
    ],
    tips: [
      'Always measure ingredients precisely',
      'Understand how your oven heats (use an oven thermometer)',
      'Let the oven fully preheat before baking',
      'Use the middle rack for most even cooking'
    ]
  },
  {
    id: 'braising-technique',
    name: 'What is Braising',
    description: 'Transform tough cuts into tender, flavorful meals with this slow-cooking method.',
    category: 'technique',
    difficulty: 'intermediate',
    videoId: 'gLLHpkbEGzk',
    thumbnailUrl: 'https://img.youtube.com/vi/gLLHpkbEGzk/hqdefault.jpg',
    duration: 12,
    steps: [
      'Season and sear meat on all sides until well browned',
      'Add aromatics like onions, carrots, and garlic',
      'Deglaze the pan with liquid (wine, broth, etc.)',
      'Add cooking liquid to partially cover the meat',
      'Cover and cook on low heat until meat is tender'
    ],
    tips: [
      'Brown meat well before adding liquid',
      'Use just enough liquid to cover meat halfway',
      'Keep at a gentle simmer, not a rolling boil',
      'Allow plenty of time - rushing defeats the purpose'
    ]
  },
  
  // KITCHEN SAFETY
  {
    id: 'food-storage',
    name: 'Proper Food Storage',
    description: 'Learn how to store different foods for maximum freshness and safety.',
    category: 'kitchen-safety',
    difficulty: 'beginner',
    videoId: '6DgfrO-aJQ0',
    thumbnailUrl: 'https://img.youtube.com/vi/6DgfrO-aJQ0/maxresdefault.jpg',
    duration: 8,
    steps: [
      'Set refrigerator to 40°F or below and freezer to 0°F',
      'Store raw meat on the bottom shelf in sealed containers',
      'Keep produce in appropriate storage (some need air circulation)',
      'Label and date leftovers and frozen items',
      'Use the "first in, first out" method for food rotation'
    ],
    tips: [
      'Keep refrigerator at 40°F or below, freezer at 0°F',
      'Store raw meat on the bottom shelf to prevent cross-contamination',
      'Don\'t store produce in airtight containers - they need to breathe',
      'Use the FIFO method: First In, First Out'
    ]
  },
  
  // BASIC RECIPES
  {
    id: 'pasta-basics',
    name: 'Perfect Pasta Cooking',
    description: 'Learn to cook pasta properly and make simple, delicious sauces.',
    category: 'basic-recipe',
    difficulty: 'beginner',
    videoId: 'UYhKDweME3A',
    thumbnailUrl: 'https://img.youtube.com/vi/UYhKDweME3A/hqdefault.jpg',
    duration: 12,
    steps: [
      'Bring a large pot of water to a full rolling boil',
      'Add salt (about 1 tablespoon per pound of pasta)',
      'Add pasta and stir immediately to prevent sticking',
      'Cook until al dente, following package times as a guide',
      'Reserve some pasta water, then drain pasta',
      'Immediately toss with sauce and serve'
    ],
    tips: [
      'Use plenty of water - at least 4 quarts per pound of pasta',
      'Salt the water generously (it should taste like seawater)',
      'Save some pasta water for sauces',
      'Cook until al dente - firm to the bite'
    ],
    ingredients: [
      'Pasta of your choice',
      'Kosher salt',
      'Olive oil',
      'Garlic (optional)',
      'Parmesan cheese (optional)'
    ]
  },
  {
    id: 'basic-salad',
    name: 'Simple Green Salad & Vinaigrette',
    description: 'Create fresh, flavorful salads with homemade dressing.',
    category: 'basic-recipe',
    difficulty: 'beginner',
    videoId: 'GtAzKL-qm-o',
    thumbnailUrl: 'https://img.youtube.com/vi/GtAzKL-qm-o/maxresdefault.jpg',
    duration: 10,
    steps: [
      'Wash and thoroughly dry greens',
      'Make vinaigrette: mix 3 parts oil with 1 part acid (vinegar/lemon)',
      'Add Dijon mustard, salt, pepper, and any optional add-ins',
      'Whisk or shake dressing until emulsified',
      'Toss greens with just enough dressing to coat lightly',
      'Add additional toppings as desired'
    ],
    tips: [
      'Dry greens thoroughly after washing',
      'Basic vinaigrette ratio: 3 parts oil to 1 part acid',
      'Season dressing properly - it should taste slightly too strong on its own',
      'Dress salad just before serving to prevent wilting'
    ],
    ingredients: [
      'Mixed greens or lettuce',
      'Olive oil',
      'Vinegar or lemon juice',
      'Dijon mustard',
      'Salt and pepper',
      'Optional add-ins: herbs, garlic, shallot'
    ]
  },
  
  // BREAKFAST
  {
    id: 'pancakes',
    name: 'Fluffy Homemade Pancakes',
    description: 'Master the technique for light, fluffy pancakes perfect for breakfast.',
    category: 'breakfast',
    difficulty: 'beginner',
    videoId: 'GLdxV0PTX3s',
    thumbnailUrl: 'https://img.youtube.com/vi/GLdxV0PTX3s/hqdefault.jpg',
    duration: 15,
    steps: [
      'Mix dry ingredients in one bowl (flour, baking powder, sugar, salt)',
      'Mix wet ingredients in another bowl (milk, eggs, melted butter)',
      'Combine wet and dry ingredients gently - don\'t overmix',
      'Let batter rest for 5-10 minutes',
      'Heat pan or griddle to medium heat',
      'Pour batter in 1/4 cup portions',
      'Flip when bubbles form and edges set',
      'Cook second side until golden brown'
    ],
    tips: [
      'Don\'t overmix the batter - lumps are okay',
      'Let the batter rest for 5-10 minutes before cooking',
      'Flip when bubbles form and edges look set',
      'Keep warm in a 200°F oven while making the batch'
    ],
    ingredients: [
      'All-purpose flour',
      'Baking powder',
      'Sugar',
      'Salt',
      'Milk',
      'Eggs',
      'Butter or oil',
      'Vanilla extract (optional)'
    ]
  },
  {
    id: 'omelet',
    name: 'How to Make an Omelette',
    description: 'Create a light, fluffy omelet with your favorite fillings.',
    category: 'breakfast',
    difficulty: 'beginner',
    videoId: 'fqqwFWqxUr4',
    thumbnailUrl: 'https://img.youtube.com/vi/fqqwFWqxUr4/hqdefault.jpg',
    duration: 6,
    steps: [
      'Beat eggs with salt and pepper until well blended',
      'Heat a nonstick pan over medium heat',
      'Add butter and let it melt completely',
      'Pour in eggs and stir continuously with a fork for 30 seconds',
      'Let eggs set slightly, then add fillings to one side',
      'Fold omelet over fillings and slide onto plate'
    ],
    tips: [
      'Beat eggs until completely blended',
      'Use a nonstick pan and proper heat control',
      'Keep the eggs moving for the first 30 seconds',
      'Don\'t overfill - less is more with fillings'
    ],
    ingredients: [
      'Eggs',
      'Salt and pepper',
      'Butter',
      'Optional fillings: cheese, herbs, vegetables, ham'
    ]
  },
  
  // LUNCH RECIPES
  {
    id: 'grilled-cheese',
    name: 'Perfect Grilled Cheese',
    description: 'Master this classic sandwich - crispy outside, gooey melted cheese inside.',
    category: 'lunch',
    difficulty: 'beginner',
    videoId: 'OMPr7YP4fd8',
    thumbnailUrl: 'https://img.youtube.com/vi/OMPr7YP4fd8/hqdefault.jpg',
    duration: 10,
    steps: [
      'Butter one side of each bread slice',
      'Place bread butter-side down in pan over medium-low heat',
      'Add cheese on top of bread in pan',
      'Place second slice of bread on top, butter-side up',
      'Cook until golden brown on bottom (2-3 minutes)',
      'Flip sandwich and cook until second side is golden and cheese is melted'
    ],
    tips: [
      'Use butter at room temperature for easy spreading',
      'Cook on medium-low heat for even browning and melting',
      'Cover with a lid to help the cheese melt completely',
      'Add extras like tomato or ham for variations'
    ],
    ingredients: [
      'Bread (white, sourdough, etc.)',
      'Cheese (American, cheddar, gruyere, etc.)',
      'Butter',
      'Optional add-ins: tomato, ham, herbs'
    ]
  },
  
  // DINNER RECIPES
  {
    id: 'simple-stir-fry',
    name: 'Basic Stir Fry Technique',
    description: 'Create quick, flavorful stir-fries with whatever ingredients you have on hand.',
    category: 'dinner',
    difficulty: 'beginner',
    videoId: 'iBQNBKYnQA8',
    thumbnailUrl: 'https://img.youtube.com/vi/iBQNBKYnQA8/hqdefault.jpg',
    duration: 15,
    steps: [
      'Prepare all ingredients before cooking (vegetables cut uniformly, protein sliced)',
      'Heat wok or large skillet over high heat until very hot',
      'Add oil and swirl to coat the cooking surface',
      'Add aromatics (garlic, ginger) and stir for 30 seconds',
      'Add protein and cook until nearly done',
      'Add vegetables, starting with those that take longest to cook',
      'Add sauce ingredients and toss to combine',
      'Serve immediately over rice or noodles'
    ],
    tips: [
      'Cut all ingredients into similar-sized pieces for even cooking',
      'Cook over high heat and keep ingredients moving',
      'Have all ingredients prepped and ready before starting',
      'Don\'t overcrowd the pan - cook in batches if needed'
    ],
    ingredients: [
      'Protein (chicken, beef, tofu, etc.)',
      'Mixed vegetables',
      'Garlic and ginger',
      'Cooking oil',
      'Soy sauce',
      'Optional: cornstarch, broth, other sauces',
      'Rice or noodles for serving'
    ]
  }
];

export const TechniqueTutorials: React.FC<CookingTutorialsSectionProps> = ({ onPlayVideo }) => {
  const techniques = cookingTutorials.filter(tutorial => tutorial.category === 'technique');
  
  // Add debug wrapper for onPlayVideo
  const handlePlayVideo = (videoId: string, title: string, description?: string) => {
    console.log('TechniqueTutorials calling onPlayVideo with:', { videoId, title, description });
    onPlayVideo(videoId, title, description);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniques.map(tutorial => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={handlePlayVideo} />
        ))}
      </div>
    </div>
  );
};

export const KitchenSafetyTutorials: React.FC<CookingTutorialsSectionProps> = ({ onPlayVideo }) => {
  const safetyTutorials = cookingTutorials.filter(tutorial => tutorial.category === 'kitchen-safety');
  
  return (
    <div className="space-y-8">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Kitchen Safety Is Essential</h3>
            <p className="text-sm text-yellow-700">
              Proper technique and safety practices help prevent injury and foodborne illness. 
              These fundamentals should be mastered before attempting complex recipes.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safetyTutorials.map(tutorial => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={onPlayVideo} />
        ))}
      </div>
    </div>
  );
};

export const BasicRecipesTutorials: React.FC<CookingTutorialsSectionProps> = ({ onPlayVideo }) => {
  const basicRecipes = cookingTutorials.filter(tutorial => tutorial.category === 'basic-recipe');
  
  return (
    <div className="space-y-8">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Foundational Recipes</h3>
            <p className="text-sm text-blue-700">
              These simple recipes build core cooking skills that can be applied to countless dishes. 
              Master these basics and you'll have the confidence to try more complex recipes.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {basicRecipes.map(tutorial => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={onPlayVideo} />
        ))}
      </div>
    </div>
  );
};

export const MealTutorials: React.FC<CookingTutorialsSectionProps> = ({ onPlayVideo }) => {
  const breakfastTutorials = cookingTutorials.filter(tutorial => tutorial.category === 'breakfast');
  const lunchTutorials = cookingTutorials.filter(tutorial => tutorial.category === 'lunch');
  const dinnerTutorials = cookingTutorials.filter(tutorial => tutorial.category === 'dinner');
  
  return (
    <Tabs defaultValue="breakfast" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
        <TabsTrigger value="lunch">Lunch</TabsTrigger>
        <TabsTrigger value="dinner">Dinner</TabsTrigger>
      </TabsList>
      
      <TabsContent value="breakfast" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakfastTutorials.map(tutorial => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={onPlayVideo} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="lunch" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lunchTutorials.map(tutorial => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={onPlayVideo} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="dinner" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dinnerTutorials.map(tutorial => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={onPlayVideo} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

interface TutorialCardProps {
  tutorial: CookingTutorial;
  onPlayVideo: (videoId: string, title: string, description?: string) => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onPlayVideo }) => {
  const handlePlayVideo = () => {
    console.log('Playing tutorial from TutorialCard:', {
      videoId: tutorial.videoId,
      name: tutorial.name,
      description: tutorial.description
    });
    // Make sure we're passing valid data to onPlayVideo
    if (!tutorial.videoId) {
      console.error('Error: Tutorial has no videoId!', tutorial);
      return;
    }
    onPlayVideo(tutorial.videoId, tutorial.name, tutorial.description);
  };
  
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow border-t-4 border-t-learning-color">
      <div 
        className="relative aspect-video cursor-pointer overflow-hidden"
        onClick={handlePlayVideo}
      >
        {tutorial.thumbnailUrl ? (
          <img 
            src={tutorial.thumbnailUrl} 
            alt={tutorial.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ChefHat className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
        {tutorial.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs rounded px-1.5 py-0.5 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {tutorial.duration} min
          </div>
        )}
        <Badge 
          className={`absolute top-2 left-2 ${
            tutorial.difficulty === 'beginner' 
              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
              : tutorial.difficulty === 'intermediate'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                : 'bg-red-100 text-red-800 hover:bg-red-100'
          }`}
        >
          {tutorial.difficulty}
        </Badge>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{tutorial.name}</CardTitle>
        <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        {tutorial.steps && (
          <div className="mt-3">
            <h4 className="text-sm font-medium flex items-center gap-1 text-learning-color mb-2">
              <BookOpen className="h-3.5 w-3.5" /> Key Steps
            </h4>
            <ScrollArea className="h-[80px] pr-4">
              <ol className="pl-5 text-sm list-decimal space-y-1">
                {tutorial.steps.slice(0, 5).map((step, index) => (
                  <li key={index} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto text-learning-color hover:text-learning-color/90 hover:bg-learning-color/10"
          onClick={handlePlayVideo}
        >
          <PlayCircle className="h-4 w-4 mr-1" />
          Watch Tutorial
        </Button>
      </CardFooter>
    </Card>
  );
};

export const CookingTutorialsContent: React.FC<CookingTutorialsSectionProps> = ({ onPlayVideo }) => {
  return (
    <div className="space-y-10">
      {/* Hero Introduction with Image */}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="relative aspect-video md:h-[400px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1024&auto=format&fit=crop"
            alt="Kitchen with cooking setup"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
              Learn to Cook with Confidence
            </h1>
            <p className="text-white text-sm md:text-base max-w-2xl opacity-90 mb-3">
              These essential tutorials will build your confidence in the kitchen and teach you the 
              foundational skills every home cook should master.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="bg-white/90 text-learning-color rounded-full px-3 py-1 text-xs font-medium">
                Step-by-Step Videos
              </div>
              <div className="bg-white/90 text-learning-color rounded-full px-3 py-1 text-xs font-medium">
                Essential Techniques
              </div>
              <div className="bg-white/90 text-learning-color rounded-full px-3 py-1 text-xs font-medium">
                Beginner Friendly
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-white">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-learning-color flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Why Learn to Cook?
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2 items-start">
                  <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span><strong>Save $2,000+ per year</strong> by preparing homemade meals</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span><strong>Eat healthier</strong> by controlling ingredients and portions</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span><strong>Gain independence</strong> and confidence in the kitchen</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-learning-color flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                What You'll Learn
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2 items-start">
                  <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <Utensils className="h-3 w-3" />
                  </div>
                  <span>Essential cooking techniques with clear demonstrations</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <ChefHat className="h-3 w-3" />
                  </div>
                  <span>Simple recipes for breakfast, lunch, and dinner</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-orange-100 text-orange-600 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <ShieldAlert className="h-3 w-3" />
                  </div>
                  <span>Kitchen safety and proper food handling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-learning-color">
          <Utensils className="h-5 w-5" />
          Essential Cooking Techniques
        </h2>
        <TechniqueTutorials onPlayVideo={onPlayVideo} />
      </section>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-learning-color">
          <AlertTriangle className="h-5 w-5" />
          Kitchen Safety & Skills
        </h2>
        <KitchenSafetyTutorials onPlayVideo={onPlayVideo} />
      </section>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-learning-color">
          <BookOpen className="h-5 w-5" />
          Basic Recipes Everyone Should Know
        </h2>
        <BasicRecipesTutorials onPlayVideo={onPlayVideo} />
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-learning-color">
          <ChefHat className="h-5 w-5" />
          Meals by Time of Day
        </h2>
        <MealTutorials onPlayVideo={onPlayVideo} />
      </section>
    </div>
  );
};

export default CookingTutorialsContent;