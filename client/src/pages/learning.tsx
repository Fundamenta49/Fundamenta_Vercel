import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatInterface, { LEARNING_CATEGORY, COOKING_CATEGORY } from "@/components/chat-interface";
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
  Loader2,
  Wallet,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

type LifeSkillsTabId = "search" | "financial" | "cooking" | "home" | "time" | "communication";

// Complete implementation of Life Skills component with horizontal tabs and search functionality
const LifeSkillsComponent = () => {
  const [activeTab, setActiveTab] = useState<LifeSkillsTabId>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [guidance, setGuidance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tab definitions
  const tabs: Array<{id: LifeSkillsTabId, label: string, icon: React.ComponentType<{className?: string}>}> = [
    { id: "search", label: "Search Skills", icon: Search },
    { id: "financial", label: "Financial", icon: Wallet },
    { id: "cooking", label: "Cooking", icon: ChefHat },
    { id: "home", label: "Home Care", icon: Home },
    { id: "time", label: "Time Management", icon: Clock },
    { id: "communication", label: "Communication", icon: MessageSquare }
  ];

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

  // Tab content components
  const tabContent: Record<LifeSkillsTabId, React.ReactNode> = {
    search: (
      <div className="space-y-4 pt-4">
        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
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
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : guidance ? (
          <div className="prose prose-slate max-w-none bg-white p-4 rounded-lg border-2 border-rose-100">
            <p className="text-base leading-relaxed">{guidance}</p>
          </div>
        ) : null}
      </div>
    ),
    financial: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Financial Literacy Basics</h3>
        <ul className="space-y-2">
          <li>Creating and maintaining a budget</li>
          <li>Understanding credit scores and debt management</li>
          <li>Saving strategies for emergencies and goals</li>
          <li>Basic investment concepts</li>
          <li>Tax planning fundamentals</li>
        </ul>
      </div>
    ),
    cooking: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Essential Cooking Skills</h3>
        <ul className="space-y-2">
          <li>Basic knife techniques and kitchen safety</li>
          <li>Understanding cooking methods (roasting, sautéing, boiling)</li>
          <li>Meal planning and grocery shopping</li>
          <li>Reading and following recipes</li>
          <li>Food storage and leftovers management</li>
        </ul>
      </div>
    ),
    home: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Home Maintenance Skills</h3>
        <ul className="space-y-2">
          <li>Basic plumbing and fixing leaks</li>
          <li>Electrical safety and changing fixtures</li>
          <li>Wall repairs and painting techniques</li>
          <li>Cleaning routines and organization</li>
          <li>Seasonal home maintenance</li>
        </ul>
      </div>
    ),
    time: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Time Management Strategies</h3>
        <ul className="space-y-2">
          <li>Setting priorities and goals</li>
          <li>Creating effective to-do lists</li>
          <li>Avoiding procrastination</li>
          <li>Time blocking techniques</li>
          <li>Work-life balance strategies</li>
        </ul>
      </div>
    ),
    communication: (
      <div className="pt-4 prose prose-slate max-w-none">
        <h3>Communication Skills</h3>
        <ul className="space-y-2">
          <li>Active listening techniques</li>
          <li>Clear and concise speaking</li>
          <li>Managing difficult conversations</li>
          <li>Professional email writing</li>
          <li>Non-verbal communication awareness</li>
        </ul>
      </div>
    ),
  };

  return (
    <div className="w-full">
      {/* Horizontal Tab Bar - scrollable on mobile */}
      <div className="w-full overflow-auto pb-1 no-scrollbar">
        <div className="inline-flex mx-auto border-2 border-rose-100 rounded-md bg-white" style={{width: "80%"}}>
          <div className="flex space-x-1 p-1 w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={cn(
                    "flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium flex-1 min-w-[120px]",
                    "transition-all duration-200 ease-in-out",
                    activeTab === tab.id
                      ? "bg-rose-50 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/20"
                  )}
                  onClick={() => setActiveTab(tab.id as LifeSkillsTabId)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 px-2">
        {tabContent[activeTab as keyof typeof tabContent]}
      </div>
    </div>
  );
};

// Define base section properties
type BaseSectionProps = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Define chat section type
type ChatSectionType = BaseSectionProps & {
  component: typeof ChatInterface;
  props: { category: typeof LEARNING_CATEGORY | typeof COOKING_CATEGORY };
};

// Define non-chat section type
type GenericSectionType = BaseSectionProps & {
  component: React.ComponentType<any>;
  props: Record<string, any>;
};

// Union type for all section types
type SectionType = ChatSectionType | GenericSectionType;

const SECTIONS: SectionType[] = [
  {
    id: 'chat',
    title: 'AI Learning Coach',
    description: 'Get personalized guidance for your learning journey',
    icon: Brain,
    component: ChatInterface,
    props: { category: LEARNING_CATEGORY }
  },
  {
    id: 'skills',
    title: 'Life Skills',
    description: 'Learn practical skills for everyday life',
    icon: Home,
    component: LifeSkillsComponent,
    props: {}
  },
  {
    id: 'cooking',
    title: 'Cooking Basics',
    description: 'Master essential cooking techniques',
    icon: ChefHat,
    component: CookingGuide,
    props: { category: COOKING_CATEGORY }
  },
  {
    id: 'vehicle',
    title: 'Vehicle Maintenance',
    description: 'Learn basic car maintenance and care',
    icon: Car,
    component: VehicleGuide,
    props: {}
  },
  {
    id: 'handyman',
    title: 'Home Repairs',
    description: 'Essential home maintenance skills',
    icon: Wrench,
    component: HandymanGuide,
    props: {}
  },
  {
    id: 'calendar',
    title: 'Schedule',
    description: 'Your learning schedule',
    icon: Clock,
    component: LearningCalendar,
    props: {}
  }
];

export default function Learning() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Handle horizontal scrolling
  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    // Use 100% of width for each card
    const cardWidth = carouselRef.current.offsetWidth; 
    const newPosition = direction === 'left' 
      ? Math.max(scrollPosition - cardWidth, 0)
      : Math.min(scrollPosition + cardWidth, carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    
    carouselRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
    // Also collapse any expanded section when switching cards
    setExpandedSection(null);
  };

  // Toggle a section's expanded state
  const toggleSection = (sectionId: string) => {
    setExpandedSection(current => current === sectionId ? null : sectionId);
  };

  // Function to render the appropriate component based on section type
  const renderContent = (sectionId: string) => {
    if (sectionId === 'chat') {
      return <ChatInterface category={LEARNING_CATEGORY} />;
    } else if (sectionId === 'cooking') {
      return <ChatInterface category={COOKING_CATEGORY} />;
    } else if (sectionId === 'skills') {
      return <LifeSkillsComponent />;
    } else if (sectionId === 'vehicle') {
      return <VehicleGuide />;
    } else if (sectionId === 'handyman') {
      return <HandymanGuide />;
    } else if (sectionId === 'calendar') {
      return <LearningCalendar />;
    }
    return null;
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center pt-2">
        Learning & Development
      </h1>

      {/* Horizontal card carousel using our new components */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            const isExpanded = expandedSection === section.id;
            
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  isExpanded={isExpanded}
                  onToggle={toggleSection}
                >
                  {renderContent(section.id)}
                </BookCard>
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}