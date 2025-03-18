import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInterface from "@/components/chat-interface";
import VehicleGuide from "@/components/vehicle-guide";
import HandymanGuide from "@/components/handyman-guide";
import CookingGuide from "@/components/cooking-guide";
import LearningCalendar from "@/components/learning-calendar";
import {
  Brain,
  Car,
  ChefHat,
  Clock,
  ExternalLink,
  Home,
  Loader2,
  Search,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface SkillGuidanceResponse {
  guidance: string;
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

// Utility functions
const formatVideoDuration = (duration: string) => {
  const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "00:00";

  const hours = (match[1] ? parseInt(match[1].replace('H', '')) : 0).toString();
  const minutes = (match[2] ? parseInt(match[2].replace('M', '')) : 0).toString().padStart(2, '0');
  const seconds = (match[3] ? parseInt(match[3].replace('S', '')) : 0).toString().padStart(2, '0');

  return hours !== '0' ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

const formatContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return content.split('\n').map((line, idx) => {
    const parts = line.split(urlRegex);
    return (
      <p key={idx} className="mb-2 leading-relaxed">
        {parts.map((part, partIdx) => {
          if (part.match(urlRegex)) {
            return (
              <Button
                key={partIdx}
                variant="link"
                className="px-0 h-auto font-normal text-primary hover:text-primary/80"
                onClick={() => window.open(part, '_blank')}
              >
                <span className="flex items-center gap-1">
                  {new URL(part).hostname.replace('www.', '')}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </Button>
            );
          }
          return part;
        })}
      </p>
    );
  });
};

// Components
const VideoSection = ({ videos }: { videos: SkillGuidanceResponse['videos'] }) => {
  if (!videos?.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No video tutorials available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
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

// Constants
const LIFE_SKILLS_PROMPTS = [
  {
    title: "Cleaning Schedule Generator",
    description: "Personalized schedule based on apartment/home size",
  },
  {
    title: "How to Load a Dishwasher",
    description: "Efficient loading techniques, optimal cleaning results",
  },
  {
    title: "How to Properly Clean a Kitchen",
    description: "Washing dishes, sanitizing countertops, handling grease",
  },
  {
    title: "How to Clean a Bathroom",
    description: "Disinfecting toilets, tubs, and sinks",
  },
  {
    title: "Dusting & Vacuuming Techniques",
    description: "Avoiding allergies and keeping furniture clean",
  },
  {
    title: "How to Clean Windows, Mirrors & Floors",
    description: "Streak-free techniques",
  },
  {
    title: "Decluttering & Minimalist Living Tips",
    description: "Staying organized in small spaces",
  }
];

const SECTIONS = [
  {
    id: 'chat',
    title: 'AI Learning Coach',
    description: 'Get personalized guidance for your learning journey',
    icon: Brain,
    component: ChatInterface,
    props: { category: "learning" as const }
  },
  {
    id: 'skills',
    title: 'Life Skills',
    description: 'Learn practical skills for everyday life',
    icon: Home,
    component: () => {
      const [searchQuery, setSearchQuery] = useState("");
      const [guidance, setGuidance] = useState<string | null>(null);
      const [videos, setVideos] = useState<SkillGuidanceResponse['videos']>([]);
      const [isLoading, setIsLoading] = useState(false);

      const handlePromptClick = async (prompt: typeof LIFE_SKILLS_PROMPTS[0]) => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/skill-guidance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              skillArea: "life",
              userQuery: prompt.title,
            }),
          });

          const data: SkillGuidanceResponse = await response.json();
          setGuidance(data.guidance);
          setVideos(data.videos);
        } catch (error) {
          console.error("Error getting guidance:", error);
          setGuidance("Sorry, we couldn't load the guidance right now. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="space-y-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for life skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => handlePromptClick({ title: searchQuery, description: "" })} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {LIFE_SKILLS_PROMPTS.map((prompt, index) => (
              <Card
                key={index}
                className="cursor-pointer bg-white hover:bg-gray-50/50 transition-all duration-200"
                onClick={() => handlePromptClick(prompt)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription>{prompt.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {guidance && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Learning Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  {formatContent(guidance)}
                  {videos && <VideoSection videos={videos} />}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }
  },
  {
    id: 'cooking',
    title: 'Cooking Basics',
    description: 'Master essential cooking techniques',
    icon: ChefHat,
    component: CookingGuide
  },
  {
    id: 'vehicle',
    title: 'Vehicle Maintenance',
    description: 'Learn basic car maintenance and care',
    icon: Car,
    component: VehicleGuide
  },
  {
    id: 'handyman',
    title: 'Home Repairs',
    description: 'Essential home maintenance skills',
    icon: Wrench,
    component: HandymanGuide
  },
  {
    id: 'calendar',
    title: 'Schedule',
    description: 'Your learning schedule',
    icon: Clock,
    component: LearningCalendar
  }
];

// Main component
export default function Learning() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Learning & Development</h1>

      <div className="grid gap-6">
        {SECTIONS.map((section) => (
          <Card 
            key={section.id}
            className={cn(
              "transition-all duration-300 ease-in-out cursor-pointer",
              "hover:shadow-md",
              expandedSection === section.id ? "shadow-lg" : "shadow-sm"
            )}
            onClick={() => handleCardClick(section.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <section.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{section.title}</CardTitle>
              </div>
              <CardDescription className="text-lg">
                {section.description}
              </CardDescription>
            </CardHeader>
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                "overflow-hidden",
                expandedSection === section.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <CardContent className="p-6">
                {expandedSection === section.id && (
                  <section.component {...section.props} />
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}