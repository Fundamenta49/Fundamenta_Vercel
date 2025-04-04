import React, { useState } from 'react';
import { 
  ChefHat, 
  ArrowLeft, 
  Search,
  PlayCircle,
  Info,
  AlertTriangle,
  Utensils,
  UtensilsCrossed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VideoPlayerDialog } from '@/components/video-player-dialog';
import { 
  TechniqueTutorials,
  KitchenSafetyTutorials,
  BasicRecipesTutorials,
  MealTutorials,
  CookingTutorial
} from '@/components/cooking-tutorials-content';
import { searchYouTubeVideos, CookingVideo } from '@/lib/cooking-videos-service';
import { useToast } from '@/hooks/use-toast';

const CookingTutorialPopup: React.FC = () => {
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [currentVideoDescription, setCurrentVideoDescription] = useState("");
  const [activeTab, setActiveTab] = useState("techniques");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CookingVideo[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const { toast } = useToast();

  const handlePlayVideo = (videoId: string, title: string, description?: string) => {
    setCurrentVideoId(videoId);
    setCurrentVideoTitle(title);
    setCurrentVideoDescription(description || "");
    setVideoDialogOpen(true);
  };

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
      const results = await searchYouTubeVideos(searchQuery, 'cooking');
      
      setSearchResults(results);
      setShowSearchResults(true);
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

  const playSearchResult = (video: CookingVideo) => {
    handlePlayVideo(
      video.youTubeId || video.id, 
      video.title, 
      video.description
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <div className="flex flex-col h-full pb-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-950 px-4 py-4 border-b mb-2 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <ChefHat className="h-5 w-5 mr-2 text-learning-color" />
            Cooking Tutorials
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Learn essential cooking skills with step-by-step videos
          </p>
        </div>
      </div>

      {/* Search Box - Fixed position below header */}
      <div className="px-4 py-2 mb-4 sticky top-[74px] z-10 bg-white border-b pb-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for cooking tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={isSearching}
            className="bg-learning-color hover:bg-learning-color/90"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      {/* Content area - takes remaining height without causing double scrollbars */}
      <div className="flex-1 px-4">
        {/* Search Results */}
        {showSearchResults && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Search Results</h3>
              <Button variant="ghost" size="sm" onClick={clearSearch}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Categories
              </Button>
            </div>
            
            {isSearching ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-learning-color"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow border border-t-4 border-t-learning-color group">
                    <div 
                      className="relative aspect-video cursor-pointer overflow-hidden bg-gray-100"
                      onClick={() => playSearchResult(video)}
                    >
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-white" />
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-semibold truncate group-hover:text-learning-color">
                        {video.title}
                      </CardTitle>
                      {video.description && (
                        <CardDescription className="line-clamp-2 text-sm text-gray-600">
                          {video.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 mt-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-center text-learning-color hover:text-white hover:bg-learning-color border-learning-color/30"
                        onClick={() => playSearchResult(video)}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Watch Video
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
          </div>
        )}

        {/* Main Tabs for Categories */}
        {!showSearchResults && (
          <Tabs defaultValue="techniques" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 bg-white z-10 pb-4">
              <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                <button 
                  onClick={() => setActiveTab('techniques')} 
                  className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap text-sm ${
                    activeTab === 'techniques' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  Techniques
                </button>
                <button 
                  onClick={() => setActiveTab('safety')} 
                  className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap text-sm ${
                    activeTab === 'safety' 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Safety
                </button>
                <button 
                  onClick={() => setActiveTab('recipes')} 
                  className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap text-sm ${
                    activeTab === 'recipes' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  Recipes
                </button>
                <button 
                  onClick={() => setActiveTab('meals')} 
                  className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap text-sm ${
                    activeTab === 'meals' 
                      ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Meals
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <TabsContent value="techniques" className="mt-0">
                <h2 className="text-lg font-bold mb-3 px-3 py-2 bg-blue-50 text-blue-800 rounded-md border-l-4 border-blue-500 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Essential Techniques
                </h2>
                <p className="mb-4 text-sm px-2 text-gray-600">
                  Master these fundamental techniques to build a strong foundation for all your cooking.
                </p>
                <TechniqueTutorials onPlayVideo={handlePlayVideo} />
              </TabsContent>
              
              <TabsContent value="safety" className="mt-0">
                <h2 className="text-lg font-bold mb-3 px-3 py-2 bg-yellow-50 text-yellow-800 rounded-md border-l-4 border-yellow-500 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Kitchen Safety
                </h2>
                <p className="mb-4 text-sm px-2 text-gray-600">
                  Proper technique and safety practices help prevent injury and foodborne illness. 
                  These fundamentals should be mastered before attempting complex recipes.
                </p>
                <KitchenSafetyTutorials onPlayVideo={handlePlayVideo} />
              </TabsContent>
              
              <TabsContent value="recipes" className="mt-0">
                <h2 className="text-lg font-bold mb-3 px-3 py-2 bg-green-50 text-green-800 rounded-md border-l-4 border-green-500 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-green-600" />
                  Basic Recipes
                </h2>
                <p className="mb-4 text-sm px-2 text-gray-600">
                  Simple, foundational recipes that every home cook should know. Perfect for beginners.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <BasicRecipesTutorials onPlayVideo={handlePlayVideo} />
                </div>
              </TabsContent>
              
              <TabsContent value="meals" className="mt-0">
                <h2 className="text-lg font-bold mb-3 px-3 py-2 bg-orange-50 text-orange-800 rounded-md border-l-4 border-orange-500 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-orange-600" />
                  Meal Tutorials
                </h2>
                <p className="mb-4 text-sm px-2 text-gray-600">
                  Learn how to prepare complete meals for breakfast, lunch, and dinner.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <MealTutorials onPlayVideo={handlePlayVideo} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>

      {/* Video Player Dialog */}
      <VideoPlayerDialog
        open={videoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        videoId={currentVideoId}
        title={currentVideoTitle}
        description={currentVideoDescription}
      />
    </div>
  );
};

export default CookingTutorialPopup;