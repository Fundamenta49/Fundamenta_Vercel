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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Car, Wrench, Search, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  estimatedTime: string;
  steps: string[];
  tools: string[];
  icon: React.ReactNode;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

const COMMON_TASKS: MaintenanceTask[] = [
  {
    id: 'oil-change',
    title: 'Oil Change',
    description: 'Regular oil changes are essential for engine health and performance',
    difficulty: 'Easy',
    estimatedTime: '30-45 min',
    steps: [
      'Warm up engine for 5 minutes',
      'Lift vehicle and secure with jack stands',
      'Locate and remove drain plug',
      'Replace oil filter',
      'Add new oil to proper level',
      'Check for leaks'
    ],
    tools: [
      'Oil filter wrench',
      'Socket set',
      'Oil pan',
      'New oil filter',
      'Fresh oil'
    ],
    icon: <Wrench className="h-4 w-4 text-blue-500" />
  },
  {
    id: 'tire-rotation',
    title: 'Tire Rotation',
    description: 'Rotate tires regularly for even wear and extended life',
    difficulty: 'Easy',
    estimatedTime: '45-60 min',
    steps: [
      'Loosen lug nuts while car is on ground',
      'Lift vehicle and secure with jack stands',
      'Remove wheels',
      'Rotate according to pattern',
      'Torque lug nuts to spec'
    ],
    tools: [
      'Car jack',
      'Jack stands',
      'Lug wrench',
      'Torque wrench'
    ],
    icon: <Car className="h-4 w-4 text-blue-500" />
  },
  {
    id: 'brake-inspection',
    title: 'Brake Inspection',
    description: 'Regular brake inspections ensure safety and optimal performance',
    difficulty: 'Moderate',
    estimatedTime: '60 min',
    steps: [
      'Remove wheels',
      'Inspect brake pads thickness',
      'Check rotors for wear',
      'Inspect brake lines',
      'Test brake fluid condition'
    ],
    tools: [
      'Jack and stands',
      'Brake gauge',
      'Socket set',
      'Flashlight'
    ],
    icon: <Wrench className="h-4 w-4 text-orange-500" />
  },
  {
    id: 'air-filter',
    title: 'Air Filter Replacement',
    description: 'Clean air filter ensures optimal engine performance',
    difficulty: 'Easy',
    estimatedTime: '15-20 min',
    steps: [
      'Locate air filter housing',
      'Remove housing cover',
      'Note filter orientation',
      'Replace filter',
      'Secure housing cover'
    ],
    tools: [
      'Screwdriver',
      'New air filter',
      'Work gloves'
    ],
    icon: <Wrench className="h-4 w-4 text-blue-500" />
  },
  {
    id: 'battery-check',
    title: 'Battery Maintenance',
    description: 'Regular battery maintenance prevents starting issues',
    difficulty: 'Easy',
    estimatedTime: '20 min',
    steps: [
      'Clean battery terminals',
      'Check voltage',
      'Inspect for corrosion',
      'Apply terminal protector',
      'Check connections'
    ],
    tools: [
      'Voltmeter',
      'Wire brush',
      'Terminal cleaner',
      'Safety glasses'
    ],
    icon: <Wrench className="h-4 w-4 text-blue-500" />
  }
];

export default function VehicleGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [vehicleModel, setVehicleModel] = useState("");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  const filteredTasks = COMMON_TASKS.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const fetchYouTubeVideos = async (task: MaintenanceTask) => {
    setIsLoadingVideos(true);
    try {
      const query = `${vehicleModel} ${task.title} tutorial`;
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-[#4D9EAF]" />
            Vehicle Maintenance Guide
          </CardTitle>
          <CardDescription>
            Step-by-step maintenance instructions for your vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter your vehicle make and model..."
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Search maintenance tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              Common maintenance tasks:
            </div>

            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:bg-gray-50/50 transition-all duration-200"
                  onClick={() => {
                    setSelectedTask(task);
                    if (vehicleModel) {
                      fetchYouTubeVideos(task);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {task.icon}
                        <div>
                          <h3 className="font-medium text-lg text-[#2C3E50]">{task.title}</h3>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{task.estimatedTime}</span>
                        <Badge variant="outline" className={getDifficultyStyle(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTask && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{selectedTask.title}</CardTitle>
                  <CardDescription>{selectedTask.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Required Tools:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedTask.tools.map((tool, index) => (
                        <li key={index} className="text-sm text-gray-600">{tool}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Steps:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedTask.steps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600">{step}</li>
                      ))}
                    </ol>
                  </div>

                  {!vehicleModel && (
                    <Alert>
                      <AlertDescription>
                        Enter your vehicle make and model to see specific video guides
                      </AlertDescription>
                    </Alert>
                  )}

                  {videos.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Video Guides for {vehicleModel}:</h3>
                      <div className="grid gap-4">
                        {videos.map((video) => (
                          <div key={video.id} className="space-y-2">
                            <iframe
                              src={`https://www.youtube.com/embed/${video.id}`}
                              title={video.title}
                              className="w-full aspect-video rounded-lg"
                              allowFullScreen
                            />
                            <p className="text-sm font-medium">{video.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLoadingVideos && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading video guides...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}