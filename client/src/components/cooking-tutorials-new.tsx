import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, BookOpen, ChefHat, PlayCircle, Utensils, ShieldAlert, BookMarked, Coffee, Salad, UtensilsCrossed, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CookingTutorialsContent } from '@/components/cooking-tutorials-content';
import { 
  searchCookingVideos,
  getCookingVideosByCategory,
  formatVideoLength,
  CookingVideo,
  searchYouTubeVideos
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

  // Difficulty levels for tutorials
  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner', description: 'Perfect for first-time cooks learning basics' },
    { id: 'intermediate', name: 'Intermediate', description: 'For those who have mastered the basics' },
    { id: 'advanced', name: 'Advanced', description: 'Complex techniques for experienced cooks' }
  ];
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('beginner');
  
  // Function to determine difficulty level based on video metadata
  // This is a simple heuristic that could be improved with actual API data
  const categorizeDifficulty = (video: CookingVideo): 'beginner' | 'intermediate' | 'advanced' => {
    const title = video.title.toLowerCase();
    const views = video.views;
    
    // Keywords that might indicate difficulty levels
    const beginnerKeywords = ['basic', 'simple', 'easy', 'beginner', 'how to', '101', 'first time'];
    const advancedKeywords = ['complex', 'advanced', 'gourmet', 'professional', 'chef', 'perfect', 'master'];
    
    // Check for beginner keywords
    for (const keyword of beginnerKeywords) {
      if (title.includes(keyword)) {
        return 'beginner';
      }
    }
    
    // Check for advanced keywords
    for (const keyword of advancedKeywords) {
      if (title.includes(keyword)) {
        return 'advanced';
      }
    }
    
    // Default to intermediate if no matches
    return 'intermediate';
  };
  
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
      
      // Assign difficulty levels to videos
      const videosWithDifficulty = videos.map(video => {
        return {
          ...video,
          difficulty: categorizeDifficulty(video)
        };
      });
      
      setCategoryVideos(videosWithDifficulty as CookingVideo[]);
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
      // Try to search with YouTube API first (more reliable)
      let results = await searchYouTubeVideos(searchQuery, 'cooking');
      
      // If YouTube API fails or returns no results, fall back to Spoonacular
      if (!results || results.length === 0) {
        console.log('YouTube search returned no results, trying Spoonacular API');
        results = await searchCookingVideos(searchQuery);
      }
      
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
  
  // Play a video from tutorial content
  const playTutorialVideo = (videoId: string, title: string, description?: string) => {
    console.log('playTutorialVideo called with:', { videoId, title, description });
    
    // Validate videoId
    if (!videoId) {
      console.error('Error: Attempted to play a video without a videoId');
      toast({
        title: "Video Error",
        description: "Could not play this video. Invalid video ID.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a CookingVideo object from the tutorial data
    const tutorialVideo: CookingVideo = {
      id: videoId,
      title: title,
      description: description || '',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      youTubeId: videoId,
      length: 0, // We don't have this information from the tutorial data
      views: 0,  // We don't have this information from the tutorial data
      difficulty: 'beginner'
    };
    
    // Log the video data to help with debugging
    console.log('Created tutorial video object:', tutorialVideo);
    
    setSelectedVideo(tutorialVideo);
    setVideoDialogOpen(true);
    
    console.log('Video dialog should now be open with video ID:', videoId);
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
      <Card className="shadow-sm border-t-4 border-t-learning-color">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-learning-color">
            <SearchIcon className="h-5 w-5" />
            Find Cooking Tutorials
          </CardTitle>
          <CardDescription>
            Search for specific cooking techniques, recipes, or ingredients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Search for recipes, techniques, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isSearching} 
              className="bg-learning-color hover:bg-learning-color/90"
            >
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
      {showSearchResults === true ? (
        // SEARCH RESULTS
        <div className="space-y-6">
          <Card className="shadow-sm border-t-4 border-t-learning-color">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-learning-color flex items-center gap-2">
                  <SearchIcon className="h-5 w-5" />
                  Search Results
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSearchResults(false)}
                  className="text-sm"
                >
                  <PlayCircle className="mr-1.5 h-4 w-4" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <Card className="shadow-sm border-t-4 border-t-learning-color">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-learning-color">
                      {categories.find(cat => cat.id === selectedCategory)?.icon}
                    </div>
                    <CardTitle className="text-learning-color">
                      {categories.find(cat => cat.id === selectedCategory)?.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    {categories.find(cat => cat.id === selectedCategory)?.description}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm whitespace-nowrap"
                >
                  <Utensils className="mr-1.5 h-4 w-4" />
                  All Categories
                </Button>
              </div>
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
                <div className="space-y-6">
                  {/* Difficulty level filter */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-sm font-medium mb-3">Difficulty Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {difficultyLevels.map((level) => (
                        <Button
                          key={level.id}
                          variant={selectedDifficulty === level.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDifficulty(level.id)}
                          className={
                            level.id === 'beginner' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' :
                            level.id === 'intermediate' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200' :
                            'bg-red-100 text-red-800 hover:bg-red-200 border-red-200'
                          }
                        >
                          {level.name}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {difficultyLevels.find(level => level.id === selectedDifficulty)?.description}
                    </p>
                  </div>
                  
                  {/* Videos grid with difficulty filtering */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {difficultyLevels.find(level => level.id === selectedDifficulty)?.name} {categories.find(cat => cat.id === selectedCategory)?.name}
                    </h3>
                    
                    {/* Filter videos by selected difficulty */}
                    {(() => {
                      const filteredVideos = categoryVideos.filter(
                        video => video.difficulty === selectedDifficulty
                      );
                      
                      if (filteredVideos.length === 0) {
                        return (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No videos found for this difficulty level</p>
                            <p className="text-sm text-gray-400 mt-1">Try selecting a different difficulty level</p>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredVideos.map((video) => (
                            <Card key={video.id} className="overflow-hidden h-full flex flex-col border-learning-color shadow-sm transition-all duration-200 hover:shadow-md">
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
                                <div className="absolute top-2 left-2">
                                  <span className={`
                                    text-xs rounded px-2 py-1 font-medium
                                    ${video.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                                      video.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}
                                  `}>
                                    {video.difficulty ? `${video.difficulty.charAt(0).toUpperCase()}${video.difficulty.slice(1)}` : 'Beginner'}
                                  </span>
                                </div>
                              </div>
                              <CardHeader className="p-3 pb-2">
                                <CardTitle className="text-base line-clamp-2 h-12">{video.title}</CardTitle>
                              </CardHeader>
                              <CardFooter className="p-3 pt-0 mt-auto">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="ml-auto text-learning-color hover:text-learning-color/90 hover:bg-learning-color/10"
                                  onClick={() => playVideo(video)}
                                >
                                  <PlayCircle className="h-4 w-4 mr-1" />
                                  Watch
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Difficulty level descriptions */}
                  <div className="border rounded-lg p-4 mt-8 bg-gray-50">
                    <h3 className="font-medium mb-2">About Our Difficulty Levels</h3>
                    <div className="grid gap-3 mt-2">
                      <div className="flex gap-2">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Beginner</div>
                        <div className="text-sm">
                          <p>First-time cooks: Basic recipes like how to fry an egg, make scrambled eggs, or a simple omelette</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Intermediate</div>
                        <div className="text-sm">
                          <p>Builds on basics: Poached eggs with hollandaise, egg dishes with multiple components</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">Advanced</div>
                        <div className="text-sm">
                          <p>Complex techniques: Soufflés, multi-component egg dishes, and restaurant-quality preparations</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
        // Main Content - Tabs for API Search vs Curated Content
        <div className="space-y-6">
          <Card className="shadow-sm border-t-4 border-t-learning-color overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-learning-color">
                <ChefHat className="h-5 w-5" />
                Learn to Cook - Step by Step
              </CardTitle>
              <CardDescription>
                Cooking fundamentals, recipes, and techniques to build your confidence in the kitchen
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <Tabs defaultValue="curated" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="curated" className="text-sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Curated Learning Path
                  </TabsTrigger>
                  <TabsTrigger value="categories" className="text-sm">
                    <Utensils className="h-4 w-4 mr-2" />
                    Browse Categories
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="curated" className="mt-0">
                  {/* Curated Content from our new component */}
                  <CookingTutorialsContent onPlayVideo={playTutorialVideo} />
                </TabsContent>
                
                <TabsContent value="categories" className="mt-0">
                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card 
                        key={category.id} 
                        className="cursor-pointer transition-all duration-200 hover:scale-[1.02] border-learning-color shadow-sm overflow-hidden"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="text-learning-color">
                              {category.icon}
                            </div>
                            <CardTitle className="text-lg text-learning-color">{category.name}</CardTitle>
                          </div>
                          <CardDescription className="line-clamp-2">{category.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-learning-color hover:text-learning-color/90 hover:bg-learning-color/10"
                          >
                            Browse Videos <PlayCircle className="ml-1 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video Player Dialog */}
      {selectedVideo && (
        <span className="sr-only">Selected video ID: {selectedVideo.youTubeId}</span>
      )}
      <VideoPlayerDialog
        open={videoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        videoId={selectedVideo?.youTubeId || ''}
        title={selectedVideo?.title || ''}
        description={selectedVideo?.description || ''}
      />
    </div>
  );
};

export default CookingTutorials;