import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AlertCircle, DollarSign, Briefcase, Heart, GraduationCap, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import FounderMessageDialog from "@/components/founder-message-dialog";
import { TourGuide, TourButton } from "@/components/home-tour";
import { FundiColorTest } from "@/components/fundi-color-test";

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
  const [founderMessageOpen, setFounderMessageOpen] = useState(false);
  const [, params] = useLocation();
  
  // Listen for custom event to open the founder message dialog
  useEffect(() => {
    // Check URL params first (for compatibility with existing links)
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpenDialog = urlParams.get('openFounderMessage');
    
    if (shouldOpenDialog === 'true') {
      setFounderMessageOpen(true);
      // Clear the parameter from URL to avoid reopening on page refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Listen for the custom event from the tour
    const handleOpenFounderMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.open) {
        setFounderMessageOpen(true);
      }
    };
    
    document.addEventListener('openFounderMessage', handleOpenFounderMessage);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('openFounderMessage', handleOpenFounderMessage);
    };
  }, []);

  return (
    <div className="px-3 py-1 sm:px-4 sm:py-6">
      <div className="text-center mb-4 relative max-w-3xl mx-auto">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight mb-0 sm:mb-2 text-[#1C3D5A] inline-flex items-center justify-center flex-wrap">
          Welcome to Fundamenta
        </h1>
        <p className="text-xs md:text-base text-muted-foreground mb-1 sm:mb-2">
          Your AI-powered assistant for life skills and wellness
        </p>
        
        {/* Tour Button inline with title on mobile */}
        <div className="flex justify-center">
          <TourButton />
        </div>
        
        {/* Tour Guide - will be rendered when tour is active */}
        <TourGuide />
      </div>

      {/* Founder Message Dialog */}
      <FounderMessageDialog
        open={founderMessageOpen}
        onOpenChange={setFounderMessageOpen}
      />
      
      {/* Weather Widget removed */}
      
      {/* Fundi Color Test Component */}
      <div className="max-w-md mx-auto mb-8">
        <FundiColorTest />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-white border border-gray-200 min-h-[82px]"
              data-tour-id={`card-${feature.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
            >
              {/* Mobile Layout (XS to SM screens) */}
              <div className="sm:hidden">
                <div className="flex items-center p-2">
                  <feature.icon className={`h-6 w-6 ${feature.color} flex-shrink-0`} />
                  <CardTitle className="text-[#1C3D5A] text-sm font-bold ml-2">{feature.title}</CardTitle>
                </div>
                <CardContent className="text-center p-1 pb-2">
                  <p className="text-gray-600 text-xs line-clamp-2">{feature.description}</p>
                </CardContent>
              </div>
              
              {/* Desktop Layout (SM screens and up) */}
              <div className="hidden sm:block">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                  <CardTitle className="text-[#1C3D5A] text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-pretty">{feature.description}</p>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}