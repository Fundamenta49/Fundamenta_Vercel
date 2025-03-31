import axios from 'axios';

/**
 * Client-side service for interacting with the Spoonacular API through our backend proxy
 */
export class SpoonacularService {
  /**
   * Search for grocery products
   * @param query Search query
   * @param number Number of results to return
   */
  static async searchGroceryProducts(query: string, number: number = 10) {
    try {
      const response = await axios.get('/api/shopping/spoonacular/products/search', {
        params: { query, number }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching grocery products:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a grocery product
   * @param id Product ID
   */
  static async getProductInformation(id: number) {
    try {
      const response = await axios.get(`/api/shopping/spoonacular/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting product information:', error);
      throw error;
    }
  }

  /**
   * Generate a meal plan with a shopping list
   * @param params Configuration for the meal plan
   */
  static async generateMealPlan(params: {
    timeFrame?: 'day' | 'week';
    targetCalories?: number;
    diet?: string;
    exclude?: string;
  }) {
    try {
      const response = await axios.get('/api/shopping/spoonacular/mealplan', { params });
      return response.data;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw error;
    }
  }

  /**
   * Get recipes that use the provided ingredients
   * @param ingredients Comma-separated list of ingredients
   * @param number Number of results to return
   */
  static async findRecipesByIngredients(ingredients: string, number: number = 5) {
    try {
      const response = await axios.get('/api/shopping/spoonacular/recipes/byIngredients', {
        params: { ingredients, number }
      });
      return response.data;
    } catch (error) {
      console.error('Error finding recipes by ingredients:', error);
      throw error;
    }
  }

  /**
   * Get random recipes
   * @param number Number of recipes to return
   * @param tags Tags to filter by (e.g., 'vegetarian', 'dessert', etc.)
   */
  static async getRandomRecipes(number: number = 10, tags?: string) {
    try {
      const response = await axios.get('/api/shopping/spoonacular/recipes/random', {
        params: { number, tags }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting random recipes:', error);
      throw error;
    }
  }

  /**
   * Get grocery products by category
   * @param category Category name (e.g., 'produce', 'dairy', 'bread', etc.)
   * @param number Number of results to return
   */
  static async getProductsByCategory(category: string, number: number = 10) {
    try {
      const response = await axios.get('/api/shopping/spoonacular/products/category', {
        params: { category, number }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  }
}