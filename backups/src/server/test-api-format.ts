/**
 * A simple test script to directly test the API formatting
 * Run with: tsx server/test-api-format.ts
 */

import axios from 'axios';

// Get the API key from environment
const apiKey = process.env.HUGGINGFACE_API_KEY;
console.log('HuggingFace API key is', apiKey ? 'set' : 'not set');

// Define our test function
async function testBartLargeMnli() {
  if (!apiKey) {
    console.error('API key is not set. Cannot run test.');
    return;
  }

  try {
    console.log('Making request to facebook/bart-large-mnli model...');
    
    // This is the correct format for the model according to the HuggingFace API docs
    const response = await axios({
      url: 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: "I need to create a budget for my monthly expenses",
        parameters: {
          candidate_labels: [
            'finance', 'career', 'wellness', 'learning', 'emergency', 'cooking', 'fitness', 'general'
          ]
        }
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error in API call:');
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', error.response?.data);
      
      // Show exactly what we sent
      console.error('Request Data:', JSON.stringify(error.config?.data, null, 2));
    } else {
      console.error(error);
    }
  }
}

// Run the test
testBartLargeMnli();