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

function RouteMap({ route }: { route: RunningSession["route"] }) {
  const mapCenter = route.length > 0 
    ? [route[0].latitude, route[0].longitude] as [number, number]
    : [51.505, -0.09] as [number, number]; // Default center

  const positions = route.map(point => [point.latitude, point.longitude] as [number, number]);

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={13} 
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {positions.length > 1 && (
        <Polyline 
          positions={positions} 
          color="blue" 
          weight={3} 
          opacity={0.7} 
        />
      )}
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
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setHasLocationPermission(permission.state === 'granted');

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
        setHasLocationPermission(permission.state === 'granted');
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Unable to access location services.",
      });
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
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription className="flex flex-col space-y-4">
                  <div className="text-amber-800">
                    <strong>Location permission required:</strong> This feature needs access to your GPS to track your runs.
                  </div>
                  <div className="text-sm text-slate-600">
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Clicking the button below will prompt for location access</li>
                      <li>If previously denied, you'll need to update your browser/device settings</li>
                      <li>For iOS: Settings → Safari → Location (or relevant browser)</li>
                      <li>For Android: Settings → Apps → Browser → Permissions → Location</li>
                    </ul>
                  </div>
                  <Button 
                    className="self-start bg-amber-600 hover:bg-amber-700"
                    onClick={() => {
                      // Attempt to request location permission
                      navigator.geolocation.getCurrentPosition(
                        () => checkLocationPermission(),
                        () => checkLocationPermission(),
                        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                      );
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Enable GPS Location
                  </Button>
                </AlertDescription>
              </Alert>
              
              {/* Deep link to device settings for mobile devices where possible */}
              <div className="text-center">
                <a 
                  href={
                    // iOS deep link - will only work on Safari iOS
                    navigator.userAgent.match(/iPhone|iPad|iPod/i) 
                      ? "App-prefs:root=Privacy&path=LOCATION" 
                      // Android - only works on some devices/browsers
                      : navigator.userAgent.match(/Android/i)
                        ? "intent://settings/location#Intent;scheme=android-app;end"
                        : "#"
                  }
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                  onClick={(e) => {
                    // For devices where deep links don't work, show instructions
                    if (!navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
                      e.preventDefault();
                      toast({
                        title: "Open Settings Manually",
                        description: "Please open your device settings and enable location services for this browser."
                      });
                    }
                  }}
                >
                  Open Device Location Settings
                </a>
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

              {currentSession && currentSession.route.length > 0 && (
                <div className="h-[400px] rounded-lg overflow-hidden border">
                  <RouteMap route={currentSession.route} />
                </div>
              )}

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