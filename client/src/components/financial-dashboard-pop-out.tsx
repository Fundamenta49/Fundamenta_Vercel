import { DollarSign, AlertCircle } from "lucide-react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FinancialDashboard from "@/components/financial-dashboard";
import { BudgetData } from "@/components/budget-calculator";

interface FinancialDashboardPopOutProps {
  budgetData: BudgetData | null;
}

export default function FinancialDashboardPopOut({ budgetData }: FinancialDashboardPopOutProps) {
  return (
    <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '100vh', paddingBottom: '100px' }}>
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-2">Financial Dashboard</h1>
        <p className="text-gray-500 text-center mb-6">
          Visualize your financial health and track progress
        </p>
        
        <div className="max-w-screen-lg mx-auto">
          <Alert className="mb-4 border-green-500 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-800 text-sm">
              {budgetData 
                ? "Your budget data is displayed below. Update your budget in the Budget Planner to see changes here."
                : "No budget data available. Create a budget in the Budget Planner to visualize your financial health here."}
            </AlertDescription>
          </Alert>
          
          <FinancialDashboard budgetData={budgetData} />
        </div>
      </div>
    </div>
  );
}