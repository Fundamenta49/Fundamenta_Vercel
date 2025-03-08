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
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

// Default navigation items for home page
const defaultNavItems = [
  { href: "/why-fundamenta", label: "Why Fundamenta", icon: HeartHandshake },
  { href: "/partner", label: "Partner With Us", icon: HandshakeIcon },
  { href: "/privacy", label: "Privacy Hub", icon: Shield },
  { href: "/invite", label: "Invite Friends", icon: Users },
];

// Feature cards navigation items
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

  // Determine if we're on the home page
  const isHomePage = location === "/";

  // Select which navigation items to show based on current location
  const navItems = isHomePage ? defaultNavItems : featureNavItems.filter(item => item.href !== location);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isMinimized ? '5rem' : '16rem'
    );
    // Add a class to the body to help with content positioning
    document.body.classList.toggle('sidebar-minimized', isMinimized);
  }, [isMinimized]);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false); // Close the sheet after navigation
  };

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {/* Home button always visible at the top */}
      <button
        onClick={() => handleNavigation("/")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full text-left text-white",
          location === "/" ? "bg-[#1C3D5A]" : "hover:bg-[#A3C6C4] hover:text-[#1C3D5A]"
        )}
      >
        <Home className="h-5 w-5" />
        {!isMinimized && <span>Home</span>}
      </button>

      <div className="my-2 border-t border-white/20" />

      {navItems.map(({ href, label, icon: Icon }) => (
        <button
          key={href}
          onClick={() => handleNavigation(href)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full text-left text-white",
            location === href
              ? "bg-[#1C3D5A]"
              : "hover:bg-[#A3C6C4] hover:text-[#1C3D5A]"
          )}
        >
          <Icon className="h-5 w-5" />
          {!isMinimized && <span>{label}</span>}
        </button>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#1C3D5A]">
          <button 
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-2 px-4 py-2 mb-4 w-full text-left text-white"
          >
            <HeartHandshake className="h-6 w-6" />
            <span className="text-2xl font-bold">Fundamenta</span>
          </button>
          <NavContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-[#1C3D5A] p-4 transition-all duration-300 z-50",
      isMinimized ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => handleNavigation("/")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full text-left text-white hover:bg-[#A3C6C4] hover:text-[#1C3D5A]",
            location === "/" ? "" : ""
          )}
        >
          <HeartHandshake className="h-6 w-6" />
          {!isMinimized && <h1 className="text-2xl font-bold">Fundamenta</h1>}
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="ml-auto text-white hover:text-[#A3C6C4]"
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <NavContent />
    </div>
  );
}