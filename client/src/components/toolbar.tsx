import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

const toolbarItems = [
  { href: "/wellness", label: "Wellness & Nutrition", icon: Heart },
];

export default function Toolbar() {
  const [location] = useLocation();

  return (
    <div className="fixed top-0 left-[var(--sidebar-width)] right-0 h-16 border-b bg-background px-4 flex items-center z-40">
      <nav className="flex gap-4">
        {toolbarItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                location === href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          </Link>
        ))}
      </nav>
    </div>
  );
}