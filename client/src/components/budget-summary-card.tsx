import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Expense } from "./budget-calculator-fullscreen";

interface BudgetSummaryCardProps {
  income: number;
  totalExpenses: number;
  remaining: number;
  expensePercentage: number;
  expenses?: Expense[];
}

/**
 * Enhanced Budget Summary Card with visualization and breakdown
 */
export default function BudgetSummaryCard({
  income,
  totalExpenses,
  remaining,
  expensePercentage,
  expenses = []
}: BudgetSummaryCardProps) {
  // Calculate budget metrics
  const dailyBudget = remaining > 0 ? (remaining / 30).toFixed(2) : '0.00';
  const weeklyBudget = remaining > 0 ? (remaining / 4.3).toFixed(2) : '0.00';
  const annualSavings = remaining > 0 ? (remaining * 12).toFixed(2) : '0.00';
  
  // Calculate expense distribution based on actual expenses
  const getExpensePercentByCategory = (category: string): number => {
    const expense = expenses.find(e => e.category === category);
    if (!expense || totalExpenses === 0) return 0;
    return Math.round((expense.amount / totalExpenses) * 100);
  };
  
  const housingPercent = getExpensePercentByCategory("Housing");
  const foodPercent = getExpensePercentByCategory("Food");
  const transportPercent = getExpensePercentByCategory("Transportation");
  const utilitiesPercent = getExpensePercentByCategory("Utilities");

  return (
    <Card className="w-full max-w-full mx-auto shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center">Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        {/* Income and Expenses Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span>Total Income:</span>
              <span className="font-bold">${income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Total Expenses:</span>
              <span className="font-bold text-red-500">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Remaining:</span>
              <span className={`font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${remaining.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <span>Budget Used:</span>
                <span className="font-semibold">{expensePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={expensePercentage} className="h-3" />
            </div>
          </div>

          {/* Dynamic Expense Visualization */}
          <div className="flex flex-col justify-center">
            <h3 className="text-sm font-medium mb-3 text-gray-600">Expense Distribution</h3>
            <div className="space-y-3">
              {expenses.length > 0 ? (
                expenses.map((expense, index) => {
                  const percent = totalExpenses > 0 ? Math.round((expense.amount / totalExpenses) * 100) : 0;
                  const colors = [
                    "bg-green-600", "bg-blue-500", "bg-yellow-500", "bg-purple-500", 
                    "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-orange-500"
                  ];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{expense.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">${expense.amount}</span>
                          <span className="font-semibold">{percent}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 italic text-sm">No expense data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Budget Insights */}
        <div className="border-t pt-6 mt-2">
          <h3 className="text-lg font-medium mb-4">Budget Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">Daily Available</div>
              <div className="text-lg font-semibold text-green-600">${dailyBudget}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">Weekly Available</div>
              <div className="text-lg font-semibold text-green-600">${weeklyBudget}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">Annual Savings</div>
              <div className="text-lg font-semibold text-green-600">${annualSavings}</div>
            </div>
          </div>
        </div>

        {/* Financial Tips */}
        <div className="border-t pt-4 mt-2">
          <h3 className="text-lg font-medium mb-2">Money Management Tips</h3>
          <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
            <li>Aim to save at least 20% of your income each month</li>
            <li>Keep essential expenses under 50% of your income</li>
            <li>Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>Build an emergency fund to cover 3-6 months of expenses</li>
            <li>Review and adjust your budget regularly to stay on track</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}