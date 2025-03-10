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

  // ...rest of the functions from original code...

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

      {/* Vehicle Information Lookup Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information Lookup</CardTitle>
          <CardDescription>
            Enter your Vehicle Identification Number (VIN) to get detailed information and check for recalls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter VIN (17 characters)"
                value={vehicleInfo.vin || ''}
                onChange={(e) => setVehicleInfo({ ...vehicleInfo, vin: e.target.value.toUpperCase() })}
                className="w-full pr-8"
                maxLength={17}
              />
              <Info
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-help"
                title="Vehicle Identification Number - Located on your vehicle registration or driver's side door frame"
              />
            </div>

            <Button
              onClick={fetchVehicleInfo}
              disabled={loading || !vehicleInfo.vin || vehicleInfo.vin.length !== 17}
              className="w-full"
            >
              {loading ? "Fetching Information..." : "Look Up Vehicle Information"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {vehicleDetails && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {vehicleDetails.Make && <p><strong>Make:</strong> {vehicleDetails.Make}</p>}
                    {vehicleDetails.Model && <p><strong>Model:</strong> {vehicleDetails.Model}</p>}
                    {vehicleDetails.ModelYear && <p><strong>Year:</strong> {vehicleDetails.ModelYear}</p>}
                    {vehicleDetails.VehicleType && <p><strong>Type:</strong> {vehicleDetails.VehicleType}</p>}
                    {vehicleDetails.BodyClass && <p><strong>Body Style:</strong> {vehicleDetails.BodyClass}</p>}
                    {vehicleDetails.EngineType && <p><strong>Engine:</strong> {vehicleDetails.EngineType}</p>}
                    {vehicleDetails.FuelTypePrimary && <p><strong>Fuel Type:</strong> {vehicleDetails.FuelTypePrimary}</p>}
                    {vehicleDetails.PlantCountry && <p><strong>Made in:</strong> {vehicleDetails.PlantCountry}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {recalls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-4">Safety Recalls</h3>
                <div className="space-y-4">
                  {recalls.map((recall, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <strong>{recall.Component}</strong>
                          <p>{recall.Summary}</p>
                          <p className="text-red-700">Consequence: {recall.Consequence}</p>
                          <p className="text-green-700">Remedy: {recall.Remedy}</p>
                          {recall.NHTSACampaignNumber && (
                            <p className="text-sm">Campaign #: {recall.NHTSACampaignNumber}</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {vehicleDetails && recalls.length === 0 && (
              <Alert>
                <AlertDescription>
                  No active recalls found for this vehicle.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}