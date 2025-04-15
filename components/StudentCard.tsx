"use client";
import { useState, useEffect } from "react";
import { LibraryBig, Cloud, Sun, CloudRain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function StudentCard() {
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    condition: "sunny",
    description: "Loading weather data...",
  });
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_MAP_API_KEY;
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Bacoor, Cavite&aqi=no`
        );
        const data = await response.json();
        console.log(data);
        // Map weather conditions based on temperature and condition code
        const mapCondition = (temp: number, condition: string) => {
          if (condition.toLowerCase().includes("rain")) return "rainy";
          if (temp >= 30) return "cloudy"; // When temperature is 30°C or higher, show cloudy
          if (
            condition.toLowerCase().includes("clear") ||
            condition.toLowerCase().includes("sunny")
          )
            return "sunny";
          return "cloudy";
        };
        setWeatherData({
          temperature: Math.round(data.current.temp_c),
          condition: mapCondition(
            data.current.temp_c,
            data.current.condition.text
          ),
          description: data.current.condition.text,
        });
      } catch (error) {
        console.log("Error fetching weather data:", error);
      }
    };
    fetchWeather();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-amber-500" />;
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-amber-500" />;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Courses</CardTitle>
          <LibraryBig className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">
            Total Courses in Curiculum
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weather & Time</CardTitle>
          {getWeatherIcon(weatherData.condition)}
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">
                {weatherData.temperature}°C
              </div>
              <p className="text-xs text-muted-foreground">
                {weatherData.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-medium">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { weekday: "long" })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
