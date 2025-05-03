import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Wallet,
  ChefHat,
  Home,
  Clock,
  MessageSquare,
  Loader2,
  User,
  ArrowRight,
  BellRing,
  BookOpen,
  Star,
  Zap,
  Lightbulb,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
// Import original components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Import standardized components
import { StandardCard, MobileScroller, SearchBar, TabNav, StandardBadge } from "@/components/ui-standard";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ShoppingBuddy from "@/components/shopping-buddy";
import { useFeatureFlags } from "@/contexts/feature-flags-context";

// Define user profile interface for personalization
interface UserProfile {
  name: string;
  age: number;
  interests: string[];
  goals: string[];
  strengths: string[];
  weaknesses: string[];
  learningStyle: "visual" | "auditory" | "reading" | "kinesthetic";
  completedModules: string[];
  progress: Record<string, number>;
}

// Define a smart prompt interface
interface SmartPrompt {
  id: string;
  title: string;
  description: string;
  type: "tip" | "reminder" | "challenge" | "alert";
  category: string;
  isNew: boolean;
  createdAt: Date;
}

type LifeSkillsTabId = "financial" | "cooking" | "home" | "time" | "communication" | "shopping";

// Interfaces
interface LifeSkillsComponentProps {
  initialTab?: string;
}

// Complete implementation of Life Skills component with horizontal tabs and search functionality
export const LifeSkillsComponent = ({ initialTab = "financial" }: LifeSkillsComponentProps) => {
  const [activeTab, setActiveTab] = useState<LifeSkillsTabId>(initialTab as LifeSkillsTabId);
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  
  // Access feature flags for conditional UI rendering
  const featureFlags = useFeatureFlags();
  
  // References for tutorial/walkthrough
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Mock user profile - in a real app, this would come from a database
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex",
    age: 22,
    interests: ["Technology", "Cooking", "Personal Finance"],
    goals: ["Save for emergency fund", "Learn to cook 5 basic meals", "Improve time management"],
    strengths: ["Technology skills", "Research abilities"],
    weaknesses: ["Procrastination", "Financial planning"],
    learningStyle: "visual",
    completedModules: ["Budgeting 101", "Basic Home Repairs"],
    progress: {
      financial: 35,
      cooking: 20,
      home: 45,
      time: 10,
      communication: 15
    }
  });

  // Mock smart prompts - these would be generated dynamically based on user behavior
  const [smartPrompts, setSmartPrompts] = useState<SmartPrompt[]>([
    {
      id: "1",
      title: "It's 11pm - Time for sleep?",
      description: "Studies show that consistent sleep schedules improve productivity. Consider setting a sleep alarm to maintain a healthy routine.",
      type: "tip",
      category: "wellness",
      isNew: true,
      createdAt: new Date()
    },
    {
      id: "2",
      title: "Weekend meal prep opportunity",
      description: "Weather forecast shows rain this weekend. Great time to learn meal prepping for the week!",
      type: "reminder",
      category: "cooking",
      isNew: true,
      createdAt: new Date()
    },
    {
      id: "3",
      title: "Emergency fund challenge",
      description: "Start building your emergency fund with the 50/30/20 rule. Let's set up a plan today!",
      type: "challenge",
      category: "financial",
      isNew: false,
      createdAt: new Date(Date.now() - 86400000)
    }
  ]);

  // Tab definitions
  const tabs: Array<{id: LifeSkillsTabId, label: string, icon: React.ComponentType<{className?: string}>}> = [
    { id: "financial", label: "Financial", icon: Wallet },
    { id: "cooking", label: "Cooking", icon: ChefHat },
    { id: "home", label: "Home Care", icon: Home },
    { id: "time", label: "Time Management", icon: Clock },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "shopping", label: "Shopping Buddy", icon: ShoppingBag }
  ];

  // Function to handle search
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // In a real app, this would call an actual API
      // Simulate a delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockGuidance = `Here's personalized guidance about "${searchQuery}" based on your interests in ${userProfile.interests.join(', ')} and your learning style:
      
      ${searchQuery.toLowerCase().includes('budget') ? 
        'For budgeting, I recommend using the 50/30/20 rule given your current financial goals. Since you learn best visually, I\'ve prepared a chart to help you track your expenses.' : 
        searchQuery.toLowerCase().includes('cook') ? 
        'Based on your interest in cooking and goal to learn 5 basic meals, I suggest starting with simple one-pot recipes that are hard to mess up. I\'ve curated video tutorials that match your visual learning style.' :
        'I\'ve found some resources tailored to your learning style and interests. Let\'s break this down into manageable steps based on your current skill level.'
      }`;
      
      setGuidance(mockGuidance);
    } catch (error) {
      console.error("Error searching:", error);
      setGuidance("Sorry, we couldn't process your search right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to dismiss a smart prompt
  const dismissPrompt = (id: string) => {
    setSmartPrompts(prev => prev.filter(prompt => prompt.id !== id));
    toast({
      title: "Prompt dismissed",
      description: "We'll show you different prompts next time.",
    });
  };

  // Function to take action on a smart prompt
  const actionPrompt = (prompt: SmartPrompt) => {
    // In a real app, this would log the interaction and potentially navigate to relevant content
    toast({
      title: "Taking action",
      description: `Starting activity: ${prompt.title}`,
    });
    
    // If it's a financial challenge, navigate to financial tab
    if (prompt.category === "financial") {
      setActiveTab("financial");
    } else if (prompt.category === "cooking") {
      setActiveTab("cooking");
    }
    
    // Mark prompt as seen
    setSmartPrompts(prev => 
      prev.map(p => p.id === prompt.id ? {...p, isNew: false} : p)
    );
  };

  // Submit personal info in onboarding
  const submitPersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOnboarding(false);
    toast({
      title: "Profile updated",
      description: "Your learning experience is now personalized.",
    });
  };
  
  // Simulate receiving a new smart prompt based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    
    // Only run this effect once after component mounts
    const timeoutId = setTimeout(() => {
      if (hour >= 22 || hour <= 5) {
        // Late night prompt
        const lateNightPrompt: SmartPrompt = {
          id: "time-" + Date.now(),
          title: "Late night study session?",
          description: "I notice you're up late. Studies show taking breaks every 45 minutes improves retention. Would you like me to set a reminder?",
          type: "tip",
          category: "time",
          isNew: true,
          createdAt: new Date()
        };
        
        setSmartPrompts(prev => [lateNightPrompt, ...prev]);
      } else if (hour >= 11 && hour <= 14) {
        // Lunch time prompt
        const lunchPrompt: SmartPrompt = {
          id: "meal-" + Date.now(),
          title: "Lunch break meal idea",
          description: "Looking for a quick, healthy lunch? I've got a 15-minute recipe that matches your skill level.",
          type: "tip",
          category: "cooking",
          isNew: true,
          createdAt: new Date()
        };
        
        setSmartPrompts(prev => [lunchPrompt, ...prev]);
      }
    }, 5000); // Show after 5 seconds
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Calculate overall progress
  const calculateOverallProgress = (): number => {
    const categories = Object.keys(userProfile.progress);
    if (categories.length === 0) return 0;
    
    const total = categories.reduce((sum, category) => sum + userProfile.progress[category], 0);
    return Math.round(total / categories.length);
  };

  // Conditional rendering helper for skill progress cards
  const renderProgressCard = (skill: string, progress: number) => {
    if (featureFlags.USE_STANDARD_CARDS) {
      return (
        <StandardCard 
          key={skill} 
          title={<span className="capitalize">{skill}</span>}
          sectionTheme="financial"
          showGradient={false}
          elevation="sm"
          contentClassName="p-3"
        >
          <Progress value={progress} className="h-1.5 mt-1" />
          <p className="text-xs text-right mt-1">{progress}%</p>
        </StandardCard>
      );
    }
    
    return (
      <Card key={skill} className="bg-slate-50 border hover:shadow-md transition-shadow">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-sm capitalize">{skill}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <Progress value={progress} className="h-1.5 mt-1" />
          <p className="text-xs text-right mt-1">{progress}%</p>
        </CardContent>
      </Card>
    );
  };

  // Conditional rendering helper for goals card
  const renderGoalsCard = () => {
    const goalsContent = (
      <ul className="space-y-2">
        {userProfile.goals.map((goal, index) => (
          <li key={index} className="flex items-start">
            <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
            <span className="text-sm">{goal}</span>
          </li>
        ))}
      </ul>
    );
    
    const goalsFooter = (
      <Button variant="ghost" size="sm" className="w-full text-blue-600">
        Update Goals
      </Button>
    );
    
    if (featureFlags.USE_STANDARD_CARDS) {
      return (
        <StandardCard
          title={
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              <span className="text-lg font-semibold">Goals</span>
            </div>
          }
          className="w-full md:w-96"
          sectionTheme="financial"
          footer={goalsFooter}
        >
          {goalsContent}
        </StandardCard>
      );
    }
    
    return (
      <Card className="w-full md:w-96 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          {goalsContent}
        </CardContent>
        <CardFooter>
          {goalsFooter}
        </CardFooter>
      </Card>
    );
  };

  // Dashboard component
  const DashboardContent = () => (
    <div className="space-y-8 pt-2" ref={dashboardRef}>
      {/* Personalized greeting and progress */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {userProfile.name}!</h2>
          <p className="text-muted-foreground mb-4">
            You're making good progress on your life skills journey.
          </p>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{calculateOverallProgress()}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-2" />
          </div>
          
          {featureFlags.USE_STANDARD_MOBILE_SCROLL ? (
            <MobileScroller 
              columns={{ sm: 2, md: 3, lg: 3 }} 
              gap="sm" 
              mobileMinWidth={160} 
              className="mb-4"
            >
              {Object.entries(userProfile.progress).map(([skill, progress]) => 
                renderProgressCard(skill, progress)
              )}
            </MobileScroller>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {Object.entries(userProfile.progress).map(([skill, progress]) => 
                renderProgressCard(skill, progress)
              )}
            </div>
          )}
        </div>
        
        {renderGoalsCard()}
      </div>
      
      {/* Smart prompts section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-amber-500" />
          Smart Prompts
          {/* Always use StandardBadge for consistent styling */}
          <StandardBadge 
            size="sm" 
            className="ml-2" 
            sectionTheme="learning"
            pill={true}
          >
            {smartPrompts.filter(p => p.isNew).length} new
          </StandardBadge>
        </h3>
        
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-3">
            {smartPrompts.length > 0 ? (
              smartPrompts.map(prompt => {
                // Get the appropriate icon based on prompt type
                const promptIcon = () => {
                  if (prompt.type === "tip") return <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />;
                  if (prompt.type === "reminder") return <BellRing className="h-4 w-4 mr-2 text-blue-500" />;
                  if (prompt.type === "challenge") return <Star className="h-4 w-4 mr-2 text-purple-500" />;
                  if (prompt.type === "alert") return <AlertCircle className="h-4 w-4 mr-2 text-red-500" />;
                  return null;
                };
                
                // Get section theme based on prompt category
                const getSectionTheme = () => {
                  if (prompt.category === "financial") return "financial";
                  if (prompt.category === "cooking") return "wellness";
                  if (prompt.category === "time") return "learning";
                  return "wellness";
                };
                
                // Create title with icon and new badge
                const promptTitle = (
                  <div className="flex items-center text-base">
                    {promptIcon()}
                    {prompt.title}
                    {prompt.isNew && (
                      <StandardBadge 
                        size="sm" 
                        className="ml-2" 
                        sectionTheme={getSectionTheme()}
                        blurEffect={true}
                      >
                        New
                      </StandardBadge>
                    )}
                  </div>
                );
                
                // Create description with timestamp
                const promptDescription = (
                  <div className="text-xs">
                    {new Date(prompt.createdAt).toLocaleString()}
                  </div>
                );
                
                // Create footer with action buttons
                const promptFooter = (
                  <div className="flex justify-between w-full">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => dismissPrompt(prompt.id)}
                    >
                      Dismiss
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => actionPrompt(prompt)}
                    >
                      Take Action
                    </Button>
                  </div>
                );
                
                if (featureFlags.USE_STANDARD_CARDS) {
                  return (
                    <StandardCard
                      key={prompt.id}
                      title={promptTitle}
                      description={promptDescription}
                      sectionTheme={getSectionTheme()}
                      elevation="sm"
                      showGradient={prompt.isNew}
                      useBackdropBlur={prompt.isNew}
                      className={cn(
                        prompt.type === "alert" && "border-red-200"
                      )}
                      footer={promptFooter}
                    >
                      <p className="text-sm">{prompt.description}</p>
                    </StandardCard>
                  );
                }
                
                // Fallback to original card component
                return (
                  <Card key={prompt.id} className={cn(
                    "border hover:shadow-md transition-all",
                    prompt.isNew ? "bg-amber-50 border-amber-200" : "bg-white",
                    prompt.type === "alert" && "bg-red-50 border-red-200"
                  )}>
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-base flex items-center">
                        {promptIcon()}
                        {prompt.title}
                        {prompt.isNew && (
                          <StandardBadge 
                            size="sm" 
                            className="ml-2" 
                            sectionTheme={getSectionTheme()}
                            blurEffect={true}
                          >
                            New
                          </StandardBadge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(prompt.createdAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 py-1">
                      <p className="text-sm">{prompt.description}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-2 flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => dismissPrompt(prompt.id)}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => actionPrompt(prompt)}
                      >
                        Take Action
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="text-center p-6 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">No smart prompts right now. Check back later!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Recommended content */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
          Recommended for You
        </h3>
        
        {featureFlags.USE_STANDARD_MOBILE_SCROLL ? (
          <MobileScroller 
            columns={{ sm: 1, md: 2, lg: 2 }} 
            gap="md"
            mobileMinWidth={260}
          >
            {featureFlags.USE_STANDARD_CARDS ? (
              <>
                <StandardCard
                  title="Budgeting for Beginners"
                  description="Financial • 15 min read"
                  sectionTheme="financial"
                  footer={
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("financial")}>
                      Start Learning
                    </Button>
                  }
                >
                  <p className="text-sm">Learn the basics of budgeting with the popular 50/30/20 rule.</p>
                </StandardCard>
                
                <StandardCard
                  title="5 Simple Recipes for Beginners"
                  description="Cooking • 20 min read"
                  sectionTheme="wellness" 
                  footer={
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("cooking")}>
                      Start Learning
                    </Button>
                  }
                >
                  <p className="text-sm">Master these five easy recipes to build your cooking confidence.</p>
                </StandardCard>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base">Budgeting for Beginners</CardTitle>
                    <CardDescription>Financial • 15 min read</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 py-2">
                    <p className="text-sm">Learn the basics of budgeting with the popular 50/30/20 rule.</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-1">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("financial")}>
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base">5 Simple Recipes for Beginners</CardTitle>
                    <CardDescription>Cooking • 20 min read</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 py-2">
                    <p className="text-sm">Master these five easy recipes to build your cooking confidence.</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-1">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("cooking")}>
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </MobileScroller>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureFlags.USE_STANDARD_CARDS ? (
              <>
                <StandardCard
                  title="Budgeting for Beginners"
                  description="Financial • 15 min read"
                  sectionTheme="financial"
                  footer={
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("financial")}>
                      Start Learning
                    </Button>
                  }
                >
                  <p className="text-sm">Learn the basics of budgeting with the popular 50/30/20 rule.</p>
                </StandardCard>
                
                <StandardCard
                  title="5 Simple Recipes for Beginners"
                  description="Cooking • 20 min read"
                  sectionTheme="wellness" 
                  footer={
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("cooking")}>
                      Start Learning
                    </Button>
                  }
                >
                  <p className="text-sm">Master these five easy recipes to build your cooking confidence.</p>
                </StandardCard>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base">Budgeting for Beginners</CardTitle>
                    <CardDescription>Financial • 15 min read</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 py-2">
                    <p className="text-sm">Learn the basics of budgeting with the popular 50/30/20 rule.</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-1">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("financial")}>
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base">5 Simple Recipes for Beginners</CardTitle>
                    <CardDescription>Cooking • 20 min read</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 py-2">
                    <p className="text-sm">Master these five easy recipes to build your cooking confidence.</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-1">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("cooking")}>
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Onboarding form for personalization
  const OnboardingForm = () => (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Personalize Your Learning Journey</h2>
      <p className="text-muted-foreground mb-6">
        Let us get to know you better so we can tailor your life skills learning experience.
      </p>
      
      <form onSubmit={submitPersonalInfo} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">About You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input defaultValue={userProfile.name} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input type="number" defaultValue={userProfile.age} />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Your Goals</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">What life skills do you want to improve?</label>
            <Textarea 
              placeholder="e.g., I want to learn how to manage my finances better..."
              defaultValue={userProfile.goals.join("\n")}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Learning Preferences</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              type="button"
              variant={userProfile.learningStyle === "visual" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "visual"}))}
            >
              <span className="text-lg mb-1">👁️</span>
              <span className="font-medium">Visual</span>
              <span className="text-xs mt-1">Learn by seeing</span>
            </Button>
            
            <Button 
              type="button"
              variant={userProfile.learningStyle === "auditory" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "auditory"}))}
            >
              <span className="text-lg mb-1">👂</span>
              <span className="font-medium">Auditory</span>
              <span className="text-xs mt-1">Learn by hearing</span>
            </Button>
            
            <Button 
              type="button"
              variant={userProfile.learningStyle === "reading" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "reading"}))}
            >
              <span className="text-lg mb-1">📚</span>
              <span className="font-medium">Reading</span>
              <span className="text-xs mt-1">Learn by reading</span>
            </Button>
            
            <Button 
              type="button"
              variant={userProfile.learningStyle === "kinesthetic" ? "default" : "outline"}
              className="flex items-center justify-center h-auto py-3 flex-col"
              onClick={() => setUserProfile(prev => ({...prev, learningStyle: "kinesthetic"}))}
            >
              <span className="text-lg mb-1">✋</span>
              <span className="font-medium">Hands-on</span>
              <span className="text-xs mt-1">Learn by doing</span>
            </Button>
          </div>
        </div>
        
        <div className="pt-2">
          <Button type="submit" className="w-full">
            Start Personalized Journey
          </Button>
        </div>
      </form>
    </div>
  );

  // Tab content components
  const tabContent = {
    financial: (
      <div className="pt-4 space-y-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-100">
            <Wallet className="h-8 w-8 text-emerald-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-emerald-800">Financial Literacy Basics</h3>
                <StandardBadge size="sm" sectionTheme="financial" className="ml-2" blurEffect={true}>Essentials</StandardBadge>
              </div>
              <p className="text-emerald-700 text-sm">Core financial concepts for everyday money management</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-4 mb-5">
              <p className="text-sm text-emerald-800">
                <span className="font-semibold">Personalized for you:</span> Based on your goals to build an emergency fund,
                we've highlighted saving strategies below.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-800">Creating and maintaining a budget</h4>
                    <p className="text-sm text-gray-600 mt-1">Track income and expenses to ensure you're living within your means and achieving financial goals</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5.2 6h13.6a2 2 0 0 1 1.98 2.35l-.92 5.57a4 4 0 0 1-3.94 3.08H9.08a4 4 0 0 1-3.94-3.08L4.22 8.35A2 2 0 0 1 6.2 6Z"></path>
                      <line x1="9" y1="10" x2="15" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Understanding credit scores and debt management</h4>
                    <p className="text-sm text-gray-600 mt-1">Learn how credit works, how to improve your score, and strategies for managing debt effectively</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-800">Saving strategies for emergencies and goals</h4>
                    <p className="text-sm text-gray-600 mt-1">Methods for building emergency funds and saving for specific financial objectives</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="22"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Basic investment concepts</h4>
                    <p className="text-sm text-gray-600 mt-1">Introduction to investment types, compound interest, risk tolerance, and diversification</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 hover:shadow-md transition-shadow md:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="M6 8h.01M6 12h.01M6 16h.01M9 8h6M9 12h6M9 16h6"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Tax planning fundamentals</h4>
                    <p className="text-sm text-gray-600 mt-1">Understanding tax brackets, deductions, credits, and basic strategies to minimize tax burden legally</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-blue-700 flex items-center text-sm font-medium">
                <Lightbulb className="h-5 w-5 mr-2" />
                Smart Tip: The 50/30/20 Rule
              </h4>
              <p className="text-sm mt-2 text-blue-800">
                Allocate your after-tax income as follows:
              </p>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-white/70 p-3 rounded border border-blue-100 text-center">
                  <div className="text-blue-600 font-semibold">50%</div>
                  <div className="text-xs text-blue-800">Needs<br/>(Housing, Food, Bills)</div>
                </div>
                <div className="bg-white/70 p-3 rounded border border-blue-100 text-center">
                  <div className="text-blue-600 font-semibold">30%</div>
                  <div className="text-xs text-blue-800">Wants<br/>(Entertainment, Dining)</div>
                </div>
                <div className="bg-white/70 p-3 rounded border border-blue-100 text-center">
                  <div className="text-blue-600 font-semibold">20%</div>
                  <div className="text-xs text-blue-800">Savings<br/>(Emergency Fund, Goals)</div>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-3 italic">
                Based on your profile, starting with 10% savings could be more achievable, then gradually increase.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    cooking: (
      <div className="pt-4 space-y-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
            <ChefHat className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-orange-800">Essential Cooking Skills</h3>
                <StandardBadge size="sm" sectionTheme="wellness" className="ml-2" blurEffect={true}>Kitchen Basics</StandardBadge>
              </div>
              <p className="text-orange-700 text-sm">Foundational techniques for preparing healthy meals at home</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-orange-50 rounded-lg border border-orange-100 p-4 mb-5">
              <p className="text-sm text-orange-800">
                <span className="font-semibold">Personalized for you:</span> Given your interest in learning basic meals,
                we've curated visual recipes that match your learning style.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-orange-300 to-orange-400"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <path d="M17.5 3.5 16 7"></path>
                      <path d="m9 5 1 4"></path>
                      <path d="M7 7.1A6.8 6.8 0 0 0 8.3 20h7.4A6.8 6.8 0 0 0 17 7.1"></path>
                      <path d="M8.5 19v2"></path>
                      <path d="M15.5 19v2"></path>
                    </svg>
                    <h4 className="font-medium text-orange-800">Knife Skills & Safety</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-inside list-disc">
                    <li>Proper knife grip and cutting techniques</li>
                    <li>Chopping, dicing, and mincing methods</li>
                    <li>Knife maintenance and sharpening</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-orange-300 to-orange-400"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <path d="M8 3v3"></path>
                      <path d="M18 3v3"></path>
                      <path d="M16 3h4"></path>
                      <circle cx="12" cy="13" r="8"></circle>
                      <path d="M9 16a3 3 0 0 0 3.24 3 3 3 0 0 0 2.76-3"></path>
                      <path d="M9 10h.01"></path>
                      <path d="M15 10h.01"></path>
                      <path d="M9 8h6"></path>
                      <path d="M6 3H4"></path>
                    </svg>
                    <h4 className="font-medium text-orange-800">Cooking Methods</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-inside list-disc">
                    <li>Understanding dry heat: roasting & broiling</li>
                    <li>Moist heat: steaming, poaching, simmering</li>
                    <li>Combination methods: stir-frying, braising</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-orange-300 to-orange-400"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <path d="M9 21H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6"></path>
                      <path d="M16 4h2a2 2 0 0 1 2 2v15"></path>
                      <path d="m13 7-3 3 3 3"></path>
                      <path d="M9 10h6"></path>
                    </svg>
                    <h4 className="font-medium text-orange-800">Meal Planning</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-inside list-disc">
                    <li>Weekly meal planning strategies</li>
                    <li>Grocery shopping on a budget</li>
                    <li>Building versatile pantry staples</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-orange-300 to-orange-400"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 4.6 9c-1 .6-1.7 1.8-1.7 3 0 2 1.7 3.5 3.7 3.5h11.4c2 0 3.7-1.5 3.7-3.5a3.3 3.3 0 0 0-1.7-3c.1-.4.1-.7.1-1A6 6 0 0 0 12 3"></path>
                    </svg>
                    <h4 className="font-medium text-orange-800">Recipe Basics</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-inside list-disc">
                    <li>Recipe terminology and abbreviations</li>
                    <li>Understanding cooking times & temperatures</li>
                    <li>Recipe modification techniques</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden sm:col-span-2 lg:col-span-2">
                <div className="h-3 bg-gradient-to-r from-orange-300 to-orange-400"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <path d="m3 2 18 24"></path>
                      <path d="M8 4h10a2 2 0 0 1 2 2v10.5"></path>
                      <path d="M12 16a4 4 0 0 1-4 4H4"></path>
                      <path d="M9 10h1"></path>
                      <path d="M12 4v5"></path>
                      <path d="M16 10h1"></path>
                    </svg>
                    <h4 className="font-medium text-orange-800">Food Storage & Safety</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-inside list-disc grid grid-cols-1 sm:grid-cols-2">
                    <li>Proper food storage techniques</li>
                    <li>Understanding expiration dates</li>
                    <li>Safe food handling practices</li>
                    <li>Creative leftover transformations</li>
                    <li>Freezer meal preparation</li>
                    <li>Prevention of cross-contamination</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-start gap-3">
                <div className="bg-white rounded-full p-2 flex items-center justify-center text-green-500 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <h4 className="text-green-700 font-medium text-sm">Weekend Cooking Challenge</h4>
                  <p className="text-sm mt-1 text-green-800">
                    Try making a simple one-pot pasta dish this weekend. We'll send you a visual recipe
                    card with step-by-step instructions matched to your skill level.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors">
                      Start Challenge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    home: (
      <div className="pt-4 space-y-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-100">
            <Home className="h-8 w-8 text-red-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-red-800">Home Maintenance Skills</h3>
                <StandardBadge size="sm" sectionTheme="emergency" className="ml-2" blurEffect={true}>Essentials</StandardBadge>
              </div>
              <p className="text-red-700 text-sm">Practical skills for taking care of your living space</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div className="bg-gradient-to-b from-red-50 to-white rounded-lg border border-red-100 overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-red-800 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                      </svg>
                      Plumbing Basics
                    </h4>
                    <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Beginner</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">1</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Fixing a Running Toilet</p>
                        <p className="text-xs text-gray-600">Learn to adjust or replace the flapper valve and fill valve</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">2</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Unclogging Drains</p>
                        <p className="text-xs text-gray-600">Using plungers, drain snakes, and eco-friendly solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">3</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Fixing Leaky Faucets</p>
                        <p className="text-xs text-gray-600">Identifying the leak source and replacing washers or cartridges</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-red-50 to-white rounded-lg border border-red-100 overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-red-800 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Electrical Safety
                    </h4>
                    <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Important</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">1</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Circuit Breaker Basics</p>
                        <p className="text-xs text-gray-600">Understanding your home's electrical panel and how to safely reset breakers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">2</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Light Fixture Replacement</p>
                        <p className="text-xs text-gray-600">How to safely swap out light fixtures after turning off power</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">3</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">When to Call a Professional</p>
                        <p className="text-xs text-gray-600">Recognizing when electrical work requires a licensed electrician</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-red-50 to-white rounded-lg border border-red-100 overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-red-800 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                      Wall Repairs
                    </h4>
                    <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">DIY</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">1</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Patching Small Holes</p>
                        <p className="text-xs text-gray-600">Using spackling compound and sandpaper for nail holes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">2</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Drywall Repair</p>
                        <p className="text-xs text-gray-600">Fixing larger holes with drywall patches and joint compound</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">3</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Painting Techniques</p>
                        <p className="text-xs text-gray-600">Proper preparation, priming, and painting for a professional finish</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-red-50 to-white rounded-lg border border-red-100 overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-red-800 font-medium flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      Home Organization
                    </h4>
                    <div className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Wellness</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">1</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Cleaning Routines</p>
                        <p className="text-xs text-gray-600">Creating daily, weekly, and monthly cleaning schedules</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">2</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Storage Solutions</p>
                        <p className="text-xs text-gray-600">Maximizing space with proper storage techniques and containers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">3</div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">Decluttering Methods</p>
                        <p className="text-xs text-gray-600">Step-by-step approaches to minimizing clutter and organizing possessions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 flex items-center text-sm mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2">
                  <path d="M3 6v18h18"></path>
                  <path d="M3 12h18"></path>
                  <path d="M3 18h18"></path>
                  <path d="M9 3v18"></path>
                  <path d="M15 3v18"></path>
                </svg>
                Seasonal Home Maintenance Checklist
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                <div className="bg-white/80 p-2 rounded border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">Spring</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Clean gutters</li>
                    <li>• Inspect roof</li>
                    <li>• Check AC system</li>
                  </ul>
                </div>
                <div className="bg-white/80 p-2 rounded border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">Summer</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Check sprinklers</li>
                    <li>• Clean refrigerator coils</li>
                    <li>• Inspect decks/patios</li>
                  </ul>
                </div>
                <div className="bg-white/80 p-2 rounded border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">Fall</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Winterize sprinklers</li>
                    <li>• Check heating system</li>
                    <li>• Clean chimney</li>
                  </ul>
                </div>
                <div className="bg-white/80 p-2 rounded border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">Winter</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Check insulation</li>
                    <li>• Prevent frozen pipes</li>
                    <li>• Test smoke detectors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    time: (
      <div className="pt-4 space-y-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-100">
            <Clock className="h-8 w-8 text-purple-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-purple-800">Time Management Strategies</h3>
                <StandardBadge size="sm" sectionTheme="learning" className="ml-2" blurEffect={true}>Productivity</StandardBadge>
              </div>
              <p className="text-purple-700 text-sm">Techniques for maximizing productivity and reducing stress</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-purple-50 rounded-lg border border-purple-100 p-4 mb-5">
              <p className="text-sm text-purple-800">
                <span className="font-semibold">Personalized for you:</span> Based on your challenges with procrastination,
                we've highlighted strategies below that can help you overcome this hurdle.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100 overflow-hidden shadow-sm">
                <div className="bg-purple-100 py-3 px-4 flex items-center justify-between">
                  <h4 className="font-medium text-purple-800">Setting Priorities</h4>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                      <path d="M7 21h10"></path>
                      <path d="M12 3v18"></path>
                      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">Determine what tasks are most important using methods like:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Eisenhower Matrix (urgent vs. important)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>MoSCoW method (Must, Should, Could, Won't)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Value vs. Effort analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100 overflow-hidden shadow-sm">
                <div className="bg-purple-100 py-3 px-4 flex items-center justify-between">
                  <h4 className="font-medium text-purple-800 flex items-center">
                    <span>Effective To-Do Lists</span>
                    <div className="px-1.5 py-0.5 text-[10px] ml-2 bg-purple-200 text-purple-800 rounded-full">Recommended</div>
                  </h4>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">Create to-do lists that actually get done:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Break tasks into small, specific actions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Limit your daily list to 3-5 crucial tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Estimate time required for each task</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100 overflow-hidden shadow-sm">
                <div className="bg-purple-100 py-3 px-4 flex items-center justify-between">
                  <h4 className="font-medium text-purple-800 flex items-center">
                    <span>Anti-Procrastination</span>
                    <div className="px-1.5 py-0.5 text-[10px] ml-2 bg-purple-200 text-purple-800 rounded-full">Recommended</div>
                  </h4>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">Overcome procrastination with these methods:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>The 2-minute rule (if it takes less than 2 minutes, do it now)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Eat the frog (do the most difficult task first)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>The 5-4-3-2-1 technique (count down and take action)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100 overflow-hidden shadow-sm">
                <div className="bg-purple-100 py-3 px-4 flex items-center justify-between">
                  <h4 className="font-medium text-purple-800">Time Blocking</h4>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">Allocate specific time blocks for tasks:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Schedule focus blocks (60-90 minutes) for deep work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Include buffer time between activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Group similar tasks together (batching)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100 overflow-hidden shadow-sm">
                <div className="bg-purple-100 py-3 px-4 flex items-center justify-between">
                  <h4 className="font-medium text-purple-800">Work-Life Balance</h4>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-3">Maintain balance between work and personal life:</p>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Set clear boundaries between work and personal time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Schedule downtime and self-care activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-0.5 mt-0.5 text-purple-500 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>Learn to delegate and say no when necessary</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-purple-100 p-4">
              <div className="absolute top-0 right-0 -mt-4 -mr-10 h-20 w-20 rounded-full bg-purple-200 opacity-30"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-4 h-24 w-24 rounded-full bg-indigo-200 opacity-20"></div>
              <div className="relative flex items-start gap-3">
                <div className="bg-white rounded-full p-2 flex items-center justify-center text-indigo-500 shadow-sm">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-indigo-800 mb-1">Try This Today: The Pomodoro Technique</h4>
                  <p className="text-sm text-indigo-700">
                    Research shows this technique can significantly help overcome procrastination tendencies:
                  </p>
                  <ol className="mt-2 space-y-1.5 text-sm text-indigo-800 ml-5 list-decimal">
                    <li>Choose one task to focus on</li>
                    <li>Set a timer for 25 minutes and work without interruption</li>
                    <li>Take a 5-minute break when the timer rings</li>
                    <li>After 4 pomodoros, take a longer 15-30 minute break</li>
                  </ol>
                  <div className="mt-3 flex justify-end">
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-medium hover:bg-indigo-200 transition-colors">
                      Start Pomodoro Timer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    communication: (
      <div className="pt-4 space-y-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
            <MessageSquare className="h-8 w-8 text-blue-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-blue-800">Communication Skills</h3>
                <StandardBadge size="sm" sectionTheme="career" className="ml-2" blurEffect={true}>Interpersonal</StandardBadge>
              </div>
              <p className="text-blue-700 text-sm">Essential techniques for effective personal and professional communication</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-blue-800">Active Listening</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    The art of fully focusing on the speaker without planning your response.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Maintain eye contact and open body language</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Ask clarifying questions to ensure understanding</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Practice reflective paraphrasing: "What I hear you saying is..."</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-blue-800">Clear Speaking</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Communicate ideas effectively to ensure your message is understood.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Organize thoughts before speaking</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Use simple language and avoid jargon</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Control pace and volume for better comprehension</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-blue-800">Difficult Conversations</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Navigate challenging discussions with empathy and effectiveness.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Prepare key points in advance</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Focus on issues, not personalities</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Use "I" statements to express feelings</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 15V6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        <path d="M16 19h6"></path>
                        <path d="M19 16v6"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-blue-800">Professional Emails</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Write clear, effective emails for business and formal communication.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Create specific, informative subject lines</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Keep paragraphs short and focused</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Proofread before sending</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow relative md:col-span-2 lg:col-span-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mt-10 -mr-10 z-0"></div>
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg text-blue-800">Non-verbal Communication</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Understand the messages conveyed through body language and expressions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Be aware of your facial expressions and posture</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Notice inconsistencies between verbal and non-verbal cues</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-700">Adapt to cultural differences in body language</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-4">
              <h3 className="text-blue-800 font-medium text-sm mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Communication Best Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/80 rounded border border-blue-100 p-3">
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Do:</h4>
                  <ul className="text-xs text-gray-700 space-y-1 pl-1">
                    <li className="flex items-start gap-1.5">
                      <div className="text-green-500 mt-0.5">✓</div>
                      <span>Allow others to finish speaking before responding</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="text-green-500 mt-0.5">✓</div>
                      <span>Consider your audience when choosing words and examples</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="text-green-500 mt-0.5">✓</div>
                      <span>Ask for feedback to ensure your message was understood</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/80 rounded border border-blue-100 p-3">
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Don't:</h4>
                  <ul className="text-xs text-gray-700 space-y-1 pl-1">
                    <li className="flex items-start gap-1.5">
                      <div className="text-red-500 mt-0.5">✗</div>
                      <span>Interrupt or dominate conversations</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="text-red-500 mt-0.5">✗</div>
                      <span>Use accusatory language ("you always" or "you never")</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <div className="text-red-500 mt-0.5">✗</div>
                      <span>Dismiss others' perspectives or emotions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    shopping: (
      <div className="pt-4">
        <ShoppingBuddy />
      </div>
    ),
  };

  // Convert tabContent to TabNav format
  const tabNavItems = tabs.map(tab => ({
    value: tab.id,
    label: (
      <div className="flex items-center">
        {React.createElement(tab.icon, { className: "h-4 w-4 mr-2" })}
        <span>{tab.label}</span>
      </div>
    ),
    content: tabContent[tab.id as keyof typeof tabContent]
  }));

  // Helper function to render search bar
  const renderSearchBar = () => {
    const handleSearchChange = (value: string) => {
      setSearchQuery(value);
    };
    
    if (featureFlags.USE_STANDARD_SEARCH) {
      return (
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for life skills advice..."
            sectionTheme={activeTab === "financial" ? "financial" : "wellness"}
            rounded="pill"
            className="mb-2"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSearch}
              size="sm"
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search for life skills advice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-0 top-0 h-full"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="w-full">
      {/* Search Bar for life skills assistance */}
      {renderSearchBar()}
      
      {/* Show search results if any */}
      {guidance && (
        <StandardCard 
          className="mb-6"
          title="Guidance"
          sectionTheme={activeTab === "financial" ? "financial" : "wellness"}
          showGradient={true}
        >
          <div className="whitespace-pre-line">{guidance}</div>
        </StandardCard>
      )}
      
      {/* Tab Navigation */}
      {featureFlags.USE_STANDARD_TABS ? (
        <TabNav 
          tabs={tabNavItems}
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as LifeSkillsTabId)}
          variant="pill"
          size="md"
          sectionTheme={activeTab === "financial" ? "financial" : 
                     activeTab === "cooking" ? "wellness" : 
                     activeTab === "time" ? "learning" :
                     activeTab === "home" ? "emergency" :
                     "career"}
          className="mb-4"
        />
      ) : (
        <div className="px-2">
          {tabContent[activeTab as keyof typeof tabContent]}
        </div>
      )}
    </div>
  );
};