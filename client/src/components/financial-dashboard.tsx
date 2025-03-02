import { useState, useEffect } from "react";
import type { BudgetData, BudgetItem } from "./budget-calculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Wallet,
  PiggyBank,
  Landmark,
} from "lucide-react";

interface FinancialDashboardProps {
  budgetData?: BudgetData | null;
}

// Sample data for historical trends
const monthlyData = [
  { month: "Jan", income: 5000, expenses: 4000, savings: 1000, retirement: 500 },
  { month: "Feb", income: 5200, expenses: 3800, savings: 1400, retirement: 600 },
  { month: "Mar", income: 4800, expenses: 3900, savings: 900, retirement: 450 },
  { month: "Apr", income: 5100, expenses: 3700, savings: 1400, retirement: 700 },
  { month: "May", income: 5300, expenses: 4100, savings: 1200, retirement: 600 },
  { month: "Jun", income: 5400, expenses: 3800, savings: 1600, retirement: 800 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function FinancialDashboard({ budgetData }: FinancialDashboardProps) {
  const [progress, setProgress] = useState(0);
  const [savingsGoal] = useState(10000);
  const [retirementProgress, setRetirementProgress] = useState(0);
  const [retirementGoal] = useState(1000000); // Example retirement goal

  // Use real budget data or sample data
  const currentIncome = budgetData?.income || monthlyData[monthlyData.length - 1].income;
  const currentExpenses = budgetData?.totalExpenses || monthlyData[monthlyData.length - 1].expenses;
  const currentSavings = budgetData ? (budgetData.income - budgetData.totalExpenses) : monthlyData.reduce((acc, month) => acc + month.savings, 0);

  // Get retirement savings from budget data if available
  const retirementSavings = budgetData?.expenses.find(item => 
    item.category.toLowerCase().includes('retirement'))?.amount || 0;
  const monthlyRetirementProgress = (retirementSavings * 12 / retirementGoal) * 100;

  // Calculate savings progress
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  // Transform budget items for pie chart
  const expenseCategories = budgetData?.expenses.map(item => ({
    name: item.category,
    value: (item.amount / budgetData.totalExpenses) * 100
  })) || [
    { name: "Housing", value: 35 },
    { name: "Transportation", value: 15 },
    { name: "Food", value: 20 },
    { name: "Utilities", value: 10 },
    { name: "Entertainment", value: 10 },
    { name: "Retirement", value: 10 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(savingsProgress);
      setRetirementProgress(monthlyRetirementProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [savingsProgress, monthlyRetirementProgress]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-4 w-4" />
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${currentIncome.toLocaleString()}
            </div>
            <p className="text-sm text-green-600">
              {budgetData ? 'Current month' : '+5% from last month'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingDown className="h-4 w-4" />
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              ${currentExpenses.toLocaleString()}
            </div>
            <p className="text-sm text-red-600">
              {budgetData ? 'Current month' : '-3% from last month'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <PiggyBank className="h-4 w-4" />
              Current Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              ${currentSavings.toLocaleString()}
            </div>
            <p className="text-sm text-blue-600">Towards ${savingsGoal.toLocaleString()} goal</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Landmark className="h-4 w-4" />
              Retirement Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              ${retirementSavings.toLocaleString()}
            </div>
            <p className="text-sm text-purple-600">Monthly contribution</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals Progress */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Savings Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Savings Goal Progress
            </CardTitle>
            <CardDescription>
              Track your progress towards your savings goal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: ${currentSavings.toLocaleString()}</span>
                <span>Goal: ${savingsGoal.toLocaleString()}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-right">
                {progress.toFixed(1)}% Complete
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Retirement Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Retirement Progress
            </CardTitle>
            <CardDescription>
              Annual retirement savings projection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Annual: ${(retirementSavings * 12).toLocaleString()}</span>
                <span>Goal: ${retirementGoal.toLocaleString()}</span>
              </div>
              <Progress value={retirementProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-right">
                {retirementProgress.toFixed(1)}% of Goal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>
            Breakdown of your monthly expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={1500}
                  label
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {expenseCategories.map((category, index) => (
              <Badge
                key={category.name}
                variant="outline"
                style={{
                  borderColor: COLORS[index % COLORS.length],
                  color: COLORS[index % COLORS.length],
                }}
              >
                {category.name}: {category.value.toFixed(1)}%
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Income vs Expenses Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Income vs Expenses Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}