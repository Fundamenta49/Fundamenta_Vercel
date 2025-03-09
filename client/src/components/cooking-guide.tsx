import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Loader2, Search, Utensils, ChefHat, ThermometerSun, Trash2, Timer, ExternalLink } from "lucide-react";
import ChatInterface from "@/components/chat-interface";

interface VideoSectionProps {
  videos: Array<{
    id: string;
    title: string;
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    duration: string;
  }>;
}

const formatVideoDuration = (duration: string) => {
  const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "00:00";

  const hours = (match[1] ? parseInt(match[1].replace('H', '')) : 0).toString();
  const minutes = (match[2] ? parseInt(match[2].replace('M', '')) : 0).toString().padStart(2, '0');
  const seconds = (match[3] ? parseInt(match[3].replace('S', '')) : 0).toString().padStart(2, '0');

  return hours !== '0' ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

const VideoSection = ({ videos }: VideoSectionProps) => {
  if (!videos?.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No video tutorials available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden hover:bg-accent/5 transition-colors">
          <div className="relative aspect-video">
            <img
              src={video.thumbnail.url}
              alt={video.title}
              width={video.thumbnail.width}
              height={video.thumbnail.height}
              className="object-cover w-full"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
              {formatVideoDuration(video.duration)}
            </div>
          </div>
          <CardContent className="p-4">
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-primary hover:text-primary/80 text-left"
              onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
            >
              <span className="flex items-center gap-1">
                {video.title}
                <ExternalLink className="h-3 w-3" />
              </span>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

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
  const [videos, setVideos] = useState<VideoSectionProps["videos"]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "life",
          userQuery: `cooking guide: ${searchQuery}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get cooking guidance');
      }

      const data = await response.json();
      setGuidance(data.guidance);
      setVideos(data.videos);
    } catch (error) {
      console.error("Error searching cooking skills:", error);
      setGuidance("Sorry, we couldn't process your search right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ChefHat className="h-6 w-6 text-primary" />
            Cooking Basics Guide
          </CardTitle>
          <CardDescription className="text-base">
            Learn essential cooking skills and kitchen safety with step-by-step guides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COOKING_BASICS.map((topic, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    setSearchQuery(topic.title);
                    handleSearch();
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {topic.icon && <topic.icon className="h-5 w-5 text-primary" />}
                      {topic.title}
                    </CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
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

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : guidance ? (
        <Card>
          <CardHeader>
            <CardTitle>Cooking Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-slate max-w-none">
                {guidance.split('\n').map((line, idx) => (
                  <p key={idx} className="mb-2">{line}</p>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}
      {videos && <VideoSection videos={videos} />}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            AI Cooking Assistant
          </CardTitle>
          <CardDescription>
            Get personalized help with cooking questions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChatInterface category="cooking" />
        </CardContent>
      </Card>
    </div>
  );
}