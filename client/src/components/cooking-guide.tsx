import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Utensils, ChefHat, ThermometerSun, Trash2, Timer, Maximize2, Minimize2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatInterface from "@/components/chat-interface";

const COOKING_RESOURCES = [
  {
    name: "America's Test Kitchen",
    url: "https://www.americastestkitchen.com",
    description: "A great site for reviews on the best tools and recipe ideas."
  },
  {
    name: "Kitchen Confidential",
    url: "https://www.reddit.com/r/KitchenConfidential",
    description: "A wonderful community for professional and home cooks alike."
  }
];

const COOKING_BASICS = [
  {
    title: "Kitchen Safety Essentials",
    description: "Learn fundamental kitchen safety practices",
    icon: ThermometerSun,
    topics: [
      "Fire safety in the kitchen",
      "Proper knife handling",
      "Food temperature safety",
      "Emergency procedures"
    ]
  },
  {
    title: "Kitchen Tools & Equipment",
    description: "How to use common kitchen tools safely",
    icon: Utensils,
    topics: [
      "Safe microwave usage",
      "Can opener techniques",
      "Proper pan handling",
      "Kitchen appliance safety"
    ]
  },
  {
    title: "Kitchen Sanitation",
    description: "Keep your cooking space clean and safe",
    icon: Trash2,
    topics: [
      "Proper hand washing",
      "Surface sanitization",
      "Food storage safety",
      "Cross-contamination prevention"
    ]
  },
  {
    title: "Basic Cooking Methods",
    description: "Learn essential cooking techniques",
    icon: ChefHat,
    topics: [
      "Boiling and simmering",
      "Safe pan frying",
      "Oven safety",
      "Microwave cooking"
    ]
  },
  {
    title: "Cooking Times & Temperatures",
    description: "Essential guidelines for safe cooking",
    icon: Timer,
    topics: [
      "Safe internal temperatures",
      "Cooking time guidelines",
      "Defrosting safety",
      "Food storage temperatures"
    ]
  }
];

export default function CookingGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(false);

  const fetchGuidance = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setGuidance(null);

    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "cooking",
          userQuery: topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch guidance");
      }

      const data = await response.json();

      if (!data.guidance) {
        throw new Error("No guidance content received");
      }

      setGuidance(data.guidance);
      setVideos(data.videos || []);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching guidance:", error);
      setError("Failed to load cooking guidance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await fetchGuidance(searchQuery);
  };

  const renderGuidanceContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!guidance) return null;

    return (
      <div className="relative">
        {videos.length > 0 && (
          <div className={`
            transition-all duration-300 ease-in-out
            ${isVideoFocused ? 
              'fixed inset-0 z-50 bg-background/95 p-6 flex flex-col items-center justify-center' : 
              'relative w-full'
            }
          `}>
            <div className="flex justify-between items-center w-full max-w-4xl mb-4">
              <h3 className={`text-lg font-semibold ${isVideoFocused ? 'text-white' : ''}`}>
                Tutorial Videos
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoFocused(!isVideoFocused)}
              >
                {isVideoFocused ? (
                  <><Minimize2 className="h-4 w-4 mr-2" /> Exit Focus Mode</>
                ) : (
                  <><Maximize2 className="h-4 w-4 mr-2" /> Enter Focus Mode</>
                )}
              </Button>
            </div>

            <div className={`
              grid gap-6 w-full
              ${isVideoFocused ? 'max-w-4xl' : ''}
            `}>
              {videos.map((video) => (
                <div key={video.id} className="space-y-2">
                  <div className="relative aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className={`text-sm font-medium ${isVideoFocused ? 'text-white' : ''}`}>
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`
          space-y-6 transition-all duration-300
          ${isVideoFocused ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}
        `}>
          <div className="prose prose-gray max-w-none space-y-4">
            {guidance.split('\n\n').map((section, idx) => {
              if (section.startsWith('🎯') || section.startsWith('👩‍🍳') || 
                  section.startsWith('⚠️') || section.startsWith('💡') || 
                  section.startsWith('🧰') || section.startsWith('⏰')) {
                const [title, ...content] = section.split('\n');
                return (
                  <div key={idx} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <div className="space-y-2">
                      {content.map((line, lineIdx) => (
                        <p key={lineIdx} className="text-gray-700">{line}</p>
                      ))}
                    </div>
                  </div>
                );
              }
              return <p key={idx} className="text-gray-700">{section}</p>;
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderResources = () => {
    return (
      <div className={`space-y-4 ${isVideoFocused ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <h3 className="text-lg font-semibold">Helpful Resources</h3>
        <div className="grid gap-4">
          {COOKING_RESOURCES.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <h4 className="font-medium text-primary">{resource.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${isVideoFocused ? 'overflow-hidden h-screen' : ''}`}>
      <div className={`transition-all duration-300 ${isVideoFocused ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Cooking Basics Guide
            </CardTitle>
            <CardDescription>
              Learn essential cooking skills and kitchen safety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search cooking skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  variant="outline"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search for guidance"}
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {COOKING_BASICS.map((topic, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => {
                      setSearchQuery(topic.title);
                      fetchGuidance(topic.title);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {topic.icon && <topic.icon className="h-5 w-5" />}
                        {topic.title}
                      </CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm text-gray-500">
                        {topic.topics.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Additional Resources
            </CardTitle>
            <CardDescription>
              Trusted sources for cooking knowledge and community
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderResources()}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{searchQuery}</DialogTitle>
              <DialogDescription>
                Step-by-step guide and helpful resources
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="pr-4">
              {renderGuidanceContent()}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>AI Cooking Assistant</CardTitle>
            <CardDescription>
              Get personalized help with cooking questions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ChatInterface category="cooking" />
          </CardContent>
        </Card>
      </div>

      {renderGuidanceContent()}
    </div>
  );
}