import { useState, useEffect } from 'react';
import { useAIEventStore } from '@/lib/ai-event-system';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { AIAction, AppSuggestion, AIResponse } from '@/lib/ai-event-system';

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
        const financeInfo = {
          ...data.financeInfo,
          message: currentMessage // Always include the current message for client-side extraction
        };
        
        // Use extracted data from server if available, otherwise extract client-side
        if (data.financeInfo.extractedData) {
          console.log("Using server-extracted financial data:", data.financeInfo.extractedData);
          financeInfo.extractedData = data.financeInfo.extractedData;
        }
        
        handleFinanceRequest(financeInfo);
        
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
    if (setLastResponse) {
      // Create a new response that acknowledges the finance action
      const updatedResponse = createUpdatedResponse(financeInfo);
      
      // Update the response
      setLastResponse(updatedResponse);
    }
  };
  
  /**
   * Creates an updated AI response that acknowledges the financial action
   */
  const createUpdatedResponse = (financeInfo: any): AIResponse => {
    if (!lastResponse) {
      // Create default response if lastResponse is null
      return {
        response: "I'll help you with your finance questions.",
        actions: [],
        suggestions: []
      };
    }
    
    let responseText = '';
    let action: AIAction | undefined;
    let formAction: AIAction | undefined = undefined;
    
    // Use server-extracted data if available, otherwise extract client-side
    let extractedData: any = {};
    
    try {
      if (financeInfo.extractedData) {
        // We have server-extracted data
        extractedData = financeInfo.extractedData;
        console.log("Using server-extracted financial data in response creation:", extractedData);
      } else {
        // Fall back to client-side extraction
        extractedData = extractFinancialData(financeInfo.message || currentMessage || '');
        console.log("Using client-extracted financial data in response creation:", extractedData);
      }
    } catch (error) {
      console.error("Error processing extracted financial data:", error);
      // Ensure we have a fallback extraction if anything goes wrong
      extractedData = extractFinancialData(currentMessage || '');
    }
    
    switch (financeInfo.type) {
      case 'budget':
        responseText = `I've opened the Budget Planner for you where you can track your income and expenses. Is there something specific you'd like to budget for?`;
        action = {
          type: 'navigate',
          payload: {
            route: '/finance/budget',
            permissionGranted: true,
            reason: 'Opening Budget Planner'
          }
        };
        
        // Create form filling action if we extracted budget data
        if (extractedData.income || extractedData.expense || extractedData.rent) {
          const formData: Record<string, any> = {};
          
          if (extractedData.income) {
            formData.income = extractedData.income;
            responseText += ` I've set your monthly income to ${formatCurrency(extractedData.income)}.`;
          }
          
          // Add housing/rent as an expense if found
          if (extractedData.rent) {
            formData.housingExpense = extractedData.rent;
            responseText += ` I've updated your housing expense to ${formatCurrency(extractedData.rent)}.`;
            
            // Find or create a Housing category expense
            const expenseData = {
              id: "1", // Housing is typically the first expense
              category: "Housing",
              amount: extractedData.rent
            };
            formData.expenses = [expenseData];
          }
          
          // Add general expense if found
          if (extractedData.expense && extractedData.expenseCategory) {
            responseText += ` I've added ${formatCurrency(extractedData.expense)} for ${extractedData.expenseCategory}.`;
            
            // If we already have expenses array from rent, add to it
            if (formData.expenses) {
              formData.expenses.push({
                id: String(Date.now()), // Generate a unique ID
                category: extractedData.expenseCategory,
                amount: extractedData.expense
              });
            } else {
              // Otherwise create a new expenses array
              formData.expenses = [{
                id: String(Date.now()),
                category: extractedData.expenseCategory,
                amount: extractedData.expense
              }];
            }
          }
          
          formAction = {
            type: 'fill_form',
            payload: {
              formId: 'budget-calculator-form',
              formData,
              autoFocus: true
            }
          };
        }
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
        
        // Create form filling action if we extracted mortgage data
        if (extractedData.homePrice || extractedData.downPayment || extractedData.interestRate || extractedData.loanTerm) {
          const formData: Record<string, any> = {};
          let dataAdded = false;
          
          if (extractedData.homePrice) {
            formData.homePrice = extractedData.homePrice;
            responseText += ` I've set the home price to ${formatCurrency(extractedData.homePrice)}.`;
            dataAdded = true;
          }
          
          if (extractedData.downPayment) {
            formData.downPayment = extractedData.downPayment;
            responseText += ` I've set the down payment to ${formatCurrency(extractedData.downPayment)}.`;
            dataAdded = true;
          }
          
          if (extractedData.interestRate) {
            formData.interestRate = extractedData.interestRate;
            responseText += ` I've set the interest rate to ${extractedData.interestRate}%.`;
            dataAdded = true;
          }
          
          if (extractedData.loanTerm) {
            formData.loanTerm = extractedData.loanTerm;
            responseText += ` I've set the loan term to ${extractedData.loanTerm} years.`;
            dataAdded = true;
          }
          
          if (dataAdded) {
            formAction = {
              type: 'fill_form',
              payload: {
                formId: 'mortgage-calculator-form',
                formData,
                autoFocus: true
              }
            };
          }
        }
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
        
        // Create form filling action if we extracted tax data
        if (extractedData.income) {
          responseText += ` I've set your annual income to ${formatCurrency(extractedData.income)}.`;
          
          formAction = {
            type: 'fill_form',
            payload: {
              formId: 'tax-calculator-form',
              formData: {
                income: extractedData.income
              },
              autoFocus: true
            }
          };
        }
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
        
        // Create form filling action if we extracted loan data
        if (extractedData.loanAmount || extractedData.interestRate || extractedData.loanTerm) {
          const formData: Record<string, any> = {};
          let dataAdded = false;
          
          if (extractedData.loanAmount) {
            formData.loanAmount = extractedData.loanAmount;
            responseText += ` I've set the loan amount to ${formatCurrency(extractedData.loanAmount)}.`;
            dataAdded = true;
          }
          
          if (extractedData.interestRate) {
            formData.interestRate = extractedData.interestRate;
            responseText += ` I've set the interest rate to ${extractedData.interestRate}%.`;
            dataAdded = true;
          }
          
          if (extractedData.loanTerm) {
            formData.loanTerm = extractedData.loanTerm;
            responseText += ` I've set the loan term to ${extractedData.loanTerm} years.`;
            dataAdded = true;
          }
          
          if (dataAdded) {
            formAction = {
              type: 'fill_form',
              payload: {
                formId: 'loan-comparison-form',
                formData,
                autoFocus: true
              }
            };
          }
        }
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
        
        // Create form filling action if we extracted retirement data
        if (extractedData.income || extractedData.savingsAmount || extractedData.retirementAge) {
          const formData: Record<string, any> = {};
          let dataAdded = false;
          
          if (extractedData.income) {
            formData.currentIncome = extractedData.income;
            responseText += ` I've set your current income to ${formatCurrency(extractedData.income)}.`;
            dataAdded = true;
          }
          
          if (extractedData.savingsAmount) {
            formData.currentSavings = extractedData.savingsAmount;
            responseText += ` I've set your current savings to ${formatCurrency(extractedData.savingsAmount)}.`;
            dataAdded = true;
          }
          
          if (extractedData.retirementAge) {
            formData.retirementAge = extractedData.retirementAge;
            responseText += ` I've set your retirement age to ${extractedData.retirementAge}.`;
            dataAdded = true;
          }
          
          if (dataAdded) {
            formAction = {
              type: 'fill_form',
              payload: {
                formId: 'retirement-calculator-form',
                formData,
                autoFocus: true
              }
            };
          }
        }
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
        
        // Create form filling action if we extracted debt data
        if (extractedData.debtAmount || extractedData.interestRate) {
          const formData: Record<string, any> = {};
          let dataAdded = false;
          
          if (extractedData.debtAmount) {
            formData.debtAmount = extractedData.debtAmount;
            responseText += ` I've set your debt amount to ${formatCurrency(extractedData.debtAmount)}.`;
            dataAdded = true;
          }
          
          if (extractedData.interestRate) {
            formData.interestRate = extractedData.interestRate;
            responseText += ` I've set the interest rate to ${extractedData.interestRate}%.`;
            dataAdded = true;
          }
          
          if (dataAdded) {
            formAction = {
              type: 'fill_form',
              payload: {
                formId: 'debt-payoff-form',
                formData,
                autoFocus: true
              }
            };
          }
        }
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
    const updatedResponse: AIResponse = {
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
    
    // Add form filling action if applicable
    if (formAction) {
      updatedResponse.actions = [...(updatedResponse.actions || []), formAction];
    }
    
    return updatedResponse;
  };
  
  /**
   * Format currency values
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  /**
   * Extract financial data from user message
   */
  const extractFinancialData = (message: string): {
    income?: number;
    expense?: number;
    expenseCategory?: string;
    rent?: number;
    homePrice?: number;
    downPayment?: number;
    loanAmount?: number;
    interestRate?: number;
    loanTerm?: number;
    debtAmount?: number;
    savingsAmount?: number;
    retirementAge?: number;
  } => {
    const data: any = {};
    const lowerMessage = message.toLowerCase();
    
    // Match income
    const incomeMatch = lowerMessage.match(/(?:income|salary|make|earn)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (incomeMatch && incomeMatch[1]) {
      data.income = parseFloat(incomeMatch[1].replace(/[$,]/g, ''));
    }
    
    // Match rent/housing amount - improved pattern to catch more cases
    let rentMatch = lowerMessage.match(/(?:rent|lease|apartment|housing)(?:[^\d]*|\s+(?:is|of|at|for|will be|would be))(\$?[\d,]+(?:\.\d{1,2})?)/i);
    
    // Alternative pattern for catching "apartment that will be $X per month" structure
    if (!rentMatch) {
      rentMatch = lowerMessage.match(/apartment\s+that\s+will\s+be\s+(\$?[\d,]+(?:\.\d{1,2})?)/i);
    }
    
    // General numerical extraction as last resort
    if (!rentMatch && (lowerMessage.includes('apartment') || lowerMessage.includes('rent'))) {
      const generalNumberMatch = lowerMessage.match(/(\$?[\d,]+(?:\.\d{1,2})?)\s+per\s+month/i);
      if (generalNumberMatch) {
        rentMatch = generalNumberMatch;
      }
    }
    if (rentMatch && rentMatch[1]) {
      data.rent = parseFloat(rentMatch[1].replace(/[$,]/g, ''));
      // Also set as an expense with the category "Housing"
      data.expense = parseFloat(rentMatch[1].replace(/[$,]/g, ''));
      data.expenseCategory = "Housing";
    }
    
    // Match expense amount and category
    const expenseMatch = lowerMessage.match(/(?:spend|expense|cost|pay|budget)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)[^\d]*(?:for|on)\s+([a-z\s]+)/i);
    if (expenseMatch && expenseMatch[1] && expenseMatch[2]) {
      data.expense = parseFloat(expenseMatch[1].replace(/[$,]/g, ''));
      data.expenseCategory = expenseMatch[2].trim();
    }
    
    // Match home price
    const homePriceMatch = lowerMessage.match(/(?:home|house|property)[^\d]*(?:price|cost|worth|value)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (homePriceMatch && homePriceMatch[1]) {
      data.homePrice = parseFloat(homePriceMatch[1].replace(/[$,]/g, ''));
    }
    
    // Match down payment
    const downPaymentMatch = lowerMessage.match(/(?:down payment|downpayment)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (downPaymentMatch && downPaymentMatch[1]) {
      data.downPayment = parseFloat(downPaymentMatch[1].replace(/[$,]/g, ''));
    }
    
    // Match loan amount
    const loanMatch = lowerMessage.match(/(?:loan|borrow)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (loanMatch && loanMatch[1]) {
      data.loanAmount = parseFloat(loanMatch[1].replace(/[$,]/g, ''));
    }
    
    // Match interest rate
    const interestMatch = lowerMessage.match(/(?:interest|rate)[^\d]*(\d+(?:\.\d{1,2})?)(?:\s*%)?/i);
    if (interestMatch && interestMatch[1]) {
      data.interestRate = parseFloat(interestMatch[1]);
    }
    
    // Match loan term
    const termMatch = lowerMessage.match(/(\d+)(?:\s*[-])?\s*(?:year|yr)/i);
    if (termMatch && termMatch[1]) {
      data.loanTerm = parseInt(termMatch[1], 10);
    }
    
    // Match debt amount
    const debtMatch = lowerMessage.match(/(?:debt|owe)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (debtMatch && debtMatch[1]) {
      data.debtAmount = parseFloat(debtMatch[1].replace(/[$,]/g, ''));
    }
    
    // Match savings amount
    const savingsMatch = lowerMessage.match(/(?:saved|savings)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (savingsMatch && savingsMatch[1]) {
      data.savingsAmount = parseFloat(savingsMatch[1].replace(/[$,]/g, ''));
    }
    
    // Match retirement age
    const retirementMatch = lowerMessage.match(/(?:retire|retirement)[^\d]*(?:at|age)[^\d]*(\d+)/i);
    if (retirementMatch && retirementMatch[1]) {
      data.retirementAge = parseInt(retirementMatch[1], 10);
    }
    
    return data;
  };
  
  /**
   * Client-side fallback for processing finance requests
   */
  const handleFinanceRequestClientSide = (message: string) => {
    if (!message) return;
    
    // Extract the most likely finance request type based on keywords
    const lowerMessage = message.toLowerCase();
    
    // Extract financial data
    const extractedData = extractFinancialData(message);
    console.log("Client-side fallback - extracted financial data:", extractedData);
    
    // Prepare finance info object with extracted data
    const financeInfo = {
      message: message,
      rawMessage: message,
      extractedData: extractedData
    };
    
    if (lowerMessage.includes('budget') || 
        lowerMessage.includes('spending') || 
        lowerMessage.includes('track expense') || 
        lowerMessage.includes('rent') || 
        lowerMessage.includes('lease') || 
        lowerMessage.includes('apartment') ||
        lowerMessage.includes('housing')) {
      handleFinanceRequest({ ...financeInfo, type: 'budget' });
    } else if (lowerMessage.includes('mortgage') || lowerMessage.includes('home buy') || lowerMessage.includes('house payment')) {
      handleFinanceRequest({ ...financeInfo, type: 'mortgage' });
    } else if (lowerMessage.includes('tax') || lowerMessage.includes('fica') || lowerMessage.includes('income tax')) {
      handleFinanceRequest({ ...financeInfo, type: 'tax' });
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('portfolio')) {
      handleFinanceRequest({ ...financeInfo, type: 'investment' });
    } else if (lowerMessage.includes('loan') || lowerMessage.includes('compare') || lowerMessage.includes('interest rate')) {
      handleFinanceRequest({ ...financeInfo, type: 'loan' });
    } else if (lowerMessage.includes('retire') || lowerMessage.includes('future plan') || lowerMessage.includes('savings')) {
      handleFinanceRequest({ ...financeInfo, type: 'retirement' });
    } else if (lowerMessage.includes('debt') || lowerMessage.includes('payoff') || lowerMessage.includes('credit card')) {
      handleFinanceRequest({ ...financeInfo, type: 'debt' });
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
        const updatedResponse = createUpdatedResponse({ ...financeInfo, type: 'general' });
        setLastResponse(updatedResponse);
      }
    }
  };
  
  /**
   * Individual handlers for specific finance request types
   */
  const handleBudgetRequest = (info: any) => {
    // Ensure we have extracted data
    if (info && info.message && !info.extractedData) {
      info.extractedData = extractFinancialData(info.message);
      console.log("Budget handler - extracted data:", info.extractedData);
    }
    
    // Pass to main handler 
    handleFinanceRequest({
      ...info,
      type: 'budget'
    });
  };
  
  const handleMortgageRequest = (info: any) => {
    // Ensure we have extracted data
    if (info && info.message && !info.extractedData) {
      info.extractedData = extractFinancialData(info.message);
    }
    
    // Pass to main handler
    handleFinanceRequest({
      ...info, 
      type: 'mortgage'
    });
  };
  
  const handleTaxRequest = (info: any) => {
    // Ensure we have extracted data
    if (info && info.message && !info.extractedData) {
      info.extractedData = extractFinancialData(info.message);
    }
    
    // Pass to main handler
    handleFinanceRequest({
      ...info,
      type: 'tax'
    });
  };
  
  const handleInvestmentRequest = (info: any) => {
    // Ensure we have extracted data
    if (info && info.message && !info.extractedData) {
      info.extractedData = extractFinancialData(info.message);
    }
    
    // Pass to main handler
    handleFinanceRequest({
      ...info,
      type: 'investment'
    });
  };
  
  const handleLoanRequest = (info: any) => {
    // Ensure we have extracted data
    if (info && info.message && !info.extractedData) {
      info.extractedData = extractFinancialData(info.message);
    }
    
    // Pass to main handler
    handleFinanceRequest({
      ...info,
      type: 'loan'
    });
  };
  
  const handleRetirementRequest = (info: any) => {
    // Ensure we have extracted data
    if (info && info.message && !info.extractedData) {
      info.extractedData = extractFinancialData(info.message);
    }
    
    // Pass to main handler
    handleFinanceRequest({
      ...info,
      type: 'retirement'
    });
  };
  
  const handleDebtRequest = (info: any) => {
    // Ensure we have extracted data
    if (info && info.message && !info.extractedData) {
      info.extractedData = extractFinancialData(info.message);
    }
    
    // Pass to main handler
    handleFinanceRequest({
      ...info,
      type: 'debt'
    });
  };
  
  // This component doesn't render anything visible
  return null;
}