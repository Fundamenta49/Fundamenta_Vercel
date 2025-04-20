import { 
  Dumbbell, 
  Bird as YogaIcon, 
  Timer, 
  Brain, 
  Flame, 
  Activity, 
  User,
  Home,
  ChevronRight
} from 'lucide-react';
import { useModuleContext } from '../context/module-context';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Define module navigation items
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview of your fitness activities'
  },
  {
    id: 'yoga',
    label: 'Yoga',
    icon: YogaIcon,
    description: 'Improve flexibility and mindfulness through yoga'
  },
  {
    id: 'running',
    label: 'Running',
    icon: Timer,
    description: 'Track your runs and improve your endurance'
  },
  {
    id: 'meditation',
    label: 'Meditation',
    icon: Brain,
    description: 'Find peace and balance with guided meditation'
  },
  {
    id: 'weightlifting',
    label: 'Weight Training',
    icon: Dumbbell,
    description: 'Build strength with personalized workout plans'
  },
  {
    id: 'hiit',
    label: 'HIIT',
    icon: Flame,
    description: 'High-Intensity Interval Training for maximum results'
  },
  {
    id: 'stretch',
    label: 'Stretching',
    icon: Activity,
    description: 'Improve flexibility and recovery with guided stretching'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Manage your fitness profile and preferences'
  }
];

// SidebarItem component for navigation items
function SidebarItem({ 
  id, 
  label, 
  icon: Icon, 
  isActive,
  onClick 
}: { 
  id: string; 
  label: string; 
  icon: any; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 rounded-md cursor-pointer transition-all",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon className={cn(
          "h-5 w-5 mr-3",
          isActive ? "text-primary" : "text-gray-500"
        )} />
        <span className={cn(
          "text-sm font-medium",
          isActive ? "text-primary" : "text-gray-700 dark:text-gray-300"
        )}>
          {label}
        </span>
      </div>
      
      {isActive && (
        <ChevronRight className="h-4 w-4 text-primary" />
      )}
    </div>
  );
}

// Main Sidebar component
export default function Sidebar() {
  const { activeModule, setActiveModule, isSidebarVisible } = useModuleContext();

  // If sidebar is hidden, return null
  if (!isSidebarVisible) {
    return null;
  }

  return (
    <div className="w-64 border-r bg-white dark:bg-gray-800 flex-shrink-0 hidden md:block">
      <ScrollArea className="h-full py-2">
        <div className="px-3 py-2">
          <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Fitness Modules
          </h2>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarItem 
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeModule === item.id}
                onClick={() => setActiveModule(item.id as any)}
              />
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}