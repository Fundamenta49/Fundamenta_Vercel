import { Calculator, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BudgetCalculator, { BudgetData } from "@/components/budget-calculator";

interface BudgetCalculatorPopOutProps {
  onBudgetUpdate?: (data: BudgetData) => void;
}

export default function BudgetCalculatorPopOut({ onBudgetUpdate }: BudgetCalculatorPopOutProps) {
  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-2">Smart Budget Planner</h1>
      <p className="text-gray-500 text-center mb-6">
        Track your income, expenses, and set savings goals
      </p>
      
      <div className="max-w-screen-lg mx-auto">
        <Alert className="mb-4 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800 text-sm">
            Use this calculator to track your monthly budget and plan for your financial goals.
            All data is stored locally on your device.
          </AlertDescription>
        </Alert>
        
        <BudgetCalculator onBudgetUpdate={onBudgetUpdate} />
      </div>
    </div>
  );
}