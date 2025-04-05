// Weather API service
import axios from 'axios';

export interface WeatherData {
  location: string;
  temperature: number; // in Fahrenheit
  condition: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number; // in mph
  forecast: Array<{
    date: string;
    maxTemp: number; // in Fahrenheit
    minTemp: number; // in Fahrenheit
    condition: string;
    icon: string;
  }>;
}

// Default mock data if API is unavailable
const defaultWeather: WeatherData = {
  location: "San Francisco, CA",
  temperature: 64,
  condition: "Partly cloudy",
  icon: "partly-cloudy-day",
  feelsLike: 62,
  humidity: 65,
  windSpeed: 7,
  forecast: [
    { date: "Today", maxTemp: 64, minTemp: 54, condition: "Partly cloudy", icon: "partly-cloudy-day" },
    { date: "Tomorrow", maxTemp: 68, minTemp: 55, condition: "Sunny", icon: "clear-day" },
    { date: "Wed", maxTemp: 66, minTemp: 57, condition: "Cloudy", icon: "cloudy" },
    { date: "Thu", maxTemp: 63, minTemp: 52, condition: "Rain", icon: "rain" },
    { date: "Fri", maxTemp: 61, minTemp: 50, condition: "Showers", icon: "showers-day" },
  ]
};

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

/**
 * Fetches the current weather and forecast for a location
 * @param location The location to fetch weather for (city name, zip code, etc.)
 * @returns Weather data including current conditions and forecast
 */
export async function getWeather(location: string = 'auto:ip'): Promise<WeatherData> {
  try {
    // Check if API key is available
    if (!WEATHER_API_KEY) {
      console.warn('Weather API key not found. Using sample data.');
      return defaultWeather;
    }

    // Fetch weather data
    const response = await axios.get(`${WEATHER_API_URL}/forecast.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: location,
        days: 5,
        aqi: 'no',
        alerts: 'no',
        units: 'imperial' // Use imperial units (Fahrenheit, mph)
      }
    });

    // Transform API response to our format
    const data = response.data;
    
    return {
      location: `${data.location.name}, ${data.location.region}`,
      temperature: data.current.temp_f,
      condition: data.current.condition.text,
      icon: mapWeatherIcon(data.current.condition.code, data.current.is_day),
      feelsLike: data.current.feelslike_f,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_mph,
      forecast: data.forecast.forecastday.map((day: any, index: number) => ({
        date: index === 0 ? 'Today' : 
              index === 1 ? 'Tomorrow' : 
              new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        maxTemp: day.day.maxtemp_f,
        minTemp: day.day.mintemp_f,
        condition: day.day.condition.text,
        icon: mapWeatherIcon(day.day.condition.code, 1)
      }))
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return defaultWeather;
  }
}

/**
 * Maps weather API condition codes to simplified icon names
 * @param code Weather condition code
 * @param isDay Whether it's day (1) or night (0)
 * @returns Simplified icon name
 */
function mapWeatherIcon(code: number, isDay: number): string {
  // Map weather codes to icon names
  // Full mapping would be extensive, this is simplified
  if (code === 1000) return isDay ? 'clear-day' : 'clear-night';
  if (code >= 1003 && code <= 1009) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  if (code >= 1030 && code <= 1135) return 'fog';
  if (code >= 1150 && code <= 1201) return 'rain';
  if (code >= 1204 && code <= 1237) return 'sleet';
  if (code >= 1240 && code <= 1246) return 'showers-day';
  if (code >= 1249 && code <= 1264) return 'sleet';
  if (code >= 1273 && code <= 1282) return 'thunderstorm';
  
  return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
}