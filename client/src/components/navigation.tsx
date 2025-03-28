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
  Sparkles
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

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
  // On homepage, only show default nav items, otherwise show all navigation options
  const navItems = isHomePage 
    ? defaultNavItems.filter(item => item.href !== "/") 
    : [...defaultNavItems.filter(item => item.href !== "/"), ...featureNavItems].filter(item => item.href !== location);

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
  const activeItemBg = "bg-primary";
  const activeItemText = "text-white";
  const hoverBg = "hover:bg-primary/10";
  const logoText = "text-primary-dark";

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="fixed top-4 left-4 z-50 bg-white border-primary/30 text-primary hover:bg-primary/5"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`${navBgColor} border-r border-primary/20 shadow-md`}>
          <div className="flex items-center gap-2 px-2 py-6 mb-6 w-full">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${logoText}`}>Fundamenta</span>
          </div>
          
          <div className="flex flex-col gap-1">
            {/* Use the same navItems logic for mobile as desktop */}
            {navItems.map(({ href, label, icon: Icon }) => (
              <button
                key={href}
                onClick={() => handleNavigation(href)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
                  location === href
                    ? `${activeItemBg} ${activeItemText}`
                    : `${navTextColor} ${hoverBg}`
                )}
              >
                <Icon className={cn("h-5 w-5", location === href ? "text-white" : "text-primary")} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className={cn(
      "fixed left-0 top-0 h-screen border-r border-primary/20 p-4 transition-all duration-300 z-50 shadow-lg",
      navBgColor,
      isMinimized ? "w-16" : "w-64"
    )}>
      <div className="relative mb-8">
        <button 
          onClick={() => handleNavigation("/")}
          className={cn(
            "flex items-center gap-3 px-2 py-4 w-full text-left rounded-md",
            logoText
          )}
        >
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && <span className="text-lg font-bold">Fundamenta</span>}
        </button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-3 -right-2 text-primary hover:text-primary hover:bg-primary/5 bg-white border border-primary/30"
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {/* Use the same navItems logic for desktop navigation */}
        {navItems.map(({ href, label, icon: Icon }) => (
          <button
            key={href}
            onClick={() => handleNavigation(href)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
              location === href
                ? `${activeItemBg} ${activeItemText}`
                : `${navTextColor} ${hoverBg}`
            )}
            title={isMinimized ? label : undefined}
          >
            <Icon className={cn("h-5 w-5", location === href ? "text-white" : "text-primary")} />
            {!isMinimized && <span className="font-medium">{label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}