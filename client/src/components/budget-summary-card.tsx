import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/format-utils";

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
  const dailyBudgetValue = remaining > 0 ? (remaining / 30) : 0;
  const weeklyBudgetValue = remaining > 0 ? (remaining / 4.3) : 0;
  const annualSavingsValue = remaining > 0 ? (remaining * 12) : 0;
  
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
    <Card className="w-full max-w-full mx-auto shadow-md min-h-[85vh]">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center">Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-12">
        {/* Income and Expenses Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span>Total Income:</span>
              <span className="font-bold">${formatCurrencyPrecise(income)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Total Expenses:</span>
              <span className="font-bold text-red-500">${formatCurrencyPrecise(totalExpenses)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Remaining:</span>
              <span className={`font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${formatCurrencyPrecise(remaining)}
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
                          <span className="text-gray-500">${formatCurrencyPrecise(expense.amount)}</span>
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
              <div className="text-lg font-semibold text-green-600">${formatCurrencyPrecise(dailyBudgetValue)}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">Weekly Available</div>
              <div className="text-lg font-semibold text-green-600">${formatCurrencyPrecise(weeklyBudgetValue)}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">Annual Savings</div>
              <div className="text-lg font-semibold text-green-600">${formatCurrencyPrecise(annualSavingsValue)}</div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-6 mt-2">
          <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
          <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-green-800">Regular Payment Schedule</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Rent/Mortgage</span>
                    <span className="font-medium">1st of month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilities</span>
                    <span className="font-medium">15th of month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Car Payment</span>
                    <span className="font-medium">5th of month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance</span>
                    <span className="font-medium">10th of month</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-green-800">Upcoming Payments</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Rent Payment</div>
                      <div className="text-gray-500">Due in 5 days</div>
                    </div>
                    <span className="font-semibold">${formatCurrencyPrecise(1500)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Electric Bill</div>
                      <div className="text-gray-500">Due in 12 days</div>
                    </div>
                    <span className="font-semibold">${formatCurrencyPrecise(120)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Car Insurance</div>
                      <div className="text-gray-500">Due in 15 days</div>
                    </div>
                    <span className="font-semibold">${formatCurrencyPrecise(85)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Tips */}
        <div className="border-t pt-4 mt-2">
          <h3 className="text-lg font-medium mb-2">Money Management Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-green-700">Budgeting Essentials</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                <li>Aim to save at least 20% of your income each month</li>
                <li>Keep essential expenses under 50% of your income</li>
                <li>Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-green-700">Financial Growth</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                <li>Build an emergency fund to cover 3-6 months of expenses</li>
                <li>Review and adjust your budget regularly to stay on track</li>
                <li>Eliminate high-interest debt before focusing on investments</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Additional mobile-friendly financial summary - Only visible on small screens */}
        <div className="border-t pt-6 mt-4 md:hidden">
          <h3 className="text-lg font-medium mb-4 text-center">Financial Wellness Score</h3>
          <div className="bg-green-50 rounded-lg p-5 border border-green-100">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                <div 
                  className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-8 border-green-500"
                  style={{ 
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)',
                    transform: 'rotate(45deg)'
                  }}
                ></div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold">85%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-green-800 font-medium mb-2">Very Good</p>
                <p className="text-sm text-gray-600">Your budget is well-balanced with a good savings rate</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-full mt-6">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Savings</div>
                  <div className="text-sm font-medium">Good</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Debt</div>
                  <div className="text-sm font-medium">Low</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Spending</div>
                  <div className="text-sm font-medium">Balanced</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}