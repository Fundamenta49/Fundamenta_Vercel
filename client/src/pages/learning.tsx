import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInterface from "@/components/chat-interface";
import VehicleGuide from "@/components/vehicle-guide";
import HandymanGuide from "@/components/handyman-guide";
import {
  Book,
  Target,
  Brain,
  Lightbulb,
  Car,
  Wrench,
  Search,
  Home,
  Loader2,
  Clock,
  Video,
  Link2,
  ExternalLink,
  ChefHat
} from "lucide-react";
import LearningCalendar from "@/components/learning-calendar";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CookingGuide from "@/components/cooking-guide";

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

const scheduleFormSchema = z.object({
  spaceType: z.enum(["apartment", "house", "studio"]),
  roomCount: z.enum(["1-2", "3-4", "5+"]),
  occupants: z.enum(["1", "2", "3-4", "5+"]),
  cleaningFrequency: z.enum(["daily", "weekly", "biweekly"]),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

const formatContent = (content: string) => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return content.split('\n').map((line, idx) => {
    // Replace URLs with clickable links
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

const CleaningScheduleGenerator = () => {
  const [schedule, setSchedule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      spaceType: "apartment",
      roomCount: "1-2",
      occupants: "1",
      cleaningFrequency: "weekly",
    },
  });

  const onSubmit = async (values: ScheduleFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "life",
          userQuery: `Create a detailed cleaning schedule for a ${values.spaceType} with ${values.roomCount} rooms and ${values.occupants} occupants. The schedule should be ${values.cleaningFrequency}. Include specific tasks for each area, estimated time required, and recommended cleaning supplies.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate schedule');
      }

      const data = await response.json();
      setSchedule(data.guidance);
    } catch (error) {
      console.error("Error generating schedule:", error);
      setSchedule("Sorry, we couldn't generate your cleaning schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="spaceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Living Space</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select living space type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Rooms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of rooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 rooms</SelectItem>
                    <SelectItem value="3-4">3-4 rooms</SelectItem>
                    <SelectItem value="5+">5+ rooms</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Occupants</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of occupants" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 person</SelectItem>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="3-4">3-4 people</SelectItem>
                    <SelectItem value="5+">5+ people</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cleaningFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Cleaning Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cleaning frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Schedule...
              </>
            ) : (
              'Generate Schedule'
            )}
          </Button>
        </form>
      </Form>

      {schedule && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Personalized Cleaning Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none">
              {formatContent(schedule)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

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

const formatVideoDuration = (duration: string) => {
  // Convert ISO 8601 duration to readable format
  const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "00:00";

  const hours = (match[1] ? parseInt(match[1].replace('H', '')) : 0).toString();
  const minutes = (match[2] ? parseInt(match[2].replace('M', '')) : 0).toString().padStart(2, '0');
  const seconds = (match[3] ? parseInt(match[3].replace('S', '')) : 0).toString().padStart(2, '0');

  return hours !== '0' ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

const VideoSection = ({ videos }: { videos: SkillGuidanceResponse['videos'] }) => {
  console.log("Video section received videos:", videos); // Debug log

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

export default function Learning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [videos, setVideos] = useState<SkillGuidanceResponse['videos']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setDialogOpen(true);
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "life",
          userQuery: searchQuery,
        }),
      });

      const data: SkillGuidanceResponse = await response.json();
      setGuidance(data.guidance);
      setVideos(data.videos);
      setSelectedSkill(searchQuery); // Set the selected skill to the search query
    } catch (error) {
      console.error("Error searching skills:", error);
      setGuidance("Sorry, we couldn't process your search right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = async (prompt: typeof LIFE_SKILLS_PROMPTS[0]) => {
    setSelectedSkill(prompt.title);
    setIsLoading(true);
    setDialogOpen(true);

    if (prompt.title === "Cleaning Schedule Generator") {
      setGuidance(null);
      setVideos([]);
      setIsLoading(false);
      return;
    }

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

  const formatGuidance = (text: string) => {
    if (!text) return [];

    // Split content by emoji headers
    const sections = text.split(/(?=🎯|💡|⏰|🎬|🔗)/g);

    return sections.map(section => {
      const [header, ...content] = section.trim().split('\n');
      return {
        title: header.trim(),
        content: content.join('\n').trim(),
        icon: header.includes('🎯') ? Brain :
              header.includes('💡') ? Lightbulb :
              header.includes('⏰') ? Clock :
              header.includes('🎬') ? Video :
              header.includes('🔗') ? Link2 : Brain
      };
    }).filter(section => section.title && section.content);
  };


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Learning & Development</h1>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-[#2C3E50]">
              <Brain className="h-6 w-6 text-[#4D9EAF]" />
              {selectedSkill || "Life Skills Guide"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedSkill === "Cleaning Schedule Generator" ? (
              <CleaningScheduleGenerator />
            ) : guidance ? (
              <div className="space-y-6">
                {formatGuidance(guidance).map((section, index) => (
                  <Card key={index} className="border-l-4 border-l-primary bg-card hover:bg-accent/5 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {section.icon && <section.icon className="h-5 w-5 text-primary" />}
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-slate max-w-none">
                        {section.title.includes('🎬') ? (
                          <VideoSection videos={videos} />
                        ) : (
                          formatContent(section.content)
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="chat">
        <div className="tabs-container">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">AI Learning Coach</TabsTrigger>
            <TabsTrigger value="skills">Life Skills</TabsTrigger>
            <TabsTrigger value="cooking">Cooking Basics</TabsTrigger>
            <TabsTrigger value="calendar">Schedule</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle Maintenance</TabsTrigger>
            <TabsTrigger value="handyman">Home Repairs</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>Learning AI Coach</CardTitle>
              <CardDescription>
                Get personalized guidance for your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ChatInterface category="learning" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Essential Life Skills
              </CardTitle>
              <CardDescription>
                Learn practical skills for everyday life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for life skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} variant="outline">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cooking">
          <CookingGuide />
        </TabsContent>

        <TabsContent value="calendar">
          <LearningCalendar />
        </TabsContent>

        <TabsContent value="vehicle">
          <VehicleGuide />
        </TabsContent>

        <TabsContent value="handyman">
          <HandymanGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}