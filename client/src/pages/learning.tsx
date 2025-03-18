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
    <div className="space-y-4">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Search for life skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 text-base"
          />
          <Button 
            type="submit" 
            variant="outline"
            className="h-10 text-base sm:w-auto flex items-center justify-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : guidance ? (
        <div className="prose prose-slate max-w-none bg-accent/5 p-4 rounded-lg">
          <p className="text-base leading-relaxed">{guidance}</p>
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
    <div className="w-screen min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Learning & Development
          </h1>

          <div className="grid gap-4">
            {SECTIONS.map((section) => {
              const isExpanded = expandedSection === section.id;
              const Component = section.component;

              return (
                <Card 
                  key={section.id} 
                  className={cn(
                    "overflow-hidden transition-shadow duration-200",
                    isExpanded ? "shadow-md" : "shadow-sm hover:shadow"
                  )}
                >
                  <CardHeader 
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => handleToggle(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl">
                          {section.title}
                        </CardTitle>
                        <CardDescription>
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <div
                    className={cn(
                      "transition-all duration-200 ease-in-out overflow-hidden",
                      isExpanded ? "max-h-[80vh]" : "max-h-0"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="overflow-y-auto">
                        {isExpanded && <Component {...section.props} />}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}