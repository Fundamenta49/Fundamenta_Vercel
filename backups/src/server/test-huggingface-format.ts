/**
 * A simple test script to verify our HuggingFace API integration with the correct format
 * Run with: tsx server/test-huggingface-format.ts
 */

import { textClassifier, getContentCategory, analyzeUserEmotion } from './huggingface';

// Check if the HuggingFace API key is set
console.log('HuggingFace API key is', process.env.HUGGINGFACE_API_KEY ? 'set' : 'not set');

async function testContentCategories() {
  console.log('\n=== Testing Content Category Classification ===');
  
  const testTexts = [
    "I need to create a budget for my monthly expenses",
    "I'm looking for a new job in the tech industry",
    "I've been feeling stressed lately and need some relaxation techniques",
    "Can you recommend some books on JavaScript programming?",
    "I'm having severe chest pain, what should I do?",
    "What's a good recipe for chicken parmesan?",
    "I need a workout routine to build muscle"
  ];
  
  for (const text of testTexts) {
    try {
      console.log(`\nText: "${text}"`);
      const category = await getContentCategory(text);
      console.log(`Categorized as: ${category}`);
    } catch (error) {
      console.error(`Error categorizing text: ${text}`, error);
    }
  }
}

async function testEmotionAnalysis() {
  console.log('\n=== Testing Emotion Analysis ===');
  
  const testTexts = [
    "I'm feeling really happy today!",
    "This makes me so angry and frustrated.",
    "I'm a bit sad and disappointed about the results.",
    "I'm really anxious about my upcoming presentation.",
    "I feel so grateful for all your help."
  ];
  
  for (const text of testTexts) {
    try {
      console.log(`\nText: "${text}"`);
      const emotionResult = await analyzeUserEmotion(text);
      console.log(`Primary emotion: ${emotionResult.primaryEmotion} (score: ${emotionResult.emotionScore.toFixed(4)})`);
      console.log(`All emotions:`, emotionResult.emotions.map(e => `${e.emotion}: ${e.score.toFixed(4)}`).join(', '));
    } catch (error) {
      console.error(`Error analyzing emotion in text: ${text}`, error);
    }
  }
}

async function testCareerClassification() {
  console.log('\n=== Testing Career Content Classification ===');
  
  const testTexts = [
    "I need help with my resume",
    "How do I prepare for a job interview?",
    "What skills should I learn for a career in data science?",
    "How can I network effectively in my industry?",
    "Tips for asking for a promotion"
  ];
  
  for (const text of testTexts) {
    try {
      console.log(`\nText: "${text}"`);
      const results = await textClassifier.classifyCareerContent(text);
      const topResult = results[0];
      console.log(`Top career category: ${topResult.label} (score: ${topResult.score.toFixed(4)})`);
      console.log(`All categories:`, results.map(r => `${r.label}: ${r.score.toFixed(4)}`).join(', '));
    } catch (error) {
      console.error(`Error classifying career content: ${text}`, error);
    }
  }
}

async function testFinancialClassification() {
  console.log('\n=== Testing Financial Content Classification ===');
  
  const testTexts = [
    "I need to save money for retirement",
    "How do I invest in stocks?",
    "I'm trying to get out of credit card debt",
    "What's the best way to budget my monthly expenses?",
    "Should I get life insurance?"
  ];
  
  for (const text of testTexts) {
    try {
      console.log(`\nText: "${text}"`);
      const results = await textClassifier.classifyFinancialContent(text);
      const topResult = results[0];
      console.log(`Top financial category: ${topResult.label} (score: ${topResult.score.toFixed(4)})`);
      console.log(`All categories:`, results.map(r => `${r.label}: ${r.score.toFixed(4)}`).join(', '));
    } catch (error) {
      console.error(`Error classifying financial content: ${text}`, error);
    }
  }
}

async function runTests() {
  try {
    // Only run one test at a time to avoid rate limiting
    await testContentCategories();
    // await testEmotionAnalysis();
    // await testCareerClassification();
    // await testFinancialClassification();
    
    console.log('\nTests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
runTests();