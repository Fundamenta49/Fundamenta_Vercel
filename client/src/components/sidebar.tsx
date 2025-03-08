import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  HeartHandshake,
  HandshakeIcon,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useContext } from "react";
import { SidebarContext } from "@/App";

// Navigation items matching the image
const navItems = [
  { href: "/why-fundamenta", label: "Why Fundamenta", icon: HeartHandshake },
  { href: "/partner", label: "Partner With Us", icon: HandshakeIcon },
  { href: "/privacy", label: "Privacy Hub", icon: Shield },
  { href: "/invite", label: "Invite Friends", icon: Users },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { isMinimized, setIsMinimized } = useContext(SidebarContext);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#1C3D5A] text-[#D8BFAA]",
        isMinimized ? "w-20" : "w-64",
        "transition-all duration-300 ease-in-out"
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