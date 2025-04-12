import express from 'express';
import { z } from 'zod';

const router = express.Router();

/**
 * Extract financial data from a message
 */
function extractFinancialData(message: string): {
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
} {
  const data: any = {};
  const lowerMessage = message.toLowerCase();
  
  // Match income - enhanced patterns to handle multiple formats
  console.log("Server-side extracting financial data:", message);
  
  // Try specific patterns for income first
  if (lowerMessage.includes('make') && lowerMessage.includes('per year')) {
    const directMatch = lowerMessage.match(/make\s+(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (directMatch && directMatch[1]) {
      const amount = parseFloat(directMatch[1].replace(/[$,]/g, ''));
      console.log("SERVER INCOME DIRECT MATCH:", amount);
      data.income = amount;
    }
  }
  
  // Special case for "I know make" (common typo for "I now make")
  if (!data.income && lowerMessage.includes('know make')) {
    const knowMakeMatch = lowerMessage.match(/know\s+make\s+(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (knowMakeMatch && knowMakeMatch[1]) {
      const amount = parseFloat(knowMakeMatch[1].replace(/[$,]/g, ''));
      console.log("SERVER INCOME KNOW MAKE MATCH:", amount);
      data.income = amount;
    }
  }
  
  // General income pattern as fallback
  if (!data.income) {
    const incomeMatch = lowerMessage.match(/(?:income|salary|make|earn)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
    if (incomeMatch && incomeMatch[1]) {
      const amount = parseFloat(incomeMatch[1].replace(/[$,]/g, ''));
      console.log("SERVER INCOME GENERAL MATCH:", amount);
      data.income = amount;
    }
  }
  
  // Match rent/housing amount
  const rentMatch = lowerMessage.match(/(?:rent|lease|apartment|housing)[^\d]*(\$?[\d,]+(?:\.\d{1,2})?)/i);
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
}

// Schema for finance intent requests
const FinanceIntentRequestSchema = z.object({
  message: z.string()
});

/**
 * Process a potential finance-related request
 * This endpoint analyzes a message to determine if it's related to finance
 * and extracts relevant information
 */
router.post('/process-intent', async (req, res) => {
  try {
    // Validate request body
    const { message } = FinanceIntentRequestSchema.parse(req.body);
    
    // Convert to lowercase for easier pattern matching
    const lowerMessage = message.toLowerCase();
    
    // Define common patterns for different financial tools
    const budgetPatterns = [
      'budget', 'spending', 'track expense', 'income and expense', 'money management', 
      'rent', 'lease', 'apartment', 'housing', 'income', 'salary', 'make', 'earn', 'raise'
    ];
    const mortgagePatterns = ['mortgage', 'home buy', 'house payment', 'property', 'real estate', 'amortization'];
    const taxPatterns = ['tax', 'fica', 'income tax', 'take home pay', 'tax bracket', 'filing status'];
    const investmentPatterns = ['invest', 'stock', 'portfolio', 'market', 'fund', 'dividend', 'brokerage'];
    const loanPatterns = ['loan', 'compare', 'interest rate', 'refinance', 'credit', 'borrow'];
    const retirementPatterns = ['retire', 'future plan', 'savings', '401k', 'ira', 'pension', 'social security'];
    const debtPatterns = ['debt', 'payoff', 'credit card', 'student loan', 'snowball', 'avalanche'];
    
    // Financial patterns combined
    const financePatterns = [
      ...budgetPatterns, 
      ...mortgagePatterns, 
      ...taxPatterns, 
      ...investmentPatterns, 
      ...loanPatterns, 
      ...retirementPatterns, 
      ...debtPatterns
    ];
    
    // Check if this is a finance-related request
    const isFinanceRequest = financePatterns.some(pattern => lowerMessage.includes(pattern));
    
    // If not a finance request, return early
    if (!isFinanceRequest) {
      return res.json({
        success: true,
        isFinanceRequest: false
      });
    }
    
    // Extract financial data for decision making and response
    const extractedData = extractFinancialData(message);
    console.log("Extracted financial data for routing:", extractedData);
    
    // Determine the specific type of finance request
    let financeType = '';
    
    // Use extracted data as an additional signal
    if (budgetPatterns.some(pattern => lowerMessage.includes(pattern)) || 
        extractedData.income !== undefined) {
      financeType = 'budget';
    } else if (mortgagePatterns.some(pattern => lowerMessage.includes(pattern))) {
      financeType = 'mortgage';
    } else if (taxPatterns.some(pattern => lowerMessage.includes(pattern))) {
      financeType = 'tax';
    } else if (investmentPatterns.some(pattern => lowerMessage.includes(pattern))) {
      financeType = 'investment';
    } else if (loanPatterns.some(pattern => lowerMessage.includes(pattern))) {
      financeType = 'loan';
    } else if (retirementPatterns.some(pattern => lowerMessage.includes(pattern))) {
      financeType = 'retirement';
    } else if (debtPatterns.some(pattern => lowerMessage.includes(pattern))) {
      financeType = 'debt';
    } else {
      financeType = 'general';
    }
    
    // Return the finance request information with extracted data
    return res.json({
      success: true,
      isFinanceRequest: true,
      financeInfo: {
        type: financeType,
        rawMessage: message,
        extractedData
      }
    });
    
  } catch (error) {
    console.error('Error processing finance intent:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing finance intent'
    });
  }
});

export default router;