import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeather, WeatherData } from '@/services/weather-service';
import { cn } from '@/lib/utils';
import { Cloud, CloudRain, CloudSnow, Sun, Moon, CloudFog, CloudLightning, Wind, Droplets, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Clear demo mode settings to ensure we use real data with the valid Weather API key
if (typeof window !== 'undefined') {
  localStorage.removeItem('weather_mode');
  localStorage.removeItem('weather_use_demo_on_error');
}

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
        
        // Offer weather by city option in the toast message instead of demo mode
        toast({
          title: "Location access denied",
          description: (
            <div className="space-y-2">
              <p>Please enable location access for accurate weather data.</p>
              <button 
                onClick={() => {
                  // We'll use a real location instead of demo mode since API key is valid
                  const cityOptions = [
                    "Miami, FL", 
                    "San Francisco, CA", 
                    "New York, NY", 
                    "Chicago, IL",
                    "Denver, CO"
                  ];
                  const randomCity = cityOptions[Math.floor(Math.random() * cityOptions.length)];
                  
                  // Set the location
                  setCurrentLocation(randomCity);
                  
                  // Force clear any demo mode settings
                  localStorage.removeItem('weather_mode');
                  localStorage.removeItem('weather_use_demo_on_error');
                  localStorage.setItem('weather_location', randomCity);
                  
                  // Refetch weather data with the city location
                  refetch();
                  
                  toast({
                    title: "Using city location",
                    description: `Weather data for ${randomCity}`,
                  });
                }}
                className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                Use City Weather Instead
              </button>
            </div>
          ),
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
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-[80px]" />
              </div>
            </div>
            {!compact && (
              <Skeleton className="h-10 w-10 rounded-full" />
            )}
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <Skeleton className="h-7 w-12" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          
          {!compact && showForecast && (
            <>
              <div className="h-px bg-gray-100 my-1" />
              <div className="grid grid-cols-5 gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-1">
                    <Skeleton className="h-2.5 w-10 mb-0.5" />
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mx-0.5" />
                      <Skeleton className="h-2.5 w-4 mx-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="flex justify-end mt-1">
            <Skeleton className="h-2.5 w-12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("bg-red-50", className)}>
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-red-500">Unable to load weather</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 text-xs border-red-200 text-red-500 hover:bg-red-50"
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
              <div className="relative">
                <WeatherIcon condition={weather.icon} className="h-8 w-8 text-blue-500 flex-shrink-0" />
                
                {/* We've removed the demo mode badge as we're now using real weather data */}
              </div>
              <div className="min-w-0">
                <p className="font-medium">{Math.round(weather.temperature)}°F</p>
                <p className="text-xs text-gray-500 truncate w-full">{weather.location.split(',')[0]}</p>
              </div>
            </div>
            
            {/* Actions group */}
            <div className="flex items-center gap-1">
              {/* Location button */}
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
              
              {/* City selection button - allow user to pick a predefined city */}
              {navigator.permissions && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hidden sm:flex"
                  onClick={() => {
                    // Use a real location for weather 
                    const cityOptions = ["Miami, FL", "San Francisco, CA", "New York, NY"];
                    const randomCity = cityOptions[Math.floor(Math.random() * cityOptions.length)];
                    
                    // Force clear any demo mode settings
                    localStorage.removeItem('weather_mode');
                    localStorage.removeItem('weather_use_demo_on_error');
                    localStorage.setItem('weather_location', randomCity);
                    
                    // Set city location and refetch
                    setCurrentLocation(randomCity);
                    refetch();
                    
                    toast({
                      title: "Location updated",
                      description: `Showing weather for ${randomCity}`,
                    });
                  }}
                  title="Try a different city"
                >
                  <Cloud className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version (reduced height by 25%)
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-2">
        {/* Header with location and refresh button - optimized for mobile */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <h3 className="font-medium text-base truncate max-w-[170px]">{weather.location}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 rounded-full flex-shrink-0" 
              onClick={getGeolocation}
              disabled={isLoadingLocation}
              title="Use my current location"
            >
              <MapPin className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex flex-col items-end">
            <WeatherIcon condition={weather.icon} className="h-10 w-10 text-blue-500 flex-shrink-0" />
            
            {/* We've removed the demo mode badge as we're now using real weather data */}
          </div>
        </div>

        {/* Current weather details - condensed */}
        <div className="mt-1 flex items-center justify-between">
          <p className="text-2xl font-bold">{Math.round(weather.temperature)}°F</p>
          
          <div className="flex gap-3 text-xs text-gray-600">
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

        {/* Forecast - same data, less vertical space */}
        {showForecast && (
          <>
            <div className="h-px bg-gray-100 my-1" />
            
            <div className="grid grid-cols-5 gap-1">
              {weather.forecast.map((day) => (
                <div key={day.date} className="text-center py-1 px-1 rounded-md">
                  <p className="text-xs font-medium mb-0">{day.date}</p>
                  <div className="flex items-center justify-center">
                    <WeatherIcon condition={day.icon} className="h-4 w-4 mx-1 text-blue-400" />
                    <span className="text-xs">{Math.round(day.maxTemp)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Minimized footer */}
        <div className="mt-1 text-right text-[10px] text-gray-400">
          <Button 
            variant="link" 
            className="h-auto p-0 text-[10px] text-gray-400" 
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}