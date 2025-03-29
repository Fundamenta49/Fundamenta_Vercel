import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info, Car, Wrench, Star, Search, Maximize2, Minimize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';


interface VehicleInfo {
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
}

interface VehicleDetails {
  Make?: string;
  Model?: string;
  ModelYear?: string;
  VehicleType?: string;
  PlantCountry?: string;
  BodyClass?: string;
  EngineType?: string;
  FuelTypePrimary?: string;
}

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced' | 'Variable';
  estimatedTime: string;
  steps: string[];
  tools: string[];
  icon: React.ReactNode;
  isCustom?: boolean;
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
  // ... other common tasks
];

import { YouTubeVideo, searchVehicleVideos, getYouTubeEmbedUrl } from '@/lib/youtube-service';

export default function VehicleGuide() {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recalls, setRecalls] = useState<any[]>([]);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customMaintenanceQuery, setCustomMaintenanceQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(COMMON_TASKS);
  const [isVideoFocused, setIsVideoFocused] = useState(false);


  const fetchVehicleInfo = async () => {
    if (!vehicleInfo.vin) {
      setError("Please enter a VIN number.");
      return;
    }

    // Validate VIN format
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vehicleInfo.vin)) {
      setError("Invalid VIN format. VIN must be 17 characters and contain only letters (except I, O, Q) and numbers.");
      return;
    }

    setLoading(true);
    setError(null);
    setVehicleDetails(null);
    setRecalls([]);

    try {
      // Step 1: VIN Decode
      const vinUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${encodeURIComponent(vehicleInfo.vin)}?format=json`;
      console.log('Fetching VIN details from:', vinUrl);

      const vinResponse = await fetch(vinUrl);
      console.log('VIN Response status:', vinResponse.status);

      if (!vinResponse.ok) {
        throw new Error(`VIN lookup failed: ${vinResponse.status}`);
      }

      const vinData = await vinResponse.json();
      console.log('VIN Data:', vinData);

      if (!vinData.Results || !Array.isArray(vinData.Results)) {
        throw new Error('Invalid response format from VIN lookup');
      }

      // Extract vehicle details
      const details: VehicleDetails = {};
      vinData.Results.forEach((item: any) => {
        if (item.Value && item.Value !== "null" && item.Value !== "Not Applicable") {
          switch (item.Variable) {
            case "Make":
              details.Make = item.Value;
              break;
            case "Model":
              details.Model = item.Value;
              break;
            case "Model Year":
              details.ModelYear = item.Value;
              break;
            case "Body Class":
              details.BodyClass = item.Value;
              break;
            case "Plant Country":
              details.PlantCountry = item.Value;
              break;
            case "Engine Type":
              details.EngineType = item.Value;
              break;
            case "Fuel Type - Primary":
              details.FuelTypePrimary = item.Value;
              break;
            case "Vehicle Type":
              details.VehicleType = item.Value;
              break;
          }
        }
      });

      setVehicleDetails(details);

      // Step 2: Recalls with proper error handling
      const recallUrl = `https://api.nhtsa.gov/recalls/recallsByVIN?vin=${encodeURIComponent(vehicleInfo.vin)}`;
      console.log('Fetching recalls from:', recallUrl);

      const recallResponse = await fetch(recallUrl);
      console.log('Recall Response status:', recallResponse.status);

      if (!recallResponse.ok) {
        throw new Error(`Recall lookup failed: ${recallResponse.status}`);
      }

      const recallData = await recallResponse.json();
      console.log('Recall Data:', recallData);

      if (recallData.results) {
        setRecalls(recallData.results);
      } else {
        setRecalls([]);
      }

    } catch (error) {
      console.error('Error details:', error);
      setError(
        error instanceof Error
          ? `Error: ${error.message}`
          : 'Failed to fetch vehicle information. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search
  const filteredTasks = maintenanceTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    if (customMaintenanceQuery.trim() && isVehicleInfoComplete()) {
      const searchTask: MaintenanceTask = {
        id: `search-${Date.now()}`,
        title: customMaintenanceQuery,
        description: "Custom maintenance task",
        difficulty: 'Variable',
        estimatedTime: 'Variable',
        steps: ["Search YouTube for detailed instructions"],
        tools: ["As shown in video guides"],
        icon: <Wrench className="h-4 w-4 text-blue-500" />
      };

      setSelectedTask(searchTask);
      fetchYouTubeVideos(searchTask);
    }
  };

  const addCustomTask = () => {
    if (customMaintenanceQuery.trim() && isVehicleInfoComplete()) {
      const newTask: MaintenanceTask = {
        id: `custom-${Date.now()}`,
        title: customMaintenanceQuery,
        description: "Custom saved maintenance task",
        difficulty: 'Variable',
        estimatedTime: 'Variable',
        steps: ["Search YouTube for detailed instructions"],
        tools: ["As shown in video guides"],
        icon: <Star className="h-4 w-4 text-yellow-500" />,
        isCustom: true
      };

      setMaintenanceTasks(prev => [...prev, newTask]);
      setSelectedTask(newTask);
      fetchYouTubeVideos(newTask);
      setCustomMaintenanceQuery("");
    }
  };

  const isVehicleInfoComplete = () => {
    return vehicleInfo.year && vehicleInfo.make && vehicleInfo.model;
  };

  const getVehicleString = () => {
    return `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`.trim();
  };

  const fetchYouTubeVideos = async (task: MaintenanceTask) => {
    if (!isVehicleInfoComplete()) return;

    setIsLoadingVideos(true);
    try {
      const vehicleString = getVehicleString();
      const query = `${vehicleString} ${task.title} tutorial how to`;
      const videoResults = await searchVehicleVideos(query);
      setVideos(videoResults);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleVehicleInfoChange = (field: keyof VehicleInfo, value: string) => {
    setVehicleInfo(prev => ({ ...prev, [field]: value }));
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Variable':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderGuidanceContent = () => {
    if (isLoadingVideos) {
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

    if (!selectedTask) return null;

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
                      src={getYouTubeEmbedUrl(video.id)}
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
            <h3 className="text-lg font-semibold mb-4">{selectedTask.title}</h3>
            <div className="grid gap-4">
              <div>
                <h4 className="font-medium mb-2">Steps:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedTask.steps.map((step, idx) => (
                    <li key={idx} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">Required Tools:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTask.tools.map((tool, idx) => (
                    <li key={idx} className="text-gray-700">{tool}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${isVideoFocused ? 'overflow-hidden h-screen' : ''}`}>
      <div className={`transition-all duration-300 ${isVideoFocused ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        {/* Vehicle Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-[#4D9EAF]" />
              Vehicle Maintenance Guide
            </CardTitle>
            <CardDescription>
              Step-by-step instructions for vehicle maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder="Vehicle Year"
                  value={vehicleInfo.year || ''}
                  onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="Vehicle Make"
                  value={vehicleInfo.make || ''}
                  onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="Vehicle Model"
                  value={vehicleInfo.model || ''}
                  onChange={(e) => handleVehicleInfoChange('model', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Search for any vehicle maintenance task..."
                  value={customMaintenanceQuery}
                  onChange={(e) => setCustomMaintenanceQuery(e.target.value)}
                  className="w-full mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={handleSearch}
                    className="flex-none"
                    disabled={!isVehicleInfoComplete() || !customMaintenanceQuery.trim()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={addCustomTask}
                    disabled={!customMaintenanceQuery.trim() || !isVehicleInfoComplete()}
                    className="flex-none hover:bg-primary/5"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              <Command className="rounded-lg border shadow-md">
                <CommandInput
                  placeholder="Search available tasks..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No maintenance tasks found.</CommandEmpty>
                  <CommandGroup heading="Common Tasks">
                    {filteredTasks.map((task) => (
                      <CommandItem
                        key={task.id}
                        value={task.id}
                        onSelect={() => {
                          setSelectedTask(task);
                          if (isVehicleInfoComplete()) {
                            fetchYouTubeVideos(task);
                          }
                        }}
                        className="flex items-center justify-between py-2 hover:bg-primary/5"
                      >
                        <div className="flex items-center gap-2">
                          {task.isCustom ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            task.icon
                          )}
                          <span>{task.title}</span>
                        </div>
                        <Badge variant="outline" className={getDifficultyStyle(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </CardContent>
        </Card>
      </div>

      {renderGuidanceContent()}
    </div>
  );
}