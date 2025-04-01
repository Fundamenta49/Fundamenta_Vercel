import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, BookOpen, ChefHat, PlayCircle, Utensils, ShieldAlert, BookMarked, Coffee, Salad, UtensilsCrossed, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  searchCookingVideos,
  getCookingVideosByCategory,
  formatVideoLength,
  CookingVideo
} from '@/lib/cooking-videos-service';
import { useToast } from '@/hooks/use-toast';

type Category = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  queryValue: string;
};

const CookingTutorials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CookingVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<CookingVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVideos, setCategoryVideos] = useState<CookingVideo[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Scroll to top when showing search results or changing categories
  useEffect(() => {
    if (showSearchResults || selectedCategory) {
      window.scrollTo(0, 0);
    }
  }, [showSearchResults, selectedCategory]);

  // Categories of cooking content
  const categories: Category[] = [
    {
      id: 'technique',
      name: 'Cooking Techniques',
      description: 'Master essential cooking methods like sautéing, braising, and baking',
      icon: <Utensils className="h-5 w-5 text-orange-600" />,
      queryValue: 'techniques'
    },
    {
      id: 'kitchen-safety',
      name: 'Kitchen Tools & Safety',
      description: 'Learn proper tool usage, food safety, and kitchen organization',
      icon: <ShieldAlert className="h-5 w-5 text-orange-600" />,
      queryValue: 'kitchen safety'
    },
    {
      id: 'basic-recipe',
      name: 'Basic Recipes',
      description: 'Simple, foundational recipes every home cook should know',
      icon: <BookMarked className="h-5 w-5 text-orange-600" />,
      queryValue: 'basic recipes'
    },
    {
      id: 'breakfast',
      name: 'Breakfast Recipes',
      description: 'Start your day with delicious morning meal ideas',
      icon: <Coffee className="h-5 w-5 text-orange-600" />,
      queryValue: 'breakfast'
    },
    {
      id: 'lunch',
      name: 'Lunch Recipes',
      description: 'Quick and satisfying midday meal options',
      icon: <Salad className="h-5 w-5 text-orange-600" />,
      queryValue: 'lunch'
    },
    {
      id: 'dinner',
      name: 'Dinner Recipes',
      description: 'Hearty and flavorful evening meal recipes',
      icon: <UtensilsCrossed className="h-5 w-5 text-orange-600" />,
      queryValue: 'dinner'
    }
  ];

  // Load videos for a specific category
  const loadCategoryVideos = async (categoryId: string) => {
    setIsLoadingCategory(true);
    setCategoryError(null);
    try {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      
      const videos = await getCookingVideosByCategory(category.queryValue);
      setCategoryVideos(videos);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Error loading category videos:', error);
      setCategoryError('Failed to load videos for this category. Please try again.');
      toast({
        title: 'Error loading videos',
        description: 'We had trouble loading videos for this category. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingCategory(false);
    }
  };

  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: 'Please enter a search term',
        description: 'Type what you\'d like to learn about in the search box',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchCookingVideos(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error searching videos:', error);
      toast({
        title: 'Search error',
        description: 'We had trouble searching for videos. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Play a video
  const playVideo = (video: CookingVideo) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      // Already selected, do nothing
      return;
    }
    
    loadCategoryVideos(categoryId);
    setShowSearchResults(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Find Cooking Tutorials
          </CardTitle>
          <CardDescription>
            Search for specific cooking techniques, recipes, or ingredients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for recipes, techniques, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Main Content Area - conditionally render search results, category, or categories list */}
      {showSearchResults ? (
        // SEARCH RESULTS
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Search Results</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSearchResults(false)}
                  className="text-sm"
                >
                  Back to Categories
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Searching for videos...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((video) => (
                    <Card key={video.id} className="overflow-hidden h-full flex flex-col">
                      <div 
                        className="relative aspect-video cursor-pointer overflow-hidden"
                        onClick={() => playVideo(video)}
                      >
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs rounded px-1.5 py-0.5">
                          {formatVideoLength(video.length)}
                        </div>
                      </div>
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-base line-clamp-2 h-12">{video.title}</CardTitle>
                      </CardHeader>
                      <CardFooter className="p-3 pt-0 mt-auto">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => playVideo(video)}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No videos found for "{searchQuery}"</p>
                  <p className="text-gray-400 text-sm mt-1">Try different keywords or browse our categories</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : selectedCategory ? (
        // SELECTED CATEGORY
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {categories.find(cat => cat.id === selectedCategory)?.icon}
                  <CardTitle>{categories.find(cat => cat.id === selectedCategory)?.name}</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm"
                >
                  All Categories
                </Button>
              </div>
              <CardDescription>
                {categories.find(cat => cat.id === selectedCategory)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCategory ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading videos...</p>
                </div>
              ) : categoryError ? (
                <div className="text-center py-8 text-red-500">
                  <p>{categoryError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => loadCategoryVideos(selectedCategory)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : categoryVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden h-full flex flex-col">
                      <div 
                        className="relative aspect-video cursor-pointer overflow-hidden"
                        onClick={() => playVideo(video)}
                      >
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs rounded px-1.5 py-0.5">
                          {formatVideoLength(video.length)}
                        </div>
                      </div>
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-base line-clamp-2 h-12">{video.title}</CardTitle>
                      </CardHeader>
                      <CardFooter className="p-3 pt-0 mt-auto">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => playVideo(video)}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No videos found for this category</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Browse Other Categories
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // CATEGORIES LIST
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" size="sm" className="mt-2">
                  Browse Videos <PlayCircle className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Video Player Dialog */}
      <VideoPlayerDialog
        open={videoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        videoId={selectedVideo?.youTubeId || ''}
        title={selectedVideo?.title || ''}
      />
    </div>
  );
};

export default CookingTutorials;