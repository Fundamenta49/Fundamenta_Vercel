import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { Car, Wrench, AlertCircle, Check, ChevronsUpDown, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MaintenanceGuide {
  title: string;
  steps: string[];
  tools: string[];
  difficulty: string;
  time: string;
  notes: string;
  isCustom?: boolean;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

export default function VehicleGuide() {
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    make: "",
    model: "",
  });
  const [showGuide, setShowGuide] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customMaintenanceQuery, setCustomMaintenanceQuery] = useState("");
  const [maintenanceTasks, setMaintenanceTasks] = useState<Record<string, MaintenanceGuide>>({
    "tire-change": {
      title: "How to Change a Tire",
      steps: [
        "Park on flat ground and engage parking brake",
        "Locate spare tire and tools in your vehicle",
        "Loosen lug nuts before lifting vehicle",
        "Place jack under designated lifting point",
        "Raise vehicle until tire is off ground",
        "Remove lug nuts and tire",
        "Mount spare tire and replace lug nuts",
        "Lower vehicle and tighten lug nuts completely",
      ],
      tools: [
        "Jack",
        "Lug wrench",
        "Spare tire",
        "Wheel wedges",
        "Flashlight",
      ],
      difficulty: "Moderate",
      time: "30-45 minutes",
      notes: "Check your owner's manual for specific jack points and tire pressure requirements",
    },
    "oil-check": {
      title: "How to Check Oil Level",
      steps: [
        "Park on level ground and wait for engine to cool",
        "Locate dipstick (usually marked in yellow/orange)",
        "Remove and wipe dipstick clean",
        "Reinsert dipstick fully",
        "Remove and check oil level",
        "Check oil color for contamination",
        "Reinsert dipstick",
      ],
      tools: [
        "Clean rag or paper towel",
      ],
      difficulty: "Easy",
      time: "5-10 minutes",
      notes: "Check oil when engine is cold for most accurate reading",
    },
    "wipers": {
      title: "How to Replace Windshield Wipers",
      steps: [
        "Measure wiper blade length or check owner's manual",
        "Lift wiper arm away from windshield",
        "Locate wiper blade attachment point",
        "Press release tab and slide old blade off",
        "Attach new blade until it clicks",
        "Repeat for other wiper",
        "Test wipers with washer fluid",
      ],
      tools: [
        "New wiper blades",
        "Owner's manual",
      ],
      difficulty: "Easy",
      time: "15-20 minutes",
      notes: "Replace wipers every 6-12 months or when streaking occurs",
    },
    "air-filter": {
      title: "How to Check/Replace Air Filter",
      steps: [
        "Locate the air filter housing",
        "Open the housing carefully",
        "Remove the old filter",
        "Inspect filter condition",
        "Insert new filter if needed",
        "Close and secure housing",
      ],
      tools: [
        "New air filter (if replacing)",
        "Screwdriver (if needed)",
      ],
      difficulty: "Easy",
      time: "10-15 minutes",
      notes: "Replace air filter every 15,000-30,000 miles or when visibly dirty",
    },
    "battery-check": {
      title: "How to Check Battery Health",
      steps: [
        "Locate the battery",
        "Check for corrosion on terminals",
        "Clean terminals if needed",
        "Check battery age",
        "Test battery voltage",
        "Inspect cables and connections",
      ],
      tools: [
        "Voltmeter",
        "Battery cleaning solution",
        "Wire brush",
        "Safety gloves",
      ],
      difficulty: "Easy",
      time: "15-20 minutes",
      notes: "Most batteries last 3-5 years. Wear protective gear when handling battery",
    }
  });

  const filteredTasks = Object.entries(maintenanceTasks).filter(([id, task]) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.steps.some(step => step.toLowerCase().includes(searchLower)) ||
      task.tools.some(tool => tool.toLowerCase().includes(searchLower))
    );
  });

  const addCustomTask = () => {
    if (customMaintenanceQuery.trim()) {
      const taskId = `custom-${Date.now()}`;
      const newTask: MaintenanceGuide = {
        title: customMaintenanceQuery,
        steps: ["Search YouTube for detailed instructions"],
        tools: ["As shown in video guides"],
        difficulty: "Variable",
        time: "Variable",
        notes: "Custom saved task from search",
        isCustom: true
      };

      setMaintenanceTasks(prev => ({
        ...prev,
        [taskId]: newTask
      }));

      // Fetch videos for the new custom task
      fetchYouTubeVideos(customMaintenanceQuery);
      // Clear the input after saving
      setCustomMaintenanceQuery("");
    }
  };

  const fetchYouTubeVideos = async (searchTerm: string) => {
    setIsLoadingVideos(true);
    try {
      const query = `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} ${searchTerm} how to maintenance guide`;
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setVideos(data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url
      })));
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (selectedTask && showGuide) {
      const taskTitle = maintenanceTasks[selectedTask]?.title || "";
      fetchYouTubeVideos(taskTitle);
    }
  }, [selectedTask, vehicleInfo]);

  const handleSearch = () => {
    setShowGuide(true);
  };

  const handleCustomSearch = () => {
    if (customMaintenanceQuery.trim()) {
      fetchYouTubeVideos(customMaintenanceQuery);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500" />
            Vehicle Maintenance Guide
          </CardTitle>
          <CardDescription>
            Get customized maintenance instructions for your vehicle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Year (e.g., 2020)"
              value={vehicleInfo.year}
              onChange={(e) => setVehicleInfo(prev => ({ ...prev, year: e.target.value }))}
              className="bg-[#F3F4F6] border-wood/20"
            />
            <Input
              placeholder="Make (e.g., Toyota)"
              value={vehicleInfo.make}
              onChange={(e) => setVehicleInfo(prev => ({ ...prev, make: e.target.value }))}
              className="bg-[#F3F4F6] border-wood/20"
            />
            <Input
              placeholder="Model (e.g., Camry)"
              value={vehicleInfo.model}
              onChange={(e) => setVehicleInfo(prev => ({ ...prev, model: e.target.value }))}
              className="bg-[#F3F4F6] border-wood/20"
            />
          </div>

          <Button
            className="w-full"
            variant="wood"
            onClick={handleSearch}
            disabled={!vehicleInfo.year || !vehicleInfo.make || !vehicleInfo.model}
          >
            Find Maintenance Guides
          </Button>

          {showGuide && (
            <div className="space-y-4">
              <Alert className="card-sandstone">
                <Car className="h-4 w-4" />
                <AlertDescription>
                  Showing maintenance guides for: {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Input
                  placeholder="Search for any maintenance task..."
                  value={customMaintenanceQuery}
                  onChange={(e) => setCustomMaintenanceQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomSearch();
                    }
                  }}
                  className="bg-[#F3F4F6] border-wood/20"
                />
                <Button variant="wood" onClick={handleCustomSearch}>
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={addCustomTask}
                  disabled={!customMaintenanceQuery.trim()}
                  className="hover:bg-wood hover:text-[#f4f1de]"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                Or choose from available tasks:
              </div>

              <Command className="rounded-lg border shadow-md bg-[#F3F4F6]">
                <CommandInput
                  placeholder="Search available tasks..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="bg-[#F3F4F6] border-wood/20"
                />
                <CommandList className="bg-[#F3F4F6] border-t border-wood/20">
                  <CommandEmpty>No maintenance tasks found.</CommandEmpty>
                  <CommandGroup heading="Common Tasks">
                    {filteredTasks.map(([id, task]) => (
                      <CommandItem
                        key={id}
                        value={id}
                        onSelect={() => {
                          setSelectedTask(id);
                          setOpen(false);
                        }}
                        className="flex items-center justify-between py-2 hover:bg-wood/5"
                      >
                        <div className="flex items-center gap-2">
                          {task.isCustom ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Wrench className="h-4 w-4" />
                          )}
                          <span>{task.title}</span>
                        </div>
                        <Badge variant="outline">{task.difficulty}</Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>

              {selectedTask && maintenanceTasks[selectedTask] && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-orange-500" />
                      {maintenanceTasks[selectedTask].title}
                    </CardTitle>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Difficulty: {maintenanceTasks[selectedTask].difficulty}</span>
                      <span>Time: {maintenanceTasks[selectedTask].time}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Required Tools:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {maintenanceTasks[selectedTask].tools.map((tool, index) => (
                          <li key={index} className="text-sm text-muted-foreground">{tool}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Steps:</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        {maintenanceTasks[selectedTask].steps.map((step, index) => (
                          <li key={index} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </div>

                    <Alert className="mt-4 bg-orange-50 border-orange-200">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <AlertDescription className="text-orange-800">
                        Note: {maintenanceTasks[selectedTask].notes}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {videos.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Video Guides</CardTitle>
                    <CardDescription>
                      Watch step-by-step maintenance guides for your {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {videos.map((video) => (
                        <div key={video.id} className="space-y-4">
                          <div className="aspect-video w-full">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.id}`}
                              title={video.title}
                              className="w-full h-full rounded-lg"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                          <h3 className="font-medium text-lg">{video.title}</h3>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {isLoadingVideos && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading video guides...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}