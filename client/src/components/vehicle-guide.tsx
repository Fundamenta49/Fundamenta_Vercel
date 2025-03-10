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
import { AlertTriangle, Info, Car, Wrench, Star, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  vin?: string;
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
  // ... other common tasks
];

export default function VehicleGuide() {
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [recalls, setRecalls] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [crashRatings, setCrashRatings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Maintenance Section State
  const [searchQuery, setSearchQuery] = useState("");
  const [customMaintenanceQuery, setCustomMaintenanceQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    year: "",
    make: "",
    model: ""
  });
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(COMMON_TASKS);

  // Filter tasks based on search
  const filteredTasks = maintenanceTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch recall data from NHTSA API
  const fetchRecalls = async () => {
    if (!vin) {
      setError("Please enter a VIN number.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.nhtsa.gov/recalls/recallsByVehicle?vin=${vin}`
      );
      const data = await response.json();
      setRecalls(data.results || []);
    } catch (err) {
      setError("Failed to fetch recall data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Vehicle Details by Make & Year
  const fetchVehicleDetails = async () => {
    if (!make || !year) {
      setError("Please enter both Make and Year.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
      );
      const data = await response.json();
      setVehicleDetails(data.Results || []);
    } catch (err) {
      setError("Failed to fetch vehicle details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Crash Safety Ratings
  const fetchCrashRatings = async () => {
    if (!year || !make || !model) {
      setError("Please enter Year, Make, and Model.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.nhtsa.gov/SafetyRatings/modelyear/${year}/make/${make}/model/${model}`
      );
      const data = await response.json();
      setCrashRatings(data.Results || []);
    } catch (err) {
      setError("Failed to fetch crash ratings.");
    } finally {
      setLoading(false);
    }
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

  const handleVehicleInfoChange = (field: keyof VehicleInfo, value: string) => {
    setVehicleInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Guide Section - Now First */}
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
                value={vehicleInfo.year}
                onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="Vehicle Make"
                value={vehicleInfo.make}
                onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="Vehicle Model"
                value={vehicleInfo.model}
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

            <div className="text-sm text-muted-foreground mb-4">
              Or choose from common repairs:
            </div>

            <Command className="rounded-lg border shadow-md bg-[#F3F4F6]">
              <CommandInput
                placeholder="Search available tasks..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="bg-[#F3F4F6]"
              />
              <CommandList className="bg-[#F3F4F6]">
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

            {selectedTask && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{selectedTask.title}</CardTitle>
                  <CardDescription>{selectedTask.description}</CardDescription>
                  {isVehicleInfoComplete() && (
                    <div className="text-sm text-muted-foreground">
                      For: {getVehicleString()}
                    </div>
                  )}
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

                  {!isVehicleInfoComplete() && (
                    <Alert>
                      <AlertDescription>
                        Enter your vehicle's year, make, and model to see specific video guides
                      </AlertDescription>
                    </Alert>
                  )}

                  {videos.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Video Guides for {getVehicleString()}:</h3>
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

      {/* Safety Recall Lookup Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Safety Lookup</CardTitle>
          <CardDescription>
            Enter your Vehicle Identification Number (VIN) to check for recalls and safety information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter VIN (17 characters)"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full pr-8"
                maxLength={17}
              />
              <Info
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-help"
                title="Vehicle Identification Number - Located on your vehicle registration or driver's side door frame"
              />
            </div>

            <Button
              onClick={fetchRecalls}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Checking..." : "Check Recalls"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {recalls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Recall Results:</h3>
                <ul className="mt-2 space-y-2">
                  {recalls.map((recall, index) => (
                    <li key={index} className="p-3 bg-gray-100 rounded">
                      <strong>{recall.Component}</strong>
                      <p>{recall.Summary}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>Enter the Make and Year to get vehicle details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Vehicle Make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Vehicle Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full"
            />
            <Button onClick={fetchVehicleDetails} disabled={loading} className="w-full">
              {loading ? "Fetching..." : "Get Vehicle Details"}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {vehicleDetails.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Vehicle Models:</h3>
                <ul className="mt-2 space-y-2">
                  {vehicleDetails.map((vehicle, index) => (
                    <li key={index} className="p-3 bg-gray-100 rounded">
                      {vehicle.Model_Name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Crash Ratings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Crash Safety Ratings</CardTitle>
          <CardDescription>Enter Year, Make, and Model to check crash ratings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Vehicle Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Vehicle Make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Vehicle Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full"
            />
            <Button onClick={fetchCrashRatings} disabled={loading} className="w-full">
              {loading ? "Fetching..." : "Check Crash Ratings"}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {crashRatings && crashRatings.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Crash Ratings:</h3>
                <ul className="mt-2 space-y-2">
                  {crashRatings.map((rating, index) => (
                    <li key={index} className="p-3 bg-gray-100 rounded">
                      <strong>{rating.OverallRating}</strong> - {rating.VehicleDescription}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}