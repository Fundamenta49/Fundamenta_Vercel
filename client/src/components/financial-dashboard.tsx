import { useState, useEffect } from "react";
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
  BarChart,
  Bar,
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
} from "lucide-react";

// Sample data - In a real app, this would come from your backend
const monthlyData = [
  { month: "Jan", income: 5000, expenses: 4000, savings: 1000 },
  { month: "Feb", income: 5200, expenses: 3800, savings: 1400 },
  { month: "Mar", income: 4800, expenses: 3900, savings: 900 },
  { month: "Apr", income: 5100, expenses: 3700, savings: 1400 },
  { month: "May", income: 5300, expenses: 4100, savings: 1200 },
  { month: "Jun", income: 5400, expenses: 3800, savings: 1600 },
];

const expenseCategories = [
  { name: "Housing", value: 35 },
  { name: "Transportation", value: 15 },
  { name: "Food", value: 20 },
  { name: "Utilities", value: 10 },
  { name: "Entertainment", value: 10 },
  { name: "Savings", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export default function FinancialDashboard() {
  const [progress, setProgress] = useState(0);
  const [savingsGoal] = useState(10000);
  const currentSavings = monthlyData.reduce((acc, month) => acc + month.savings, 0);
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(savingsProgress), 500);
    return () => clearTimeout(timer);
  }, [savingsProgress]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-4 w-4" />
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ${monthlyData[monthlyData.length - 1].income.toLocaleString()}
            </div>
            <p className="text-sm text-green-600">+5% from last month</p>
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
              ${monthlyData[monthlyData.length - 1].expenses.toLocaleString()}
            </div>
            <p className="text-sm text-red-600">-3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <PiggyBank className="h-4 w-4" />
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              ${currentSavings.toLocaleString()}
            </div>
            <p className="text-sm text-blue-600">Towards ${savingsGoal.toLocaleString()} goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Progress */}
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

      {/* Monthly Savings Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                {category.name}: {category.value}%
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
