import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatInterface from "@/components/chat-interface";
import VehicleGuide from "@/components/vehicle-guide";
import HandymanGuide from "@/components/handyman-guide";
import CookingGuide from "@/components/cooking-guide";
import LearningCalendar from "@/components/learning-calendar";
import {
  Brain,
  Car,
  ChefHat,
  Clock,
  Home,
  Search,
  Wrench,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  category?: "learning" | "cooking" | "emergency" | "finance" | "career" | "wellness" | "fitness";
}

const LifeSkillsComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/skill-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillArea: "life",
          userQuery: searchQuery,
        }),
      });

      const data = await response.json();
      setGuidance(data.guidance);
    } catch (error) {
      console.error("Error searching:", error);
      setGuidance("Sorry, we couldn't process your search right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch}>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for life skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : guidance ? (
        <div className="prose prose-slate max-w-none">
          <p>{guidance}</p>
        </div>
      ) : null}
    </div>
  );
};

const SECTIONS = [
  {
    id: 'chat',
    title: 'AI Learning Coach',
    description: 'Get personalized guidance for your learning journey',
    icon: Brain,
    component: ChatInterface,
    props: { category: "learning" as const }
  },
  {
    id: 'skills',
    title: 'Life Skills',
    description: 'Learn practical skills for everyday life',
    icon: Home,
    component: LifeSkillsComponent
  },
  {
    id: 'cooking',
    title: 'Cooking Basics',
    description: 'Master essential cooking techniques',
    icon: ChefHat,
    component: CookingGuide
  },
  {
    id: 'vehicle',
    title: 'Vehicle Maintenance',
    description: 'Learn basic car maintenance and care',
    icon: Car,
    component: VehicleGuide
  },
  {
    id: 'handyman',
    title: 'Home Repairs',
    description: 'Essential home maintenance skills',
    icon: Wrench,
    component: HandymanGuide
  },
  {
    id: 'calendar',
    title: 'Schedule',
    description: 'Your learning schedule',
    icon: Clock,
    component: LearningCalendar
  }
];

export default function Learning() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleToggle = (sectionId: string) => {
    setExpandedSection(current => current === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Learning & Development</h1>

      <div className="grid gap-6">
        {SECTIONS.map((section) => (
          <Card 
            key={section.id} 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              expandedSection === section.id ? "shadow-lg" : "shadow-sm hover:shadow-md"
            )}
          >
            <CardHeader 
              className="cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => handleToggle(section.id)}
            >
              <div className="flex items-center gap-3">
                <section.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{section.title}</CardTitle>
              </div>
              <CardDescription className="text-lg">
                {section.description}
              </CardDescription>
            </CardHeader>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                expandedSection === section.id ? "block" : "hidden"
              )}
            >
              <CardContent className="p-6">
                <section.component {...section.props} />
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}