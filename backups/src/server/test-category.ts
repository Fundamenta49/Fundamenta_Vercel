/**
 * A simple test script to verify our content categorization
 * Run with: tsx server/test-category.ts
 */

import { getContentCategory } from './huggingface';

// Sample test messages for different categories
// Focus on the problematic categories first
const testMessages = [
  { text: "I'm feeling stressed and need some relaxation techniques", expected: "wellness" },
  { text: "I'd like to learn about cryptocurrency", expected: "finance" },
  { text: "Teach me about cryptocurrency trading", expected: "finance" },
  { text: "How does Bitcoin work?", expected: "finance" },
  { text: "I need help with mental health and anxiety", expected: "wellness" },
  { text: "What are good meditation practices?", expected: "wellness" },
  { text: "Can you explain Bitcoin investment strategies?", expected: "finance" },
];

// Run tests
async function runTests() {
  console.log("Testing content categorization...\n");
  
  for (const test of testMessages) {
    try {
      console.log(`Message: "${test.text}"`);
      console.log(`Expected category: ${test.expected}`);
      
      const startTime = Date.now();
      const category = await getContentCategory(test.text);
      const duration = Date.now() - startTime;
      
      console.log(`Actual category: ${category}`);
      console.log(`Time taken: ${duration}ms`);
      console.log(`Result: ${category === test.expected ? 'PASS ✅' : 'FAIL ❌'}`);
      console.log('-'.repeat(80));
    } catch (error) {
      console.error(`Error testing message "${test.text}":`, error);
      console.log('FAIL ❌ (error)');
      console.log('-'.repeat(80));
    }
  }
}

// Execute tests
runTests();