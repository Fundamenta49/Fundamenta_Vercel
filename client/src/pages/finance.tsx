import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Home, DollarSign, Calculator, Brain, CreditCard, PiggyBank, Building, Receipt } from "lucide-react";
import { FINANCE_CATEGORY } from "@/components/chat-interface";
import { BudgetData } from "@/components/budget-calculator";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { BookCard, BookCarousel, BookPage } from "@/components/ui/book-card";
import {
  FullScreenDialog,
  FullScreenDialogContent,
} from "@/components/ui/full-screen-dialog";

// Import pop-out components
import FinanceAdvisorPopOut from "@/components/finance-advisor-pop-out";
import BudgetCalculatorPopOut from "@/components/budget-calculator-pop-out";
import FinancialDashboardPopOut from "@/components/financial-dashboard-pop-out";
import CreditSkillsPopOut from "@/components/credit-skills-pop-out";
import RetirementPlanningPopOut from "@/components/retirement-planning-pop-out";
import MortgageCalculatorPopOut from "@/components/mortgage-calculator-pop-out";
import BankLinkPopOut from "@/components/bank-link-pop-out";
import TaxInformationPopOut from "@/components/tax-information-pop-out";

// Define section properties
type SectionType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SECTIONS: SectionType[] = [
  {
    id: 'budget',
    title: 'Smart Budget Planner',
    description: 'Track your income, expenses, and set savings goals',
    icon: Calculator,
  },
  {
    id: 'dashboard',
    title: 'Financial Dashboard',
    description: 'Visualize your financial health and track progress',
    icon: DollarSign,
  },
  {
    id: 'credit',
    title: 'Credit Building Skills',
    description: 'Learn about credit scores and building good credit',
    icon: CreditCard,
  },
  {
    id: 'tax',
    title: 'Tax Information',
    description: 'State-specific tax guides for personal finance and business',
    icon: Receipt,
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Plan for your future with retirement calculators and guides',
    icon: PiggyBank,
  },
  {
    id: 'mortgage',
    title: 'Fundamenta Mortgage',
    description: 'Calculate mortgage payments and explore home buying resources',
    icon: Building,
  },
  {
    id: 'bank',
    title: 'Bank Accounts & Transactions',
    description: 'Connect your bank accounts to track spending in real-time',
    icon: Home,
  }
];

export default function Finance() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [, setLocation] = useLocation();
  
  // Dialog states
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [isTaxOpen, setIsTaxOpen] = useState(false);
  const [isRetirementOpen, setIsRetirementOpen] = useState(false);
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);

  const handleCardClick = (sectionId: string) => {
    // Open the appropriate dialog based on the section clicked
    if (sectionId === 'advisor') {
      setIsAdvisorOpen(true);
    } 
    else if (sectionId === 'budget') {
      setIsBudgetOpen(true);
    }
    else if (sectionId === 'dashboard') {
      setIsDashboardOpen(true);
    }
    else if (sectionId === 'credit') {
      setIsCreditOpen(true);
    }
    else if (sectionId === 'tax') {
      setIsTaxOpen(true);
    }
    else if (sectionId === 'retirement') {
      setIsRetirementOpen(true);
    }
    else if (sectionId === 'mortgage') {
      // Navigate to the dedicated mortgage page instead of opening a dialog
      setLocation('/finance/mortgage');
    }
    else if (sectionId === 'bank') {
      setIsBankOpen(true);
    }
  };
  
  // Check sessionStorage for sections to open on mount
  useEffect(() => {
    const openSection = sessionStorage.getItem('openSection');
    if (openSection) {
      handleCardClick(openSection);
      // Clear after using
      sessionStorage.removeItem('openSection');
    }
    
    // Listen for AI open section events
    const handleOpenSectionEvent = (event: CustomEvent) => {
      const { route, section } = event.detail;
      // Only handle if this is the current page
      if (route === '/finance') {
        handleCardClick(section);
      }
    };
    
    // Add event listener
    document.addEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('ai:open-section', handleOpenSectionEvent as EventListener);
    };
  }, []);

  return (
    <div className="w-full h-full mx-auto p-0">
      <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
        Financial Literacy
      </h1>

      <Alert variant="default" className="mx-3 sm:mx-5 mb-2 border-amber-500 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-800 text-sm">
          This app provides general financial information for educational purposes only.
          It is not intended to be financial advice. Please consult a qualified financial
          advisor for guidance specific to your situation.
        </AlertDescription>
      </Alert>

      {/* Full-screen dialogs */}

      <FullScreenDialog open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <BudgetCalculatorPopOut onBudgetUpdate={setBudgetData} />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <FinancialDashboardPopOut budgetData={budgetData} />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isCreditOpen} onOpenChange={setIsCreditOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <CreditSkillsPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>
      
      <FullScreenDialog open={isTaxOpen} onOpenChange={setIsTaxOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <TaxInformationPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isRetirementOpen} onOpenChange={setIsRetirementOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <RetirementPlanningPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isMortgageOpen} onOpenChange={setIsMortgageOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <MortgageCalculatorPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      <FullScreenDialog open={isBankOpen} onOpenChange={setIsBankOpen}>
        <FullScreenDialogContent themeColor="#22c55e">
          <BankLinkPopOut />
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* Grid-style cards layout (similar to Learning section) */}
      <div className="px-2">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2 px-2 py-1 bg-green-50 text-green-800 rounded-md border-l-4 border-green-500">
            Financial Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 mt-4" data-tour="finance-grid">
            {SECTIONS.map((section) => (
              <div key={section.id} className="flex flex-col h-full">
                <button
                  onClick={() => handleCardClick(section.id)}
                  className="relative flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-green-500 min-h-[130px] sm:min-h-[160px] w-full h-full"
                  aria-label={`Open ${section.title}`}
                  data-tour={section.id === 'budget' ? 'budget-calculator' : section.id === 'credit' ? 'credit-skills' : `finance-${section.id}`}
                >
                  <div className="flex items-center justify-center h-12 sm:h-14 w-full mb-2">
                    <section.icon className="w-9 h-9 sm:w-10 sm:h-10 text-green-500" />
                  </div>
                  
                  <span className="text-sm sm:text-base font-medium text-center line-clamp-2 w-full">{section.title}</span>
                  
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 text-center hidden sm:block">
                    {section.description.length > 60 
                      ? `${section.description.substring(0, 60)}...` 
                      : section.description}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}