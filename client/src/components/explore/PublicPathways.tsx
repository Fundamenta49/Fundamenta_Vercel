import React, { useState, useEffect } from 'react';
import { useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Filter, ChevronDown, Star, Clock, BookOpen, Users, CheckCircle2, Tag, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useJungleTheme } from "@/jungle-path/contexts/JungleThemeContext";

// Interface for public pathway data
interface PublicPathway {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrollmentCount: number;
  completionRate: number;
  estimatedHours: number;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  modules: {
    id: string;
    title: string;
  }[];
}

const MAX_DESCRIPTION_LENGTH = 140;

const PathwayCard = ({ pathway, onSave }: { 
  pathway: PublicPathway;
  onSave: (pathwayId: string) => void;
}) => {
  const { isJungleTheme } = useJungleTheme();
  const [showDetails, setShowDetails] = useState(false);
  
  // Truncate description for card display
  const truncateDescription = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return isJungleTheme 
          ? "bg-[#94C973] hover:bg-[#7DAC5D] text-[#1A3831]"
          : "bg-green-100 text-green-800 hover:bg-green-200";
      case 'intermediate':
        return isJungleTheme 
          ? "bg-[#F3AB3A] hover:bg-[#D99A35] text-[#1A3831]"
          : "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case 'advanced':
        return isJungleTheme
          ? "bg-[#E05858] hover:bg-[#C84848] text-[#1A3831]"
          : "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return isJungleTheme
          ? "bg-[#94C973] hover:bg-[#7DAC5D] text-[#1A3831]"
          : "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };
  
  // Render stars for rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 half-filled" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <>
      <Card className={cn(
        "border overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col",
        isJungleTheme 
          ? "hover:border-[#94C973] bg-[#1A3831] border-[#3A5A4E] text-white" 
          : "hover:border-primary-300"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={cn(
              "font-medium",
              getDifficultyColor(pathway.difficulty)
            )}>
              {pathway.difficulty.charAt(0).toUpperCase() + pathway.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline" className={cn(
              "font-medium",
              isJungleTheme ? "border-[#3A5A4E] text-[#94C973]" : "text-gray-600"
            )}>
              {pathway.category}
            </Badge>
          </div>
          <CardTitle className={cn(
            "text-xl font-bold mt-2",
            isJungleTheme ? "text-[#E6B933]" : ""
          )}>
            {pathway.title}
          </CardTitle>
          <CardDescription className={isJungleTheme ? "text-[#94C973]" : ""}>
            {truncateDescription(pathway.description, MAX_DESCRIPTION_LENGTH)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2 mb-4">
            {pathway.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className={cn(
                  "inline-block px-2 py-1 text-xs rounded-full",
                  isJungleTheme 
                    ? "bg-[#0D1D18] text-[#94C973]" 
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {tag}
              </span>
            ))}
            {pathway.tags.length > 3 && (
              <span 
                className={cn(
                  "inline-block px-2 py-1 text-xs rounded-full",
                  isJungleTheme 
                    ? "bg-[#0D1D18] text-[#94C973]" 
                    : "bg-gray-100 text-gray-800"
                )}
              >
                +{pathway.tags.length - 3} more
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Users className={cn(
                "h-4 w-4",
                isJungleTheme ? "text-[#94C973]" : "text-gray-500"
              )} />
              <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>
                {pathway.enrollmentCount} enrolled
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className={cn(
                "h-4 w-4",
                isJungleTheme ? "text-[#94C973]" : "text-gray-500"
              )} />
              <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>
                {pathway.estimatedHours} hours
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className={cn(
                "h-4 w-4",
                isJungleTheme ? "text-[#94C973]" : "text-gray-500"
              )} />
              <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>
                {pathway.completionRate}% completion
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className={cn(
                "h-4 w-4",
                isJungleTheme ? "text-[#94C973]" : "text-gray-500"
              )} />
              <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>
                {formatDate(pathway.createdAt)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1">
              {renderRating(pathway.rating)}
            </div>
            <span className={cn(
              "text-sm",
              isJungleTheme ? "text-[#E6B933]" : "text-gray-700 font-medium"
            )}>
              {pathway.rating.toFixed(1)}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button 
            variant="secondary" 
            className={cn(
              "flex-1",
              isJungleTheme 
                ? "bg-[#0D1D18] hover:bg-[#162E26] text-[#94C973] border border-[#3A5A4E]" 
                : ""
            )}
            onClick={() => setShowDetails(true)}
          >
            View Details
          </Button>
          <Button 
            className={cn(
              "flex-1",
              isJungleTheme 
                ? "bg-[#94C973] hover:bg-[#7DAC5D] text-[#1A3831]" 
                : ""
            )}
            onClick={() => onSave(pathway.id)}
          >
            Save Pathway
          </Button>
        </CardFooter>
      </Card>
      
      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className={cn(
          "max-w-3xl overflow-y-auto max-h-[90vh]",
          isJungleTheme ? "bg-[#1A3831] border-[#3A5A4E] text-white" : ""
        )}>
          <DialogHeader>
            <DialogTitle className={isJungleTheme ? "text-[#E6B933]" : ""}>
              {pathway.title}
            </DialogTitle>
            <DialogDescription className={isJungleTheme ? "text-[#94C973]" : ""}>
              Explore this pathway's content and learning outcomes
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-wrap gap-2 my-2">
            <Badge className={getDifficultyColor(pathway.difficulty)}>
              {pathway.difficulty.charAt(0).toUpperCase() + pathway.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline" className={cn(
              isJungleTheme ? "border-[#3A5A4E] text-[#94C973]" : ""
            )}>
              {pathway.category}
            </Badge>
          </div>
          
          <div className={isJungleTheme ? "text-white" : ""}>
            <p className="mb-4">{pathway.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card className={cn(
                "border",
                isJungleTheme ? "bg-[#162E26] border-[#3A5A4E]" : ""
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className={cn(
                    "text-lg",
                    isJungleTheme ? "text-[#E6B933]" : ""
                  )}>
                    Pathway Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>Enrolled Users:</span>
                    <span className={isJungleTheme ? "text-white font-medium" : "font-medium"}>
                      {pathway.enrollmentCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>Completion Rate:</span>
                    <span className={isJungleTheme ? "text-white font-medium" : "font-medium"}>
                      {pathway.completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>Estimated Time:</span>
                    <span className={isJungleTheme ? "text-white font-medium" : "font-medium"}>
                      {pathway.estimatedHours} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>Created:</span>
                    <span className={isJungleTheme ? "text-white font-medium" : "font-medium"}>
                      {formatDate(pathway.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={cn(
                "border",
                isJungleTheme ? "bg-[#162E26] border-[#3A5A4E]" : ""
              )}>
                <CardHeader className="pb-2">
                  <CardTitle className={cn(
                    "text-lg",
                    isJungleTheme ? "text-[#E6B933]" : ""
                  )}>
                    Created By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold",
                      isJungleTheme ? "bg-[#94C973] text-[#1A3831]" : "bg-primary-100 text-primary-800"
                    )}>
                      {pathway.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className={isJungleTheme ? "text-white font-medium" : "font-medium"}>
                        {pathway.author.name}
                      </div>
                      <div className={isJungleTheme ? "text-[#94C973] text-sm" : "text-gray-600 text-sm"}>
                        {pathway.author.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-4">
              <h3 className={cn(
                "text-lg font-medium mb-2",
                isJungleTheme ? "text-[#E6B933]" : ""
              )}>
                Modules
              </h3>
              <ul className={cn(
                "border rounded-md divide-y",
                isJungleTheme ? "border-[#3A5A4E] divide-[#3A5A4E]" : "border-gray-200 divide-gray-200"
              )}>
                {pathway.modules.map((module, index) => (
                  <li key={module.id} className={cn(
                    "p-3 flex items-center",
                    isJungleTheme ? "text-white" : ""
                  )}>
                    <span className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3",
                      isJungleTheme 
                        ? "bg-[#0D1D18] text-[#94C973]" 
                        : "bg-gray-100 text-gray-700"
                    )}>
                      {index + 1}
                    </span>
                    {module.title}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className={cn(
                "text-lg font-medium mb-2",
                isJungleTheme ? "text-[#E6B933]" : ""
              )}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {pathway.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className={cn(
                    isJungleTheme ? "border-[#3A5A4E] text-[#94C973]" : ""
                  )}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              className={cn(
                isJungleTheme 
                  ? "bg-[#94C973] hover:bg-[#7DAC5D] text-[#1A3831]" 
                  : ""
              )}
              onClick={() => {
                onSave(pathway.id);
                setShowDetails(false);
              }}
            >
              Save to My Pathways
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function PublicPathways() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'date' | 'popularity'>('rating');
  const { isJungleTheme } = useJungleTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();
  
  // Fetch public pathways
  const { data: pathways = [], isLoading, error } = useQuery({
    queryKey: ['/api/pathways/public'],
    select: (data) => {
      return data || [];
    }
  });
  
  // Get unique categories for filter
  const categories = [
    'all',
    ...Array.from(new Set(pathways.map((pathway: PublicPathway) => pathway.category)))
  ];
  
  // Filter pathways based on selected filters
  const filteredPathways = pathways.filter((pathway: PublicPathway) => {
    const matchesCategory = selectedCategory === 'all' || pathway.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || pathway.difficulty === selectedDifficulty;
    const matchesSearch = searchTerm === '' || 
      pathway.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pathway.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pathway.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });
  
  // Sort pathways based on selected sort option
  const sortedPathways = [...filteredPathways].sort((a: PublicPathway, b: PublicPathway) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popularity':
        return b.enrollmentCount - a.enrollmentCount;
      default:
        return b.rating - a.rating;
    }
  });
  
  // Handle saving a pathway to user's collection
  const handleSavePathway = async (pathwayId: string) => {
    try {
      await apiRequest({
        url: '/api/pathways/save',
        method: 'POST',
        data: { pathwayId }
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/mypath/pathways'] });
      
      toast({
        title: isJungleTheme 
          ? "Expedition Added! 🌴" 
          : "Pathway Saved!",
        description: isJungleTheme 
          ? "This expedition has been added to your jungle journey." 
          : "This pathway has been added to your collection.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to save pathway",
        description: "There was an error adding this pathway to your collection.",
        variant: "destructive",
      });
    }
  };
  
  if (error) {
    toast({
      title: "Failed to load public pathways",
      description: "There was an error fetching the public pathways. Please try again later.",
      variant: "destructive",
    });
  }
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-8">
        <h1 className={cn(
          "text-3xl font-bold mb-2",
          isJungleTheme ? "text-[#E6B933]" : ""
        )}>
          {isJungleTheme ? "Public Expeditions" : "Public Pathways"}
        </h1>
        <p className={cn(
          "max-w-2xl",
          isJungleTheme ? "text-[#94C973]" : "text-gray-600"
        )}>
          {isJungleTheme 
            ? "Discover community-created learning expeditions. Find exciting knowledge trails and add them to your jungle journey."
            : "Discover learning pathways created by educators and community members. Browse by category or search for specific topics."}
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className={cn(
        "mb-6 p-4 rounded-lg border",
        isJungleTheme ? "bg-[#162E26] border-[#3A5A4E]" : "bg-gray-50 border-gray-200"
      )}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className={cn(
              "relative rounded-md",
              isJungleTheme ? "bg-[#0D1D18]" : "bg-white"
            )}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={cn(
                  "h-5 w-5",
                  isJungleTheme ? "text-[#3A5A4E]" : "text-gray-400"
                )} />
              </div>
              <input
                type="text"
                placeholder="Search pathways..."
                className={cn(
                  "block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2",
                  isJungleTheme 
                    ? "bg-[#0D1D18] border-[#3A5A4E] text-white placeholder-[#3A5A4E] focus:ring-[#94C973]" 
                    : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-2",
                    isJungleTheme ? "bg-[#0D1D18] border-[#3A5A4E] text-white" : ""
                  )}
                >
                  <Filter className="h-4 w-4" />
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={isJungleTheme ? "bg-[#162E26] border-[#3A5A4E] text-white" : ""}>
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    className={cn(
                      selectedCategory === category && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                      isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Difficulty Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-2",
                    isJungleTheme ? "bg-[#0D1D18] border-[#3A5A4E] text-white" : ""
                  )}
                >
                  <Tag className="h-4 w-4" />
                  {selectedDifficulty === 'all' ? 'All Levels' : selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={isJungleTheme ? "bg-[#162E26] border-[#3A5A4E] text-white" : ""}>
                <DropdownMenuItem 
                  className={cn(
                    selectedDifficulty === 'all' && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                    isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                  )}
                  onClick={() => setSelectedDifficulty('all')}
                >
                  All Levels
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    selectedDifficulty === 'beginner' && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                    isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                  )}
                  onClick={() => setSelectedDifficulty('beginner')}
                >
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    selectedDifficulty === 'intermediate' && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                    isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                  )}
                  onClick={() => setSelectedDifficulty('intermediate')}
                >
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    selectedDifficulty === 'advanced' && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                    isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                  )}
                  onClick={() => setSelectedDifficulty('advanced')}
                >
                  Advanced
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sort Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-2",
                    isJungleTheme ? "bg-[#0D1D18] border-[#3A5A4E] text-white" : ""
                  )}
                >
                  Sort: {sortBy === 'rating' ? 'Top Rated' : sortBy === 'date' ? 'Newest' : 'Most Popular'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={isJungleTheme ? "bg-[#162E26] border-[#3A5A4E] text-white" : ""}>
                <DropdownMenuItem 
                  className={cn(
                    sortBy === 'rating' && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                    isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                  )}
                  onClick={() => setSortBy('rating')}
                >
                  Top Rated
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    sortBy === 'date' && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                    isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                  )}
                  onClick={() => setSortBy('date')}
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    sortBy === 'popularity' && (isJungleTheme ? "bg-[#0D1D18] text-[#94C973]" : "bg-gray-100"),
                    isJungleTheme ? "focus:bg-[#0D1D18] focus:text-[#94C973]" : ""
                  )}
                  onClick={() => setSortBy('popularity')}
                >
                  Most Popular
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Results Status */}
      <div className="mb-4 flex justify-between items-center">
        <div className={isJungleTheme ? "text-[#94C973]" : "text-gray-600"}>
          {isLoading 
            ? "Loading pathways..." 
            : `Showing ${sortedPathways.length} ${sortedPathways.length === 1 ? 'pathway' : 'pathways'}`}
        </div>
        
        <Link href="/mypath">
          <Button 
            variant="outline" 
            className={cn(
              isJungleTheme 
                ? "bg-transparent border-[#94C973] text-[#94C973] hover:bg-[#1A3831] hover:text-[#E6B933]" 
                : ""
            )}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            My Pathways
          </Button>
        </Link>
      </div>
      
      {/* Pathway Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className={cn(
              "h-[380px]",
              isJungleTheme ? "bg-[#1A3831] border-[#3A5A4E]" : ""
            )} />
          ))}
        </div>
      ) : sortedPathways.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPathways.map((pathway: PublicPathway) => (
            <PathwayCard 
              key={pathway.id} 
              pathway={pathway} 
              onSave={handleSavePathway} 
            />
          ))}
        </div>
      ) : (
        <Alert className={cn(
          "my-8",
          isJungleTheme ? "bg-[#162E26] border-[#3A5A4E] text-white" : ""
        )}>
          <BookOpen className={cn(
            "h-4 w-4",
            isJungleTheme ? "text-[#94C973]" : ""
          )} />
          <AlertTitle className={isJungleTheme ? "text-[#E6B933]" : ""}>No pathways found</AlertTitle>
          <AlertDescription className={isJungleTheme ? "text-[#94C973]" : ""}>
            {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
              ? "Try adjusting your filters or search terms to find more pathways."
              : "There are currently no public pathways available. Check back later."}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Back to Jungle Hub button for jungle theme */}
      {isJungleTheme && (
        <div className="mt-8 text-center">
          <Link href="/mypath/jungle-hub">
            <Button 
              variant="outline" 
              className="bg-transparent border-[#94C973] text-[#94C973] hover:bg-[#1A3831] hover:text-[#E6B933]"
            >
              <Palmtree className="mr-2 h-4 w-4" />
              Return to Jungle Hub
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}