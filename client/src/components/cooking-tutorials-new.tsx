import React, { useState } from 'react';
import { Search, ChefHat, ArrowRight, Flame, Scissors, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EmbeddedYoutubePlayer from '@/components/embedded-youtube-player';

export default function CookingTutorialsNew() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<TutorialVideo | null>(null);

  interface TutorialVideo {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    youtubeId: string;
    icon?: React.ReactNode;
    skills: string[];
  }

  const tutorialVideos: TutorialVideo[] = [
    {
      id: '1',
      title: 'Basic Knife Skills',
      description: 'Learn the fundamentals of knife handling, chopping, and dicing techniques.',
      category: 'knife-skills',
      difficulty: 'Beginner',
      duration: '15:30',
      youtubeId: 'G-Fg7l7G1zw',
      icon: <Scissors className="h-5 w-5 text-blue-500" />,
      skills: ['Chopping', 'Dicing', 'Knife Safety']
    },
    {
      id: '2',
      title: 'Cooking Perfect Rice',
      description: 'Master the art of cooking fluffy, perfect rice every time.',
      category: 'cooking-basics',
      difficulty: 'Beginner',
      duration: '8:45',
      youtubeId: 'JOOSIp7ggdE',
      icon: <ChefHat className="h-5 w-5 text-green-500" />,
      skills: ['Rice Cooking', 'Water Ratio', 'Basic Cooking']
    },
    {
      id: '3',
      title: 'Heat Management Techniques',
      description: 'Understand the different heat levels and when to use them.',
      category: 'cooking-methods',
      difficulty: 'Intermediate',
      duration: '18:20',
      youtubeId: 'rXDvfDKaHCE',
      icon: <Flame className="h-5 w-5 text-red-500" />,
      skills: ['Heat Control', 'Pan Temperature', 'Cooking Methods']
    },
    {
      id: '4',
      title: 'Quick Meal Preparation',
      description: 'Learn time-saving techniques for efficient meal preparation.',
      category: 'meal-prep',
      difficulty: 'Beginner',
      duration: '12:10',
      youtubeId: 'vJEClc2JFNs',
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      skills: ['Meal Prep', 'Time Management', 'Efficiency']
    }
  ];

  const filteredVideos = tutorialVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleVideoSelect = (video: TutorialVideo) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="space-y-6">
      {selectedVideo ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedVideo(null)}
            >
              Back to Tutorials
            </Button>
          </div>
          
          <div className="aspect-video w-full rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-900">
            <EmbeddedYoutubePlayer videoId={selectedVideo.youtubeId} title={selectedVideo.title} />
          </div>
          
          <div className="flex flex-wrap gap-2 my-3">
            <Badge className={difficultyColors[selectedVideo.difficulty]}>
              {selectedVideo.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {selectedVideo.duration}
            </Badge>
            {selectedVideo.skills.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">{selectedVideo.description}</p>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-6">
            <h3 className="font-semibold mb-2">Related Skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedVideo.skills.map(skill => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search-tutorials" className="text-sm font-medium mb-1 block">
                Search Tutorials
              </label>
              <Input
                id="search-tutorials"
                placeholder="Search for techniques, skills, or recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Tutorials</TabsTrigger>
              <TabsTrigger value="knife-skills">Knife Skills</TabsTrigger>
              <TabsTrigger value="cooking-basics">Cooking Basics</TabsTrigger>
              <TabsTrigger value="cooking-methods">Cooking Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVideos.map(video => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2">
                          {video.icon}
                          {video.title}
                        </CardTitle>
                        <Badge className={difficultyColors[video.difficulty]}>
                          {video.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{video.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleVideoSelect(video)}
                      >
                        Watch Tutorial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredVideos.length === 0 && (
                <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <ChefHat className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tutorials found</h3>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your search terms or browsing all tutorials.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="knife-skills">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVideos.filter(v => v.category === 'knife-skills').map(video => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2">
                          {video.icon}
                          {video.title}
                        </CardTitle>
                        <Badge className={difficultyColors[video.difficulty]}>
                          {video.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{video.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleVideoSelect(video)}
                      >
                        Watch Tutorial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cooking-basics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVideos.filter(v => v.category === 'cooking-basics').map(video => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2">
                          {video.icon}
                          {video.title}
                        </CardTitle>
                        <Badge className={difficultyColors[video.difficulty]}>
                          {video.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{video.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleVideoSelect(video)}
                      >
                        Watch Tutorial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cooking-methods">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVideos.filter(v => v.category === 'cooking-methods').map(video => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2">
                          {video.icon}
                          {video.title}
                        </CardTitle>
                        <Badge className={difficultyColors[video.difficulty]}>
                          {video.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{video.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {video.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleVideoSelect(video)}
                      >
                        Watch Tutorial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}