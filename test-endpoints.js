/**
 * Test script to verify content advisory and age verification endpoints
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test content with potentially sensitive topics
const testContent = {
  mentalHealth: "I've been feeling anxious and depressed lately. What are some coping strategies I can use?",
  financialAdvice: "I have $10,000 in credit card debt and I'm thinking about taking out a loan to pay it off. Is this a good idea?",
  medicalInformation: "I've been experiencing chest pain and shortness of breath. What could be causing this?",
  generalContent: "What are some good books to read this summer?"
};

// User registration data with age verification
const registrationData = {
  validAdult: {
    name: "Test Adult",
    email: "test.adult@example.com",
    password: "SecurePassword123!",
    birthYear: 1990,
    privacyConsent: true
  },
  validMinor: {
    name: "Test Minor",
    email: "test.minor@example.com",
    password: "SecurePassword123!",
    birthYear: 2012,
    privacyConsent: true,
    hasParentalConsent: true
  },
  invalidMinor: {
    name: "Invalid Minor",
    email: "invalid.minor@example.com",
    password: "SecurePassword123!",
    birthYear: 2012,
    privacyConsent: true,
    hasParentalConsent: false
  },
  invalidAge: {
    name: "Invalid Age",
    email: "invalid.age@example.com",
    password: "SecurePassword123!",
    birthYear: 2020,
    privacyConsent: true
  }
};

// Test the content advisory middleware
async function testContentAdvisory() {
  console.log('=== Testing Content Advisory Middleware ===');
  
  try {
    // Test endpoint that should trigger content advisory for mental health
    const mentalHealthResponse = await axios.post(`${BASE_URL}/test/content-advisory`, {
      content: testContent.mentalHealth
    });
    
    console.log('Mental Health Content Advisory Test:');
    if (mentalHealthResponse.data._contentAdvisory) {
      console.log('✓ Advisory detected:', mentalHealthResponse.data._contentAdvisory.category);
      console.log('  Severity:', mentalHealthResponse.data._contentAdvisory.severity);
    } else {
      console.log('✗ No advisory detected for mental health content');
    }
    
    // Test endpoint that should trigger content advisory for financial advice
    const financialResponse = await axios.post(`${BASE_URL}/test/content-advisory`, {
      content: testContent.financialAdvice
    });
    
    console.log('\nFinancial Advice Content Advisory Test:');
    if (financialResponse.data._contentAdvisory) {
      console.log('✓ Advisory detected:', financialResponse.data._contentAdvisory.category);
      console.log('  Severity:', financialResponse.data._contentAdvisory.severity);
    } else {
      console.log('✗ No advisory detected for financial advice content');
    }
    
    // Test general content that shouldn't trigger advisory
    const generalResponse = await axios.post(`${BASE_URL}/test/content-advisory`, {
      content: testContent.generalContent
    });
    
    console.log('\nGeneral Content Test:');
    if (generalResponse.data._contentAdvisory) {
      console.log('✗ Advisory incorrectly detected:', generalResponse.data._contentAdvisory.category);
    } else {
      console.log('✓ No advisory detected for general content (expected)');
    }
    
  } catch (error) {
    console.error('Error testing content advisory:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Test the age verification during registration
async function testAgeVerification() {
  console.log('\n=== Testing Age Verification ===');
  
  try {
    // Test valid adult registration
    const adultResponse = await axios.post(`${BASE_URL}/auth/register`, registrationData.validAdult);
    console.log('Valid Adult Registration Test:');
    console.log('✓ Registration successful');
    console.log('  Age verified:', adultResponse.data.ageVerified);
    console.log('  Is minor:', adultResponse.data.isMinor);
    
  } catch (error) {
    if (error.response && error.response.status === 409 && error.response.data.error.includes('already exists')) {
      console.log('Valid Adult Registration Test:');
      console.log('✓ User already exists (expected during testing)');
    } else {
      console.error('Error during adult registration:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  }
  
  try {
    // Test valid minor registration with parental consent
    const minorResponse = await axios.post(`${BASE_URL}/auth/register`, registrationData.validMinor);
    console.log('\nValid Minor Registration Test (with parental consent):');
    console.log('✓ Registration successful');
    console.log('  Age verified:', minorResponse.data.ageVerified);
    console.log('  Is minor:', minorResponse.data.isMinor);
    console.log('  Has parental consent:', minorResponse.data.hasParentalConsent);
    
  } catch (error) {
    if (error.response && error.response.status === 409 && error.response.data.error.includes('already exists')) {
      console.log('\nValid Minor Registration Test (with parental consent):');
      console.log('✓ User already exists (expected during testing)');
    } else {
      console.error('Error during minor registration:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  }
  
  try {
    // Test invalid minor registration without parental consent
    await axios.post(`${BASE_URL}/auth/register`, registrationData.invalidMinor);
    console.log('\nInvalid Minor Registration Test (without parental consent):');
    console.log('✗ Registration successful but should have failed');
    
  } catch (error) {
    if (error.response && (error.response.status === 400 || error.response.status === 403) && 
        (error.response.data.error === 'Age restriction' || 
         error.response.data.code === 'MINOR_WITHOUT_CONSENT')) {
      console.log('\nInvalid Minor Registration Test (without parental consent):');
      console.log('✓ Registration failed as expected');
      console.log('  Error message:', error.response.data.message);
      console.log('  Error code:', error.response.data.code);
    } else {
      console.error('Unexpected error during invalid minor registration:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  }
  
  try {
    // Test invalid age (too young)
    await axios.post(`${BASE_URL}/auth/register`, registrationData.invalidAge);
    console.log('\nInvalid Age Registration Test (too young):');
    console.log('✗ Registration successful but should have failed');
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✓ Registration failed as expected');
      console.log('  Error message:', error.response.data);
    } else {
      console.error('Unexpected error during invalid age registration:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  }
}

// Run the tests
async function runTests() {
  console.log('Starting endpoint tests...\n');
  
  await testContentAdvisory();
  await testAgeVerification();
  
  console.log('\nTests completed.');
}

runTests();