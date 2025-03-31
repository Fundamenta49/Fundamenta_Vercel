import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, BookOpen, ChefHat, Clock, ExternalLink, PlayCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCookingVideos, getYouTubeEmbedUrl } from '@/lib/youtube-service';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CookingTechnique {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoId: string;
  tips: string[];
  commonUses: string[];
  thumbnailUrl?: string; // Optional thumbnail URL, if available
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
  const [selectedTechnique, setSelectedTechnique] = useState<CookingTechnique | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  // Scroll to top when changing tabs
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Basic cooking techniques with curated videos for home cooking
  const cookingTechniques: CookingTechnique[] = [
    {
      id: 'knife-skills',
      name: 'Basic Knife Skills',
      description: 'Learn safe and proper cutting techniques that every home cook should know.',
      difficulty: 'beginner',
      videoId: '20gwf7YttQM',
      thumbnailUrl: 'https://i.ytimg.com/vi/20gwf7YttQM/hqdefault.jpg',
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
      id: 'mac-and-cheese',
      name: 'Easy Mac and Cheese',
      description: 'Make this classic comfort food from scratch - creamy, cheesy, and delicious.',
      difficulty: 'beginner',
      videoId: 'FUeyrEN14Rk',
      thumbnailUrl: 'https://i.ytimg.com/vi/FUeyrEN14Rk/hqdefault.jpg',
      tips: [
        'Use medium or sharp cheddar for more flavor',
        'Cook pasta just under al dente since it will cook more in the sauce',
        'Add a little mustard powder for depth of flavor',
        'Salt your pasta water well'
      ],
      commonUses: [
        'Weeknight dinner',
        'Side dish for barbecue',
        'Kids\' favorite meal',
        'Comfort food classic'
      ]
    },
    {
      id: 'burger-basics',
      name: 'Perfect Homemade Burgers',
      description: 'Learn to make juicy, flavorful burgers at home that are better than takeout.',
      difficulty: 'beginner',
      videoId: 'iM_KMYulI_s',
      thumbnailUrl: 'https://i.ytimg.com/vi/iM_KMYulI_s/hqdefault.jpg',
      tips: [
        'Don\'t overwork the meat when forming patties',
        'Make a dimple in the center to prevent bulging',
        'Season liberally with salt just before cooking',
        'Only flip once during cooking for best crust'
      ],
      commonUses: [
        'Family cookouts',
        'Quick weeknight dinner',
        'Customizable meal for picky eaters',
        'Game day food'
      ]
    },
    {
      id: 'pancakes',
      name: 'Fluffy Homemade Pancakes',
      description: 'Master the technique for light, fluffy pancakes perfect for breakfast.',
      difficulty: 'beginner',
      videoId: 'FLd00Bx4tOk',
      thumbnailUrl: 'https://img.youtube.com/vi/FLd00Bx4tOk/maxresdefault.jpg',
      tips: [
        'Don\'t overmix the batter - lumps are okay',
        'Let the batter rest for 5-10 minutes before cooking',
        'Flip when bubbles form and edges look set',
        'Keep warm in a 200°F oven while making the batch'
      ],
      commonUses: [
        'Weekend breakfast',
        'Brunch for guests',
        'Base for fruit or chocolate chip variations',
        'Breakfast for dinner'
      ]
    },
    {
      id: 'baked-chicken',
      name: 'Easy Baked Chicken',
      description: 'A foolproof method for juicy, flavorful chicken every time.',
      difficulty: 'beginner',
      videoId: '4fdwZ1wQn_M',
      thumbnailUrl: 'https://img.youtube.com/vi/4fdwZ1wQn_M/maxresdefault.jpg',
      tips: [
        'Pat chicken dry before seasoning for crispy skin',
        'Use a meat thermometer for perfect doneness',
        'Let rest 5-10 minutes before cutting',
        'Chicken is done at 165°F internal temperature'
      ],
      commonUses: [
        'Weeknight dinner',
        'Meal prep foundation',
        'Protein for salads and sandwiches',
        'Family-friendly main dish'
      ]
    },
    {
      id: 'grilled-cheese',
      name: 'Perfect Grilled Cheese',
      description: 'Master this classic sandwich - crispy outside, gooey melted cheese inside.',
      difficulty: 'beginner',
      videoId: 'BlTCkNkfmRY', 
      thumbnailUrl: 'https://img.youtube.com/vi/BlTCkNkfmRY/maxresdefault.jpg',
      tips: [
        'Use butter at room temperature for easy spreading',
        'Cook on medium-low heat for even browning and melting',
        'Cover with a lid to help the cheese melt completely',
        'Add extras like tomato or ham for variations'
      ],
      commonUses: [
        'Quick lunch or dinner',
        'Pairing with tomato soup',
        'Late-night snack',
        'Kid-friendly meal'
      ]
    },
    {
      id: 'pasta-basics',
      name: 'Perfect Pasta Cooking',
      description: 'Learn to cook pasta properly and make simple, delicious sauces.',
      difficulty: 'beginner',
      videoId: 'UYhKDweME3A',
      thumbnailUrl: 'https://img.youtube.com/vi/UYhKDweME3A/maxresdefault.jpg',
      tips: [
        'Use plenty of water - at least 4 quarts per pound of pasta',
        'Salt the water generously (it should taste like seawater)',
        'Save some pasta water for sauces',
        'Cook until al dente - firm to the bite'
      ],
      commonUses: [
        'Quick weeknight meals',
        'Base for many sauces',
        'Meal prep foundations',
        'Versatile dish for any occasion'
      ]
    },
    {
      id: 'meatloaf',
      name: 'Classic Homemade Meatloaf',
      description: 'A homestyle favorite that\'s easy to prepare and customize.',
      difficulty: 'beginner',
      videoId: 'A-RfHC91Ewc',
      thumbnailUrl: 'https://img.youtube.com/vi/A-RfHC91Ewc/maxresdefault.jpg',
      tips: [
        'Use a mix of ground meats for better flavor',
        'Don\'t overmix or it will become dense',
        'Add a glaze during the last 15 minutes of baking',
        'Let rest 10 minutes before slicing'
      ],
      commonUses: [
        'Family dinner',
        'Comfort food classic',
        'Next-day sandwiches',
        'Make-ahead meal'
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

  // Handle opening a technique video
  const openTechniqueVideo = (technique: CookingTechnique) => {
    setSelectedTechnique(technique);
    setVideoDialogOpen(true);
  };

  // Handle opening a search result video
  const openSearchVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
        <div className="flex gap-2">
          <BookOpen className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-orange-800">Cooking Basics</h3>
            <p className="text-sm text-orange-700 mt-1">
              Learn to make popular dishes with these step-by-step video tutorials.
              Click any card to watch in fullscreen mode.
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
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
        </CardContent>
      </Card>

      <Tabs defaultValue="basics" value={activeTab} onValueChange={setActiveTab}>
        <Card>
          <CardContent className="p-4">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
              <TabsTrigger value="basics">
                <ChefHat className="mr-2 h-4 w-4" />
                Home Cooking Classics
              </TabsTrigger>
              <TabsTrigger value="all">
                <BookOpen className="mr-2 h-4 w-4" />
                All Tutorials
              </TabsTrigger>
              <TabsTrigger value="search" disabled={searchResults.length === 0}>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search Results
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        {/* Basic Techniques and All Tutorials */}
        <TabsContent value="basics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTechniques.map(technique => (
              <Card key={technique.id} className="overflow-hidden flex flex-col h-full">
                <div 
                  className="aspect-video relative cursor-pointer" 
                  onClick={() => openTechniqueVideo(technique)}
                >
                  {technique.thumbnailUrl ? (
                    <img 
                      src={technique.thumbnailUrl} 
                      alt={technique.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
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
                <CardContent className="pb-4 flex-grow">
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
                    onClick={() => openTechniqueVideo(technique)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cookingTechniques.map(technique => (
              <Card key={technique.id} className="overflow-hidden flex flex-col h-full">
                <div 
                  className="aspect-video relative cursor-pointer" 
                  onClick={() => openTechniqueVideo(technique)}
                >
                  {technique.thumbnailUrl ? (
                    <img 
                      src={technique.thumbnailUrl} 
                      alt={technique.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ChefHat className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
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
                <CardContent className="pb-4 flex-grow">
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
                    onClick={() => openTechniqueVideo(technique)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Search Results */}
        <TabsContent value="search" className="mt-4">
          {isSearching ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Searching for tutorials...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map(video => (
                <Card key={video.id} className="overflow-hidden flex flex-col h-full">
                  <div 
                    className="aspect-video relative cursor-pointer" 
                    onClick={() => openSearchVideo(video)}
                  >
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                      <PlayCircle className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {video.channelTitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <ScrollArea className="h-16">
                      <p className="text-sm text-gray-600">
                        {video.description}
                      </p>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openSearchVideo(video)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Watch Tutorial
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {searchResults.length === 0 && (
                <Card className="col-span-2">
                  <CardContent className="text-center py-12">
                    <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No tutorials found</h3>
                    <p className="text-gray-500 mt-1">
                      Try searching for different cooking techniques or recipes
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Dialog for Technique Videos */}
      {selectedTechnique && (
        <VideoPlayerDialog
          open={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          videoId={selectedTechnique.videoId}
          title={selectedTechnique.name}
          description={selectedTechnique.description}
        />
      )}

      {/* Video Dialog for Search Result Videos */}
      {selectedVideo && (
        <VideoPlayerDialog
          open={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          description={selectedVideo.description}
        />
      )}
    </div>
  );
};

export default CookingTutorials;