import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeather, WeatherData } from '@/services/weather-service';
import { cn } from '@/lib/utils';
import { Cloud, CloudRain, CloudSnow, Sun, Moon, CloudFog, CloudLightning, Wind, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Get weather data
  const { data: weather, isLoading, error } = useQuery({
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
                <p className="font-medium">{Math.round(weather.temperature)}°C</p>
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
            <h3 className="font-medium text-lg">{weather.location}</h3>
            <p className="text-gray-500">{weather.condition}</p>
            
            <div className="mt-2 flex items-center gap-4">
              <p className="text-3xl font-bold">{Math.round(weather.temperature)}°C</p>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  <span>{weather.windSpeed} km/h</span>
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
                    <span className="font-medium">{Math.round(day.maxTemp)}°</span>
                    <span className="text-gray-500">{Math.round(day.minTemp)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}