import { useState, useEffect } from 'react';
import { useAIEventStore } from '@/lib/ai-event-system';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { AIAction } from '@/lib/ai-event-system';

/**
 * This component serves as a connector between Fundi AI chat and the financial tools.
 * It listens for chat responses containing finance-related requests and handles them.
 * 
 * It doesn't render anything visible as it works in the background.
 */
export default function FinanceConnector() {
  const { lastResponse, currentMessage, setLastResponse } = useAIEventStore();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [processedMessageId, setProcessedMessageId] = useState<string | null>(null);
  
  useEffect(() => {
    // Only process if we have both a user message and a response
    if (!currentMessage || !lastResponse?.response) return;
    
    // Create a unique ID for this message/response pair to avoid reprocessing
    const messageResponseId = `${currentMessage}-${lastResponse.response.substring(0, 20)}`;
    
    // Skip if we've already processed this message
    if (processedMessageId === messageResponseId) return;
    setProcessedMessageId(messageResponseId);
    
    // Check if this might be a finance-related request
    const lowerMessage = currentMessage.toLowerCase();
    const financeKeywords = [
      'budget', 'mortgage', 'calculator', 'loan', 'investment', 'retirement', 
      'debt', 'payoff', 'tax', 'taxes', 'fica', 'finance', 'money', 'spending',
      'financial', 'tracker', 'income', 'expense'
    ];
    
    // Check if any finance keywords are in the message
    const isFinanceRequest = financeKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (!isFinanceRequest) return;
    
    // Process the finance request
    const processFinanceRequest = async () => {
      try {
        console.log("Processing potential finance request:", currentMessage);
        
        const response = await fetch('/api/finance/process-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentMessage }),
        });
        
        if (!response.ok) {
          // Fall back to client-side processing if server is not available
          handleFinanceRequestClientSide(currentMessage);
          return;
        }
        
        const data = await response.json();
        console.log("Finance API response:", data);
        
        // If it's not a finance request after server analysis, ignore it
        if (!data.isFinanceRequest) {
          console.log("Not identified as a finance request by the server");
          return;
        }
        
        // Handle the finance request based on the type
        handleFinanceRequest(data.financeInfo);
        
      } catch (error) {
        console.error('Error processing finance request:', error);
        // Fall back to client-side processing
        handleFinanceRequestClientSide(currentMessage);
      }
    };
    
    processFinanceRequest();
  }, [currentMessage, lastResponse, toast, setLastResponse, processedMessageId, navigate]);
  
  /**
   * Handles finance requests based on extracted information from the server
   */
  const handleFinanceRequest = (financeInfo: any) => {
    if (!financeInfo || !financeInfo.type) return;
    
    switch (financeInfo.type) {
      case 'budget':
        handleBudgetRequest(financeInfo);
        break;
      case 'mortgage':
        handleMortgageRequest(financeInfo);
        break;
      case 'tax':
        handleTaxRequest(financeInfo);
        break;
      case 'investment':
        handleInvestmentRequest(financeInfo);
        break;
      case 'loan':
        handleLoanRequest(financeInfo);
        break;
      case 'retirement':
        handleRetirementRequest(financeInfo);
        break;
      case 'debt':
        handleDebtRequest(financeInfo);
        break;
      default:
        console.log("Unknown finance request type:", financeInfo.type);
    }
    
    // Override Fundi's response with a finance-aware response
    if (lastResponse && setLastResponse) {
      // Create a new response that acknowledges the finance action
      const updatedResponse = createUpdatedResponse(financeInfo);
      
      // Update the response
      setLastResponse(updatedResponse);
    }
  };
  
  /**
   * Creates an updated AI response that acknowledges the financial action
   */
  const createUpdatedResponse = (financeInfo: any) => {
    if (!lastResponse) return lastResponse;
    
    let responseText = '';
    let action: AIAction | undefined;
    
    switch (financeInfo.type) {
      case 'budget':
        responseText = `I've opened the Budget Planner for you where you can track your income and expenses. Is there something specific you'd like to budget for?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/budget-planner',
            permissionGranted: true,
            reason: 'Opening Budget Planner'
          }
        };
        break;
      case 'mortgage':
        responseText = `I've opened the Mortgage Calculator to help you with your home buying calculations. Would you like me to guide you through using it?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/mortgage-calculator',
            permissionGranted: true,
            reason: 'Opening Mortgage Calculator'
          }
        };
        break;
      case 'tax':
        responseText = `I've opened the Tax Calculator for you. You can estimate your tax burden and even earn badges by completing the interactive learning modules!`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/tax-calculator',
            permissionGranted: true,
            reason: 'Opening Tax Calculator'
          }
        };
        break;
      case 'investment':
        responseText = `I've opened the Investment Tracker to help you monitor your portfolio performance. What would you like to know about your investments?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/investment-tracker',
            permissionGranted: true,
            reason: 'Opening Investment Tracker'
          }
        };
        break;
      case 'loan':
        responseText = `I've opened the Loan Comparison tool to help you compare different loan options and terms. Is there a specific loan type you're interested in?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/loan-comparison',
            permissionGranted: true,
            reason: 'Opening Loan Comparison'
          }
        };
        break;
      case 'retirement':
        responseText = `I've opened the Retirement Calculator to help you with your future planning. Would you like to see how your current savings might grow over time?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/retirement-calculator',
            permissionGranted: true,
            reason: 'Opening Retirement Calculator'
          }
        };
        break;
      case 'debt':
        responseText = `I've opened the Debt Payoff Planner to help you create a debt elimination strategy. Would you like to compare the snowball vs. avalanche methods?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/debt-payoff-planner',
            permissionGranted: true,
            reason: 'Opening Debt Payoff Planner'
          }
        };
        break;
      default:
        responseText = `I've opened the Financial Literacy section to help you with your finance questions. What specific aspect of personal finance would you like to explore?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance',
            permissionGranted: true,
            reason: 'Opening Finance Section'
          }
        };
    }
    
    // Create the updated response
    const updatedResponse = {
      ...lastResponse,
      response: responseText,
      actions: [
        ...(lastResponse.actions || []),
        action
      ],
      suggestions: [
        ...(lastResponse.suggestions || []),
        { 
          text: "Learn more about financial literacy",
          path: "/learning/courses/financial-literacy"
        }
      ]
    };
    
    return updatedResponse;
  };
  
  /**
   * Client-side fallback for processing finance requests
   */
  const handleFinanceRequestClientSide = (message: string) => {
    // Extract the most likely finance request type based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('spending') || lowerMessage.includes('track expense')) {
      handleBudgetRequest({ type: 'budget' });
    } else if (lowerMessage.includes('mortgage') || lowerMessage.includes('home buy') || lowerMessage.includes('house payment')) {
      handleMortgageRequest({ type: 'mortgage' });
    } else if (lowerMessage.includes('tax') || lowerMessage.includes('fica') || lowerMessage.includes('income tax')) {
      handleTaxRequest({ type: 'tax' });
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('portfolio')) {
      handleInvestmentRequest({ type: 'investment' });
    } else if (lowerMessage.includes('loan') || lowerMessage.includes('compare') || lowerMessage.includes('interest rate')) {
      handleLoanRequest({ type: 'loan' });
    } else if (lowerMessage.includes('retire') || lowerMessage.includes('future plan') || lowerMessage.includes('savings')) {
      handleRetirementRequest({ type: 'retirement' });
    } else if (lowerMessage.includes('debt') || lowerMessage.includes('payoff') || lowerMessage.includes('credit card')) {
      handleDebtRequest({ type: 'debt' });
    } else {
      // Generic finance request
      navigate('/finance');
      
      // Show a toast notification
      toast({
        title: "Financial Literacy Section",
        description: "Opening the Financial Literacy section to help with your finance questions.",
        variant: "default"
      });
      
      // Override Fundi's response
      if (lastResponse && setLastResponse) {
        const updatedResponse = createUpdatedResponse({ type: 'general' });
        setLastResponse(updatedResponse);
      }
    }
  };
  
  /**
   * Individual handlers for specific finance request types
   */
  const handleBudgetRequest = (info: any) => {
    // Navigate to budget planner
    navigate('/finance/budget-planner');
    
    // Show a toast notification
    toast({
      title: "Budget Planner",
      description: "Opening the Budget Planner to help track your income and expenses.",
      variant: "default"
    });
  };
  
  const handleMortgageRequest = (info: any) => {
    // Navigate to mortgage calculator
    navigate('/finance/mortgage-calculator');
    
    // Show a toast notification
    toast({
      title: "Mortgage Calculator",
      description: "Opening the Mortgage Calculator to help with home buying calculations.",
      variant: "default"
    });
  };
  
  const handleTaxRequest = (info: any) => {
    // Navigate to tax calculator
    navigate('/finance/tax-calculator');
    
    // Show a toast notification
    toast({
      title: "Tax Calculator",
      description: "Opening the Tax Calculator to estimate your tax burden and learn about tax concepts.",
      variant: "default"
    });
  };
  
  const handleInvestmentRequest = (info: any) => {
    // Navigate to investment tracker
    navigate('/finance/investment-tracker');
    
    // Show a toast notification
    toast({
      title: "Investment Tracker",
      description: "Opening the Investment Tracker to monitor your portfolio performance.",
      variant: "default"
    });
  };
  
  const handleLoanRequest = (info: any) => {
    // Navigate to loan comparison
    navigate('/finance/loan-comparison');
    
    // Show a toast notification
    toast({
      title: "Loan Comparison",
      description: "Opening the Loan Comparison tool to compare different loan options and terms.",
      variant: "default"
    });
  };
  
  const handleRetirementRequest = (info: any) => {
    // Navigate to retirement calculator
    navigate('/finance/retirement-calculator');
    
    // Show a toast notification
    toast({
      title: "Retirement Calculator",
      description: "Opening the Retirement Calculator to help with future planning and projections.",
      variant: "default"
    });
  };
  
  const handleDebtRequest = (info: any) => {
    // Navigate to debt payoff planner
    navigate('/finance/debt-payoff-planner');
    
    // Show a toast notification
    toast({
      title: "Debt Payoff Planner",
      description: "Opening the Debt Payoff Planner to create a debt elimination strategy.",
      variant: "default"
    });
  };
  
  // This component doesn't render anything visible
  return null;
}