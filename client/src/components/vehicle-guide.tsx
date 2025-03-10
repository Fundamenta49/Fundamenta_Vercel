import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Car, Wrench, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  estimatedTime: string;
  icon: React.ReactNode;
}

const COMMON_TASKS: MaintenanceTask[] = [
  {
    id: 'oil-change',
    title: 'How to Change Oil',
    description: 'Regular oil changes to maintain engine health',
    difficulty: 'Easy',
    estimatedTime: '30-45 min',
    icon: <Wrench className="h-4 w-4 text-blue-500" />
  },
  {
    id: 'tire-rotation',
    title: 'How to Properly Plunge a Toilet',
    description: 'Rotate tires for even wear and longer life',
    difficulty: 'Easy',
    estimatedTime: '45-60 min',
    icon: <Car className="h-4 w-4 text-blue-500" />
  },
  {
    id: 'brake-inspection',
    title: 'How to Repair Drywall Holes',
    description: 'Check brake pads, rotors, and fluid levels',
    difficulty: 'Moderate',
    estimatedTime: '60 min',
    icon: <Wrench className="h-4 w-4 text-orange-500" />
  },
  {
    id: 'air-filter',
    title: 'How to Change AC Filter',
    description: 'Replace engine air filter for better performance',
    difficulty: 'Easy',
    estimatedTime: '15-20 min',
    icon: <Wrench className="h-4 w-4 text-blue-500" />
  },
  {
    id: 'battery-check',
    title: 'How to Recaulk Bathtub',
    description: 'Test battery health and clean terminals',
    difficulty: 'Easy',
    estimatedTime: '20 min',
    icon: <Wrench className="h-4 w-4 text-blue-500" />
  }
];

export default function VehicleGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const filteredTasks = COMMON_TASKS.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-[#4D9EAF]" />
            Vehicle Maintenance Guide
          </CardTitle>
          <CardDescription>
            Step-by-step maintenance instructions for your vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Search for any maintenance task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-4"
              />
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              Or choose from common repairs:
            </div>

            <Command className="rounded-lg border shadow-md bg-[#F3F4F6]">
              <CommandInput
                placeholder="Search available tasks..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="bg-[#F3F4F6]"
              />
              <CommandList className="bg-[#F3F4F6]">
                <CommandEmpty>No maintenance tasks found.</CommandEmpty>
                <CommandGroup heading="Common Tasks">
                  {filteredTasks.map((task) => (
                    <CommandItem
                      key={task.id}
                      value={task.id}
                      onSelect={() => setSelectedTask(task.id)}
                      className="flex items-center justify-between py-2 hover:bg-[#4D9EAF]/5"
                    >
                      <div className="flex items-center gap-2">
                        {task.icon}
                        <span>{task.title}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={getDifficultyStyle(task.difficulty)}
                      >
                        {task.difficulty}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}