import { useState, useEffect } from 'react';
import { 
  Search, 
  Utensils, 
  ChefHat, 
  Clock, 
  Youtube,
  PlayCircle,
  AlertCircle,
  RefreshCw,
  Info,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SpoonacularService, Recipe } from '@/services/spoonacular-service';
import { searchCookingVideos } from '@/lib/youtube-service';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeDetailDialog } from '@/components/recipe-detail-dialog';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}

export default function RecipeExplorerPopOut() {
  // State for recipe and video data
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  
  // UI state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  
  // Loading states
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  // Error states
  const [apiRateLimited, setApiRateLimited] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  // Initialize component
  useEffect(() => {
    checkApiStatus().then(available => {
      if (available) {
        fetchBasicHomeCookingRecipes();
      } else {
        fetchCookingVideos("beginner cooking");
      }
    });
  }, []);
  
  // Check API status to see if it's available or rate-limited
  const checkApiStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/cooking/spoonacular-status');
      const data = await response.json();
      
      if (!response.ok || data.status === 'rate_limited' || data.code === 402) {
        setApiRateLimited(true);
        setApiErrorMessage(data.message || 'Spoonacular API daily limit reached. Try again tomorrow.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking API status:', error);
      setApiRateLimited(true);
      setApiErrorMessage('Unable to connect to recipe API. Please try again later.');
      return false;
    }
  };

  // Load cooking videos for a search term
  const fetchCookingVideos = async (query: string) => {
    try {
      setLoadingVideos(true);
      const videoResults = await searchCookingVideos(query);
      setVideos(videoResults);
    } catch (error) {
      console.error('Error fetching cooking videos:', error);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Try to load basic recipes for beginners
  const fetchBasicHomeCookingRecipes = async () => {
    try {
      setLoadingRecipes(true);
      
      // Check API status first
      const apiIsAvailable = await checkApiStatus();
      if (!apiIsAvailable) {
        // If API is not available, at least try to load videos
        fetchCookingVideos("easy home cooking");
        setLoadingRecipes(false);
        return;
      }
      
      // Focus on simple home cooking dishes for beginners
      const basicHomeCookingDishes = [
        "mac and cheese", 
        "simple burger", 
        "basic pancakes", 
        "easy pasta", 
        "homemade pizza", 
        "grilled cheese", 
        "baked chicken", 
        "spaghetti"
      ];
      
      // Get a random selection of dishes to search for
      const randomSelections = basicHomeCookingDishes
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      
      try {
        const results = await Promise.all(
          randomSelections.map(dish => 
            SpoonacularService.searchRecipes(dish, undefined, undefined, undefined, 30)
          )
        );
        
        // Combine and shuffle the results
        const combinedRecipes = results
          .flatMap(result => result.results || [])
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        
        setRandomRecipes(combinedRecipes);
      } catch (error) {
        // If search fails, try random recipes as fallback
        console.error('Recipe search failed, trying random recipes:', error);
        
        try {
          const response = await SpoonacularService.getRandomRecipes(8);
          setRandomRecipes(response.recipes || []);
        } catch (fallbackError) {
          console.error('Random recipes fallback failed:', fallbackError);
          handleApiError(fallbackError);
        }
      }
    } catch (error) {
      console.error('Error in recipe fetching flow:', error);
      handleApiError(error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoadingRecipes(true);
    setLoadingVideos(true);
    
    try {
      // Always try to get videos regardless of API status
      fetchCookingVideos(searchQuery);
      
      // Check if Spoonacular API is available
      const apiIsAvailable = await checkApiStatus();
      
      if (apiIsAvailable) {
        try {
          const searchResult = await SpoonacularService.searchRecipes(searchQuery);
          setRecipes(searchResult.results || []);
        } catch (error) {
          console.error('Recipe search failed:', error);
          handleApiError(error);
        }
      }
      
      // Switch to results tab
      setActiveTab('results');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoadingRecipes(false);
      setLoadingVideos(false);
    }
  };

  // Helper to handle API errors consistently
  const handleApiError = (error: any) => {
    if (typeof error === 'object' && error !== null) {
      // Check for rate limit errors (402 status code)
      if (
        ('status' in error && error.status === 402) || 
        ('response' in error && error.response?.status === 402) ||
        ('code' in error && error.code === 402)
      ) {
        setApiRateLimited(true);
        setApiErrorMessage('Spoonacular API daily points limit has been reached. Please try again tomorrow.');
      } else if ('message' in error) {
        setApiErrorMessage(error.message);
      }
    } else {
      setApiErrorMessage('An unknown error occurred while fetching recipes.');
    }
  };

  // View recipe details
  const viewRecipeDetails = async (id: number) => {
    try {
      // Check API status first
      if (apiRateLimited) {
        setApiErrorMessage('Cannot view recipe details while API is rate limited.');
        return;
      }
      
      const recipe = await SpoonacularService.getRecipeById(id);
      setSelectedRecipe(recipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      handleApiError(error);
    }
  };

  // Render API error alert if needed
  const renderApiAlert = () => {
    if (!apiRateLimited && !apiErrorMessage) return null;
    
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Recipe API Unavailable</AlertTitle>
        <AlertDescription>
          {apiErrorMessage || "The recipe database is currently unavailable due to API rate limits. Video tutorials are still available below."}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="w-full">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-orange-500" />
          Recipe Explorer
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Discover delicious recipes and cooking tutorials for every skill level
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <div className="space-y-4 mb-6">          
          {/* API status alert */}
          {renderApiAlert()}
          
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for recipes or cooking techniques..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600"
              disabled={loadingRecipes}
            >
              {loadingRecipes ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </form>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="discover" className="flex-1">
              <ChefHat className="mr-2 h-4 w-4" />
              Discover Recipes
            </TabsTrigger>
            <TabsTrigger value="results" className="flex-1">
              <Utensils className="mr-2 h-4 w-4" />
              Search Results
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-1">
              <Youtube className="mr-2 h-4 w-4" />
              Video Tutorials
            </TabsTrigger>
          </TabsList>

          {/* Discover tab */}
          <TabsContent value="discover" className="space-y-6">
            {apiRateLimited && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-orange-800">Recipe API Unavailable</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Recipe data is temporarily unavailable due to API rate limits. Please check the Video Tutorials tab for cooking content.
                    </p>
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        onClick={() => setActiveTab('videos')}
                      >
                        <Youtube className="mr-2 h-4 w-4" />
                        View Video Tutorials
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!apiRateLimited && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Popular Home Cooking Ideas
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchBasicHomeCookingRecipes}
                    disabled={loadingRecipes}
                  >
                    {loadingRecipes ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {loadingRecipes ? (
                    Array(8).fill(0).map((_, i) => (
                      <RecipeCardSkeleton key={i} />
                    ))
                  ) : randomRecipes.length > 0 ? (
                    randomRecipes.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe}
                        onViewDetails={() => viewRecipeDetails(recipe.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <ChefHat className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No recipes available</h3>
                      <p className="text-gray-500 mt-1 mb-4">
                        {apiRateLimited 
                          ? "Recipe data is unavailable due to API rate limits." 
                          : "Try searching for specific recipes or ingredients."}
                      </p>
                      <Button onClick={() => setActiveTab('videos')}>
                        <Youtube className="mr-2 h-4 w-4" />
                        Browse Cooking Videos
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Cooking guides section (always visible) */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Cooking Guides for Beginners
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="h-4 w-4 text-amber-500" />
                      Kitchen Essentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Learn about the essential tools and ingredients every home cook should have.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('videos')}>
                      Browse Videos
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      Knife Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Master basic cutting techniques to prepare ingredients safely and efficiently.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('videos')}>
                      Browse Videos
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Basic Cooking Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Understand sautéing, roasting, boiling, and other fundamental cooking techniques.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('videos')}>
                      Browse Videos
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Search results tab */}
          <TabsContent value="results" className="space-y-6">
            {apiRateLimited && (
              <Alert variant="default" className="bg-amber-50 border-amber-200 mb-4">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertTitle>Recipe Search Limited</AlertTitle>
                <AlertDescription>
                  Recipe search is currently unavailable due to API limits. Please try again tomorrow or browse our video tutorials instead.
                </AlertDescription>
              </Alert>
            )}
            
            {searchQuery && (
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Results for "{searchQuery}"
                </h2>
                {!apiRateLimited && (
                  <Badge variant="outline" className="text-gray-600">
                    {recipes.length} recipes found
                  </Badge>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {loadingRecipes ? (
                Array(8).fill(0).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))
              ) : recipes.length > 0 ? (
                recipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe}
                    onViewDetails={() => viewRecipeDetails(recipe.id)}
                  />
                ))
              ) : (
                searchQuery && (
                  <div className="col-span-full text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No recipe results found</h3>
                    <p className="text-gray-500 mt-1 mb-4">
                      {apiRateLimited 
                        ? "Recipe search is currently unavailable due to API rate limits." 
                        : "Try searching with different keywords or check the video tutorials."}
                    </p>
                    {!apiRateLimited && (
                      <Button onClick={fetchBasicHomeCookingRecipes} className="mr-2">
                        <ChefHat className="mr-2 h-4 w-4" />
                        Show Popular Recipes
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setActiveTab('videos')}>
                      <Youtube className="mr-2 h-4 w-4" />
                      View Videos
                    </Button>
                  </div>
                )
              )}
            </div>
            
            {videos.length > 0 && (
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Related Video Tutorials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.slice(0, 2).map(video => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onClick={() => {
                        setSelectedVideo(video);
                        setVideoDialogOpen(true);
                      }}
                    />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setActiveTab('videos')}>
                    View All Video Tutorials
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Videos tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {searchQuery ? `Video Tutorials for "${searchQuery}"` : "Cooking Video Tutorials"}
              </h2>
              {videos.length > 0 && (
                <Badge variant="outline" className="text-gray-600">
                  {videos.length} videos found
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {loadingVideos ? (
                Array(4).fill(0).map((_, i) => (
                  <VideoCardSkeleton key={i} />
                ))
              ) : videos.length > 0 ? (
                videos.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => {
                      setSelectedVideo(video);
                      setVideoDialogOpen(true);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Youtube className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No video tutorials found</h3>
                  <p className="text-gray-500 mt-1">
                    Try searching for specific cooking techniques or recipes
                  </p>
                  <Button 
                    onClick={() => fetchCookingVideos("beginner cooking")} 
                    className="mt-4"
                  >
                    Show Beginner Cooking Videos
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recipe detail dialog */}
        {selectedRecipe && (
          <RecipeDetailDialog
            recipe={selectedRecipe}
            open={Boolean(selectedRecipe)}
            onOpenChange={(open) => {
              if (!open) setSelectedRecipe(null);
            }}
          />
        )}

        {/* Video player dialog */}
        {selectedVideo && (
          <VideoPlayerDialog
            open={videoDialogOpen}
            onOpenChange={setVideoDialogOpen}
            videoId={selectedVideo.id}
            title={selectedVideo.title}
            description={selectedVideo.description}
          />
        )}
      </FullScreenDialogBody>
    </div>
  );
}

// Recipe card component
const RecipeCard = ({ recipe, onViewDetails }: { recipe: Recipe; onViewDetails: () => void }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
    <div className="relative h-[180px] overflow-hidden">
      {recipe.image ? (
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <Utensils className="h-12 w-12 text-gray-400" />
        </div>
      )}
      {recipe.readyInMinutes && (
        <div className="absolute bottom-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded-full flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {recipe.readyInMinutes} min
        </div>
      )}
    </div>
    <CardHeader className="p-3 pb-0">
      <CardTitle className="text-base line-clamp-2 h-12">{recipe.title}</CardTitle>
      {recipe.dishTypes && recipe.dishTypes.length > 0 && (
        <CardDescription className="flex flex-wrap gap-1 mt-1 min-h-[24px]">
          {recipe.dishTypes.slice(0, 2).map(type => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </CardDescription>
      )}
    </CardHeader>
    <CardContent className="p-3 pt-2 flex-grow">
      {recipe.summary && (
        <p className="text-sm text-gray-600 line-clamp-2 h-10" 
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        />
      )}
    </CardContent>
    <CardFooter className="p-3 pt-0">
      <Button 
        onClick={onViewDetails}
        variant="outline" 
        className="w-full"
      >
        View Recipe
      </Button>
    </CardFooter>
  </Card>
);

// Video card component
const VideoCard = ({ video, onClick }: { video: YouTubeVideo; onClick: () => void }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative">
      <img 
        src={video.thumbnailUrl} 
        alt={video.title} 
        className="w-full h-[200px] object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-white/80 hover:bg-white text-orange-500"
          onClick={onClick}
        >
          <PlayCircle className="h-7 w-7" />
        </Button>
      </div>
    </div>
    <CardHeader className="p-4 pb-2">
      <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
      <CardDescription>{video.channelTitle}</CardDescription>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={onClick}
      >
        <Youtube className="mr-2 h-4 w-4" />
        Watch Video
      </Button>
    </CardFooter>
  </Card>
);

// Loading skeletons
const RecipeCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-[180px] w-full" />
    <CardHeader className="p-3 pb-0">
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent className="p-3 pt-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5" />
    </CardContent>
    <CardFooter className="p-3 pt-0">
      <Skeleton className="h-9 w-full" />
    </CardFooter>
  </Card>
);

const VideoCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-[200px] w-full" />
    <CardHeader className="p-4 pb-2">
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5" />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Skeleton className="h-9 w-full" />
    </CardFooter>
  </Card>
);