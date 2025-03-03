import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  DollarSign,
  Briefcase,
  Heart,
  Menu,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/emergency", label: "Emergency", icon: AlertCircle },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/career", label: "Career", icon: Briefcase },
  { href: "/wellness", label: "Wellness & Nutrition", icon: Heart },
  { href: "/life-skills", label: "Life Skills", icon: GraduationCap },
];

export default function Navigation() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isMinimized ? '5rem' : '16rem'
    );
  }, [isMinimized]);

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}>
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full text-left",
              location === href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <Icon className="h-5 w-5" />
            {!isMinimized && <span>{label}</span>}
          </button>
        </Link>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="fixed top-4 right-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <NavContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen border-r bg-background p-4 transition-all duration-300",
      isMinimized ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-8">
        <Link href="/">
          <button className="flex items-center gap-2 px-4 py-2">
            {!isMinimized && <h1 className="text-2xl font-bold">Fundamenta</h1>}
          </button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(!isMinimized)}
          className="ml-auto"
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