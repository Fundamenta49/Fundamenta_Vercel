import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  HeartHandshake,
  HandshakeIcon,
  Shield,
  Users,
  Menu,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Briefcase,
  Heart,
  Activity,
  GraduationCap,
  AlertCircle,
  Home,
  Sparkles,
  HelpCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { TourSettings } from "@/components/tour-settings";

const defaultNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/why-fundamenta", label: "Why Fundamenta", icon: Sparkles },
  { href: "/partner", label: "Partner With Us", icon: HandshakeIcon },
  { href: "/privacy", label: "Privacy Hub", icon: Shield },
  { href: "/invite", label: "Invite Friends", icon: Users },
];

const featureNavItems = [
  { href: "/learning", label: "Life Skills", icon: GraduationCap },
  { href: "/finance", label: "Financial Literacy", icon: DollarSign },
  { href: "/career", label: "Career Development", icon: Briefcase },
  { href: "/wellness", label: "Wellness & Nutrition", icon: Heart },
  { href: "/active", label: "Active You", icon: Activity },
  { href: "/emergency", label: "Emergency Guidance", icon: AlertCircle },
];

export default function Navigation() {
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isHomePage = location === "/" || location === "/home";
  
  // Function to check if a navigation item should be active based on the current location
  const isNavItemActive = (href: string) => {
    // Exact match
    if (location === href) return true;
    
    // Special cases for sub-paths
    if (href === '/learning' && (location.includes('/learning') || location.includes('/cooking'))) return true;
    if (href === '/finance' && location.includes('/finance')) return true;
    if (href === '/career' && location.includes('/career')) return true;
    if (href === '/wellness' && location.includes('/wellness')) return true;
    if (href === '/active' && (location.includes('/active') || location.includes('/fitness'))) return true;
    if (href === '/emergency' && location.includes('/emergency')) return true;
    
    return false;
  };
  
  // On home page, show only default items (Why Fundamenta, Partner, Privacy, Invite)
  // On other pages, show feature items (Life Skills, Financial Literacy, etc.)
  // Always include the current page in navigation items and highlight it
  const displayedNavItems = isHomePage
    ? [...defaultNavItems.filter(item => item.href !== "/")] 
    : [...featureNavItems];

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isMinimized ? '5rem' : '16rem'
    );
    document.body.classList.toggle('sidebar-minimized', isMinimized);
  }, [isMinimized]);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  // Modern styling with our new theme colors
  const navBgColor = "bg-white";
  const navTextColor = "text-gray-700";
  const activeItemBg = "bg-rose-100";
  const activeItemText = "text-rose-700";
  const hoverBg = "hover:bg-rose-50";
  const logoText = "text-gray-800";

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="fixed top-4 left-4 z-50 bg-white border-rose-300 text-gray-700 hover:bg-rose-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`${navBgColor} border-r border-rose-300 shadow-md`}>
          <button 
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-2 px-2 py-6 mb-6 w-full hover:bg-rose-50 rounded-md transition-colors"
          >
            <div className="h-8 w-8 bg-rose-500 rounded-md flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${logoText}`}>Fundamenta</span>
          </button>
          
          <div className="flex flex-col gap-1">
            {/* Display navigation items based on current page */}
            {displayedNavItems.map(({ href, label, icon: Icon }) => (
              <button
                key={href}
                onClick={() => handleNavigation(href)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
                  isNavItemActive(href)
                    ? `${activeItemBg} ${activeItemText}`
                    : `${navTextColor} ${hoverBg}`
                )}
              >
                <Icon className={cn("h-5 w-5", isNavItemActive(href) ? "text-rose-700" : "text-gray-600")} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
            
            {/* Help & Support Button */}
            <div className="mt-4 mx-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </div>
              <TourSettings />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className={cn(
      "fixed left-0 top-0 h-screen border-r border-rose-300 p-4 transition-all duration-300 z-50 shadow-lg",
      navBgColor,
      isMinimized ? "w-16" : "w-64"
    )}>
      <div className="relative mb-8">
        <button 
          onClick={() => handleNavigation("/")}
          className={cn(
            "flex items-center gap-3 px-2 py-4 w-full text-left rounded-md transition-colors",
            logoText,
            "hover:bg-rose-50 cursor-pointer"
          )}
        >
          <div className="h-8 w-8 bg-rose-500 rounded-md flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && <span className="text-lg font-bold">Fundamenta</span>}
        </button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-3 -right-2 text-gray-700 hover:text-gray-800 hover:bg-rose-50 bg-white border border-rose-300"
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {/* Display navigation items based on current page */}
        {displayedNavItems.map(({ href, label, icon: Icon }) => (
          <button
            key={href}
            onClick={() => handleNavigation(href)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
              isNavItemActive(href)
                ? `${activeItemBg} ${activeItemText}`
                : `${navTextColor} ${hoverBg}`
            )}
            title={isMinimized ? label : undefined}
          >
            <Icon className={cn("h-5 w-5", isNavItemActive(href) ? "text-rose-700" : "text-gray-600")} />
            {!isMinimized && <span className="font-medium">{label}</span>}
          </button>
        ))}
        
        {/* Help & Support */}
        <div className={cn("mt-auto pt-6", isMinimized ? "absolute bottom-4 left-0 right-0 flex justify-center" : "mt-auto pt-6")}>
          {!isMinimized && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 px-3">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </div>
          )}
          <TourSettings />
        </div>
      </div>
    </nav>
  );
}