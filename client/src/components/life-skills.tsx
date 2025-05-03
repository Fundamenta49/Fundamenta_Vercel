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
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
            <Wallet className="h-8 w-8 text-blue-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-blue-800">Financial Literacy Basics</h3>
                <StandardBadge size="sm" sectionTheme="financial" className="ml-2" blurEffect={true}>Core Skills</StandardBadge>
              </div>
              <p className="text-blue-700 text-sm">Essential money management skills for everyday life</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-blue-50/50 rounded-lg p-4 mb-5 border border-blue-100">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Personalized for You</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Based on your goals to build an emergency fund, we've highlighted saving strategies below.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-100 overflow-hidden shadow-sm">
                <div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800">Recommended Focus Areas</h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">Creating and maintaining a budget</span>
                        <p className="text-sm text-blue-700 mt-0.5">Track income and expenses to gain control of your finances</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-100 text-blue-700 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-blue-900">Saving strategies for emergencies</span>
                        <p className="text-sm text-blue-700 mt-0.5">Build a safety net for unexpected expenses</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-100 overflow-hidden shadow-sm">
                <div className="bg-blue-100 px-4 py-2 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800">Additional Skills</h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="text-blue-400 flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v4l3 3"></path>
                        </svg>
                      </div>
                      <span className="text-blue-800">Understanding credit scores and debt management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="text-blue-400 flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v4l3 3"></path>
                        </svg>
                      </div>
                      <span className="text-blue-800">Basic investment concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="text-blue-400 flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v4l3 3"></path>
                        </svg>
                      </div>
                      <span className="text-blue-800">Tax planning fundamentals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Lightbulb className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    Smart Tip: The 50/30/20 Budget Rule
                  </h4>
                  <p className="text-blue-800 mt-2">
                    Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.
                    Based on your profile, starting with 10% savings could be more achievable.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-100/60 rounded-lg p-2 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">50%</div>
                      <div className="text-xs text-blue-700">Needs</div>
                    </div>
                    <div className="bg-blue-100/60 rounded-lg p-2 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">30%</div>
                      <div className="text-xs text-blue-700">Wants</div>
                    </div>
                    <div className="bg-blue-100/60 rounded-lg p-2 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-800">20%</div>
                      <div className="text-xs text-blue-700">Savings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    cooking: (
      <div className="pt-4 space-y-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-100">
            <ChefHat className="h-8 w-8 text-green-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-green-800">Essential Cooking Skills</h3>
                <StandardBadge size="sm" sectionTheme="wellness" className="ml-2" blurEffect={true}>For Beginners</StandardBadge>
              </div>
              <p className="text-green-700 text-sm">Learn to prepare delicious, healthy meals with confidence</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-green-50/50 rounded-lg p-4 mb-5 border border-green-100">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Personalized for You</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Given your interest in learning basic meals, we've curated visual recipes 
                    that match your visual learning style.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="col-span-1 md:col-span-2">
                <div className="bg-green-50 rounded-lg overflow-hidden border border-green-200">
                  <div className="bg-green-100 px-4 py-3">
                    <h4 className="font-semibold text-green-800">Recommended Learning Path</h4>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex-1 min-w-[200px] flex items-center p-3 bg-white rounded-md border border-green-100 shadow-sm">
                        <div className="bg-green-100 w-9 h-9 rounded-full flex items-center justify-center mr-3 text-green-600 font-bold">1</div>
                        <div>
                          <div className="font-medium text-green-900">Kitchen Safety</div>
                          <p className="text-xs text-green-700">The foundation of cooking confidently</p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-[200px] flex items-center p-3 bg-white rounded-md border border-green-100 shadow-sm">
                        <div className="bg-green-100 w-9 h-9 rounded-full flex items-center justify-center mr-3 text-green-600 font-bold">2</div>
                        <div>
                          <div className="font-medium text-green-900">Knife Skills</div>
                          <p className="text-xs text-green-700">Safe and efficient cutting techniques</p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-[200px] flex items-center p-3 bg-white rounded-md border border-green-100 shadow-sm">
                        <div className="bg-green-100 w-9 h-9 rounded-full flex items-center justify-center mr-3 text-green-600 font-bold">3</div>
                        <div>
                          <div className="font-medium text-green-900">Cooking Methods</div>
                          <p className="text-xs text-green-700">Master fundamental techniques</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-white px-4 py-3 border-b border-green-100">
                  <h4 className="font-semibold text-green-800">Key Focus Areas</h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="bg-green-100 text-green-700 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-green-900">Understanding cooking methods</span>
                        <p className="text-sm text-green-700 mt-0.5">Learn to roast, sauté, boil, and more</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-100 text-green-700 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-green-900">Meal planning and grocery shopping</span>
                        <p className="text-sm text-green-700 mt-0.5">Save time and reduce food waste</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-white px-4 py-3 border-b border-green-100">
                  <h4 className="font-semibold text-green-800">Supporting Skills</h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="text-green-400 flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v4l3 3"></path>
                        </svg>
                      </div>
                      <span className="text-green-800">Reading and following recipes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="text-green-400 flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 8v4l3 3"></path>
                        </svg>
                      </div>
                      <span className="text-green-800">Food storage and leftovers management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-100/50 to-green-50/80 rounded-lg border border-green-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-green-100 border-b border-green-200">
                <div className="bg-white p-1.5 rounded-full">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-800">Weekend Challenge</h4>
              </div>
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="bg-white rounded-md p-3 flex-1 border border-green-100 shadow-sm">
                    <h5 className="text-base font-medium text-green-800 mb-2">One-Pot Pasta</h5>
                    <p className="text-sm text-green-700">
                      Try making a simple one-pot pasta dish this weekend. We'll send you a visual recipe
                      card with step-by-step instructions matched to your skill level.
                    </p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                        Get Recipe
                      </Button>
                    </div>
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-100">
            <Home className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-orange-800">Home Maintenance Skills</h3>
                <StandardBadge size="sm" sectionTheme="emergency" className="ml-2" blurEffect={true}>Essential</StandardBadge>
              </div>
              <p className="text-orange-700 text-sm">Learn to maintain and repair your living space</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-b from-orange-50 to-white rounded-lg overflow-hidden border border-orange-100 shadow-sm">
                <div className="bg-orange-100 px-4 py-3 border-b border-orange-200">
                  <h4 className="font-semibold text-orange-800">Plumbing Skills</h4>
                </div>
                <div className="p-5">
                  <div className="flex mb-4">
                    <div className="p-2 bg-orange-50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                        <path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path>
                        <path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path>
                        <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
                        <path d="M12 10v4"></path><path d="M10 14h4"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium text-orange-900">Fixing Common Leaks</h5>
                      <p className="text-sm text-orange-700 mt-1">Learn to repair dripping faucets and leaking pipes</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-orange-800">
                    <li className="flex items-center">
                      <div className="bg-orange-100 h-5 w-5 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold mr-2">1</div>
                      <span>Basic plumbing tools and their uses</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-orange-100 h-5 w-5 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold mr-2">2</div>
                      <span>Identifying common leak points</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-orange-100 h-5 w-5 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold mr-2">3</div>
                      <span>Step-by-step repair processes</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-orange-50 to-white rounded-lg overflow-hidden border border-orange-100 shadow-sm">
                <div className="bg-orange-100 px-4 py-3 border-b border-orange-200">
                  <h4 className="font-semibold text-orange-800">Electrical Safety</h4>
                </div>
                <div className="p-5">
                  <div className="flex mb-4">
                    <div className="p-2 bg-orange-50 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                        <path d="M12 20h.01"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium text-orange-900">Working with Fixtures</h5>
                      <p className="text-sm text-orange-700 mt-1">Safe techniques for electrical maintenance</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-orange-800">
                    <li className="flex items-center">
                      <div className="bg-orange-100 h-5 w-5 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold mr-2">1</div>
                      <span>Circuit breaker basics and safety</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-orange-100 h-5 w-5 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold mr-2">2</div>
                      <span>Changing light fixtures and switches</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-orange-100 h-5 w-5 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold mr-2">3</div>
                      <span>When to call a professional</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-orange-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-white px-4 py-3 border-b border-orange-100">
                <h4 className="font-semibold text-orange-800">Additional Home Skills</h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 mr-2">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                      </svg>
                      <h5 className="font-medium text-orange-800">Wall Repairs</h5>
                    </div>
                    <p className="text-sm text-orange-700">Patching holes, prepping, and painting techniques</p>
                  </div>
                  
                  <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 mr-2">
                        <rect width="20" height="20" x="2" y="2" rx="5"></rect>
                        <path d="M16 16h.01"></path>
                        <path d="M8 16h.01"></path>
                        <path d="M16 8h.01"></path>
                        <path d="M8 8h.01"></path>
                      </svg>
                      <h5 className="font-medium text-orange-800">Organization</h5>
                    </div>
                    <p className="text-sm text-orange-700">Effective cleaning routines and storage solutions</p>
                  </div>
                  
                  <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 mr-2">
                        <path d="M12 2v8"></path>
                        <path d="m4.93 10.93 1.41 1.41"></path>
                        <path d="M2 18h2"></path>
                        <path d="M20 18h2"></path>
                        <path d="m19.07 10.93-1.41 1.41"></path>
                        <path d="M22 22H2"></path>
                        <path d="M16 7.5a4 4 0 0 0-8 0"></path>
                        <path d="M16 12.5a4 4 0 0 0-8 0"></path>
                      </svg>
                      <h5 className="font-medium text-orange-800">Seasonal Tasks</h5>
                    </div>
                    <p className="text-sm text-orange-700">Year-round maintenance to protect your home</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline" className="text-orange-600 border-orange-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Get DIY Home Maintenance Guide
              </Button>
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
              <p className="text-purple-700 text-sm">Systems and methods to make the most of your time</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-purple-50/50 rounded-lg p-4 mb-5 border border-purple-100">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-800">Personalized for You</h4>
                  <p className="text-purple-700 text-sm mt-1">
                    Based on your weakness with procrastination, we've highlighted relevant
                    strategies below to help you overcome this challenge.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-b from-purple-50 to-white rounded-lg overflow-hidden border border-purple-100 shadow-sm">
                  <div className="bg-purple-100 py-3 px-4 border-b border-purple-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-purple-800">Recommended Focus</h4>
                      <StandardBadge size="sm" sectionTheme="career" pill={true}>High Priority</StandardBadge>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="bg-purple-100 text-purple-700 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-purple-900">Creating effective to-do lists</span>
                          <p className="text-sm text-purple-700 mt-0.5">Prioritize tasks to focus on what matters most</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-purple-100 text-purple-700 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-purple-900">Avoiding procrastination</span>
                          <p className="text-sm text-purple-700 mt-0.5">Techniques to overcome delay and start tasks promptly</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-white px-4 py-3 border-b border-purple-100">
                    <h4 className="font-semibold text-purple-800">Additional Skills</h4>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="text-purple-400 flex-shrink-0 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4l3 3"></path>
                          </svg>
                        </div>
                        <span className="text-purple-800">Setting priorities and goals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-purple-400 flex-shrink-0 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4l3 3"></path>
                          </svg>
                        </div>
                        <span className="text-purple-800">Time blocking techniques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="text-purple-400 flex-shrink-0 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4l3 3"></path>
                          </svg>
                        </div>
                        <span className="text-purple-800">Work-life balance strategies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-purple-50 to-purple-100/30 rounded-lg overflow-hidden border border-purple-200 shadow-sm">
                <div className="bg-purple-100 px-4 py-3 border-b border-purple-200">
                  <h4 className="font-semibold text-purple-800 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Try This Today
                  </h4>
                </div>
                <div className="p-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                    <h5 className="font-medium text-purple-800 text-base">The Pomodoro Technique</h5>
                    <div className="mt-3 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-full border-4 border-purple-200 flex items-center justify-center bg-white">
                          <div className="text-center">
                            <div className="text-purple-900 font-bold text-2xl">25</div>
                            <div className="text-purple-600 text-xs">minutes</div>
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full p-2 border border-purple-200">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    <p className="text-purple-800 text-sm mt-4">
                      Work focused for 25 minutes, then take a 5-minute break.
                      Research shows this can help overcome procrastination tendencies.
                    </p>
                    <div className="mt-3 flex justify-center">
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                        Try Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
              <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
                Other Techniques to Explore
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div className="border border-purple-100 p-3 rounded-md bg-purple-50/50 hover:bg-purple-50 transition-colors">
                  <h5 className="font-medium text-purple-800">Eisenhower Matrix</h5>
                  <p className="text-xs text-purple-700 mt-1">Prioritize tasks based on importance and urgency</p>
                </div>
                <div className="border border-purple-100 p-3 rounded-md bg-purple-50/50 hover:bg-purple-50 transition-colors">
                  <h5 className="font-medium text-purple-800">Time Blocking</h5>
                  <p className="text-xs text-purple-700 mt-1">Schedule specific time periods for focused work</p>
                </div>
                <div className="border border-purple-100 p-3 rounded-md bg-purple-50/50 hover:bg-purple-50 transition-colors">
                  <h5 className="font-medium text-purple-800">2-Minute Rule</h5>
                  <p className="text-xs text-purple-700 mt-1">If a task takes less than 2 minutes, do it immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    communication: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Communication Skills</h3>
        <ul className="space-y-2">
          <li>Active listening techniques</li>
          <li>Clear and concise speaking</li>
          <li>Managing difficult conversations</li>
          <li>Professional email writing</li>
          <li>Non-verbal communication awareness</li>
        </ul>
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