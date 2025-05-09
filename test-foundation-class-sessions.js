/**
 * Test script for foundation class sessions API
 */
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';

// Test functions
async function testGetFoundationClassSessions() {
  try {
    console.log('Testing GET /api/foundation-class-sessions');
    
    // Test with /api prefix
    const response = await fetch(`${API_URL}/api/foundation-class-sessions`);
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} foundation class sessions`);
      console.log('First session:', data[0]);
    } else {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      
      // Try without /api prefix
      console.log('Trying without /api prefix');
      const altResponse = await fetch(`${API_URL}/foundation-class-sessions`);
      console.log(`Alternative response status: ${altResponse.status}`);
      
      if (altResponse.ok) {
        const altData = await altResponse.json();
        console.log(`Successfully fetched ${altData.length} foundation class sessions from alternative URL`);
        console.log('First session:', altData[0]);
      } else {
        const altErrorText = await altResponse.text();
        console.error(`Alternative API error (${altResponse.status}): ${altErrorText}`);
      }
    }
  } catch (error) {
    console.error('Error testing GET /api/foundation-class-sessions:', error);
  }
}

// Run tests
async function runTests() {
  try {
    console.log('Running foundation class sessions API tests...');
    
    await testGetFoundationClassSessions();
    
    console.log('Tests completed');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runTests();
