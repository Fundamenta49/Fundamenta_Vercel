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
  ShieldAlert,
  Coffee,
  Salad,
  UtensilsCrossed
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
  featured?: boolean; // Whether to show embedded video directly
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
    videoId: 'aopS3q6f1GY',
    thumbnailUrl: 'https://img.youtube.com/vi/aopS3q6f1GY/hqdefault.jpg',
    duration: 12,
    featured: true,
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
    videoId: 'RUeVNCEDbCo',
    thumbnailUrl: 'https://img.youtube.com/vi/RUeVNCEDbCo/maxresdefault.jpg',
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
    featured: true,
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
    videoId: 'IdUHyy5VE2s',
    thumbnailUrl: 'https://img.youtube.com/vi/IdUHyy5VE2s/maxresdefault.jpg',
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
    videoId: 't6rWDnqeKR8',
    thumbnailUrl: 'https://img.youtube.com/vi/t6rWDnqeKR8/hqdefault.jpg',
    duration: 15,
    featured: true,
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
    id: 'lunch-box-recipes',
    name: 'Gordon Ramsay\'s Lunch Box Recipes',
    description: 'Learn how to prepare three delicious and portable lunch recipes from chef Gordon Ramsay.',
    category: 'lunch',
    difficulty: 'beginner',
    videoId: 'AKJVidl9s_0',
    thumbnailUrl: 'https://img.youtube.com/vi/AKJVidl9s_0/hqdefault.jpg',
    duration: 12,
    featured: true,
    steps: [
      'Choose which of the three recipes you want to prepare',
      'Gather all ingredients and prep them as directed',
      'Cook components according to instructions',
      'Assemble your lunch in a portable container',
      'Allow to cool before sealing if needed',
      'Pack with appropriate silverware and napkins'
    ],
    tips: [
      'Prepare components the night before to save time',
      'Use containers that won\'t leak or spill',
      'Keep hot and cold items separate',
      'Include a variety of textures and flavors for a satisfying lunch'
    ],
    ingredients: [
      'Varies by recipe - see video for specific ingredients',
      'Fresh vegetables',
      'Protein sources',
      'Grains or bread',
      'Herbs and spices',
      'Dressings or sauces'
    ]
  },
  {
    id: 'quick-sandwich-tutorial',
    name: 'Quick Lunch Sandwich',
    description: 'Learn how to make a quick, delicious sandwich for lunch that\'s both filling and flavorful.',
    category: 'lunch',
    difficulty: 'beginner',
    videoId: '6KG4ZvMZTlo',
    thumbnailUrl: 'https://img.youtube.com/vi/6KG4ZvMZTlo/hqdefault.jpg',
    duration: 8,
    steps: [
      'Choose fresh bread - sliced sandwich bread or rolls',
      'Apply condiments like mayo, mustard, or hummus',
      'Layer proteins such as deli meats or cheese',
      'Add vegetables for crunch and flavor',
      'Season with salt, pepper, and herbs',
      'Cut in half for easier eating'
    ],
    tips: [
      'Toast the bread for extra crunch',
      'Pat vegetables dry to prevent soggy sandwiches',
      'Season each layer for flavor throughout',
      'Wrap tightly in parchment for on-the-go lunches'
    ],
    ingredients: [
      'Bread of choice',
      'Protein (deli meat, tuna, etc.)',
      'Cheese',
      'Vegetables (lettuce, tomato, etc.)',
      'Condiments',
      'Salt and pepper'
    ]
  },
  {
    id: 'tuna-salad-sandwich',
    name: 'Classic Tuna Salad Sandwich',
    description: 'A protein-packed tuna salad sandwich that\'s easy to prepare and perfect for lunch.',
    category: 'lunch',
    difficulty: 'beginner',
    videoId: 'jJNiZHkoQW0',
    thumbnailUrl: 'https://img.youtube.com/vi/jJNiZHkoQW0/hqdefault.jpg',
    duration: 10,
    steps: [
      'Drain canned tuna well',
      'Mix tuna with mayo, chopped celery, and onion',
      'Add a squeeze of lemon juice and seasonings',
      'Spread on bread and top with lettuce and tomato',
      'Add second slice of bread and cut diagonally'
    ],
    tips: [
      'Use tuna packed in water for a lighter sandwich',
      'Add diced apple or halved grapes for sweetness',
      'Substitute Greek yogurt for some of the mayo',
      'Try it on whole grain bread for extra nutrition'
    ],
    ingredients: [
      'Canned tuna',
      'Mayonnaise',
      'Celery',
      'Onion',
      'Lemon juice',
      'Salt and pepper',
      'Bread',
      'Lettuce and tomato'
    ]
  },
  {
    id: 'healthy-wrap',
    name: 'Quick & Healthy Lunch Wrap',
    description: 'A nutritious wrap that comes together in minutes for a satisfying lunch on busy days.',
    category: 'lunch',
    difficulty: 'beginner',
    videoId: 'eXXsfN0tA9c',
    thumbnailUrl: 'https://img.youtube.com/vi/eXXsfN0tA9c/hqdefault.jpg',
    duration: 7,
    steps: [
      'Warm tortilla or wrap slightly for flexibility',
      'Spread a thin layer of hummus or other spread',
      'Layer lean protein in the center',
      'Add vegetables, greens, and any extras',
      'Fold in sides, then roll up tightly',
      'Cut in half diagonally for serving'
    ],
    tips: [
      'Don\'t overfill or it will be hard to roll',
      'Use large tortillas for easier wrapping',
      'Toast the wrapped sandwich for extra crunch',
      'Make several at once and refrigerate for the week'
    ],
    ingredients: [
      'Large flour or whole wheat tortillas',
      'Hummus or flavored spread',
      'Protein (chicken, turkey, tofu, etc.)',
      'Mixed greens',
      'Colorful vegetables',
      'Optional: avocado, cheese, nuts, seeds'
    ]
  },
  {
    id: 'vegetable-soup',
    name: 'Quick Vegetable Soup',
    description: 'A warming vegetable soup that\'s perfect for lunch and makes great use of leftover vegetables.',
    category: 'lunch',
    difficulty: 'beginner',
    videoId: 'SE-DptWxDKw',
    thumbnailUrl: 'https://img.youtube.com/vi/SE-DptWxDKw/hqdefault.jpg',
    duration: 15,
    featured: true,
    steps: [
      'Sauté onions, carrots, and celery in olive oil',
      'Add garlic and cook until fragrant',
      'Pour in vegetable broth and bring to a simmer',
      'Add diced vegetables and season with herbs',
      'Simmer until vegetables are tender',
      'Taste and adjust seasonings before serving'
    ],
    tips: [
      'Use whatever vegetables you have on hand',
      'Add leftovers like rice or pasta for a heartier soup',
      'Blend some of the soup for a creamy texture',
      'Garnish with fresh herbs and a drizzle of olive oil'
    ],
    ingredients: [
      'Olive oil',
      'Onion, carrots, celery',
      'Garlic',
      'Vegetable broth',
      'Assorted vegetables',
      'Herbs and seasonings',
      'Salt and pepper'
    ]
  },
  
  // DINNER RECIPES
  {
    id: 'simple-stir-fry',
    name: 'Basic Stir Fry Technique',
    description: 'Create quick, flavorful stir-fries with whatever ingredients you have on hand.',
    category: 'dinner',
    difficulty: 'beginner',
    videoId: '2WDIBat-Jgo',
    thumbnailUrl: 'https://img.youtube.com/vi/2WDIBat-Jgo/hqdefault.jpg',
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
  },
  {
    id: 'easy-pasta-dinner',
    name: 'Simple Pasta Dinner',
    description: 'An easy pasta dinner that\'s perfect for weeknights and can be customized with what you have on hand.',
    category: 'dinner',
    difficulty: 'beginner',
    videoId: 'J0KG7NMg50o',
    thumbnailUrl: 'https://img.youtube.com/vi/J0KG7NMg50o/hqdefault.jpg',
    duration: 20,
    featured: true,
    steps: [
      'Bring a large pot of water to a boil and salt generously',
      'Cook pasta according to package directions',
      'While pasta cooks, prepare your sauce in a separate pan',
      'Reserve some pasta water before draining',
      'Add drained pasta to your sauce and toss to combine',
      'Add a splash of pasta water if needed to loosen the sauce',
      'Garnish with herbs, cheese, or other toppings as desired'
    ],
    tips: [
      'Salt your pasta water until it tastes like the sea',
      'Cook pasta just until al dente - it will continue cooking slightly when combined with the sauce',
      'Always save some pasta water - the starchy water helps sauce adhere to pasta',
      'Simple is often better: good olive oil, garlic, and red pepper flakes make a great quick sauce'
    ],
    ingredients: [
      'Pasta of your choice',
      'Olive oil',
      'Garlic',
      'Optional: Canned tomatoes, vegetables, protein',
      'Salt and pepper',
      'Grated cheese (like Parmesan)',
      'Fresh herbs (like basil, parsley)'
    ]
  },
  {
    id: 'simple-chicken-dinner',
    name: 'Easy Baked Chicken Dinner',
    description: 'A straightforward baked chicken dinner that\'s perfect for beginners and endlessly customizable.',
    category: 'dinner',
    difficulty: 'beginner',
    videoId: 'cFukdTKPBTk',
    thumbnailUrl: 'https://img.youtube.com/vi/cFukdTKPBTk/hqdefault.jpg',
    duration: 45,
    steps: [
      'Preheat oven to 425°F (220°C)',
      'Pat chicken pieces dry with paper towels',
      'Season chicken generously with salt, pepper, and desired herbs/spices',
      'Arrange chicken in a baking dish with vegetables around it',
      'Drizzle everything with olive oil',
      'Bake until chicken reaches 165°F (74°C) internally, about 30-45 minutes',
      'Let rest for 5-10 minutes before serving'
    ],
    tips: [
      'Use a meat thermometer to ensure chicken is properly cooked',
      'Choose vegetables that cook in similar time to the chicken pieces',
      'For crispier skin, start with a hot oven and don\'t crowd the baking dish',
      'Season under the skin for maximum flavor'
    ],
    ingredients: [
      'Chicken pieces (breast, thighs, or whole cut-up chicken)',
      'Root vegetables (potatoes, carrots, etc.)',
      'Aromatics (onion, garlic, herbs)',
      'Olive oil',
      'Salt and pepper',
      'Optional herbs and spices'
    ]
  },
  {
    id: 'vegetarian-dinner',
    name: 'Quick Vegetarian Dinner Bowl',
    description: 'A nutritious, protein-packed vegetarian dinner bowl that comes together quickly and satisfies.',
    category: 'dinner',
    difficulty: 'beginner',
    videoId: 'SYKwfB8LRhc',
    thumbnailUrl: 'https://img.youtube.com/vi/SYKwfB8LRhc/hqdefault.jpg',
    duration: 25,
    steps: [
      'Cook grain of choice according to package directions',
      'Prepare protein (beans, tofu, etc.) and season well',
      'Roast or sauté a variety of vegetables',
      'Prepare a simple sauce or dressing',
      'Arrange grain, protein, and vegetables in a bowl',
      'Drizzle with sauce and add toppings',
      'Mix just before eating'
    ],
    tips: [
      'Cook grains in vegetable broth for extra flavor',
      'Keep pre-cooked grains in the freezer for quick meals',
      'Roast vegetables at high heat for better caramelization and flavor',
      'Add something crunchy, creamy, and acidic for a balanced bowl'
    ],
    ingredients: [
      'Grain (rice, quinoa, farro, etc.)',
      'Plant protein (beans, lentils, tofu, tempeh)',
      'Variety of vegetables',
      'Sauce or dressing',
      'Toppings (seeds, nuts, herbs, hot sauce)',
      'Optional: avocado, cheese, pickled vegetables'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      <div className="flex space-x-1 mb-4">
        <TabsList className="h-9 bg-transparent p-0 w-auto">
          <TabsTrigger 
            value="breakfast" 
            className="px-4 rounded-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-none border border-orange-200 text-gray-600 hover:text-orange-600"
          >
            <Coffee className="h-4 w-4 mr-2" />
            Breakfast
          </TabsTrigger>
          <TabsTrigger 
            value="lunch" 
            className="px-4 rounded-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-none border border-orange-200 text-gray-600 hover:text-orange-600"
          >
            <Salad className="h-4 w-4 mr-2" />
            Lunch
          </TabsTrigger>
          <TabsTrigger 
            value="dinner" 
            className="px-4 rounded-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-none border border-orange-200 text-gray-600 hover:text-orange-600"
          >
            <UtensilsCrossed className="h-4 w-4 mr-2" />
            Dinner
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="breakfast" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {breakfastTutorials.map(tutorial => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={onPlayVideo} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="lunch" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lunchTutorials.map(tutorial => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} onPlayVideo={onPlayVideo} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="dinner" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

import { EmbeddedYouTubePlayer } from './embedded-youtube-player';

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
  
  // Some tutorials should show embedded video directly
  const showEmbedded = tutorial.featured === true;
  
  // Determine border color based on category
  const getBorderColorClass = () => {
    switch(tutorial.category) {
      case 'technique':
        return 'border-blue-400';
      case 'kitchen-safety':
        return 'border-yellow-400';
      case 'basic-recipe':
        return 'border-green-400';
      case 'breakfast':
        return 'border-orange-400';
      case 'lunch':
        return 'border-orange-400';
      case 'dinner':
        return 'border-orange-400';
      default:
        return 'border-learning-color';
    }
  };

  return (
    <Card className={`overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow border-t-4 ${getBorderColorClass()} border group`}>
      {showEmbedded ? (
        <div className="aspect-video overflow-hidden w-full">
          <EmbeddedYouTubePlayer
            videoId={tutorial.videoId}
            title={tutorial.name}
            className="w-full h-full"
          />
        </div>
      ) : (
        <div 
          className="relative aspect-video cursor-pointer overflow-hidden bg-gray-100 w-full"
          onClick={handlePlayVideo}
        >
          {tutorial.thumbnailUrl ? (
            <img 
              src={tutorial.thumbnailUrl} 
              alt={tutorial.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ChefHat className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white" />
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
      )}
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold truncate group-hover:text-learning-color">
          {tutorial.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-gray-600">
          {tutorial.description}
        </CardDescription>
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
      
      {!showEmbedded && (
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className={`w-full justify-center ${
              tutorial.category === 'technique' 
                ? 'text-blue-600 hover:text-white hover:bg-blue-600 border-blue-300' 
                : tutorial.category === 'kitchen-safety'
                  ? 'text-yellow-600 hover:text-white hover:bg-yellow-600 border-yellow-300'
                  : tutorial.category === 'basic-recipe'
                    ? 'text-green-600 hover:text-white hover:bg-green-600 border-green-300'
                    : 'text-orange-600 hover:text-white hover:bg-orange-600 border-orange-300'
            }`}
            onClick={handlePlayVideo}
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            Watch Tutorial
          </Button>
        </CardFooter>
      )}
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
        <div className="border-l-4 border-blue-400 pl-3 py-1">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2 text-blue-700">
            <Utensils className="h-5 w-5" />
            Essential Cooking Techniques
          </h2>
          <p className="text-sm text-blue-600 mb-4">Learn the fundamental skills that professional chefs use daily</p>
        </div>
        <TechniqueTutorials onPlayVideo={onPlayVideo} />
      </section>
      
      <section className="mb-10">
        <div className="border-l-4 border-yellow-400 pl-3 py-1">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2 text-yellow-700">
            <AlertTriangle className="h-5 w-5" />
            Kitchen Safety & Skills
          </h2>
          <p className="text-sm text-yellow-600 mb-4">Prevent injuries and foodborne illness with proper techniques</p>
        </div>
        <KitchenSafetyTutorials onPlayVideo={onPlayVideo} />
      </section>
      
      <section className="mb-10">
        <div className="border-l-4 border-green-400 pl-3 py-1">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2 text-green-700">
            <BookOpen className="h-5 w-5" />
            Basic Recipes Everyone Should Know
          </h2>
          <p className="text-sm text-green-600 mb-4">Master these simple recipes to build your cooking confidence</p>
        </div>
        <BasicRecipesTutorials onPlayVideo={onPlayVideo} />
      </section>
      
      <section>
        <div className="border-l-4 border-orange-400 pl-3 py-1">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2 text-orange-700">
            <ChefHat className="h-5 w-5" />
            Meals by Time of Day
          </h2>
          <p className="text-sm text-orange-600 mb-4">Simple breakfast, lunch, and dinner recipes for everyday cooking</p>
        </div>
        <MealTutorials onPlayVideo={onPlayVideo} />
      </section>
    </div>
  );
};

export default CookingTutorialsContent;