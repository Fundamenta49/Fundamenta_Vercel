import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat-interface";
import BudgetCalculator, { BudgetData } from "@/components/budget-calculator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import BankLink from "@/components/bank-link";
import RetirementPlanning from "@/components/retirement-planning";
import FinancialDashboard from "@/components/financial-dashboard";
import { useState } from "react";

export default function Finance() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Financial Literacy</h1>

      <Alert variant="default" className="mb-6 border-amber-500 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        <AlertDescription className="text-amber-800">
          This app provides general financial information for educational purposes only.
          It is not intended to be financial advice. Please consult a qualified financial
          advisor for guidance specific to your situation.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="budget">Budget Calculator</TabsTrigger>
          <TabsTrigger value="retirement">Retirement Planning</TabsTrigger>
          <TabsTrigger value="chat">Financial Advisor</TabsTrigger>
          <TabsTrigger value="bank">Bank Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboard budgetData={budgetData} />
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Smart Budget Planner</CardTitle>
              <CardDescription>
                Track your income, expenses, and set savings goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetCalculator onBudgetUpdate={setBudgetData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirement">
          <RetirementPlanning />
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Financial AI Advisor</CardTitle>
              <CardDescription>
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
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle>Bank Accounts & Transactions</CardTitle>
              <CardDescription>
                Connect your bank accounts to track spending in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BankLink />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}