import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, DollarSign, Briefcase, Heart, GraduationCap, Activity } from "lucide-react";
import { Link } from "wouter";
import RestartTourButton from "@/components/tour/restart-tour-button";
import WeatherWidget from "@/components/weather-widget";
import { useTour } from "@/contexts/tour-context";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

const features = [
  {
    title: "Life Skills",
    description: "Learn essential skills, personal development, and continuous learning",
    icon: GraduationCap,
    href: "/learning",
    color: "text-orange-500",
  },
  {
    title: "Financial Literacy",
    description: "Learn budgeting, savings, and financial planning",
    icon: DollarSign,
    href: "/finance",
    color: "text-green-500",
  },
  {
    title: "Career Development",
    description: "Build your resume and prepare for interviews",
    icon: Briefcase,
    href: "/career",
    color: "text-blue-500",
  },
  {
    title: "Wellness & Nutrition",
    description: "Access mental health resources, meditation guides, and nutrition advice",
    icon: Heart,
    href: "/wellness",
    color: "text-purple-500",
  },
  {
    title: "Active You",
    description: "Get personalized fitness guidance with AI-powered workout plans",
    icon: Activity,
    href: "/active",
    color: "text-pink-500",
  },
  {
    title: "Emergency Guidance",
    description: "Get instant step-by-step guidance for emergency situations",
    icon: AlertCircle,
    href: "/emergency",
    color: "text-red-500",
  },
];

export default function Home() {
  const { startTour, restartTour } = useTour();
  const { isAuthenticated } = useAuth();

  // For testing purposes, enable admin bypass to simulate authentication
  useEffect(() => {
    // Set admin_bypass for testing to enable the tour automatically
    const enableBypass = () => {
      localStorage.setItem('admin_bypass', 'enabled');
      // Reload the page to apply the authentication
      window.location.reload();
    };

    // Check if there's a query parameter to enable the tour directly
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('startTour') === 'true') {
      startTour();
    }
  }, [startTour]);

  return (
    <div className="px-4 py-8">
      {/* Tour Controls for testing */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-2">
        <Button 
          size="sm" 
          onClick={startTour}
          className="bg-primary text-white"
        >
          Start Tour
        </Button>
        
        <Button 
          size="sm" 
          onClick={restartTour}
          variant="outline"
        >
          Restart Tour
        </Button>
        
        <Button 
          size="sm" 
          onClick={() => {
            localStorage.setItem('admin_bypass', 'enabled');
            window.location.reload();
          }}
          variant="outline"
          className="bg-amber-500 text-white hover:bg-amber-600"
        >
          Enable Admin Mode
        </Button>
      </div>

      <div className="text-center mb-8 relative">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#1C3D5A]">
          Welcome to Fundamenta
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered assistant for life skills and wellness
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {isAuthenticated ? "You are logged in" : "You are not logged in"}
        </p>
        
        {/* Question mark icon for starting the tour */}
        <div className="absolute top-0 right-0">
          <RestartTourButton 
            position="relative" 
            className="bg-white shadow-sm" 
            showLabel={true} 
          />
        </div>
      </div>
      
      {/* Weather Widget - optimized for mobile */}
      <div className="w-full px-2 sm:px-4 md:px-6 max-w-3xl mx-auto mb-8">
        <WeatherWidget showForecast={true} className="shadow-sm" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border border-gray-200">
              <CardHeader>
                <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                <CardTitle className="text-[#1C3D5A] text-balance">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-pretty line-clamp-3 sm:line-clamp-none">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}