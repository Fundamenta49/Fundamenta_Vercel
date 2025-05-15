import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

// Define pathway type for public discovery
interface PublicPathwayData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  moduleCount: number;
  totalPoints: number;
  tags: string[];
  createdBy: string;
  lastUpdated: string;
  enrollments: number;
  averageRating: number;
  completionRate: number;
}

/**
 * PublicPathwaysExplore - Component for discovering and exploring
 * public learning pathways shared by the Fundamenta community
 */
const PublicPathwaysExplore: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  
  // Fetch public pathways
  const { data: pathways, isLoading, error } = useQuery({
    queryKey: ['/api/explore/pathways'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/explore/pathways');
        return response.data.pathways || [];
      } catch (err) {
        console.error('Error fetching public pathways:', err);
        // Return mock data if API fails
        return mockPublicPathways;
      }
    }
  });
  
  // Get unique categories for filter menu
  const categories = React.useMemo(() => {
    if (!pathways) return [];
    
    const uniqueCategories = new Set<string>();
    pathways.forEach((pathway: PublicPathwayData) => {
      uniqueCategories.add(pathway.category);
    });
    
    return Array.from(uniqueCategories);
  }, [pathways]);
  
  // Filter and sort pathways
  const filteredPathways = React.useMemo(() => {
    if (!pathways) return [];
    
    // First, apply search filter
    let filtered = pathways.filter((pathway: PublicPathwayData) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          pathway.title.toLowerCase().includes(searchLower) ||
          pathway.description.toLowerCase().includes(searchLower) ||
          pathway.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
    
    // Then, apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((pathway: PublicPathwayData) => 
        pathway.category === categoryFilter
      );
    }
    
    // Then, apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((pathway: PublicPathwayData) => 
        pathway.difficulty === difficultyFilter
      );
    }
    
    // Finally, sort the results
    return filtered.sort((a: PublicPathwayData, b: PublicPathwayData) => {
      switch (sortBy) {
        case 'popular':
          return b.enrollments - a.enrollments;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'completion':
          return b.completionRate - a.completionRate;
        default:
          return 0;
      }
    });
  }, [pathways, searchTerm, categoryFilter, difficultyFilter, sortBy]);
  
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
  
  // Format dates to relative time (e.g., "2 months ago")
  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };
  
  // Handle pathway enrollment
  const handleEnrollPathway = (pathwayId: string) => {
    // API call would go here
    toast({
      title: 'Pathway Added',
      description: 'This pathway has been added to your learning dashboard',
    });
    
    // Navigate to the pathway
    navigate(`/mypath/pathway/${pathwayId}`);
  };
  
  // Handle pathway preview
  const handlePreviewPathway = (pathwayId: string) => {
    navigate(`/explore/pathway/${pathwayId}`);
  };
  
  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Discover Pathways</h1>
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
      <div className="container px-4 py-8 mx-auto">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle>Connection Error</CardTitle>
            <CardDescription>We encountered a problem loading public pathways</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">
              Unable to connect to the pathway database. Please try again later.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Pathways</h1>
          <p className="text-muted-foreground mt-2">
            Explore learning pathways shared by the Fundamenta community
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/mypath')}
          className="mt-4 md:mt-0"
        >
          Back to My Pathways
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1">
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search pathways..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">
                Difficulty
              </label>
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-2">
                Sort By
              </label>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Most Popular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Recently Updated</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="completion">Highest Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Why Explore?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover community-curated pathways to expand your knowledge and skills. 
                  Each pathway offers a structured learning journey created by experts 
                  and enthusiasts in various fields.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="col-span-2">
          {filteredPathways.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPathways.map((pathway: PublicPathwayData) => (
                <Card key={pathway.id} className="h-full flex flex-col">
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
                  
                  <CardContent className="space-y-4 flex-grow">
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
                    
                    <div className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Modules:</span>
                        <span className="font-medium">{pathway.moduleCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Points:</span>
                        <span className="font-medium">{pathway.totalPoints}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Enrollments:</span>
                        <span className="font-medium">{pathway.enrollments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium">{pathway.averageRating.toFixed(1)} ★</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <div>Created by: {pathway.createdBy}</div>
                      <div>Updated: {formatRelativeDate(pathway.lastUpdated)}</div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handlePreviewPathway(pathway.id)}
                    >
                      Preview
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleEnrollPathway(pathway.id)}
                    >
                      Enroll
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardHeader>
                <CardTitle>No Pathways Found</CardTitle>
                <CardDescription>
                  No pathways match your current search criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Try adjusting your filters or search terms to find more pathways.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setDifficultyFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data for testing and fallbacks
const mockPublicPathways: PublicPathwayData[] = [
  {
    id: 'pub1',
    title: 'Financial Literacy Fundamentals',
    description: 'A beginner-friendly introduction to personal finance and budgeting',
    category: 'Finance',
    difficulty: 'beginner',
    moduleCount: 8,
    totalPoints: 650,
    tags: ['budgeting', 'saving', 'financial-planning'],
    createdBy: 'Finance Team',
    lastUpdated: '2023-12-01',
    enrollments: 3478,
    averageRating: 4.7,
    completionRate: 83
  },
  {
    id: 'pub2',
    title: 'Effective Communication Skills',
    description: 'Enhance your verbal and written communication for personal and professional growth',
    category: 'Communication',
    difficulty: 'intermediate',
    moduleCount: 6,
    totalPoints: 520,
    tags: ['public-speaking', 'writing', 'listening'],
    createdBy: 'Communication Coach',
    lastUpdated: '2023-12-15',
    enrollments: 2145,
    averageRating: 4.8,
    completionRate: 76
  },
  {
    id: 'pub3',
    title: 'Healthy Cooking Essentials',
    description: 'Learn to prepare nutritious and delicious meals on a budget',
    category: 'Nutrition',
    difficulty: 'beginner',
    moduleCount: 10,
    totalPoints: 780,
    tags: ['cooking', 'meal-planning', 'healthy-eating'],
    createdBy: 'Nutrition Expert',
    lastUpdated: '2023-11-20',
    enrollments: 4210,
    averageRating: 4.6,
    completionRate: 88
  },
  {
    id: 'pub4',
    title: 'Advanced Time Management',
    description: 'Master strategies to optimize your productivity and efficiency',
    category: 'Productivity',
    difficulty: 'advanced',
    moduleCount: 5,
    totalPoints: 550,
    tags: ['productivity', 'organization', 'scheduling'],
    createdBy: 'Productivity Pro',
    lastUpdated: '2023-12-10',
    enrollments: 1865,
    averageRating: 4.9,
    completionRate: 65
  },
  {
    id: 'pub5',
    title: 'Mental Wellness Toolkit',
    description: 'Practical techniques for managing stress and improving mental health',
    category: 'Mental Health',
    difficulty: 'intermediate',
    moduleCount: 7,
    totalPoints: 600,
    tags: ['stress-management', 'mindfulness', 'self-care'],
    createdBy: 'Wellness Advocate',
    lastUpdated: '2023-12-05',
    enrollments: 3125,
    averageRating: 4.8,
    completionRate: 79
  },
  {
    id: 'pub6',
    title: 'Home Maintenance 101',
    description: 'Essential skills for maintaining your living space and basic repairs',
    category: 'Home Care',
    difficulty: 'beginner',
    moduleCount: 9,
    totalPoints: 700,
    tags: ['repairs', 'maintenance', 'cleaning'],
    createdBy: 'Home Expert',
    lastUpdated: '2023-11-25',
    enrollments: 2780,
    averageRating: 4.5,
    completionRate: 82
  }
];

export default PublicPathwaysExplore;