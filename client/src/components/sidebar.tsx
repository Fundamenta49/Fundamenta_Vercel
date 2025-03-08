import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  DollarSign,
  Briefcase,
  Heart,
  Activity,
  AlertCircle,
} from "lucide-react";
import { useContext } from "react";
import { SidebarContext } from "@/App";

const navItems = [
  { href: "/learning", label: "Life Skills", icon: GraduationCap },
  { href: "/finance", label: "Financial Literacy", icon: DollarSign },
  { href: "/career", label: "Career Development", icon: Briefcase },
  { href: "/wellness", label: "Wellness & Nutrition", icon: Heart },
  { href: "/active", label: "Active You", icon: Activity },
  { href: "/emergency", label: "Emergency Guidance", icon: AlertCircle },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { isMinimized, setIsMinimized } = useContext(SidebarContext);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#1C3D5A] text-[#D8BFAA] transition-all duration-300",
        isMinimized ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 pt-16">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <HeartHandshake className="h-6 w-6 flex-shrink-0" />
          <span 
            className={cn(
              "text-xl font-bold transition-opacity duration-300",
              isMinimized ? "opacity-0" : "opacity-100"
            )}
          >
            Fundamenta
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute right-2 top-4 p-2 rounded hover:bg-[#A3C6C4] hover:text-[#1C3D5A]"
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-[#A3C6C4] hover:text-[#1C3D5A]",
                location === href ? "bg-[#1C3D5A] text-[#D8BFAA]" : ""
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span 
                className={cn(
                  "transition-opacity duration-300",
                  isMinimized ? "opacity-0" : "opacity-100"
                )}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}