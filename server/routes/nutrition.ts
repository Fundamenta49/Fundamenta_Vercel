import express from 'express';
import { usdaService, FoodItem, FoodDetails } from '../services/usda-service';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Search foods in the USDA database
router.get('/search', async (req, res) => {
  try {
    const { query, pageSize, pageNumber, dataType } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Parse the dataType array if provided
    let parsedDataType: string[] | undefined;
    if (dataType) {
      try {
        parsedDataType = JSON.parse(dataType as string);
      } catch (e) {
        parsedDataType = [(dataType as string)];
      }
    }
    
    const result = await usdaService.searchFoods({
      query: query as string,
      pageSize: pageSize ? Number(pageSize) : 25,
      pageNumber: pageNumber ? Number(pageNumber) : 1,
      dataType: parsedDataType
    });
    
    res.json(result);
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ error: 'Failed to search foods' });
  }
});

// Get detailed information for a specific food
router.get('/food/:fdcId', async (req, res) => {
  try {
    const { fdcId } = req.params;
    
    if (!fdcId || isNaN(Number(fdcId))) {
      return res.status(400).json({ error: 'Valid food ID is required' });
    }
    
    const result = await usdaService.getFoodDetails(Number(fdcId));
    res.json(result);
  } catch (error) {
    console.error('Food details error:', error);
    res.status(500).json({ error: 'Failed to get food details' });
  }
});

// Get common foods
router.get('/common-foods', async (req, res) => {
  try {
    const foods = await usdaService.getCommonFoods();
    res.json(foods);
  } catch (error) {
    console.error('Common foods error:', error);
    res.status(500).json({ error: 'Failed to get common foods' });
  }
});

// Get food categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await usdaService.getFoodCategories();
    res.json(categories);
  } catch (error) {
    console.error('Food categories error:', error);
    res.status(500).json({ error: 'Failed to get food categories' });
  }
});

interface NutritionAssessmentInput {
  age: number;
  gender: string;
  heightFeet: number; // feet
  heightInches: number; // inches
  weight: number; // in lbs
  activityLevel: string;
  dietaryPreferences: string[];
  healthGoals: string[];
  existingConditions: string[];
  currentDiet: {
    mealFrequency: number;
    typicalFoods: string[];
    restrictions: string[];
    supplements: string[];
  };
}

// Generate nutritional recommendations based on assessment
router.post('/assessment', async (req, res) => {
  try {
    const assessmentData: NutritionAssessmentInput = req.body;
    
    // Convert from imperial to metric for calculations
    const heightInInches = (assessmentData.heightFeet * 12) + assessmentData.heightInches;
    const heightInCm = heightInInches * 2.54; // inches to cm
    const weightInKg = assessmentData.weight * 0.453592; // lbs to kg
    
    // Calculate BMI
    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    // Calculate estimated daily caloric needs using Mifflin-St Jeor Equation
    let bmr = 0;
    if (assessmentData.gender.toLowerCase() === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * assessmentData.age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * assessmentData.age - 161;
    }
    
    // Activity factor
    let activityFactor = 1.2; // Sedentary
    switch (assessmentData.activityLevel.toLowerCase()) {
      case 'lightly active':
        activityFactor = 1.375;
        break;
      case 'moderately active':
        activityFactor = 1.55;
        break;
      case 'very active':
        activityFactor = 1.725;
        break;
      case 'extra active':
        activityFactor = 1.9;
        break;
    }
    
    const tdee = Math.round(bmr * activityFactor); // Total Daily Energy Expenditure
    
    // Generate personalized recommendations using OpenAI
    const prompt = `Create a comprehensive nutrition plan based on the following assessment:

Age: ${assessmentData.age}
Gender: ${assessmentData.gender}
Height: ${assessmentData.heightFeet}' ${assessmentData.heightInches}" (${heightInCm.toFixed(1)} cm)
Weight: ${assessmentData.weight} lbs (${weightInKg.toFixed(1)} kg)
BMI: ${bmi.toFixed(1)}
Estimated daily caloric needs: ${tdee} calories
Activity level: ${assessmentData.activityLevel}
Dietary preferences: ${assessmentData.dietaryPreferences.join(', ')}
Health goals: ${assessmentData.healthGoals.join(', ')}
Existing health conditions: ${assessmentData.existingConditions.join(', ')}
Current diet:
- Meals per day: ${assessmentData.currentDiet.mealFrequency}
- Typical foods: ${assessmentData.currentDiet.typicalFoods.join(', ')}
- Dietary restrictions: ${assessmentData.currentDiet.restrictions.join(', ')}
- Supplements: ${assessmentData.currentDiet.supplements.join(', ')}

Please provide the following in a JSON format:
1. A summary of their nutritional status
2. Specific macronutrient recommendations (protein, carbs, fat)
3. Key micronutrients they should focus on
4. Meal timing recommendations
5. A 3-day meal plan with breakfast, lunch, dinner, and snacks
6. Food groups they should increase or decrease
7. Specific dietary changes based on their health goals
8. Recommended supplements if necessary
9. Hydration recommendations
10. Long-term nutrition strategy

The response should be structured as a valid JSON object with these 10 sections.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a certified nutritionist using evidence-based recommendations. Provide detailed, personalized nutrition guidance based on assessment data. Format your response as a JSON object with the requested sections." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    if (!aiResponse.choices[0].message?.content) {
      throw new Error('Failed to generate nutrition recommendations');
    }
    
    try {
      const parsedRecommendations = JSON.parse(aiResponse.choices[0].message.content);
      
      // Combine calculated metrics with the recommendations
      const response = {
        metrics: {
          bmi,
          bmr,
          tdee,
          weightCategory: bmi < 18.5 ? 'Underweight' : 
                          bmi < 25 ? 'Healthy Weight' : 
                          bmi < 30 ? 'Overweight' : 'Obesity'
        },
        recommendations: parsedRecommendations
      };
      
      res.json(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      res.status(500).json({ error: 'Failed to parse nutrition recommendations' });
    }
  } catch (error) {
    console.error('Nutrition assessment error:', error);
    res.status(500).json({ error: 'Failed to generate nutrition recommendations' });
  }
});

// Generate meal plan based on preferences and nutritional needs
router.post('/meal-plan', async (req, res) => {
  try {
    const { 
      calorieTarget, 
      dietaryPreferences, 
      healthGoals, 
      restrictions, 
      numberOfDays = 3
    } = req.body;
    
    if (!calorieTarget) {
      return res.status(400).json({ error: 'Calorie target is required' });
    }
    
    const prompt = `Create a detailed ${numberOfDays}-day meal plan that provides approximately ${calorieTarget} calories per day with the following considerations:

Dietary preferences: ${dietaryPreferences ? dietaryPreferences.join(', ') : 'None specified'}
Health goals: ${healthGoals ? healthGoals.join(', ') : 'General health'}
Dietary restrictions: ${restrictions ? restrictions.join(', ') : 'None specified'}

For each day, provide:
1. Breakfast
2. Morning snack
3. Lunch
4. Afternoon snack
5. Dinner
6. Evening snack (if needed)

For each meal, include:
- Name of the dish
- Brief list of ingredients
- Approximate calories
- Macronutrient breakdown (protein, carbs, fat)
- Brief preparation instructions

The plan should be varied, practical, and use commonly available ingredients. Format the response as a JSON object with days and meals.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a certified nutritionist creating detailed meal plans. Your plans should be balanced, realistic, and aligned with the user's preferences and goals. Format your response as a JSON object with days and meals." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    if (!aiResponse.choices[0].message?.content) {
      throw new Error('Failed to generate meal plan');
    }
    
    try {
      const mealPlan = JSON.parse(aiResponse.choices[0].message.content);
      res.json(mealPlan);
    } catch (parseError) {
      console.error('Error parsing meal plan:', parseError);
      res.status(500).json({ error: 'Failed to parse meal plan' });
    }
  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

export default router;