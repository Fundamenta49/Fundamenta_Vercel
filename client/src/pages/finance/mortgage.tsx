import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalculatorIcon,
  HomeIcon,
  BookOpen,
  BarChart4,
  Info,
  DollarSign,
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

// Import our fullscreen components
import MortgageCalculatorFullscreen from '@/components/mortgage-calculator-fullscreen';
import MortgageMarketTrendsFullscreen from '@/components/mortgage-market-trends-fullscreen';
import MortgageEducationFullscreen from '@/components/mortgage-education-fullscreen';
import ClosingCostCalculatorFullscreen from '@/components/closing-cost-calculator-fullscreen';

const MortgagePage: React.FC = () => {
  // State for info dialog
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  
  // State to manage which tool is currently active in fullscreen
  const [activeFullscreenTool, setActiveFullscreenTool] = useState<string | null>(null);

  // Handle opening a specific tool
  const openTool = (toolId: string) => {
    setActiveFullscreenTool(toolId);
  };

  // Handle closing the active tool
  const closeTool = () => {
    setActiveFullscreenTool(null);
  };

  // Mortgage tools configuration
  const mortgageTools = [
    {
      id: "calculator",
      title: "Mortgage Calculator",
      description: "Calculate monthly payments, total interest, and view amortization schedules",
      icon: CalculatorIcon
    },
    {
      id: "costs",
      title: "Closing Costs Calculator",
      description: "Understand all costs associated with buying a home including taxes and insurance",
      icon: DollarSign
    },
    {
      id: "trends",
      title: "Market Trends",
      description: "Real-time mortgage rates and housing market data from the Federal Reserve",
      icon: BarChart4
    },
    {
      id: "education",
      title: "Mortgage Education",
      description: "Essential guides and resources for understanding the mortgage process",
      icon: BookOpen
    }
  ];

  // Render the appropriate fullscreen component based on the active tool
  const renderActiveFullscreenTool = () => {
    switch (activeFullscreenTool) {
      case "calculator":
        return <MortgageCalculatorFullscreen onClose={closeTool} />;
      case "trends":
        return <MortgageMarketTrendsFullscreen onClose={closeTool} />;
      case "education":
        return <MortgageEducationFullscreen onClose={closeTool} />;
      case "costs":
        return <ClosingCostCalculatorFullscreen onClose={closeTool} />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-8 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <HomeIcon className="h-8 w-8 text-green-500" />
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

      <Alert variant="default" className="mx-0 sm:mx-0 mb-4 border-green-500 bg-green-50">
        <AlertCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-800">
          Click on any card below to access the full interactive experience. All mortgage data is updated daily with the latest market information.
        </AlertDescription>
      </Alert>

      {/* Card grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {mortgageTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={tool.id} 
              className="border-2 border-green-100 shadow-md bg-white cursor-pointer hover:border-green-300 hover:shadow-lg transition-all"
              onClick={() => openTool(tool.id)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <Icon className="h-10 w-10 text-green-500" />
                  </div>
                  <CardTitle className="mb-2">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Render the active fullscreen tool */}
      {renderActiveFullscreenTool()}
    </div>
  );
};

export default MortgagePage;