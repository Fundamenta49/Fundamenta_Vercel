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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </div>
            {!compact && (
              <Skeleton className="h-12 w-12 rounded-full hidden sm:block" />
            )}
          </div>
          
          {!compact && showForecast && (
            <>
              <div className="h-px bg-gray-100 my-4" />
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-2">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-8 w-8 rounded-full my-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("bg-red-50", className)}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-500">Unable to load weather data</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
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
              <WeatherIcon condition={weather.icon} className="h-8 w-8 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium">{Math.round(weather.temperature)}°F</p>
                <p className="text-xs text-gray-500 truncate w-full">{weather.location.split(',')[0]}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full hidden sm:flex" 
              onClick={getGeolocation}
              disabled={isLoadingLocation}
              title="Use my current location"
            >
              <MapPin className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        {/* Header with location and refresh button - optimized for mobile */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="max-w-[80%]">
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-lg truncate">{weather.location}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full flex-shrink-0" 
                onClick={getGeolocation}
                disabled={isLoadingLocation}
                title="Use my current location"
              >
                <MapPin className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-gray-500 text-sm md:text-base">{weather.condition}</p>
          </div>
          
          <WeatherIcon condition={weather.icon} className="h-14 w-14 md:h-16 md:w-16 text-blue-500 flex-shrink-0" />
        </div>

        {/* Current weather details - better aligned for different screen sizes */}
        <div className="mt-3 flex flex-wrap items-center gap-3 md:gap-4">
          <p className="text-3xl font-bold">{Math.round(weather.temperature)}°F</p>
          
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
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

        {/* Forecast - responsive grid that adjusts based on screen size */}
        {showForecast && (
          <>
            <div className="h-px bg-gray-100 my-4" />
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {weather.forecast.map((day) => (
                <div key={day.date} className="text-center p-2 bg-gray-50 rounded-md">
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
        
        {/* Footer - attribution and refresh button */}
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