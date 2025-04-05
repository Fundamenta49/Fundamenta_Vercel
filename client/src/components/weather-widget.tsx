import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeather, WeatherData } from '@/services/weather-service';
import { cn } from '@/lib/utils';
import { Cloud, CloudRain, CloudSnow, Sun, Moon, CloudFog, CloudLightning, Wind, Droplets, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface WeatherWidgetProps {
  location?: string;
  compact?: boolean;
  className?: string;
  showForecast?: boolean;
}

export default function WeatherWidget({ 
  location, 
  compact = false, 
  className,
  showForecast = true
}: WeatherWidgetProps) {
  const [currentLocation, setCurrentLocation] = useState<string>(location || 'auto:ip');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  
  // Use browser's geolocation API to get precise location
  const getGeolocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Convert coordinates to format expected by Weather API: "latitude,longitude"
        const geoLocation = `${position.coords.latitude},${position.coords.longitude}`;
        setCurrentLocation(geoLocation);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location access denied",
          description: "Please enable location access for accurate weather data.",
          variant: "destructive"
        });
        setIsLoadingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };
  
  // Try to get user's precise location on component mount
  useEffect(() => {
    if (!location) { // Only if location wasn't explicitly provided
      getGeolocation();
    }
  }, [location]);

  // Get weather data
  const { data: weather, isLoading, error, refetch } = useQuery({
    queryKey: ['weather', currentLocation],
    queryFn: () => getWeather(currentLocation),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false
  });

  // Select the appropriate weather icon
  const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
    switch (condition) {
      case 'clear-day':
        return <Sun className={className} />;
      case 'clear-night':
        return <Moon className={className} />;
      case 'partly-cloudy-day':
      case 'partly-cloudy-night':
      case 'cloudy':
        return <Cloud className={className} />;
      case 'rain':
      case 'showers-day':
      case 'showers-night':
        return <CloudRain className={className} />;
      case 'thunderstorm':
        return <CloudLightning className={className} />;
      case 'snow':
      case 'sleet':
        return <CloudSnow className={className} />;
      case 'fog':
        return <CloudFog className={className} />;
      default:
        return <Cloud className={className} />;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("bg-red-50", className)}>
        <CardContent className="p-3">
          <p className="text-sm text-red-500">Unable to load weather data</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  // Compact version (for sidebar, etc)
  if (compact) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WeatherIcon condition={weather.icon} className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">{Math.round(weather.temperature)}°F</p>
                <p className="text-xs text-gray-500">{weather.location.split(',')[0]}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{weather.location}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full" 
                onClick={getGeolocation}
                disabled={isLoadingLocation}
                title="Use my current location"
              >
                <MapPin className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-gray-500">{weather.condition}</p>
            
            <div className="mt-2 flex items-center gap-4">
              <p className="text-3xl font-bold">{Math.round(weather.temperature)}°F</p>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  <span>{weather.windSpeed} mph</span>
                </div>
              </div>
            </div>
          </div>
          
          <WeatherIcon condition={weather.icon} className="h-16 w-16 text-blue-500" />
        </div>

        {showForecast && (
          <>
            <div className="h-px bg-gray-100 my-4" />
            
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((day) => (
                <div key={day.date} className="text-center">
                  <p className="text-xs font-medium">{day.date}</p>
                  <WeatherIcon condition={day.icon} className="h-5 w-5 mx-auto my-1 text-blue-400" />
                  <div className="flex justify-center gap-1 text-xs">
                    <span className="font-medium">{Math.round(day.maxTemp)}°F</span>
                    <span className="text-gray-500">{Math.round(day.minTemp)}°F</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="mt-3 text-center text-xs text-gray-400">
          Data from WeatherAPI.com • 
          <Button 
            variant="link" 
            className="h-auto p-0 text-xs text-gray-400" 
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}