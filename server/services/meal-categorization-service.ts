import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Types for meal categorization
export interface MealCategorization {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  confidence: number; // 0-1
  reasoning: string;
}

export interface RecipeData {
  id: number;
  title: string;
  readyInMinutes?: number;
  servings?: number;
  description?: string;
  cuisines?: string[];
  dishTypes?: string[];
  mealType?: string;
  imageType?: string;
}

/**
 * Service for intelligently categorizing meals using OpenAI
 */
export class MealCategorizationService {
  /**
   * Categorize a single recipe into the appropriate meal type
   * @param recipe The recipe data to categorize
   * @returns The meal categorization result
   */
  static async categorizeRecipe(recipe: RecipeData): Promise<MealCategorization> {
    try {
      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API key is not configured');
        // Fallback to basic categorization
        return this.fallbackCategorization(recipe);
      }

      // Use recipe title, dish types and cuisines to determine the best meal type
      const dishTypes = recipe.dishTypes || [];
      const cuisines = recipe.cuisines || [];
      
      // Build prompt for OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a culinary expert who categorizes recipes into meal types.
            For a given recipe, determine the most appropriate meal type among: breakfast, lunch, dinner, snack, or dessert.
            Consider the recipe title, serving time, dish types, and cuisines to make your determination.
            
            Please provide your answer in a structured JSON format with the following fields:
            - mealType: one of "breakfast", "lunch", "dinner", "snack", or "dessert"
            - confidence: a number between 0 and 1 indicating your confidence in this categorization
            - reasoning: a very brief explanation for your categorization
            
            Examples of breakfast foods: eggs, pancakes, waffles, cereal, oatmeal, breakfast sandwiches
            Examples of lunch foods: sandwiches, light soups, salads, wraps, quick pastas
            Examples of dinner foods: hearty main dishes, roasts, complex meals, more elaborate cuisines
            Examples of snacks: finger foods, small bites, dips, chips, nuts, simple appetizers
            Examples of desserts: cakes, cookies, pies, ice cream, sweet treats`
          },
          {
            role: "user",
            content: `Categorize this recipe:
            Title: ${recipe.title}
            Preparation time: ${recipe.readyInMinutes || 'Unknown'} minutes
            Dish types: ${dishTypes.length > 0 ? dishTypes.join(', ') : 'Unknown'}
            Cuisines: ${cuisines.length > 0 ? cuisines.join(', ') : 'Unknown'}`
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the response
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      const result = JSON.parse(content) as MealCategorization;
      return result;
      
    } catch (error) {
      console.error('Error categorizing recipe with OpenAI:', error);
      // Fallback to basic categorization if OpenAI fails
      return this.fallbackCategorization(recipe);
    }
  }

  /**
   * Batch categorize multiple recipes
   * @param recipes Array of recipes to categorize
   * @returns Array of categorized recipes with meal types
   */
  static async categorizeRecipes(recipes: RecipeData[]): Promise<(RecipeData & { categorization: MealCategorization })[]> {
    const categorizedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const categorization = await this.categorizeRecipe(recipe);
        return {
          ...recipe,
          categorization,
          mealType: categorization.mealType // Set the mealType property for compatibility
        };
      })
    );
    
    return categorizedRecipes;
  }

  /**
   * Fallback categorization method when OpenAI is unavailable
   * @param recipe The recipe to categorize
   * @returns Basic meal categorization based on keywords and rules
   */
  private static fallbackCategorization(recipe: RecipeData): MealCategorization {
    const title = recipe.title.toLowerCase();
    const dishTypes = recipe.dishTypes?.map(type => type.toLowerCase()) || [];
    
    // Keywords for each meal type
    const breakfastKeywords = ['breakfast', 'pancake', 'waffle', 'egg', 'oatmeal', 'cereal', 'toast', 'bacon'];
    const lunchKeywords = ['sandwich', 'salad', 'wrap', 'soup', 'lunch'];
    const dinnerKeywords = ['dinner', 'roast', 'steak', 'casserole', 'stew', 'entree', 'main course', 'main dish'];
    const snackKeywords = ['snack', 'appetizer', 'dip', 'chips', 'finger food', 'nuts'];
    const dessertKeywords = ['dessert', 'cake', 'pie', 'cookie', 'ice cream', 'sweet', 'chocolate', 'pudding'];
    
    // Check dish types first (most reliable indicator)
    if (dishTypes.some(type => 
        type.includes('breakfast') || 
        type.includes('brunch'))) {
      return { mealType: 'breakfast', confidence: 0.9, reasoning: 'Dish type indicates breakfast' };
    }
    
    if (dishTypes.some(type => 
        type.includes('lunch') || 
        type.includes('main course') && !type.includes('dinner'))) {
      return { mealType: 'lunch', confidence: 0.8, reasoning: 'Dish type indicates lunch' };
    }
    
    if (dishTypes.some(type => 
        type.includes('dinner') || 
        type.includes('main course'))) {
      return { mealType: 'dinner', confidence: 0.85, reasoning: 'Dish type indicates dinner' };
    }
    
    if (dishTypes.some(type => 
        type.includes('snack') || 
        type.includes('appetizer'))) {
      return { mealType: 'snack', confidence: 0.9, reasoning: 'Dish type indicates snack' };
    }
    
    if (dishTypes.some(type => 
        type.includes('dessert') || 
        type.includes('sweet'))) {
      return { mealType: 'dessert', confidence: 0.95, reasoning: 'Dish type indicates dessert' };
    }
    
    // Then check title keywords
    if (breakfastKeywords.some(keyword => title.includes(keyword))) {
      return { mealType: 'breakfast', confidence: 0.8, reasoning: 'Title contains breakfast keywords' };
    }
    
    if (lunchKeywords.some(keyword => title.includes(keyword))) {
      return { mealType: 'lunch', confidence: 0.7, reasoning: 'Title contains lunch keywords' };
    }
    
    if (dinnerKeywords.some(keyword => title.includes(keyword))) {
      return { mealType: 'dinner', confidence: 0.75, reasoning: 'Title contains dinner keywords' };
    }
    
    if (snackKeywords.some(keyword => title.includes(keyword))) {
      return { mealType: 'snack', confidence: 0.8, reasoning: 'Title contains snack keywords' };
    }
    
    if (dessertKeywords.some(keyword => title.includes(keyword))) {
      return { mealType: 'dessert', confidence: 0.85, reasoning: 'Title contains dessert keywords' };
    }
    
    // Default categorization based on preparation time
    // Shorter prep time = more likely to be breakfast or lunch
    // Longer prep time = more likely to be dinner
    if (recipe.readyInMinutes) {
      if (recipe.readyInMinutes <= 15) {
        return { mealType: 'breakfast', confidence: 0.6, reasoning: 'Quick preparation time suggests breakfast' };
      } else if (recipe.readyInMinutes <= 30) {
        return { mealType: 'lunch', confidence: 0.6, reasoning: 'Medium preparation time suggests lunch' };
      } else {
        return { mealType: 'dinner', confidence: 0.6, reasoning: 'Longer preparation time suggests dinner' };
      }
    }
    
    // If all else fails, default to dinner
    return { mealType: 'dinner', confidence: 0.5, reasoning: 'Default categorization' };
  }
  
  /**
   * Organize recipes into meal categories
   * @param recipes Array of recipes with categorizations
   * @returns Organized meals by type (breakfast, lunch, dinner, snack, dessert)
   */
  static organizeMealsByType(recipes: (RecipeData & { categorization: MealCategorization })[]): {
    breakfast: RecipeData[];
    lunch: RecipeData[];
    dinner: RecipeData[];
    snack: RecipeData[];
    dessert: RecipeData[];
  } {
    const result = {
      breakfast: [] as RecipeData[],
      lunch: [] as RecipeData[],
      dinner: [] as RecipeData[],
      snack: [] as RecipeData[],
      dessert: [] as RecipeData[]
    };
    
    recipes.forEach(recipe => {
      // Add recipe to the appropriate category array
      result[recipe.categorization.mealType].push(recipe);
    });
    
    return result;
  }
}