import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, BookOpen, ChefHat, Clock, ExternalLink, PlayCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCookingVideos, getYouTubeEmbedUrl } from '@/lib/youtube-service';

interface CookingTechnique {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoId: string;
  tips: string[];
  commonUses: string[];
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}

const CookingTutorials = () => {
  const [activeTab, setActiveTab] = useState('basics');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  // Basic cooking techniques with curated videos
  const cookingTechniques: CookingTechnique[] = [
    {
      id: 'knife-skills',
      name: 'Knife Skills',
      description: 'Learn proper cutting techniques to improve safety and efficiency in the kitchen.',
      difficulty: 'beginner',
      videoId: '20gwf7YttQM',
      tips: [
        'Keep your fingers curled under when holding food',
        'Let the knife do the work - don\'t force it',
        'Keep your knife sharp - dull knives are dangerous',
        'Use a claw grip to protect your fingertips'
      ],
      commonUses: [
        'Dicing onions',
        'Julienning vegetables',
        'Mincing garlic and herbs',
        'Slicing meat'
      ]
    },
    {
      id: 'sauteing',
      name: 'Sautéing',
      description: 'A quick cooking method using high heat and a small amount of fat.',
      difficulty: 'beginner',
      videoId: 'UH3O6AmFn8k',
      tips: [
        'Preheat the pan before adding oil',
        'Don\'t overcrowd the pan - cook in batches if needed',
        'Pat food dry before sautéing for better browning',
        'Use medium-high to high heat'
      ],
      commonUses: [
        'Cooking vegetables quickly',
        'Browning meat before braising',
        'Making stir-fries',
        'Cooking tender cuts of meat'
      ]
    },
    {
      id: 'boiling',
      name: 'Boiling & Simmering',
      description: 'Cooking food in liquid at or just below the boiling point.',
      difficulty: 'beginner',
      videoId: 'dtPKRL5Lcfo',
      tips: [
        'Salt your water for pasta and vegetables',
        'Start with cold water for even cooking of whole items',
        'Use hot water when you want to maintain the shape of delicate foods',
        'A gentle simmer is better than a rolling boil for most foods'
      ],
      commonUses: [
        'Cooking pasta',
        'Preparing rice and other grains',
        'Boiling eggs',
        'Making soups and stews'
      ]
    },
    {
      id: 'roasting',
      name: 'Roasting',
      description: 'Cooking food with dry heat in an oven, usually with oil or fat.',
      difficulty: 'beginner',
      videoId: 'IZafGGSBuNI',
      tips: [
        'Preheat your oven thoroughly',
        'Use a similar-sized pan to the amount of food',
        'Don\'t overcrowd the pan - leave space between items',
        'For meat, let it rest after roasting before slicing'
      ],
      commonUses: [
        'Roasting vegetables',
        'Cooking whole chicken or turkey',
        'Preparing roast beef or pork',
        'Roasting potatoes'
      ]
    },
    {
      id: 'basic-eggs',
      name: 'Cooking Eggs',
      description: 'Master various ways to prepare eggs - a fundamental protein.',
      difficulty: 'beginner',
      videoId: 'qWAagS_MANg',
      tips: [
        'Use fresh eggs for frying and poaching',
        'Older eggs are easier to peel when hard-boiled',
        'Cook scrambled eggs on low heat for creamier texture',
        'Add water for fluffier scrambled eggs, milk for creamier ones'
      ],
      commonUses: [
        'Breakfast dishes',
        'Adding protein to salads',
        'Making quick meals',
        'Baking and desserts'
      ]
    },
    {
      id: 'grilled-cheese',
      name: 'Grilled Cheese Sandwich',
      description: 'A perfect first recipe - simple but delicious.',
      difficulty: 'beginner',
      videoId: 'BlTCkNkfmRY',
      tips: [
        'Use butter at room temperature for easy spreading',
        'Cook on medium-low heat for even melting',
        'Cover with a lid to help the cheese melt',
        'Add extras like tomato or ham for variations'
      ],
      commonUses: [
        'Quick lunch or dinner',
        'Pairing with soup',
        'Late-night snack',
        'Kid-friendly meal'
      ]
    },
    {
      id: 'pasta-basics',
      name: 'Basic Pasta Cooking',
      description: 'How to properly cook pasta and make simple sauces.',
      difficulty: 'beginner',
      videoId: 'OMRUIrbZHlY',
      tips: [
        'Use plenty of water - at least 4 quarts per pound of pasta',
        'Salt the water generously (it should taste like seawater)',
        'Save some pasta water for sauces',
        'Cook until al dente - firm to the bite'
      ],
      commonUses: [
        'Quick weeknight meals',
        'Base for many Italian dishes',
        'Meal prep foundations',
        'Versatile dish for any occasion'
      ]
    },
    {
      id: 'basic-salad',
      name: 'Simple Salad & Dressing',
      description: 'Learn to make fresh salads and homemade dressings.',
      difficulty: 'beginner',
      videoId: 'RVQnneIcGkY',
      tips: [
        'Wash and thoroughly dry greens before dressing',
        'Basic vinaigrette ratio: 3 parts oil to 1 part acid (vinegar or citrus)',
        'Dress salads just before serving to prevent wilting',
        'Season the dressing well - even salads need salt and pepper'
      ],
      commonUses: [
        'Side dish for any meal',
        'Healthy lunch option',
        'Using fresh seasonal produce',
        'Adding greens to your diet'
      ]
    }
  ];

  // Filter techniques based on active tab
  const filteredTechniques = activeTab === 'basics' 
    ? cookingTechniques.filter(technique => technique.difficulty === 'beginner')
    : activeTab === 'all' 
      ? cookingTechniques 
      : cookingTechniques.filter(technique => technique.id === activeTab);

  // Handle video search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setActiveTab('search');
      const results = await searchCookingVideos(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for videos:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
        <div className="flex gap-2">
          <BookOpen className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-800">Basic Cooking Techniques</h3>
            <p className="text-sm text-orange-700 mt-1">
              Master these fundamental cooking methods to build your confidence in the kitchen.
              Each technique includes a helpful video tutorial and practical tips to get you started.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for cooking tutorials (e.g., 'how to make mac and cheese')"
          className="flex-1"
        />
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          <SearchIcon className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
      
      <Tabs defaultValue="basics" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="basics">
            <ChefHat className="mr-2 h-4 w-4" />
            Basic Techniques
          </TabsTrigger>
          <TabsTrigger value="all">
            <BookOpen className="mr-2 h-4 w-4" />
            All Tutorials
          </TabsTrigger>
          <TabsTrigger value="search" disabled={searchResults.length === 0}>
            <SearchIcon className="mr-2 h-4 w-4" />
            Search Results
          </TabsTrigger>
          <TabsTrigger value="saved" disabled>
            <BookOpen className="mr-2 h-4 w-4" />
            Saved Tutorials
          </TabsTrigger>
        </TabsList>
        
        {/* Basic Techniques and All Tutorials */}
        {(activeTab === 'basics' || activeTab === 'all') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTechniques.map(technique => (
              <Card key={technique.id} className="overflow-hidden h-full">
                <div className="aspect-video">
                  <iframe 
                    src={`https://www.youtube.com/embed/${technique.videoId}`}
                    title={technique.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{technique.name}</CardTitle>
                    <Badge 
                      className={
                        technique.difficulty === 'beginner' 
                          ? 'bg-green-100 text-green-800' 
                          : technique.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                    >
                      {technique.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{technique.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <h4 className="text-sm font-medium mb-2">Quick Tips:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                    {technique.tips.slice(0, 2).map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${technique.videoId}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Search Results */}
        <TabsContent value="search">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Searching for tutorials...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map(video => (
                <Card key={video.id} className="overflow-hidden">
                  {selectedVideo?.id === video.id ? (
                    <div className="aspect-video">
                      <iframe 
                        src={getYouTubeEmbedUrl(video.id)}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div 
                      className="aspect-video relative cursor-pointer" 
                      onClick={() => setSelectedVideo(video)}
                    >
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {video.channelTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Watch on YouTube
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {searchResults.length === 0 && (
                <div className="col-span-2 text-center py-12 border rounded-lg bg-gray-50">
                  <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tutorials found</h3>
                  <p className="text-gray-500 mt-1">
                    Try searching for different cooking techniques or recipes
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CookingTutorials;