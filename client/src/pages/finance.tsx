import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Home, DollarSign, Calculator, Brain, CreditCard, PiggyBank, Building } from "lucide-react";
import BudgetCalculator, { BudgetData } from "@/components/budget-calculator";
import BankLink from "@/components/bank-link";
import RetirementPlanning from "@/components/retirement-planning";
import FinancialDashboard from "@/components/financial-dashboard";
import CreditSkills from "@/components/credit-skills";
import MortgageCalculator from "@/components/mortgage-calculator";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";

// No longer needed since we've removed the Finance AI Advisor

// Type definitions for section components
type ComponentWithBudgetUpdate = {
  onBudgetUpdate: (data: BudgetData) => void;
};

type ComponentWithBudgetData = {
  budgetData: BudgetData | null;
};

type Section = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType<any>;
  props?: ComponentWithBudgetUpdate | ComponentWithBudgetData;
  alert?: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: 'budget',
    title: 'Smart Budget Planner',
    description: 'Track your income, expenses, and set savings goals',
    icon: Calculator,
    component: BudgetCalculator,
    props: { onBudgetUpdate: undefined as unknown as (data: BudgetData) => void }
  },
  {
    id: 'dashboard',
    title: 'Financial Dashboard',
    description: 'Visualize your financial health and track progress',
    icon: DollarSign,
    component: FinancialDashboard,
    props: { budgetData: null as BudgetData | null }
  },
  {
    id: 'credit',
    title: 'Credit Building Skills',
    description: 'Learn about credit scores and building good credit',
    icon: CreditCard,
    component: CreditSkills
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Plan for your future with retirement calculators and guides',
    icon: PiggyBank,
    component: RetirementPlanning
  },
  {
    id: 'mortgage',
    title: 'Fundamenta Mortgage',
    description: 'Calculate mortgage payments and explore home buying resources',
    icon: Building,
    component: MortgageCalculator
  },
  {
    id: 'bank',
    title: 'Bank Accounts & Transactions',
    description: 'Connect your bank accounts to track spending in real-time',
    icon: Home,
    component: BankLink
  }
];

export default function Finance() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-6">
        Financial Literacy
      </h1>

      <Alert variant="default" className="mx-4 sm:mx-6 mb-4 border-amber-500 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <AlertDescription className="text-amber-800">
          This app provides general financial information for educational purposes only.
          It is not intended to be financial advice. Please consult a qualified financial
          advisor for guidance specific to your situation.
        </AlertDescription>
      </Alert>

      {/* Book-style card carousel */}
      <div ref={carouselRef} className="book-carousel">
        <BookCarousel>
          {SECTIONS.map((section) => {
            // Update props for special cases
            if (section.id === 'budget') {
              section.props = { onBudgetUpdate: setBudgetData };
            } else if (section.id === 'dashboard') {
              section.props = { budgetData };
            }
            
            const isExpanded = expandedSection === section.id;
            
            return (
              <BookPage key={section.id} id={section.id}>
                <BookCard
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon as any}
                  isExpanded={isExpanded}
                  onToggle={handleCardClick}
                  color="text-green-500" // Finance section color from the home page
                >
                  <div className="w-full">
                    {section.alert && (
                      <div className="mb-4">{section.alert}</div>
                    )}
                    <section.component {...(section.props || {})} />
                  </div>
                </BookCard>
              </BookPage>
            );
          })}
        </BookCarousel>
      </div>
    </div>
  );
}