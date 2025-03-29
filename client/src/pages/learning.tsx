import React, { useState, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ChatInterface, { LEARNING_CATEGORY, COOKING_CATEGORY } from "@/components/chat-interface";
import {
  Brain,
  Car,
  ChefHat,
  Clock,
  Home,
  Wrench,
} from "lucide-react";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog";

// Pop-out components
import LearningCoachPopOut from "@/components/learning-coach-pop-out";
import LifeSkillsPopOut from "@/components/life-skills-pop-out";
import CookingGuidePopOut from "@/components/cooking-guide-pop-out";
import VehicleGuidePopOut from "@/components/vehicle-guide-pop-out";
import HandymanGuidePopOut from "@/components/handyman-guide-pop-out";
import LearningCalendarPopOut from "@/components/learning-calendar-pop-out";

// Define section properties
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SECTIONS: SectionType[] = [
  {
    id: 'chat',
    title: 'AI Learning Coach',
    description: 'Get personalized guidance for your learning journey',
    icon: Brain,
  },
  {
    id: 'skills',
    title: 'Life Skills',
    description: 'Learn practical skills for everyday life',
    icon: Home,
  },
  {
    id: 'cooking',
    title: 'Cooking Basics',
    description: 'Master essential cooking techniques',
    icon: ChefHat,
  },
  {
    id: 'vehicle',
    title: 'Vehicle Maintenance',
    description: 'Learn basic car maintenance and care',
    icon: Car,
  },
  {
    id: 'handyman',
    title: 'Home Repairs',
    description: 'Essential home maintenance skills',
    icon: Wrench,
  },
  {
    id: 'calendar',
    title: 'Schedule',
    description: 'Your learning schedule',
    icon: Clock,
  }
];

export default function Learning() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isLearningCoachOpen, setIsLearningCoachOpen] = useState(false);
  const [isLifeSkillsOpen, setIsLifeSkillsOpen] = useState(false);
  const [isCookingOpen, setIsCookingOpen] = useState(false);
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isHandymanOpen, setIsHandymanOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCardClick = (sectionId: string) => {
    // Open the appropriate dialog based on the section clicked
    if (sectionId === 'chat') {
      setIsLearningCoachOpen(true);
    } 
    else if (sectionId === 'skills') {
      setIsLifeSkillsOpen(true);
    }
    else if (sectionId === 'cooking') {
      setIsCookingOpen(true);
    }
    else if (sectionId === 'vehicle') {
      setIsVehicleOpen(true);
    }
    else if (sectionId === 'handyman') {
      setIsHandymanOpen(true);
    }
    else if (sectionId === 'calendar') {
      setIsCalendarOpen(true);
    }
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Learning & Development
      </h1>

      <Alert variant="default" className="mx-4 sm:mx-6 mb-4 border-rose-500 bg-rose-50">
        <AlertCircle className="h-4 w-4 text-rose-500" />
        <AlertDescription className="text-rose-800">
          Choose a learning module below to get started on your journey to acquiring new skills.
        </AlertDescription>
      </Alert>

      {/* Full-screen dialogs */}
      <FullScreenDialog open={isLearningCoachOpen} onOpenChange={setIsLearningCoachOpen}>
        <FullScreenDialogContent themeColor="#f97316">
          <LearningCoachPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isLifeSkillsOpen} onOpenChange={setIsLifeSkillsOpen}>
        <FullScreenDialogContent themeColor="#f97316">
          <LifeSkillsPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isCookingOpen} onOpenChange={setIsCookingOpen}>
        <FullScreenDialogContent themeColor="#f97316">
          <CookingGuidePopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isVehicleOpen} onOpenChange={setIsVehicleOpen}>
        <FullScreenDialogContent themeColor="#f97316">
          <VehicleGuidePopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isHandymanOpen} onOpenChange={setIsHandymanOpen}>
        <FullScreenDialogContent themeColor="#f97316">
          <HandymanGuidePopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <FullScreenDialogContent themeColor="#f97316">
          <LearningCalendarPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Book-style card carousel */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  isExpanded={false}
                  onToggle={handleCardClick}
                  color="text-rose-500" // Learning section color from the home page
                  children={null}
                />
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}