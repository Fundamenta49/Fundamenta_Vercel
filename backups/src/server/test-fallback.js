/**
 * This is a simple test script for the fallback strategy
 * Run with: tsx server/test-fallback.js
 */
import { fallbackAIService } from './ai/ai-fallback-strategy';

// Test the emotion analysis functionality
async function testEmotionAnalysis() {
  console.log('\n=== Testing Emotion Analysis ===');
  try {
    const result = await fallbackAIService.analyzeEmotion(
      "I'm feeling really happy today because I got a promotion at work!"
    );
    console.log('Emotion Analysis Result:', result);
  } catch (error) {
    console.error('Emotion Analysis Test failed:', error);
  }
}

// Test the category determination functionality
async function testCategoryDetermination() {
  console.log('\n=== Testing Category Determination ===');
  try {
    const result = await fallbackAIService.determineCategory(
      "I need help creating a budget for my monthly expenses"
    );
    console.log('Category Determination Result:', result);
  } catch (error) {
    console.error('Category Determination Test failed:', error);
  }
}

// Test the full response generation functionality
async function testResponseGeneration() {
  console.log('\n=== Testing Response Generation ===');
  try {
    const result = await fallbackAIService.generateResponse(
      "How can I improve my credit score?",
      "You are Fundi, a helpful AI assistant. Provide a concise and informative response.",
      [
        {
          role: "system",
          content: "You are Fundi, a helpful AI assistant. Provide a concise and informative response."
        },
        {
          role: "user",
          content: "How can I improve my credit score?"
        }
      ]
    );
    console.log('Response Generation Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Response Generation Test failed:', error);
  }
}

// Run the tests
async function runTests() {
  console.log('Starting fallback strategy tests...');
  
  await testEmotionAnalysis();
  await testCategoryDetermination();
  await testResponseGeneration();
  
  console.log('\nAll tests completed!');
}

// Execute the tests
runTests().catch(error => {
  console.error('Test script failed:', error);
});