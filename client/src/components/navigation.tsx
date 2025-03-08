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
  GraduationCap,
  DollarSign,
  Briefcase,
  Heart,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useContext, useState } from "react";
import { SidebarContext } from "@/App";

const defaultNavItems = [
  { href: "/why-fundamenta", label: "Why Fundamenta", icon: HeartHandshake },
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
  const { isMinimized, setIsMinimized } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle clicked, current state:', isMinimized);
    setIsMinimized(!isMinimized);
  };

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map(({ href, label, icon: Icon }) => (
        <button
          key={href}
          onClick={() => handleNavigation(href)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-[#A3C6C4] hover:text-[#1C3D5A] w-full text-left",
            location === href ? "bg-[#1C3D5A] text-[#D8BFAA]" : ""
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className={cn(
            "transition-all duration-300",
            isMinimized ? "opacity-0 w-0" : "opacity-100"
          )}>
            {label}
          </span>
        </button>
      ))}
    </nav>
  );

  const isHomePage = location === "/";
  const navItems = isHomePage ? defaultNavItems : featureNavItems.filter(item => item.href !== location);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex items-center gap-2 mb-6">
            <HeartHandshake className="h-6 w-6" />
            <span className="text-xl font-bold">Fundamenta</span>
          </div>
          <NavContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#1C3D5A] text-[#D8BFAA] z-50",
        isMinimized ? "w-[80px]" : "w-[256px]"
      )}
    >
      <div className="p-4 pt-16">
        <button 
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 mb-6"
        >
          <HeartHandshake className="h-6 w-6 flex-shrink-0" />
          <span className={cn(
            "text-xl font-bold transition-all duration-300",
            isMinimized ? "opacity-0 w-0" : "opacity-100"
          )}>
            Fundamenta
          </span>
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className="absolute right-2 top-4 z-50 hover:bg-[#A3C6C4] hover:text-[#1C3D5A]"
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <NavContent />
      </div>
    </aside>
  );
}