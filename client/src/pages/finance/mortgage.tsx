import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import {
  CalculatorIcon,
  HomeIcon,
  BookOpen,
  BarChart4,
  Info,
  DollarSign,
  FileText
} from 'lucide-react';
import MortgageCalculator from '@/components/mortgage-calculator';
import MortgageMarketTrends from '@/components/mortgage-market-trends';
import MortgageEducation from '@/components/mortgage-education';
import ClosingCostCalculator from '@/components/closing-cost-calculator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

const MortgagePage: React.FC = () => {
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);

  return (
    <div className="container py-8 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <HomeIcon className="h-8 w-8 text-primary" />
            Mortgage Center
          </h1>
          <p className="text-muted-foreground">
            Comprehensive tools and resources to help you navigate the home buying process
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Powered by FRED API
          </Badge>
          <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8">
                <Info className="h-4 w-4" />
                <span className="sr-only">About Mortgage Center</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About the Mortgage Center</DialogTitle>
                <DialogDescription>
                  The Mortgage Center provides real-time mortgage data and educational resources powered by the Federal Reserve Economic Data (FRED) API.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  This interactive resource helps you:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Calculate monthly mortgage payments and total costs</li>
                  <li>Understand closing costs, PMI, property taxes, and insurance expenses</li>
                  <li>View current mortgage rates and historical trends</li>
                  <li>Monitor housing market indicators</li>
                  <li>Learn about mortgage types, the approval process, and more</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  All data is sourced directly from the Federal Reserve Bank of St. Louis, ensuring you have access to the most accurate and up-to-date information for making informed home buying decisions.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <CalculatorIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Mortgage Calculator</span>
            <span className="sm:hidden">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Closing Costs</span>
            <span className="sm:hidden">Costs</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span className="hidden sm:inline">Market Trends</span>
            <span className="sm:hidden">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Education Center</span>
            <span className="sm:hidden">Education</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mortgage Calculator</CardTitle>
              <CardDescription>
                Calculate monthly payments, total interest, and view amortization schedules based on current rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MortgageCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Closing Cost & Total Ownership Calculator
              </CardTitle>
              <CardDescription>
                Understand all costs associated with buying a home, from down payment to insurance, taxes, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClosingCostCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends & Indicators</CardTitle>
              <CardDescription>
                Real-time mortgage rates and housing market data from the Federal Reserve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MortgageMarketTrends />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mortgage Education Center</CardTitle>
              <CardDescription>
                Essential guides and resources for understanding the mortgage process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MortgageEducation />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MortgagePage;