import express from 'express';
import { z } from 'zod';

const router = express.Router();

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
    const budgetPatterns = ['budget', 'spending', 'track expense', 'income and expense', 'money management'];
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
    
    // Determine the specific type of finance request
    let financeType = '';
    if (budgetPatterns.some(pattern => lowerMessage.includes(pattern))) {
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
    
    // Return the finance request information
    return res.json({
      success: true,
      isFinanceRequest: true,
      financeInfo: {
        type: financeType,
        rawMessage: message
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