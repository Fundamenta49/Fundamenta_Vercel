import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RunningSession {
  startTime: number;
  endTime?: number;
  distance: number; // in miles
  duration: number; // in minutes
  pace: number; // in minutes per mile
  route: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
  }>;
}

// Component to center the map on current position and set appropriate zoom level
function MapUpdater({ center, isTracking }: { center: [number, number], isTracking: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 16); // Higher zoom level (16) for better detail
  }, [map, center]);
  
  // If tracking is active, keep centering the map on current position
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        map.setView(center, 16);
      }, 3000); // Re-center every 3 seconds during active tracking
      
      return () => clearInterval(interval);
    }
  }, [map, center, isTracking]);
  
  return null;
}

function RouteMap({ route, isTracking }: { route: RunningSession["route"], isTracking: boolean }) {
  const mapCenter = route.length > 0 
    ? [route[route.length - 1].latitude, route[route.length - 1].longitude] as [number, number]
    : [51.505, -0.09] as [number, number]; // Default center

  const positions = route.map(point => [point.latitude, point.longitude] as [number, number]);

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={16} // Higher zoom level for better detail
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Only show route line if we have multiple points */}
      {positions.length > 1 && (
        <Polyline 
          positions={positions} 
          color="#2563eb" // More visible blue color
          weight={4} 
          opacity={0.8} 
        />
      )}
      
      {/* Add map updater to keep the view centered on current position */}
      <MapUpdater center={mapCenter} isTracking={isTracking} />
    </MapContainer>
  );
}

export default function RunningTracker() {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<RunningSession | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for saved location permission or prompt the user
    const savedPermission = localStorage.getItem('location_permission');
    if (savedPermission === 'granted') {
      // Verify the permission is still valid
      checkLocationPermission();
    } else {
      // Show a more prominent permission request
      setHasLocationPermission(false);
    }
  }, []);

  const checkLocationPermission = async () => {
    try {
      // First try to actively request location to trigger the browser permission dialog
      if (!localStorage.getItem('location_permission')) {
        try {
          // This will trigger the browser's permission dialog
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });
          
          // If we get here, permission was granted
          localStorage.setItem('location_permission', 'granted');
          setHasLocationPermission(true);
          
          // Store the initial position for future reference
          if (position && position.coords) {
            localStorage.setItem('last_location', 
              JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: position.timestamp
              })
            );
          }
          
          toast({
            title: "Location Access Granted",
            description: "GPS tracking is now enabled for your runs.",
          });
          
          return;
        } catch (posError) {
          // User denied or there was an error
          localStorage.setItem('location_permission', 'denied');
          console.warn('Position access error:', posError);
        }
      }
      
      // Check permission status via the permissions API if available
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setHasLocationPermission(permission.state === 'granted');
      
      // Update localStorage based on current permission state
      localStorage.setItem('location_permission', permission.state === 'granted' ? 'granted' : 'denied');

      if (permission.state === 'prompt') {
        toast({
          title: "Location Permission Required",
          description: "Please enable location services to track your runs.",
        });
      } else if (permission.state === 'denied') {
        toast({
          variant: "destructive",
          title: "Location Access Denied",
          description: "You've denied location access. Please enable it in your device settings to use this feature.",
        });
      }

      // Listen for permission changes
      permission.addEventListener('change', () => {
        const newState = permission.state === 'granted';
        setHasLocationPermission(newState);
        localStorage.setItem('location_permission', newState ? 'granted' : 'denied');
      });
    } catch (error) {
      console.error('Permission check error:', error);
      // Fall back to direct geolocation request if permissions API isn't available
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setHasLocationPermission(true);
            localStorage.setItem('location_permission', 'granted');
            
            // Store the position
            if (position && position.coords) {
              localStorage.setItem('last_location', 
                JSON.stringify({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  timestamp: position.timestamp
                })
              );
            }
          },
          () => {
            setHasLocationPermission(false);
            localStorage.setItem('location_permission', 'denied');
            toast({
              variant: "destructive",
              title: "Location Access Denied",
              description: "You've denied location access. Please enable it in your device settings to use this feature.",
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } catch (geoError) {
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Unable to access location services on this device.",
        });
      }
    }
  };

  const startRun = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "GPS Not Available",
        description: "Your browser doesn't support GPS tracking.",
      });
      return;
    }

    setIsTracking(true);
    setCurrentSession({
      startTime: Date.now(),
      distance: 0,
      duration: 0,
      pace: 0,
      route: [],
    });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentSession((prev) => {
          if (!prev) return prev;

          const newRoute = [
            ...prev.route,
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: position.timestamp,
            },
          ];

          // Calculate new distance in miles
          let distance = prev.distance;
          if (newRoute.length > 1) {
            const lastPoint = newRoute[newRoute.length - 2];
            const newPoint = newRoute[newRoute.length - 1];
            const kmDistance = calculateDistance(
              lastPoint.latitude,
              lastPoint.longitude,
              newPoint.latitude,
              newPoint.longitude
            );
            distance += kmDistance * 0.621371; // Convert km to miles
          }

          const duration = (Date.now() - prev.startTime) / 1000 / 60; // in minutes
          const pace = duration > 0 ? distance > 0 ? duration / distance : 0 : 0; // min/mile

          return {
            ...prev,
            distance,
            duration,
            pace,
            route: newRoute,
          };
        });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "GPS Error",
          description: error.message,
        });
        stopRun();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const stopRun = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setCurrentSession((prev) => 
      prev ? { ...prev, endTime: Date.now() } : null
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => (value * Math.PI) / 180;

  const formatDuration = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            GPS Run Tracker
          </CardTitle>
          <CardDescription>
            Track your runs with real-time GPS monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasLocationPermission ? (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-md">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-center text-orange-800 mb-3">Location Access Required</h3>
                
                <p className="text-center text-orange-700 mb-4">
                  To track your runs and provide accurate distance measurements, we need permission to use your device's GPS.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">How to enable location:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Click the button below to grant permission</li>
                    <li>Select "Allow" when prompted by your browser</li>
                    <li>If previously denied, you may need to update settings in your browser</li>
                    <li>For the best experience, please allow "precise location"</li>
                  </ul>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 shadow-md py-5 px-6 text-lg"
                    onClick={() => {
                      // Attempt to request location permission
                      localStorage.removeItem('location_permission'); // Clear any saved permission status
                      checkLocationPermission(); // This will trigger the permission dialog
                    }}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Enable GPS Location
                  </Button>
                </div>
              </div>
              
              {/* Device settings links section */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-medium text-slate-700 mb-2 text-center">Already denied permission?</h4>
                <p className="text-sm text-slate-600 text-center mb-3">
                  You'll need to enable location in your device settings:
                </p>
                
                <div className="flex justify-center space-x-4">
                  {/* iOS Instructions */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700 mb-1">iOS Devices</p>
                    <a 
                      href="App-prefs:root=Privacy&path=LOCATION"
                      className="text-xs text-blue-600 hover:underline cursor-pointer bg-blue-50 px-3 py-2 rounded-md flex items-center justify-center"
                    >
                      Settings → Safari → Location
                    </a>
                  </div>
                  
                  {/* Android Instructions */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700 mb-1">Android Devices</p>
                    <a 
                      href="intent://settings/location#Intent;scheme=android-app;end"
                      className="text-xs text-blue-600 hover:underline cursor-pointer bg-blue-50 px-3 py-2 rounded-md flex items-center justify-center"
                    >
                      Settings → Apps → Browser → Permissions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {currentSession ? formatDuration(currentSession.duration) : "00:00:00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Distance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {currentSession ? currentSession.distance.toFixed(2) : "0.00"} mi
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Current Pace</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {currentSession ? currentSession.pace.toFixed(2) : "0.00"} min/mi
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="h-[400px] rounded-lg overflow-hidden border relative">
                {currentSession && currentSession.route.length > 0 ? (
                  <>
                    <RouteMap route={currentSession.route} isTracking={isTracking} />
                    
                    {/* Real-time tracking indicator overlay */}
                    {isTracking && (
                      <div className="absolute top-3 right-3 bg-white/90 rounded-md shadow-md px-3 py-2 flex items-center z-[1000] text-sm">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                        <span>Live GPS Tracking</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-slate-50">
                    <MapPin className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-700">GPS Map</h3>
                    <p className="text-sm text-slate-500 max-w-xs">
                      {isTracking 
                        ? "Waiting for GPS signal. Please make sure you're outside with clear sky view."
                        : "Press start to begin tracking your route. Map will appear when GPS data is available."}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                {!isTracking ? (
                  <Button
                    size="lg"
                    onClick={startRun}
                    className="w-32"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={stopRun}
                    className="w-32"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}