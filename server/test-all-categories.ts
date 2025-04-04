/**
 * A test script to verify content categorization across all categories
 * Run with: tsx server/test-all-categories.ts
 */

import { getContentCategory } from './huggingface';

// Sample one test message for each category
const testMessages = [
  // Finance
  { text: "I need to create a budget for my monthly expenses", expected: "finance" },
  
  // Career
  { text: "Can you help me update my resume?", expected: "career" },
  
  // Wellness
  { text: "I'm feeling stressed and need some relaxation techniques", expected: "wellness" },
  
  // Learning
  { text: "What are some good books on leadership?", expected: "learning" },
  
  // Emergency
  { text: "What should I do if someone is choking?", expected: "emergency" },
  
  // Cooking
  { text: "How do I make pasta carbonara?", expected: "cooking" },
  
  // Fitness
  { text: "What exercises can I do to improve my cardio?", expected: "fitness" }
];

// Run tests
async function runTests() {
  console.log("Testing content categorization across all categories...\n");
  
  let totalTests = 0;
  let passedTests = 0;
  
  for (const test of testMessages) {
    try {
      totalTests++;
      console.log(`Message: "${test.text}"`);
      console.log(`Expected category: ${test.expected}`);
      
      const startTime = Date.now();
      const category = await getContentCategory(test.text);
      const duration = Date.now() - startTime;
      
      console.log(`Actual category: ${category}`);
      console.log(`Time taken: ${duration}ms`);
      
      const passed = category === test.expected;
      if (passed) passedTests++;
      
      console.log(`Result: ${passed ? 'PASS ✅' : 'FAIL ❌'}`);
      console.log('-'.repeat(80));
    } catch (error) {
      console.error(`Error testing message "${test.text}":`, error);
      console.log('FAIL ❌ (error)');
      console.log('-'.repeat(80));
    }
  }
  
  // Print summary
  console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
}

// Execute tests
runTests();