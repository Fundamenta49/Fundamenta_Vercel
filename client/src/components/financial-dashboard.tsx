import { useState, useEffect } from "react";
import type { BudgetData, BudgetItem, SavingsGoal } from "./budget-calculator";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  const [retirementProgress, setRetirementProgress] = useState(0);
  const [retirementGoal, setRetirementGoal] = useState<number>(1000000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(retirementGoal);

  // Use real budget data or sample data
  const currentIncome = budgetData?.income || monthlyData[monthlyData.length - 1].income;
  const currentExpenses = budgetData?.totalExpenses || monthlyData[monthlyData.length - 1].expenses;

  // Get retirement savings directly from budgetData
  const retirementSavings = budgetData?.retirementSavings || 0;
  const totalSavings = retirementSavings;

  // Get savings goals from budgetData
  const savingsGoals = budgetData?.savingsGoals || [];

  // Update retirement progress calculation
  const monthlyRetirementProgress = (retirementSavings * 12 / retirementGoal) * 100;

  // Update expense categories
  const expenseCategories = budgetData?.expenses.map(item => ({
    name: item.category,
    value: (item.amount / budgetData.totalExpenses) * 100
  })) || [
    { name: "Housing", value: 35 },
    { name: "Transportation", value: 15 },
    { name: "Food", value: 20 },
    { name: "Utilities", value: 10 },
    { name: "Healthcare", value: 10 },
    { name: "Entertainment", value: 10 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(monthlyRetirementProgress);
      setRetirementProgress(monthlyRetirementProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [monthlyRetirementProgress]);

  const handleGoalUpdate = () => {
    if (tempGoal > 0) {
      setRetirementGoal(tempGoal);
      setIsEditingGoal(false);
    }
  };

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
              ${totalSavings.toLocaleString()}
            </div>
            <p className="text-sm text-blue-600">Total monthly savings</p>
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
      <div className="grid gap-4">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Annual: ${(retirementSavings * 12).toLocaleString()}</span>
                  {isEditingGoal ? (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="retirementGoal">Goal: $</Label>
                      <Input
                        id="retirementGoal"
                        type="number"
                        value={tempGoal}
                        onChange={(e) => setTempGoal(Number(e.target.value))}
                        className="w-32"
                      />
                      <Button
                        onClick={handleGoalUpdate}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setTempGoal(retirementGoal);
                          setIsEditingGoal(false);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Goal: ${retirementGoal.toLocaleString()}</span>
                      <Button
                        onClick={() => setIsEditingGoal(true)}
                        variant="outline"
                        size="sm"
                      >
                        Edit Goal
                      </Button>
                    </div>
                  )}
                </div>
                <Progress value={retirementProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-right">
                  {retirementProgress.toFixed(1)}% of Goal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Savings Goals */}
        {savingsGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {goal.name}
              </CardTitle>
              <CardDescription>
                Progress towards your {goal.name.toLowerCase()} savings goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Current: ${goal.currentAmount.toLocaleString()}</span>
                    <span>Goal: ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={(goal.currentAmount / goal.targetAmount) * 100}
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% Complete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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