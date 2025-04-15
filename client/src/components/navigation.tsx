import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import './narrow-sidebar.css';
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
  HelpCircle,
  Trophy,
  Gamepad2,
  Calendar
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
import { Separator } from "@/components/ui/separator";
import NotificationPanel from "@/components/notification-panel";

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
  { href: "/calendar", label: "Smart Calendar", icon: Calendar },
];

export default function Navigation() {
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Add event listener for opening the mobile sidebar from the tour
  useEffect(() => {
    const handleOpenMobileNav = (event: CustomEvent) => {
      if (isMobile) {
        setIsOpen(true);
        console.log('Mobile sidebar opened via custom event');
      }
    };
    
    // Register event listener
    document.addEventListener('openMobileNavigation', handleOpenMobileNav as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('openMobileNavigation', handleOpenMobileNav as EventListener);
    };
  }, [isMobile]);

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
    if (href === '/arcade' && location.includes('/arcade')) return true;
    if (href === '/calendar' && location.includes('/calendar')) return true;
    
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

  // Get theme colors based on current location
  const getThemeColors = () => {
    if (location.includes('/learning') || location.includes('/cooking')) {
      // Orange for Life Skills
      return {
        activeItemBg: "bg-orange-100",
        activeItemText: "text-orange-700",
        hoverBg: "hover:bg-orange-50",
        iconColor: "text-orange-700",
        borderColor: "border-orange-300"
      };
    } else if (location.includes('/finance')) {
      // Green for Financial Literacy
      return {
        activeItemBg: "bg-green-100",
        activeItemText: "text-green-700",
        hoverBg: "hover:bg-green-50",
        iconColor: "text-green-700",
        borderColor: "border-green-300"
      };
    } else if (location.includes('/career')) {
      // Blue for Career Development
      return {
        activeItemBg: "bg-blue-100",
        activeItemText: "text-blue-700",
        hoverBg: "hover:bg-blue-50",
        iconColor: "text-blue-700",
        borderColor: "border-blue-300"
      };
    } else if (location.includes('/wellness')) {
      // Purple for Wellness & Nutrition
      return {
        activeItemBg: "bg-purple-100",
        activeItemText: "text-purple-700",
        hoverBg: "hover:bg-purple-50",
        iconColor: "text-purple-700",
        borderColor: "border-purple-300"
      };
    } else if (location.includes('/active')) {
      // Cyan for Active You
      return {
        activeItemBg: "bg-cyan-100",
        activeItemText: "text-cyan-700",
        hoverBg: "hover:bg-cyan-50",
        iconColor: "text-cyan-700",
        borderColor: "border-cyan-300"
      };
    } else if (location.includes('/emergency')) {
      // Red for Emergency Guidance
      return {
        activeItemBg: "bg-red-100",
        activeItemText: "text-red-700",
        hoverBg: "hover:bg-red-50",
        iconColor: "text-red-700",
        borderColor: "border-red-300"
      };
    } else if (location.includes('/arcade')) {
      // Amber for Arcade
      return {
        activeItemBg: "bg-amber-100",
        activeItemText: "text-amber-700",
        hoverBg: "hover:bg-amber-50",
        iconColor: "text-amber-700",
        borderColor: "border-amber-300"
      };
    } else if (location.includes('/calendar')) {
      // Indigo for Smart Calendar
      return {
        activeItemBg: "bg-indigo-100",
        activeItemText: "text-indigo-700",
        hoverBg: "hover:bg-indigo-50",
        iconColor: "text-indigo-700",
        borderColor: "border-indigo-300"
      };
    }
    
    // Default rose theme
    return {
      activeItemBg: "bg-rose-100",
      activeItemText: "text-rose-700",
      hoverBg: "hover:bg-rose-50",
      iconColor: "text-rose-700",
      borderColor: "border-rose-300"
    };
  };

  // Modern styling with our theme colors
  const themeColors = getThemeColors();
  const navBgColor = "bg-white";
  const navTextColor = "text-gray-700";
  const activeItemBg = themeColors.activeItemBg;
  const activeItemText = themeColors.activeItemText;
  const hoverBg = themeColors.hoverBg;
  const borderColor = themeColors.borderColor;
  const logoText = "text-gray-800";

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "fixed top-4 left-4 z-50 bg-white text-gray-700",
              borderColor,
              hoverBg
            )}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`${navBgColor} border-r ${borderColor} shadow-md w-fit pr-1 max-w-[240px] narrow-sidebar`}>
          <button 
            onClick={() => handleNavigation("/")}
            className={cn(
              "flex items-center gap-2 px-2 py-6 mb-6 w-full rounded-md transition-colors",
              hoverBg
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center",
              location === "/" ? "bg-rose-500" : themeColors.activeItemText.replace('text', 'bg')
            )}>
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
                <Icon className={cn("h-5 w-5", isNavItemActive(href) ? themeColors.iconColor : "text-gray-600")} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
            
            {/* Separator, Calendar and Arcade */}
            <div className="mt-4 mb-2">
              <div className="px-3">
                <Separator className={cn(borderColor)} />
              </div>
              
              {/* Calendar Link (when on home page) */}
              {isHomePage && (
                <div className="mt-2">
                  <button 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
                      isNavItemActive("/calendar")
                        ? `${activeItemBg} ${activeItemText}`
                        : `text-gray-700 hover:bg-gray-50`
                    )}
                    onClick={() => handleNavigation("/calendar")}
                  >
                    <Calendar className={cn("h-5 w-5", isNavItemActive("/calendar") ? themeColors.iconColor : "text-gray-600")} />
                    <span className="font-medium">Smart Calendar</span>
                  </button>
                </div>
              )}
              
              <div className="mt-2">
                <button 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
                    isNavItemActive("/arcade")
                      ? `${activeItemBg} ${activeItemText}`
                      : `text-gray-700 hover:bg-gray-50`
                  )}
                  onClick={() => handleNavigation("/arcade")}
                >
                  <Gamepad2 className={cn("h-5 w-5", isNavItemActive("/arcade") ? themeColors.iconColor : "text-gray-600")} />
                  <span className="font-medium">Arcade</span>
                </button>
              </div>
            </div>
            
            {/* Notification Panel & Help Buttons */}
            <div className="mt-4 mx-2 flex flex-col gap-2">
              <div className="flex justify-center my-2">
                <NotificationPanel />
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
      "fixed left-0 top-0 h-screen border-r p-4 transition-all duration-300 z-50 shadow-lg",
      navBgColor,
      borderColor,
      isMinimized ? "w-16" : "w-64"
    )}>
      <div className="relative mb-8">
        <button 
          onClick={() => handleNavigation("/")}
          className={cn(
            "flex items-center gap-3 px-2 py-4 w-full text-left rounded-md transition-colors",
            logoText,
            hoverBg,
            "cursor-pointer"
          )}
        >
          <div className={cn(
            "h-8 w-8 rounded-md flex items-center justify-center",
            location === "/" ? "bg-rose-500" : themeColors.activeItemText.replace('text', 'bg')
          )}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && <span className="text-lg font-bold">Fundamenta</span>}
        </button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className={cn(
            "absolute top-3 -right-2 text-gray-700 hover:text-gray-800 bg-white border",
            borderColor,
            hoverBg
          )}
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
            <Icon className={cn("h-5 w-5", isNavItemActive(href) ? themeColors.iconColor : "text-gray-600")} />
            {!isMinimized && <span className="font-medium">{label}</span>}
          </button>
        ))}
        
        {/* Separator, Calendar and Arcade */}
        <div className="mt-4 mb-2">
          {!isMinimized && (
            <div className="px-3 py-2">
              <Separator className="h-px bg-gray-200" />
            </div>
          )}
          
          {/* Calendar Link (when on home page) */}
          {isHomePage && (!isMinimized ? (
            <div className="mt-2 mb-2">
              <button 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
                  isNavItemActive("/calendar")
                    ? `${activeItemBg} ${activeItemText}`
                    : `text-gray-700 hover:bg-gray-50`
                )}
                onClick={() => handleNavigation("/calendar")}
                data-tour-id="nav-smart-calendar"
              >
                <Calendar className={cn("h-5 w-5", isNavItemActive("/calendar") ? themeColors.iconColor : "text-gray-600")} />
                <span className="font-medium">Smart Calendar</span>
              </button>
            </div>
          ) : (
            <div className="mt-3 mb-3 flex flex-col items-center">
              <button
                onClick={() => handleNavigation("/calendar")}
                className={cn(
                  "p-2 rounded-md",
                  isNavItemActive("/calendar")
                    ? activeItemBg
                    : "hover:bg-gray-100"
                )}
                title="Smart Calendar"
                data-tour-id="nav-smart-calendar"
              >
                <Calendar className={cn(
                  "h-5 w-5", 
                  isNavItemActive("/calendar") ? themeColors.iconColor : "text-gray-600"
                )} />
              </button>
            </div>
          ))}
          
          {/* Arcade Link */}
          {!isMinimized ? (
            <div className="mt-2">
              <button 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors w-full text-left",
                  isNavItemActive("/arcade")
                    ? `${activeItemBg} ${activeItemText}`
                    : `text-gray-700 hover:bg-gray-50`
                )}
                onClick={() => handleNavigation("/arcade")}
                data-tour-id="nav-arcade"
              >
                <Gamepad2 className={cn("h-5 w-5", isNavItemActive("/arcade") ? themeColors.iconColor : "text-gray-600")} />
                <span className="font-medium">Arcade</span>
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center">
              <button
                onClick={() => handleNavigation("/arcade")}
                className={cn(
                  "p-2 rounded-md",
                  isNavItemActive("/arcade")
                    ? activeItemBg
                    : "hover:bg-gray-100"
                )}
                title="Arcade"
                data-tour-id="nav-arcade"
              >
                <Gamepad2 className={cn(
                  "h-5 w-5", 
                  isNavItemActive("/arcade") ? themeColors.iconColor : "text-gray-600"
                )} />
              </button>
            </div>
          )}
        </div>
        
        {/* Notification Panel & Tour Settings */}
        <div className={cn(
          "mt-auto pt-6", 
          isMinimized 
            ? "absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2" 
            : "mt-auto pt-6 flex flex-col gap-2"
        )}>
          {/* Notification Panel */}
          <div className={cn(!isMinimized && "px-3", "flex justify-center")}>
            <NotificationPanel />
          </div>
          
          {/* Tour Settings */}
          <div>
            <TourSettings />
          </div>
        </div>
      </div>
    </nav>
  );
}