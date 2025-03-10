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
import { Car, Wrench, Star, Search, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  vin?: string; // Make VIN optional
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

interface NHTSAData {
  recalls?: Array<{
    Component: string;
    Summary: string;
    Consequence: string;
    Remedy: string;
    NHTSACampaignNumber: string;
  }>;
  complaints?: Array<{
    Component: string;
    Summary: string;
    FailureMileage: string;
    Crash: string;
    Fire: string;
  }>;
  tsbs?: Array<{
    ItemNumber: string;
    Summary: string;
    ComponentDescription: string;
  }>;
  vehicleDetails?: {
    Make: string;
    Model: string;
    ModelYear: string;
    VehicleType: string;
    VIN?: string;
    PlantCountry?: string;
    BodyClass?: string;
    FuelTypePrimary?: string;
    DriveType?: string;
    ManufacturerName?: string;
  };
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
  const [nhtsaData, setNhtsaData] = useState<NHTSAData | null>(null);
  const [isLoadingNHTSA, setIsLoadingNHTSA] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [vinLookupData, setVinLookupData] = useState<any>(null);

  const filteredTasks = maintenanceTasks.filter(task =>
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

  const validateAndFetchVehicleData = async () => {
    if (!vehicleInfo.vin && !isVehicleInfoComplete()) {
      setValidationError("Please enter either a VIN or complete vehicle information");
      return;
    }

    setIsLoadingNHTSA(true);
    setValidationError(null);

    try {
      if (vehicleInfo.vin) {
        const vin = vehicleInfo.vin.trim();

        if (vin.length !== 17) {
          setValidationError("VIN must be exactly 17 characters long");
          setIsLoadingNHTSA(false);
          return;
        }

        // First, decode VIN
        try {
          const vinResponse = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`
          );

          if (!vinResponse.ok) {
            throw new Error('Failed to fetch VIN information');
          }

          const vinData = await vinResponse.json();

          if (!vinData.Results || vinData.Results.length === 0) {
            throw new Error('Invalid VIN or no data available');
          }

          const vinInfo = vinData.Results[0];

          // Fetch recalls for this VIN
          const recallResponse = await fetch(
            `https://api.nhtsa.gov/recalls/recallsByVIN/${encodeURIComponent(vin)}?format=json`
          );

          if (!recallResponse.ok) {
            throw new Error('Failed to fetch recall information');
          }

          const recallData = await recallResponse.json();

          setNhtsaData({
            recalls: recallData.results || [],
            vehicleDetails: {
              Make: vinInfo.Make,
              Model: vinInfo.Model,
              ModelYear: vinInfo.ModelYear,
              VehicleType: vinInfo.VehicleType,
              VIN: vin,
              PlantCountry: vinInfo.PlantCountry,
              BodyClass: vinInfo.BodyClass,
              FuelTypePrimary: vinInfo.FuelTypePrimary,
              DriveType: vinInfo.DriveType,
              ManufacturerName: vinInfo.Manufacturer
            }
          });

        } catch (error) {
          console.error('VIN lookup error:', error);
          setValidationError(
            "Unable to validate VIN. Please check the VIN and try again. " +
            "If the problem persists, the NHTSA service might be temporarily unavailable."
          );
          setIsLoadingNHTSA(false);
          return;
        }
      } else {
        const normalizedMake = vehicleInfo.make.trim().toLowerCase();
        const normalizedModel = vehicleInfo.model.trim().toLowerCase();
        const year = vehicleInfo.year.trim();

        if (!/^\d{4}$/.test(year) || parseInt(year) < 1950 || parseInt(year) > new Date().getFullYear() + 1) {
          setValidationError("Please enter a valid year between 1950 and " + (new Date().getFullYear() + 1));
          setIsLoadingNHTSA(false);
          return;
        }


        const validationResponse = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(normalizedMake)}?format=json`
        );

        if (!validationResponse.ok) {
          throw new Error(`Vehicle validation failed (${validationResponse.status})`);
        }

        const validationData = await validationResponse.json();

        if (!validationData.Results || validationData.Results.length === 0) {
          setValidationError(`No vehicle data found for make: ${vehicleInfo.make}. Please check your input.`);
          setIsLoadingNHTSA(false);
          return;
        }

        const matchingModels = validationData.Results.filter((model: any) =>
          model.Model_Name.toLowerCase().includes(normalizedModel) ||
          normalizedModel.includes(model.Model_Name.toLowerCase())
        );

        if (matchingModels.length === 0) {
          setValidationError(
            `Could not find model: ${vehicleInfo.model} for make: ${vehicleInfo.make}. ` +
            `Available models: ${validationData.Results.map((m: any) => m.Model_Name).join(', ')}`
          );
          setIsLoadingNHTSA(false);
          return;
        }

        let recallsData;
        try {
          const recallsResponse = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/RecallsByVehicle/${encodeURIComponent(normalizedMake)}/${encodeURIComponent(normalizedModel)}/${year}?format=json`
          );

          if (!recallsResponse.ok) {
            throw new Error('Failed to fetch recall information');
          }

          recallsData = await recallsResponse.json();
        } catch (error) {
          console.error('Recalls fetch error:', error);
          recallsData = { Results: [] };
        }

        let tsData;
        try {
          const tsResponse = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/complaintsByVehicle/${encodeURIComponent(normalizedMake)}/${encodeURIComponent(normalizedModel)}/${year}?format=json`
          );

          if (!tsResponse.ok) {
            throw new Error('Failed to fetch technical service bulletins');
          }

          tsData = await tsResponse.json();
        } catch (error) {
          console.error('TSB fetch error:', error);
          tsData = { Results: [] };
        }

        setNhtsaData({
          recalls: recallsData.Results?.slice(0, 5) || [],
          bulletins: tsData.Results?.slice(0, 5) || [],
          vehicleDetails: {
            Make: vehicleInfo.make,
            Model: vehicleInfo.model,
            ModelYear: year,
            VehicleType: matchingModels[0]?.Vehicle_Type || matchingModels[0]?.Model_Name || 'Unknown',
            ...vinLookupData
          }
        });
      }

    } catch (error) {
      console.error('Error fetching NHTSA data:', error);
      setValidationError(
        "Unable to fetch vehicle information. Please check your internet connection and try again. " +
        "If the problem persists, the NHTSA service might be temporarily unavailable."
      );
    } finally {
      setIsLoadingNHTSA(false);
    }
  };

  const handleVehicleInfoChange = (field: keyof VehicleInfo, value: string) => {
    setVehicleInfo(prev => ({ ...prev, [field]: value }));
    setNhtsaData(null);
    setValidationError(null);
    setVinLookupData(null);
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
            Step-by-step instructions for vehicle maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="relative">
                <Input
                  type="text"
                  placeholder="VIN (Optional)"
                  value={vehicleInfo.vin || ''}
                  onChange={(e) => handleVehicleInfoChange('vin', e.target.value)}
                  className="w-full pr-8"
                  maxLength={17}
                />
                <Info
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-help"
                  title="Vehicle Identification Number - Provides additional vehicle details"
                />
              </div>
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

            {isVehicleInfoComplete() && (
              <Button
                onClick={validateAndFetchVehicleData}
                disabled={isLoadingNHTSA}
                className="w-full"
              >
                Validate Vehicle Information
              </Button>
            )}

            {isLoadingNHTSA && (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Validating vehicle information...</p>
              </div>
            )}

            {validationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {nhtsaData && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle Safety Information</CardTitle>
                  {nhtsaData.vehicleDetails?.VIN && (
                    <CardDescription>
                      VIN: {nhtsaData.vehicleDetails.VIN}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Recalls Section */}
                  {nhtsaData.recalls && nhtsaData.recalls.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-red-600 mb-2">⚠️ Open Safety Recalls</h3>
                      <div className="space-y-4">
                        {nhtsaData.recalls.map((recall, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="space-y-2">
                                <strong>Component: {recall.Component}</strong>
                                <p>{recall.Summary}</p>
                                <p className="text-red-700">Consequence: {recall.Consequence}</p>
                                <p className="text-green-700">Recommended Action: {recall.Remedy}</p>
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

                  {/* Complaints Section */}
                  {nhtsaData.complaints && nhtsaData.complaints.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-orange-600 mb-2">⚠️ Manufacturer Defect Reports</h3>
                      <div className="space-y-4">
                        {nhtsaData.complaints.map((complaint, index) => (
                          <Alert key={index} variant="warning">
                            <AlertDescription>
                              <div className="space-y-2">
                                <strong>Component: {complaint.Component}</strong>
                                <p>{complaint.Summary}</p>
                                <p className="text-sm">
                                  Failure Mileage: {complaint.FailureMileage}
                                  {complaint.Crash === "Yes" && (
                                    <span className="text-red-600 ml-2">• Resulted in crash</span>
                                  )}
                                  {complaint.Fire === "Yes" && (
                                    <span className="text-red-600 ml-2">• Involved fire</span>
                                  )}
                                </p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Service Bulletins */}
                  {nhtsaData.tsbs && nhtsaData.tsbs.length > 0 && (
                    <div>
                      <h3 className="font-medium text-blue-600 mb-2">📋 Technical Service Bulletins</h3>
                      <div className="space-y-4">
                        {nhtsaData.tsbs.map((tsb, index) => (
                          <Alert key={index}>
                            <AlertDescription>
                              <div className="space-y-2">
                                <strong>{tsb.ComponentDescription}</strong>
                                <p>{tsb.Summary}</p>
                                <p className="text-sm">Bulletin #: {tsb.ItemNumber}</p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Basic Vehicle Information */}
                  {nhtsaData.vehicleDetails && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Vehicle Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p>Make: {nhtsaData.vehicleDetails.Make}</p>
                        <p>Model: {nhtsaData.vehicleDetails.Model}</p>
                        <p>Year: {nhtsaData.vehicleDetails.ModelYear}</p>
                        <p>Vehicle Type: {nhtsaData.vehicleDetails.VehicleType}</p>
                        {nhtsaData.vehicleDetails.ManufacturerName && (
                          <p>Manufacturer: {nhtsaData.vehicleDetails.ManufacturerName}</p>
                        )}
                        {nhtsaData.vehicleDetails.PlantCountry && (
                          <p>Manufacturing Country: {nhtsaData.vehicleDetails.PlantCountry}</p>
                        )}
                        {nhtsaData.vehicleDetails.BodyClass && (
                          <p>Body Style: {nhtsaData.vehicleDetails.BodyClass}</p>
                        )}
                        {nhtsaData.vehicleDetails.FuelTypePrimary && (
                          <p>Fuel Type: {nhtsaData.vehicleDetails.FuelTypePrimary}</p>
                        )}
                        {nhtsaData.vehicleDetails.DriveType && (
                          <p>Drive Type: {nhtsaData.vehicleDetails.DriveType}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!isVehicleInfoComplete() && (
              <Alert>
                <AlertDescription>
                  Please enter your vehicle's year, make, and model to see specific maintenance guides and NHTSA data.
                </AlertDescription>
              </Alert>
            )}

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
    </div>
  );
}