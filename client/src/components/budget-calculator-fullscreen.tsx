import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Trash, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import BudgetSummaryCard from "@/components/budget-summary-card";

// Shared types from budget-calculator.tsx
export interface Expense {
  category: string;
  amount: number;
}

export interface SavingsGoal {
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface BudgetData {
  income: number;
  expenses: Expense[];
  remaining: number;
  expensePercentage: number;
  savingsGoals: SavingsGoal[];
  retirementSavings: number;
}

interface BudgetCalculatorFullscreenProps {
  onBudgetUpdate: (data: BudgetData) => void;
  onClose: () => void;
}

/**
 * Fullscreen Budget Calculator - Complete replacement that ensures proper fullscreen display
 */
export default function BudgetCalculatorFullscreen({
  onBudgetUpdate,
  onClose
}: BudgetCalculatorFullscreenProps) {
  const [mounted, setMounted] = useState(false);
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { category: "Housing", amount: 1500 },
    { category: "Food", amount: 600 },
    { category: "Transportation", amount: 300 },
    { category: "Utilities", amount: 200 },
    { category: "Entertainment", amount: 200 },
  ]);
  const [newExpenseCategory, setNewExpenseCategory] = useState("Other");
  const [newExpenseAmount, setNewExpenseAmount] = useState<number | "">(0);
  const [activeTab, setActiveTab] = useState("budget");
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { name: "Emergency Fund", targetAmount: 10000, currentAmount: 3000 },
    { name: "Vacation", targetAmount: 2000, currentAmount: 500 },
  ]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState<number | "">(0);
  const [newGoalCurrent, setNewGoalCurrent] = useState<number | "">(0);
  const [retirementSavings, setRetirementSavings] = useState(25000);
  
  // Calculate budget metrics for rendering
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = income - totalExpenses;
  const expensePercentage = income > 0 ? (totalExpenses / income) * 100 : 0;

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEsc);
    
    // Force body to be non-scrollable while this is open
    document.body.style.overflow = "hidden";
    setMounted(true);
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    // Update the parent component with current budget data
    const budgetData: BudgetData = {
      income,
      expenses,
      remaining,
      expensePercentage,
      savingsGoals,
      retirementSavings,
    };

    onBudgetUpdate(budgetData);
  }, [income, expenses, remaining, expensePercentage, savingsGoals, retirementSavings, onBudgetUpdate]);

  const handleAddExpense = () => {
    if (newExpenseAmount && newExpenseCategory) {
      const amountNum = typeof newExpenseAmount === 'string' 
        ? parseFloat(newExpenseAmount) 
        : newExpenseAmount;
      
      if (amountNum > 0) {
        setExpenses([...expenses, { category: newExpenseCategory, amount: amountNum }]);
        setNewExpenseCategory("Other");
        setNewExpenseAmount(0);
      }
    }
  };

  const handleRemoveExpense = (index: number) => {
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
  };

  const handleAddSavingsGoal = () => {
    if (newGoalName && newGoalTarget) {
      const targetNum = typeof newGoalTarget === 'string' 
        ? parseFloat(newGoalTarget) 
        : newGoalTarget;
      
      const currentNum = typeof newGoalCurrent === 'string' 
        ? parseFloat(newGoalCurrent) 
        : newGoalCurrent;
      
      if (targetNum > 0) {
        setSavingsGoals([
          ...savingsGoals,
          { 
            name: newGoalName, 
            targetAmount: targetNum, 
            currentAmount: currentNum || 0 
          }
        ]);
        setNewGoalName("");
        setNewGoalTarget(0);
        setNewGoalCurrent(0);
      }
    }
  };

  const handleRemoveSavingsGoal = (index: number) => {
    const newGoals = [...savingsGoals];
    newGoals.splice(index, 1);
    setSavingsGoals(newGoals);
  };

  const updateSavingsGoalProgress = (index: number, amount: number) => {
    const newGoals = [...savingsGoals];
    newGoals[index].currentAmount = amount;
    setSavingsGoals(newGoals);
  };

  // No need to recalculate totals here since we're using state variables

  const expenseCategories = [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Insurance",
    "Healthcare",
    "Debt Payment",
    "Subscriptions",
    "Education",
    "Clothing",
    "Personal Care",
    "Gifts",
    "Other",
  ];

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            Smart Budget Planner
          </h2>
          <p className="text-sm text-gray-500">
            Plan your monthly budget and set savings goals
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Alert className="mb-4 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-sm">
            Changes you make to your budget are automatically saved and will be reflected in your financial dashboard.
          </AlertDescription>
        </Alert>
        
        <Tabs
          defaultValue="budget"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="budget">Monthly Budget</TabsTrigger>
            <TabsTrigger value="savings">Savings Goals</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Income</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="income">Monthly Net Income ($)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider
                      id="income"
                      min={0}
                      max={20000}
                      step={100}
                      value={[income]}
                      onValueChange={(value) => setIncome(value[0])}
                      className="flex-1"
                    />
                    <Input
                      className="w-24"
                      type="number"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {expenses.map((expense, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-32 font-medium truncate">{expense.category}</span>
                      <div className="flex-1">
                        <Slider
                          min={0}
                          max={5000}
                          step={10}
                          value={[expense.amount]}
                          onValueChange={(value) => {
                            const newExpenses = [...expenses];
                            newExpenses[index].amount = value[0];
                            setExpenses(newExpenses);
                          }}
                        />
                      </div>
                      <Input
                        className="w-24"
                        type="number"
                        value={expense.amount}
                        onChange={(e) => {
                          const newExpenses = [...expenses];
                          newExpenses[index].amount = Number(e.target.value) || 0;
                          setExpenses(newExpenses);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveExpense(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="expense-category">Category</Label>
                      <Select
                        value={newExpenseCategory}
                        onValueChange={setNewExpenseCategory}
                      >
                        <SelectTrigger id="expense-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expense-amount">Amount ($)</Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        className="w-full"
                        value={newExpenseAmount === "" ? "" : newExpenseAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewExpenseAmount(value === "" ? "" : Number(value));
                        }}
                      />
                    </div>
                    <div className="self-end">
                      <Button onClick={handleAddExpense} className="gap-1 w-full">
                        <Plus className="h-4 w-4" />
                        Add Expense
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Enhanced Budget Summary Card with expense categories */}
            <div className="w-full px-0 md:px-4 lg:px-6">
              <BudgetSummaryCard
                income={income}
                totalExpenses={totalExpenses}
                remaining={remaining}
                expensePercentage={expensePercentage}
                expenses={expenses}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="savings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Savings Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savingsGoals.length === 0 ? (
                    <p className="text-gray-500">No savings goals yet. Add some below!</p>
                  ) : (
                    savingsGoals.map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{goal.name}</span>
                            <div className="text-sm text-gray-500">
                              ${formatCurrencyPrecise(goal.currentAmount)} of ${formatCurrencyPrecise(goal.targetAmount)}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveSavingsGoal(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                          <Slider
                            min={0}
                            max={goal.targetAmount}
                            step={10}
                            value={[goal.currentAmount]}
                            onValueChange={(value) => updateSavingsGoalProgress(index, value[0])}
                          />
                          <Progress
                            value={(goal.currentAmount / goal.targetAmount) * 100}
                            className="h-2 w-20"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="pt-6 mt-6 border-t">
                  <h3 className="font-medium mb-3">Add New Savings Goal</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input
                        id="goal-name"
                        value={newGoalName}
                        onChange={(e) => setNewGoalName(e.target.value)}
                        placeholder="e.g., New Car"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-target">Target Amount ($)</Label>
                      <Input
                        id="goal-target"
                        type="number"
                        value={newGoalTarget === "" ? "" : newGoalTarget}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewGoalTarget(value === "" ? "" : Number(value));
                        }}
                        placeholder="e.g., 10000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-current">Current Amount ($)</Label>
                      <Input
                        id="goal-current"
                        type="number"
                        value={newGoalCurrent === "" ? "" : newGoalCurrent}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewGoalCurrent(value === "" ? "" : Number(value));
                        }}
                        placeholder="e.g., 2000"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddSavingsGoal} className="mt-4 gap-1">
                    <Plus className="h-4 w-4" />
                    Add Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="retirement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Retirement Planning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="retirement-savings">Current Retirement Savings ($)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider
                      id="retirement-savings"
                      min={0}
                      max={1000000}
                      step={1000}
                      value={[retirementSavings]}
                      onValueChange={(value) => setRetirementSavings(value[0])}
                      className="flex-1"
                    />
                    <Input
                      className="w-32"
                      type="number"
                      value={retirementSavings}
                      onChange={(e) => setRetirementSavings(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-4">Retirement Recommendations</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
                      <span>Recommended Monthly Contribution:</span>
                      <span className="font-bold">${formatCurrencyPrecise(Math.max(income * 0.15, 0))}</span>
                    </div>
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
                      <span>Annual Contribution:</span>
                      <span className="font-bold">${(Math.max(income * 0.15, 0) * 12).toFixed(2)}</span>
                    </div>
                    <Alert className="mt-4 border-yellow-500 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <AlertDescription className="text-yellow-800 text-sm">
                        Financial experts recommend saving 15-20% of your income for retirement.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add a more prominent close button at the bottom */}
        <div className="flex justify-center mt-4 mb-2">
          <Button 
            onClick={onClose} 
            className="budget-close-btn px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center gap-2 shadow-md"
            size="lg"
            style={{ zIndex: 999999 }}
          >
            <X className="h-5 w-5" />
            Close Budget Planner
          </Button>
        </div>
      </div>
    </div>
  );
}