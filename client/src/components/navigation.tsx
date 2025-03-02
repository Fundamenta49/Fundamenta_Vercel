import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  DollarSign,
  Briefcase,
  Heart,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { href: "/emergency", label: "Emergency", icon: AlertCircle },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/career", label: "Career", icon: Briefcase },
  { href: "/wellness", label: "Wellness", icon: Heart },
];

export default function Navigation() {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const NavContent = () => (
    <nav className="flex flex-col gap-2">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href}>
          <a
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              location === href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </a>
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
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-background p-4">
      <Link href="/">
        <a className="flex items-center gap-2 px-4 py-2 mb-8">
          <h1 className="text-2xl font-bold">Fundamenta</h1>
        </a>
      </Link>
      <NavContent />
    </div>
  );
}