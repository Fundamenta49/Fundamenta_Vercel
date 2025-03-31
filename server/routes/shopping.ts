import express from 'express';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Type for OpenAI response to help with null checks
type OpenAIContent = string | null | undefined;

const router = express.Router();

// Helper function to convert budget string to number range
const getBudgetRange = (budgetLevel: string) => {
  const budgetRanges: Record<string, { min: number; max: number }> = {
    'very-low': { min: 0, max: 30 },
    'low': { min: 30, max: 50 },
    'medium': { min: 50, max: 100 },
    'high': { min: 100, max: 150 },
    'very-high': { min: 150, max: 300 }
  };
  
  return budgetRanges[budgetLevel] || { min: 0, max: 100 };
};

/**
 * Generate personalized grocery list based on user preferences
 */
router.post('/generate-list', async (req, res) => {
  try {
    const { diet, budget, meals, restrictions } = req.body;
    const budgetRange = getBudgetRange(budget);
    
    // Format prompt for OpenAI
    const prompt = `
    Act as a nutrition expert creating a personalized grocery list. Use EXACTLY this response format as valid JSON:
    {
      "items": [
        {
          "name": "item name with quantity",
          "estimatedCost": 0.00,
          "quantity": "quantity and unit",
          "category": "category like produce, protein, etc."
        }
      ],
      "totalCost": 0.00,
      "suggestions": ["helpful shopping tip 1", "helpful shopping tip 2", "helpful shopping tip 3"]
    }
    
    Create a detailed grocery list for a ${diet} diet with the following criteria:
    - Budget between $${budgetRange.min} and $${budgetRange.max} 
    ${meals ? `- Planning for approximately ${meals} meals` : ''}
    ${restrictions ? `- Dietary restrictions: ${restrictions}` : ''}
    
    The grocery list should include:
    - A variety of nutritious foods
    - Exact quantities and realistic prices
    - Items categorized (produce, protein, grains, etc.)
    - At least 10-15 different grocery items
    - Shopping tips specific to this diet and budget
    
    Make sure cost estimates are realistic and the total is within budget range.
    `;

    // Call OpenAI to generate the list
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a nutrition expert and meal planning assistant." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse response and send back to client
    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    res.json(result);
  } catch (error) {
    console.error('Error generating grocery list:', error);
    res.status(500).json({ error: 'Failed to generate grocery list' });
  }
});

/**
 * Get nearby grocery stores based on location
 */
router.post('/nearby-stores', async (req, res) => {
  try {
    const { latitude, longitude, products } = req.body;
    
    // Here we would integrate with a grocery price API or store locator API
    // For now, returning enhanced mock data with more realistic store data
    
    // In a real implementation, this would integrate with:
    // 1. Google Maps API for store locations
    // 2. Grocery price comparison APIs like Basket, Fetch Rewards, etc.
    // 3. Store-specific APIs if available (Walmart, Kroger, etc.)
    
    // Improved simulation with more dynamic data, realistic store names, and realistic geographic data
    const storeResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You generate realistic grocery store price data. Respond only with JSON." 
        },
        { 
          role: "user", 
          content: `Generate realistic grocery store price data for coordinates: ${latitude}, ${longitude} with these products: ${products.join(', ')}. Include at least 4 stores with distance, realistic store names, and realistic prices with occasional deals.` 
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const storeContent = storeResponse.choices[0].message.content || '{}';
    const storeData = JSON.parse(storeContent);
    res.json(storeData);
  } catch (error) {
    console.error('Error finding nearby stores:', error);
    res.status(500).json({ error: 'Failed to find nearby stores' });
  }
});

/**
 * Search for grocery item prices
 */
router.get('/price-search', async (req, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Generate price data for the search query
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You generate realistic grocery price data. Respond only with JSON." 
        },
        { 
          role: "user", 
          content: `Generate realistic price data for grocery item: "${query}". Include price range, average price, price per unit, and store comparison data. Respond with JSON only.` 
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const priceContent = response.choices[0].message.content || '{}';
    const priceData = JSON.parse(priceContent);
    res.json(priceData);
  } catch (error) {
    console.error('Error searching grocery prices:', error);
    res.status(500).json({ error: 'Failed to search grocery prices' });
  }
});

export default router;