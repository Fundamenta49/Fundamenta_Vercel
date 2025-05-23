import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, DollarSign, Briefcase, Heart, GraduationCap, Activity } from "lucide-react";
import { Link, useLocation } from "wouter";
import RestartTourButton from "@/components/tour/restart-tour-button";
import WeatherWidget from "@/components/weather-widget";
import { useTour } from "@/contexts/tour-context";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import FounderMessageDialog from "@/components/founder-message-dialog";

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
  const { isAuthenticated } = useAuth();
  const { startTour } = useTour();
  const [founderMessageOpen, setFounderMessageOpen] = useState(false);
  const [, params] = useLocation();
  
  // Check for query parameter to open the founder message dialog
  useEffect(() => {
    // Get query params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpenDialog = urlParams.get('openFounderMessage');
    
    if (shouldOpenDialog === 'true') {
      setFounderMessageOpen(true);
      // Clear the parameter from URL to avoid reopening on page refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-8 relative">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#1C3D5A] inline-flex items-center justify-center flex-wrap">
          Welcome to Fundamenta
          <span className="inline-block ml-2 sm:ml-2 -mt-1 sm:-mt-1 relative transform transition-all hover:scale-110" title="Take a tour!">
            <RestartTourButton 
              position="relative" 
              className="scale-[0.85] sm:scale-90" 
              tooltipText="Start Tour Guide" 
            />
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered assistant for life skills and wellness
        </p>
      </div>

      {/* Founder Message Dialog */}
      <FounderMessageDialog
        open={founderMessageOpen}
        onOpenChange={setFounderMessageOpen}
      />
      
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