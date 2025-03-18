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

export default function Finance() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

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

      <div className="grid gap-8">
        {/* AI Financial Advisor */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Financial AI Advisor</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Get personalized financial advice and guidance
            </CardDescription>
            <Alert className="mt-4 border-blue-500 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800 text-sm">
                The AI advisor provides general guidance based on publicly available financial information.
                For specific advice, please consult with a qualified financial professional.
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent>
            <ChatInterface category="finance" />
          </CardContent>
        </Card>

        {/* Budget Calculator */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Smart Budget Planner</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Track your income, expenses, and set savings goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetCalculator onBudgetUpdate={setBudgetData} />
          </CardContent>
        </Card>

        {/* Financial Dashboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Financial Dashboard</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Visualize your financial health and track progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialDashboard budgetData={budgetData} />
          </CardContent>
        </Card>

        {/* Credit Skills */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Credit Building Skills</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Learn about credit scores and building good credit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditSkills />
          </CardContent>
        </Card>

        {/* Retirement Planning */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <PiggyBank className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Retirement Planning</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Plan for your future with retirement calculators and guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RetirementPlanning />
          </CardContent>
        </Card>

        {/* Mortgage Calculator */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Fundamenta Mortgage</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Calculate mortgage payments and explore home buying resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MortgageCalculator />
          </CardContent>
        </Card>

        {/* Bank Account Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Home className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Bank Accounts & Transactions</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Connect your bank accounts to track spending in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BankLink />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}