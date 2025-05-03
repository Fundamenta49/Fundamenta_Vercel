import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import { MealCategorizationService } from '../services/meal-categorization-service';

const router = express.Router();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Import the Spoonacular monitor
import spoonacularMonitor from '../services/api-monitors/spoonacular-monitor';

// Check if Spoonacular API key is configured
router.get('/spoonacular-status', async (req, res) => {
  if (!SPOONACULAR_API_KEY) {
    return res.json({ 
      status: 'error', 
      message: 'Spoonacular API key is not configured' 
    });
  }
  
  try {
    // Use the monitor's force check to test API status
    const isHealthy = await spoonacularMonitor.forceCheck();
    
    // Get detailed status from the monitor
    const monitorStatus = spoonacularMonitor.getStatus();
    
    if (monitorStatus.isRateLimited) {
      console.log('API rate limit active:', monitorStatus);
      return res.json({
        status: 'rate_limited',
        message: 'Spoonacular API daily points limit reached',
        details: `Rate limit will reset around ${monitorStatus.rateLimitResetTime?.toLocaleString() || 'unknown time'}`,
        rateLimitResetTime: monitorStatus.rateLimitResetTime?.toISOString()
      });
    }
    
    if (isHealthy) {
      return res.json({ 
        status: 'ok', 
        message: 'Spoonacular API key is properly configured',
        lastChecked: monitorStatus.lastChecked?.toISOString()
      });
    } else {
      return res.json({ 
        status: 'error', 
        message: 'Spoonacular API is currently unavailable',
        lastChecked: monitorStatus.lastChecked?.toISOString()
      });
    }
  } catch (error) {
    console.error('Spoonacular API key validation error:', error);
    
    return res.json({ 
      status: 'error', 
      message: 'Failed to validate Spoonacular API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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
    
    // Check if API is rate limited before making the request
    if (spoonacularMonitor.isApiRateLimited()) {
      const status = spoonacularMonitor.getStatus();
      return res.status(429).json({
        error: 'Spoonacular API is rate limited',
        message: 'Daily request quota exceeded. Please try again later.',
        rateLimitResetTime: status.rateLimitResetTime?.toISOString()
      });
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
    
    // Check if this is a rate limit error
    if (axios.isAxiosError(error) && 
        (error.response?.status === 402 || 
         (error.response?.data?.status === 'failure' && error.response?.data?.code === 402))) {
      
      // Extract retry-after if available
      const retryAfter = error.response?.headers['retry-after'] 
        ? parseInt(error.response.headers['retry-after'], 10)
        : undefined;
      
      // Register the rate limit with the monitor
      spoonacularMonitor.handleRateLimitError(retryAfter);
      
      return res.status(429).json({ 
        error: 'Spoonacular API rate limit exceeded',
        message: 'Daily request quota exceeded. Please try again later.',
        rateLimitResetTime: spoonacularMonitor.getStatus().rateLimitResetTime?.toISOString()
      });
    } else if (axios.isAxiosError(error) && error.response) {
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

// We're now using MealCategorizationService to improve meal categorization

// Get meal plan
router.get('/meal-plan', async (req, res) => {
  try {
    const { timeFrame = 'day', targetCalories = 2000, diet, exclude, maxReadyTime } = req.query;
    
    if (!SPOONACULAR_API_KEY) {
      return res.status(500).json({ 
        error: 'Spoonacular API key is not configured',
        message: 'No meal plan could be generated. The Spoonacular API might be unavailable or misconfigured.'
      });
    }

    // If requesting weekly meal plan, use the built-in endpoint
    if (timeFrame === 'week') {
      try {
        // First get the standard response from Spoonacular
        const response = await axios.get(`${BASE_URL}/mealplanner/generate`, {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            timeFrame,
            targetCalories,
            diet,
            exclude
          }
        });
        
        // Log the response structure for debugging
        console.log('Spoonacular meal plan response structure:', JSON.stringify(response.data));
        
        // Check if response is valid
        if (!response.data || !response.data.week) {
          console.error('Unexpected API response structure:', response.data);
          return res.status(500).json({ 
            error: 'Invalid data from Spoonacular API',
            message: 'No meal plan could be generated. The Spoonacular API might be unavailable or misconfigured.'
          });
        }
        
        // Now let's enhance the meal plan with improved categorization if OpenAI is available
        if (process.env.OPENAI_API_KEY) {
          // For each day in the week, get the recipes and recategorize them
          try {
            console.log('Enhancing meal plan with OpenAI categorization');
            
            // Check if the response structure is as expected
            if (!response.data.week || !response.data.week.monday) {
              console.error('Unexpected API response structure:', response.data);
              return res.json(response.data);
            }
            
            // The API response format has changed - it now returns days as objects instead of an array
            const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const enhancedWeek = { days: [] };
            
            for (const dayName of weekDays) {
              const day = response.data.week[dayName];
              if (!day || !day.meals || !Array.isArray(day.meals) || day.meals.length === 0) {
                console.error(`Day ${dayName} has invalid meals data:`, day);
                continue;
              }
              
              // Collect all recipes from this day for processing
              const recipes = day.meals.map((meal: any) => ({
                id: meal.id,
                title: meal.title,
                readyInMinutes: meal.readyInMinutes || 0,
                servings: meal.servings || 1,
                imageType: meal.imageType || 'jpg'
              }));
              
              // Get OpenAI to categorize these recipes
              const categorizedRecipes = await MealCategorizationService.categorizeRecipes(recipes);
              const organizedMeals = MealCategorizationService.organizeMealsByType(categorizedRecipes);
              
              // Reorganize the meals based on their types
              // Try to select a breakfast, lunch, and dinner if available
              const enhancedMeals = [
                // Breakfast (use the first breakfast or fallback to original)
                organizedMeals.breakfast.length > 0 ? 
                  { ...organizedMeals.breakfast[0], mealType: 'breakfast' } : 
                  day.meals[0] ? { ...day.meals[0], mealType: 'breakfast' } : null,
                  
                // Lunch (use the first lunch or fallback to original)
                organizedMeals.lunch.length > 0 ? 
                  { ...organizedMeals.lunch[0], mealType: 'lunch' } : 
                  day.meals.length > 1 ? { ...day.meals[1], mealType: 'lunch' } : null,
                  
                // Dinner (use the first dinner or fallback to original)
                organizedMeals.dinner.length > 0 ? 
                  { ...organizedMeals.dinner[0], mealType: 'dinner' } : 
                  day.meals.length > 2 ? { ...day.meals[2], mealType: 'dinner' } : null
              ].filter(Boolean);
              
              // Add the categorization info to the enhanced day
              enhancedWeek.days.push({
                dayName,
                meals: enhancedMeals,
                nutrients: day.nutrients,
                aiEnhanced: true
              });
            }
            
            return res.json({ week: enhancedWeek });
          } catch (aiError) {
            console.error('Error enhancing meal plan with AI:', aiError);
            // If AI enhancement fails, just return the original data
            return res.json(response.data);
          }
        } else {
          // No OpenAI API key, just return the original data
          return res.json(response.data);
        }
      } catch (spoonacularError) {
        console.error('Error fetching meal plan from Spoonacular:', spoonacularError);
        return res.status(500).json({ 
          error: 'Spoonacular API error',
          message: 'No meal plan could be generated. The Spoonacular API might be unavailable or misconfigured.'
        });
      }
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
    
    // If OpenAI is available, verify and potentially reorder the meal types
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('Enhancing daily meal plan with OpenAI categorization');
        
        // Get detailed recipe info for better categorization
        const recipePromises = meals.map(async (meal) => {
          try {
            const recipeInfo = await axios.get(`${BASE_URL}/recipes/${meal.id}/information`, {
              params: {
                apiKey: SPOONACULAR_API_KEY
              }
            });
            
            return {
              ...meal,
              dishTypes: recipeInfo.data.dishTypes || [],
              cuisines: recipeInfo.data.cuisines || []
            };
          } catch (error) {
            // If we fail to get detailed info, just use what we have
            return meal;
          }
        });
        
        const detailedRecipes = await Promise.all(recipePromises);
        
        // Use OpenAI to categorize and verify meal types
        const categorizedRecipes = await MealCategorizationService.categorizeRecipes(detailedRecipes);
        
        // Organize meals by their OpenAI-determined types
        const organizedMeals = MealCategorizationService.organizeMealsByType(categorizedRecipes);
        
        // Build an enhanced response with the AI-categorized meals
        const enhancedMeals = [];
        
        // Add a breakfast recipe
        if (organizedMeals.breakfast.length > 0) {
          enhancedMeals.push({
            ...organizedMeals.breakfast[0],
            mealType: 'breakfast'
          });
        } else if (meals.length > 0) {
          // Fallback to the first meal if no breakfast found
          enhancedMeals.push({
            ...meals[0],
            mealType: 'breakfast'
          });
        }
        
        // Add a lunch recipe
        if (organizedMeals.lunch.length > 0) {
          enhancedMeals.push({
            ...organizedMeals.lunch[0],
            mealType: 'lunch'
          });
        } else if (meals.length > 1) {
          // Fallback to the second meal if no lunch found
          enhancedMeals.push({
            ...meals[1],
            mealType: 'lunch'
          });
        }
        
        // Add a dinner recipe
        if (organizedMeals.dinner.length > 0) {
          enhancedMeals.push({
            ...organizedMeals.dinner[0],
            mealType: 'dinner'
          });
        } else if (meals.length > 2) {
          // Fallback to the third meal if no dinner found
          enhancedMeals.push({
            ...meals[2],
            mealType: 'dinner'
          });
        }
        
        // Return the enhanced response
        return res.json({
          meals: enhancedMeals,
          nutrients,
          aiEnhanced: true
        });
        
      } catch (aiError) {
        console.error('Error enhancing daily meal plan with AI:', aiError);
        // If AI enhancement fails, just return the original data
      }
    }
    
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