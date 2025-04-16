import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';

const router = express.Router();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Check if Spoonacular API key is configured
router.get('/spoonacular-status', async (req, res) => {
  if (!SPOONACULAR_API_KEY) {
    return res.status(500).json({ error: 'Spoonacular API key is not configured' });
  }
  
  try {
    // Simple API call to test the key
    const response = await axios.get(`${BASE_URL}/food/ingredients/search`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query: 'apple',
        number: 1
      }
    });
    
    return res.json({ status: 'ok', message: 'Spoonacular API key is properly configured' });
  } catch (error) {
    console.error('Spoonacular API key validation error:', error);
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Invalid API key or rate limit exceeded'}` 
      });
    } else {
      return res.status(500).json({ error: 'Failed to validate Spoonacular API key' });
    }
  }
});

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Search for recipes
router.get('/recipes/search', async (req, res) => {
  try {
    const { query, diet, cuisine, intolerances, maxReadyTime, sort, number = 8 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        diet,
        cuisine,
        intolerances,
        maxReadyTime,
        sort,
        number,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
    }
  }
});

// Get recipe information by ID
router.get('/recipes/:id/information', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        includeNutrition: false
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch recipe information from Spoonacular' });
    }
  }
});

// Get random recipes
router.get('/recipes/random', async (req, res) => {
  try {
    const { number = 8, tags } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/random`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        number,
        tags
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch random recipes from Spoonacular' });
    }
  }
});

// Find recipes by ingredients
router.get('/recipes/by-ingredients', async (req, res) => {
  try {
    const { ingredients, number = 5, ranking = 1, ignorePantry = true } = req.query;
    
    if (!ingredients) {
      return res.status(400).json({ error: 'Ingredients list is required' });
    }
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients,
        number,
        ranking,
        ignorePantry
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to find recipes by ingredients' });
    }
  }
});

// Get meal plan
router.get('/meal-plan', async (req, res) => {
  try {
    const { timeFrame = 'day', targetCalories = 2000, diet, exclude, maxReadyTime } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }

    // If requesting weekly meal plan, use the built-in endpoint
    if (timeFrame === 'week') {
      const response = await axios.get(`${BASE_URL}/mealplanner/generate`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          timeFrame,
          targetCalories,
          diet,
          exclude
        }
      });
      
      return res.json(response.data);
    }
    
    // For daily meal plans, we'll enhance the results by explicitly requesting breakfast, lunch, and dinner
    // This ensures more appropriate meals for each time of day
    
    // Get breakfast recipes
    const breakfastResponse = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        type: 'breakfast',
        diet,
        maxReadyTime,
        instructionsRequired: true,
        addRecipeInformation: true,
        number: 1,
        sort: 'random',
        offset: Math.floor(Math.random() * 10) // Add some variety
      }
    });
    
    // Get lunch recipes
    const lunchResponse = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        type: 'main course',
        tags: 'lunch',
        diet,
        maxReadyTime,
        instructionsRequired: true,
        addRecipeInformation: true,
        number: 1,
        sort: 'random',
        offset: Math.floor(Math.random() * 10) // Add some variety
      }
    });
    
    // Get dinner recipes
    const dinnerResponse = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        type: 'main course',
        tags: 'dinner',
        diet,
        maxReadyTime,
        instructionsRequired: true,
        addRecipeInformation: true,
        number: 1,
        sort: 'random',
        offset: Math.floor(Math.random() * 10) // Add some variety
      }
    });
    
    // Format the meals to match the expected structure
    const meals = [
      ...breakfastResponse.data.results.map((recipe: any) => ({
        id: recipe.id,
        imageType: recipe.imageType || 'jpg',
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,
        mealType: 'breakfast'
      })),
      ...lunchResponse.data.results.map((recipe: any) => ({
        id: recipe.id,
        imageType: recipe.imageType || 'jpg',
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,
        mealType: 'lunch'
      })),
      ...dinnerResponse.data.results.map((recipe: any) => ({
        id: recipe.id,
        imageType: recipe.imageType || 'jpg',
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,
        mealType: 'dinner'
      }))
    ];
    
    // Calculate approximate nutrition (this is simplified)
    const nutrients = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0
    };
    
    // Build a response that matches the format from Spoonacular's mealplanner endpoint
    const response = {
      meals,
      nutrients
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to generate meal plan' });
    }
  }
});

// Get food videos from Spoonacular
router.get('/videos/search', async (req, res) => {
  try {
    const { query, cuisine, type, diet, includeIngredients, excludeIngredients, number = 10 } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/food/videos/search`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        cuisine,
        type,
        diet,
        includeIngredients,
        excludeIngredients,
        number
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch cooking videos from Spoonacular' });
    }
  }
});

// Get random food videos from Spoonacular
router.get('/videos/random', async (req, res) => {
  try {
    const { number = 10, tags } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    const response = await axios.get(`${BASE_URL}/food/videos/random`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        number,
        tags
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch random cooking videos from Spoonacular' });
    }
  }
});

// Get recipe videos by category
router.get('/videos/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { number = 10 } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ error: 'Spoonacular API key is not configured' });
    }
    
    // Map common cooking tutorial categories to search queries
    const categoryQueries: Record<string, string> = {
      'breakfast': 'breakfast recipes',
      'lunch': 'lunch easy meals',
      'dinner': 'dinner recipes',
      'desserts': 'dessert recipes',
      'quick': 'quick meals under 30 minutes',
      'vegetarian': 'vegetarian dishes',
      'vegan': 'vegan recipes',
      'baking': 'baking basics',
      'grilling': 'grilling techniques',
      'techniques': 'cooking techniques'
    };
    
    const query = categoryQueries[category] || category;
    
    const response = await axios.get(`${BASE_URL}/food/videos/search`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        number
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `Spoonacular API error: ${error.response.data.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch cooking videos by category from Spoonacular' });
    }
  }
});

// Generate intelligent shopping list from recipe ingredients using AI
router.post('/generate-shopping-list', async (req, res) => {
  try {
    const { ingredients, model = 'openai' } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Valid ingredients array is required' });
    }

    // Format ingredients for better AI understanding
    const formattedIngredients = ingredients.map(ing => {
      // If the ingredient is a simple string, return it directly
      if (typeof ing === 'string') return ing;
      
      // If it's an object with detailed properties (from Spoonacular), format it
      if (ing.amount && ing.unit && ing.name) {
        return `${ing.amount} ${ing.unit} ${ing.name}`;
      }

      // If it has originalString property, use that
      if (ing.originalString) {
        return ing.originalString;
      }

      // Otherwise, stringify the object for inspection
      return JSON.stringify(ing);
    });

    let shoppingListData;

    // Generate shopping list using OpenAI
    if (model === 'openai') {
      // Use the existing OpenAI client
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key is not configured' });
      }

      // Use a more concise prompt to reduce payload size
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use a faster, lighter model for shopping lists
        messages: [
          {
            role: "system",
            content: `You are a shopping list organizer. Create a structured grocery list with categories.
            
            Instructions:
            1. Combine similar ingredients and adjust quantities
            2. Organize by store section (produce, dairy, meat, pantry, etc.)
            3. Format as JSON with categories array
            4. Each category has a name and items array
            5. Each item has name, amount, unit, and optional notes
            6. Include brief shopping tips array`
          },
          {
            role: "user",
            content: `Organize these ingredients into a categorized shopping list:\n\n${formattedIngredients.join("\n")}`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Extract the content from the API response - ensure it's a string before parsing
      const contentString = response.choices[0].message.content || '{}';
      shoppingListData = JSON.parse(contentString);
    } 
    // Generate shopping list using Hugging Face
    else if (model === 'huggingface') {
      // Check for Hugging Face API key
      const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
      
      if (!HUGGINGFACE_API_KEY) {
        return res.status(500).json({ error: 'Hugging Face API key is not configured' });
      }

      // Define the prompt for Hugging Face models
      const prompt = `
      Task: Organize a shopping list based on these recipe ingredients.

      Instructions:
      1. Combine duplicate or similar ingredients and adjust quantities appropriately
      2. Organize items by grocery store section (produce, dairy, meat, pantry, etc.)
      3. Identify potential substitutions or alternatives for hard-to-find items
      4. Format the response as a structured JSON object with categories
      5. For each ingredient, include the original amount and unit when possible
      6. Add helpful notes for items that might be confusing or have multiple options

      Return a JSON object with:
      1. "categories" - an array of grocery section objects, each with:
         - "name": the section name (produce, dairy, etc.)
         - "items": array of ingredient objects with name, amount, unit, and optional notes
      2. "tips" - array of shopping and meal prep efficiency tips specific to these ingredients

      Ingredients:
      ${formattedIngredients.join("\n")}

      JSON response:
      `;

      // Call Hugging Face Inference API directly using axios
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', // Using Mistral model, can be changed
        { inputs: prompt },
        { 
          headers: { 
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json' 
          }
        }
      );

      // Get the response and parse the JSON
      // Note: The response format may vary depending on the model
      try {
        const generatedText = response.data[0]?.generated_text || response.data?.generated_text;
        // Extract the JSON from the text (model might wrap it in markdown or other text)
        const jsonMatch = generatedText.match(/```json\s*(\{[\s\S]*\})\s*```/) || 
                        generatedText.match(/(\{[\s\S]*\})/);
                        
        if (jsonMatch && jsonMatch[1]) {
          shoppingListData = JSON.parse(jsonMatch[1]);
        } else {
          // If we can't find a valid JSON structure, try to parse the whole text
          shoppingListData = JSON.parse(generatedText);
        }
      } catch (jsonError) {
        console.error('Error parsing Hugging Face response:', jsonError);
        return res.status(500).json({ 
          error: 'Failed to parse shopping list from Hugging Face API',
          details: 'Invalid JSON format in response'
        });
      }
    } else {
      return res.status(400).json({ error: 'Invalid model specified. Use "openai" or "huggingface"' });
    }

    res.json({
      success: true,
      model: model,
      shoppingList: shoppingListData
    });
    
  } catch (error) {
    console.error('Shopping list generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate intelligent shopping list',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;