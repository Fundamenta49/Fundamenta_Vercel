import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface BudgetItem {
  category: string;
  amount: number;
}

export default function BudgetCalculator() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<BudgetItem[]>([
    { category: "Housing", amount: 0 },
    { category: "Transportation", amount: 0 },
    { category: "Food", amount: 0 },
    { category: "Utilities", amount: 0 },
    { category: "Healthcare", amount: 0 },
    { category: "Savings", amount: 0 },
  ]);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = income - totalExpenses;
  const expensePercentage = income > 0 ? (totalExpenses / income) * 100 : 0;

  const handleExpenseChange = (index: number, value: string) => {
    const newExpenses = [...expenses];
    newExpenses[index].amount = parseFloat(value) || 0;
    setExpenses(newExpenses);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Label htmlFor="income">Monthly Income</Label>
            <Input
              id="income"
              type="number"
              value={income || ""}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter your monthly income"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center gap-2">
              <Label htmlFor={`expense-${index}`}>{expense.category}</Label>
              <Input
                id={`expense-${index}`}
                type="number"
                value={expense.amount || ""}
                onChange={(e) => handleExpenseChange(index, e.target.value)}
                placeholder={`Enter ${expense.category.toLowerCase()} expenses`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Budget Used</span>
              <span className="font-semibold">
                {expensePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={expensePercentage} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-destructive">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p
                className={`text-2xl font-bold ${
                  remaining >= 0 ? "text-green-500" : "text-destructive"
                }`}
              >
                ${remaining.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
