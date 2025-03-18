import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Home, DollarSign, Calculator, Brain, CreditCard, PiggyBank, Building } from "lucide-react";
import ChatInterface from "@/components/chat-interface";
import BudgetCalculator, { BudgetData } from "@/components/budget-calculator";
import BankLink from "@/components/bank-link";
import RetirementPlanning from "@/components/retirement-planning";
import FinancialDashboard from "@/components/financial-dashboard";
import CreditSkills from "@/components/credit-skills";
import MortgageCalculator from "@/components/mortgage-calculator";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: 'advisor',
    title: 'Financial AI Advisor',
    description: 'Get personalized financial advice and guidance',
    icon: Brain,
    component: () => <ChatInterface category="finance" />,
    alert: (
      <Alert className="mt-4 border-blue-500 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800 text-sm">
          The AI advisor provides general guidance based on publicly available financial information.
          For specific advice, please consult with a qualified financial professional.
        </AlertDescription>
      </Alert>
    )
  },
  {
    id: 'budget',
    title: 'Smart Budget Planner',
    description: 'Track your income, expenses, and set savings goals',
    icon: Calculator,
    component: ({ onBudgetUpdate }: { onBudgetUpdate: (data: BudgetData) => void }) => (
      <BudgetCalculator onBudgetUpdate={onBudgetUpdate} />
    )
  },
  {
    id: 'dashboard',
    title: 'Financial Dashboard',
    description: 'Visualize your financial health and track progress',
    icon: DollarSign,
    component: ({ budgetData }: { budgetData: BudgetData | null }) => (
      <FinancialDashboard budgetData={budgetData} />
    )
  },
  {
    id: 'credit',
    title: 'Credit Building Skills',
    description: 'Learn about credit scores and building good credit',
    icon: CreditCard,
    component: () => <CreditSkills />
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Plan for your future with retirement calculators and guides',
    icon: PiggyBank,
    component: () => <RetirementPlanning />
  },
  {
    id: 'mortgage',
    title: 'Fundamenta Mortgage',
    description: 'Calculate mortgage payments and explore home buying resources',
    icon: Building,
    component: () => <MortgageCalculator />
  },
  {
    id: 'bank',
    title: 'Bank Accounts & Transactions',
    description: 'Connect your bank accounts to track spending in real-time',
    icon: Home,
    component: () => <BankLink />
  }
];

export default function Finance() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCardClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Financial Literacy</h1>

      <Alert variant="default" className="mb-6 border-amber-500 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <AlertDescription className="text-amber-800">
          This app provides general financial information for educational purposes only.
          It is not intended to be financial advice. Please consult a qualified financial
          advisor for guidance specific to your situation.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {SECTIONS.map((section) => (
          <Card 
            key={section.id}
            className={cn(
              "transition-all duration-300 ease-in-out cursor-pointer",
              "hover:shadow-md",
              expandedSection === section.id ? "shadow-lg" : "shadow-sm"
            )}
            onClick={() => handleCardClick(section.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <section.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{section.title}</CardTitle>
              </div>
              <CardDescription className="text-lg">
                {section.description}
              </CardDescription>
              {section.alert}
            </CardHeader>
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                "overflow-hidden",
                expandedSection === section.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <CardContent className="p-6">
                {expandedSection === section.id && (
                  section.id === 'budget' ? (
                    <section.component onBudgetUpdate={setBudgetData} />
                  ) : section.id === 'dashboard' ? (
                    <section.component budgetData={budgetData} />
                  ) : (
                    <section.component />
                  )
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}