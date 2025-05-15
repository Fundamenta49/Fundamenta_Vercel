import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';
import axios from 'axios';

// Define pathway type with jungle-specific terminology
interface PathwayData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: ModuleData[];
  progress: number;
  isPublic: boolean;
  lastUpdated: string;
  createdBy: string;
  totalPoints: number;
  tags: string[];
}

// Define module type
interface ModuleData {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  exercises: number;
  points: number;
  timeEstimate: string;
}

// Util function to convert className depending on theme
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * JungleHub Component - The jungle-themed pathway exploration component
 */
const JungleHub: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isJungleTheme } = useJungleTheme();
  const [activeTab, setActiveTab] = useState('expeditions');
  const [filter, setFilter] = useState('all');
  
  // Fetch user pathways
  const { data: pathways, isLoading, error } = useQuery({
    queryKey: ['/api/mypath/pathways'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/mypath/pathways');
        return response.data.pathways || [];
      } catch (err) {
        console.error('Error fetching pathways:', err);
        // Return mock data if API fails
        return mockPathways;
      }
    }
  });
  
  // Map regular terminology to jungle terminology for UI display
  const jungleTerms = {
    pathway: 'expedition',
    module: 'quest',
    complete: 'conquered',
    progress: 'journey',
    start: 'embark',
    continue: 'proceed',
    review: 'revisit',
    category: 'terrain',
  };
  
  // Filter pathways based on selected filter
  const filteredPathways = React.useMemo(() => {
    if (!pathways) return [];
    
    // If filter is 'all', return all pathways
    if (filter === 'all') return pathways;
    
    // Filter by difficulty or category
    return pathways.filter((pathway: PathwayData) => {
      if (['beginner', 'intermediate', 'advanced'].includes(filter)) {
        return pathway.difficulty === filter;
      }
      return pathway.category === filter;
    });
  }, [pathways, filter]);
  
  // Get unique categories for filter menu
  const categories = React.useMemo(() => {
    if (!pathways) return [];
    
    const uniqueCategories = new Set<string>();
    pathways.forEach((pathway: PathwayData) => {
      uniqueCategories.add(pathway.category);
    });
    
    return Array.from(uniqueCategories);
  }, [pathways]);
  
  const getProgressColorClass = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getCategoryBadgeClass = (category: string) => {
    // Simple hash function to deterministically assign colors
    const hash = category.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colors = [
      'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'bg-pink-100 text-pink-800 hover:bg-pink-200',
      'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
      'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  // Select a pathway to navigate to
  const handleSelectPathway = (pathwayId: string) => {
    navigate(`/mypath/pathway/${pathwayId}`);
    toast({
      title: 'Expedition Selected',
      description: 'Embarking on your learning adventure!',
    });
  };
  
  // If the jungle theme is not active, display warning
  if (!isJungleTheme) {
    return (
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle>Theme Error</CardTitle>
          <CardDescription>The jungle theme is not active. Please enable it in settings.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate('/settings')}>
            Go to Settings
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container p-4">
        <h2 className="text-2xl font-bold mb-4">Loading Expeditions...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle>Jungle Connection Lost</CardTitle>
          <CardDescription>We encountered a problem loading your expeditions. The jungle paths seem obscured.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">
            Unable to connect to the expedition database. Please try again later.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.reload()}>
            Retry Expedition Connection
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="container p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Jungle Adventures</h2>
          <p className="text-muted-foreground">
            Navigate your learning {jungleTerms.expedition}s through the knowledge jungle
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-primary/10' : ''}
          >
            All Terrains
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilter('beginner')}
            className={filter === 'beginner' ? 'bg-primary/10' : ''}
          >
            Beginner Trails
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilter('intermediate')}
            className={filter === 'intermediate' ? 'bg-primary/10' : ''}
          >
            Explorer Paths
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilter('advanced')}
            className={filter === 'advanced' ? 'bg-primary/10' : ''}
          >
            Adventurer Routes
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="expeditions" className="mb-8">
        <TabsList>
          <TabsTrigger value="expeditions" onClick={() => setActiveTab('expeditions')}>
            My Expeditions
          </TabsTrigger>
          <TabsTrigger value="discover" onClick={() => setActiveTab('discover')}>
            Discovery Map
          </TabsTrigger>
          <TabsTrigger value="achievements" onClick={() => setActiveTab('achievements')}>
            Jungle Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="expeditions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPathways.length > 0 ? (
              filteredPathways.map((pathway: PathwayData) => (
                <Card 
                  key={pathway.id} 
                  className={cn(
                    "hover:shadow-lg transition-shadow duration-300",
                    pathway.progress === 100 ? "border-green-500 border-2" : ""
                  )}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pathway.title}</CardTitle>
                        <CardDescription className="mt-1">{pathway.description}</CardDescription>
                      </div>
                      <Badge className={getDifficultyBadgeClass(pathway.difficulty)}>
                        {pathway.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Expedition Progress</span>
                          <span className="text-sm font-medium">{pathway.progress}%</span>
                        </div>
                        <Progress value={pathway.progress} className={getProgressColorClass(pathway.progress)} />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryBadgeClass(pathway.category)}>
                          {pathway.category}
                        </Badge>
                        {pathway.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                        {pathway.tags.length > 2 && (
                          <Badge variant="outline">+{pathway.tags.length - 2}</Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">{pathway.modules.length}</span> Quests • 
                          <span className="font-medium ml-1">{pathway.totalPoints}</span> Jungle Points
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleSelectPathway(pathway.id)}
                    >
                      {pathway.progress > 0 && pathway.progress < 100 
                        ? "Continue Expedition" 
                        : pathway.progress === 100 
                          ? "Revisit Expedition" 
                          : "Start Expedition"}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center p-12">
                <h3 className="text-xl font-semibold mb-2">No Expeditions Found</h3>
                <p className="text-muted-foreground mb-6">
                  No jungle paths match your current terrain filter. Try changing your filter or discover new expeditions.
                </p>
                <Button onClick={() => setFilter('all')}>
                  View All Expeditions
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="discover" className="mt-6">
          <div className="text-center p-12 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Expedition Discovery</h3>
            <p className="text-muted-foreground mb-6">
              Explore the vast jungle of knowledge with new learning expeditions.
            </p>
            <Button onClick={() => navigate('/explore/pathways')}>
              Explore New Territories
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-6">
          <div className="text-center p-12 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Jungle Achievements</h3>
            <p className="text-muted-foreground mb-6">
              Track your conquests and rewards earned throughout your learning journey.
            </p>
            <Button variant="outline" onClick={() => navigate('/mypath/achievements')}>
              View Your Achievements
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Jungle-themed styling */}
      <style jsx global>
        {`
          .jungle-theme {
            --jungle-primary: #2c7b4e;
            --jungle-secondary: #a8d672;
            --jungle-accent: #f9d86c;
            --jungle-dark: #1a4e33;
            --jungle-light: #e6f5ea;
          }
          
          body {
            background-color: var(--jungle-light);
          }
          
          .card {
            border-color: var(--jungle-primary);
            box-shadow: 0 4px 6px rgba(44, 123, 78, 0.1);
          }
          
          .card:hover {
            box-shadow: 0 8px 15px rgba(44, 123, 78, 0.2);
          }
          
          .tabs-trigger[data-state="active"] {
            background-color: var(--jungle-primary);
            color: white;
          }
          
          .button-primary {
            background-color: var(--jungle-primary);
            color: white;
          }
          
          .button-primary:hover {
            background-color: var(--jungle-dark);
          }
        `}
      </style>
    </div>
  );
};

// Mock data for testing and fallbacks
const mockPathways: PathwayData[] = [
  {
    id: 'p1',
    title: 'Jungle Survival Basics',
    description: 'Master fundamental techniques for thriving in challenging environments',
    category: 'Life Skills',
    difficulty: 'beginner',
    modules: [
      {
        id: 'm1',
        title: 'Finding Water Sources',
        description: 'Learn to identify and access safe water in the wilderness',
        status: 'completed',
        exercises: 5,
        points: 100,
        timeEstimate: '45 min'
      },
      {
        id: 'm2',
        title: 'Building Emergency Shelter',
        description: 'Techniques for creating protective structures with minimal materials',
        status: 'in-progress',
        exercises: 4,
        points: 120,
        timeEstimate: '60 min'
      },
      {
        id: 'm3',
        title: 'Navigating Without Tools',
        description: 'Natural navigation using stars, sun, and environmental cues',
        status: 'locked',
        exercises: 6,
        points: 150,
        timeEstimate: '75 min'
      }
    ],
    progress: 45,
    isPublic: true,
    lastUpdated: '2023-12-15',
    createdBy: 'Ranger Mike',
    totalPoints: 370,
    tags: ['survival', 'basics', 'essential-skills']
  },
  {
    id: 'p2',
    title: 'Financial Wilderness Navigation',
    description: 'Chart your course through the complex terrain of personal finance',
    category: 'Finance',
    difficulty: 'intermediate',
    modules: [
      {
        id: 'm1',
        title: 'Budgeting Expedition',
        description: 'Create a map for your financial journey',
        status: 'completed',
        exercises: 4,
        points: 130,
        timeEstimate: '55 min'
      },
      {
        id: 'm2',
        title: 'Investment Jungle',
        description: 'Navigate the wild territory of stocks, bonds and funds',
        status: 'completed',
        exercises: 6,
        points: 180,
        timeEstimate: '90 min'
      },
      {
        id: 'm3',
        title: 'Debt Quicksand Escape',
        description: 'Techniques to free yourself from financial traps',
        status: 'in-progress',
        exercises: 5,
        points: 150,
        timeEstimate: '70 min'
      }
    ],
    progress: 75,
    isPublic: true,
    lastUpdated: '2023-12-10',
    createdBy: 'Financial Explorer',
    totalPoints: 460,
    tags: ['finance', 'money-management', 'investing']
  },
  {
    id: 'p3',
    title: 'Communication Canopy',
    description: 'Master the art of clear communication across diverse environments',
    category: 'Communication',
    difficulty: 'advanced',
    modules: [
      {
        id: 'm1',
        title: 'Conflict Resolution Ritual',
        description: 'Ancient techniques for peaceful disagreement resolution',
        status: 'completed',
        exercises: 7,
        points: 200,
        timeEstimate: '100 min'
      },
      {
        id: 'm2',
        title: 'Empathetic Listening Expedition',
        description: 'Develop deep understanding through active listening techniques',
        status: 'completed',
        exercises: 5,
        points: 170,
        timeEstimate: '85 min'
      },
      {
        id: 'm3',
        title: 'Nonverbal Signal Mastery',
        description: 'Read and project body language like a seasoned tracker',
        status: 'completed',
        exercises: 6,
        points: 190,
        timeEstimate: '95 min'
      }
    ],
    progress: 100,
    isPublic: true,
    lastUpdated: '2023-11-28',
    createdBy: 'Communication Chief',
    totalPoints: 560,
    tags: ['communication', 'social-skills', 'conflict-resolution']
  }
];

export default JungleHub;